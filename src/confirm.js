// ============================================================
//  CONFIRM BOX
//  A small "Are you sure?" window in the game's style (#confirm-overlay in index.html).
//
//     const ok = await askConfirm({ title: "Leave?", text: "...", yes: "Leave", no: "Stay" });
//     if (ok) { ... }
//
//  Cancel, Escape and a click on the dark area all answer "no" (false).
// ============================================================

const overlay = document.getElementById('confirm-overlay');
const titleBox = document.getElementById('confirm-title');
const textBox = document.getElementById('confirm-text');
const yesButton = document.getElementById('confirm-yes');
const noButton = document.getElementById('confirm-no');

let resolver = null;

export function isConfirmOpen() {
  return overlay.style.display === "flex";
}

export function askConfirm(options) {
  const o = options || {};
  if (resolver) finish(false);               // a new question cancels an old one

  titleBox.textContent = o.title || "Are you sure?";
  textBox.textContent = o.text || "";
  yesButton.textContent = o.yes || "OK";
  noButton.textContent = o.no || "Cancel";
  overlay.style.display = "flex";
  noButton.focus();                          // the safe answer is the one under the keyboard

  return new Promise(resolve => {
    resolver = resolve;
  });
}

function finish(answer) {
  overlay.style.display = "none";
  const resolve = resolver;
  resolver = null;
  if (resolve) resolve(answer);
}

yesButton.addEventListener('click', () => finish(true));
noButton.addEventListener('click', () => finish(false));

overlay.addEventListener('click', (event) => {
  if (event.target === overlay) finish(false);
});
