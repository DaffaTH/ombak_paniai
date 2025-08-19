document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            document.getElementById(button.getAttribute('data-tab')).classList.add('active');
        });
    });

    // Load data for Pembinaan OPD tab
    loadPembinaanData();

    // Add event listeners for filters
    document.getElementById('tahun-filter').addEventListener('change', filterPembinaanTable);
    document.getElementById('opd-filter').addEventListener('change', filterPembinaanTable);
});

function loadPembinaanData() {
    // Data dengan nama publikasi dan link Google Drive
    const pembinaanData = [
        { 
            id: 1, 
            opd: "Dinas Pendidikan", 
            publikasi: "Profil Pendidikan Kabupaten Paniai 2024", 
            tanggal: "2025-08-18", 
            status: "sudah",
            driveLink: "https://drive.google.com/file/d/17w2xw-riydNwsVZaKuUVcfCtVKKG2YOB/view?usp=sharing"
        },
        { 
            id: 2, 
            opd: "Dinas Pekerjaan Umum dan Tata Ruang", 
            publikasi: "Profil Panjang Jalan Kabupaten Pendidikan 2024", 
            tanggal: "2025-08-18", 
            status: "sudah",
            driveLink: "https://drive.google.com/file/d/1kcj3vw1kPEzLUx28N1YKSr1HayP_UykI/view?usp=drive_link"
        },
        { 
            id: 3, 
            opd: "Dinas Perikanan", 
            publikasi: "Profil Perikanan Kabupaten Paniai 2024", 
            tanggal: "2025-08-18", 
            status: "sudah",
            driveLink: "https://drive.google.com/file/d/1qh-iU1U5CbEaR9ZQgfsUaxIIfMSfvepp/view?usp=drive_link"
        },
        { 
            id: 4, 
            opd: "Badan Pengelolaan Keuangan dan Aset Daerah", 
            publikasi: "Profil Keuangan dan Aset Daerah Kabupaten Paniai 2024", 
            tanggal: "2025-08-18", 
            status: "sudah",
            driveLink: "https://drive.google.com/file/d/1u6QhyAPw-cvXv8vCC4U7WAkuinDmtVae/view?usp=drive_link"
        },
        { 
            id: 5, 
            opd: "Badan Kepegawaian Daerah", 
            publikasi: "Profil Aparatur Sipil Negara Kabupaten Paniai 2024", 
            tanggal: "", 
            status: "belum",
            driveLink: ""
        },
        { 
            id: 6, 
            opd: "Dinas Kesehatan", 
            publikasi: "Profil Kesehatan Kabupaten Paniai 2024", 
            tanggal: "", 
            status: "belum",
            driveLink: ""
        },
        { 
            id: 7, 
            opd: "Dinas Kependudukan dan Pencatatan Sipil", 
            publikasi: "Profil Kependudukan Kabupaten Paniai 2024", 
            tanggal: "", 
            status: "belum",
            driveLink: ""
        },
        { 
            id: 8, 
            opd: "Badan Pendapatan Daerah", 
            publikasi: "Profil Pendapatan Daerah Kabupaten Paniai 2024", 
            tanggal: "2025-08-18", 
            status: "sudah",
            driveLink: "https://drive.google.com/file/d/1B9e5TvZ6lq-gxX3LqcchmP2NscTcWtKO/view?usp=drive_link"
        },
        { 
            id: 9, 
            opd: "Inspektorat", 
            publikasi: "Kompilasi Data Pemeriksaan Reguler Kabupaten Paniai 2024", 
            tanggal: "", 
            status: "belum",
            driveLink: ""
        }
    ];

    // Simpan data ke localStorage untuk digunakan di filter
    localStorage.setItem('pembinaanData', JSON.stringify(pembinaanData));

      // Render tabel dan filter
    renderPembinaanTable(pembinaanData);
    setupFilters(pembinaanData);

}

function setupFilters(data) {
    // Get unique years and OPDs
    const years = [...new Set(data.map(item => new Date(item.tanggal).getFullYear()))].sort((a, b) => b - a);
    const opds = [...new Set(data.map(item => item.opd))].sort();

    // Populate year filter
    const tahunFilter = document.getElementById('tahun-filter');
    tahunFilter.innerHTML = '<option value="all">Semua Tahun</option>';
    years.forEach(year => {
        tahunFilter.innerHTML += `<option value="${year}">${year}</option>`;
    });

    // Populate OPD filter
    const opdFilter = document.getElementById('opd-filter');
    opdFilter.innerHTML = '<option value="all">Semua OPD</option>';
    opds.forEach(opd => {
        const value = opd.toLowerCase().replace(/ /g, '-');
        opdFilter.innerHTML += `<option value="${value}">${opd}</option>`;
    });
}

function renderPembinaanTable(data) {
    const tableBody = document.querySelector('#pembinaan-table tbody');
    tableBody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        
        // Status class and text
        const statusClass = item.status === 'sudah' ? 'completed' : 'pending';
        const statusText = item.status === 'sudah' ? 'Sudah' : 'Belum';
       
        // Tombol unduh hanya untuk status 'sudah'
        const publikasiCell = item.status === 'sudah' 
            ? `<a href="${item.driveLink}" class="download-button" target="_blank" download>
                  <i class="fas fa-download"></i> Unduh
               </a>`
            : '-';
            
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.opd}</td>
            <td>${item.publikasi}</td>
            <td>${formatDate(item.tanggal)}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>${publikasiCell}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

function filterPembinaanTable() {
    const selectedYear = document.getElementById('tahun-filter').value;
    const selectedOpd = document.getElementById('opd-filter').value;

     // Ambil data dari localStorage
    const allData = JSON.parse(localStorage.getItem('pembinaanData')) || [];
    let filteredData = [...allData];

    // Filter berdasarkan tahun
    if (selectedYear !== 'all') {
        filteredData = filteredData.filter(item => 
            new Date(item.tanggal).getFullYear().toString() === selectedYear
        );
    }

    // Filter berdasarkan OPD
    if (selectedOpd !== 'all') {
        const selectedOpdText = document.querySelector(`#opd-filter option[value="${selectedOpd}"]`).text;
        filteredData = filteredData.filter(item => 
            item.opd === selectedOpdText
        );
    }

    renderPembinaanTable(filteredData);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}