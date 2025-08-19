// Mobile Navigation
        const burger = document.querySelector('.burger');
        const mobileNav = document.querySelector('.mobile-nav');
        const overlay = document.querySelector('.overlay');
        const navLinks = document.querySelectorAll('.mobile-nav-links li a');

        // Toggle Mobile Menu
        burger.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            burger.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when clicking on overlay or links
        overlay.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            burger.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                burger.classList.remove('active');
                overlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
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