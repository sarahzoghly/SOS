const home = document.getElementById('home');

home.addEventListener('click', () => {
  document.querySelectorAll("#title-screen").forEach(section => section.style.display = "block");
  document.querySelectorAll("#levels-screen").forEach(section => section.style.display = "none");
});