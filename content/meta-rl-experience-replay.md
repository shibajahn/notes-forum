---
title: "Meta-Analysis: Efficient RL Training for LLMs with Experience Replay"
authors: "Charles Arnal, Vivien Cabannes, Taco Cohen, Julia Kempe, Remi Munos"
date: 2026-04-21
arxiv: "2604.08706"
tags: [paper, arxiv, rl, llm, experience-replay, compute-efficiency, meta-analysis]
source: https://arxiv.org/abs/2604.08706
pdf: https://arxiv.org/pdf/2604.08706.pdf
notes_folder: /raw
created: 2026-04-21T03:08:00
---

# Efficient RL Training for LLMs with Experience Replay

## Overview

This meta-report summarizes key findings from the arXiv paper [2604.08706] on using experience replay buffers to improve compute efficiency in LLM post-training with reinforcement learning. The report serves as a reference for creating a 5-slide presentation.

## Paper Details

- **Title:** Efficient RL Training for LLMs with Experience Replay
- **Authors:** Charles Arnal (FAIR at Meta), Vivien Cabannes (NYU Courant Institute & CDS), Taco Cohen (FAIR at Meta), Julia Kempe (NYU Courant Institute & CDS), Remi Munos (FAIR at Meta)
- **Date:** April 9, 2026
- **arXiv ID:** 2604.08706 [cs.LG]

## Core Problem

LLM RL post-training (e.g., DeepSeek R1, OpenR1) has become computationally prohibitive:
- Inference cost dominates: >80% of post-training GPU hours spent on generating rollouts
- Standard approaches (PPO, GRPO) follow a "generate-then-discard" paradigm
- Rollouts are generated, used for a single gradient update, then discarded
- This is extreme sample inefficiency

## Key Insight

The prevailing belief that fresh, on-policy data is essential for high performance is challenged. A well-designed replay buffer can:
- Reduce inference compute by up to 40%
- Maintain or even improve final model performance
- Preserve policy entropy and output diversity

## Theoretical Contributions

1. **Bias-Variance Decomposition:** Formalizes the trade-off between staleness-induced variance, sample diversity, and computational cost
2. **Optimal Buffer Design (Theorem 4.5):** Derives optimal ratios:
   - Staleness horizon: $N/R = x^*$
   - Replay ratio: $B/R = y^* = \mu / (\rho + 1/x^*)$
3. **Three-way Trade-off:** Between staleness-induced noise growth ($\bar{\sigma}^2$), sample-iterate correlation ($\rho$), and rollout-vs-training compute imbalance ($\mu$)
4. **Key Finding:** As the cost of rollout generation increases, the optimal strategy shifts decisively toward experience replay

## Experimental Results

### Models & Datasets
- **Models:** Qwen3-0.6B, Qwen2.5-7B, Qwen3-8B, Llama 3.2 3B
- **Datasets:** OpenR1-Math-220k, MATH, miniF2F (Lean coding)
- **Hardware:** Nvidia H100 and H200 GPUs
- **RL Method:** GRPO (Group Relative Policy Optimization)

### Key Metrics
| Metric | Finding |
|--------|---------|
| Compute Savings | Up to 40% reduction vs on-policy baseline |
| Training Stability | Buffer acts as regularizer, prevents crashes |
| Pass@k | Improved, especially for larger k values |
| Policy Entropy | Preserved/increased through buffer reuse |

### Optimal Configurations
- $\mu \approx 5.28$ (Qwen2.5-7B), $\mu \approx 6.84$ (Qwen3-0.6B)
- Best compute ratio $\gamma$ achieved with more trainers than inference workers
- Buffer size of 84 with (W,T) = (5,3) showed strong results

### Advanced Improvements
- **Positive-Bias Sampling:** Prioritizing correct rollouts in buffer
- **AsymRE Loss:** No importance ratio correction, handles off-policiness better
- Combined improvements shown in Figure 5 of the paper

## Practical Implications

1. **Shift the Objective:** From maximizing performance per step to performance per unit of compute
2. **Simple Implementation:** Replay buffers can be added to existing async RL pipelines with minimal changes
3. **Scalability:** Results consistent across different model sizes (0.6B to 8B)
4. **Wall-time Benefits:** Gains in wall-time match or exceed compute efficiency gains

## Slide Plan (5 slides)

### Slide 1: Title Slide
- Title: "Efficient RL Training for LLMs with Experience Replay"
- Subtitle: Rethinking the Generate-Then-Discard Paradigm
- Authors & Source

### Slide 2: The Compute Problem & Proposed Solution
- The problem: 80%+ GPU hours wasted on single-use rollouts
- The conventional wisdom: on-policy data is essential
- The challenge: replay buffers can break this assumption
- Visual: generate-then-discard vs. replay buffer paradigm comparison

### Slide 3: Theoretical Framework
- Three-way trade-off: staleness vs. diversity vs. compute cost
- Optimal design theorem (N/R, B/R ratios)
- Key insight: compute efficiency improves with replay as rollout cost increases
- Visual: trade-off diagram

### Slide 4: Experimental Results
- Key metrics: 40% compute savings, maintained/improved accuracy
- Stability benefits: buffer as regularizer
- Pass@k and entropy improvements
- Visual: accuracy vs compute comparison chart

### Slide 5: Key Takeaways & Future Directions
- Shift from "per-step" to "per-compute" optimization
- Simple implementation, significant gains
- Advanced: positive-bias sampling + AsymRE loss
- Future: validation on frontier models, more sophisticated sampling
