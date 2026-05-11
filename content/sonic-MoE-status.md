# SonicMoE Integration Status Report

> **Generated:** 2026-04-23
> **Source:** Dao-AILab/sonic-moe (https://github.com/Dao-AILab/sonic-moe)
> **Paper:** "SonicMoE: Accelerating MoE with IO and Tile-aware Optimizations" (arXiv: 2512.14080)

---

## Executive Summary

As of April 2026, **no major LLM training library has a merged SonicMoE integration.** SonicMoE (651 GitHub stars) remains in the "being evaluated for integration" phase across the NVIDIA ecosystem. The library provides CUDA/Triton kernels optimized for Hopper and Blackwell GPU architectures.

---

## Already Integrated

### TransformerEngine (Closed PR — Not Merged)

- **PR:** [#2627](https://github.com/NVIDIA/TransformerEngine/pull/2627) — "[PyTorch] SonicMoE Fused Softmax-TopK Integration"
- **Status:** ❌ **Closed (abandoned)** on Feb 26, 2026
- **Author:** @denera (NVIDIA collaborator)
- **What it did:** Integrated SonicMoE's fused Softmax-TopK into TE's PyTorch token router, gated behind env var `NVTE_USE_SONIC_MOE=1`
- **Why closed:** Minor numerical errors caused by token rounding
- **Changes:** 215 additions, 37 deletions across 5 files

---

## Under Consideration / In-Flight

### Megatron-LM (Open feature requests)

1. **Issue [#2709](https://github.com/NVIDIA/Megatron-LM/issues/2709)** — "Consider SonicMOE kernel comparison for potentially better IO/activation memory management"
   - Open since Dec 18, 2025
   - Labels: `enhancement`, `module: moe`, `community-request`
   - SonicMoE claimed gains: **45% less activation memory**, **1.86× throughput on Hopper**
   - Assignees: @ericharper, @yanring (NVIDIA team)
   - Status: Active investigation

2. **Issue [#4167](https://github.com/NVIDIA/Megatron-LM/issues/4167)** — "Feature Request: ScatterMoE (Triton-based Sparse MoE with fused scatter/gather GEMMs)"
   - Open since Apr 6, 2026
   - References SonicMoE as an evolution over ScatterMoE (arXiv:2403.08245)
   - Notes: "SonicMoE further optimizes for Hopper/Blackwell by reducing activation memory and improving tile utilization"
   - Author recommends looking at SonicMoE before ScatterMoE

### NVIDIA NeMo AutoModel (Open feature request)

- **Issue [#1001](https://github.com/NVIDIA-NeMo/AutoModel/issues/1001)** — "Integrate SonicMoE kernels"
- Open since Dec 29, 2025
- Labels: `enhancement`
- Assigned to: @hemildesai (NeMo contributor)
- Milestone: 26.02 (past due by ~Feb 9, 2026 — **overdue**)
- Scope:
  - Integrate SonicMoE for non-EP (Expert Parallel) paths
  - Investigate grouped GEMM from SonicMoE for EP paths
  - Requires custom backward for grouped GEMMs

---

## Not Yet Considered

The following major training libraries have **no SonicMoE integration or discussion**:

| Library | Repo | Notes |
|---------|------|-------|
| **TRL** | trl-lib/trl | No mention of sonicmoe/sonic-moe |
| **HuggingFace PEFT** | huggingface/peft | No mention |
| **DeepSpeed** | microsoft/DeepSpeed | No mention |
| **Unsloth** | unsloth-ai/unsloth | No mention |
| **Axolotl** | axolotl-ai-cloud/axolotl | No mention |

---

## SonicMoE Library Quick Facts

- **Repo:** Dao-AILab/sonic-moe
- **Stars:** 651 | **Forks:** 78
- **Languages:** Python (kernel bindings), C++/CUDA
- **Dependencies:** PyTorch, Triton, CUTLASS (via QuACK library)
- **GPU targets:** Hopper (H100) and Blackwell (B200)
- **Paper:** https://arxiv.org/abs/2512.14080
- **Key optimization:** IO-aware and tile-aware MoE kernels that reduce activation memory and improve compute throughput

---

## Key Takeaways

1. **TransformerEngine** was the first to attempt integration but the PR was abandoned due to numerical precision issues — the core fused Softmax-TopK was not merged.
2. **Megatron-LM** has active internal discussions at NVIDIA (assigned to engineers) about adapting SonicMoE kernels for TransformerEngine integration, but nothing merged yet.
3. **NeMo AutoModel** has a SonicMoE integration request but the target milestone is overdue.
4. None of the non-NVIDIA training frameworks (TRL, PEFT, DeepSpeed, Unsloth) have picked up SonicMoE.
5. SonicMoE is NVIDIA-friendly by design (CUTLASS/QuACK dependencies, Hopper/Blackwell targeting), so adoption outside the NVIDIA ecosystem may be limited.

---

## Sources

- Dao-AILab/sonic-moe: https://github.com/Dao-AILab/sonic-moe
- TE PR #2627: https://github.com/NVIDIA/TransformerEngine/pull/2627
- Megatron-LM #2709: https://github.com/NVIDIA/Megatron-LM/issues/2709
- Megatron-LM #4167: https://github.com/NVIDIA/Megatron-LM/issues/4167
- NeMo AutoModel #1001: https://github.com/NVIDIA-NeMo/AutoModel/issues/1001
