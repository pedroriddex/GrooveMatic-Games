 // Cargar header
 fetch('/parts/header.html')
 .then(response => response.text())
 .then(data => {
   document.querySelector('#header').innerHTML = data;
});

 // Cargar footer
 fetch('/parts/footer.html')
 .then(response => response.text())
 .then(data => {
   document.querySelector('#footer').innerHTML = data;
 });

const burger = document.querySelector(".burger");

function openMenu() {
  const body = document.body;
  const noMobileElement = document.querySelector('.nomobile');

  // Toggle la clase para abrir/cerrar el menú
  body.classList.toggle("nav-open");
  noMobileElement.classList.toggle("open");

  // Bloquear o desbloquear el scroll
  if (body.classList.contains("nav-open")) {
    // Bloquear el scroll
    body.style.overflow = "hidden";
  } else {
    // Desbloquear el scroll
    body.style.overflow = "auto";
  }
}




