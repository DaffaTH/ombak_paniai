document.addEventListener('DOMContentLoaded', function() {
    let feedbackData = JSON.parse(localStorage.getItem('feedbackData')) || [];
    const DELETE_PASSWORD = "admin123";
    const feedbackForm = document.getElementById('feedbackForm');
    const GIST_CONFIG_KEY = 'feedbackGistConfig';
    const GIST_TOKEN_KEY = 'gistPersonalToken';
    
    // Konfigurasi Gist default
    let gistConfig = JSON.parse(localStorage.getItem(GIST_CONFIG_KEY)) || {
        enabled: true, // Default aktif
        gistId: '',
        filename: 'feedback-data.json',
        personalToken: localStorage.getItem(GIST_TOKEN_KEY) || '' // Ambil token dari localStorage
    };
    
    // Jika token belum ada, minta dari pengguna
    if (!gistConfig.personalToken) {
        showTokenSetupModal();
    }
    
    // Load form data from localStorage if exists
    const savedFormData = JSON.parse(localStorage.getItem('feedbackFormData'));
    if (savedFormData) {
        document.getElementById('name').value = savedFormData.name || '';
        document.getElementById('opd').value = savedFormData.opd || '';
        document.getElementById('comments').value = savedFormData.comments || '';
        
        if (savedFormData.rating) {
            document.getElementById(`star${savedFormData.rating}`).checked = true;
        }
    }
    
    // Inisialisasi
    loadFeedbackData().then(() => {
        updateFeedbackStats();
        updateRecentFeedback();
        initializeYearFilter();
    });
    
    // Fungsi untuk menampilkan modal setup token
    function showTokenSetupModal() {
        const modal = document.createElement('div');
        modal.className = 'password-modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="password-modal-content" style="max-width: 500px;">
                <h3>Setup Sinkronisasi Cloud</h3>
                <p>Untuk menyimpan data feedback ke cloud (GitHub Gist), masukkan Personal Access Token GitHub Anda.</p>
                <div class="form-group">
                    <label for="githubToken">GitHub Personal Access Token</label>
                    <input type="password" id="githubToken" class="password-input" placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx">
                    <small>
                        Untuk mendapatkan token, tanyakan kepada admin BPS Kabupaten Paniai
                    </small>
                </div>
                <div class="password-modal-buttons">
                    <button id="saveTokenBtn">Simpan Token</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const tokenInput = modal.querySelector('#githubToken');
        const skipBtn = modal.querySelector('#skipSetupBtn');
        const saveBtn = modal.querySelector('#saveTokenBtn');
        
        skipBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
            alert('Sinkronisasi cloud dinonaktifkan. Data hanya akan disimpan secara lokal.');
        });
        
        saveBtn.addEventListener('click', function() {
            const token = tokenInput.value.trim();
            if (!token) {
                alert('Token tidak boleh kosong!');
                return;
            }
            
            // Simpan token
            localStorage.setItem(GIST_TOKEN_KEY, token);
            gistConfig.personalToken = token;
            localStorage.setItem(GIST_CONFIG_KEY, JSON.stringify(gistConfig));
            
            document.body.removeChild(modal);
            alert('Token berhasil disimpan! Data akan disinkronisasi dengan cloud.');
            
            // Setelah token disimpan, sinkronkan data
            loadFeedbackData().then(() => {
                updateFeedbackStats();
                updateRecentFeedback();
                initializeYearFilter();
            });
        });
    }
    
    // Save form data when inputs change
    feedbackForm.addEventListener('input', function() {
        const formData = {
            name: document.getElementById('name').value,
            opd: document.getElementById('opd').value,
            rating: document.querySelector('input[name="rating"]:checked')?.value,
            comments: document.getElementById('comments').value
        };
        localStorage.setItem('feedbackFormData', JSON.stringify(formData));
    });

    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const opd = document.getElementById('opd').value;
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        const comments = document.getElementById('comments').value;
        
        if (!name || !opd || !rating) {
            alert('Harap isi semua field yang wajib diisi!');
            return;
        }
        
        const newFeedback = {
            id: Date.now(),
            name,
            opd,
            rating: parseInt(rating),
            comment: comments,
            date: new Date().toISOString().split('T')[0]
        };
        
        feedbackData.unshift(newFeedback);
        
        // Simpan data
        saveFeedbackData().then(() => {
            localStorage.removeItem('feedbackFormData');
            updateFeedbackStats();
            updateRecentFeedback();
            initializeYearFilter();
            feedbackForm.reset();
            alert('Terima kasih atas feedback Anda!');
        }).catch(error => {
            console.error('Gagal menyimpan data:', error);
            alert('Data disimpan secara lokal, tetapi gagal disinkronisasi ke cloud.');
        });
    });

    // Initialize feedback chart
    const ctx = document.getElementById('feedbackChart').getContext('2d');
    const feedbackChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Sangat Puas (5)', 'Puas (4)', 'Cukup (3)', 'Kurang (2)', 'Tidak Puas (1)'],
            datasets: [{
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    '#2ecc71',
                    '#3498db',
                    '#f1c40f',
                    '#e67e22',
                    '#e74c3c'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });

    function updateFeedbackStats(filteredData = feedbackData) {
        const dataToUse = filteredData;
        const totalFeedback = dataToUse.length;
        const totalRating = dataToUse.reduce((sum, feedback) => sum + feedback.rating, 0);
        const avgRating = totalFeedback > 0 ? (totalRating / totalFeedback).toFixed(1) : 0;
        
        document.getElementById('total-feedback').textContent = totalFeedback;
        document.getElementById('avg-rating').textContent = avgRating;
        
        const ratingCounts = [0, 0, 0, 0, 0];
        dataToUse.forEach(feedback => {
            if (feedback.rating >= 1 && feedback.rating <= 5) {
                ratingCounts[5 - feedback.rating]++;
            }
        });
        
        feedbackChart.data.datasets[0].data = ratingCounts;
        feedbackChart.update();
    }

    function updateRecentFeedback(filteredData = feedbackData) {
        const feedbackList = document.querySelector('.feedback-list');
        feedbackList.innerHTML = '';
        
        const yearFilter = document.getElementById('yearFilter');
        const selectedYear = yearFilter ? yearFilter.value : '';
        
        let dataToShow = filteredData;
        if (selectedYear && selectedYear !== 'all') {
            dataToShow = dataToShow.filter(feedback => {
                const feedbackYear = new Date(feedback.date).getFullYear();
                return feedbackYear.toString() === selectedYear;
            });
        }
        
        // Only show max 5 items if no year filter
        if (!selectedYear || selectedYear === 'all') {
            dataToShow = dataToShow.slice(0, 5);
        }
        
        dataToShow.forEach(feedback => {
            const feedbackItem = document.createElement('div');
            feedbackItem.className = 'feedback-item';
            feedbackItem.dataset.id = feedback.id;
            
            const stars = '★'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating);
            
            feedbackItem.innerHTML = `
                <div class="feedback-item-header">
                    <span class="feedback-name">${feedback.name}</span>
                    <span class="feedback-date">${formatDate(feedback.date)}</span>
                </div>
                <div class="feedback-opd">${feedback.opd}</div>
                <div class="feedback-rating">${stars}</div>
                <div class="feedback-comment">${feedback.comment || 'Tidak ada komentar'}</div>
                <input type="checkbox" class="feedback-checkbox" id="feedback-${feedback.id}">
            `;
            
            feedbackList.appendChild(feedbackItem);
        });

        // Remove existing controls before creating new ones
        const existingControls = document.querySelector('.feedback-controls-container');
        if (existingControls) {
            existingControls.remove();
        }

        // Only add controls if there is data
        if (dataToShow.length > 0) {
            const controlsContainer = document.createElement('div');
            controlsContainer.className = 'feedback-controls-container';
            controlsContainer.innerHTML = `
                <div class="feedback-controls">
                    <select id="yearFilter">
                        <option value="all">Semua Tahun</option>
                    </select>
                </div>
                <div class="feedback-actions">
                    <button id="toggleSelectBtn" class="reset-btn">Pilih Feedback</button>
                    <button id="deleteSelectedBtn" class="reset-btn">Hapus Terpilih</button>
                </div>
            `;
            
            feedbackList.parentNode.insertBefore(controlsContainer, feedbackList.nextSibling);
            
            // Initialize controls after elements are created
            initializeYearFilter();
            setupFeedbackControls();
        } else {
            // Add empty state message
            feedbackList.innerHTML = '<p class="no-feedback">Belum ada feedback yang tersedia.</p>';
        }
    }

    function setupFeedbackControls() {
        const toggleSelectBtn = document.getElementById('toggleSelectBtn');
        const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
        
        // Make sure buttons exist before adding event listeners
        if (!toggleSelectBtn || !deleteSelectedBtn) {
            console.log("Control buttons not found");
            return;
        }
        
        // Remove any existing event listeners
        const newToggleBtn = toggleSelectBtn.cloneNode(true);
        const newDeleteBtn = deleteSelectedBtn.cloneNode(true);
        
        toggleSelectBtn.parentNode.replaceChild(newToggleBtn, toggleSelectBtn);
        deleteSelectedBtn.parentNode.replaceChild(newDeleteBtn, deleteSelectedBtn);
        
        // Add event listeners to the new buttons
        newToggleBtn.addEventListener('click', function() {
            const feedbackItems = document.querySelectorAll('.feedback-item');
            if (feedbackItems.length === 0) return;
            
            feedbackItems.forEach(item => {
                item.classList.toggle('selectable');
            });
            
            this.textContent = feedbackItems[0].classList.contains('selectable') 
                ? 'Batal Pilih' 
                : 'Pilih Feedback';
        });
        
        newDeleteBtn.addEventListener('click', function() {
            const selectedCheckboxes = document.querySelectorAll('.feedback-checkbox:checked');
            
            if (selectedCheckboxes.length === 0) {
                alert('Tidak ada feedback yang dipilih!');
                return;
            }
            
            showPasswordModal(selectedCheckboxes);
        });
    }
    
    function showPasswordModal(selectedCheckboxes) {
        const modal = document.createElement('div');
        modal.className = 'password-modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="password-modal-content">
                <h3>Masukkan Password</h3>
                <input type="password" class="password-input" placeholder="Password">
                <div class="password-modal-buttons">
                    <button id="cancelDeleteBtn">Batal</button>
                    <button id="confirmDeleteBtn">Hapus</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const passwordInput = modal.querySelector('.password-input');
        const cancelBtn = modal.querySelector('#cancelDeleteBtn');
        const confirmBtn = modal.querySelector('#confirmDeleteBtn');
        
        cancelBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        confirmBtn.addEventListener('click', function() {
            if (passwordInput.value === DELETE_PASSWORD) {
                const idsToDelete = Array.from(selectedCheckboxes).map(cb => {
                    return parseInt(cb.closest('.feedback-item').dataset.id);
                });
                
                feedbackData = feedbackData.filter(feedback => !idsToDelete.includes(feedback.id));
                
                saveFeedbackData().then(() => {
                    updateFeedbackStats();
                    updateRecentFeedback();
                    initializeYearFilter();
                    
                    const feedbackItems = document.querySelectorAll('.feedback-item');
                    feedbackItems.forEach(item => {
                        item.classList.remove('selectable');
                    });
                    
                    const toggleSelectBtn = document.getElementById('toggleSelectBtn');
                    if (toggleSelectBtn) {
                        toggleSelectBtn.textContent = 'Pilih Feedback';
                    }
                    
                    document.body.removeChild(modal);
                    alert('Feedback terpilih berhasil dihapus!');
                }).catch(error => {
                    console.error('Gagal menyimpan data setelah penghapusan:', error);
                    alert('Data dihapus secara lokal, tetapi gagal disinkronisasi ke cloud.');
                });
            } else {
                passwordInput.classList.add('error');
                passwordInput.value = '';
                setTimeout(() => {
                    passwordInput.classList.remove('error');
                }, 1000);
            }
        });
        
        // Add event listener for Enter key
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                confirmBtn.click();
            }
        });
    }
    
    function initializeYearFilter() {
        const yearFilter = document.getElementById('yearFilter');
        
        if (!yearFilter) return;
        
        // Extract unique years from feedback data
        const years = new Set();
        feedbackData.forEach(feedback => {
            const year = new Date(feedback.date).getFullYear();
            years.add(year);
        });
        
        // Sort years in descending order
        const sortedYears = Array.from(years).sort((a, b) => b - a);
        
        // Clear existing options and add "All Years"
        yearFilter.innerHTML = '<option value="all">Semua Tahun</option>';
        
        // Add each year as an option
        sortedYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
        
        // Add event listener for year filter change
        yearFilter.addEventListener('change', function() {
            const selectedYear = this.value;
            
            if (selectedYear === 'all') {
                updateFeedbackStats(feedbackData);
                updateRecentFeedback(feedbackData);
            } else {
                const filteredData = feedbackData.filter(feedback => {
                    const feedbackYear = new Date(feedback.date).getFullYear();
                    return feedbackYear.toString() === selectedYear;
                });
                
                updateFeedbackStats(filteredData);
                updateRecentFeedback(filteredData);
            }
        });
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    }
    
    // Fungsi untuk menyimpan data feedback
    async function saveFeedbackData() {
        // Simpan ke localStorage terlebih dahulu
        localStorage.setItem('feedbackData', JSON.stringify(feedbackData));
        
        // Jika Gist diaktifkan, sinkronkan ke GitHub Gist
        if (gistConfig.enabled && gistConfig.personalToken) {
            try {
                await saveToGist();
                console.log('Data berhasil disinkronisasi ke Gist');
            } catch (error) {
                console.error('Gagal menyinkronisasi ke Gist:', error);
                throw error;
            }
        } else if (gistConfig.enabled && !gistConfig.personalToken) {
            console.warn('Gist diaktifkan tetapi token tidak tersedia');
        }
        
        return Promise.resolve();
    }
    
    // Fungsi untuk memuat data feedback
    async function loadFeedbackData() {
        // Jika Gist diaktifkan, coba muat dari Gist
        if (gistConfig.enabled && gistConfig.personalToken) {
            try {
                const gistData = await fetchGistData(gistConfig);
                if (gistData && gistData.length > 0) {
                    // Gabungkan data dari Gist dengan data lokal
                    const localData = JSON.parse(localStorage.getItem('feedbackData')) || [];
                    
                    // Buat map untuk menghindari duplikat
                    const feedbackMap = new Map();
                    
                    // Tambahkan data lokal terlebih dahulu
                    localData.forEach(item => {
                        feedbackMap.set(item.id, item);
                    });
                    
                    // Tambahkan data dari Gist (akan menggantikan data lokal dengan ID yang sama)
                    gistData.forEach(item => {
                        feedbackMap.set(item.id, item);
                    });
                    
                    // Konversi kembali ke array dan urutkan berdasarkan ID (timestamp)
                    feedbackData = Array.from(feedbackMap.values()).sort((a, b) => b.id - a.id);
                    
                    // Simpan data yang telah digabungkan
                    localStorage.setItem('feedbackData', JSON.stringify(feedbackData));
                    
                    console.log('Data berhasil dimuat dari Gist dan digabungkan dengan data lokal');
                }
            } catch (error) {
                console.error('Gagal memuat data dari Gist:', error);
                // Fallback ke data lokal
                feedbackData = JSON.parse(localStorage.getItem('feedbackData')) || [];
            }
        } else {
            // Gunakan data lokal saja
            feedbackData = JSON.parse(localStorage.getItem('feedbackData')) || [];
        }
        
        return Promise.resolve();
    }
    
    // Fungsi untuk mengambil data dari Gist
    async function fetchGistData(config) {
        let gistId = config.gistId;
        
        // Jika tidak ada Gist ID, coba buat yang baru
        if (!gistId) {
            // Coba buat Gist baru
            const response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${config.personalToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: 'Feedback Data Storage',
                    public: false,
                    files: {
                        [config.filename]: {
                            content: JSON.stringify([])
                        }
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`Gagal membuat Gist: ${response.status} ${response.statusText}`);
            }
            
            const gist = await response.json();
            gistId = gist.id;
            
            // Simpan Gist ID untuk penggunaan selanjutnya
            config.gistId = gistId;
            localStorage.setItem(GIST_CONFIG_KEY, JSON.stringify(config));
        }
        
        // Ambil data dari Gist
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: {
                'Authorization': `token ${config.personalToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Gagal mengambil data dari Gist: ${response.status} ${response.statusText}`);
        }
        
        const gist = await response.json();
        const fileContent = gist.files[config.filename]?.content;
        
        if (!fileContent) {
            throw new Error('File tidak ditemukan dalam Gist');
        }
        
        return JSON.parse(fileContent);
    }
    
    // Fungsi untuk menyimpan data ke Gist
    async function saveToGist() {
        let gistId = gistConfig.gistId;
        
        // Jika tidak ada Gist ID, coba buat yang baru
        if (!gistId) {
            const response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${gistConfig.personalToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: 'Feedback Data Storage',
                    public: false,
                    files: {
                        [gistConfig.filename]: {
                            content: JSON.stringify(feedbackData)
                        }
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`Gagal membuat Gist: ${response.status} ${response.statusText}`);
            }
            
            const gist = await response.json();
            gistId = gist.id;
            
            // Simpan Gist ID untuk penggunaan selanjutnya
            gistConfig.gistId = gistId;
            localStorage.setItem(GIST_CONFIG_KEY, JSON.stringify(gistConfig));
            
            return;
        }
        
        // Update Gist yang sudah ada
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${gistConfig.personalToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    [gistConfig.filename]: {
                        content: JSON.stringify(feedbackData)
                    }
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`Gagal memperbarui Gist: ${response.status} ${response.statusText}`);
        }
    }
    
    // Event delegation for dynamically created checkboxes
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('feedback-checkbox')) {
            e.stopPropagation();
        }
    });
    
    // Add styles for empty state and modal
    const style = document.createElement('style');
    style.textContent = `
        .no-feedback {
            text-align: center;
            color: var(--text-light);
            font-style: italic;
            padding: 2rem;
        }
        
        .password-modal .form-group {
            margin-bottom: 1rem;
        }
        
        .password-modal .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        .password-modal .form-group small {
            color: #666;
            font-size: 0.8rem;
            display: block;
            margin-top: 0.5rem;
        }
        
        .password-modal .form-group ol {
            margin: 0.5rem 0;
            padding-left: 1.5rem;
        }
        
        .password-modal .form-group li {
            margin-bottom: 0.25rem;
        }
    `;
    document.head.appendChild(style);
});