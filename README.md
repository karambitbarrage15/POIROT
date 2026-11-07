# 🕵️ POIROT — AI Cloud Cost Detective
### Autonomous AWS FinOps Investigator & Waste Detection Engine

[![Next.js 15](https://img.shields.io/badge/Next.js-15_(App_Router)-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![AWS SDK v3](https://img.shields.io/badge/AWS_SDK-v3-orange?style=flat&logo=amazon-aws)](https://aws.amazon.com/)
[![Neon PostgreSQL](https://img.shields.io/badge/Neon-PostgreSQL_Serverless-00E599?style=flat&logo=postgresql)](https://neon.tech/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Llama_3.3_70B_(Free)-6366F1?style=flat)](https://openrouter.ai/)

**POIROT** is an AI-powered cloud cost auditing platform that connects to AWS, scans for infrastructural waste, streams real-time audit progress via Server-Sent Events (SSE), and leverages **Meta Llama 3.3 70B** through OpenRouter to synthesize FinOps anomalies with copyable AWS CLI remediation commands.

---

## ⚡ What It Detects

- **Orphaned Storage:** Unattached managed EBS volumes (`status == available`) accumulating daily storage fees.
- **Idle Elastic IPs:** Unassociated Elastic IPs (`AssociationId == null`) incurring idle address charges ($0.005/hr).
- **Idle EC2 Instances:** Stopped EC2 instances that still retain attached Public/Elastic IPs.
- **Over-Provisioned Databases:** Multi-AZ RDS deployments running in development/staging environments.
- **Missing Lifecycle Policies:** S3 buckets without transition/expiration lifecycle policies.
- **Legacy Storage Tiers:** Outdated `gp2` volumes that can be migrated to `gp3` for instant 20% savings and higher baseline performance.

---

## 🏗️ Architecture

```
                               ┌──────────────┐
                               │     USER     │
                               └──────┬───────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │   NEXT.JS 15 FRONTEND     │
                        │  (React 19 + Tailwind UI) │
                        └─────────────┬─────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │    NEXT.JS API ROUTES     │
                        │   · Custom JWT Auth       │
                        │   · SSE Streaming Engine  │
                        └──────┬──────┬──────┬──────┘
                               │      │      │
            ┌──────────────────┘      │      └──────────────────┐
            ▼                         ▼                         ▼
   ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
   │   AWS SDK v3    │       │   SSE STREAM    │       │   OPENROUTER    │
   │  · EC2 Describe │       │ /api/scan/stream│       │  Llama 3.3 70B  │
   │  · EBS Volumes  │       │ (Live progress) │       │   (FinOps AI)   │
   │  · RDS DBs      │       └────────┬────────┘       └────────┬────────┘
   │  · S3 Lifecycle │                │                         │
   └────────┬────────┘                ▼                         ▼
            │                  ┌─────────────┐           ┌──────────────┐
            ▼                  │  DASHBOARD  │           │ NEON POSTGRES│
     ┌─────────────┐           │  PROGRESS   │           │ (Serverless) │
     │  AWS CLOUD  │           │   TRACKER   │           │              │
     │ (ap-se-1 /  │           └─────────────┘           │ · users      │
     │  us-east-1) │                                     │ · scans      │
     └─────────────┘                                     │ · findings   │
                                                         └──────┬───────┘
                                                                │
                                                                ▼
                                                         ┌──────────────┐
                                                         │ FINAL REPORT │
                                                         │ · Waste ($)  │
                                                         │ · CLI Fixes  │
                                                         └──────────────┘
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router, Strict TypeScript)
- **Styling:** Tailwind CSS with modern dark dashboard theme (`slate-950`, `cyan-400` accents)
- **Icons:** `lucide-react`
- **Cloud Scanner:** AWS SDK v3 (`@aws-sdk/client-ec2`, `@aws-sdk/client-rds`, `@aws-sdk/client-s3`, `@aws-sdk/client-elastic-load-balancing-v2`)
- **Database & ORM:** PostgreSQL hosted on [Neon.tech](https://neon.tech) via Drizzle ORM (`drizzle-orm`, `@neondatabase/serverless`)
- **AI Integration:** OpenRouter API using OpenAI SDK with `meta-llama/llama-3.3-70b-instruct:free` and Zod structured output validation.
- **Authentication:** Custom JWT authentication using `jose` and `bcryptjs`.
- **Real-time Pipeline:** Server-Sent Events (SSE) via Next.js `ReadableStream`.

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/karambitbarrage15/POIROT.git
cd POIROT
npm install
```

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Neon PostgreSQL Connection URL
DATABASE_URL="postgresql://user:password@ep-sample-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# JWT Secret for Session Management
JWT_SECRET="cost-detective-super-secret-key-2026-production-ready"

# OpenRouter Free AI API Key
OPENROUTER_API_KEY="sk-or-v1-xxxxxxxxxxxxxxxxxxxx"
AI_MODEL="meta-llama/llama-3.3-70b-instruct:free"

# AWS Read-Only Credentials
AWS_ACCESS_KEY_ID="AKIAxxxxxxxxxxxxxxxx"
AWS_SECRET_ACCESS_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
AWS_DEFAULT_REGION="ap-southeast-1"
```

### 3. Push Database Schema to Neon

```bash
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security Best Practices

- **Zero Write Permissions Required:** The AWS IAM policy only needs read-only describe actions (`ec2:Describe*`, `rds:Describe*`, `s3:ListAllMyBuckets`, `s3:GetLifecycleConfiguration`).
- **Secrets Isolation:** `.env.local` is strictly ignored in `.gitignore`.
- **Stateless AI Processing:** Resource snapshots sent to OpenRouter are minified and stripped of sensitive payloads before analysis.

---

## 📄 License

MIT License. Built for modern cloud engineers and FinOps specialists.
