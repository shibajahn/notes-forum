# Distributed Inference for Diffusion Transformers

**Research Area:** Parallelism and distributed computing techniques for accelerating Diffusion Transformer (DiT) inference across multiple GPUs.

## 1. Patch Parallelism (Spatial / Image Partitioning)

The dominant approach — split the image into patches across GPUs.

### DistriFusion (CVPR 2024 Highlight)
- **Authors:** Muyang Li et al. (MIT/Google/Song Han)
- **Parallelism:** Displaced patch parallelism
- **Key idea:** Exploits high similarity between adjacent diffusion steps. Reuses feature maps from the previous timestep to provide context for the current step, enabling asynchronous communication pipelined by computation.
- **Results:** 6.1x speedup on 8 NVIDIA A100s (SDXL)
- **arXiv:** 2402.19481

### PipeFusion (NeurIPS 2025)
- **Authors:** Jiarui Fang et al.
- **Parallelism:** 2D — both image patches AND model layers across GPUs
- **Key idea:** Reuses "stale feature maps" from the previous step to reduce inter-GPU communication. Reduces costs over tensor parallel, sequence parallel, and DistriFusion.
- **Results:** SOTA on 8 L40 PCIe GPUs for PixArt, SD3, FLUX.1
- **arXiv:** 2405.14430

### PCPP — Partially Conditioned Patch Parallelism (Dec 2024)
- **Authors:** XiuYu Zhang, Zening Luo, Michelle E. Lu
- **Parallelism:** Patch (partial conditioning)
- **Key idea:** Only condition on neighboring patches from the previous step (not the full image). Reduces communication by ~70% over DistriFusion.
- **Results:** 2.36–8.02x speedup on 4–8 GPUs (possible quality trade-off)
- **arXiv:** 2412.02962

### LinFusion (Sep 2024)
- **Authors:** Songhua Liu et al.
- **Approach:** Replaces self-attention with linear-complexity attention (Mamba2, RWKV6, Gated Linear Attention). Avoids the O(n^2) scaling problem entirely.
- **Results:** 16K images on a single GPU. Compatible with DistriFusion.
- **arXiv:** 2409.02097

## 2. Sequence Parallelism (Ulysses-style)

### CoCoDiff (Apr 2026)
- **Authors:** Bin Ma, Xingjian Ding, Tekin Bicer, Pengfei Su, Dong Li
- **Platform:** Aurora supercomputer
- **Parallelism:** Ulysses sequence parallelism (distributes tokens across GPUs)
- **Key insight:** V projection requires only linear computation; Q/K need normalization + RoPE. Enables overlapping V communication with Q/K computation.
- **Three mechanisms:**
  - **TAPA** (Tile-Aware Parallel All-to-all) — decomposes collectives into topology-aligned phases
  - **V-First scheduling** — hides V communication behind Q/K computation
  - **V-Major selective communication** — transmits only active projections on slow interconnects
- **Results:** 3.6x average speedup, peaking at 8.4x across up to 96 Intel GPU tiles
- **arXiv:** 2604.14561

## 3. Core Technical Challenge

**Problem:** Splitting the image means each GPU loses access to the full spatial context needed for attention computation.

**Converged solution:** Exploit high similarity between successive diffusion timesteps. Reuse stale feature maps from the previous timestep as context for the current step, trading small quality loss for massive communication savings.

**Key design decisions:**
- How many previous steps to reuse (1 step = DistriFusion/PipeFusion; partial = PCPP)
- Whether to reuse all patches or only neighboring patches (PCPP)
- Whether to parallelize over image space (DistriFusion/PCPP) or layer dimensions (PipeFusion adds layer-wise)
- Whether to use sequence parallelism with all-to-all collectives (CoCoDiff)

## Summary

| Method | Year | Venue | Parallelism | GPUs | Speedup | Key Insight |
|---|---|---|---|---|---|---|
| DistriFusion | 2024 | CVPR | Patch | 8 A100 | 6.1x | Stale feature reuse |
| PipeFusion | 2025 | NeurIPS | Patch + Layer | 8 L40 | SOTA | 2D parallelism + stale reuse |
| PCPP | 2024 | - | Patch (partial) | 4-8 | up to 8.0x | Neighbor patches only |
| CoCoDiff | 2026 | - | Sequence (Ulysses) | up to 96 tiles | 8.4x | V-First communication overlap |
| LinFusion | 2024 | - | Linear attention | 1 GPU | - | O(n) attention |
