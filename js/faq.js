document.addEventListener('DOMContentLoaded', function() {
    // FAQ data
    const faqData = [
        {
            question: "Apa itu Pembinaan Statistik Sektoral?",
            answer: "Pembinaan Statistik Sektoral adalah program yang bertujuan untuk meningkatkan kapasitas OPD dalam menghasilkan data statistik yang berkualitas, sesuai dengan standar yang ditetapkan, untuk mendukung perencanaan pembangunan daerah.",
            category: "umum"
        },
        {
            question: "Siapa yang dapat mengikuti pembinaan statistik sektoral?",
            answer: "Pembinaan statistik sektoral ditujukan untuk seluruh OPD di Kabupaten Paniai, terutama staf yang bertanggung jawab dalam pengelolaan data statistik di masing-masing OPD.",
            category: "umum"
        },
        {
            question: "Bagaimana cara mendaftar untuk mengikuti pembinaan?",
            answer: "Pendaftaran dapat dilakukan melalui website ini dengan mengisi formulir pendaftaran yang tersedia atau menghubungi langsung koordinator pembinaan statistik sektoral di Dinas XYZ Kabupaten Paniai.",
            category: "pembinaan"
        },
        {
            question: "Apa saja standar data statistik yang harus dipenuhi?",
            answer: "Standar data statistik meliputi kelengkapan data, ketepatan waktu, akurasi, konsistensi, dan keterbandingan. Detail standar dapat dilihat pada bagian Pedoman di website ini.",
            category: "teknis"
        },
        {
            question: "Bagaimana cara mengunggah metadata statistik?",
            answer: "Metadata statistik dapat diunggah melalui menu Monitoring > Metadata. Pastikan metadata yang diunggah sudah memenuhi standar yang ditetapkan.",
            category: "teknis"
        },
        {
            question: "Apa manfaat dari pembinaan statistik sektoral?",
            answer: "Manfaat pembinaan statistik sektoral antara lain: peningkatan kualitas data statistik, keseragaman metode pengumpulan data, peningkatan kapasitas SDM OPD, dan dukungan data yang lebih baik untuk perencanaan pembangunan.",
            category: "umum"
        },
        {
            question: "Kapan jadwal pembinaan statistik sektoral dilaksanakan?",
            answer: "Jadwal pembinaan dapat dilihat pada bagian Pedoman > SOP & Juknis > Jadwal Pembinaan. Pembinaan rutin biasanya dilaksanakan setiap bulan, sedangkan pembinaan khusus dilaksanakan sesuai kebutuhan.",
            category: "pembinaan"
        },
        {
            question: "Apa yang dimaksud dengan Satu Data Indonesia?",
            answer: "Satu Data Indonesia adalah kebijakan pemerintah untuk menciptakan data yang akurat, mutakhir, terpadu, dan dapat dipertanggungjawabkan, serta dapat diakses dan dibagipakaikan antar instansi pemerintah.",
            category: "data"
        }
    ];

    const faqAccordion = document.querySelector('.faq-accordion');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('search-faq');

    // Render FAQ items
    function renderFAQs(category = 'all', searchTerm = '') {
        faqAccordion.innerHTML = '';

        const filteredFAQs = faqData.filter(faq => {
            const matchesCategory = category === 'all' || faq.category === category;
            const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        if (filteredFAQs.length === 0) {
            faqAccordion.innerHTML = '<p class="no-results">Tidak ditemukan pertanyaan yang sesuai.</p>';
            return;
        }

        filteredFAQs.forEach((faq, index) => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.dataset.category = faq.category;

            faqItem.innerHTML = `
                <div class="faq-question">
                    <h3>${faq.question}</h3>
                    <span class="icon"><i class="fas fa-chevron-down"></i></span>
                </div>
                <div class="faq-answer">
                    <p>${faq.answer}</p>
                </div>
            `;

            faqAccordion.appendChild(faqItem);

            // Add click event to toggle answer
            const question = faqItem.querySelector('.faq-question');
            question.addEventListener('click', () => {
                faqItem.classList.toggle('active');
            });
        });
    }

    // Category filter
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.dataset.category;
            renderFAQs(category, searchInput.value);
        });
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        renderFAQs(activeCategory, searchInput.value);
    });

    // Initial render
    renderFAQs();
});