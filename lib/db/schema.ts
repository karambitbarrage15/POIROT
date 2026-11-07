import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scans = pgTable("scans", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  awsRegion: varchar("aws_region", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending | scanning | analyzing | complete | failed
  resourcesScanned: integer("resources_scanned").default(0).notNull(),
  findingsCount: integer("findings_count").default(0).notNull(),
  totalMonthlyWasteUsd: decimal("total_monthly_waste_usd", {
    precision: 10,
    scale: 2,
  })
    .default("0.00")
    .notNull(),
  executiveSummary: text("executive_summary"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const findings = pgTable("findings", {
  id: uuid("id").defaultRandom().primaryKey(),
  scanId: uuid("scan_id")
    .references(() => scans.id, { onDelete: "cascade" })
    .notNull(),
  resourceId: varchar("resource_id", { length: 255 }).notNull(),
  resourceName: varchar("resource_name", { length: 255 }),
  resourceType: varchar("resource_type", { length: 100 }).notNull(),
  region: varchar("region", { length: 50 }).notNull(),
  severity: varchar("severity", { length: 20 }).notNull(), // CRITICAL | HIGH | MEDIUM | LOW
  category: varchar("category", { length: 30 }).notNull(), // ORPHANED | OVERPROVISIONED | MISCONFIGURED | LIFECYCLE | IDLE
  issueTitle: text("issue_title").notNull(),
  explanation: text("explanation").notNull(),
  estimatedMonthlyWasteUsd: decimal("estimated_monthly_waste_usd", {
    precision: 10,
    scale: 2,
  })
    .default("0.00")
    .notNull(),
  remediationCommand: text("remediation_command"),
  riskAssessment: text("risk_assessment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  scans: many(scans),
}));

export const scansRelations = relations(scans, ({ one, many }) => ({
  user: one(users, {
    fields: [scans.userId],
    references: [users.id],
  }),
  findings: many(findings),
}));

export const findingsRelations = relations(findings, ({ one }) => ({
  scan: one(scans, {
    fields: [findings.scanId],
    references: [scans.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Scan = typeof scans.$inferSelect;
export type NewScan = typeof scans.$inferInsert;
export type Finding = typeof findings.$inferSelect;
export type NewFinding = typeof findings.$inferInsert;
