// Mobile Navigation
const burger = document.querySelector('.burger');
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('nav ul li a');
const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    
    // Tambahkan ini untuk animasi burger
    burger.querySelector('.line1').classList.toggle('active');
    burger.querySelector('.line2').classList.toggle('active');
    burger.querySelector('.line3').classList.toggle('active');
});

// Close mobile menu when clicking on overlay or link
overlay.addEventListener('click', () => {
    nav.classList.remove('active');
    burger.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        burger.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

// Highlight current page in navigation
const currentPage = window.location.pathname.split('/').pop();
navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

// Prevent scrolling when menu is open
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.innerHTML = `
        .no-scroll {
            overflow: hidden;
            height: 100%;
        }
    `;
    document.head.appendChild(style);
<<<<<<< HEAD
});
=======
});
>>>>>>> b5d3c8158960aa94049e5da14d2ae34508278015
