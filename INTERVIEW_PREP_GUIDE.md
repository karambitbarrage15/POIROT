# POIROT — Senior Engineering Interview Master Guide
> **Autonomous Developer-First AI Cloud Cost Detective**  
> **Production URL**: [https://poirot-nu.vercel.app](https://poirot-nu.vercel.app)  
> **GitHub Repository**: [https://github.com/karambitbarrage15/POIROT](https://github.com/karambitbarrage15/POIROT)  
> **Core Stack**: Next.js 15 (App Router), TypeScript, AWS SDK v3, OpenRouter (Meta Llama 3.3 70B), Neon Serverless PostgreSQL, Drizzle ORM, Tailwind CSS, Server-Sent Events (SSE).

---

## 1. The 60-Second Elevator Pitch
> *"Tell me about POIROT: what is it, why did you build it, and what problem does it solve?"*

**Word-for-Word Delivery:**
> "POIROT is an autonomous, developer-first AI Cloud FinOps Detective. In modern cloud setups, engineering teams typically waste 30% to 35% of their AWS monthly budget on 'zombie infrastructure'—unattached EBS storage volumes, idle Elastic IPs, non-production Multi-AZ databases, and outdated storage tiers.
>
> Traditional tools like AWS Cost Explorer are **lagging indicators**; they only report aggregate dollars days after you have already incurred the charges. POIROT, by contrast, is a **real-time architectural inspector**. It connects via strict read-only IAM credentials, scans 6 AWS resource subsystems simultaneously in parallel using AWS SDK v3, compresses raw AWS telemetry by 88% into lean heuristic payloads, and streams it to a fine-tuned reasoning engine (Meta Llama 3.3 70B via OpenRouter).
>
> The AI calculates accurate monthly waste in USD and generates copy-pasteable, verified AWS CLI remediation commands with risk checklists. I built it with Next.js 15 App Router, TypeScript, Server-Sent Events for real-time progress streaming, Drizzle ORM, and Neon Serverless PostgreSQL, and deployed it on Vercel."

---

## 2. Why Existing Tools Fail (The Market Gap)

| Dimension | AWS Cost Explorer | Enterprise APM (Datadog / CloudHealth) | **POIROT** |
| :--- | :--- | :--- | :--- |
| **Data Latency** | 24–48 hour billing data delay | 1–4 hour polling cycle | **Real-time live infrastructure state** |
| **Analysis Depth** | Dollar aggregations, zero resource state context | Rigid threshold alerts (`if metric > X`) | **Multi-resource cross-referencing AI reasoning** |
| **Actionability** | Vague graphs; no fix scripts | Sends email/Slack alerts | **Exact copy-paste AWS CLI fix scripts with rollback steps** |
| **Permissions** | Requires AWS console access | Often demands dangerous write IAM access | **100% Read-Only (`Describe*` / `List*`)** |
| **Cost** | Additional API request fees | Thousands of dollars/month seat licensing | **Zero-cost open inference & serverless tier** |

---

## 3. Architecture & Tech Stack Justifications

### 1. Next.js 15 (App Router) + TypeScript
- **Why**: Unifies the backend API routes, Server-Sent Events (SSE) streaming, server components, and client-side reactive UI in a single type-safe codebase.
- **Benefit**: Zero context switching, end-to-end type safety from AWS SDK responses to database records and UI cards.

### 2. AWS SDK v3 (Modular Clients)
- **Why**: SDK v3 (`@aws-sdk/client-ec2`, `@aws-sdk/client-rds`, `@aws-sdk/client-s3`, `@aws-sdk/client-elastic-load-balancing-v2`) is fully modular and tree-shakable.
- **Benefit**: Unlike SDK v2, which bloated function bundles with the entire AWS surface area, v3 imports only the exact clients needed, keeping serverless cold starts well under 200ms.

### 3. AI Reasoning: Meta Llama 3.3 70B via OpenRouter
- **Why**: Llama 3.3 70B provides GPT-4o-level structured JSON reasoning at zero or negligible inference cost, with a 128k context window.
- **Why not simple if/else scripts?**: Rule-based scripts cannot synthesize multi-resource intent (e.g. cross-referencing a stopped EC2 instance with an unmanaged snapshot, an allocated EIP fee, and an environment tag of `"dev"` vs `"production"`).

### 4. Streaming: Server-Sent Events (SSE) over WebSockets
- **Why SSE?**: 
  1. The communication is unidirectional (server pushing live audit progression to client). WebSockets require duplex connection handshakes and dedicated stateful servers, breaking serverless architectures.
  2. SSE runs natively over HTTP/2, auto-reconnects, passes effortlessly through enterprise firewalls, and works out-of-the-box on Vercel serverless edge routes.

### 5. Database: Neon Serverless PostgreSQL + Drizzle ORM
- **Why Neon**: True serverless PostgreSQL that separates compute from storage, scales to zero when idle, and connects instantly over HTTP/WebSockets via connection pooling.
- **Why Drizzle ORM**: Zero runtime overhead, lightweight SQL-like syntax, and type safety with auto-migrated schema definitions.

---

## 4. End-to-End System Flow (The Lifecycle)

```
[ User UI ] 
    │  (1) Triggers Scan (/dashboard?region=ap-southeast-1)
    ▼
[ SSE Route: /api/scan/stream ] ─── Authenticates User via JWT
    │
    │  (2) Parallel AWS Inspection
    ├──> ec2:DescribeInstances
    ├──> ec2:DescribeVolumes (EBS)
    ├──> ec2:DescribeAddresses (EIP)
    ├──> rds:DescribeDBInstances
    ├──> s3:ListBuckets / GetBucketLifecycleConfiguration
    └──> elb:DescribeLoadBalancers / DescribeTargetHealth
    │
    │  (3) Heuristic Compression & Flagging
    │      - Strips 88% AWS metadata bloat
    │      - Tags flags: isOrphaned, isStopped, isGp2OldGen, hasEIP
    │
    │  (4) LLM Reasoning (OpenRouter / Llama 3.3 70B)
    │      - System prompt injects 2026 AWS pricing baselines
    │      - Strict JSON mode schema enforcement
    │
    │  (5) Database Persistence
    │      - Inserts scan metadata into 'scans' table
    │      - Bulk inserts findings into 'findings' table
    │
    ▼
[ Client UI ] ─── Live progress steps render ──> Navigates to /report/[scanId]
```

---

## 5. Core Technical Innovations

### A. The 88% Token Compression Engine (`lib/scanner/`)
Raw AWS API responses return hundreds of irrelevant fields per resource (network interfaces, block device mappings, reservation IDs, hypervisor details, monitoring states).
- **The Problem**: Sending raw JSON for 50 resources would consume 25,000+ tokens, causing prompt timeouts, high latency, and hallucinated calculations.
- **The Solution**: Created a compression pipeline that strips all AWS noise into a typed `CompressedResource`:
  ```typescript
  {
    id: "vol-0a9182bc34de5678f",
    name: "dev-analytics-scratch-disk",
    type: "EBSVolume",
    region: "ap-southeast-1",
    state: "available",
    config: { sizeGB: 500, volumeType: "gp2", iops: 1500 },
    tags: { Environment: "dev", Project: "DataLakeMigration" },
    flags: { isOrphaned: true, isGp2OldGen: true, recommendGp3Migration: true }
  }
  ```
- **Impact**: Reduces token usage from ~600 tokens/resource to ~70 tokens/resource (**~88% compression**), allowing up to 100 resources to fit within a fast, single-turn LLM inference.

### B. 100% Read-Only IAM Security Posture
- Enterprise security teams reject any third-party tool requiring `ec2:DeleteVolume` or `ec2:StopInstances`.
- POIROT adheres strictly to the **Principle of Least Privilege**:
  - Permissions required: `ec2:Describe*`, `rds:Describe*`, `s3:List*`, `elasticloadbalancing:Describe*`.
  - Zero write, delete, or modify actions are permitted.
  - The tool outputs verified AWS CLI commands, keeping the human DevOps engineer in full control.

### C. Self-Healing JSON Schema Validator (`lib/ai/analyzer.ts`)
- LLMs can occasionally return markdown fences (` ```json `) or trailing commas that break `JSON.parse`.
- You implemented a multi-stage sanitizer:
  1. Regex removal of markdown wrappers (`/```json\n([\s\S]*?)\n```/`).
  2. Zod schema validation against `ScanResultSchema`.
  3. A deterministic rule-based calculation fallback if the LLM output is malformed, ensuring the scan pipeline never crashes for the user.

---

## 6. Database Schema Design (`lib/db/schema.ts`)

- **`users` table**: Stores UUID, email, password hash, created_at.
- **`scans` table**:
  - Tracks `aws_region`, `status` (`pending` | `scanning` | `analyzing` | `complete` | `failed`), `resources_scanned`, `findings_count`, `total_monthly_waste_usd`, `executive_summary`.
  - Linked to `users.id` with `onDelete: "cascade"`.
- **`findings` table**:
  - Tracks granular audit findings: `resource_id`, `resource_name`, `resource_type`, `region`, `severity` (`CRITICAL` | `HIGH` | `MEDIUM` | `LOW`), `category` (`ORPHANED` | `OVERPROVISIONED` | `MISCONFIGURED` | `LIFECYCLE` | `IDLE`), `estimated_monthly_waste_usd`, `remediation_command`, `risk_assessment`.
  - Foreign key to `scans.id`.

---

## 7. Top 10 Common Interview Questions & Model Answers

### Q1: "How do you calculate monthly cloud waste accurately?"
> **Answer:** "We combine pre-computed 2026 AWS pricing baselines with LLM contextual reasoning. For instance, an unattached Elastic IP is statically known to cost AWS's idle penalty of $0.005/hr ($3.65/month). For detached EBS volumes, standard gp2 storage costs $0.10/GB-month, so a 500GB volume is exactly $50.00/month. For complex workloads like oversized instances (e.g. an `m5.4xlarge` at $560/month tagged for dev), the LLM calculates the difference between current spend and the recommended tier like a `t4g.medium` or a scheduled auto-stop policy."

### Q2: "Why did you use Server-Sent Events (SSE) instead of polling or WebSockets?"
> **Answer:** "A cloud audit consists of discrete sequential phases: credential authentication, resource inspection, LLM reasoning, and database writing. Polling introduces unnecessary latency or server load. WebSockets add unnecessary duplex protocol overhead and connection state management on serverless functions. SSE is unidirectional, lightweight, runs natively over standard HTTP, and maps 1:1 to a progressive audit pipeline with events like `INIT`, `SCANNING_PROGRESS`, `ANALYZING`, and `COMPLETE`."

### Q3: "What happens if a user scans a region where they have zero resources?"
> **Answer:** "We engineered an intelligent Demo Mock Fallback system. If an AWS scan returns 0 resources in a selected region, POIROT detects this and prompts the user or automatically injects 5 realistic simulated waste scenarios (an orphaned 500GB gp2 disk, an idle Elastic IP, a dev Multi-AZ database, and a targetless load balancer). This guarantees the reviewer can evaluate the UI, telemetry, and AI remediation generator even with an empty sandbox account."

### Q4: "How do you handle rate limits or API throttling from AWS?"
> **Answer:** "AWS SDK v3 includes built-in exponential backoff and jitter algorithms in its default retry strategy. Additionally, we use `Promise.allSettled` rather than `Promise.all` across the 6 resource scanners. If S3 permissions fail or EC2 throttles, only that specific service scanner reports a warning, while the remaining 5 services continue scanning uninterrupted."

### Q5: "How do you protect AWS credentials in production?"
> **Answer:** "Credentials never touch client browsers. All AWS SDK calls execute exclusively on the server runtime. In production on Vercel, credentials are encrypted platform environment variables. Furthermore, POIROT strictly rejects any IAM policy requiring write permissions, mitigating the blast radius to zero."

### Q6: "How did you avoid React hydration mismatches on Next.js 15?"
> **Answer:** "Browser password manager extensions (like 1Password or Dashlane) inject proprietary DOM attributes such as `fdprocessedid` into `<button>` and `<input>` tags before React hydration completes. We audited all interactive components, added `suppressHydrationWarning`, and ensured server/client HTML parity."

### Q7: "What if the LLM hallucinates an invalid AWS CLI command?"
> **Answer:** "In our system prompt, we constrain the LLM with strict canonical command templates (e.g., `aws ec2 delete-volume --volume-id <id> --region <region>`). We also require each command to be accompanied by a mandatory `riskAssessment` field (e.g., 'Ensure a snapshot exists before terminating this volume') so engineers can conduct pre-flight checks."

### Q8: "How does the Drizzle ORM integration work with Neon Postgres?"
> **Answer:** "Drizzle operates as a lightweight, zero-overhead TypeScript ORM. We define our tables in `lib/db/schema.ts` with strong types. For queries, Drizzle compiles to raw parameterized SQL without the heavy memory footprint or slow query overhead of traditional ORMs like Prisma."

### Q9: "If this application had to support 1,000 concurrent audits, how would you scale it?"
> **Answer:** "Right now, audits execute directly within the Next.js API route handler. At scale, I would decouple execution:
> 1. The API route would push an audit job to a queue (like Amazon SQS or Redis BullMQ).
> 2. Ephemeral worker containers (AWS Fargate or Vercel Daemons) would execute the AWS scans and LLM inference asynchronously.
> 3. Results would be stored in Neon, and the frontend would stream status updates via Redis Pub/Sub through SSE."

### Q10: "What was the most rewarding bug or performance issue you solved?"
> **Answer:** "Visual fidelity and blending! When embedding a high-definition 3D bioluminescent neon cloud into a dark plum UI (`#090510`), a standard JPEG image creates harsh rectangular bounding boxes and clashes with ambient lighting. I implemented mathematical CSS `mix-blend-mode: screen` combined with a dual feathered radial alpha mask. Pure black in the asset rendered with 100% mathematical transparency, seamlessly blending the neon cloud sculpture directly into the background without rectangular borders."

---

## 8. Summary Checklist Before Your Interview

- [x] **Project Name**: POIROT (AI Cloud Cost Detective)
- [x] **Live Production URL**: [https://poirot-nu.vercel.app](https://poirot-nu.vercel.app)
- [x] **GitHub Repo**: [https://github.com/karambitbarrage15/POIROT](https://github.com/karambitbarrage15/POIROT)
- [x] **Core Stack**: Next.js 15, TypeScript, AWS SDK v3, OpenRouter (Llama 3.3 70B), Neon Postgres, Drizzle ORM, Tailwind CSS, SSE.
- [x] **Key Metric to remember**: **88% prompt token reduction** through heuristic pre-filtering.
