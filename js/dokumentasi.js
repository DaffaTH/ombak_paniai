document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi semua carousel
    document.querySelectorAll('.carousel-container').forEach(container => {
        const carousel = container.querySelector('.carousel-inner');
        const items = container.querySelectorAll('.carousel-item');
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        const indicators = container.querySelectorAll('.indicator');
        
        let currentIndex = 0;
        const itemCount = items.length;
        let intervalId;
        let isAnimating = false; // Flag untuk mencegah animasi bertumpuk
        
        // Set initial active item
        updateCarousel();
        
        // Auto slide
        startAutoSlide();
        
        // Previous button click
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (isAnimating) return;
                navigate(-1);
            });
        }
        
        // Next button click
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (isAnimating) return;
                navigate(1);
            });
        }
        
        // Indicator click
        if (indicators) {
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    if (isAnimating || currentIndex === index) return;
                    goToSlide(index);
                });
            });
        }
        
        function navigate(direction) {
            isAnimating = true;
            
            // Hitung index baru
            let newIndex = currentIndex + direction;
            
            // Handle infinite loop
            if (newIndex < 0) {
                // Jika prev di slide pertama, pindah ke slide terakhir
                newIndex = itemCount - 1;
            } else if (newIndex >= itemCount) {
                // Jika next di slide terakhir, pindah ke slide pertama
                newIndex = 0;
            }
            
            currentIndex = newIndex;
            updateCarousel();
            resetAutoSlide();
            
            // Reset flag setelah animasi selesai
            setTimeout(() => {
                isAnimating = false;
            }, 500); // Sesuaikan dengan durasi transisi CSS (0.5s)
        }
        
        function goToSlide(index) {
            isAnimating = true;
            currentIndex = index;
            updateCarousel();
            resetAutoSlide();
            
            setTimeout(() => {
                isAnimating = false;
            }, 500);
        }
        
        function updateCarousel() {
            // Update carousel position
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update active indicator
            if (indicators) {
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === currentIndex);
                });
            }
        }
        
        function startAutoSlide() {
            intervalId = setInterval(() => {
                navigate(1); // Gunakan fungsi navigate untuk handling loop
            }, 3000);
        }
        
        function resetAutoSlide() {
            clearInterval(intervalId);
            startAutoSlide();
        }
        
        // Pause on hover
        container.addEventListener('mouseenter', () => {
            clearInterval(intervalId);
        });
        
        container.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    });
});