import { NextResponse } from "next/server";

export async function GET() {
  const regions = [
    { id: "ap-southeast-1", name: "Asia Pacific (Singapore)", default: true },
    { id: "us-east-1", name: "US East (N. Virginia)" },
    { id: "us-east-2", name: "US East (Ohio)" },
    { id: "us-west-2", name: "US West (Oregon)" },
    { id: "eu-west-1", name: "Europe (Ireland)" },
    { id: "eu-central-1", name: "Europe (Frankfurt)" },
    { id: "ap-south-1", name: "Asia Pacific (Mumbai)" },
    { id: "ap-northeast-1", name: "Asia Pacific (Tokyo)" },
    { id: "ap-southeast-2", name: "Asia Pacific (Sydney)" },
  ];

  return NextResponse.json({
    regions,
    defaultRegion: process.env.AWS_DEFAULT_REGION || "ap-southeast-1",
  });
}
