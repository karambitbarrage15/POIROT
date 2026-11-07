import { z } from "zod";

export const FindingSchema = z.object({
  resourceId: z.string().describe("AWS Resource identifier"),
  resourceName: z.string().optional().describe("Tag or human-friendly name"),
  resourceType: z.string().describe("EC2Instance, EBSVolume, ElasticIP, RDSInstance, S3Bucket"),
  region: z.string().describe("AWS region, e.g. ap-southeast-1 or us-east-1"),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).describe("Urgency of remediation"),
  category: z
    .enum(["ORPHANED", "OVERPROVISIONED", "MISCONFIGURED", "LIFECYCLE", "IDLE"])
    .describe("FinOps cost anomaly classification"),
  issueTitle: z.string().describe("Concise headline of the problem"),
  explanation: z.string().describe("Detailed architectural explanation of why this is wasteful"),
  estimatedMonthlyWasteUSD: z.number().describe("Realistic estimated monthly waste in USD"),
  remediationCommand: z
    .string()
    .describe("Exact, runnable AWS CLI command to fix or delete the waste"),
  riskAssessment: z
    .string()
    .describe("Safety checklist or validation steps before executing deletion/downscaling"),
});

export const ScanResultSchema = z.object({
  executiveSummary: z
    .string()
    .describe("Executive summary of the cloud audit, overall posture, and top priorities"),
  totalMonthlyWasteUSD: z
    .number()
    .describe("Calculated sum of all monthly waste across all findings"),
  resourcesAnalyzed: z.number().describe("Total number of resources inspected"),
  findings: z.array(FindingSchema),
});

export type FindingResult = z.infer<typeof FindingSchema>;
export type ScanResult = z.infer<typeof ScanResultSchema>;
