# PAROLE: Master "Agent IT Company" Setup & Execution Playbook
**Competition:** Nebius x NVIDIA Global AI Hackathon 2026 (Track 3: Enterprise & Knowledge Retrieval)  
**Project Name:** PAROLE — Autonomous Least-Privilege Governor for AI Agents  
**Master Skills & Setup Repository:** `https://github.com/SOHAM-RAJHANS/POWERHOUSE`  
**Hard Code Freeze:** October 18, 2026, at 23:59 IST (Pre-Exam Lock)

---

## 1. Welcome to the Squad: Read This First (In Plain English)

Welcome to the team! You do **not** need to be a senior programmer with 10 years of experience to crush this hackathon and help us win the $\$50,000+$ prize pool. 

Instead of writing code line-by-line from scratch and getting stuck on syntax errors, **we are operating like an AI-powered "Agent IT Company."** Each of the 4 people on our team is the **Director** of their own department, commanding a team of specialized coding agents (**OpenCode, Grok Code, Antigravity, and GitHub Copilot**) supercharged by our custom **POWERHOUSE** skills folder.

### What PAROLE Actually Does (Explained Simply)
Imagine you hire a smart AI coding assistant to work on your computer.
1. **The Problem:** If you give the AI full access to your computer, a hacker can hide a secret instruction inside a website or GitHub README (called **Prompt Injection**) that tricks your AI into stealing your passwords and sending them to the hacker.
2. **Why Current Fixes Fail:** To stop this, security tools put the AI inside a locked box (a **Deny-by-Default Sandbox**) that asks the human *"Allow this command? [Yes/No]"* every 10 seconds. After 50 popups, the human gets tired (**Approval Fatigue**) and blindly clicks *"Yes to All"*—which lets the hacker right back in!
3. **How PAROLE Solves It:** PAROLE is an automatic security guard that sits *outside* the AI agent. It uses a **3-Speed Brain**:
   * **Tier 0 (Instant Memory Cache — under $2\text{ ms}$):** Commands the agent has already earned permission to use pass instantly for free.
   * **Tier 1 (Fast Guardrail Check — approx. $100\text{ ms}$):** New, simple commands get checked in a tenth of a second by a lightweight safety model.
   * **Tier 2 (Deep Nebius Cloud Brain — $1.5\text{ s}$ to $3\text{ s}$):** Only weird or brand-new actions ($3\%$ of traffic) are sent to two giant NVIDIA Nemotron models running on Nebius H100 GPUs. One model writes a safe, narrow rule (**Nemotron-Super**), and the second model acts like a hacker trying to break that rule (**Nemotron-Ultra**). If it passes, PAROLE saves the rule into Tier 0 memory so the human is almost never bothered again!

---

## 2. STEP 0: Mandatory First Step — Download OpenCode & Set Up Your Stack

Before you touch a single task in your role guide, you **must** set up your multi-agent workstation. **Do not skip this.**

### Checklist to Complete in Order:
1. **Download OpenCode FIRST:**
   * OpenCode is your primary terminal and autonomous coding engine. Download and install **OpenCode** on your laptop before anything else.
   * Verify it opens cleanly in your terminal/workspace.
2. **Clone the POWERHOUSE Repository:**
   * Open your terminal and clone our master setup repository:
     `git clone https://github.com/SOHAM-RAJHANS/POWERHOUSE`
   * Inside this repo, you will find the **Setup Guide** and the **POWERHOUSE Skills Folder** (containing $2,445$ specialized skills).
3. **Connect the 4-Agent Engine:**
   * **Agent 1: OpenCode (The Heavy Builder):** Use OpenCode first to read your POWERHOUSE skill files and generate full features, scripts, and multi-file architectures.
   * **Agent 2: Antigravity (The Agentic IDE Workspace):** Open your project folder in Antigravity so you can see files side-by-side, run terminal previews, and coordinate multi-file edits visually.
   * **Agent 3: Grok Code (The Fast Debugger & Critic):** Whenever an error pops up, or whenever a design/code output feels "average," paste the file or error into Grok Code to get instant fixes and sharper logic.
   * **Agent 4: GitHub Copilot (The Inline Finisher):** Keep Copilot active inside your editor for quick line completions, fixing small typos, and wiring buttons or JSON fields.
4. **Zero Heavy Local Compute Rule (Keep Your Laptop Cool!):**
   * None of us are running heavy AI models or bulky Docker containers on our own laptops. All heavy AI work runs on the remote **Nebius AI Cloud** using our free $\$50$ H100 credits. Your laptop only runs lightweight code (Next.js website, lightweight Python/Go connectors, or browser tools).

---

## 3. The Golden Rule: Why "One-Shot ChatGPT" Fails & How We Win

If you open ChatGPT, type *"Make me a cybersecurity dashboard"* or *"Write a backend API"*, and stop after the first output, **we will lose.** Judges can spot lazy, one-shot AI output in 3 seconds: it has ugly purple gradients, fake buttons that do nothing, generic buzzwords, and broken edge cases.

### Your Real Job as an Agent Director:
AI can write the code, **but only YOU have eyes, taste, human belief, and standards.** For every task in your role file, you must follow this **4-Step Loop**:

1. **Load the Skill + State the Human Intent:** Tell OpenCode/Antigravity which POWERHOUSE skill to use (listed in your role guide) and state *why* a human cares about this feature.
2. **Compare Against the Real-World Benchmark:** Every task in your guide names a famous website, tool, or number as its **Benchmark** (for example: *"Must look like Linear.app and CrowdStrike Falcon, NOT a template"* or *"Must respond in under $2\text{ ms}$"*).
3. **The Tweak Loop (Iterate 3 to 7 Times):** Never accept Draft 1. Tell the agent:
   * *"This spacing looks cramped—make the padding cleaner and use monospace fonts for numbers."*
   * *"This button just shows an alert—wire it so it actually updates the live list and recalculates the counter."*
   * *"What happens if the API takes 5 seconds? Add a fallback so it never crashes during our live demo."*
4. **Re-Verification Gate:** Run the exact verification checklist at the end of the task to prove it works before moving to the next task.

---

## 4. Our Core Human Intent & Beliefs (Must Exist in Everything We Build)

Every judge evaluating PAROLE must feel these three human beliefs radiating from our code, our UI, and our pitch:

* **Belief 1: "The sandbox never trusts the model that is asking."**  
  We do not ask an AI nicely to obey rules. Our security boundary lives *outside* the AI process at the Linux system level. Even if an AI is $100\%$ brainwashed by a poisoned README file, it physically cannot touch `~/.ssh`, `~/.aws`, or `169.254.169.254`.
* **Belief 2: "Security that annoys humans is broken security."**  
  Human attention is precious. If a tool interrupts a developer 40 times an hour, the tool has failed. PAROLE proves that an autonomous governor can shrink human interruptions from $100\%$ down to under $3.8\%$ in 20 minutes.
* **Belief 3: "Enterprise AI must be Good, Cheap, and Fast all at once."**  
  Calling a giant AI model on every single shell command costs $\$3.80$ per $1,000$ actions and adds $2\text{ seconds}$ of lag. PAROLE's 3-Speed routing drops that cost by over $91\%$ to $\$0.28$ per $1,000$ actions and resolves $84\%$ of actions in under $2\text{ ms}$.

---

## 5. How the 4 Roles Fit Together (Zero Overlap, Maximum Speed)

| Role Number | Role Name | Core Mission in Plain English | Role File to Read |
| :--- | :--- | :--- | :--- |
| **Role 1** | **Backend Product Layer** | Build the 3-Speed Brain, Nebius Cloud API connection, fast local cache, and Linux sandbox rules so commands are judged safely and streamed live. | `01_ROLE_1_BACKEND_PRODUCT_LAYER_GUIDE.md` |
| **Role 2** | **Frontend Experience Layer** | Build the "Cybernetic Sentinel" dark-mode command center website where judges watch live attacks get blocked and see the Escalation Collapse Curve drop. | `02_ROLE_2_FRONTEND_EXPERIENCE_LAYER_GUIDE.md` |
| **Role 3** | **Marketing, GTM & Demo Producer** | Craft the enterprise CISO story, the $\$0.28$ vs. $\$3.80$ math, the Google Slides deck, the Devpost writeup, and record the 180-second winning video. | `03_ROLE_3_MARKETING_GTM_AND_DEMO_GUIDE.md` |
| **Role 4** | **Red-Team QA, Dataset & Demo Traps (Rookie Role)** | Build the "Poisoned README" trap repositories, generate and run the $1,000$-action test dataset ($850$ safe + $150$ hacker attacks), and stress-test every button and rubric requirement. | `04_ROLE_4_ROOKIE_RED_TEAM_QA_AND_DATASET_GUIDE.md` |

---

## 6. Daily Sync & Stress-Free Anti-Error Protocol

* **10:00 PM IST Daily 15-Minute Standup:** Every night, each person shows what they built on their screen for 3 minutes. If someone is stuck on an error, we paste it into OpenCode/Grok Code together and fix it in 5 minutes.
* **Never Break Main:** Work in your own folder or branch, run your Re-Verification checklist, and always keep a working backup copy before making big changes.
* **October 18 (23:59 IST) Hard Freeze:** Everything is finished, recorded, and staged on Devpost by October 18 night so everyone has $100\%$ stress-free study time for university exams!