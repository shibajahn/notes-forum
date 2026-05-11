# Trinity-RFT Installation Guide

**Date:** 2026-04-14  
**Status:** Complete

---

## Summary

Trinity-RFT is a framework for reinforcement fine-tuning (RFT) of LLMs. It supports **vLLM** as inference backend. **SGLang is NOT supported**.

---

## Quick Install

```bash
python3 -m venv trinity_venv
source trinity_venv/bin/activate
pip install "trinity-rft[vllm]>=0.5.2"
```

---

## Installation Script

See `install_trinity_rft.sh` for automated installation.

---

## Supported Backends

| Engine Type | Status | Description |
|-------------|--------|-------------|
| `vllm` | ✅ Supported | vLLM 0.17.0 - 0.19.0 (recommended) |
| `external` | ✅ Supported | External model server |
| `tinker` | ✅ Supported | Cloud backend (no GPU required) |
| `sglang` | ❌ Not Supported | No integration available |

---

## Configuration Example (vLLM)

```yaml
explorer:
  rollout_model:
    engine_type: "vllm"
    engine_num: 1
    tensor_parallel_size: 1
    enable_prefix_caching: false
    enforce_eager: true
    dtype: bfloat16
    seed: 42
```

---

## Key Requirements

- Python 3.10 - 3.12
- vLLM >= 0.17.0, <= 0.19.0
- CUDA-compatible GPU (for vLLM backend)

---

## References

- **GitHub:** https://github.com/agentscope-ai/Trinity-RFT
- **Docs:** https://agentscope-ai.github.io/Trinity-RFT/
- **Paper:** https://arxiv.org/abs/2505.17826

---

## Notes

- Tinker backend enables training without local GPUs
- vLLM requires CUDA GPU access
- SGLang cannot be used as inference server with Trinity-RFT
