import { EC2Client, DescribeVolumesCommand } from "@aws-sdk/client-ec2";
import { CompressedResource } from "./types";

export async function scanEBS(region: string, ec2Client?: EC2Client): Promise<CompressedResource[]> {
  try {
    const client = ec2Client || new EC2Client({ region });
    const command = new DescribeVolumesCommand({
      MaxResults: 100,
    });

    const response = await client.send(command);
    const volumes = response.Volumes || [];
    const results: CompressedResource[] = [];

    for (const vol of volumes) {
      const attachments = vol.Attachments || [];
      const isDetached = attachments.length === 0 || vol.State === "available";
      const nameTag = vol.Tags?.find((t) => t.Key?.toLowerCase() === "name")?.Value || vol.VolumeId;
      const tagsMap: Record<string, string> = {};
      vol.Tags?.forEach((t) => {
        if (t.Key && t.Value) tagsMap[t.Key] = t.Value;
      });

      const isOldType = vol.VolumeType === "gp2";
      const sizeGB = vol.Size || 0;

      // Only flag if detached or suboptimal
      results.push({
        id: vol.VolumeId || `vol-unknown-${Math.random().toString(36).substring(7)}`,
        name: nameTag,
        type: "EBSVolume",
        region,
        state: vol.State || (isDetached ? "available" : "in-use"),
        config: {
          sizeGB,
          volumeType: vol.VolumeType || "unknown",
          iops: vol.Iops,
          throughput: vol.Throughput,
          encrypted: vol.Encrypted,
          createTime: vol.CreateTime?.toISOString(),
        },
        tags: tagsMap,
        flags: {
          isOrphaned: isDetached,
          isAvailable: vol.State === "available",
          isGp2OldGen: isOldType,
          recommendGp3Migration: isOldType,
        },
      });
    }

    return results;
  } catch (error: any) {
    console.warn(`[EBS Scanner] Warning for region ${region}:`, error?.message || error);
    return [];
  }
}
