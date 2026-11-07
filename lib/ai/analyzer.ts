import { openrouter, AI_MODEL } from "./client";
import { FINOPS_SYSTEM_PROMPT } from "./prompts";
import { ScanResultSchema, type ScanResult } from "./schema";
import { CompressedResource } from "../scanner/types";

export async function analyzeInventoryWithAI(
  resources: CompressedResource[],
  region: string
): Promise<ScanResult> {
  if (resources.length === 0) {
    return {
      executiveSummary: `Scan of region ${region} complete. No active or wasteful AWS resources detected in this scope. Account posture is clean.`,
      totalMonthlyWasteUSD: 0,
      resourcesAnalyzed: 0,
      findings: [],
    };
  }

  const userContent = JSON.stringify(
    {
      targetRegion: region,
      totalCount: resources.length,
      inventory: resources,
    },
    null,
    2
  );

  try {
    const response = await openrouter.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: `${FINOPS_SYSTEM_PROMPT}\n\nStrict JSON Format Example:
{
  "executiveSummary": "...",
  "totalMonthlyWasteUSD": 123.45,
  "resourcesAnalyzed": 10,
  "findings": [
    {
      "resourceId": "vol-12345",
      "resourceName": "unused-vol",
      "resourceType": "EBSVolume",
      "region": "${region}",
      "severity": "HIGH",
      "category": "ORPHANED",
      "issueTitle": "Unattached 500GB EBS volume",
      "explanation": "This volume is in available state and detached from any instance.",
      "estimatedMonthlyWasteUSD": 50.00,
      "remediationCommand": "aws ec2 delete-volume --volume-id vol-12345 --region ${region}",
      "riskAssessment": "Verify snapshot exists before deletion"
    }
  ]
}`,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 4000,
    });

    const rawContent = response.choices[0]?.message?.content || "{}";
    
    // Clean any accidental markdown wrap
    const cleaned = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse JSON from AI response:", cleaned);
      throw new Error("Invalid JSON received from AI reasoning engine");
    }

    const validation = ScanResultSchema.safeParse(parsedJson);
    if (!validation.success) {
      console.warn("Zod validation issues:", validation.error.format());
      // Fallback normalization
      const fallbackObj = parsedJson as any;
      const findingsList = Array.isArray(fallbackObj?.findings) ? fallbackObj.findings : [];
      
      const safeFindings = findingsList.map((f: any) => ({
        resourceId: String(f.resourceId || "unknown-resource"),
        resourceName: f.resourceName ? String(f.resourceName) : undefined,
        resourceType: String(f.resourceType || "EC2Instance"),
        region: String(f.region || region),
        severity: ["CRITICAL", "HIGH", "MEDIUM", "LOW"].includes(f.severity) ? f.severity : "MEDIUM",
        category: ["ORPHANED", "OVERPROVISIONED", "MISCONFIGURED", "LIFECYCLE", "IDLE"].includes(f.category)
          ? f.category
          : "MISCONFIGURED",
        issueTitle: String(f.issueTitle || "Detected Cloud Waste"),
        explanation: String(f.explanation || "Resource detected with suboptimal cost configuration."),
        estimatedMonthlyWasteUSD: Number(f.estimatedMonthlyWasteUSD) || 0,
        remediationCommand: String(f.remediationCommand || `# Inspect ${f.resourceId}`),
        riskAssessment: String(f.riskAssessment || "Review with system owner before terminating"),
      }));

      const sumWaste = safeFindings.reduce((acc: number, cur: any) => acc + (cur.estimatedMonthlyWasteUSD || 0), 0);

      return {
        executiveSummary: String(
          fallbackObj?.executiveSummary ||
            `Audit identified ${safeFindings.length} cost optimization opportunities in ${region}.`
        ),
        totalMonthlyWasteUSD: Number(fallbackObj?.totalMonthlyWasteUSD) || sumWaste,
        resourcesAnalyzed: resources.length,
        findings: safeFindings,
      };
    }

    return validation.data;
  } catch (error: any) {
    console.error("[AI Analyzer Error]:", error?.message || error);
    // Graceful fallback to static rule analyzer if AI API encounters rate limit or network error
    return generateRuleBasedAnalysis(resources, region);
  }
}

// Fallback rule engine ensuring user ALWAYS gets high-value findings even if external AI API fails
function generateRuleBasedAnalysis(resources: CompressedResource[], region: string): ScanResult {
  const findings: any[] = [];
  let totalWaste = 0;

  for (const r of resources) {
    if (r.type === "EBSVolume" && r.flags.isOrphaned) {
      const size = Number((r.config as any).sizeGB) || 100;
      const waste = Math.round(size * 0.1);
      totalWaste += waste;
      findings.push({
        resourceId: r.id,
        resourceName: r.name,
        resourceType: "EBSVolume",
        region,
        severity: size > 250 ? "HIGH" : "MEDIUM",
        category: "ORPHANED",
        issueTitle: `Detached EBS volume (${size} GB)`,
        explanation: `Volume is in 'available' state and not attached to any EC2 instance, accumulating daily storage fees.`,
        estimatedMonthlyWasteUSD: waste,
        remediationCommand: `aws ec2 delete-volume --volume-id ${r.id} --region ${region}`,
        riskAssessment: `Ensure data snapshot exists before deleting this volume.`,
      });
    } else if (r.type === "ElasticIP" && r.flags.isUnassociated) {
      totalWaste += 3.65;
      findings.push({
        resourceId: r.id,
        resourceName: r.name,
        resourceType: "ElasticIP",
        region,
        severity: "MEDIUM",
        category: "ORPHANED",
        issueTitle: `Unassociated Elastic IP (${(r.config as any).publicIp || r.id})`,
        explanation: `AWS charges $0.005/hr (~$3.65/mo) for each Elastic IP not attached to a running instance.`,
        estimatedMonthlyWasteUSD: 3.65,
        remediationCommand: `aws ec2 release-address --allocation-id ${r.id} --region ${region}`,
        riskAssessment: `Confirm DNS records or external webhooks do not reference this IP address.`,
      });
    } else if (r.type === "EC2Instance" && r.flags.isStopped && r.flags.hasElasticIPAttached) {
      totalWaste += 3.65;
      findings.push({
        resourceId: r.id,
        resourceName: r.name,
        resourceType: "EC2Instance",
        region,
        severity: "MEDIUM",
        category: "IDLE",
        issueTitle: `Stopped EC2 instance holding Elastic IP`,
        explanation: `Instance is stopped but continues to hold an allocated Public/Elastic IP, accruing idle address penalties.`,
        estimatedMonthlyWasteUSD: 3.65,
        remediationCommand: `aws ec2 disassociate-address --public-ip ${(r.config as any).publicIp} --region ${region}`,
        riskAssessment: `Verify if this IP is required upon restarting the instance.`,
      });
    } else if (r.type === "RDSInstance" && r.flags.isMultiAzInDev) {
      totalWaste += 120;
      findings.push({
        resourceId: r.id,
        resourceName: r.name,
        resourceType: "RDSInstance",
        region,
        severity: "HIGH",
        category: "OVERPROVISIONED",
        issueTitle: `Multi-AZ deployment on non-production database`,
        explanation: `Database has Multi-AZ standby replica active in a development/test environment, doubling hosting and storage costs.`,
        estimatedMonthlyWasteUSD: 120,
        remediationCommand: `aws rds modify-db-instance --db-instance-identifier ${r.id} --no-multi-az --apply-immediately --region ${region}`,
        riskAssessment: `Brief failover maintenance window required when converting to Single-AZ.`,
      });
    } else if (r.type === "S3Bucket" && r.flags.missingLifecyclePolicy) {
      totalWaste += 25;
      findings.push({
        resourceId: r.id,
        resourceName: r.name,
        resourceType: "S3Bucket",
        region,
        severity: "LOW",
        category: "LIFECYCLE",
        issueTitle: `Missing S3 Lifecycle transition / expiration rules`,
        explanation: `Bucket stores objects indefinitely without automatic transition to Glacier or expiration of outdated non-current versions.`,
        estimatedMonthlyWasteUSD: 25,
        remediationCommand: `aws s3api put-bucket-lifecycle-configuration --bucket ${r.id} --lifecycle-configuration file://lifecycle.json`,
        riskAssessment: `Determine compliance retention requirements prior to enabling automatic expiration.`,
      });
    } else if (r.type === "LoadBalancer" && r.flags.isOrphaned) {
      totalWaste += 22.50;
      findings.push({
        resourceId: r.id,
        resourceName: r.name,
        resourceType: "LoadBalancer",
        region,
        severity: "HIGH",
        category: "ORPHANED",
        issueTitle: `Active Load Balancer with zero backend targets`,
        explanation: `Application Load Balancer is provisioned and active, but has no healthy target EC2/ECS instances, generating ~$22.50/mo in idle fixed fees.`,
        estimatedMonthlyWasteUSD: 22.50,
        remediationCommand: `aws elbv2 delete-load-balancer --load-balancer-arn ${r.id} --region ${region}`,
        riskAssessment: `Verify that no DNS records or Ingress controllers are routing production traffic to this endpoint.`,
      });
    }
  }

  return {
    executiveSummary: `Automated FinOps analysis identified ${findings.length} immediate cost leaks across ${resources.length} scanned resources in ${region}, totaling an estimated $${totalWaste.toFixed(2)} / month in potential savings.`,
    totalMonthlyWasteUSD: totalWaste,
    resourcesAnalyzed: resources.length,
    findings,
  };
}
