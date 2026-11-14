const home = document.getElementById('home');

home.addEventListener('click', () => {
  document.querySelectorAll("#title-screen").forEach(section => section.style.display = "flex");
  document.querySelectorAll("#levels-screen").forEach(section => section.style.display = "none");
});

const tooltip = document.getElementById("tooltip");

const mars = document.querySelectorAll("#mars-button");

mars.forEach(planet => {

    planet.addEventListener("mouseenter", () => {
        tooltip.textContent = "-Spirit & Opportunity-";
        tooltip.style.display = "flex";
    });

    planet.addEventListener("mousemove", (event) => {
        tooltip.style.left = `${event.clientX + 15}px`;
        tooltip.style.top = `${event.clientY + 15}px`;
    });

    planet.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
    });

});

const moon = document.querySelectorAll("#moon-button");


moon.forEach(planet => {

    planet.addEventListener("mouseenter", () => {
        tooltip.textContent = "-Apollo-";
        tooltip.style.display = "flex";
    });

    planet.addEventListener("mousemove", (event) => {
        tooltip.style.left = `${event.clientX + 15}px`;
        tooltip.style.top = `${event.clientY + 15}px`;
    });

    planet.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
    });

});

const marsButton = document.getElementById('mars-button')
const moonButton = document.getElementById('moon-button')

marsButton.addEventListener('click', () => {
  tooltip.style.display = "none";
  document.querySelectorAll("#levels-screen").forEach(section => section.style.display = "none");
  document.querySelectorAll("#mars-intro").forEach(section => section.style.display = "flex");
});

moonButton.addEventListener('click', () => {
  tooltip.style.display = "none";
  document.querySelectorAll("#levels-screen").forEach(section => section.style.display = "none");
  document.querySelectorAll("#moon-intro").forEach(section => section.style.display = "flex");
});