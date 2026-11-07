import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { CompressedResource } from "./types";

export async function scanEC2(region: string, ec2Client?: EC2Client): Promise<CompressedResource[]> {
  try {
    const client = ec2Client || new EC2Client({ region });
    const command = new DescribeInstancesCommand({
      MaxResults: 100,
    });

    const response = await client.send(command);
    const reservations = response.Reservations || [];
    const results: CompressedResource[] = [];

    for (const res of reservations) {
      for (const inst of res.Instances || []) {
        const stateName = inst.State?.Name || "unknown";
        const nameTag = inst.Tags?.find((t) => t.Key?.toLowerCase() === "name")?.Value || inst.InstanceId;
        const tagsMap: Record<string, string> = {};
        inst.Tags?.forEach((t) => {
          if (t.Key && t.Value) tagsMap[t.Key] = t.Value;
        });

        const isStopped = stateName === "stopped";
        const instanceType = inst.InstanceType || "unknown";
        const isOldGen = instanceType.startsWith("t2.") || instanceType.startsWith("m4.") || instanceType.startsWith("c4.");
        const isLarge = instanceType.includes("2xlarge") || instanceType.includes("4xlarge") || instanceType.includes("8xlarge");
        const isDevEnv = Boolean(
          tagsMap.Environment?.toLowerCase() === "dev" ||
          tagsMap.Environment?.toLowerCase() === "development" ||
          tagsMap.Env?.toLowerCase() === "dev" ||
          nameTag?.toLowerCase().includes("dev") ||
          nameTag?.toLowerCase().includes("test")
        );

        results.push({
          id: inst.InstanceId || `i-${Math.random().toString(36).substring(7)}`,
          name: nameTag,
          type: "EC2Instance",
          region,
          state: stateName,
          config: {
            instanceType,
            launchTime: inst.LaunchTime?.toISOString(),
            architecture: inst.Architecture,
            publicIp: inst.PublicIpAddress || null,
            privateIp: inst.PrivateIpAddress || null,
            hasPublicIp: !!inst.PublicIpAddress,
            vpcId: inst.VpcId || null,
          },
          tags: tagsMap,
          flags: {
            isStopped,
            isOldGenInstance: isOldGen,
            isLargeInDev: Boolean(isLarge && isDevEnv),
            hasElasticIPAttached: !!inst.PublicIpAddress && isStopped, // Stopped instance with public IP
            environment: tagsMap.Environment || tagsMap.Env || "unspecified",
          },
        });
      }
    }

    return results;
  } catch (error: any) {
    console.warn(`[EC2 Scanner] Warning for region ${region}:`, error?.message || error);
    return [];
  }
}
