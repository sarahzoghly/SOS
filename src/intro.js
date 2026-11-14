// Everything the Mars and Moon intro screens need lives in this function.
// We call it once for "mars" and once for "moon" at the bottom.
function setupIntro(planet) {
  const intro = document.getElementById(`${planet}-intro`);
  const back = document.getElementById(`${planet}-back`);
  const play = document.getElementById(`${planet}-play`);
  const test = document.getElementById(`${planet}-test`);
  const bookButton = document.getElementById(`${planet}-book-button`);
  const book = document.getElementById(`${planet}-book`);
  const bookClose = document.getElementById(`${planet}-book-close`);

  // if the player already finished this story before, unlock Test right away
  if (localStorage.getItem(`${planet}-story-done`) === "true") {
    test.disabled = false;
  }

  // back button: hide this screen, show the levels screen
  back.addEventListener('click', () => {
    intro.style.display = "none";
    document.querySelectorAll("#levels-screen").forEach(section => section.style.display = "flex");
  });

  play.addEventListener('click', () => {
    // TODO: show the story here.
    // When the story ends, call finishStory(planet) to unlock Test.
    // For now it unlocks right away so you can see it working.
    finishStory(planet);
  });

  test.addEventListener('click', () => {
    // TODO: go to the main level
    console.log(`${planet} test clicked`);
  });

  // book: open it, close it with the button, or by clicking the blurry area
  bookButton.addEventListener('click', () => {
    book.style.display = "flex";
  });

  bookClose.addEventListener('click', () => {
    book.style.display = "none";
  });

  book.addEventListener('click', (event) => {
    if (event.target === book) {
      book.style.display = "none";
    }
  });
}

// export so the future story code can import it: import { finishStory } from './intro.js'
export function finishStory(planet) {
  localStorage.setItem(`${planet}-story-done`, "true");
  document.getElementById(`${planet}-test`).disabled = false;
}

setupIntro("mars");
setupIntro("moon");