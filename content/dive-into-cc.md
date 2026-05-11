---
title: "Dive into Claude Code: The Design Space of Today's and Future AI Agent Systems"
authors: "Jiacheng Liu, Xiaohan Zhao, Xinyi Shang, Zhiqiang Shen"
date: 2026-04-14
arxiv: "2604.14228"
tags: [paper, arxiv, claude-code, ai-agents, software-engineering, architecture-analysis, openclaw]
source: https://arxiv.org/abs/2604.14228
pdf: https://arxiv.org/pdf/2604.14228.pdf
github: https://github.com/VILA-Lab/Dive-into-Claude-Code
notes_folder: /raw
created: 2026-04-21
---

# Dive into Claude Code: The Design Space of Today's and Future AI Agent Systems

## Paper Overview

This paper presents a comprehensive source-level analysis of **Claude Code**, Anthropic's agentic coding tool, and a comparative analysis with **OpenClaw**, an open-source multi-channel personal assistant gateway. The study identifies how production coding agents navigate a recurring design space spanning safety, context management, extensibility, delegation, and persistence.

## Authors & Institution

- **Jiacheng Liu, Xiaohan Zhao, Xinyi Shang** — VILA Lab, MBZUAI
- **Zhiqiang Shen** (corresponding) — VILA Lab, MBZUAI & University College London
- Published: April 14, 2026 (arXiv:2604.14228)

## Key Statistics

- Source corpus: ~1,884 TypeScript files, ~512K lines of code
- Decision logic ratio: only ~1.6% of codebase is AI decision logic; 98.4% is operational infrastructure
- 27% of Claude Code-assisted tasks were work that would not have been attempted without the tool
- 93% of user permission prompts are approved (indicating approval fatigue)

## Five Human Values

1. **Human Decision Authority** — User retains ultimate decision authority; principal hierarchy (Anthropic → operators → users)
2. **Safety, Security, and Privacy** — System protects users even when human vigilance lapses
3. **Reliable Execution** — Agent does what the human meant; stays coherent over time
4. **Capability Amplification** — Materially increases what humans can accomplish per unit of effort
5. **Contextual Adaptability** — System fits user's specific context; relationship evolves over time

## Thirteen Design Principles

| # | Principle | Core Question |
|---|-----------|---------------|
| 1 | Deny-first with human escalation | Should unrecognized actions be allowed, blocked, or escalated? |
| 2 | Graduated trust spectrum | Fixed permission level, or a spectrum users traverse over time? |
| 3 | Defense in depth | Single safety boundary, or multiple overlapping ones? |
| 4 | Externalized programmable policy | Hardcoded policy, or externalized configs with lifecycle hooks? |
| 5 | Context as scarce resource | Single-pass truncation or graduated pipeline? |
| 6 | Append-only durable state | Mutable state, checkpoint snapshots, or append-only logs? |
| 7 | Minimal scaffolding, maximal harness | Decision scaffolding, or operational infrastructure? |
| 8 | Values over rules | Rigid procedures, or contextual judgment with guardrails? |
| 9 | Composable multi-mechanism extensibility | One unified API, or layered mechanisms at different costs? |
| 10 | Reversibility-weighted risk | Same oversight for all actions, or lighter for reversible ones? |
| 11 | Transparent file-based configuration | Opaque database, or user-visible version-controllable files? |
| 12 | Isolated subagent boundaries | Shared context and permissions, or operate in isolation? |
| 13 | Graceful recovery and resilience | Fail hard, or silently recover and reserve human attention? |

## Seven-Component Architecture

1. **User** — Submits prompts, approves permissions, reviews output
2. **Interfaces** — Interactive CLI, headless CLI, Agent SDK, IDE/Desktop/Browser
3. **Agent Loop** — Iterative cycle of model call, tool dispatch, result collection
4. **Permission System** — Deny-first rules, ML classifier, hook-based interception
5. **Tools** — Up to 54 built-in tools + MCP tools
6. **State & Persistence** — Append-only JSONL transcripts, session management
7. **Execution Environment** — Shell, filesystem, web fetching, sandboxing

## Five-Layer Subsystem Architecture

1. **Surface Layer** — Entry points and rendering (CLI, SDK, IDE)
2. **Core Layer** — Agent loop + five-layer compaction pipeline
3. **Safety/Action Layer** — Permissions, hooks, extensibility, tools, sandbox, subagents
4. **State Layer** — Context assembly, runtime state, persistence, CLAUDE.md
5. **Backend Layer** — Shell execution, MCP connections, tool implementations

## The Agentic Query Loop

- Reactive ReAct loop: gather context → take action → verify results
- Five context shapers run before every model call:
  1. Budget reduction (per-message size limits)
  2. Snip (lightweight older-history trimming)
  3. Microcompact (fine-grained cache-aware compression)
  4. Context collapse (read-time projection over history)
  5. Auto-compact (full model-generated summary)
- Recovery: max output escalation, reactive compaction, streaming fallback, fallback model

## Permission System

- **Seven permission modes**: plan, default, acceptEdits, auto, dontAsk, bypassPermissions, bubble
- **Deny-first rule evaluation**: deny rules always take precedence
- **Auto-mode ML classifier**: two-stage fast-filter and chain-of-thought evaluation
- **Seven safety layers**: tool pre-filtering, deny-first rules, permission modes, classifier, sandboxing, no restore on resume, hooks
- Security research found pre-trust initialization vulnerabilities (CVE-2025-59536, CVE-2026-21852)

## Extensibility Architecture

Four mechanisms at graduated context costs:

| Mechanism       | Context Cost | What It Does                                        |
| --------------- | ------------ | --------------------------------------------------- |
| **Hooks**       | Zero         | Lifecycle interception, event-driven automation     |
| **Skills**      | Low          | Domain-specific instructions + meta-tool invocation |
| **Plugins**     | Medium       | Multi-component packaging + distribution            |
| **MCP Servers** | High         | External service integration (multi-transport)      |

## Context & Memory Management

- **CLAUDE.md hierarchy** (4 levels):
  1. Managed memory (OS-level policy)
  2. User memory (~/.claude/CLAUDE.md)
  3. Project memory (checked into codebase)
  4. Local memory (gitignored, private)
- File-based transparency: every instruction is readable, editable, version-controllable
- LLM-based memory scan (not embeddings) for memory retrieval

## Subagent Delegation

- **Agent Tool** (AgentTool.tsx) dispatches to subagents
- **Built-in types**: Explore, Plan, General-purpose, Claude Code Guide, Verification, Statusline-setup
- **Custom agents**: defined via .claude/agents/*.md with YAML frontmatter
- **Isolation modes**: Worktree (git worktree), Remote (internal), In-process
- **Sidechain transcripts**: subagent histories stored separately, summary-only return

## Claude Code vs. OpenClaw

| Dimension | Claude Code | OpenClaw |
|-----------|-------------|----------|
| Scope | CLI coding harness, ephemeral sessions | Persistent WS gateway, multi-channel control plane |
| Trust Model | Deny-first per-action evaluation | Single trusted operator, perimeter-level access control |
| Runtime | queryLoop async generator (system center) | Pi-agent runner embedded in gateway RPC dispatch |
| Extensions | 4 mechanisms at graduated context costs | Manifest-first plugin system, 12 capability types |
| Memory | CLAUDE.md hierarchy, 5-layer compaction | Bootstrap files, dreaming, hybrid search |
| Multi-agent | Task-delegating subagents with worktree isolation | Multi-agent routing + sub-agent delegation |

## Six Future Directions

1. **Observability-Evaluation Gap** — Silent failure modes; generator-evaluator separation; quality monitoring
2. **Cross-Session Persistence** — Durable state between sessions; longitudinal human-agent relationships
3. **Harness Boundary Evolution** — Where/when/what/with-whom the agent acts (proactive, multi-modal, physical)
4. **Horizon Scaling** — From single session to multi-session scientific programs
5. **Governance** — Regulatory constraints (EU AI Act), compliance interfaces, external auditability
6. **Long-Term Human Capability** — Preserving developer skills; preventing cognitive atrophy

## Key Insights & Takeaways

- **1.6% decision logic, 98.4% operational infrastructure** — The engineering complexity exists to enable model decisions, not constrain them
- **Design philosophy**: Invest in deterministic infrastructure (context management, safety layering, recovery) rather than decision scaffolding (explicit planners, state graphs)
- **Converging toward OS-like abstractions**: Core loop = kernel, everything else = OS
- **The sustainability gap**: Architecture provides limited mechanisms for long-term human capability preservation
- **Design space is stable, answers vary**: Same design questions recur across systems but produce different answers based on deployment context
- **Composability**: Systems are not mutually exclusive; OpenClaw hosts Claude Code via ACP

## Limitations (of the paper)

- Static snapshot (v2.1.88); feature flags create build-time variability
- Reverse-engineering epistemology: reveals structure but not design intent or enabled flags
- Single-system analysis: findings bounded to Claude Code
- OpenClaw analysis reflects a specific development state

## Tags

`#claude-code` `#anthropic` `#ai-agents` `#software-engineering` `#architecture` `#openclaw` `#safety` `#context-management` `#multi-agent` `#design-space`
