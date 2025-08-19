// Mobile Navigation
const burger = document.querySelector('.burger');
const mobileNav = document.querySelector('.mobile-nav');
const overlay = document.querySelector('.overlay');
const navLinks = document.querySelectorAll('.mobile-nav-links li a');

// Toggle Mobile Menu
function toggleMenu() {
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    
    // Burger animation
    burger.classList.toggle('active');
}

// Event listeners
burger.addEventListener('click', toggleMenu);

overlay.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    burger.classList.remove('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
        burger.classList.remove('active');
    });
});

// Highlight current page
const currentPage = window.location.pathname.split('/').pop();
const allNavLinks = document.querySelectorAll('nav a');

allNavLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

// Handle resize event to close mobile menu on larger screens
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
        burger.classList.remove('active');
    }
});