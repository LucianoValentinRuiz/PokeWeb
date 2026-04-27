document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('container-menu');
  


  hamburger?.addEventListener('click', () => {
    menu.classList.toggle('menu-open');
    hamburger.classList.toggle('active');
    
  });
});