document.addEventListener('DOMContentLoaded', function() {
    // Sample data for demonstration
    const sectorData = {
        kependudukan: {
            categories: ['Jumlah Penduduk', 'Kepadatan Penduduk', 'Rasio Jenis Kelamin', 'Angka Harapan Hidup'],
            years: [2021, 2022, 2023],
            data: {
                'Jumlah Penduduk': {
                    2021: { value: 125000, villages: { 'Enarotali': 25000, 'Paniai Timur': 30000, 'Paniai Barat': 35000, 'Bibida': 20000, 'Dagai': 15000 } },
                    2022: { value: 128500, villages: { 'Enarotali': 25500, 'Paniai Timur': 31000, 'Paniai Barat': 36000, 'Bibida': 21000, 'Dagai': 15000 } },
                    2023: { value: 131200 }
                },
                'Kepadatan Penduduk': {
                    2021: { value: 85, villages: { 'Enarotali': 120, 'Paniai Timur': 90, 'Paniai Barat': 75, 'Bibida': 65, 'Dagai': 55 } },
                    2022: { value: 87, villages: { 'Enarotali': 122, 'Paniai Timur': 92, 'Paniai Barat': 77, 'Bibida': 67, 'Dagai': 55 } },
                    2023: { value: 89, villages: { 'Enarotali': 125, 'Paniai Timur': 95, 'Paniai Barat': 80, 'Bibida': 70, 'Dagai': 56 } }
                },
                'Rasio Jenis Kelamin': {
                    2021: { value: 102, villages: { 'Enarotali': 105, 'Paniai Timur': 101, 'Paniai Barat': 100, 'Bibida': 103, 'Dagai': 104 } },
                    2022: { value: 101, villages: { 'Enarotali': 104, 'Paniai Timur': 100, 'Paniai Barat': 99, 'Bibida': 102, 'Dagai': 103 } },
                    2023: { value: 101, villages: { 'Enarotali': 104, 'Paniai Timur': 100, 'Paniai Barat': 99, 'Bibida': 102, 'Dagai': 103 } }
                },
                'Angka Harapan Hidup': {
                    2021: { value: 65, villages: { 'Enarotali': 67, 'Paniai Timur': 66, 'Paniai Barat': 64, 'Bibida': 63, 'Dagai': 65 } },
                    2022: { value: 66, villages: { 'Enarotali': 68, 'Paniai Timur': 67, 'Paniai Barat': 65, 'Bibida': 64, 'Dagai': 66 } },
                    2023: { value: 67, villages: { 'Enarotali': 69, 'Paniai Timur': 68, 'Paniai Barat': 66, 'Bibida': 65, 'Dagai': 67 } }
                }
            }
        },
        infrastruktur: {
            categories: ['Panjang Jalan', 'Jumlah Jembatan', 'Akses Listrik', 'Akses Air Bersih'],
            years: [2021, 2022, 2023],
            data: {
                'Panjang Jalan': {
                    2021: { value: 350, villages: { 'Enarotali': 120, 'Paniai Timur': 80, 'Paniai Barat': 70, 'Bibida': 50, 'Dagai': 30 } },
                    2022: { value: 380, villages: { 'Enarotali': 130, 'Paniai Timur': 90, 'Paniai Barat': 75, 'Bibida': 55, 'Dagai': 30 } },
                    2023: { value: 400, villages: { 'Enarotali': 140, 'Paniai Timur': 95, 'Paniai Barat': 80, 'Bibida': 60, 'Dagai': 25 } }
                },
                'Jumlah Jembatan': {
                    2021: { value: 45, villages: { 'Enarotali': 15, 'Paniai Timur': 10, 'Paniai Barat': 8, 'Bibida': 7, 'Dagai': 5 } },
                    2022: { value: 50, villages: { 'Enarotali': 18, 'Paniai Timur': 12, 'Paniai Barat': 9, 'Bibida': 7, 'Dagai': 4 } },
                    2023: { value: 55, villages: { 'Enarotali': 20, 'Paniai Timur': 13, 'Paniai Barat': 10, 'Bibida': 8, 'Dagai': 4 } }
                },
                'Akses Listrik': {
                    2021: { value: 65, villages: { 'Enarotali': 85, 'Paniai Timur': 70, 'Paniai Barat': 60, 'Bibida': 55, 'Dagai': 45 } },
                    2022: { value: 70, villages: { 'Enarotali': 90, 'Paniai Timur': 75, 'Paniai Barat': 65, 'Bibida': 60, 'Dagai': 50 } },
                    2023: { value: 75, villages: { 'Enarotali': 95, 'Paniai Timur': 80, 'Paniai Barat': 70, 'Bibida': 65, 'Dagai': 55 } }
                },
                'Akses Air Bersih': {
                    2021: { value: 70, villages: { 'Enarotali': 90, 'Paniai Timur': 75, 'Paniai Barat': 65, 'Bibida': 60, 'Dagai': 50 } },
                    2022: { value: 75, villages: { 'Enarotali': 95, 'Paniai Timur': 80, 'Paniai Barat': 70, 'Bibida': 65, 'Dagai': 55 } },
                    2023: { value: 80, villages: { 'Enarotali': 98, 'Paniai Timur': 85, 'Paniai Barat': 75, 'Bibida': 70, 'Dagai': 60 } }
                }
            }
        },
        pertanian: {
            categories: ['Luas Lahan Pertanian', 'Produksi Padi', 'Produksi Ubi Kayu', 'Produksi Sayuran'],
            years: [2021, 2022, 2023],
            data: {
                'Luas Lahan Pertanian': {
                    2021: { value: 12000, villages: { 'Enarotali': 3000, 'Paniai Timur': 3500, 'Paniai Barat': 2500, 'Bibida': 2000, 'Dagai': 1000 } },
                    2022: { value: 12500, villages: { 'Enarotali': 3200, 'Paniai Timur': 3600, 'Paniai Barat': 2600, 'Bibida': 2100, 'Dagai': 1000 } },
                    2023: { value: 13000, villages: { 'Enarotali': 3400, 'Paniai Timur': 3700, 'Paniai Barat': 2700, 'Bibida': 2200, 'Dagai': 1000 } }
                },
                'Produksi Padi': {
                    2021: { value: 8500, villages: { 'Enarotali': 2500, 'Paniai Timur': 3000, 'Paniai Barat': 2000, 'Bibida': 1500, 'Dagai': 500 } },
                    2022: { value: 9000, villages: { 'Enarotali': 2700, 'Paniai Timur': 3200, 'Paniai Barat': 2100, 'Bibida': 1600, 'Dagai': 500 } },
                    2023: { value: 9500, villages: { 'Enarotali': 2900, 'Paniai Timur': 3400, 'Paniai Barat': 2200, 'Bibida': 1700, 'Dagai': 500 } }
                },
                'Produksi Ubi Kayu': {
                    2021: { value: 6500, villages: { 'Enarotali': 2000, 'Paniai Timur': 2500, 'Paniai Barat': 1500, 'Bibida': 1000, 'Dagai': 500 } },
                    2022: { value: 7000, villages: { 'Enarotali': 2200, 'Paniai Timur': 2700, 'Paniai Barat': 1600, 'Bibida': 1100, 'Dagai': 500 } },
                    2023: { value: 7500, villages: { 'Enarotali': 2400, 'Paniai Timur': 2900, 'Paniai Barat': 1700, 'Bibida': 1200, 'Dagai': 500 } }
                },
                'Produksi Sayuran': {
                    2021: { value: 4500, villages: { 'Enarotali': 1500, 'Paniai Timur': 2000, 'Paniai Barat': 1000, 'Bibida': 500, 'Dagai': 500 } },
                    2022: { value: 5000, villages: { 'Enarotali': 1700, 'Paniai Timur': 2200, 'Paniai Barat': 1100, 'Bibida': 600, 'Dagai': 500 } },
                    2023: { value: 5500, villages: { 'Enarotali': 1900, 'Paniai Timur': 2400, 'Paniai Barat': 1200, 'Bibida': 700, 'Dagai': 500 } }
                }
            }
        },
        industri: {
            categories: ['Jumlah UMKM', 'Tenaga Kerja Industri', 'Nilai Produksi', 'Ekspor'],
            years: [2021, 2022, 2023],
            data: {
                'Jumlah UMKM': {
                    2021: { value: 850, villages: { 'Enarotali': 300, 'Paniai Timur': 250, 'Paniai Barat': 150, 'Bibida': 100, 'Dagai': 50 } },
                    2022: { value: 900, villages: { 'Enarotali': 320, 'Paniai Timur': 270, 'Paniai Barat': 160, 'Bibida': 110, 'Dagai': 50 } },
                    2023: { value: 950, villages: { 'Enarotali': 340, 'Paniai Timur': 290, 'Paniai Barat': 170, 'Bibida': 120, 'Dagai': 50 } }
                },
                'Tenaga Kerja Industri': {
                    2021: { value: 2500, villages: { 'Enarotali': 1000, 'Paniai Timur': 800, 'Paniai Barat': 400, 'Bibida': 200, 'Dagai': 100 } },
                    2022: { value: 2700, villages: { 'Enarotali': 1100, 'Paniai Timur': 850, 'Paniai Barat': 450, 'Bibida': 220, 'Dagai': 100 } },
                    2023: { value: 2900, villages: { 'Enarotali': 1200, 'Paniai Timur': 900, 'Paniai Barat': 500, 'Bibida': 240, 'Dagai': 100 } }
                },
                'Nilai Produksi': {
                    2021: { value: 125000000, villages: { 'Enarotali': 50000000, 'Paniai Timur': 40000000, 'Paniai Barat': 20000000, 'Bibida': 10000000, 'Dagai': 5000000 } },
                    2022: { value: 135000000, villages: { 'Enarotali': 55000000, 'Paniai Timur': 42000000, 'Paniai Barat': 22000000, 'Bibida': 11000000, 'Dagai': 5000000 } },
                    2023: { value: 145000000, villages: { 'Enarotali': 60000000, 'Paniai Timur': 45000000, 'Paniai Barat': 25000000, 'Bibida': 12000000, 'Dagai': 5000000 } }
                },
                'Ekspor': {
                    2021: { value: 25000000, villages: { 'Enarotali': 15000000, 'Paniai Timur': 7000000, 'Paniai Barat': 2000000, 'Bibida': 800000, 'Dagai': 200000 } },
                    2022: { value: 27000000, villages: { 'Enarotali': 16000000, 'Paniai Timur': 7500000, 'Paniai Barat': 2200000, 'Bibida': 900000, 'Dagai': 200000 } },
                    2023: { value: 29000000, villages: { 'Enarotali': 17000000, 'Paniai Timur': 8000000, 'Paniai Barat': 2500000, 'Bibida': 1000000, 'Dagai': 200000 } }
                }
            }
        }
    };

    // DOM Elements
    const yearFilterContainer = document.getElementById('year-filter-container');
    const yearFilter = document.getElementById('year-filter');
    const dataCategorySelect = document.getElementById('data-category');
    const dataDisplay = document.querySelector('.data-display');
    const sectorCards = document.querySelectorAll('.sector-card');
    const viewButtons = document.querySelectorAll('.view-btn');
    const barChartSection = document.querySelector('.bar-chart-section');
    const chartContainer = document.querySelector('.chart-container');
    const lineChartCanvas = document.getElementById('lineChart');
    let lineChart = null;
    let barChart = null;
    let currentSector = null;

    // Initialize the page
    function init() {
        // Event listeners
        yearFilter.addEventListener('change', updateBarChart);
        
        dataCategorySelect.addEventListener('change', function() {
            if (this.value) {
                updateLineChart();
                updateYearFilter();
            } else {
                resetCharts();
            }
        });
    
        sectorCards.forEach(card => {
            card.addEventListener('click', function() {
                currentSector = this.getAttribute('data-sector');
                showDataDisplay(currentSector);
            });
        });

        viewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                currentSector = this.closest('.sector-card').getAttribute('data-sector');
                showDataDisplay(currentSector);
            });
        });

        dataDisplay.style.display = 'none';
    }

    function resetCharts() {
    chartContainer.style.display = 'none';
    yearFilterContainer.style.display = 'none';
    barChartSection.style.display = 'none';
    if (lineChart) lineChart.destroy();
    if (barChart) barChart.destroy();
    yearFilter.value = "";
    
    // Kembalikan barChartSection ke keadaan semula
    barChartSection.innerHTML = '<canvas id="barChart"></canvas>';
}

    function showDataDisplay(sector) {
        currentSector = sector;
        dataDisplay.style.display = 'block';
        resetCharts();
        dataDisplay.scrollIntoView({ behavior: 'smooth' });
        
        // Isi dropdown kategori
        dataCategorySelect.innerHTML = '<option value="">Pilih Kategori</option>';
        sectorData[sector].categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            dataCategorySelect.appendChild(option);
        });
    }

    function updateLineChart() {
    const selectedCategory = dataCategorySelect.value;
    if (!selectedCategory) {
        resetCharts();
        return;
    }

    // Sembunyikan grafik batang dan reset filter tahun
    barChartSection.style.display = 'none';
    if (barChart) barChart.destroy();
    yearFilter.value = "";

    // Tampilkan container
    chartContainer.style.display = 'block';
    yearFilterContainer.style.display = 'flex';

    const years = sectorData[currentSector].years;
    const data = sectorData[currentSector].data[selectedCategory];
    
    // Prepare data for Chart.js
    const chartData = {
        labels: years,
        datasets: [{
            label: 'Total',
            data: years.map(year => data[year].value),
            backgroundColor: '#3498db',
            borderColor: '#3498db',
            borderWidth: 3,
            tension: 0.1,
            fill: false
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: `Perkembangan ${selectedCategory} (${years[0]}-${years[years.length-1]})`,
                font: { size: 16 }
            },
            legend: { position: 'top' }
        },
        scales: { y: { beginAtZero: false } }
    };

    // Create new chart
    if (lineChart) lineChart.destroy();
    lineChart = new Chart(lineChartCanvas, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
}

    function updateYearFilter() {
        const selectedCategory = dataCategorySelect.value;
        if (!selectedCategory) return;

        yearFilter.innerHTML = '<option value="">Pilih Tahun</option>';
        sectorData[currentSector].years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
    }

    function updateBarChart() {
    const selectedYear = yearFilter.value;
    const selectedCategory = dataCategorySelect.value;
    
    if (!selectedYear || selectedYear === "" || !selectedCategory) {
        barChartSection.style.display = 'none';
        if (barChart) barChart.destroy();
        return;
    }

    const data = sectorData[currentSector].data[selectedCategory][selectedYear];
    
    // Cek apakah data villages tersedia
    if (!data.villages || Object.keys(data.villages).length === 0) {
        // Hapus chart jika ada
        if (barChart) barChart.destroy();
        
        // Tampilkan pesan bahwa data tidak tersedia
        barChartSection.innerHTML = `
            <div class="no-data-message">
                <p>Data per distrik tidak tersedia</p>
            </div>
        `;
        barChartSection.style.display = 'block';
        
        // Sesuaikan tinggi container
        barChartSection.style.height = 'auto';
        return;
    }

    const villages = Object.keys(data.villages);
    
    // Prepare data for Chart.js
    const chartData = {
        labels: villages,
        datasets: [{
            label: selectedCategory,
            data: villages.map(village => data.villages[village]),
            backgroundColor: ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'],
            borderWidth: 1
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: `${selectedCategory} per Distrik (${selectedYear})`,
                font: { size: 16 }
            },
            legend: { display: false }
        },
        scales: { y: { beginAtZero: true } }
    };

    // Kembalikan container ke keadaan semula
    barChartSection.innerHTML = '<canvas id="barChart"></canvas>';
    barChartSection.style.height = '500px'; // Tinggi tetap saat menampilkan grafik
    
    // Show and create chart
    barChartSection.style.display = 'block';
    if (barChart) barChart.destroy();
    barChart = new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: chartData,
        options: chartOptions
    });
}

    // Initialize the page
    init();
});