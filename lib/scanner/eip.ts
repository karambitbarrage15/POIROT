import { EC2Client, DescribeAddressesCommand } from "@aws-sdk/client-ec2";
import { CompressedResource } from "./types";

export async function scanEIPs(region: string, ec2Client?: EC2Client): Promise<CompressedResource[]> {
  try {
    const client = ec2Client || new EC2Client({ region });
    const command = new DescribeAddressesCommand({});
    const response = await client.send(command);
    const addresses = response.Addresses || [];
    const results: CompressedResource[] = [];

    for (const addr of addresses) {
      const isUnassociated = !addr.AssociationId && !addr.InstanceId && !addr.NetworkInterfaceId;
      const nameTag = addr.Tags?.find((t) => t.Key?.toLowerCase() === "name")?.Value || addr.PublicIp;
      const tagsMap: Record<string, string> = {};
      addr.Tags?.forEach((t) => {
        if (t.Key && t.Value) tagsMap[t.Key] = t.Value;
      });

      results.push({
        id: addr.AllocationId || addr.PublicIp || `eip-${Math.random().toString(36).substring(7)}`,
        name: nameTag,
        type: "ElasticIP",
        region,
        state: isUnassociated ? "unassociated" : "associated",
        config: {
          publicIp: addr.PublicIp,
          allocationId: addr.AllocationId,
          domain: addr.Domain,
          instanceId: addr.InstanceId || null,
          networkInterfaceId: addr.NetworkInterfaceId || null,
        },
        tags: tagsMap,
        flags: {
          isOrphaned: isUnassociated,
          isUnassociated,
          incursIdleCharge: isUnassociated,
        },
      });
    }

    return results;
  } catch (error: any) {
    console.warn(`[EIP Scanner] Warning for region ${region}:`, error?.message || error);
    return [];
  }
}
