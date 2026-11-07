import { S3Client, ListBucketsCommand, GetBucketLifecycleConfigurationCommand } from "@aws-sdk/client-s3";
import { CompressedResource } from "./types";

export async function scanS3(region: string, s3Client?: S3Client): Promise<CompressedResource[]> {
  try {
    const client = s3Client || new S3Client({ region });
    const listCommand = new ListBucketsCommand({});
    const response = await client.send(listCommand);
    const buckets = response.Buckets || [];
    const results: CompressedResource[] = [];

    // Inspect up to 20 buckets to respect rate limits & token budget
    for (const b of buckets.slice(0, 20)) {
      const bucketName = b.Name;
      if (!bucketName) continue;

      let hasLifecycle = false;
      try {
        const lcCommand = new GetBucketLifecycleConfigurationCommand({ Bucket: bucketName });
        const lcResponse = await client.send(lcCommand);
        hasLifecycle = (lcResponse.Rules && lcResponse.Rules.length > 0) || false;
      } catch (err: any) {
        // NoSuchLifecycleConfiguration is expected when no rule exists
        hasLifecycle = false;
      }

      results.push({
        id: bucketName,
        name: bucketName,
        type: "S3Bucket",
        region,
        state: "active",
        config: {
          creationDate: b.CreationDate?.toISOString(),
          hasLifecyclePolicy: hasLifecycle,
        },
        tags: {},
        flags: {
          missingLifecyclePolicy: !hasLifecycle,
          riskOfUnboundedStorageGrowth: !hasLifecycle,
        },
      });
    }

    return results;
  } catch (error: any) {
    console.warn(`[S3 Scanner] Warning for region ${region}:`, error?.message || error);
    return [];
  }
}
