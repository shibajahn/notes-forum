---
title: "Elastic Architecture Comparison"
date: 2026-06-10
tags:
  - elastic-models
  - llm-architecture
  - gemma
  - nemotron
  - sparse-models
  - moe
---

# Elastic Architecture Comparison

> [!info] Overview
> Comparison of three elastic LLM architectures from Google (Gemma 3n-E2B, Gemma 4-E2B/E4B) and NVIDIA (Nemotron-Labs-3-Elastic 30B), focusing on their "many-in-one" model families and efficient parameter management techniques.

## Key Finding

Google's approach makes models **smaller at configuration time** (via PLE + sparsity), while NVIDIA's approach makes models **adaptive at inference time** (via trainable router selecting submodel capacity per-token/phase).

## 1. Gemma 3n-E2B (Google DeepMind)

### Official terminology
Google calls it "**selective parameter activation technology**" — not MatFormer or Matryoshka Transformer.

### Architecture specs
- **Type:** Dense decoder-only transformer
- **Layers:** 35 layers
- **Hidden size:** 2048
- **Attention:** GQA, 8 heads (2 KV heads), head_dim=256
- **Intermediate:** 16384
- **RoPE:** Per-type theta — global θ=1,000,000, local θ=10,000
- **Context:** 32K (text config)

### Elastic mechanisms (5 layers)

1. **Per-Layer Embeddings (PLE):** Each layer has its own embedding table (262,144 × 256). Large but only lookups — no backprop to all layers. This is the primary "effective parameter" mechanism.

2. **Activation Sparsity Pattern:** First 10 layers have sparsity factor 0.95 (top-5% activations only). Remaining layers are dense (0.0 sparsity). Dynamic depth at activation level.

3. **KV Cache Sharing:** `num_kv_shared_layers=15` — last 15 layers share KV values across local/global layers. Dramatically reduces memory for long contexts.

4. **AltUp (Alternative Upward):** Multi-depth computation. `altup_active_idx=0`, `altup_num_inputs=4`, `altup_coef_clip=120.0`. Predicts additional outputs at intermediate layers and corrects the active prediction.

5. **LAUREL:** Learned Augmented Residual Layer (rank 64) — low-rank residual projections on top of standard residual connections.

### Multimodal
- **Vision:** MobileNetV5 encoder → 256 soft tokens per image
- **Audio:** Universal Speech Model (Conformer) → 188 soft tokens per audio clip
- **Vocab:** 262,400 text + 128 vision + 128 audio

### Key point
This is **not a MoE model**. It's a dense transformer with activation sparsity and per-layer embeddings. The "E" in E2B means "**effective**" parameters.

---

## 2. Gemma 4-E2B/E4B (Google DeepMind)

### Architecture types
Offers both **Dense** and **Mixture-of-Experts (MoE)** variants:

| Variant | Total params | Effective/Active | Description |
|---------|-------------|------------------|-------------|
| E2B | ~2B effective | 2B | Dense + PLE |
| E4B | ~4B effective | 4B | Dense + PLE |
| 26B A4B | 26B total | 4B active | **True MoE** |
| 31B | 31B | 31B | Dense |

### Elastic mechanisms
1. **Per-Layer Embeddings (PLE):** Same as Gemma 3n — each decoder layer has its own embedding table. Large but only lookups.
2. **MoE (for 26B A4B):** True expert routing where only 4B active parameters are computed per token. Sparse activation at expert level.
3. **Hybrid attention:** Interleaves local sliding window with full global attention. Final layer always global. Unified KV with **Proportional RoPE (p-RoPE)**.
4. **Variable visual token budget:** Configurable tokens per image — trades visual detail for compute.

### Specs
- **Context:** 128K (small models) / 256K (medium models)
- **Multimodal:** Text + Vision + Audio (small models), 140+ languages
- **Audio:** Max 30s, Video: Max 60s

---

## 3. Nemotron-Labs-3-Elastic 30B (NVIDIA)

### Paper: "Star Elastic: Many-in-One Reasoning LLMs with Efficient Budget Control"
- **arXiv:** 2605.07182
- **Training:** Post-training method — adds N nested submodels from one parent model via **one training run** (N× savings)

### Base model
- **Nemotron Nano v3:** 30B total / 3.6B active (hybrid Mamba-Transformer MoE)
- **Outputs:** 23B (2.8A) and 12B (2.0A) variants with 160B training tokens
- **Savings:** 360× reduction vs pretraining from scratch, 7× vs state-of-the-art compression

### Elastic mechanisms (6 axes of nesting)

1. **Dynamic Embedding Mask Operator:** Masks portions of embedding dimensions
2. **Dynamic Mamba (SSM) Mask Operator:** Masks SSM states
3. **Dynamic Attention Head Mask Operator:** Masks attention heads
4. **Dynamic FFN Mask Operator:** Masks FFN intermediate dimensions
5. **Dynamic MoE Expert Mask Operator:** Masks experts in MoE layer
6. **Depth Adaptation:** Variable depth — different inputs go through different number of layers

### Training
- **Router:** End-to-end trainable router generates masks for all 6 axes simultaneously, conditioned on token difficulty
- **Loss:** Knowledge distillation + multi-budget optimization (KL divergence between full model and masked submodel outputs)
- **Two-stage:** Stage 1 — config selection (15B tokens), Stage 2 — context extension (10B tokens)

### Inference: Elastic Budget Control
- **Per-token routing:** Easy tokens → smaller submodel, hard tokens → larger
- **Per-phase routing:** Different submodels for **thinking vs answering phases**
- **Results:** Up to 16% higher accuracy and 1.9× lower latency vs static models
- **Quantized:** Extends to FP8 and NVFP4 via Quantization-Aware Distillation (QAD)

---

## Comparison Table

| Dimension | Gemma 3n-E2B | Gemma 4-E2B/E4B | Nemotron-Labs-3-Elastic 30B |
|-----------|-------------|----------------|---------------------------|
| **Elastic paradigm** | Activation sparsity + PLE + KV sharing | PLE + MoE (for 26B A4B) | Multi-axis nested submodels via mask operator |
| **True MoE?** | No (dense) | Yes (26B A4B variant) | Yes (hybrid Mamba-Transformer MoE) |
| **Sparsity mechanism** | Top-k activation sparsity (0.95 for first 10 layers) | Expert routing (MoE variant) | Dynamic masking across 6 axes |
| **Elastic axes** | Activation sparsity, PLE, KV cache sharing, AltUp multi-depth | PLE, Expert routing, variable visual token budget | Embedding dim, SSM dim, attention heads, FFN width, MoE experts, depth |
| **Router?** | No (deterministic) | No (deterministic) | Yes — end-to-end trainable router with 6 mask operators |
| **Training method** | Standard pre-training + distillation | Standard pre-training + distillation | **Post-training** knowledge distillation, single run for N models |
| **Budget at inference** | Fixed (deterministic sparsity) | Fixed | **Dynamic per-token, per-phase** (thinking vs answering) |
| **Architecture** | Dense decoder-only transformer | Dense + MoE variants | Hybrid Mamba-Transformer (SSM + attention) |
| **Context** | 32K (text config) | 128K-256K | Extended via 2-stage training |
| **Multimodal** | Text + Vision + Audio | Text + Vision + Audio | Text (reasoning-focused) |
| **Deployment savings** | Effective 2B/4B parameter count | Effective 2B/4B or 4B active of 26B | N nested models from 1 training run |

## Key Takeaways

1. **Google's philosophy:** On-device efficiency through configuration-level reduction. PLE + sparsity make models "fit" on low-resource devices. The model is deterministic — same capacity every token.

2. **NVIDIA's philosophy:** Inference flexibility through training-time flexibility. One model, many submodels, dynamically routed. The key insight is that reasoning has variable difficulty — hard tokens/contexts need more compute, easy ones don't.

3. **Terminology note:** Google officially calls it "selective parameter activation" — not MatFormer or Matryoshka Transformer. That terminology may come from external analysis or internal documentation not publicly accessible.

4. **Architecture trend:** All three use sparsity, but at different levels — Google at activation/embedding level, NVIDIA at architectural component level (heads, experts, SSM states, FFN width, depth).

## References
- [[Gemma 3 Technical Report]] (arXiv 2503.19786)
- [[Star Elastic: Many-in-One Reasoning LLMs]] (arXiv 2605.07182)
- Google AI: [Gemma 3n model card](https://ai.google.dev/gemma/docs/core/variants/gemma3n)
- Google AI: [Gemma 4 model card](https://ai.google.dev/gemma/docs/core/model_card_4)
- HuggingFace: [gemma-3n-E2B-it](https://huggingface.co/google/gemma-3n-E2B-it)
