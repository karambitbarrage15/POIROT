import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { getScansByUserId } from "@/lib/db/queries";
import { db } from "@/lib/db";
import { scans } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    let userScans;

    if (user) {
      userScans = await getScansByUserId(user.userId);
    } else {
      // Fallback: fetch recent scans so unauthenticated exploration works seamlessly
      userScans = await db.select().from(scans).orderBy(desc(scans.createdAt)).limit(20);
    }

    return NextResponse.json({ scans: userScans });
  } catch (error: any) {
    console.error("Fetch history error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch history" }, { status: 500 });
  }
}
