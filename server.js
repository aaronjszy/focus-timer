import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';

// Ensure required directories exist
fs.mkdirSync(path.join(__dirname, 'assets', 'kitten'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'assets', 'ort'), { recursive: true });

// Upstream URLs for remote asset caching if not present on disk
const HF_BASE = 'https://huggingface.co/onnx-community/kitten-tts-nano-0.1-ONNX/resolve/main';
const UPSTREAM_ASSETS = {
  '/assets/kitten/model.mp3': `${HF_BASE}/onnx/model_quantized.onnx`,
  '/assets/ort/ort-wasm-simd-threaded.jsep.wasm': 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.23.0/dist/ort-wasm-simd-threaded.jsep.wasm',
  '/assets/kitten/expr-voice-2-f.mp3': `${HF_BASE}/voices/expr-voice-2-f.bin`,
  '/assets/kitten/expr-voice-2-m.mp3': `${HF_BASE}/voices/expr-voice-2-m.bin`,
  '/assets/kitten/expr-voice-3-f.mp3': `${HF_BASE}/voices/expr-voice-3-f.bin`,
  '/assets/kitten/expr-voice-3-m.mp3': `${HF_BASE}/voices/expr-voice-3-m.bin`,
  '/assets/kitten/expr-voice-4-f.mp3': `${HF_BASE}/voices/expr-voice-4-f.bin`,
  '/assets/kitten/expr-voice-4-m.mp3': `${HF_BASE}/voices/expr-voice-4-m.bin`,
  '/assets/kitten/expr-voice-5-f.mp3': `${HF_BASE}/voices/expr-voice-5-f.bin`,
  '/assets/kitten/expr-voice-5-m.mp3': `${HF_BASE}/voices/expr-voice-5-m.bin`
};

// Middleware to transparently cache large upstream assets if missing from disk
app.use(async (req, res, next) => {
  const upstreamUrl = UPSTREAM_ASSETS[req.path];
  if (!upstreamUrl) return next();

  const localFilePath = path.join(__dirname, req.path.replace(/^\//, ''));
  if (fs.existsSync(localFilePath) && fs.statSync(localFilePath).size > 0) {
    return next();
  }

  try {
    console.log(`[Cache] Fetching missing asset: ${req.path} from upstream...`);
    const upstreamRes = await fetch(upstreamUrl);
    if (!upstreamRes.ok) {
      console.error(`[Cache] Upstream fetch failed for ${req.path}: ${upstreamRes.status}`);
      return next();
    }
    const arrayBuffer = await upstreamRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(localFilePath, buffer);
    console.log(`[Cache] Saved ${req.path} (${buffer.length} bytes) to disk`);
    
    if (req.path.endsWith('.wasm')) {
      res.setHeader('Content-Type', 'application/wasm');
    } else if (req.path.endsWith('.mp3')) {
      res.setHeader('Content-Type', 'audio/mpeg');
    }
    return res.send(buffer);
  } catch (err) {
    console.error(`[Cache] Error caching ${req.path}:`, err);
    return next();
  }
});

// Configure MIME types for static serving
express.static.mime.define({
  'application/wasm': ['wasm'],
  'application/manifest+json': ['webmanifest'],
  'audio/mpeg': ['mp3']
});

// Serve static assets from project root
app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.wasm')) {
      res.setHeader('Content-Type', 'application/wasm');
    }
    // Allow Service Worker and SharedArrayBuffer features if available
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  }
}));

// Fallback to index.html for root or client navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Focus Timer server running on http://${HOST}:${PORT}`);
});
