import { CompressedResource } from "./types";
import { scanEC2 } from "./ec2";
import { scanEBS } from "./ebs";
import { scanEIPs } from "./eip";
import { scanRDS } from "./rds";
import { scanS3 } from "./s3";
import { scanLoadBalancers } from "./elb";

export async function runAllScanners(
  region: string,
  options?: { allowMockFallbackIfEmpty?: boolean }
): Promise<{ resources: CompressedResource[]; errors: string[]; isFallbackDemo: boolean }> {
  const errors: string[] = [];
  const allResources: CompressedResource[] = [];
  let isFallbackDemo = false;

  const results = await Promise.allSettled([
    scanEC2(region),
    scanEBS(region),
    scanEIPs(region),
    scanRDS(region),
    scanS3(region),
    scanLoadBalancers(region),
  ]);

  const serviceNames = ["EC2", "EBS", "ElasticIPs", "RDS", "S3", "ELB"];

  results.forEach((res, index) => {
    if (res.status === "fulfilled") {
      allResources.push(...res.value);
    } else {
      const errMessage = `${serviceNames[index]}: ${res.reason?.message || "Unknown error"}`;
      console.warn(`[Scanner error] ${errMessage}`);
      errors.push(errMessage);
    }
  });

  // If real AWS scan returned 0 resources (e.g. fresh empty AWS account) and mock fallback is allowed
  if (allResources.length === 0 && options?.allowMockFallbackIfEmpty) {
    isFallbackDemo = true;
    allResources.push(...getDemoResources(region));
  }

  // Safety sort & truncation: prioritize suspicious resources with active flags
  const sorted = allResources.sort((a, b) => {
    const aFlagsCount = Object.keys(a.flags).filter((k) => !!a.flags[k]).length;
    const bFlagsCount = Object.keys(b.flags).filter((k) => !!b.flags[k]).length;
    return bFlagsCount - aFlagsCount;
  });

  return { resources: sorted.slice(0, 100), errors, isFallbackDemo };
}

export function getDemoResources(region: string): CompressedResource[] {
  return [
    {
      id: "vol-0a9182bc34de5678f",
      name: "dev-analytics-scratch-disk (SIMULATED)",
      type: "EBSVolume",
      region,
      state: "available",
      config: { sizeGB: 500, volumeType: "gp2", iops: 1500 },
      tags: { Environment: "dev", Project: "DataLakeMigration", Note: "Simulated Demo Resource" },
      flags: { isOrphaned: true, isGp2OldGen: true, recommendGp3Migration: true },
    },
    {
      id: "eipalloc-071a99f123456789a",
      name: "staging-nat-public-ip (SIMULATED)",
      type: "ElasticIP",
      region,
      state: "unassociated",
      config: { publicIp: "54.254.120.45" },
      tags: { Environment: "staging", Note: "Simulated Demo Resource" },
      flags: { isOrphaned: true, isUnassociated: true, incursIdleCharge: true },
    },
    {
      id: "i-09f87e6d5c4b3a210",
      name: "legacy-reporting-service (SIMULATED)",
      type: "EC2Instance",
      region,
      state: "stopped",
      config: { instanceType: "m5.4xlarge", architecture: "x86_64", publicIp: "54.251.10.88" },
      tags: { Environment: "dev", Owner: "bi-team", Note: "Simulated Demo Resource" },
      flags: { isStopped: true, isLargeInDev: true, hasElasticIPAttached: true },
    },
    {
      id: "rds-staging-postgres-v1",
      name: "staging-db-cluster (SIMULATED)",
      type: "RDSInstance",
      region,
      state: "available",
      config: { instanceClass: "db.r5.2xlarge", engine: "postgres", multiAz: true, storageType: "io1" },
      tags: { Environment: "staging", Department: "QA", Note: "Simulated Demo Resource" },
      flags: { isMultiAzInDev: true, isHighCostStorage: true, recommendServerless: true },
    },
    {
      id: "corp-internal-audit-temp-logs",
      name: "corp-internal-audit-temp-logs (SIMULATED)",
      type: "S3Bucket",
      region,
      state: "active",
      config: { hasLifecyclePolicy: false },
      tags: { Team: "Security", Note: "Simulated Demo Resource" },
      flags: { missingLifecyclePolicy: true, riskOfUnboundedStorageGrowth: true },
    },
    {
      id: "alb-dev-k8s-ingress-orphaned",
      name: "dev-k8s-ingress-alb (SIMULATED)",
      type: "LoadBalancer",
      region,
      state: "active",
      config: { type: "application", scheme: "internet-facing", targetCount: 0, hasHealthyBackends: false },
      tags: { Environment: "dev", Note: "Simulated Demo Resource" },
      flags: { isOrphaned: true, hasZeroTargets: true, incursIdleCharge: true },
    },
  ];
}
