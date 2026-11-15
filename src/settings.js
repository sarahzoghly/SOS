// ============================================================
//  SETTINGS SCREEN
//  1. Sound effects on / off
//  2. Sound effects volume
//  3. Restart Progress (erases the finished stories, the books and the best test scores)
//
//  The screen can be opened from two places:
//     openSettings("title")   from the title screen   (Back returns to the title screen)
//     openSettings("level")   from the menu inside a level (it opens on top of the level,
//                             and Back returns to that menu, so nothing in the level is lost)
//
//  When the progress is erased, the page announces it with the "orbit:progress-reset"
//  event, so intro.js and level.js can lock the Test button again and clear the marks.
// ============================================================

import { play, isSfxOn, setSfxOn, getVolume, setVolume } from './audio.js';
import { askConfirm } from './confirm.js';

const screen = document.getElementById('settings-screen');
const backButton = document.getElementById('settings-back');
const toggle = document.getElementById('sfx-toggle');
const slider = document.getElementById('sfx-volume');
const sliderValue = document.getElementById('sfx-volume-value');
const restartButton = document.getElementById('restart-progress');
const progressInfo = document.getElementById('progress-info');
const statusBox = document.getElementById('settings-status');

// the worlds and their heroes (the same ids level.js saves its progress under)
const WORLDS = [
  { id: "moon", name: "Moon", heroes: ["rover", "falcon"] },
  { id: "mars", name: "Mars", heroes: ["opportunity", "spirit"] }
];

let openedFrom = "title";


// ---------- opening and closing ----------
export function isSettingsOpen() {
  return screen.style.display === "flex";
}

export function openSettings(from) {
  openedFrom = from === "level" ? "level" : "title";
  statusBox.textContent = "";
  refreshSound();
  refreshProgress();

  screen.classList.toggle("over-level", openedFrom === "level");
  if (openedFrom === "title") {
    document.querySelectorAll("#title-screen").forEach(section => section.style.display = "none");
  }
  screen.style.display = "flex";
  screen.scrollTop = 0;
}

function closeSettings() {
  screen.style.display = "none";
  if (openedFrom === "title") {
    document.querySelectorAll("#title-screen").forEach(section => section.style.display = "flex");
  }
}

backButton.addEventListener('click', closeSettings);


// ---------- 1 + 2: the sound ----------
function refreshSound() {
  const on = isSfxOn();
  toggle.textContent = on ? "ON" : "OFF";
  toggle.setAttribute("aria-pressed", String(on));
  toggle.classList.toggle("is-off", !on);

  slider.value = getVolume();
  slider.disabled = !on;
  slider.style.setProperty("--fill", getVolume() + "%");
  sliderValue.textContent = getVolume() + "%";
  document.getElementById('volume-row').classList.toggle("is-off", !on);
}

toggle.addEventListener('click', () => {
  setSfxOn(!isSfxOn());
  refreshSound();
  // the click sound of the button itself already played (or not) before this ran,
  // so when the sound has just been turned ON, play a little confirmation
  if (isSfxOn()) play("toggle");
});

// moving the slider changes the volume right away
slider.addEventListener('input', () => {
  setVolume(slider.value);
  slider.style.setProperty("--fill", slider.value + "%");
  sliderValue.textContent = slider.value + "%";
});

// letting go of the slider plays a sample, so you can hear the new volume
slider.addEventListener('change', () => play("select"));


// ---------- 3: restart progress ----------
function refreshProgress() {
  const parts = WORLDS.map(world => {
    const done = world.heroes.filter(hero => readFlag(world.id + "-done-" + hero)).length;
    return world.name + " " + done + "/" + world.heroes.length;
  });
  progressInfo.textContent = "Stories finished: " + parts.join("  -  ");
}

function readFlag(key) {
  try {
    return localStorage.getItem(key) === "true";
  } catch (error) {
    return false;
  }
}

// removes everything the game saved for the Moon and for Mars (the sound settings stay)
function eraseProgress() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && WORLDS.some(world => key.startsWith(world.id + "-"))) keys.push(key);
    }
    keys.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    return false;
  }
}

restartButton.addEventListener('click', async () => {
  play("warn");
  const sure = await askConfirm({
    title: "Restart progress?",
    text: "This erases every finished story, every page in your books and every best test score, on the Moon and on Mars. Your sound settings stay. This cannot be undone.",
    yes: "Restart progress",
    no: "Keep it"
  });
  if (!sure) return;

  if (eraseProgress()) {
    document.dispatchEvent(new CustomEvent("orbit:progress-reset"));
    refreshProgress();
    statusBox.textContent = "Progress restarted. Every story is waiting for you again.";
    play("unlock");
  } else {
    statusBox.textContent = "The browser would not let the game erase its saved data.";
  }
});
