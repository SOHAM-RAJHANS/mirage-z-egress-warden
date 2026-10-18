---
name: smart-skill-picker
description: Turn plain-text tasks into the best OOP-mix prompt from installed skills and Google Drive POWERHOUSE.
---
# Smart Skill Picker & Drive JIT Loader

## Core Workflow
1. **Analyze Task**: Parse the user's objective and domain (Engineering, Security, Business, Writing, Marketing, Social).
2. **Search Index**: Identify the top 3-5 matching skills from `documentation/skills/` and `POWERHOUSE`.
3. **Compose Prompt / Plan**: Assemble the structured execution blueprint using the standard schema:
   - `Task{ goal, context, constraints, success }`
   - `Skills[]{ name, why, method, order }`
   - `Tools[MCP]{ use, guardrail }`
   - `Execute{ inspect -> plan -> change -> verify -> report }`
   - `Verify{ checks, risk }`
   - `Output{ format }`
4. **Execute with Fidelity**: Apply the exact procedures, checklists, and anti-patterns specified in the retrieved skill.
