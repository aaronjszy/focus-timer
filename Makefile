# Focus Timer - local development
#
# The app itself is a single self-contained HTML file. The TTS voice model
# (~24MB), its tokenizer and voice files, and the ONNX Runtime WASM binary
# are downloaded at runtime and are NOT committed.
# `make assets` fetches them locally for offline dev.

APP = focus-timer.html
PORT = 8000
ASSETS_DIR = assets
HF_BASE = https://huggingface.co/onnx-community/kitten-tts-nano-0.1-ONNX/resolve/main
VOICES = expr-voice-2-f expr-voice-2-m expr-voice-3-f expr-voice-3-m expr-voice-4-f expr-voice-4-m expr-voice-5-f expr-voice-5-m
ORT_VERSION = 1.23.0
ORT_WASM = ort-wasm-simd-threaded.jsep.wasm
ORT_BASE = https://cdn.jsdelivr.net/npm/onnxruntime-web@$(ORT_VERSION)/dist

.PHONY: help serve assets clean

help:
	@echo "Targets:"
	@echo "  serve   Serve the app locally at http://localhost:$(PORT)"
	@echo "  assets  Download TTS model files into $(ASSETS_DIR)/ (not committed)"
	@echo "  clean   Remove downloaded assets"

serve:
	python3 -m http.server $(PORT)

assets:
	mkdir -p $(ASSETS_DIR)/voices
	curl -sSL -o $(ASSETS_DIR)/model_quantized.onnx $(HF_BASE)/model_quantized.onnx
	curl -sSL -o $(ASSETS_DIR)/tokenizer.json $(HF_BASE)/tokenizer.json
	for v in $(VOICES); do \
		curl -sSL -o $(ASSETS_DIR)/voices/$$v.bin $(HF_BASE)/voices/$$v.bin; \
	done
	curl -sSL -o $(ASSETS_DIR)/$(ORT_WASM) $(ORT_BASE)/$(ORT_WASM)
	@echo "Assets downloaded to $(ASSETS_DIR)/"

clean:
	rm -rf $(ASSETS_DIR)
