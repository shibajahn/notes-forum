# Trinity-RFT Tinker API Integration Analysis

**Date:** 2026-04-14  
**Status:** Complete analysis  
**Tinker SDK Version:** 0.9.0

---

## Executive Summary

Trinity-RFT uses Tinker SDK's **SamplingClient** for inference. **Only inference/sampling APIs are supported**. **Training APIs (TrainingClient) are NOT used by Trinity-RFT** - Trinity-RFT handles training itself via veRL backend.

---

## Tinker SDK Overview

Tinker SDK provides three main client types:

| Client           | Purpose                                 | Trinity-RFT Uses?                          |
| ---------------- | --------------------------------------- | ------------------------------------------ |
| `ServiceClient`  | Main entry point, creates other clients | ✅ Yes (via `create_sampling_client_async`) |
| `TrainingClient` | Forward/backward pass, optimizer step   | ❌ **NO** (veRL handles training)           |
| `SamplingClient` | Text generation/inference               | ✅ **YES** (primary use case)               |
| `RestClient`     | REST API operations                     | ❌ No                                       |

---

## Supported Tinker APIs (Used by Trinity-RFT)

### 1. ServiceClient

**Method:** `create_sampling_client_async(base_model, model_path)`

```python
# In tinker_model.py
self.service_client = tinker.ServiceClient()
self.model = await self.service_client.create_sampling_client_async(
    base_model=self.config.model_path,
)
```

**Purpose:** Creates a SamplingClient for inference

---

### 2. SamplingClient

#### Core Methods Used:

| Method | Purpose | Parameters |
|--------|---------|------------|
| `sample()` | Generate text completions | `prompt`, `sampling_params`, `num_samples` |
| `compute_logprobs()` | Get token log probabilities | `token_ids` |
| `get_tokenizer()` | Get model tokenizer | None |

#### Sampling Parameters:

```python
sampling_params = {
    "max_tokens": kwargs.get("max_tokens", config.max_response_tokens),
    "seed": kwargs.get("seed", config.seed),
    "temperature": kwargs.get("temperature", 1.0),
    "top_k": kwargs.get("top_k", -1),
    "top_p": kwargs.get("top_p", 1),
}
```

#### Types Used:

- `types.ModelInput.from_ints(prompt_token_ids)` - Prompt input
- `types.SamplingParams(...)` - Sampling configuration
- `types.SampleResponse` - Response from sampling
- `types.SampledSequence` - Individual sequence in response
- `SampledSequence.tokens` - Generated tokens
- `SampledSequence.logprobs` - Log probabilities
- `SampledSequence.stop_reason` - Stopping reason

---

### 3. Type Definitions Used

| Type | Purpose |
|------|---------|
| `ModelInput` | Prompt token input |
| `SamplingParams` | Sampling configuration |
| `SampleRequest` | Request structure |
| `SampleResponse` | Response structure |
| `SampledSequence` | Individual sampled sequence |
| `StopReason` | Why sampling stopped |

---

## NOT Supported (Training APIs - Not Used)

Trinity-RFT **does NOT use** these Tinker APIs because Trinity-RFT handles training itself via veRL:

### TrainingClient Methods (NOT USED):

| Method                        | Purpose                       | Why Not Used?             |
| ----------------------------- | ----------------------------- | ------------------------- |
| `forward_backward()`          | Compute forward/backward pass | veRL handles training     |
| `optim_step()`                | Adam optimizer step           | veRL handles optimization |
| `forward()`                   | Forward pass only             | veRL handles forward      |
| `save_weights()`              | Save weights                  | veRL checkpoints          |
| `load_state()`                | Load training state           | veRL manages state        |
| `load_state_with_optimizer()` | Load optimizer state          | veRL manages optimizer    |

### Other Training APIs (NOT USED):

- `ServiceClient.create_lora_training_client()` - Not used
- `ServiceClient.create_training_client_from_state()` - Not used
- `TrainingClient` methods - All not used

---

## Missing/Unsupported Features

### 1. Multi-Modal Input
Tinker supports:
- `types.ImageChunk`
- `types.ImageAssetPointerChunk`
- `types.ModelInputChunk` (chunked input)

**Status:** **NOT USED** by Trinity-RFT

### 2. Custom Loss Functions
Tinker supports:
- `types.CustomLossFnV1` - User-defined loss functions
- `types.LossFnType` - Loss function types

**Status:** **NOT USED** - Trinity-RFT uses its own algorithm implementations

### 3. Advanced Training Features
- `types.ForwardBackwardOutput`
- `types.OptimStepRequest/Response`
- `types.AdamParams`
- `types.Checkpoint` and checkpoint management

**Status:** **NOT USED** - veRL handles all training state

### 4. REST API Operations
- `RestClient.list_checkpoints()`
- `RestClient.get_weights_info()`
- `RestClient.publish_checkpoint()`

**Status:** **NOT USED**

### 5. Telemetry/Session Management
- `types.TelemetryEvent`, `types.Session*`
- `types.HealthResponse`
- `types.GetServerCapabilitiesResponse`

**Status:** **NOT USED**

---

## Configuration in Trinity-RFT

### Required Environment Variable:
```bash
export TINKER_API_KEY=<your-api-key>
```

### Configuration in YAML:
```yaml
model:
  tinker:
    enable: true
    rank: 32
    seed: null
    train_mlp: true
    train_attn: true
    train_unembed: true
```

### Note:
When Tinker is enabled, **LoRA configuration settings are ignored** - Trinity-RFT uses Tinker's built-in LoRA config.

---

## Supported Algorithms with Tinker

✅ **Supported:**
- GRPO
- OPMD
- SFT

❌ **NOT Supported:**
- PPO (requires `compute_advantage_in_trainer=true`)
- Reinforce++ (requires `compute_advantage_in_trainer=true`)
- RLOO (requires `compute_advantage_in_trainer=true`)
- On-policy distillation (requires `compute_advantage_in_trainer=true`)

**Reason:** Tinker backend doesn't support advantage computation in trainer.

---

## Known Limitations

1. **No multi-stage training** - Tinker backend doesn't support multiple stages
2. **Entropy loss inconsistency** - Different from veRL backend
3. **No custom loss functions** - Must use built-in loss functions
4. **No multi-modal** - Text-only support
5. **Limited algorithm support** - Only on-policy algorithms that don't need advantage computation

---

## Summary Table

| Feature | Status |
|---------|--------|
| **Sampling/Inference** | ✅ Supported |
| **Logprobs computation** | ✅ Supported |
| **Tokenizer access** | ✅ Supported |
| **Training (forward/backward)** | ❌ Not used (veRL) |
| **Optimizer** | ❌ Not used (veRL) |
| **Checkpoint management** | ❌ Not used (veRL) |
| **Multi-modal** | ❌ Not supported |
| **Custom loss functions** | ❌ Not supported |
| **REST API operations** | ❌ Not used |
| **Telemetry** | ❌ Not used |

---

## References

- **Trinity-RFT Tinker Model:** `trinity/common/models/tinker_model.py`
- **Tinker SDK v0.9.0:** https://github.com/thinking-machines-lab/tinker
- **Tinker Docs:** https://tinker-docs.thinkingmachines.ai/
- **Tinker Paper:** https://arxiv.org/abs/2505.17826 (via Trinity-RFT)
