# Smart Skills Picker: PAROLE Squad Allocation Blueprint
**Framework:** Smart Skill Picker & Drive JIT Loader  
**Master Skills Library:** Google Drive `POWERHOUSE` (2,445 skills index)  
**Execution Context:** Nebius × NVIDIA Global AI Hackathon (Devpost)  
**Sprint Window:** October 13 to October 18, 2026, 23:59 IST (Pre-Exam Code Freeze)

---

## 1. Skill Index Discovery & Routing Log

Using `smart-skill-picker`, the project requirements were decomposed across three functional domains:
1. **Backend & Security Infrastructure:** Linux kernel sandboxing, REST APIs, seccomp filters, low-latency caching, model serving.
2. **Frontend & Visual Systems:** Real-time event streams, dark-mode design system, anti-AI-slop philosophy, line charts.
3. **Product Marketing & Commercialization:** Enterprise positioning, SaaS unit economics, pricing model, video demo production.

### Matched Powerhouse Skills from 2,445 Library Index:

| Domain | Selected Powerhouse Skill | Origin / Repo | Purpose & Application |
| :--- | :--- | :--- | :--- |
| **Architecture & Defense** | `super-mega-hackathon` | Apex Hackathon Engine | Master pipeline orchestration and rubric alignment. |
| **Architecture & Defense** | `mega-system-architecture` | Distributed Systems | Out-of-process 3-speed architecture design and trust boundaries. |
| **Architecture & Defense** | `adversarial-reviewer` | Security Audit | Hostile red-team audit of policy promotion diffs. |
| **Backend & Sandbox** | `super-mega-backend` | Apex Backend Engine | Asynchronous API endpoints, streaming gateways, and microservices. |
| **Backend & Sandbox** | `aegisops-ai` | DevSecOps & Kernel | Linux kernel Landlock & seccomp BPF filtering on Nebius VM. |
| **Backend & Sandbox** | `atlas-contract` | Goal Integrity | Strict TypeScript & Zod schemas between client, gateway, and models. |
| **Frontend & UX** | `frontend-ui-dark-ts` | Dark UI System | Next.js App Router layout with Tailwind CSS and Framer Motion. |
| **Frontend & UX** | `design-philosophy` | Art Direction | "Cybernetic Sentinel" visual philosophy, eliminating generic AI clichés. |
| **Frontend & UX** | `design-taste-frontend` | Taste & Typography | Mono-spaced telemetry typography, high-contrast zinc/emerald color roles. |
| **Marketing & Business** | `marketing-strategy-pmm` | Product Marketing | Positioning PAROLE for Enterprise CISOs and SOC2/ISO27001 buyers. |
| **Marketing & Business** | `pricing-strategy` | SaaS Monetization | Unit economics comparison ($0.28 vs $3.80 / 1k actions) and margin math. |
| **Marketing & Business** | `data-storytelling` | Slide & Video Narratives| Visualizing the Escalation Collapse Curve for pitch deck and video demo. |

---

## 2. OOP-Mix Execution Schema

```typescript
Task {
  goal: "Deploy a 4-person collegiate engineering squad partitioned into Backend, Frontend, and Marketing pillars (with Frontend and Marketing operating as a unified experience unit) to build and pitch PAROLE before the Oct 18 code freeze",
  context: "Undergraduate Computer Engineering students in Mumbai running low-end laptops, offloading all heavy compute to remote H100 GPUs via $50 Nebius Cloud credits",
  constraints: [
    "Hard code freeze at 23:59 IST on Oct 18 due to university semester exams (Oct 24-31)",
    "Backend handles Linux VM seccomp sandbox, PicoClaw edge client, Jev routing, and Nebius Token Factory",
    "Frontend and Marketing work together as a unified experience & pitch pod",
    "Zero heavy local compute: local machines run strictly PicoClaw (<10MB RAM) and Next.js UI",
    "Presentation strictly in Google Slides with a sub-3-minute live demonstration video"
  ],
  success: "All 3 pillars ship verified artifacts, 1,000-event benchmark achieves 100% injection block rate, live demo video recorded, and Devpost staged by Oct 18"
}

Skills[] {
  // PILLAR 1: BACKEND POD (Member 1 & Member 2)
  { name: "super-mega-hackathon", why: "Pipeline governance and Devpost scoring alignment", method: "Stage gating", order: 1 },
  { name: "mega-system-architecture", why: "3-Speed architecture and kernel trust boundary definition", method: "HLD/LLD", order: 2 },
  { name: "super-mega-backend", why: "FastAPI gateway and Nebius Token Factory SSE streaming", method: "Async REST/SSE", order: 3 },
  { name: "aegisops-ai", why: "NemoClaw OpenShell seccomp BPF syscall interceptor", method: "Kernel-level rules", order: 4 },
  { name: "adversarial-reviewer", why: "Red-team audit of synthesized policy diffs", method: "Adversarial pass", order: 5 },

  // PILLARS 2 & 3: FRONTEND + MARKETING COLLABORATIVE POD (Member 3 & Member 4)
  { name: "frontend-ui-dark-ts", why: "Single-page dark systems cockpit in Next.js", method: "Tailwind components", order: 6 },
  { name: "design-philosophy", why: "Enforcing 'Cybernetic Sentinel' aesthetic without AI purple slop", method: "Visual manifesto", order: 7 },
  { name: "marketing-strategy-pmm", why: "Enterprise CISO positioning and compliance narratives", method: "Buyer persona framing", order: 8 },
  { name: "pricing-strategy", why: "SaaS unit economics modeling ($0.28 vs $3.80 / 1k actions)", method: "Value metric architecture", order: 9 },
  { name: "data-storytelling", why: "Escalation Collapse Curve and 180s video demonstration", method: "Demo choreography", order: 10 }
}

Tools[MCP] {
  use: ["google-slides", "nebius-token-factory", "github-actions", "cursor-ide", "obs-studio"],
  guardrail: "Verify all code runs on remote Nebius endpoints or local Go runtime; zero heavy local Docker images"
}

Execute {
  inspect: "Verify team member dev environments (Node.js, Go compiler, Nebius API keys)",
  plan: "Align Backend Pod and Frontend+Marketing Pod with clear API boundaries and daily deliverables",
  change: "Build backend engine, edge wrapper, dashboard UI, and pitch deck in parallel streams",
  verify: "Execute 1,000-trace replay test and confirm 100% prompt injection containment",
  report: "Compile final video demo, Devpost draft package, and staged GitHub repository"
}
```

---

## 3. Team Member Division Across Pillars

### Pillar 1: Backend & Infrastructure Pod
* **Member 1 (Founder & Systems Architect):**
  * *Assigned Skills:* `super-mega-hackathon`, `mega-system-architecture`, `adversarial-reviewer`.
  * *Core Output:* 3-Speed system architecture, mathematical threat model, hard denylists (`169.254.169.254`, `~/.ssh`, `~/.aws`), 1,000-action replay test runner, GitHub repo administration.
  * *Google Slides Owned:* Slides 1, 3, 4, 11.
* **Member 2 (Backend & Sandbox Systems Engineer):**
  * *Assigned Skills:* `super-mega-backend`, `aegisops-ai`, `atlas-contract`.
  * *Core Output:* Nebius AI Cloud Ubuntu VM provisioning, NemoClaw OpenShell seccomp BPF filters, FastAPI gateway, PicoClaw Go client (<10MB RAM) with Tier 0 LRU hash cache (<2ms), TypeSafe Jev connector.
  * *Google Slides Owned:* Slides 4, 6.

### Pillars 2 & 3: Frontend + Marketing Collaborative Pod
* **Member 3 (Frontend & UX Lead):**
  * *Assigned Skills:* `frontend-ui-dark-ts`, `design-philosophy`, `design-taste-frontend`.
  * *Core Output:* "Cybernetic Sentinel" dark-mode UI, real-time monospace event stream feed, interactive Escalation Collapse Curve line chart, Nemotron policy diff viewer with one-click approval, Vercel deployment.
  * *Google Slides Owned:* Slides 2, 5, 9.
* **Member 4 (Marketing & PMM Lead):**
  * *Assigned Skills:* `marketing-strategy-pmm`, `pricing-strategy`, `data-storytelling`.
  * *Core Output:* Enterprise CISO buyer persona and SOC2 compliance brief, SaaS unit economics comparison ($0.28 vs $3.80 per 1k actions), 180-second live demonstration video script and voiceover, Devpost submission text.
  * *Google Slides Owned:* Slides 2, 8, 9, 10.
