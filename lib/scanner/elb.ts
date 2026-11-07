import {
  ElasticLoadBalancingV2Client,
  DescribeLoadBalancersCommand,
  DescribeTargetGroupsCommand,
  DescribeTargetHealthCommand,
} from "@aws-sdk/client-elastic-load-balancing-v2";
import { CompressedResource } from "./types";

export async function scanLoadBalancers(region: string): Promise<CompressedResource[]> {
  const client = new ElasticLoadBalancingV2Client({ region });
  const resources: CompressedResource[] = [];

  try {
    const lbResponse = await client.send(new DescribeLoadBalancersCommand({}));
    const loadBalancers = lbResponse.LoadBalancers || [];

    for (const lb of loadBalancers) {
      const arn = lb.LoadBalancerArn || "";
      const lbName = lb.LoadBalancerName || arn;

      // Check target groups attached to this load balancer
      let hasHealthyBackends = false;
      let targetCount = 0;

      try {
        const tgResponse = await client.send(
          new DescribeTargetGroupsCommand({ LoadBalancerArn: arn })
        );
        const targetGroups = tgResponse.TargetGroups || [];

        for (const tg of targetGroups) {
          if (!tg.TargetGroupArn) continue;
          try {
            const healthResponse = await client.send(
              new DescribeTargetHealthCommand({ TargetGroupArn: tg.TargetGroupArn })
            );
            const targets = healthResponse.TargetHealthDescriptions || [];
            targetCount += targets.length;
            if (targets.some((t) => t.TargetHealth?.State === "healthy")) {
              hasHealthyBackends = true;
            }
          } catch (_) {
            // Target health check failed or not permitted
          }
        }
      } catch (_) {
        // Failed describing target groups
      }

      const isOrphaned = !hasHealthyBackends || targetCount === 0;

      resources.push({
        id: lbName,
        name: lbName,
        type: "LoadBalancer",
        region,
        state: lb.State?.Code || "active",
        config: {
          type: lb.Type,
          scheme: lb.Scheme,
          dnsName: lb.DNSName,
          targetCount,
          hasHealthyBackends,
        },
        tags: {},
        flags: {
          isOrphaned,
          hasZeroTargets: targetCount === 0,
          incursIdleCharge: isOrphaned,
        },
      });
    }
  } catch (error: any) {
    console.warn(`[ELB Scanner Error in ${region}]:`, error?.message || error);
    // Don't throw if permission denied or no ELB resources; return whatever was collected
  }

  return resources;
}
