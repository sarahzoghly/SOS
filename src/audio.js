// ============================================================
//  SOUND EFFECTS
//  Every sound is generated in the browser with the Web Audio API,
//  so the project needs no audio files. There is no music, only effects.
//
//  Other files use:
//     play("click")            play one effect by name
//     isSfxOn() / setSfxOn()   the on/off switch (Settings screen)
//     getVolume() / setVolume() volume from 0 to 100 (Settings screen)
//
//  Buttons make a sound automatically when they are clicked. A button can
//  choose its own sound with  data-sfx="back"  (or data-sfx="none" for silence).
//  The settings are saved in localStorage ("orbit-sfx-on", "orbit-sfx-volume").
// ============================================================

const KEY_ON = "orbit-sfx-on";
const KEY_VOLUME = "orbit-sfx-volume";

let enabled = readSaved(KEY_ON, "true") !== "false";
let volume = clampVolume(Number(readSaved(KEY_VOLUME, "70")));

let ctx = null;
let master = null;
let noiseBuffer = null;
const lastPlayed = {};            // name -> time, so a sound can't be spammed


// ---------- saved settings ----------
function readSaved(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch (error) {
    // storage can be blocked (private mode): the setting just won't be remembered
  }
}

function clampVolume(value) {
  if (!Number.isFinite(value)) return 70;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function isSfxOn() {
  return enabled;
}

export function getVolume() {
  return volume;
}

export function setSfxOn(on) {
  enabled = !!on;
  save(KEY_ON, enabled);
}

export function setVolume(value) {
  volume = clampVolume(Number(value));
  save(KEY_VOLUME, volume);
  applyVolume();
}

function applyVolume() {
  if (!master) return;
  // a curve feels more natural to the ear than a straight line
  master.gain.value = Math.pow(volume / 100, 2) * 0.9;
}


// ---------- the audio engine ----------
// browsers only allow sound after the player has clicked or pressed a key,
// so the engine is created the first time a sound is asked for
function getContext() {
  if (!ctx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    try {
      ctx = new AudioContextClass();
    } catch (error) {
      return null;
    }
    master = ctx.createGain();
    master.connect(ctx.destination);
    applyVolume();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function getNoise(c) {
  if (!noiseBuffer) {
    noiseBuffer = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

// one beep. options: type, vol, to (slide to this pitch), attack
function tone(c, freq, start, length, options) {
  const o = options || {};
  const osc = c.createOscillator();
  const gain = c.createGain();
  const t = c.currentTime + start;
  const peak = o.vol === undefined ? 0.2 : o.vol;

  osc.type = o.type || "square";
  osc.frequency.setValueAtTime(freq, t);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + length);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + (o.attack || 0.005));
  gain.gain.exponentialRampToValueAtTime(0.0001, t + length);

  osc.connect(gain);
  gain.connect(master);
  osc.start(t);
  osc.stop(t + length + 0.05);
}

// a burst of filtered noise (wind, page turns, rockets). options: vol, from, to (filter sweep), q, attack
function noise(c, start, length, options) {
  const o = options || {};
  const source = c.createBufferSource();
  const filter = c.createBiquadFilter();
  const gain = c.createGain();
  const t = c.currentTime + start;
  const peak = o.vol === undefined ? 0.2 : o.vol;

  source.buffer = getNoise(c);
  source.loop = true;                // the buffer is 2 seconds, rockets rumble for longer
  filter.type = o.filter || "bandpass";
  filter.Q.value = o.q || 0.8;
  filter.frequency.setValueAtTime(o.from || 1200, t);
  if (o.to) filter.frequency.exponentialRampToValueAtTime(o.to, t + length);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + (o.attack || 0.01));
  gain.gain.exponentialRampToValueAtTime(0.0001, t + length);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  source.start(t, Math.random());
  source.stop(t + length + 0.05);
}


// ---------- the effects ----------
// every effect gets the audio context. "gap" is the shortest time (ms) between two plays.
const SOUNDS = {
  // buttons
  click:  { gap: 40,  run: c => tone(c, 880, 0, 0.06, { vol: 0.14 }) },
  back:   { gap: 60,  run: c => tone(c, 560, 0, 0.1, { type: "triangle", to: 330, vol: 0.22 }) },
  select: { gap: 60,  run: c => { tone(c, 660, 0, 0.07, { vol: 0.14 }); tone(c, 990, 0.07, 0.09, { vol: 0.14 }); } },
  open:   { gap: 80,  run: c => { tone(c, 420, 0, 0.12, { type: "triangle", to: 640, vol: 0.2 }); noise(c, 0, 0.1, { vol: 0.04, from: 2500 }); } },
  close:  { gap: 80,  run: c => tone(c, 640, 0, 0.12, { type: "triangle", to: 400, vol: 0.2 }) },
  toggle: { gap: 40,  run: c => { tone(c, 740, 0, 0.05, { vol: 0.14 }); tone(c, 1110, 0.05, 0.07, { vol: 0.14 }); } },
  page:   { gap: 80,  run: c => noise(c, 0, 0.16, { vol: 0.16, from: 1500, to: 5000, q: 0.6, attack: 0.03 }) },
  warn:   { gap: 200, run: c => { tone(c, 330, 0, 0.14, { type: "sawtooth", vol: 0.14 }); tone(c, 247, 0.14, 0.22, { type: "sawtooth", vol: 0.14 }); } },

  // the story
  next:    { gap: 60,  run: c => tone(c, 520, 0, 0.04, { type: "triangle", vol: 0.1 }) },
  type:    { gap: 45,  run: c => tone(c, 300 + Math.random() * 140, 0, 0.025, { vol: 0.035 }) },
  chapter: { gap: 400, run: c => { noise(c, 0, 0.9, { vol: 0.12, from: 200, to: 1800, q: 0.7, attack: 0.4 }); tone(c, 196, 0.1, 0.9, { type: "sine", vol: 0.12, attack: 0.3 }); } },
  found:   { gap: 200, run: c => { [784, 1047, 1319, 1568].forEach((f, i) => tone(c, f, i * 0.07, 0.22, { type: "sine", vol: 0.15 })); } },
  newpage: { gap: 200, run: c => { tone(c, 988, 0, 0.12, { type: "sine", vol: 0.14 }); tone(c, 1319, 0.1, 0.22, { type: "sine", vol: 0.14 }); } },
  launch:  { gap: 1000, run: c => { noise(c, 0, 3.6, { vol: 0.3, filter: "lowpass", from: 500, to: 90, q: 0.7, attack: 0.7 }); noise(c, 0.2, 3, { vol: 0.12, from: 900, to: 250, q: 0.5, attack: 0.8 }); } },
  descend: { gap: 1000, run: c => noise(c, 0, 3.8, { vol: 0.2, filter: "lowpass", from: 420, to: 160, q: 0.8, attack: 0.6 }) },

  // the test
  correct: { gap: 100, run: c => { [523, 659, 784].forEach((f, i) => tone(c, f, i * 0.07, 0.14, { type: "triangle", vol: 0.2 })); } },
  wrong:   { gap: 100, run: c => { tone(c, 220, 0, 0.18, { type: "sawtooth", to: 150, vol: 0.13 }); tone(c, 165, 0.15, 0.25, { type: "sawtooth", to: 110, vol: 0.13 }); } },
  win:     { gap: 400, run: c => { [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(c, f, i * 0.11, 0.2, { type: "square", vol: 0.14 })); } },
  lose:    { gap: 400, run: c => { [392, 349, 330, 262].forEach((f, i) => tone(c, f, i * 0.14, 0.24, { type: "triangle", vol: 0.18 })); } },
  unlock:  { gap: 300, run: c => { [659, 880, 1175, 1760].forEach((f, i) => tone(c, f, i * 0.06, 0.18, { type: "sine", vol: 0.16 })); } }
};

export function play(name) {
  if (!enabled || volume === 0) return;
  const sound = SOUNDS[name];
  if (!sound) return;

  const now = performance.now();
  if (lastPlayed[name] && now - lastPlayed[name] < sound.gap) return;
  lastPlayed[name] = now;

  const c = getContext();
  if (!c) return;
  try {
    sound.run(c);
  } catch (error) {
    // a sound must never be able to break the game
  }
}


// ---------- every button makes a sound ----------
function soundFor(button) {
  if (button.dataset.sfx) return button.dataset.sfx;
  const list = button.classList;
  if (list.contains("quiz-option")) return "none";      // the test plays "correct" / "wrong" itself
  if (list.contains("planet") || list.contains("pick-button") || list.contains("choice-button")) return "select";
  if (list.contains("book-turn")) return "page";
  return "click";
}

// capture phase: runs before the button's own code, even if that code removes the button
document.addEventListener("click", event => {
  const button = event.target.closest && event.target.closest("button");
  if (!button || button.disabled) return;
  const name = soundFor(button);
  if (name !== "none") play(name);
}, true);
