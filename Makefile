# Focus Timer - local development and self-hosting

# The app is a single HTML file (index.html). Its TTS assets live in assets/:
#   assets/kitten/model.mp3                     - Kitten TTS model (~24MB)
#   assets/kitten/expr-voice-*.mp3              - 8 voice embeddings (1KB each)
#   assets/ort/ort-wasm-simd-threaded.jsep.wasm - ONNX Runtime WASM (~24MB)
# These filenames match exactly what index.html requests. Do not rename them.
# `make assets` downloads them from upstream and places them correctly.

APP = index.html
PORT = 8000
ASSETS_DIR = assets
KITTEN_DIR = $(ASSETS_DIR)/kitten
ORT_DIR = $(ASSETS_DIR)/ort
HF_BASE = https://huggingface.co/onnx-community/kitten-tts-nano-0.1-ONNX/resolve/main
VOICES = expr-voice-2-f expr-voice-2-m expr-voice-3-f expr-voice-3-m expr-voice-4-f expr-voice-4-m expr-voice-5-f expr-voice-5-m
ORT_VERSION = 1.23.0
ORT_WASM = ort-wasm-simd-threaded.jsep.wasm
ORT_BASE = https://cdn.jsdelivr.net/npm/onnxruntime-web@$(ORT_VERSION)/dist
DIST_DIR = dist
PACKAGE_ZIP = focus-timer-pwa.zip

.PHONY: help serve assets package clean

help:
	@echo "Targets:"
	@echo "  serve   Serve the app locally at http://localhost:$(PORT)"
	@echo "  assets  Download model/voice/WASM files into $(ASSETS_DIR)/"
	@echo "  package Build $(PACKAGE_ZIP) for self-hosting"
	@echo "  clean   Remove downloaded assets and packaging output"

serve:
	python3 -m http.server $(PORT)

# Downloads upstream files and renames them to the exact paths index.html
# requests. The upstream names differ (model_quantized.onnx, *.bin), so we
# copy to the .mp3 names the app expects. Content is identical, only the
# filename matters.
assets:
	mkdir -p $(KITTEN_DIR) $(ORT_DIR)
	curl -sSL -o $(KITTEN_DIR)/model.mp3 $(HF_BASE)/onnx/model_quantized.onnx
	for v in $(VOICES); do \
		curl -sSL -o $(KITTEN_DIR)/$$v.mp3 $(HF_BASE)/voices/$$v.bin; \
	done
	curl -sSL -o $(ORT_DIR)/$(ORT_WASM) $(ORT_BASE)/$(ORT_WASM)
	@echo "Assets downloaded to $(ASSETS_DIR)/"

# Self-hosting package. Run `make assets` first, and make sure index.html is
# the latest export. Unzip the result on any static host (HTTPS).
package:
	rm -rf $(DIST_DIR) $(PACKAGE_ZIP)
	mkdir -p $(DIST_DIR)
	cp index.html manifest.webmanifest sw.js $(DIST_DIR)/
	cp focus-timer-icon-192.png focus-timer-icon-512.png $(DIST_DIR)/
	@if [ -d $(KITTEN_DIR) ]; then cp -r $(ASSETS_DIR) $(DIST_DIR)/; \
	else echo "WARNING: $(KITTEN_DIR) missing, run 'make assets' first."; fi
	cd $(DIST_DIR) && zip -qr ../$(PACKAGE_ZIP) .
	@echo "Wrote $(PACKAGE_ZIP)"

clean:
	rm -rf $(ASSETS_DIR) $(DIST_DIR) $(PACKAGE_ZIP)
