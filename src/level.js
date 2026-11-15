// ============================================================
//  LEVEL ENGINE
//  Both the Mars level and the Apollo (Moon) level run on this file.
//  A level is made from:
//     - its data   (mars-data.js / moon-data.js)   the words, dates and questions
//     - its art    (level-art.js)                  the Moon's drawings (Mars draws its own in index.html)
//  They share ONE level screen (#mars-level in index.html). Playing the Moon adds the class
//  "world-moon" to it (styles/moon.css), so the Moon's pictures, Earth in the sky and hero cards show up.
//
//  Taken from the newer level engine:
//   - every timer is tracked and cleared, so leaving a story at the wrong moment
//     can no longer start a chapter in the background
//   - Enter / Space no longer steal the click from a focused button, and the
//     keys 1-4 pick an answer
//   - the book of a finished story is no longer erased when you start it again
//   - quiz answers are matched by position, not by their text
//
//  Also here:
//   - the Back button of the level (pick screen -> intro, story -> pick screen, test -> intro),
//     with an "Are you sure?" box when a story or a test is in progress
//   - sound effects (src/audio.js)
//   - Settings opens on top of the level from the menu, so nothing is lost
//
//  intro.js uses:  startStory("mars" | "moon")   startTest("mars" | "moon")
// ============================================================

import * as marsData from './mars-data.js';
import * as moonData from './moon-data.js';
import { installMoonArt } from './level-art.js';
import { play } from './audio.js';
import { askConfirm, isConfirmOpen } from './confirm.js';
import { openSettings, isSettingsOpen } from './settings.js';

installMoonArt();


// ============================================================
//  1. THE TWO WORLDS
// ============================================================
const WORLDS = {
  mars: {
    id: "mars",
    name: "Mars",                         // "Back to Mars"
    screen: "Mars",                       // "the Mars screen"
    data: marsData,
    order: ["opportunity", "spirit"],
    pickTitle: "Choose your rover",
    otherHint: other => " Come back and play as " + other + " to see the other side of Mars.",
    perfectText: "Flawless run. You know the rovers like their own engineers do."
  },
  moon: {
    id: "moon",
    name: "the Moon",
    screen: "Moon",
    data: moonData,
    order: ["rover", "falcon"],
    pickTitle: "Choose your hero",
    otherHint: other => " Come back and play as " + other + " to see the Moon from another point of view.",
    perfectText: "Flawless run. You know the rover and the lander like their own engineers do."
  }
};

let W = WORLDS.mars;                      // the world that is open right now


// ============================================================
//  2. ELEMENTS (the level screen is shared, so these never change)
// ============================================================
const intro = id => document.getElementById(id + '-intro');
const level = document.getElementById('mars-level');
const pickPane = document.getElementById('mars-pick');
const stagePane = document.getElementById('mars-stage');
const quizPane = document.getElementById('mars-quiz');

// the pick screen
const pickTitle = document.getElementById('mars-pick-title');
const marsCards = document.getElementById('mars-cards');
const moonCards = document.getElementById('moon-cards');

// top bar
const levelBook = document.getElementById('mars-level-book');
const dayBox = document.getElementById('mars-day');
const dayNumber = document.getElementById('mars-day-number');
const dayDate = document.getElementById('mars-day-date');
const toast = document.getElementById('mars-toast');
const menuButton = document.getElementById('mars-menu-button');
const levelBack = document.getElementById('level-back');

// stage
const actor = document.getElementById('mars-actor');
const banner = document.getElementById('mars-banner');
const dialog = document.getElementById('mars-dialog');
const speaker = document.getElementById('mars-speaker');
const textBox = document.getElementById('mars-text');
const choicesBox = document.getElementById('mars-choices');
const nextArrow = document.getElementById('mars-next');
const foundBox = document.getElementById('mars-found');
const curtain = document.getElementById('mars-curtain');
const dip = document.getElementById('mars-dip');
const ending = document.getElementById('mars-ending');

// each world has its own book (the overlay and its pages)
function bookElements(id) {
  return {
    overlay: document.getElementById(id + '-book'),
    left: document.getElementById(id + '-page-left'),
    right: document.getElementById(id + '-page-right'),
    count: document.getElementById(id + '-book-count'),
    prev: document.getElementById(id + '-book-prev'),
    next: document.getElementById(id + '-book-next')
  };
}
const BOOKS = { mars: bookElements('mars'), moon: bookElements('moon') };
const allBookOverlays = () => [BOOKS.mars.overlay, BOOKS.moon.overlay];

// menu
const menu = document.getElementById('mars-menu');
const menuNote = document.getElementById('menu-note');


// ============================================================
//  3. VARIABLES THE GAME REMEMBERS
// ============================================================
let currentRover = "opportunity";   // the hero being played: "opportunity", "spirit", "rover" or "falcon"
let sceneIndex = 0;                 // which scene we are in
let beatIndex = 0;                  // which line of that scene we are on
let sceneImages = [];               // photos found during this scene (they go in the book)
let runEntries = [];                // the book pages of this run

let typing = false;                 // is the text still being typed?
let typeTimer = null;
let fullText = "";
let waitingForChoice = false;       // is the player supposed to pick an answer?
let foundOpen = false;              // is a photo on the screen?
let canAdvance = false;             // false while the screen fades
let chapterWaiting = false;         // true while the chapter card is on the screen
let chapterTimer = null;
let timers = [];                    // every setTimeout we start, so we can cancel them all
let activePane = "pick";

let shownDay = 0;                   // the number on the day counter right now
let dayFrame = null;


// ============================================================
//  4. SMALL HELPERS
// ============================================================
// setTimeout that we can cancel when the player leaves
function later(fn, ms) {
  const handle = setTimeout(() => {
    timers = timers.filter(h => h !== handle);
    fn();
  }, ms);
  timers.push(handle);
  return handle;
}

const KEY = {
  book: rover => W.id + "-book-" + rover,
  done: rover => W.id + "-done-" + rover,
  storyDone: () => W.id + "-story-done",
  best: () => W.id + "-test-best"
};

function showPane(name) {
  activePane = name;
  pickPane.style.display = name === "pick" ? "flex" : "none";
  stagePane.style.display = name === "stage" ? "block" : "none";
  quizPane.style.display = name === "quiz" ? "flex" : "none";

  // the book and the day counter only make sense during the story
  levelBook.style.display = name === "stage" ? "flex" : "none";
  dayBox.style.display = name === "stage" ? "block" : "none";
}

function isVisible() {
  return level.style.display === "block";
}

function rovers() {
  return W.data.rovers;
}

function story() {
  return W.data.story[currentRover];
}

function otherRover() {
  return rovers()[rovers()[currentRover].other];
}

function currentScene() {
  return story()[sceneIndex];
}

function formatDate(dateString, approx) {
  const date = new Date(dateString);
  const options = approx
    ? { year: "numeric", month: "short", timeZone: "UTC" }
    : { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" };
  return date.toLocaleDateString("en-US", options).toUpperCase();
}

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// stops the typing, the timers and the animations (used when we leave the level)
function stopEverything() {
  toast.classList.remove("show");
  clearInterval(typeTimer);
  clearTimeout(chapterTimer);
  timers.forEach(clearTimeout);
  timers = [];
  cancelAnimationFrame(dayFrame);
  typing = false;
  canAdvance = false;
  chapterWaiting = false;
  waitingForChoice = false;
  foundOpen = false;
  curtain.classList.remove("show");
  dip.classList.remove("show");
  foundBox.style.display = "none";
  dialog.style.visibility = "hidden";
  stagePane.classList.remove("is-meanwhile");
  banner.textContent = "";
}

function overlayOpen() {
  return menu.style.display === "flex" ||
         allBookOverlays().some(o => o.style.display === "flex") ||
         ending.style.display === "flex" ||
         isSettingsOpen() ||
         isConfirmOpen();
}


// ============================================================
//  5. STARTING AND LEAVING
// ============================================================
// the same level screen is used by both worlds, so we set it up for the one that opens
function openWorld(id) {
  W = WORLDS[id];
  level.classList.toggle("world-moon", id === "moon");
  pickTitle.textContent = W.pickTitle;
  marsCards.style.display = id === "mars" ? "flex" : "none";
  moonCards.style.display = id === "moon" ? "flex" : "none";
  document.getElementById('quiz-back').textContent = "Back to " + W.name;
  document.getElementById('ending-button').textContent = "Back to " + W.name;
}

// called from intro.js when "Play Story" is clicked
export function startStory(id) {
  stopEverything();
  openWorld(id);
  intro(id).style.display = "none";
  level.style.display = "block";
  showPane("pick");
  refreshPick();
}

// called from intro.js when "Test" is clicked
export function startTest(id) {
  stopEverything();
  openWorld(id);
  intro(id).style.display = "none";
  level.style.display = "block";
  showPane("quiz");
  startQuiz();
}

// the Moon's two hero cards are made from the data (the Mars cards are written in index.html)
function buildMoonCards() {
  moonCards.innerHTML = "";
  WORLDS.moon.order.forEach(id => {
    const info = moonData.rovers[id];
    const card = document.createElement("div");
    card.className = "rover-card";
    card.id = "card-" + id;
    card.innerHTML =
      '<img src="' + esc(info.img) + '" alt="' + esc(info.name) + '">' +
      "<h2>" + esc(info.name) + "</h2>" +
      '<p class="card-text">' + esc(info.tagline) + "</p>" +
      "<ul>" + info.stats.map(stat => "<li>" + esc(stat) + "</li>").join("") + "</ul>" +
      '<p class="card-done" id="done-' + id + '">Story completed</p>' +
      '<button class="button pick-button" data-rover="' + id + '">Play as ' + esc(info.name) + "</button>";
    moonCards.appendChild(card);
  });
}

function refreshPick() {
  W.order.forEach(id => {
    const mark = document.getElementById('done-' + id);
    if (mark) mark.style.display = localStorage.getItem(W.id + "-done-" + id) === "true" ? "block" : "none";
  });
}

// go back to the intro screen of the world that is open
function backToIntro() {
  stopEverything();
  ending.style.display = "none";
  closeMenu();
  allBookOverlays().forEach(o => { o.style.display = "none"; });
  level.style.display = "none";
  intro(W.id).style.display = "flex";
}

// leave the level and show another screen (home, levels, settings)
function leaveLevel(screenId) {
  stopEverything();
  closeMenu();
  ending.style.display = "none";
  allBookOverlays().forEach(o => { o.style.display = "none"; });
  level.style.display = "none";
  document.querySelectorAll("#" + screenId).forEach(section => section.style.display = "flex");
}

// the "Play as ..." buttons (Mars cards are in index.html, Moon cards are made here)
buildMoonCards();
document.querySelectorAll(".pick-button").forEach(button => {
  button.addEventListener('click', () => playRover(button.dataset.rover));
});

function playRover(id) {
  stopEverything();
  currentRover = id;
  sceneIndex = 0;
  shownDay = 0;
  runEntries = [];                 // a fresh book for this run (the saved book of an earlier run stays until this run is finished)

  level.style.setProperty("--accent", rovers()[id].accent);
  level.style.setProperty("--accent-light", rovers()[id].light);
  levelBook.classList.remove("has-new");

  dayNumber.textContent = "DAY 0";
  dayDate.textContent = formatDate(rovers()[id].launch, false);

  showPane("stage");
  startScene(0);
}


// ============================================================
//  6. SCENES
// ============================================================
function startScene(i) {
  sceneIndex = i;
  const scene = currentScene();

  canAdvance = false;
  dialog.style.visibility = "hidden";
  foundBox.style.display = "none";
  stagePane.classList.remove("is-meanwhile");
  banner.textContent = "";

  // chapter card
  document.getElementById('chapter-number').textContent = "CHAPTER " + (i + 1) + " OF " + story().length;
  document.getElementById('chapter-title').textContent = scene.title;
  document.getElementById('chapter-date').textContent = formatDate(scene.date, scene.approx);
  document.getElementById('chapter-place').textContent = scene.place;
  curtain.classList.add("show");
  play("chapter");

  chapterWaiting = true;
  clearTimeout(chapterTimer);
  chapterTimer = later(openScene, 3000);
}

// the chapter card goes away and the scene appears
function openScene() {
  if (!chapterWaiting) return;
  chapterWaiting = false;
  clearTimeout(chapterTimer);

  const scene = currentScene();
  setBackdrop(scene.bg);
  setActor(scene.actor, true);
  setDay(scene.date, scene.approx);
  curtain.classList.remove("show");

  beatIndex = 0;
  sceneImages = [];

  // wait for the curtain to finish fading, then start the first line
  chapterTimer = later(() => {
    canAdvance = true;
    showBeat(0);
  }, 800);
}

function setBackdrop(name) {
  const b = W.data.backdrops[name];
  stagePane.style.setProperty("--sky-top", b.skyTop);
  stagePane.style.setProperty("--sky-bottom", b.skyBottom);
  stagePane.style.setProperty("--far", b.far);
  stagePane.style.setProperty("--ground", b.ground);
  stagePane.style.setProperty("--stars", b.stars);
  stagePane.style.setProperty("--dust", b.dust);
  stagePane.style.setProperty("--sun", b.sun);
  stagePane.style.setProperty("--earth", b.earth || 0);      // Earth in the Moon's sky (moon.css)
}

let actorTimer = null;

function setActor(value, arrive) {
  clearTimeout(actorTimer);
  actor.className = "actor " + value;
  // rockets and landers are loud
  if (value.includes("lift")) play("launch");
  else if (value.includes("descend")) play("descend");
  // the rover drives in from the left when a scene starts
  if (arrive && value.includes("rover")) {
    actor.classList.add("arrive", "driving");
    actorTimer = later(() => actor.classList.remove("arrive", "driving"), 1700);
  }
}

// ---------- the day counter ----------
function setDay(dateString, approx) {
  const launch = new Date(rovers()[currentRover].launch);
  const target = Math.round((new Date(dateString) - launch) / 86400000);
  dayDate.textContent = formatDate(dateString, approx);
  countDay(target, approx);
}

// counts up from the old number to the new one
function countDay(target, approx) {
  cancelAnimationFrame(dayFrame);
  const prefix = approx ? "DAY ~" : "DAY ";
  const start = shownDay;
  const difference = target - start;

  if (difference === 0) {
    dayNumber.textContent = prefix + target.toLocaleString("en-US");
    return;
  }

  const duration = Math.min(2500, 700 + Math.abs(difference) * 1.2);
  const startTime = performance.now();

  function step(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    shownDay = Math.round(start + difference * eased);
    dayNumber.textContent = prefix + shownDay.toLocaleString("en-US");
    if (t < 1) {
      dayFrame = requestAnimationFrame(step);
    } else {
      shownDay = target;
    }
  }
  dayFrame = requestAnimationFrame(step);
}


// ============================================================
//  7. BEATS (the lines of a scene)
// ============================================================
function showBeat(i) {
  const scene = currentScene();
  const beat = scene.beats[i];
  beatIndex = i;

  // a beat can change the backdrop with a quick fade to black
  if (beat.bg) {
    dip.classList.add("show");
    later(() => {
      setBackdrop(beat.bg);
      dip.classList.remove("show");
    }, 380);
  }
  if (beat.actor) {
    setActor(beat.actor, false);
  }
  if (beat.date) {
    setDay(beat.date, beat.approx);
  }

  // "meanwhile" beats get a banner and a blue tint
  const isMeanwhile = beat.type === "meanwhile";
  stagePane.classList.toggle("is-meanwhile", isMeanwhile);
  banner.textContent = isMeanwhile ? "MEANWHILE  /  " + otherRover().name.toUpperCase() : "";

  if (beat.type === "found") {
    showFound(beat, i);
  } else if (beat.type === "choice") {
    showChoice(beat);
  } else if (isMeanwhile) {
    showLine("meanwhile", beat.text);
  } else {
    showLine(beat.who || "narrator", beat.text);
  }
}

function showLine(who, text) {
  dialog.style.visibility = "visible";
  dialog.className = who;

  if (who === "me") speaker.textContent = rovers()[currentRover].name;
  else if (who === "earth") speaker.textContent = "Earth";
  else if (who === "meanwhile") speaker.textContent = otherRover().name;
  else speaker.textContent = "";

  choicesBox.innerHTML = "";
  typeText(text);
}

// types the text one letter at a time
function typeText(text) {
  clearInterval(typeTimer);
  fullText = text;
  typing = true;
  textBox.textContent = "";
  nextArrow.style.visibility = "hidden";

  let letters = 0;
  typeTimer = setInterval(() => {
    letters++;
    textBox.textContent = fullText.slice(0, letters);
    if (letters % 3 === 0 && !overlayOpen()) play("type");
    if (letters >= fullText.length) {
      finishTyping();
    }
  }, 16);
}

function finishTyping() {
  clearInterval(typeTimer);
  typing = false;
  textBox.textContent = fullText;
  if (!waitingForChoice) {
    nextArrow.style.visibility = "visible";
  }
}

function showChoice(beat) {
  dialog.style.visibility = "visible";
  dialog.className = "narrator";
  speaker.textContent = "";
  choicesBox.innerHTML = "";
  waitingForChoice = true;
  typeText(beat.prompt);

  beat.options.forEach(option => {
    const button = document.createElement("button");
    button.className = "button choice-button";
    button.textContent = option.label;
    button.addEventListener('click', () => {
      waitingForChoice = false;
      choicesBox.innerHTML = "";
      showLine(option.who || "me", option.text);   // the answer. choices never change the story
    });
    choicesBox.appendChild(button);
  });
}

function showFound(beat) {
  foundOpen = true;
  dialog.style.visibility = "hidden";
  document.getElementById('found-title').textContent = beat.title;
  document.getElementById('found-img').src = beat.img;
  document.getElementById('found-caption').textContent = beat.caption;
  foundBox.style.display = "flex";
  play("found");
  sceneImages.push({ img: beat.img, title: beat.title });
}

function closeFound() {
  foundOpen = false;
  foundBox.style.display = "none";
}


// ============================================================
//  8. CLICKING THROUGH THE STORY
// ============================================================
function advance() {
  if (chapterWaiting) {            // skip the chapter card
    openScene();
    return;
  }
  if (!canAdvance) return;

  if (foundOpen) {
    closeFound();
    play("close");
    nextBeat();
    return;
  }
  if (typing) {                    // first click finishes the text
    finishTyping();
    return;
  }
  if (waitingForChoice) return;    // pick an answer first
  play("next");
  nextBeat();
}

function nextBeat() {
  if (beatIndex + 1 < currentScene().beats.length) {
    showBeat(beatIndex + 1);
  } else {
    endScene();
  }
}

function endScene() {
  canAdvance = false;
  dialog.style.visibility = "hidden";
  stagePane.classList.remove("is-meanwhile");
  banner.textContent = "";
  saveEntry(currentScene());

  if (sceneIndex + 1 < story().length) {
    later(() => startScene(sceneIndex + 1), 500);
  } else {
    later(showEnding, 500);
  }
}

stagePane.addEventListener('click', (event) => {
  if (event.target.closest("button")) return;
  if (overlayOpen()) return;
  advance();
});

document.addEventListener('keydown', (event) => {
  if (!isVisible()) return;
  if (isSettingsOpen() || isConfirmOpen()) return;     // they are on top, src/nav.js closes them

  if (event.key === "Escape") {
    const openBook = allBookOverlays().find(o => o.style.display === "flex");
    if (openBook) {
      openBook.style.display = "none";
    } else if (menu.style.display === "flex") {
      closeMenu();
    } else if (!overlayOpen()) {
      openMenu();
    }
    return;
  }

  if (activePane !== "stage" || overlayOpen()) return;

  // keys 1-4 pick an answer
  if (waitingForChoice && /^[1-4]$/.test(event.key)) {
    const button = choicesBox.querySelectorAll("button")[Number(event.key) - 1];
    if (button) button.click();
    return;
  }

  // Space / Enter / Right arrow go on. (If a button has the focus, Enter and Space belong to that button.)
  if (event.key === " " || event.key === "Enter" || event.key === "ArrowRight") {
    if (document.activeElement && document.activeElement.closest("button")) return;
    event.preventDefault();
    advance();
  }
});


// ============================================================
//  9. THE BOOK
// ============================================================
function loadEntries(world, rover) {
  try {
    return JSON.parse(localStorage.getItem(world + "-book-" + rover)) || [];
  } catch (error) {
    return [];
  }
}

function saveEntry(scene) {
  runEntries.push({
    title: scene.title,
    date: formatDate(scene.date, scene.approx),
    place: scene.place,
    text: scene.entry.text,
    meanwhile: scene.entry.meanwhile,
    images: sceneImages.slice(0, 2)
  });

  // notification dot + little message
  levelBook.classList.add("has-new");
  toast.classList.remove("show");
  void toast.offsetWidth;          // restarts the animation
  toast.classList.add("show");
  play("newpage");
}

let bookWorld = WORLDS.mars;
let bookEntries = [];
let bookSpread = 0;

// mode "level": only the story you are playing.  mode "intro": every story you finished in that world
function openBook(mode, worldId) {
  bookWorld = WORLDS[worldId];
  if (mode === "level") {
    bookEntries = runEntries.slice();
    bookSpread = Math.max(0, Math.floor((bookEntries.length - 1) / 2));
    levelBook.classList.remove("has-new");
  } else {
    bookEntries = [];
    bookWorld.order.forEach(id => {
      const entries = loadEntries(bookWorld.id, id);
      if (entries.length > 0) {
        bookEntries.push({ cover: true, title: bookWorld.data.rovers[id].name + "'s story" });
        entries.forEach(entry => bookEntries.push(entry));
      }
    });
    bookSpread = 0;
  }
  drawBook();
  BOOKS[bookWorld.id].overlay.style.display = "flex";
}

function pageHTML(entry) {
  if (!entry) return "";
  if (entry.cover) {
    return '<div class="page-cover"><h3>' + esc(entry.title) + '</h3></div>';
  }
  let html = "<h3>" + esc(entry.title) + "</h3>";
  html += '<p class="page-meta">' + esc(entry.date) + " - " + esc(entry.place) + "</p>";
  if (entry.images && entry.images.length > 0) {
    html += '<div class="page-images">';
    entry.images.forEach(image => {
      html += '<img src="' + esc(image.img) + '" alt="' + esc(image.title) + '">';
    });
    html += "</div>";
  }
  html += "<p>" + esc(entry.text) + "</p>";
  if (entry.meanwhile) {
    html += '<p class="page-meanwhile">Meanwhile: ' + esc(entry.meanwhile) + "</p>";
  }
  return html;
}

function drawBook() {
  const b = BOOKS[bookWorld.id];

  if (bookEntries.length === 0) {
    b.left.innerHTML = '<p class="page-empty">Nothing is written here yet. Play the story and the pages will fill up.</p>';
    b.right.innerHTML = "";
    b.count.textContent = "";
    b.prev.disabled = true;
    b.next.disabled = true;
    return;
  }

  const first = bookSpread * 2;
  b.left.innerHTML = pageHTML(bookEntries[first]);
  b.right.innerHTML = pageHTML(bookEntries[first + 1]);
  b.left.scrollTop = 0;
  b.right.scrollTop = 0;

  const lastShown = Math.min(first + 2, bookEntries.length);
  b.count.textContent = "Pages " + (first + 1) + "-" + lastShown + " of " + bookEntries.length;
  b.prev.disabled = bookSpread === 0;
  b.next.disabled = first + 2 >= bookEntries.length;
}

Object.keys(BOOKS).forEach(id => {
  const b = BOOKS[id];

  b.prev.addEventListener('click', () => {
    if (bookSpread > 0) {
      bookSpread--;
      drawBook();
    }
  });

  b.next.addEventListener('click', () => {
    if ((bookSpread + 1) * 2 < bookEntries.length) {
      bookSpread++;
      drawBook();
    }
  });

  // the book button on the intro screen (intro.js shows the overlay, this fills the pages)
  document.getElementById(id + '-book-button').addEventListener('click', () => openBook("intro", id));
});

levelBook.addEventListener('click', () => openBook("level", W.id));


// ============================================================
//  10. THE MENU
// ============================================================
function openMenu() {
  menuNote.textContent = "";
  menu.style.display = "flex";
}

function closeMenu() {
  menu.style.display = "none";
}

menuButton.addEventListener('click', openMenu);
document.getElementById('menu-resume').addEventListener('click', closeMenu);
document.getElementById('menu-home').addEventListener('click', () => leaveLevel("title-screen"));
document.getElementById('menu-levels').addEventListener('click', () => leaveLevel("levels-screen"));

// Settings opens on top of the menu, and its Back button returns here
document.getElementById('menu-settings').addEventListener('click', () => openSettings("level"));


// ============================================================
//  10b. THE BACK BUTTON
//     choose-a-hero screen  ->  the intro screen
//     a story               ->  the choose-a-hero screen   (asks first: the run would be lost)
//     the test              ->  the intro screen           (asks first, only while a test is running)
// ============================================================
async function goBack() {
  if (overlayOpen()) return;

  if (activePane === "pick") {
    backToIntro();
    return;
  }

  if (activePane === "stage") {
    const sure = await askConfirm({
      title: "Leave this story?",
      text: "The pages of this run are only saved when you reach the end, so they would be lost.",
      yes: "Leave story",
      no: "Keep playing"
    });
    // the player may have waited so long that the story ended, or left another way
    if (!sure || activePane !== "stage" || ending.style.display === "flex") return;
    stopEverything();
    closeMenu();
    allBookOverlays().forEach(o => { o.style.display = "none"; });
    showPane("pick");
    refreshPick();
    return;
  }

  if (activePane === "quiz") {
    const testRunning = quizCard.style.display !== "none" && (quizIndex > 0 || quizPicked !== -1);
    if (testRunning) {
      const sure = await askConfirm({
        title: "Leave the test?",
        text: "Your answers so far will not be saved.",
        yes: "Leave test",
        no: "Keep going"
      });
      if (!sure || activePane !== "quiz") return;
    }
    backToIntro();
  }
}

levelBack.addEventListener('click', goBack);

// "Restart Progress" (Settings) erased the saved data: clear the marks on the choose-a-hero cards
document.addEventListener('orbit:progress-reset', () => {
  refreshPick();
  levelBook.classList.remove("has-new");
});


// ============================================================
//  11. THE END OF THE STORY
// ============================================================
function showEnding() {
  localStorage.setItem(KEY.book(currentRover), JSON.stringify(runEntries));   // the finished book is kept now
  localStorage.setItem(KEY.done(currentRover), "true");
  localStorage.setItem(KEY.storyDone(), "true");                                // same key intro.js uses
  document.getElementById(W.id + '-test').disabled = false;

  const otherId = rovers()[currentRover].other;
  const otherDone = localStorage.getItem(KEY.done(otherId)) === "true";
  let text = "You finished " + rovers()[currentRover].name + "'s story. The test is unlocked.";
  if (!otherDone) {
    text += W.otherHint(rovers()[otherId].name);
  }
  document.getElementById('ending-text').textContent = text;
  ending.style.display = "flex";
  play("win");
}

document.getElementById('ending-button').addEventListener('click', () => {
  backToIntro();
  const test = document.getElementById(W.id + '-test');
  test.classList.remove("unlocked-flash");
  void test.offsetWidth;
  test.classList.add("unlocked-flash");
  play("unlock");
});


// ============================================================
//  12. THE TEST
// ============================================================
let quizIndex = 0;
let quizScore = 0;
let quizOrder = [];                 // the shuffled order of the answers, as positions in q.options
let quizPicked = -1;                // the position the player picked (-1 = not answered yet)

const quizCard = document.getElementById('quiz-card');
const quizResult = document.getElementById('quiz-result');
const quizNext = document.getElementById('quiz-next');

function startQuiz() {
  quizIndex = 0;
  quizScore = 0;
  quizResult.style.display = "none";
  quizCard.style.display = "flex";
  showQuestion();
}

function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function showQuestion() {
  const quiz = W.data.quiz;
  const q = quiz[quizIndex];
  quizPicked = -1;
  quizOrder = shuffle(q.options.map((text, i) => i));

  document.getElementById('quiz-progress').textContent = "Question " + (quizIndex + 1) + " / " + quiz.length;
  document.getElementById('quiz-score').textContent = "Score: " + quizScore;
  document.getElementById('quiz-bar-fill').style.width = (quizIndex / quiz.length * 100) + "%";
  document.getElementById('quiz-question').textContent = q.q;
  document.getElementById('quiz-feedback').textContent = "";
  quizNext.style.display = "none";

  const optionsBox = document.getElementById('quiz-options');
  optionsBox.innerHTML = "";

  quizOrder.forEach(position => {
    const button = document.createElement("button");
    button.className = "button quiz-option";
    button.textContent = q.options[position];
    button.addEventListener('click', () => answerQuestion(position));
    optionsBox.appendChild(button);
  });
}

// the answer is matched by its position in q.options, never by its text
function answerQuestion(position) {
  if (quizPicked !== -1) return;
  quizPicked = position;

  const quiz = W.data.quiz;
  const q = quiz[quizIndex];
  const isCorrect = position === q.answer;

  const buttons = document.querySelectorAll("#quiz-options .quiz-option");
  buttons.forEach((button, k) => {
    button.disabled = true;
    if (quizOrder[k] === q.answer) button.classList.add("correct");
    else if (quizOrder[k] === position) button.classList.add("wrong");
  });

  const feedback = document.getElementById('quiz-feedback');
  if (isCorrect) {
    quizScore++;
    feedback.textContent = "Correct! " + q.why;
    play("correct");
  } else {
    feedback.textContent = "Not quite. " + q.why;
    play("wrong");
  }
  document.getElementById('quiz-score').textContent = "Score: " + quizScore;
  document.getElementById('quiz-bar-fill').style.width = ((quizIndex + 1) / quiz.length * 100) + "%";

  quizNext.textContent = quizIndex + 1 < quiz.length ? "Next" : "See results";
  quizNext.style.display = "block";
}

quizNext.addEventListener('click', () => {
  quizIndex++;
  if (quizIndex < W.data.quiz.length) {
    showQuestion();
  } else {
    showResult();
  }
});

// keys 1-4 pick an answer in the test, Enter / Space go to the next question
document.addEventListener('keydown', (event) => {
  if (!isVisible() || activePane !== "quiz" || overlayOpen()) return;
  if (quizCard.style.display === "none") return;

  if (/^[1-4]$/.test(event.key) && quizPicked === -1) {
    const button = document.querySelectorAll("#quiz-options .quiz-option")[Number(event.key) - 1];
    if (button) button.click();
  }
});

function showResult() {
  quizCard.style.display = "none";
  quizResult.style.display = "flex";

  const total = W.data.quiz.length;
  const percent = quizScore / total;
  let title = "Keep exploring";
  let text = "Open the book on the " + W.screen + " screen to read the story again, then try the test one more time.";
  if (percent === 1) {
    title = "Perfect!";
    text = W.perfectText;
  } else if (percent >= 0.75) {
    title = "Great job!";
    text = "You could join the science team. A few details slipped by, but the book has them all.";
  } else if (percent >= 0.5) {
    title = "Good try";
    text = "You know the big moments. Check the book for the rest and come back stronger.";
  }

  const best = Math.max(quizScore, Number(localStorage.getItem(KEY.best())) || 0);
  localStorage.setItem(KEY.best(), best);

  document.getElementById('quiz-result-title').textContent = title;
  document.getElementById('quiz-result-score').textContent = quizScore + " / " + total;
  document.getElementById('quiz-result-text').textContent = text;
  document.getElementById('quiz-result-best').textContent = "Best score: " + best + " / " + total;
  document.getElementById('quiz-bar-fill').style.width = "100%";
  play(percent >= 0.75 ? "win" : "lose");
}

document.getElementById('quiz-retry').addEventListener('click', startQuiz);
document.getElementById('quiz-back').addEventListener('click', backToIntro);
