import { NextRequest, NextResponse } from "next/server";
import { getScanWithFindings } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ scanId: string }> }
) {
  try {
    const { scanId } = await params;
    if (!scanId) {
      return NextResponse.json({ error: "Missing scanId parameter" }, { status: 400 });
    }

    const scanData = await getScanWithFindings(scanId);
    if (!scanData) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    return NextResponse.json(scanData);
  } catch (error: any) {
    console.error("Fetch scan details error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch scan details" }, { status: 500 });
  }
}
