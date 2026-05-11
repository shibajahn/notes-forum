# Qwen3.5-Omni Technical Report -- Slide Deck Plan

**Source:** arXiv:2604.15804 (submitted Apr 17, 2026)
**Authors:** Qwen Team
**Categories:** cs.CL, eess.AS

---

## Paper Summary

Qwen3.5-Omni is Qwen's latest fully omnimodal large language model, scaling to hundreds of billions of parameters with 256k context length. It natively processes text, images, audio, and video -- both understanding and generation. The model achieves SOTA across 215 audio/audio-visual benchmarks, surpassing Gemini-3.1 Pro in key audio tasks.

### Key Technical Innovations

1. **Thinker-Talker Architecture** -- Hybrid-Attention MoE for both components
2. **ARIA (Adaptive Rate Interleave Alignment)** -- Solves streaming speech instability
3. **256k Context** -- 10+ hours audio, 400s 720P video at 1 FPS
4. **Multilingual** -- 113 languages/dialects for speech recognition, 36 for synthesis, 29 languages for output
5. **Audio-Visual Vibe Coding** -- Emergent capability: code from audio-visual instructions
6. **Zero-shot Voice Customization** via user-provided samples

### Model Variants

- **Qwen3.5-Omni-Plus**: Full-featured, SOTA performance
- **Qwen3.5-Omni-Flash**: Faster, more efficient

---

## Slide Plan (10 Slides)

### Slide 1: Title Slide
- **Core Message:** Introduction to Qwen3.5-Omni, the latest omnimodal LLM from Qwen Team
- **Content:** Title, subtitle ("A Fully Omnimodal LLM with 256k Context, SOTA Audio, and Native Agentic Capabilities"), authors, date, arXiv ID

### Slide 2: The Vision -- Native Omnimodal Agentic AI
- **Core Message:** Human interaction is inherently omnimodal -- Qwen3.5-Omni mirrors this with native multimodal understanding, reasoning, generation, and action
- **Content:** Evolution from text-only to omnimodal agents; capabilities overview (perceive, reason, act via WebSearch/FunctionCall/speech); real-time streaming interaction

### Slide 3: Architecture Overview -- Thinker-Talker with Hybrid MoE
- **Core Message:** Qwen3.5-Omni uses a dual-module Thinker-Talker architecture, both powered by Hybrid-Attention MoE for efficient inference
- **Content:** Architecture diagram concept; Thinker (text/reasoning) + Talker (streaming speech); AuT audio encoder + SigLIP2 vision encoder; MTP module + Code2Wav decoder; key specs (256k context, 10h audio, 400s video)

### Slide 4: Key Innovation -- ARIA (Adaptive Rate Interleave Alignment)
- **Core Message:** ARIA solves the fundamental instability in streaming speech synthesis by dynamically aligning text and speech token rates
- **Content:** The problem (text/speech tokenizer efficiency mismatch causes skipped words, wrong pronunciation); ARIA solution (adaptive rate constraint, single-channel unified stream); results (improved stability, prosody, minimal latency impact)

### Slide 5: Training Pipeline -- Pretraining and Post-Training
- **Core Message:** A carefully staged training process from encoder alignment to interaction-aligned RL
- **Content:** Pretraining (3 stages: Encoder Alignment, General 4T tokens, Long Context 256k); Post-training Thinker (3 stages: Specialist Distillation, On-Policy Distillation, Interaction-Aligned RL); Post-training Talker (4 stages: General, Long-Context, DPO/GSPO, Custom-Voice)

### Slide 6: Multilingual and Speech Capabilities
- **Core Message:** Unprecedented multilingual reach -- 113 languages for recognition, 29 for synthesis, with zero-shot voice cloning
- **Content:** Language coverage table; Multilingual ASR WER results (6.6% avg on FLEURS, beating Gemini-3.1 Pro's 7.3%); Speech generation WER comparison (Chinese 0.7% vs MiniMax 2.3%, English 0.6%); Speaker similarity scores; Cross-lingual voice cloning results (72% error reduction vs CosyVoice3 on zh-to-ko)

### Slide 7: Evaluation -- Text, Vision and Audio-to-Text Performance
- **Core Message:** Qwen3.5-Omni-Plus maintains text/vision parity with Qwen3.5-Plus while achieving SOTA audio-to-text performance
- **Content:** Text benchmarks comparison (MMLU-Pro 85.9 vs 86.8); Vision parity (MMMU 80.1 vs 80.1); Audio understanding (MMAU 82.2 vs 81.1, VoiceBench 93.1 vs 88.9); ASR superiority (LibriSpeech 1.11 vs 3.36, WenetSpeech 4.30 vs 11.53)

### Slide 8: Evaluation -- Audio-Visual Understanding and Speech Generation
- **Core Message:** State-of-the-art across audio-visual understanding and competitive zero-shot TTS
- **Content:** Audio-visual benchmarks (DailyOmni 84.6 vs 82.7, Qualcomm IVD 68.5 vs 66.2, Omni-Cloze 64.8 vs 57.2); OmniGAIA agent 57.2%; Zero-shot TTS (SEED test-en 1.26 WER); Multilingual TTS superiority across 22/29 languages

### Slide 9: Latency and Concurrency -- Streaming Performance
- **Core Message:** Sub-500ms first-packet latency with high concurrency enables real-time omnimodal interaction
- **Content:** First-packet latency table (Audio: 235ms Flash / 435ms Plus; Video: 426ms / 651ms); Concurrency scaling (1 to 8x); TPS and RTF metrics; Chunked prefilling + Hybrid MoE efficiency; ARIA unified streaming benefit

### Slide 10: Emerging Capabilities and Conclusion
- **Core Message:** Audio-Visual Vibe Coding emerges as a new capability; Qwen3.5-Omni sets a foundation for general-purpose omnimodal agents
- **Content:** Audio-Visual Vibe Coding (coding from audio-visual instructions); Controllable audio-visual captioning with temporal synchronization; Model variants (Plus/Flash) available via API; Conclusion -- scaling native omnimodal training produces unified systems that perceive, reason, interact, and act in real time
