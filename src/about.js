const home = document.getElementById('home2');

home.addEventListener('click', () => {
  document.querySelectorAll("#title-screen").forEach(section => section.style.display = "flex");
  document.querySelectorAll("#about-screen").forEach(section => section.style.display = "none");
});