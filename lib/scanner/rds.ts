import { RDSClient, DescribeDBInstancesCommand } from "@aws-sdk/client-rds";
import { CompressedResource } from "./types";

export async function scanRDS(region: string, rdsClient?: RDSClient): Promise<CompressedResource[]> {
  try {
    const client = rdsClient || new RDSClient({ region });
    const command = new DescribeDBInstancesCommand({
      MaxRecords: 50,
    });

    const response = await client.send(command);
    const dbInstances = response.DBInstances || [];
    const results: CompressedResource[] = [];

    for (const db of dbInstances) {
      const status = db.DBInstanceStatus || "unknown";
      const name = db.DBInstanceIdentifier || "unknown-rds";
      const tagsMap: Record<string, string> = {};
      db.TagList?.forEach((t) => {
        if (t.Key && t.Value) tagsMap[t.Key] = t.Value;
      });

      const isStopped = status === "stopped";
      const isMultiAz = !!db.MultiAZ;
      const isDevEnv = Boolean(
        tagsMap.Environment?.toLowerCase() === "dev" ||
        tagsMap.Environment?.toLowerCase() === "test" ||
        name.toLowerCase().includes("dev") ||
        name.toLowerCase().includes("test")
      );

      results.push({
        id: db.DBInstanceIdentifier || `rds-${Math.random().toString(36).substring(7)}`,
        name,
        type: "RDSInstance",
        region,
        state: status,
        config: {
          instanceClass: db.DBInstanceClass,
          engine: db.Engine,
          engineVersion: db.EngineVersion,
          allocatedStorageGB: db.AllocatedStorage,
          storageType: db.StorageType,
          multiAz: isMultiAz,
          publiclyAccessible: db.PubliclyAccessible,
        },
        tags: tagsMap,
        flags: {
          isStopped,
          isMultiAzInDev: Boolean(isMultiAz && isDevEnv),
          isHighCostStorage: db.StorageType === "io1" || db.StorageType === "io2",
          recommendServerless: isDevEnv,
        },
      });
    }

    return results;
  } catch (error: any) {
    console.warn(`[RDS Scanner] Warning for region ${region}:`, error?.message || error);
    return [];
  }
}
