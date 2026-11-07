import { db } from "./index";
import { users, scans, findings, type NewUser, type NewScan, type NewFinding } from "./schema";
import { eq, desc } from "drizzle-orm";

export async function getUserByEmail(email: string) {
  try {
    const results = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return results[0] || null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const results = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return results[0] || null;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    return null;
  }
}

export async function createUser(data: NewUser) {
  const results = await db.insert(users).values(data).returning();
  return results[0];
}

export async function createScan(data: NewScan) {
  const results = await db.insert(scans).values(data).returning();
  return results[0];
}

export async function updateScan(
  id: string,
  data: Partial<Omit<NewScan, "id" | "userId">>
) {
  const results = await db
    .update(scans)
    .set(data)
    .where(eq(scans.id, id))
    .returning();
  return results[0];
}

export async function insertFindings(data: NewFinding[]) {
  if (!data || data.length === 0) return [];
  const results = await db.insert(findings).values(data).returning();
  return results;
}

export async function getScansByUserId(userId: string) {
  return await db
    .select()
    .from(scans)
    .where(eq(scans.userId, userId))
    .orderBy(desc(scans.createdAt));
}

export async function getScanWithFindings(scanId: string) {
  const scanResults = await db.select().from(scans).where(eq(scans.id, scanId)).limit(1);
  const scan = scanResults[0] || null;
  if (!scan) return null;

  const findingResults = await db
    .select()
    .from(findings)
    .where(eq(findings.scanId, scanId))
    .orderBy(desc(findings.estimatedMonthlyWasteUsd));

  return {
    ...scan,
    findings: findingResults,
  };
}
