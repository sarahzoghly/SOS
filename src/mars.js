import { rovers, backdrops, story, quiz } from './mars-data.js';

// ============================================================
//  1. ELEMENTS
// ============================================================
const intro = document.getElementById('mars-intro');
const level = document.getElementById('mars-level');
const pickPane = document.getElementById('mars-pick');
const stagePane = document.getElementById('mars-stage');
const quizPane = document.getElementById('mars-quiz');

// top bar
const levelBook = document.getElementById('mars-level-book');
const dayBox = document.getElementById('mars-day');
const dayNumber = document.getElementById('mars-day-number');
const dayDate = document.getElementById('mars-day-date');
const toast = document.getElementById('mars-toast');
const menuButton = document.getElementById('mars-menu-button');

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

// book
const bookOverlay = document.getElementById('mars-book');
const leftPage = document.getElementById('mars-page-left');
const rightPage = document.getElementById('mars-page-right');
const bookCount = document.getElementById('mars-book-count');
const bookPrev = document.getElementById('mars-book-prev');
const bookNext = document.getElementById('mars-book-next');

// menu
const menu = document.getElementById('mars-menu');
const menuNote = document.getElementById('menu-note');


// ============================================================
//  2. VARIABLES THE GAME REMEMBERS
// ============================================================
let currentRover = "opportunity";   // "opportunity" or "spirit"
let sceneIndex = 0;                 // which scene we are in
let beatIndex = 0;                  // which line of that scene we are on
let sceneImages = [];               // photos found during this scene (they go in the book)

let typing = false;                 // is the text still being typed?
let typeTimer = null;
let fullText = "";
let waitingForChoice = false;       // is the player supposed to pick an answer?
let foundOpen = false;              // is a photo on the screen?
let canAdvance = false;             // false while the screen fades
let chapterWaiting = false;         // true while the chapter card is on the screen
let chapterTimer = null;

let shownDay = 0;                   // the number on the day counter right now
let dayFrame = null;


// ============================================================
//  3. SMALL HELPERS
// ============================================================
function showPane(name) {
  pickPane.style.display = name === "pick" ? "flex" : "none";
  stagePane.style.display = name === "stage" ? "block" : "none";
  quizPane.style.display = name === "quiz" ? "flex" : "none";

  // the book and the day counter only make sense during the story
  levelBook.style.display = name === "stage" ? "flex" : "none";
  dayBox.style.display = name === "stage" ? "block" : "none";
}

function otherRover() {
  return rovers[rovers[currentRover].other];
}

function currentScene() {
  return story[currentRover][sceneIndex];
}

function formatDate(dateString, approx) {
  const date = new Date(dateString);
  const options = approx
    ? { year: "numeric", month: "short", timeZone: "UTC" }
    : { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" };
  return date.toLocaleDateString("en-US", options).toUpperCase();
}

// stops the typing and the timers (used when we leave the level)
function stopEverything() {
  toast.classList.remove("show");
  clearInterval(typeTimer);
  clearTimeout(chapterTimer);
  cancelAnimationFrame(dayFrame);
  typing = false;
  canAdvance = false;
  chapterWaiting = false;
  waitingForChoice = false;
  foundOpen = false;
}


// ============================================================
//  4. STARTING AND LEAVING
// ============================================================
// called from intro.js when "Play Story" is clicked
export function startMarsStory() {
  toast.classList.remove("show");
  intro.style.display = "none";
  level.style.display = "block";
  showPane("pick");
  refreshPick();
}

// called from intro.js when "Test" is clicked
export function startMarsTest() {
  toast.classList.remove("show");
  intro.style.display = "none";
  level.style.display = "block";
  showPane("quiz");
  startQuiz();
}

function refreshPick() {
  document.getElementById('done-opportunity').style.display =
    localStorage.getItem("mars-done-opportunity") === "true" ? "block" : "none";
  document.getElementById('done-spirit').style.display =
    localStorage.getItem("mars-done-spirit") === "true" ? "block" : "none";
}

// go back to the Mars intro screen
function backToIntro() {
  stopEverything();
  ending.style.display = "none";
  level.style.display = "none";
  intro.style.display = "flex";
}

// leave the level and show another screen (home, levels, settings)
function leaveLevel(screenId) {
  stopEverything();
  closeMenu();
  ending.style.display = "none";
  bookOverlay.style.display = "none";
  level.style.display = "none";
  document.querySelectorAll("#" + screenId).forEach(section => section.style.display = "flex");
}

// the two "Play as ..." buttons
document.querySelectorAll(".pick-button").forEach(button => {
  button.addEventListener('click', () => playRover(button.dataset.rover));
});

function playRover(id) {
  currentRover = id;
  sceneIndex = 0;
  shownDay = 0;

  level.style.setProperty("--accent", rovers[id].accent);
  level.style.setProperty("--accent-light", rovers[id].light);

  // a fresh book for this run
  localStorage.setItem("mars-book-" + id, "[]");
  levelBook.classList.remove("has-new");

  dayNumber.textContent = "DAY 0";
  dayDate.textContent = formatDate(rovers[id].launch, false);

  showPane("stage");
  startScene(0);
}


// ============================================================
//  5. SCENES
// ============================================================
function startScene(i) {
  sceneIndex = i;
  const scene = currentScene();

  canAdvance = false;
  dialog.style.visibility = "hidden";
  foundBox.style.display = "none";
  stagePane.classList.remove("is-meanwhile");

  // chapter card
  document.getElementById('chapter-number').textContent = "CHAPTER " + (i + 1) + " OF " + story[currentRover].length;
  document.getElementById('chapter-title').textContent = scene.title;
  document.getElementById('chapter-date').textContent = formatDate(scene.date, scene.approx);
  document.getElementById('chapter-place').textContent = scene.place;
  curtain.classList.add("show");

  chapterWaiting = true;
  clearTimeout(chapterTimer);
  chapterTimer = setTimeout(openScene, 3000);
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
  chapterTimer = setTimeout(() => {
    canAdvance = true;
    showBeat(0);
  }, 800);
}

function setBackdrop(name) {
  const b = backdrops[name];
  stagePane.style.setProperty("--sky-top", b.skyTop);
  stagePane.style.setProperty("--sky-bottom", b.skyBottom);
  stagePane.style.setProperty("--far", b.far);
  stagePane.style.setProperty("--ground", b.ground);
  stagePane.style.setProperty("--stars", b.stars);
  stagePane.style.setProperty("--dust", b.dust);
  stagePane.style.setProperty("--sun", b.sun);
}

function setActor(value, arrive) {
  actor.className = "actor " + value;
  // the rover drives in from the left when a scene starts
  if (arrive && value.includes("rover")) {
    actor.classList.add("arrive", "driving");
    setTimeout(() => actor.classList.remove("arrive", "driving"), 1700);
  }
}

// ---------- the day counter ----------
function setDay(dateString, approx) {
  const launch = new Date(rovers[currentRover].launch);
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
//  6. BEATS (the lines of a scene)
// ============================================================
function showBeat(i) {
  const scene = currentScene();
  const beat = scene.beats[i];
  beatIndex = i;

  // a beat can change the backdrop with a quick fade to black
  if (beat.bg) {
    dip.classList.add("show");
    setTimeout(() => {
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
    showFound(beat);
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

  if (who === "me") speaker.textContent = rovers[currentRover].name;
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
  sceneImages.push({ img: beat.img, title: beat.title });
}

function closeFound() {
  foundOpen = false;
  foundBox.style.display = "none";
}


// ============================================================
//  7. CLICKING THROUGH THE STORY
// ============================================================
function advance() {
  if (chapterWaiting) {            // skip the chapter card
    openScene();
    return;
  }
  if (!canAdvance) return;

  if (foundOpen) {
    closeFound();
    nextBeat();
    return;
  }
  if (typing) {                    // first click finishes the text
    finishTyping();
    return;
  }
  if (waitingForChoice) return;    // pick an answer first
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
  saveEntry(currentScene());

  if (sceneIndex + 1 < story[currentRover].length) {
    setTimeout(() => startScene(sceneIndex + 1), 500);
  } else {
    setTimeout(showEnding, 500);
  }
}

stagePane.addEventListener('click', (event) => {
  if (event.target.closest("button")) return;
  advance();
});

document.addEventListener('keydown', (event) => {
  if (event.key === "Escape") {
    if (bookOverlay.style.display === "flex") {
      bookOverlay.style.display = "none";
    } else if (menu.style.display === "flex") {
      closeMenu();
    } else if (level.style.display === "block") {
      openMenu();
    }
    return;
  }

  const storyOpen = level.style.display === "block" && stagePane.style.display === "block";
  const somethingOnTop = menu.style.display === "flex" || bookOverlay.style.display === "flex" || ending.style.display === "flex";
  if (!storyOpen || somethingOnTop) return;

  if (event.key === " " || event.key === "Enter" || event.key === "ArrowRight") {
    event.preventDefault();
    advance();
  }
});


// ============================================================
//  8. THE BOOK
// ============================================================
function loadEntries(id) {
  try {
    return JSON.parse(localStorage.getItem("mars-book-" + id)) || [];
  } catch (error) {
    return [];
  }
}

function saveEntry(scene) {
  const entries = loadEntries(currentRover);
  entries.push({
    title: scene.title,
    date: formatDate(scene.date, scene.approx),
    place: scene.place,
    text: scene.entry.text,
    meanwhile: scene.entry.meanwhile,
    images: sceneImages.slice(0, 2)
  });
  localStorage.setItem("mars-book-" + currentRover, JSON.stringify(entries));

  // notification dot + little message
  levelBook.classList.add("has-new");
  toast.classList.remove("show");
  void toast.offsetWidth;          // restarts the animation
  toast.classList.add("show");
}

let bookEntries = [];
let bookSpread = 0;

// mode "level": only the rover you are playing.  mode "intro": everything you finished
function openBook(mode) {
  if (mode === "level") {
    bookEntries = loadEntries(currentRover);
    bookSpread = Math.max(0, Math.floor((bookEntries.length - 1) / 2));
    levelBook.classList.remove("has-new");
  } else {
    bookEntries = [];
    ["opportunity", "spirit"].forEach(id => {
      const entries = loadEntries(id);
      if (entries.length > 0) {
        bookEntries.push({ cover: true, title: rovers[id].name + "'s story" });
        entries.forEach(entry => bookEntries.push(entry));
      }
    });
    bookSpread = 0;
  }
  drawBook();
  bookOverlay.style.display = "flex";
}

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
  if (bookEntries.length === 0) {
    leftPage.innerHTML = '<p class="page-empty">Nothing is written here yet. Play the story and the pages will fill up.</p>';
    rightPage.innerHTML = "";
    bookCount.textContent = "";
    bookPrev.disabled = true;
    bookNext.disabled = true;
    return;
  }

  const first = bookSpread * 2;
  leftPage.innerHTML = pageHTML(bookEntries[first]);
  rightPage.innerHTML = pageHTML(bookEntries[first + 1]);
  leftPage.scrollTop = 0;
  rightPage.scrollTop = 0;

  const lastShown = Math.min(first + 2, bookEntries.length);
  bookCount.textContent = "Pages " + (first + 1) + "-" + lastShown + " of " + bookEntries.length;
  bookPrev.disabled = bookSpread === 0;
  bookNext.disabled = first + 2 >= bookEntries.length;
}

bookPrev.addEventListener('click', () => {
  if (bookSpread > 0) {
    bookSpread--;
    drawBook();
  }
});

bookNext.addEventListener('click', () => {
  if ((bookSpread + 1) * 2 < bookEntries.length) {
    bookSpread++;
    drawBook();
  }
});

levelBook.addEventListener('click', () => openBook("level"));

// the book button on the intro screen (intro.js shows the overlay, this fills the pages)
document.getElementById('mars-book-button').addEventListener('click', () => openBook("intro"));


// ============================================================
//  9. THE MENU
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

document.getElementById('menu-settings').addEventListener('click', () => {
  // when the settings screen exists (Saif's part) this opens it
  if (document.getElementById("settings-screen")) {
    leaveLevel("settings-screen");
  } else {
    menuNote.textContent = "Settings are coming soon.";
  }
});


// ============================================================
//  10. THE END OF THE STORY
// ============================================================
function showEnding() {
  localStorage.setItem("mars-done-" + currentRover, "true");
  localStorage.setItem("mars-story-done", "true");     // same key intro.js uses
  document.getElementById('mars-test').disabled = false;

  const otherDone = localStorage.getItem("mars-done-" + rovers[currentRover].other) === "true";
  let text = "You finished " + rovers[currentRover].name + "'s story. The test is unlocked.";
  if (!otherDone) {
    text += " Come back and play as " + otherRover().name + " to see the other side of Mars.";
  }
  document.getElementById('ending-text').textContent = text;
  ending.style.display = "flex";
}

document.getElementById('ending-button').addEventListener('click', () => {
  backToIntro();
  const test = document.getElementById('mars-test');
  test.classList.remove("unlocked-flash");
  void test.offsetWidth;
  test.classList.add("unlocked-flash");
});


// ============================================================
//  11. THE TEST
// ============================================================
let quizIndex = 0;
let quizScore = 0;
let answered = false;

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
  const q = quiz[quizIndex];
  answered = false;

  document.getElementById('quiz-progress').textContent = "Question " + (quizIndex + 1) + " / " + quiz.length;
  document.getElementById('quiz-score').textContent = "Score: " + quizScore;
  document.getElementById('quiz-bar-fill').style.width = (quizIndex / quiz.length * 100) + "%";
  document.getElementById('quiz-question').textContent = q.q;
  document.getElementById('quiz-feedback').textContent = "";
  quizNext.style.display = "none";

  const optionsBox = document.getElementById('quiz-options');
  optionsBox.innerHTML = "";

  const options = shuffle(q.options.map((text, i) => ({ text: text, correct: i === q.answer })));
  options.forEach(option => {
    const button = document.createElement("button");
    button.className = "button quiz-option";
    button.textContent = option.text;
    button.addEventListener('click', () => answerQuestion(button, option.correct, q));
    optionsBox.appendChild(button);
  });
}

function answerQuestion(clicked, isCorrect, q) {
  if (answered) return;
  answered = true;

  const buttons = document.querySelectorAll(".quiz-option");
  buttons.forEach(button => {
    button.disabled = true;
    if (button.textContent === q.options[q.answer]) button.classList.add("correct");
  });

  const feedback = document.getElementById('quiz-feedback');
  if (isCorrect) {
    quizScore++;
    feedback.textContent = "Correct! " + q.why;
  } else {
    clicked.classList.add("wrong");
    feedback.textContent = "Not quite. " + q.why;
  }
  document.getElementById('quiz-score').textContent = "Score: " + quizScore;
  document.getElementById('quiz-bar-fill').style.width = ((quizIndex + 1) / quiz.length * 100) + "%";

  quizNext.textContent = quizIndex + 1 < quiz.length ? "Next" : "See results";
  quizNext.style.display = "block";
}

quizNext.addEventListener('click', () => {
  quizIndex++;
  if (quizIndex < quiz.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  quizCard.style.display = "none";
  quizResult.style.display = "flex";

  const percent = quizScore / quiz.length;
  let title = "Keep exploring";
  let text = "Open the book on the Mars screen to read the story again, then try the test one more time.";
  if (percent === 1) {
    title = "Perfect!";
    text = "Flawless run. You know the rovers like their own engineers do.";
  } else if (percent >= 0.75) {
    title = "Great job!";
    text = "You could join the science team. A few details slipped by, but the book has them all.";
  } else if (percent >= 0.5) {
    title = "Good try";
    text = "You know the big moments. Check the book for the rest and come back stronger.";
  }

  const best = Math.max(quizScore, Number(localStorage.getItem("mars-test-best")) || 0);
  localStorage.setItem("mars-test-best", best);

  document.getElementById('quiz-result-title').textContent = title;
  document.getElementById('quiz-result-score').textContent = quizScore + " / " + quiz.length;
  document.getElementById('quiz-result-text').textContent = text;
  document.getElementById('quiz-result-best').textContent = "Best score: " + best + " / " + quiz.length;
  document.getElementById('quiz-bar-fill').style.width = "100%";
}

document.getElementById('quiz-retry').addEventListener('click', startQuiz);
document.getElementById('quiz-back').addEventListener('click', backToIntro);
