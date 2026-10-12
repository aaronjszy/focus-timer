(function () {
      'use strict';
      var cueInput = document.getElementById('cueInput');
      var cueWord = document.getElementById('cueWord');
      var durationOutput = document.getElementById('durationOutput');
      var timeDisplay = document.getElementById('timeDisplay');
      var nextCue = document.getElementById('nextCue');
      var trackPosition = document.getElementById('trackPosition');
      var voiceSelect = document.getElementById('voiceSelect');
      var intervalSelect = document.getElementById('intervalSelect');
      var minusBtn = document.getElementById('minusBtn');
      var plusBtn = document.getElementById('plusBtn');
      var addTrackBtn = document.getElementById('addTrackBtn');
      var queueList = document.getElementById('queueList');
      var queueCount = document.getElementById('queueCount');
      var recordNote = document.getElementById('recordNote');
      var testCueBtn = document.getElementById('testCueBtn');
      var startBtn = document.getElementById('startBtn');
      var previousBtn = document.getElementById('previousBtn');
      var nextBtn = document.getElementById('nextBtn');
      var resetBtn = document.getElementById('resetBtn');
      var statusText = document.getElementById('statusText');
      var timerPanel = document.getElementById('timerPanel');
      var dial = document.getElementById('dial');
      var screenNote = document.getElementById('screenNote');
      var audio = document.getElementById('backgroundAudio');
      var debugPanel = document.getElementById('debugPanel');
      var debugLog = document.getElementById('debugLog');
      var copyDebugBtn = document.getElementById('copyDebugBtn');
      var exportListBtn = document.getElementById('exportListBtn');
      var importListBtn = document.getElementById('importListBtn');
      var clearListBtn = document.getElementById('clearListBtn');
      var transferPanel = document.getElementById('transferPanel');
      var transferTitle = document.getElementById('transferTitle');
      var transferHelp = document.getElementById('transferHelp');
      var transferText = document.getElementById('transferText');
      var copyListBtn = document.getElementById('copyListBtn');
      var applyImportBtn = document.getElementById('applyImportBtn');
      var closeTransferBtn = document.getElementById('closeTransferBtn');
      var transferStatus = document.getElementById('transferStatus');

      var AUDIO_MODULE_URL = 'https://cdn.jsdelivr.net/npm/tts-pipelines@0.2.8/+esm';
      var AUDIO_MODEL_ID = 'Kitten Nano v0.1 browser ONNX';
      var KITTEN_REMOTE_BASE = 'https://huggingface.co/onnx-community/kitten-tts-nano-0.1-ONNX/resolve/main/';
      var ONNX_WASM_REMOTE_URL = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.23.0/dist/ort-wasm-simd-threaded.jsep.wasm';
      function hostedAssetPath(path) {
        if (/\/assets\/assets\/(?:app|index)\.html$/.test(location.pathname)) return '../' + path;
        if (/\/assets\/(?:app|index)\.html$/.test(location.pathname)) return './' + path;
        return 'assets/' + path;
      }
      var KITTEN_ASSET_BASE = location.protocol === 'file:' ? KITTEN_REMOTE_BASE : hostedAssetPath('kitten/');
      var KITTEN_MODEL_URL = KITTEN_ASSET_BASE + (location.protocol === 'file:' ? 'onnx/model_quantized.onnx' : 'model.mp3');
      var ONNX_WASM_URL = location.protocol === 'file:'
        ? ONNX_WASM_REMOTE_URL
        : hostedAssetPath('ort/ort-wasm-simd-threaded.jsep.wasm');
      var KITTEN_TOKENIZER = {"version":"1.0","truncation":null,"padding":null,"added_tokens":[],"normalizer":{"type":"Replace","pattern":{"Regex":"[^$;:,.!?¡¿—…\"«» ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzɑɐɒæɓʙβɔɕçɗɖðʤəɘɚɛɜɝɞɟʄɡɠɢʛɦɧħɥʜɨɪʝɭɬɫɮʟɱɯɰŋɳɲɴøɵɸθœɶʘɹɺɾɻʀʁɽʂʃʈʧʉʊʋⱱʌɣɤʍχʎʏʑʐʒʔʡʕʢǀǁǂǃˈˌːˑʼʴʰʱʲʷˠˤ˞↓↑→↗↘'̩ᵻ]"},"content":""},"pre_tokenizer":{"type":"Split","pattern":{"Regex":""},"behavior":"Isolated","invert":false},"post_processor":{"type":"TemplateProcessing","single":[{"SpecialToken":{"id":"$","type_id":0}},{"Sequence":{"id":"A","type_id":0}},{"SpecialToken":{"id":"$","type_id":0}}],"special_tokens":{"$":{"id":"$","ids":[0],"tokens":["$"]}}},"decoder":null,"model":{"vocab":{"$":0,";":1,":":2,",":3,".":4,"!":5,"?":6,"¡":7,"¿":8,"—":9,"…":10,"\"":15,"«":12,"»":13," ":16,"A":17,"B":18,"C":19,"D":20,"E":21,"F":22,"G":23,"H":24,"I":25,"J":26,"K":27,"L":28,"M":29,"N":30,"O":31,"P":32,"Q":33,"R":34,"S":35,"T":36,"U":37,"V":38,"W":39,"X":40,"Y":41,"Z":42,"a":43,"b":44,"c":45,"d":46,"e":47,"f":48,"g":49,"h":50,"i":51,"j":52,"k":53,"l":54,"m":55,"n":56,"o":57,"p":58,"q":59,"r":60,"s":61,"t":62,"u":63,"v":64,"w":65,"x":66,"y":67,"z":68,"ɑ":69,"ɐ":70,"ɒ":71,"æ":72,"ɓ":73,"ʙ":74,"β":75,"ɔ":76,"ɕ":77,"ç":78,"ɗ":79,"ɖ":80,"ð":81,"ʤ":82,"ə":83,"ɘ":84,"ɚ":85,"ɛ":86,"ɜ":87,"ɝ":88,"ɞ":89,"ɟ":90,"ʄ":91,"ɡ":92,"ɠ":93,"ɢ":94,"ʛ":95,"ɦ":96,"ɧ":97,"ħ":98,"ɥ":99,"ʜ":100,"ɨ":101,"ɪ":102,"ʝ":103,"ɭ":104,"ɬ":105,"ɫ":106,"ɮ":107,"ʟ":108,"ɱ":109,"ɯ":110,"ɰ":111,"ŋ":112,"ɳ":113,"ɲ":114,"ɴ":115,"ø":116,"ɵ":117,"ɸ":118,"θ":119,"œ":120,"ɶ":121,"ʘ":122,"ɹ":123,"ɺ":124,"ɾ":125,"ɻ":126,"ʀ":127,"ʁ":128,"ɽ":129,"ʂ":130,"ʃ":131,"ʈ":132,"ʧ":133,"ʉ":134,"ʊ":135,"ʋ":136,"ⱱ":137,"ʌ":138,"ɣ":139,"ɤ":140,"ʍ":141,"χ":142,"ʎ":143,"ʏ":144,"ʑ":145,"ʐ":146,"ʒ":147,"ʔ":148,"ʡ":149,"ʕ":150,"ʢ":151,"ǀ":152,"ǁ":153,"ǂ":154,"ǃ":155,"ˈ":156,"ˌ":157,"ː":158,"ˑ":159,"ʼ":160,"ʴ":161,"ʰ":162,"ʱ":163,"ʲ":164,"ʷ":165,"ˠ":166,"ˤ":167,"˞":168,"↓":169,"↑":170,"→":171,"↗":172,"↘":173,"'":176,"̩":175,"ᵻ":177}}};
      var KITTEN_VOICE_URLS = {
        'expr-voice-2-f': KITTEN_ASSET_BASE + (location.protocol === 'file:' ? 'voices/expr-voice-2-f.bin' : 'expr-voice-2-f.mp3'),
        'expr-voice-2-m': KITTEN_ASSET_BASE + (location.protocol === 'file:' ? 'voices/expr-voice-2-m.bin' : 'expr-voice-2-m.mp3'),
        'expr-voice-3-f': KITTEN_ASSET_BASE + (location.protocol === 'file:' ? 'voices/expr-voice-3-f.bin' : 'expr-voice-3-f.mp3'),
        'expr-voice-3-m': KITTEN_ASSET_BASE + (location.protocol === 'file:' ? 'voices/expr-voice-3-m.bin' : 'expr-voice-3-m.mp3'),
        'expr-voice-4-f': KITTEN_ASSET_BASE + (location.protocol === 'file:' ? 'voices/expr-voice-4-f.bin' : 'expr-voice-4-f.mp3'),
        'expr-voice-4-m': KITTEN_ASSET_BASE + (location.protocol === 'file:' ? 'voices/expr-voice-4-m.bin' : 'expr-voice-4-m.mp3'),
        'expr-voice-5-f': KITTEN_ASSET_BASE + (location.protocol === 'file:' ? 'voices/expr-voice-5-f.bin' : 'expr-voice-5-f.mp3'),
        'expr-voice-5-m': KITTEN_ASSET_BASE + (location.protocol === 'file:' ? 'voices/expr-voice-5-m.bin' : 'expr-voice-5-m.mp3')
      };
      var audioDebugEntries = [];
      var durationMinutes = 10;
      var queue = [];
      var activeIndex = -1;
      var remainingMs = 0;
      var totalMs = 0;
      var endAt = 0;
      var nextCueAt = 0;
      var pausedCueRemaining = 0;
      var tickHandle = null;
      var state = 'idle';
      var preparing = false;
      var previewing = false;
      var kittenModulePromise = null;
      var synthesizerPromise = null;
      var speechCache = Object.create(null);
      var unlockUrl = '';
      var nextId = 1;
      var trackSwitchToken = 0;
      var dragState = null;

      function cleanCue() { return cueInput.value.trim(); }
      function formatTime(ms) {
        var seconds = Math.max(0, Math.ceil(ms / 1000));
        return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
      }
      function intervalLabel(seconds) {
        if (seconds === 60) return 'minute';
        if (seconds < 60) return seconds + ' seconds';
        return (seconds / 60) + ' minutes';
      }
      function minuteAnnouncement(minutes) {
        return minutes + (minutes === 1 ? ' minute' : ' minutes');
      }
      function cueMinuteValues(item) {
        var values = [];
        var seen = {};
        var totalSeconds = item.duration * 60;
        for (var offset = 0; offset < totalSeconds; offset += item.interval) {
          var minutes = Math.max(1, Math.ceil((totalSeconds - offset) / 60));
          if (!seen[minutes]) {
            seen[minutes] = true;
            values.push(minutes);
          }
        }
        return values;
      }
      function pluralTracks(count) { return count + (count === 1 ? ' track' : ' tracks'); }
      function currentTrack() { return activeIndex >= 0 ? queue[activeIndex] : null; }
      function allTracksReady() {
        return queue.length > 0 && queue.every(function (item) { return !!item.url; });
      }
      var STORAGE_KEY = 'focus_timer_queue_v1';

      function makeTrack(cue, duration, voiceText, voiceId, interval) {
        var vId = voiceId || voiceSelect.value;
        var vText = voiceText;
        if (!vText) {
          var opt = voiceSelect.options[voiceSelect.selectedIndex];
          vText = opt ? opt.text : 'Bella';
        }
        var intVal = interval != null ? Number(interval) : Number(intervalSelect.value);
        return {
          id: nextId++,
          cue: cue,
          voice: vText,
          voiceId: vId,
          interval: intVal,
          duration: duration,
          minuteCues: {},
          doneCue: null,
          url: '',
          buildPromise: null,
          preparingAudio: false,
          buildError: false,
          removed: false
        };
      }

      function saveQueueToStorage() {
        try {
          var serialized = queue.map(function (item) {
            return {
              cue: item.cue,
              duration: item.duration,
              voice: item.voice,
              voiceId: item.voiceId,
              interval: item.interval
            };
          });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
        } catch (error) {}
      }

      function loadQueueFromStorage() {
        try {
          var raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) return false;
          var list = JSON.parse(raw);
          if (!Array.isArray(list) || !list.length) return false;
          var loaded = [];
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (!item || typeof item.cue !== 'string') continue;
            var cue = item.cue.trim();
            var duration = Number(item.duration);
            if (!cue || isNaN(duration) || duration < 1 || duration > 60) continue;
            loaded.push(makeTrack(cue, duration, item.voice, item.voiceId, item.interval));
          }
          if (!loaded.length) return false;
          queue = loaded;
          activeIndex = 0;
          totalMs = queue[0].duration * 60000;
          remainingMs = totalMs;
          statusText.textContent = 'Playlist ready to build';
          screenNote.textContent = 'Add another timer, rearrange the list, or start the playlist.';
          return true;
        } catch (error) {
          return false;
        }
      }

      function clearQueue() {
        if (preparing || state === 'running' || !queue.length) return;
        stopTicking();
        audio.pause();
        audio.removeAttribute('src');
        queue.forEach(function (item) {
          item.removed = true;
          if (item.url) URL.revokeObjectURL(item.url);
        });
        queue = [];
        activeIndex = -1;
        totalMs = 0;
        remainingMs = 0;
        state = 'idle';
        timerPanel.classList.remove('running', 'flash');
        resetBtn.disabled = true;
        statusText.textContent = 'Ready when you are';
        screenNote.textContent = 'Add timers in the order you want to complete them.';
        saveQueueToStorage();
        updateReadiness();
        renderTimer();
      }
      function serializeQueue() {
        return queue.map(function (item) { return item.cue + ' ' + item.duration; }).join('\n');
      }
      function exportQueue() {
        transferTitle.textContent = 'Export timer list';
        transferHelp.textContent = 'The list is copied as one timer per line, with the timer length in minutes at the end.';
        transferText.value = serializeQueue();
        transferText.readOnly = true;
        copyListBtn.hidden = false;
        applyImportBtn.hidden = true;
        transferStatus.textContent = '';
        transferPanel.hidden = false;
        copyTransferText();
      }
      function openImportPanel() {
        transferTitle.textContent = 'Import timer list';
        transferHelp.textContent = 'Paste one timer per line with whole minutes last, like “Deep work 25”. Imported timers use the voice and repeat interval selected above.';
        transferText.value = '';
        transferText.readOnly = false;
        copyListBtn.hidden = true;
        applyImportBtn.hidden = false;
        applyImportBtn.disabled = preparing || state === 'running' || state === 'paused';
        transferStatus.textContent = applyImportBtn.disabled ? 'Reset the playlist before importing.' : '';
        transferPanel.hidden = false;
        transferText.focus();
      }
      function closeTransferPanel() {
        transferPanel.hidden = true;
        transferStatus.textContent = '';
      }
      function copyTransferText() {
        var text = transferText.value;
        if (!text) return;
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(function () {
            transferStatus.textContent = 'Copied to clipboard.';
          }).catch(function () {
            transferText.focus();
            transferText.select();
            transferStatus.textContent = 'Text selected — copy it from the menu.';
          });
          return;
        }
        transferText.focus();
        transferText.select();
        var copied = false;
        try { copied = document.execCommand('copy'); } catch (error) {}
        transferStatus.textContent = copied ? 'Copied.' : 'Text selected — copy it from the menu.';
      }
      function parseImportText(text) {
        var sourceLines = text.split(/\r?\n/);
        var items = [];
        for (var lineIndex = 0; lineIndex < sourceLines.length; lineIndex++) {
          var line = sourceLines[lineIndex].trim();
          if (!line) continue;
          var match = line.match(/^(.*?)\s+(\d+)$/);
          if (!match || !match[1].trim()) {
            throw new Error('Line ' + (lineIndex + 1) + ' must end with whole minutes, like “Deep work 25”.');
          }
          var cue = match[1].trim();
          var minutes = Number(match[2]);
          if (cue.length > 128) throw new Error('Line ' + (lineIndex + 1) + ' has a cue descriptor longer than 128 characters.');
          if (minutes < 1 || minutes > 60) throw new Error('Line ' + (lineIndex + 1) + ' must use 1–60 minutes.');
          items.push({ cue: cue, duration: minutes });
        }
        if (!items.length) throw new Error('Paste at least one timer line.');
        return items;
      }

      function errorText(error) {
        if (!error) return 'Unknown error';
        var name = error.name ? error.name + ': ' : '';
        var message = error.message || String(error);
        return name + message;
      }

      function beginAudioAttempt(kind) {
        audioDebugEntries = [
          new Date().toISOString() + ' | ' + kind + ' started',
          'module=' + AUDIO_MODULE_URL,
          'model=' + AUDIO_MODEL_ID,
          'browser=' + navigator.userAgent,
          'online=' + navigator.onLine + ', secureContext=' + window.isSecureContext + ', importShim=' + (typeof window.importShim)
        ];
        debugLog.value = audioDebugEntries.join('\n');
        debugPanel.hidden = true;
        copyDebugBtn.textContent = 'Copy debug log';
      }

      function addAudioDebug(stage, detail) {
        audioDebugEntries.push(new Date().toISOString() + ' | ' + stage + ' | ' + detail);
        debugLog.value = audioDebugEntries.join('\n');
      }

      function showAudioFailure(stage, error) {
        addAudioDebug(stage, errorText(error));
        if (error && error.stack) addAudioDebug('stack', String(error.stack).split('\n').slice(0, 5).join(' / '));
        debugPanel.hidden = false;
      }

      function writeWavHeader(view, sampleRate, sampleCount) {
        function text(offset, value) { for (var i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i)); }
        text(0, 'RIFF');
        view.setUint32(4, 36 + sampleCount * 2, true);
        text(8, 'WAVE');
        text(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        text(36, 'data');
        view.setUint32(40, sampleCount * 2, true);
      }

      function encodeCueWav(samples, sampleRate) {
        var wav = new ArrayBuffer(44 + samples.length * 2);
        var view = new DataView(wav);
        writeWavHeader(view, sampleRate, samples.length);
        for (var i = 0; i < samples.length; i++) {
          var value = Math.max(-1, Math.min(1, samples[i]));
          view.setInt16(44 + i * 2, value < 0 ? value * 32768 : value * 32767, true);
        }
        return new Blob([wav], { type: 'audio/wav' });
      }

      function resampleToInt16(samples, sourceRate, targetRate, maxSamples) {
        var outputLength = Math.floor(samples.length * targetRate / sourceRate);
        if (typeof maxSamples === 'number') outputLength = Math.min(outputLength, maxSamples);
        var output = new Int16Array(outputLength);
        for (var i = 0; i < outputLength; i++) {
          var sourceIndex = Math.min(samples.length - 1, Math.floor(i * sourceRate / targetRate));
          var value = Math.max(-1, Math.min(1, samples[sourceIndex]));
          output[i] = value < 0 ? value * 32768 : value * 32767;
        }
        return output;
      }

      function encodeTrack(item) {
        var sampleRate = 8000;
        var countdownSamples = item.duration * 60 * sampleRate;
        var doneCue = resampleToInt16(item.doneCue.samples, item.doneCue.sampleRate, sampleRate);
        var endingPad = Math.floor(sampleRate * 0.18);
        var totalSamples = countdownSamples + doneCue.length + endingPad;
        var wav = new ArrayBuffer(44 + totalSamples * 2);
        var view = new DataView(wav);
        writeWavHeader(view, sampleRate, totalSamples);
        var target = new Int16Array(wav, 44);
        var intervalSamples = item.interval * sampleRate;
        for (var offset = 0; offset < countdownSamples; offset += intervalSamples) {
          var minutes = Math.max(1, Math.ceil((countdownSamples - offset) / (60 * sampleRate)));
          var phrase = item.minuteCues[minutes];
          if (!phrase) continue;
          var cue = resampleToInt16(phrase.samples, phrase.sampleRate, sampleRate, intervalSamples);
          target.set(cue.subarray(0, Math.min(cue.length, countdownSamples - offset)), offset);
        }
        target.set(doneCue, countdownSamples);
        return new Blob([wav], { type: 'audio/wav' });
      }

      function pulse() {
        timerPanel.classList.remove('flash');
        void timerPanel.offsetWidth;
        timerPanel.classList.add('flash');
        if (navigator.vibrate) navigator.vibrate(60);
      }

      function setEditorLocked(locked) {
        cueInput.disabled = locked;
        voiceSelect.disabled = locked;
        intervalSelect.disabled = locked;
        minusBtn.disabled = locked;
        plusBtn.disabled = locked;
        addTrackBtn.disabled = locked || !cleanCue();
        testCueBtn.disabled = locked || previewing || !cleanCue() || state === 'running';
        importListBtn.disabled = locked || state === 'running' || state === 'paused';
        applyImportBtn.disabled = locked || state === 'running' || state === 'paused';
        clearListBtn.disabled = locked || state === 'running' || !queue.length;
        Array.prototype.forEach.call(queueList.querySelectorAll('.queue-action'), function (button) {
          button.disabled = locked;
        });
      }

      function renderQueue() {
        var activeTaskLocked = state === 'running';
        queueCount.textContent = pluralTracks(queue.length);
        queueList.innerHTML = '';
        if (!queue.length) {
          var empty = document.createElement('p');
          empty.className = 'queue-empty';
          empty.textContent = 'Your timer list is empty.';
          queueList.appendChild(empty);
        } else {
          queue.forEach(function (item, index) {
            var row = document.createElement('div');
            row.className = 'queue-item' + (index === activeIndex ? ' active' : '') + (item.preparingAudio ? ' is-preparing' : '') + (dragState && dragState.id === item.id ? ' dragging' : '');
            row.dataset.index = index;
            row.dataset.itemId = item.id;
            var number = document.createElement('div');
            number.className = 'queue-number';
            number.textContent = index + 1;
            var copy = document.createElement('div');
            copy.className = 'queue-copy';
            var name = document.createElement('div');
            name.className = 'queue-name';
            name.textContent = item.cue;
            var meta = document.createElement('div');
            meta.className = 'queue-meta';
            meta.textContent = item.preparingAudio ? 'Preparing ' + item.voice + '…' : (item.buildError ? 'Audio will retry when needed' : item.voice + ' · ' + item.duration + (item.duration === 1 ? ' min' : ' mins') + ' · cue every ' + intervalLabel(item.interval));
            copy.appendChild(name);
            copy.appendChild(meta);
            var actions = document.createElement('div');
            actions.className = 'queue-actions';
            var handle = document.createElement('button');
            handle.className = 'queue-action queue-drag-handle';
            handle.type = 'button';
            handle.dataset.itemId = item.id;
            handle.setAttribute('aria-label', 'Drag to reorder ' + item.cue + '. Use the up and down arrow keys for keyboard reordering.');
            handle.title = 'Drag to reorder';
            handle.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="8" cy="6" r="1.6"/><circle cx="16" cy="6" r="1.6"/><circle cx="8" cy="12" r="1.6"/><circle cx="16" cy="12" r="1.6"/><circle cx="8" cy="18" r="1.6"/><circle cx="16" cy="18" r="1.6"/></svg>';
            handle.disabled = preparing || (activeTaskLocked && index === activeIndex);
            var remove = document.createElement('button');
            remove.className = 'queue-action queue-remove';
            remove.type = 'button';
            remove.dataset.index = index;
            remove.setAttribute('aria-label', 'Remove ' + item.cue);
            remove.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
            remove.disabled = preparing || (activeTaskLocked && index === activeIndex);
            actions.appendChild(handle);
            actions.appendChild(remove);
            row.appendChild(number);
            row.appendChild(copy);
            row.appendChild(actions);
            queueList.appendChild(row);
          });
        }
        addTrackBtn.disabled = preparing || !cleanCue();
        exportListBtn.disabled = !queue.length;
        importListBtn.disabled = preparing || state === 'running' || state === 'paused';
        applyImportBtn.disabled = preparing || state === 'running' || state === 'paused';
        clearListBtn.disabled = preparing || state === 'running' || !queue.length;
        if (!transferPanel.hidden && !copyListBtn.hidden) transferText.value = serializeQueue();
      }

      function renderTimer() {
        var item = currentTrack();
        cueWord.textContent = item ? item.cue : '';
        trackPosition.textContent = item ? 'Track ' + (activeIndex + 1) + ' of ' + queue.length : 'No track selected';
        timeDisplay.textContent = formatTime(remainingMs);
        dial.setAttribute('aria-label', item ? formatTime(remainingMs) + ' remaining in ' + item.cue : 'No timer selected');
        var elapsedRatio = totalMs ? 1 - remainingMs / totalMs : 0;
        dial.style.setProperty('--progress', Math.max(0, Math.min(360, elapsedRatio * 360)) + 'deg');
        if (!item) nextCue.textContent = 'Add a timer to begin';
        else if (state === 'running' && remainingMs <= 0) nextCue.textContent = 'Time is up';
        else if (state === 'running') nextCue.textContent = 'Next cue in ' + formatTime(Math.max(0, nextCueAt - Date.now()));
        else if (state === 'paused') nextCue.textContent = 'Cue paused';
        else if (state === 'done') nextCue.textContent = 'Playlist complete';
        else nextCue.textContent = 'Cue every ' + intervalLabel(item.interval);
        var activePlayback = state === 'running' || state === 'paused';
        previousBtn.disabled = !item || preparing || (!activePlayback && activeIndex <= 0);
        nextBtn.disabled = !item || preparing || (!activePlayback && activeIndex >= queue.length - 1);
        testCueBtn.disabled = !cleanCue() || preparing || previewing || state === 'running';
        renderQueue();
      }

      function updateReadiness() {
        if (state === 'running' || state === 'paused') return;
        if (preparing) {
          startBtn.disabled = true;
          return;
        }
        if (!queue.length) {
          startBtn.textContent = 'Start playlist';
          startBtn.disabled = true;
          recordNote.textContent = 'Add at least one timer. Start will create every cue and build one audio track per task.';
        } else if (allTracksReady()) {
          startBtn.textContent = state === 'done' ? 'Play again' : 'Start playlist';
          startBtn.disabled = false;
          recordNote.textContent = pluralTracks(queue.length) + ' ready for background playback.';
        } else {
          startBtn.textContent = 'Start playlist';
          startBtn.disabled = false;
          recordNote.textContent = 'Start will create every cue and build one audio track per task.';
        }
        addTrackBtn.disabled = !cleanCue();
      }

      function applyImportedList() {
        if (preparing || state === 'running' || state === 'paused') {
          transferStatus.textContent = 'Reset the playlist before importing.';
          return;
        }
        var imported;
        try {
          imported = parseImportText(transferText.value);
        } catch (error) {
          transferStatus.textContent = error.message;
          return;
        }
        stopTicking();
        audio.pause();
        audio.removeAttribute('src');
        queue.forEach(function (item) {
          item.removed = true;
          if (item.url) URL.revokeObjectURL(item.url);
        });
        queue = imported.map(function (item) { return makeTrack(item.cue, item.duration); });
        saveQueueToStorage();
        activeIndex = 0;
        state = 'idle';
        totalMs = queue[0].duration * 60000;
        remainingMs = totalMs;
        timerPanel.classList.remove('running', 'flash');
        resetBtn.disabled = true;
        statusText.textContent = 'Imported list ready';
        screenNote.textContent = 'Review the imported timers, then press Start playlist.';
        transferStatus.textContent = pluralTracks(queue.length) + ' imported.';
        updateReadiness();
        renderTimer();
      }

      function addTrack() {
        var cue = cleanCue();
        if (!cue || preparing) return;
        var item = makeTrack(cue, durationMinutes);
        queue.push(item);
        saveQueueToStorage();
        if (activeIndex < 0) {
          activeIndex = 0;
          totalMs = queue[0].duration * 60000;
          remainingMs = totalMs;
        }
        cueInput.value = '';
        if (state === 'running' || state === 'paused') {
          screenNote.textContent = state === 'running' ? 'New timer added. You can keep editing every task except the active one.' : 'New timer added. While paused, any timer can be reordered or removed.';
          buildAddedTrack(item);
        } else {
          statusText.textContent = 'Playlist ready to build';
          screenNote.textContent = 'Add another timer, rearrange the list, or start the playlist.';
        }
        updateReadiness();
        renderTimer();
        cueInput.focus();
      }

      function removeTrack(index) {
        var activePlayback = state === 'running' || state === 'paused';
        var removingPausedTask = state === 'paused' && index === activeIndex;
        var item = queue[index];
        if (preparing || !item || (state === 'running' && index === activeIndex)) return;
        item.removed = true;
        if (item.url) URL.revokeObjectURL(item.url);
        queue.splice(index, 1);
        saveQueueToStorage();
        if (index < activeIndex) activeIndex--;
        if (!queue.length) activeIndex = -1;
        else activeIndex = Math.min(activeIndex, queue.length - 1);
        if (!activePlayback || (removingPausedTask && !queue.length)) {
          audio.pause();
          audio.removeAttribute('src');
          state = 'idle';
          if (activeIndex >= 0) {
            totalMs = queue[activeIndex].duration * 60000;
            remainingMs = totalMs;
          } else {
            totalMs = 0;
            remainingMs = 0;
          }
          statusText.textContent = queue.length ? 'Playlist ready to build' : 'Ready when you are';
          screenNote.textContent = queue.length ? 'Add another timer, rearrange the list, or start the playlist.' : 'Add timers in the order you want to complete them.';
        } else if (removingPausedTask) {
          audio.pause();
          audio.removeAttribute('src');
          totalMs = queue[activeIndex].duration * 60000;
          remainingMs = totalMs;
          pausedCueRemaining = queue[activeIndex].interval * 1000;
          statusText.textContent = 'Paused';
          screenNote.textContent = 'Timer removed. The selected task remains paused.';
          renderTimer();
          playPreparedTrack(activeIndex, false);
          return;
        } else {
          screenNote.textContent = state === 'running' ? 'Timer removed. The active task keeps playing.' : 'Timer removed. The playlist remains paused.';
          syncMediaSession(state === 'running');
        }
        updateReadiness();
        renderTimer();
      }

      function moveTrackTo(index, target) {
        if (preparing || index === target || !queue[index] || !queue[target]) return false;
        if (state === 'running' && index === activeIndex) return false;
        var activeId = currentTrack() ? currentTrack().id : null;
        var moved = queue.splice(index, 1)[0];
        queue.splice(target, 0, moved);
        saveQueueToStorage();
        if (activeId !== null) activeIndex = queue.findIndex(function (item) { return item.id === activeId; });
        screenNote.textContent = state === 'running' ? 'Queue updated. The active task keeps playing.' : (state === 'paused' ? 'Queue updated. The playlist remains paused.' : 'Timer list reordered.');
        syncMediaSession(state === 'running');
        renderTimer();
        return true;
      }

      function moveTrack(index, direction) {
        moveTrackTo(index, index + direction);
      }

      function startQueueDrag(event) {
        var handle = event.target.closest('.queue-drag-handle');
        if (!handle || handle.disabled || preparing) return;
        var itemId = Number(handle.dataset.itemId);
        var index = queue.findIndex(function (item) { return item.id === itemId; });
        if (index < 0 || (state === 'running' && index === activeIndex)) return;
        event.preventDefault();
        handle.focus();
        dragState = { id: itemId, pointerId: event.pointerId, moved: false };
        document.body.classList.add('is-sorting');
        var row = handle.closest('.queue-item');
        if (row) row.classList.add('dragging');
      }

      function continueQueueDrag(event) {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        event.preventDefault();
        var index = queue.findIndex(function (item) { return item.id === dragState.id; });
        if (index < 0) return endQueueDrag(event);
        var rows = Array.prototype.slice.call(queueList.querySelectorAll('.queue-item'));
        if (!rows.length) return;
        var target = index;
        for (var i = 0; i < rows.length; i++) {
          var rect = rows[i].getBoundingClientRect();
          if (event.clientY < rect.top + rect.height / 2) {
            target = Number(rows[i].dataset.index);
            break;
          }
          target = Number(rows[i].dataset.index);
        }
        if (target !== index) {
          dragState.moved = true;
          moveTrackTo(index, target);
        }
      }

      function endQueueDrag(event) {
        if (!dragState || (event && event.pointerId !== dragState.pointerId)) return;
        var itemId = dragState.id;
        dragState = null;
        document.body.classList.remove('is-sorting');
        renderQueue();
        var handle = queueList.querySelector('.queue-drag-handle[data-item-id="' + itemId + '"]');
        if (handle) handle.focus({ preventScroll: true });
      }

      async function fetchAssetWithFallback(primaryUrl, fallbackUrl, label) {
        if (!fallbackUrl || primaryUrl === fallbackUrl) {
          var res = await fetch(primaryUrl);
          if (!res.ok) throw new Error('Could not download Kitten ' + label + ' (HTTP ' + res.status + ').');
          return res;
        }
        try {
          var res = await fetch(primaryUrl);
          if (res.ok) return res;
          addAudioDebug('model', label + ' local not found (HTTP ' + res.status + '), trying upstream remote');
        } catch (err) {
          addAudioDebug('model', label + ' local fetch error (' + err.message + '), trying upstream remote');
        }
        var fallbackRes = await fetch(fallbackUrl);
        if (!fallbackRes.ok) {
          throw new Error('Could not download Kitten ' + label + ' from local or remote (HTTP ' + fallbackRes.status + ').');
        }
        return fallbackRes;
      }

      async function loadBrowserSynthesizer(kitten) {
        if (typeof kitten.loadONNXRuntime !== 'function') {
          throw new Error('Kitten TTS library did not expose its browser runtime.');
        }

        var voiceIds = Object.keys(KITTEN_VOICE_URLS);
        addAudioDebug('model', 'downloading model, 8 voice embeddings, and tokenizer');
        var modelFallback = location.protocol === 'file:' ? null : (KITTEN_REMOTE_BASE + 'onnx/model_quantized.onnx');
        var requests = [fetchAssetWithFallback(KITTEN_MODEL_URL, modelFallback, 'model')].concat(voiceIds.map(function (id) {
          var voiceFallback = location.protocol === 'file:' ? null : (KITTEN_REMOTE_BASE + 'voices/' + id + '.bin');
          return fetchAssetWithFallback(KITTEN_VOICE_URLS[id], voiceFallback, 'voice ' + id);
        }));
        var responses = await Promise.all(requests);

        var modelBufferPromise = responses[0].arrayBuffer();
        var voiceBufferPromises = responses.slice(1).map(function (response) { return response.arrayBuffer(); });
        var files = await Promise.all([modelBufferPromise, Promise.resolve(KITTEN_TOKENIZER), Promise.all(voiceBufferPromises)]);
        if (files[0].byteLength < 10000000) {
          throw new Error('The bundled Kitten model was unavailable (' + files[0].byteLength + ' bytes received). Close and reopen the app, then try again online.');
        }
        var voiceData = {};
        files[2].forEach(function (buffer, index) {
          if (buffer.byteLength !== 1024) {
            throw new Error('Kitten voice ' + voiceIds[index] + ' was incomplete (' + buffer.byteLength + ' bytes).');
          }
          var view = new DataView(buffer);
          var embedding = new Float32Array(256);
          for (var offset = 0; offset < 256; offset++) embedding[offset] = view.getFloat32(offset * 4, true);
          voiceData[voiceIds[index]] = [embedding];
        });
        addAudioDebug('model', 'download complete; creating single-threaded WASM session');

        var ort = await kitten.loadONNXRuntime();
        ort.env.wasm.numThreads = 1;
        var wasmPath = ONNX_WASM_REMOTE_URL;
        if (location.protocol !== 'file:') {
          try {
            var localWasmCheck = await fetch(ONNX_WASM_URL, { method: 'HEAD' });
            if (localWasmCheck.ok) {
              wasmPath = ONNX_WASM_URL;
            } else {
              addAudioDebug('model', 'Local WASM not found (HTTP ' + localWasmCheck.status + '), using CDN runtime');
            }
          } catch (e) {
            addAudioDebug('model', 'Local WASM check failed, using CDN runtime');
          }
        }
        ort.env.wasm.wasmPaths = {
          wasm: wasmPath
        };
        var session = await ort.InferenceSession.create(files[0], {
          executionProviders: ['wasm']
        });
        var voices = voiceIds.map(function (id) { return { id: id, name: id }; });
        var synthesizer = new kitten.KittenTTS(voices, session, voiceData);
        synthesizer.tokenizer = files[1];
        synthesizer.vocab = files[1] && files[1].model ? files[1].model.vocab : null;
        if (!synthesizer.vocab) throw new Error('The Kitten tokenizer file was incomplete.');
        synthesizer.vocabArray = [];
        Object.keys(synthesizer.vocab).forEach(function (character) {
          synthesizer.vocabArray[synthesizer.vocab[character]] = character;
        });
        return synthesizer;
      }

      async function getSynthesizer(index) {
        if (!kittenModulePromise) {
          if (typeof window.importShim !== 'function') throw new Error('Kitten TTS loader unavailable');
          addAudioDebug('module', 'loading browser library');
          kittenModulePromise = window.importShim(AUDIO_MODULE_URL).then(function (kitten) {
            if (!kitten || !kitten.KittenTTS || typeof kitten.KittenTTS !== 'function') {
              throw new Error('Kitten TTS library loaded without the expected KittenTTS API');
            }
            addAudioDebug('module', 'browser library ready');
            return kitten;
          }).catch(function (error) {
            kittenModulePromise = null;
            throw error;
          });
        }
        if (!synthesizerPromise) {
          if (preparing) {
            var message = 'Preparing voice engine…';
            recordNote.textContent = 'Loading voice model & audio runtime…';
            startBtn.textContent = message;
          } else if (previewing) {
            recordNote.textContent = 'Preparing voice engine for preview…';
          }
          addAudioDebug('model', 'loading browser ONNX model');
          synthesizerPromise = kittenModulePromise.then(loadBrowserSynthesizer).then(function (synthesizer) {
            if (!synthesizer || !synthesizer.session) {
              throw new Error('The browser voice model did not finish loading. Check the connection and try again.');
            }
            addAudioDebug('model', 'browser ONNX model ready');
            return synthesizer;
          }).catch(function (error) {
            synthesizerPromise = null;
            throw error;
          });
        }
        return synthesizerPromise;
      }
      window._preloadSynthesizer = getSynthesizer;

      async function generateSpeech(synthesizer, text, voiceId) {
        var kitten = await kittenModulePromise;
        var streamer = new kitten.TextSplitterStream();
        streamer.push(text);
        streamer.close();

        var pieces = [];
        var sampleRate = 0;
        for await (var chunk of synthesizer.stream(streamer, { voice: voiceId, speed: 1 })) {
          var generated = chunk && chunk.audio;
          if (!generated || !generated.audio || !generated.audio.length) continue;
          var chunkRate = generated.sampling_rate || 24000;
          if (sampleRate && chunkRate !== sampleRate) {
            throw new Error('The selected voice returned speech chunks with mismatched sample rates.');
          }
          sampleRate = chunkRate;
          pieces.push(new Float32Array(generated.audio));
        }

        if (!pieces.length) {
          throw new Error('The selected voice did not return any audio.');
        }

        var gapLength = pieces.length > 1 ? Math.round(sampleRate * 0.09) : 0;
        var totalLength = pieces.reduce(function (sum, piece) { return sum + piece.length; }, 0) + gapLength * (pieces.length - 1);
        var combined = new Float32Array(totalLength);
        var writeAt = 0;
        pieces.forEach(function (piece, index) {
          combined.set(piece, writeAt);
          writeAt += piece.length;
          if (index < pieces.length - 1) writeAt += gapLength;
        });
        addAudioDebug('generation', 'assembled ' + pieces.length + (pieces.length === 1 ? ' speech chunk' : ' speech chunks'));

        return {
          data: combined,
          sampling_rate: sampleRate
        };
      }

      function samplesFromOutput(output) {
        var data = output && (output.data || output.audio);
        if (!data) throw new Error('Kitten TTS returned no audio');
        var samples = new Float32Array(data);
        if (!samples.length) throw new Error('Kitten TTS returned an empty audio buffer');
        addAudioDebug('generation', 'received ' + samples.length + ' samples at ' + (output.sampling_rate || output.sampleRate || 24000) + ' Hz');
        return samples;
      }

      function cachedSpeech(synthesizer, text, voiceId) {
        var key = JSON.stringify([voiceId, text]);
        if (!speechCache[key]) {
          speechCache[key] = generateSpeech(synthesizer, text, voiceId).then(function (output) {
            return {
              samples: samplesFromOutput(output),
              sampleRate: output.sampling_rate || output.sampleRate || 24000
            };
          }).catch(function (error) {
            delete speechCache[key];
            throw error;
          });
        }
        return speechCache[key];
      }

      function joinSpeech(parts) {
        var sampleRate = parts[0].sampleRate;
        var gapLength = Math.round(sampleRate * 0.09);
        var totalLength = gapLength * Math.max(0, parts.length - 1);
        parts.forEach(function (part) {
          if (part.sampleRate !== sampleRate) throw new Error('Cached speech used mismatched sample rates.');
          totalLength += part.samples.length;
        });
        var samples = new Float32Array(totalLength);
        var writeAt = 0;
        parts.forEach(function (part, index) {
          samples.set(part.samples, writeAt);
          writeAt += part.samples.length;
          if (index < parts.length - 1) writeAt += gapLength;
        });
        return { samples: samples, sampleRate: sampleRate };
      }

      async function prepareTrackAnnouncements(item, synthesizer, onProgress) {
        var minuteValues = cueMinuteValues(item);
        var totalAnnouncements = minuteValues.length + 1;
        var cuePart = await cachedSpeech(synthesizer, item.cue + '.', item.voiceId);
        for (var i = 0; i < minuteValues.length; i++) {
          var minutes = minuteValues[i];
          if (!item.minuteCues[minutes]) {
            if (onProgress) onProgress(i + 1, totalAnnouncements);
            var minutePart = await cachedSpeech(synthesizer, minuteAnnouncement(minutes) + '.', item.voiceId);
            item.minuteCues[minutes] = joinSpeech([cuePart, minutePart]);
          }
        }
        if (!item.doneCue) {
          if (onProgress) onProgress(totalAnnouncements, totalAnnouncements);
          var donePart = await cachedSpeech(synthesizer, 'Time is up.', item.voiceId);
          item.doneCue = joinSpeech([cuePart, donePart]);
        }
      }

      function buildAddedTrack(item) {
        if (!item || item.removed) return Promise.resolve(false);
        if (item.url) return Promise.resolve(true);
        if (item.buildPromise) return item.buildPromise;
        item.preparingAudio = true;
        item.buildError = false;
        renderQueue();
        item.buildPromise = (async function () {
          try {
            if (!item.doneCue || cueMinuteValues(item).some(function (minutes) { return !item.minuteCues[minutes]; })) {
              var synthesizer = await getSynthesizer(Math.max(0, queue.indexOf(item)));
              await prepareTrackAnnouncements(item, synthesizer);
              if (item.removed) return false;
            }
            if (!item.url && !item.removed) item.url = URL.createObjectURL(encodeTrack(item));
            item.buildError = false;
            return !item.removed && !!item.url;
          } catch (error) {
            item.buildError = true;
            showAudioFailure('background track preparation failed', error);
            return false;
          } finally {
            item.preparingAudio = false;
            item.buildPromise = null;
            if (!item.removed) {
              updateReadiness();
              renderQueue();
            }
          }
        })();
        return item.buildPromise;
      }

      function unlockAudioForPreparation() {
        try {
          if (unlockUrl) URL.revokeObjectURL(unlockUrl);
          unlockUrl = URL.createObjectURL(encodeCueWav(new Float32Array(8000), 8000));
          audio.src = unlockUrl;
          audio.loop = true;
          audio.currentTime = 0;
          audio.play().catch(function () {});
        } catch (error) {}
      }

      async function preparePlaylist() {
        if (!queue.length || preparing) return false;
        preparing = true;
        setEditorLocked(true);
        resetBtn.disabled = true;
        startBtn.disabled = true;
        statusText.textContent = 'Building playlist audio';
        screenNote.textContent = 'Keep this page open while each track is prepared.';
        try {
          for (var i = 0; i < queue.length; i++) {
            var item = queue[i];
            activeIndex = i;
            totalMs = item.duration * 60000;
            remainingMs = totalMs;
            renderTimer();
            if (!item.doneCue || cueMinuteValues(item).some(function (minutes) { return !item.minuteCues[minutes]; })) {
              recordNote.textContent = 'Creating spoken countdown for “' + item.cue + '” with ' + item.voice + ' — track ' + (i + 1) + ' of ' + queue.length + '.';
              startBtn.textContent = 'Preparing cues for track ' + (i + 1) + ' of ' + queue.length + '…';
              var synthesizer = await getSynthesizer(i);
              startBtn.textContent = 'Generating spoken prompts (track ' + (i + 1) + ' of ' + queue.length + ')…';
              await prepareTrackAnnouncements(item, synthesizer, function (announcement, totalAnnouncements) {
                recordNote.textContent = 'Creating announcement ' + announcement + ' of ' + totalAnnouncements + ' for “' + item.cue + '”.';
                startBtn.textContent = 'Generating prompt ' + announcement + ' of ' + totalAnnouncements + ' (track ' + (i + 1) + ')…';
              });
            }
            if (!item.url) {
              recordNote.textContent = 'Building track ' + (i + 1) + ' of ' + queue.length + '…';
              startBtn.textContent = 'Building track ' + (i + 1) + ' of ' + queue.length + '…';
              item.url = URL.createObjectURL(encodeTrack(item));
              await new Promise(function (resolve) { setTimeout(resolve, 0); });
            }
          }
          preparing = false;
          setEditorLocked(false);
          updateReadiness();
          return true;
        } catch (error) {
          preparing = false;
          setEditorLocked(false);
          updateReadiness();
          showAudioFailure('playlist preparation failed', error);
          recordNote.textContent = 'The playlist audio could not be created. Copy the debug log below if another try fails.';
          statusText.textContent = 'Audio setup needs attention';
          screenNote.textContent = 'Your completed tracks are kept; Start will retry the unfinished one.';
          return false;
        }
      }

      async function playTestCue() {
        var cue = cleanCue();
        if (!cue || state === 'running' || preparing || previewing) return;
        previewing = true;
        beginAudioAttempt('voice preview');
        testCueBtn.disabled = true;
        voiceSelect.disabled = true;
        var voiceLabel = voiceSelect.options[voiceSelect.selectedIndex].text;
        recordNote.textContent = 'Preparing a ' + voiceLabel + ' preview…';
        try {
          var synthesizer = await getSynthesizer(0);
          var output = await generateSpeech(synthesizer, cue, voiceSelect.value);
          var samples = samplesFromOutput(output);
          var sampleRate = output.sampling_rate || output.sampleRate || 24000;
          var previewUrl = URL.createObjectURL(encodeCueWav(samples, sampleRate));
          var preview = new Audio(previewUrl);
          preview.addEventListener('ended', function () { URL.revokeObjectURL(previewUrl); }, { once: true });
          await preview.play();
          pulse();
          screenNote.textContent = voiceLabel + ' preview played. Pick another voice and try again, or add this timer.';
        } catch (error) {
          showAudioFailure('voice preview failed', error);
          recordNote.textContent = 'The voice preview could not be created. Copy the debug log below if another try fails.';
          screenNote.textContent = 'The first preview downloads the Kitten voice model; try again when you’re online.';
        } finally {
          previewing = false;
          voiceSelect.disabled = false;
          testCueBtn.disabled = !cleanCue() || preparing || state === 'running';
          addTrackBtn.disabled = !cleanCue() || preparing;
        }
      }

      function syncMediaSession(playing) {
        if (!('mediaSession' in navigator)) return;
        var item = currentTrack();
        try {
          if (item) navigator.mediaSession.metadata = new MediaMetadata({
            title: item.cue,
            artist: 'Track ' + (activeIndex + 1) + ' of ' + queue.length,
            album: 'Focus Timer'
          });
          navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
        } catch (error) {}
      }

      function stopTicking() {
        clearInterval(tickHandle);
        tickHandle = null;
      }

      function playTrack(index, shouldPlay) {
        if (!queue[index] || !queue[index].url) return;
        stopTicking();
        activeIndex = index;
        var item = queue[index];
        totalMs = item.duration * 60000;
        remainingMs = totalMs;
        endAt = Date.now() + totalMs;
        nextCueAt = Date.now() + item.interval * 1000;
        audio.pause();
        audio.loop = false;
        audio.src = item.url;
        audio.currentTime = 0;
        resetBtn.disabled = false;
        setEditorLocked(false);
        state = shouldPlay ? 'running' : 'paused';
        timerPanel.classList.toggle('running', shouldPlay);
        startBtn.disabled = false;
        startBtn.textContent = shouldPlay ? 'Pause' : 'Resume';
        statusText.textContent = shouldPlay ? 'Playlist playing' : 'Paused';
        screenNote.textContent = shouldPlay ? 'Background audio active. Add, remove, or rearrange the other timers anytime.' : 'Paused. Add, remove, or rearrange any timer.';
        syncMediaSession(shouldPlay);
        renderTimer();
        if (shouldPlay) {
          audio.play().then(function () {
            addAudioDebug('playback', 'track started');
            pulse();
          }).catch(function (error) {
            showAudioFailure('track playback failed', error);
            state = 'paused';
            timerPanel.classList.remove('running');
            startBtn.textContent = 'Resume';
            statusText.textContent = 'Tap Resume to allow audio';
            screenNote.textContent = 'Audio is ready but the browser blocked playback. Tap Resume; copy the debug log if it still fails.';
            syncMediaSession(false);
            renderTimer();
          });
          tickHandle = setInterval(tick, 250);
        }
      }

      async function playPreparedTrack(index, shouldPlay) {
        var item = queue[index];
        if (!item) return;
        var token = ++trackSwitchToken;
        if (!item.url) {
          if (state === 'running') pause();
          statusText.textContent = 'Preparing “' + item.cue + '”';
          screenNote.textContent = 'This newly added timer is getting its audio ready.';
          var ready = await buildAddedTrack(item);
          if (token !== trackSwitchToken || item.removed) return;
          if (!ready) {
            statusText.textContent = 'Track audio needs attention';
            screenNote.textContent = 'The new timer could not be prepared. You can retry it with Next or resume the current task.';
            renderTimer();
            return;
          }
          index = queue.indexOf(item);
          if (index < 0) return;
        }
        playTrack(index, shouldPlay);
      }

      function playDoneTone() {
        try {
          var AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          var ctx = new AudioCtx();
          var gain = ctx.createGain();
          gain.gain.setValueAtTime(0.0001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.55);
          gain.connect(ctx.destination);
          [523.25, 659.25].forEach(function (frequency, index) {
            var oscillator = ctx.createOscillator();
            oscillator.frequency.value = frequency;
            oscillator.connect(gain);
            oscillator.start(ctx.currentTime + index * 0.12);
            oscillator.stop(ctx.currentTime + 0.58);
          });
          setTimeout(function () { ctx.close(); }, 800);
        } catch (error) {}
      }

      function finishPlaylist() {
        stopTicking();
        audio.pause();
        audio.currentTime = 0;
        remainingMs = 0;
        state = 'done';
        timerPanel.classList.remove('running');
        setEditorLocked(false);
        startBtn.textContent = 'Play again';
        resetBtn.disabled = false;
        statusText.textContent = 'Playlist complete';
        screenNote.textContent = 'Every task timer is complete.';
        syncMediaSession(false);
        playDoneTone();
        if (navigator.vibrate) navigator.vibrate([80, 70, 120]);
        updateReadiness();
        renderTimer();
      }

      function tick() {
        if (state !== 'running') return;
        var item = currentTrack();
        var now = Date.now();
        remainingMs = Math.max(0, endAt - now);
        if (remainingMs <= 0) {
          nextCueAt = Infinity;
          statusText.textContent = 'Time is up';
          screenNote.textContent = 'Finishing this task’s final announcement.';
          renderTimer();
          return;
        }
        if (item && now >= nextCueAt) {
          nextCueAt += item.interval * 1000;
          pulse();
        }
        renderTimer();
      }

      async function prepareAndStart() {
        if (!queue.length || preparing) return;
        beginAudioAttempt('playlist start');
        unlockAudioForPreparation();
        var ready = allTracksReady() || await preparePlaylist();
        if (!ready) {
          audio.pause();
          audio.loop = false;
          return;
        }
        if (unlockUrl) {
          audio.pause();
          URL.revokeObjectURL(unlockUrl);
          unlockUrl = '';
        }
        playTrack(0, true);
      }

      function pause() {
        tick();
        if (state !== 'running') return;
        pausedCueRemaining = Math.max(0, nextCueAt - Date.now());
        stopTicking();
        audio.pause();
        state = 'paused';
        timerPanel.classList.remove('running');
        startBtn.textContent = 'Resume';
        statusText.textContent = 'Paused';
        screenNote.textContent = 'Paused. Add, remove, or rearrange any timer.';
        syncMediaSession(false);
        renderTimer();
      }

      function resume() {
        if (state !== 'paused') return;
        endAt = Date.now() + remainingMs;
        nextCueAt = Date.now() + pausedCueRemaining;
        state = 'running';
        timerPanel.classList.add('running');
        startBtn.textContent = 'Pause';
        statusText.textContent = 'Playlist playing';
        screenNote.textContent = 'Background audio active. Add, remove, or rearrange the other timers anytime.';
        audio.play().then(function () {
          addAudioDebug('playback', 'resumed');
        }).catch(function (error) {
          showAudioFailure('resume playback failed', error);
          pause();
          statusText.textContent = 'Audio playback needs attention';
          screenNote.textContent = 'Copy the debug log below so the playback error can be diagnosed.';
        });
        syncMediaSession(true);
        tickHandle = setInterval(tick, 250);
        tick();
      }

      function goToTrack(index) {
        var activePlayback = state === 'running' || state === 'paused';
        var shouldPlay = state === 'running';
        if (index < 0) index = 0;
        if (index >= queue.length) {
          if (activePlayback) finishPlaylist();
          return;
        }
        if (activePlayback) {
          playPreparedTrack(index, shouldPlay);
          return;
        }
        activeIndex = index;
        state = 'idle';
        totalMs = queue[index].duration * 60000;
        remainingMs = totalMs;
        statusText.textContent = 'Track ' + (index + 1) + ' selected';
        screenNote.textContent = 'Use previous and next to review your queue, or press Start playlist.';
        updateReadiness();
        renderTimer();
      }

      function previousTrack() {
        if (activeIndex <= 0) goToTrack(0);
        else goToTrack(activeIndex - 1);
      }

      function nextTrack() { goToTrack(activeIndex + 1); }

      function reset() {
        stopTicking();
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
        state = 'idle';
        activeIndex = queue.length ? 0 : -1;
        totalMs = queue.length ? queue[0].duration * 60000 : 0;
        remainingMs = totalMs;
        timerPanel.classList.remove('running', 'flash');
        setEditorLocked(false);
        resetBtn.disabled = true;
        statusText.textContent = queue.length ? 'Playlist ready' : 'Ready when you are';
        screenNote.textContent = queue.length ? 'Press Start playlist when you’re ready.' : 'Add timers in the order you want to complete them.';
        syncMediaSession(false);
        updateReadiness();
        renderTimer();
      }

      cueInput.addEventListener('input', function () {
        addTrackBtn.disabled = !cleanCue();
        testCueBtn.disabled = !cleanCue() || preparing || previewing || state === 'running';
      });
      cueInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') addTrack();
      });
      minusBtn.addEventListener('click', function () {
        durationMinutes = Math.max(1, durationMinutes - (durationMinutes > 15 ? 5 : 1));
        durationOutput.textContent = durationMinutes + (durationMinutes === 1 ? ' minute' : ' minutes');
      });
      plusBtn.addEventListener('click', function () {
        durationMinutes = Math.min(60, durationMinutes + (durationMinutes >= 15 ? 5 : 1));
        durationOutput.textContent = durationMinutes + ' minutes';
      });
      addTrackBtn.addEventListener('click', addTrack);
      testCueBtn.addEventListener('click', playTestCue);
      exportListBtn.addEventListener('click', exportQueue);
      importListBtn.addEventListener('click', openImportPanel);
      copyListBtn.addEventListener('click', copyTransferText);
      applyImportBtn.addEventListener('click', applyImportedList);
      clearListBtn.addEventListener('click', clearQueue);
      closeTransferBtn.addEventListener('click', closeTransferPanel);
      queueList.addEventListener('pointerdown', startQueueDrag);
      document.addEventListener('pointermove', continueQueueDrag, { passive: false });
      document.addEventListener('pointerup', endQueueDrag);
      document.addEventListener('pointercancel', endQueueDrag);
      queueList.addEventListener('keydown', function (event) {
        var handle = event.target.closest('.queue-drag-handle');
        if (!handle || handle.disabled || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) return;
        event.preventDefault();
        var itemId = Number(handle.dataset.itemId);
        var index = queue.findIndex(function (item) { return item.id === itemId; });
        var direction = event.key === 'ArrowUp' ? -1 : 1;
        if (moveTrackTo(index, index + direction)) {
          var movedHandle = queueList.querySelector('.queue-drag-handle[data-item-id="' + itemId + '"]');
          if (movedHandle) movedHandle.focus();
        }
      });
      queueList.addEventListener('click', function (event) {
        var remove = event.target.closest('.queue-remove');
        if (remove) removeTrack(Number(remove.dataset.index));
      });
      startBtn.addEventListener('click', function () {
        if (state === 'running') pause();
        else if (state === 'paused') resume();
        else prepareAndStart();
      });
      previousBtn.addEventListener('click', previousTrack);
      nextBtn.addEventListener('click', nextTrack);
      resetBtn.addEventListener('click', reset);
      audio.addEventListener('timeupdate', tick);
      audio.addEventListener('ended', function () {
        if (state !== 'running') return;
        if (activeIndex < queue.length - 1) playPreparedTrack(activeIndex + 1, true);
        else finishPlaylist();
      });
      audio.addEventListener('error', function () {
        var mediaError = audio.error;
        var detail = mediaError ? new Error('MediaError code ' + mediaError.code + (mediaError.message ? ': ' + mediaError.message : '')) : new Error('Unknown audio element error');
        showAudioFailure('audio element error', detail);
        if (state === 'running') screenNote.textContent = 'This track could not play. Copy the debug log below, or use Next to continue.';
      });
      copyDebugBtn.addEventListener('click', function () {
        var text = debugLog.value;
        var copied = false;
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(function () {
            copyDebugBtn.textContent = 'Copied';
          }).catch(function () {
            debugLog.focus();
            debugLog.select();
            copyDebugBtn.textContent = 'Log selected — copy it';
          });
          return;
        }
        debugLog.focus();
        debugLog.select();
        try { copied = document.execCommand('copy'); } catch (error) {}
        copyDebugBtn.textContent = copied ? 'Copied' : 'Log selected — copy it';
      });
      if ('mediaSession' in navigator) {
        try {
          navigator.mediaSession.setActionHandler('play', resume);
          navigator.mediaSession.setActionHandler('pause', pause);
          navigator.mediaSession.setActionHandler('stop', reset);
          navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
          navigator.mediaSession.setActionHandler('previoustrack', previousTrack);
        } catch (error) {}
      }
      function loadVersion() {
        var versionEl = document.getElementById('appVersion');
        if (!versionEl) return;
        fetch('version.txt', { cache: 'no-cache' })
          .then(function (res) {
            if (res.ok) return res.text();
            throw new Error('version.txt not found');
          })
          .then(function (text) {
            var v = text.trim();
            if (v) versionEl.textContent = v;
          })
          .catch(function () {});
      }
      loadVersion();
      loadQueueFromStorage();
      updateReadiness();
      renderTimer();

      if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.protocol === 'http:')) {
        navigator.serviceWorker.register('./sw.js').catch(function () {
          /* Local files and restricted browsers keep using original page behavior. */
        });
      }
    })();

// Persistent debug log toggle (added 2026-10-11)
(function () {
  var btn = document.createElement('button');
  btn.textContent = 'Debug log';
  btn.type = 'button';
  btn.style.cssText = 'position:fixed;bottom:12px;right:12px;z-index:9999;opacity:0.75;padding:8px 12px;font-size:13px;border-radius:8px;border:1px solid #ccc;background:#fff;';
  btn.onclick = function () {
    var p = document.getElementById('debugPanel');
    if (p) { p.hidden = !p.hidden; if (!p.hidden) p.scrollIntoView({ block: 'nearest' }); }
  };
  document.body.appendChild(btn);
})();

// Background preload the voice model on app start (2026-10-11).
// getSynthesizer caches its promise, so this warms it without blocking UI.
// When Start is pressed later, the cached (or in-flight) promise is reused.
window.addEventListener('load', function () {
  setTimeout(function () {
    try {
      if (window._preloadSynthesizer) window._preloadSynthesizer(0);
    } catch (e) { /* Start will retry on failure */ }
  }, 1500);
});

