import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { runAllScanners } from "@/lib/scanner";
import { analyzeInventoryWithAI } from "@/lib/ai/analyzer";
import { createScan, updateScan, insertFindings, getUserByEmail, createUser } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region") || process.env.AWS_DEFAULT_REGION || "ap-southeast-1";
  const allowMock = searchParams.get("mock") !== "false";

  // Resolve user
  let user = await getUserFromRequest(req);
  let isGuest = false;
  if (!user) {
    isGuest = true;
    let demoUser = await getUserByEmail("guest@poirot.ai");
    if (!demoUser) {
      demoUser = await createUser({
        email: "guest@poirot.ai",
        name: "Guest Investigator",
        passwordHash: "demo-hash-not-used",
      });
    }
    user = {
      userId: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
    };
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, payload: Record<string, unknown>) => {
        const message = `data: ${JSON.stringify({ event, payload })}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      let scanId: string | null = null;

      try {
        // Step 1: INIT
        sendEvent("INIT", {
          step: 1,
          totalSteps: 4,
          message: `Authenticating AWS credentials for region ${region}...`,
          isGuest,
        });

        // Initialize scan in database
        try {
          const scanRecord = await createScan({
            userId: user.userId,
            awsRegion: region,
            status: "scanning",
            resourcesScanned: 0,
            findingsCount: 0,
            totalMonthlyWasteUsd: "0.00",
          });
          scanId = scanRecord.id;
        } catch (dbErr: any) {
          console.warn("DB init scan warning:", dbErr?.message);
        }

        await new Promise((r) => setTimeout(r, 500));

        // Step 2: SCANNING
        sendEvent("SCANNING", {
          step: 2,
          totalSteps: 4,
          message: `Inspecting active AWS resources in ${region}...`,
        });

        const { resources, errors, isFallbackDemo } = await runAllScanners(region, {
          allowMockFallbackIfEmpty: allowMock,
        });

        sendEvent("SCANNING_PROGRESS", {
          step: 2,
          totalSteps: 4,
          message: isFallbackDemo
            ? `AWS returned 0 resources in ${region}. Loaded 5 simulated FinOps test resources for demonstration.`
            : `Scanned and minified ${resources.length} active AWS resources in ${region}.`,
          count: resources.length,
          isFallbackDemo,
          warnings: errors.length > 0 ? errors : undefined,
        });

        await new Promise((r) => setTimeout(r, 600));

        // Step 3: ANALYZING WITH AI
        sendEvent("ANALYZING", {
          step: 3,
          totalSteps: 4,
          message: `Dispatching ${resources.length} resources to OpenRouter Meta Llama 3.3 70B...`,
          isFallbackDemo,
        });

        const analysis = await analyzeInventoryWithAI(resources, region);

        // Step 4: STORING IN DATABASE
        sendEvent("STORING", {
          step: 4,
          totalSteps: 4,
          message: `Saving audit report to Neon PostgreSQL...`,
        });

        const executiveSummaryWithTag = isFallbackDemo
          ? `[SIMULATED DEMO AUDIT] Your AWS account in ${region} currently has 0 active resources. Showing simulated FinOps waste data for demonstration: ${analysis.executiveSummary}`
          : analysis.executiveSummary;

        if (scanId) {
          try {
            await updateScan(scanId, {
              status: "complete",
              resourcesScanned: analysis.resourcesAnalyzed,
              findingsCount: analysis.findings.length,
              totalMonthlyWasteUsd: analysis.totalMonthlyWasteUSD.toFixed(2),
              executiveSummary: executiveSummaryWithTag,
              completedAt: new Date(),
            });

            if (analysis.findings.length > 0) {
              const findingsToInsert = analysis.findings.map((f) => ({
                scanId: scanId!,
                resourceId: f.resourceId,
                resourceName: f.resourceName || null,
                resourceType: f.resourceType,
                region: f.region,
                severity: f.severity,
                category: f.category,
                issueTitle: f.issueTitle,
                explanation: f.explanation,
                estimatedMonthlyWasteUsd: f.estimatedMonthlyWasteUSD.toFixed(2),
                remediationCommand: f.remediationCommand,
                riskAssessment: f.riskAssessment,
              }));

              await insertFindings(findingsToInsert);
            }
          } catch (dbSaveErr: any) {
            console.error("Failed to save findings to DB:", dbSaveErr);
          }
        }

        // COMPLETE
        sendEvent("COMPLETE", {
          step: 4,
          totalSteps: 4,
          message: `Audit complete. Found $${analysis.totalMonthlyWasteUSD.toFixed(2)}/mo in potential savings!`,
          scanId,
          isFallbackDemo,
          summary: {
            resourcesScanned: analysis.resourcesAnalyzed,
            findingsCount: analysis.findings.length,
            totalMonthlyWasteUSD: analysis.totalMonthlyWasteUSD,
            executiveSummary: executiveSummaryWithTag,
          },
        });
      } catch (err: any) {
        console.error("SSE Scan error:", err);
        sendEvent("ERROR", {
          step: 4,
          totalSteps: 4,
          message: err?.message || "An error occurred during cloud cost scan",
        });
        if (scanId) {
          try {
            await updateScan(scanId, {
              status: "failed",
              errorMessage: err?.message || "Unknown scan error",
            });
          } catch (_) {}
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
