export type ResourceType =
  | "EC2Instance"
  | "EBSVolume"
  | "ElasticIP"
  | "RDSInstance"
  | "S3Bucket"
  | "Snapshot"
  | "LoadBalancer";

export interface CompressedResource {
  id: string;
  name?: string;
  type: ResourceType;
  region: string;
  state: string;
  config: Record<string, unknown>;
  tags: Record<string, string>;
  flags: Record<string, boolean | number | string | undefined | null>;
}

export interface ScanProgressEvent {
  step: number;
  totalSteps: number;
  stage: "INIT" | "SCANNING" | "ANALYZING" | "STORING" | "COMPLETE" | "ERROR";
  message: string;
  count?: number;
  data?: unknown;
}
