const home = document.getElementById('home2');
const aboutBack = document.getElementById('about-back');
const aboutScreen = document.getElementById('about-screen');

// Home (top left) and Back (top right) both return to the title screen
function backToTitle() {
  document.querySelectorAll("#title-screen").forEach(section => section.style.display = "flex");
  aboutScreen.style.display = "none";
  aboutScreen.scrollTop = 0;       // the next visit starts at the top again
}

home.addEventListener('click', backToTitle);
aboutBack.addEventListener('click', backToTitle);
