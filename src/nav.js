// ============================================================
//  NAVIGATION
//  The Escape key works like the Back button:
//     confirm box -> closes it (answers "no")
//     settings    -> Back
//     book        -> Close
//     intro / about / levels screen -> Back
//  Inside a level, src/level.js decides what Escape does (it opens the menu),
//  and this file stays out of the way, except for the settings screen and the
//  confirm box, which can open on top of a level.
// ============================================================

const shown = id => {
  const element = document.getElementById(id);
  return !!element && getComputedStyle(element).display !== "none";
};

const press = id => document.getElementById(id).click();

// the screens that have a Back button, from the front-most to the back-most
const BACK_BUTTONS = [
  ["mars-intro", "mars-back"],
  ["moon-intro", "moon-back"],
  ["about-screen", "about-back"],
  ["levels-screen", "levels-back"]
];

// capture phase, so this runs before level.js and can stop it
document.addEventListener('keydown', (event) => {
  if (event.key !== "Escape") return;

  if (shown("confirm-overlay")) {
    event.stopImmediatePropagation();
    press("confirm-no");
    return;
  }

  if (shown("settings-screen")) {
    event.stopImmediatePropagation();
    press("settings-back");
    return;
  }

  if (shown("mars-level")) return;                   // level.js handles Escape inside a level

  for (const book of ["mars-book", "moon-book"]) {
    if (shown(book)) {
      press(book + "-close");
      return;
    }
  }

  for (const [screen, button] of BACK_BUTTONS) {
    if (shown(screen)) {
      press(button);
      return;
    }
  }
}, true);
