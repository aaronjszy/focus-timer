# Focus Timer - local development and self-hosting
#
# The app itself is a single HTML file. The TTS voice model (~24MB),
# voice embeddings, and the ONNX Runtime WASM binary are downloaded
# at runtime and are NOT committed.
# `make assets` fetches them locally into assets/ (mirrors the hosted layout).

APP = focus-timer.html
PORT = 8000
ASSETS_DIR = assets
KITTEN_DIR = $(ASSETS_DIR)/kitten
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
	@echo "  assets  Download model/voice/WASM files into $(ASSETS_DIR)/ (not committed)"
	@echo "  package Build $(PACKAGE_ZIP) for self-hosting (needs $(APP) + assets)"
	@echo "  clean   Remove downloaded assets and packaging output"

serve:
	python3 -m http.server $(PORT)

assets:
	mkdir -p $(KITTEN_DIR)/voices
	curl -sSL -o $(KITTEN_DIR)/model_quantized.onnx $(HF_BASE)/model_quantized.onnx
	for v in $(VOICES); do \
		curl -sSL -o $(KITTEN_DIR)/voices/$$v.bin $(HF_BASE)/voices/$$v.bin; \
	done
	curl -sSL -o $(ASSETS_DIR)/$(ORT_WASM) $(ORT_BASE)/$(ORT_WASM)
	@echo "Assets downloaded to $(ASSETS_DIR)/"

# Self-hosting package. Run `make assets` first, and make sure $(APP) is the
# latest exported HTML. Unzip the result on any static host (HTTPS).
# This fixes the Muse share-page issues: no banner, the shortcut is named
# "Focus Timer" from manifest.webmanifest, and it opens your own URL.
# Note: no service worker is included (the single-file export doesn't have
# one), so install via "Add to Home screen". Offline use is not supported.
# If the app reports a missing asset, its debug log names the exact path it
# tried; adjust the assets/ layout below to match.
package:
	rm -rf $(DIST_DIR) $(PACKAGE_ZIP)
	mkdir -p $(DIST_DIR)
	cp $(APP) $(DIST_DIR)/index.html
	cp manifest.webmanifest $(DIST_DIR)/
	@if [ -d $(KITTEN_DIR) ]; then cp -r $(ASSETS_DIR) $(DIST_DIR)/; \
	else echo "WARNING: $(KITTEN_DIR) missing, run 'make assets' first."; fi
	cd $(DIST_DIR) && zip -qr ../$(PACKAGE_ZIP) .
	@echo "Wrote $(PACKAGE_ZIP)"

clean:
	rm -rf $(ASSETS_DIR) $(DIST_DIR) $(PACKAGE_ZIP)
