document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Set active tab initially
    document.querySelector('.tab-button.active').click();

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Load data for the active tab
            if (tabId === 'pembinaan-opd') {
                loadPembinaanData();
            } else if (tabId === 'metadata') {
                loadMetadataData();
            } else if (tabId === 'rekomendasi') {
                loadRekomendasiData();
            }
        });
    });

    // Load data for Pembinaan OPD tab initially
    loadPembinaanData();

    // Add event listeners for filters
    document.getElementById('tahun-filter').addEventListener('change', filterPembinaanTable);
    document.getElementById('opd-filter').addEventListener('change', filterPembinaanTable);
    
    // Add event listeners for metadata filters
    document.getElementById('metadata-tahun-filter').addEventListener('change', filterMetadataTable);
    document.getElementById('metadata-opd-filter').addEventListener('change', filterMetadataTable);
    
    // Add event listeners for rekomendasi filters
    document.getElementById('rekomendasi-tahun-filter').addEventListener('change', filterRekomendasiTable);
    document.getElementById('rekomendasi-opd-filter').addEventListener('change', filterRekomendasiTable);
});

// Konfigurasi Spreadsheet
const SPREADSHEET_CONFIG = {
    pembinaan: {
        id: '1bVlR5N0jZqpkHKvO0w0yWf55TXnTuMe94c4yJAhcB0c',
        range: 'Publikasi!A:E'
    },
    metadata: {
        id: '1bVlR5N0jZqpkHKvO0w0yWf55TXnTuMe94c4yJAhcB0c',
        range: 'Metadata!A:M'
    },
    rekomendasi: {
        id: '1bVlR5N0jZqpkHKvO0w0yWf55TXnTuMe94c4yJAhcB0c',
        range: 'Rekomendasi!A:M'
    }
};

// Fungsi untuk mendeteksi status dari checklis atau teks
function getStatus(value) {
    if (!value) return 'belum';
    const stringValue = value.toString().toLowerCase().trim();
    return stringValue.includes('✅') || 
           stringValue.includes('sudah') || 
           stringValue.includes('yes') || 
           stringValue.includes('true') || 
           stringValue.includes('1') ? 'sudah' : 'belum';
}

// Fungsi untuk mengambil data dari Google Sheets
async function fetchDataFromSheet(sheetId, range, loadingId, errorId) {
    showLoading(true, loadingId);
    hideError(errorId);
    
    try {
        const apiKey = 'AIzaSyCDGfHtFe9ND9aJ-0ZsafceMOxqplFd_a0';
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.values || data.values.length === 0) {
            throw new Error('Tidak ada data ditemukan di spreadsheet');
        }
        
        // Mengubah array data menjadi array of objects
        const headers = data.values[0];
        const rows = data.values.slice(1);
        
        const result = rows.map(row => {
            const obj = {};
            headers.forEach((header, i) => {
                const mappedHeader = mapHeaderName(header);
                obj[mappedHeader] = row[i] || '';
            });
            return obj;
        });
        
        showLoading(false, loadingId);
        return result;
    } catch (error) {
        showLoading(false, loadingId);
        showError(`Gagal memuat data: ${error.message}`, errorId);
        console.error('Error fetching data:', error);
        return [];
    }
}

// Fungsi untuk mapping nama header spreadsheet ke nama field internal
function mapHeaderName(header) {
    const headerMap = {
        // Pembinaan OPD
        'Nama OPD': 'opd',
        'Nama Publikasi': 'publikasi',
        'Tanggal Publikasi': 'tanggal',
        'Status Publikasi': 'status',
        'Link Publikasi': 'driveLink',
        
        // Metadata
        'Tahun': 'tahun',
        'Metadata Kegiatan': 'metadataKegiatan',
        'Metadata Variabel': 'metadataVariabel',
        'Metadata Indikator': 'metadataIndikator',
        'Disetujui': 'metadataDisetujui',
        'Nama Kegiatan': 'namaKegiatan',
        
        // Rekomendasi
        'Tahun': 'tahun',
        'Rekomendasi Kegiatan': 'rekomendasiKegiatan',
        'Rekomendasi Variabel': 'rekomendasiVariabel',
        'Rekomendasi Indikator': 'rekomendasiIndikator',
        'Nama Kegiatan': 'namaKegiatan'
    };
    
    return headerMap[header] || header.toLowerCase().replace(/\s+/g, '');
}

// Fungsi untuk menampilkan/menyembunyikan loading indicator
function showLoading(show, elementId) {
    const loadingIndicator = document.getElementById(elementId);
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'block' : 'none';
    }
}

// Fungsi untuk menampilkan error
function showError(message, elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Fungsi untuk menyembunyikan error
function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Fungsi untuk mengekstrak tahun dari tanggal
function extractYearFromDate(dateString) {
    if (!dateString) return null;
    
    try {
        let date;
        if (dateString.includes('/')) {
            const parts = dateString.split('/');
            if (parts.length === 3) {
                return parts[2];
            }
        } else if (dateString.includes('-')) {
            const parts = dateString.split('-');
            if (parts.length === 3) {
                return parts[0];
            }
        }
        
        const parsedDate = new Date(dateString);
        if (!isNaN(parsedDate.getTime())) {
            return parsedDate.getFullYear().toString();
        }
        
        return null;
    } catch (error) {
        console.error('Error extracting year from date:', error);
        return null;
    }
}

async function loadPembinaanData() {
    const data = await fetchDataFromSheet(
        SPREADSHEET_CONFIG.pembinaan.id, 
        SPREADSHEET_CONFIG.pembinaan.range,
        'loading-indicator-pembinaan',
        'error-message-pembinaan'
    );
    
    if (data.length > 0) {
        localStorage.setItem('pembinaanData', JSON.stringify(data));
        renderPembinaanTable(data);
        setupPembinaanFilters(data);
    }
}

async function loadMetadataData() {
    const data = await fetchDataFromSheet(
        SPREADSHEET_CONFIG.metadata.id, 
        SPREADSHEET_CONFIG.metadata.range,
        'loading-indicator-metadata',
        'error-message-metadata'
    );
    
    if (data.length > 0) {
        localStorage.setItem('metadataData', JSON.stringify(data));
        renderMetadataTable(data);
        setupMetadataFilters(data);
    }
}

async function loadRekomendasiData() {
    const data = await fetchDataFromSheet(
        SPREADSHEET_CONFIG.rekomendasi.id, 
        SPREADSHEET_CONFIG.rekomendasi.range,
        'loading-indicator-rekomendasi',
        'error-message-rekomendasi'
    );
    
    if (data.length > 0) {
        localStorage.setItem('rekomendasiData', JSON.stringify(data));
        renderRekomendasiTable(data);
        setupRekomendasiFilters(data);
    }
}

// Setup filter khusus untuk pembinaan
function setupPembinaanFilters(data) {
    const years = [...new Set(data.map(item => extractYearFromDate(item.tanggal)))].filter(year => year).sort((a, b) => b - a);
    const opds = [...new Set(data.map(item => item.opd))].sort();

    const tahunFilter = document.getElementById('tahun-filter');
    tahunFilter.innerHTML = '<option value="all">Semua Tahun</option>';
    years.forEach(year => {
        tahunFilter.innerHTML += `<option value="${year}">${year}</option>`;
    });

    const opdFilter = document.getElementById('opd-filter');
    opdFilter.innerHTML = '<option value="all">Semua OPD</option>';
    opds.forEach(opd => {
        const value = opd.toLowerCase().replace(/ /g, '-');
        opdFilter.innerHTML += `<option value="${value}">${opd}</option>`;
    });
}

// Setup filter untuk metadata - mengambil tahun dari data spreadsheet
function setupMetadataFilters(data) {
    // Ambil tahun dari data spreadsheet (kolom 'tahun')
    const years = [...new Set(data.map(item => item.tahun))].filter(year => year && year.toString().trim() !== '').sort((a, b) => b - a);
    const opds = [...new Set(data.map(item => item.opd))].sort();

    const tahunFilter = document.getElementById('metadata-tahun-filter');
    tahunFilter.innerHTML = '<option value="all">Semua Tahun</option>';
    years.forEach(year => {
        tahunFilter.innerHTML += `<option value="${year}">${year}</option>`;
    });

    const opdFilter = document.getElementById('metadata-opd-filter');
    opdFilter.innerHTML = '<option value="all">Semua OPD</option>';
    opds.forEach(opd => {
        const value = opd.toLowerCase().replace(/ /g, '-');
        opdFilter.innerHTML += `<option value="${value}">${opd}</option>`;
    });
}

// Setup filter untuk rekomendasi - mengambil tahun dari data spreadsheet
function setupRekomendasiFilters(data) {
    // Ambil tahun dari data spreadsheet (kolom 'tahun')
    const years = [...new Set(data.map(item => item.tahun))].filter(year => year && year.toString().trim() !== '').sort((a, b) => b - a);
    const opds = [...new Set(data.map(item => item.opd))].sort();

    const tahunFilter = document.getElementById('rekomendasi-tahun-filter');
    tahunFilter.innerHTML = '<option value="all">Semua Tahun</option>';
    years.forEach(year => {
        tahunFilter.innerHTML += `<option value="${year}">${year}</option>`;
    });

    const opdFilter = document.getElementById('rekomendasi-opd-filter');
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
        
        const statusValue = getStatus(item.status);
        const statusClass = statusValue === 'sudah' ? 'completed' : 'pending';
        const statusText = statusValue === 'sudah' ? 'Sudah' : 'Belum';
       
        const publikasiCell = statusValue === 'sudah' && item.driveLink
            ? `<a href="${item.driveLink}" class="download-button" target="_blank" download>
                  <i class="fas fa-download"></i> Unduh
               </a>`
            : '-';
            
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.opd || '-'}</td>
            <td>${item.publikasi || '-'}</td>
            <td>${formatDate(item.tanggal)}</td>
            <td class="status-cell"><span class="status ${statusClass}">${statusText}</span></td>
            <td>${publikasiCell}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

function renderMetadataTable(data) {
    const tableBody = document.querySelector('#metadata-table tbody');
    tableBody.innerHTML = '';
    const thead = document.querySelector('#metadata-table thead');
    
    // Group data by year
    const years = [...new Set(data.map(item => item.tahun))].filter(year => year && year.toString().trim() !== '').sort((a, b) => b - a);
    
    // Update table header - menghilangkan tulisan "Tahun"
    let headerHTML = `
        <tr>
            <th rowspan="2">Nama OPD</th>
    `;
    
    // Header untuk setiap tahun (colspan sesuai jumlah kolom per tahun)
    years.forEach(year => {
        headerHTML += `<th colspan="5" class="year-header">${year}</th>`;
    });
    
    headerHTML += `</tr><tr>`;
    
    // Sub-header untuk setiap kolom dalam tahun
    years.forEach(() => {
        headerHTML += `
            <th class="sub-header">Metadata Kegiatan</th>
            <th class="sub-header">Metadata Variabel</th>
            <th class="sub-header">Metadata Indikator</th>
            <th class="sub-header">Disetujui</th>
            <th class="sub-header">Nama Kegiatan</th>
        `;
    });
    
    headerHTML += `</tr>`;
    thead.innerHTML = headerHTML;
    
    // Group data by OPD
    const opds = [...new Set(data.map(item => item.opd))].sort();
    
    opds.forEach(opd => {
        const row = document.createElement('tr');
        let rowHTML = `<td>${opd}</td>`;
        
        years.forEach(year => {
            const yearData = data.find(item => item.opd === opd && item.tahun == year);
            
            if (yearData) {
                const kegiatanStatus = getStatus(yearData.metadataKegiatan);
                const variabelStatus = getStatus(yearData.metadataVariabel);
                const indikatorStatus = getStatus(yearData.metadataIndikator);
                const disetujuiStatus = getStatus(yearData.metadataDisetujui);
                
                const kegiatanClass = kegiatanStatus === 'sudah' ? 'completed' : 'pending';
                const variabelClass = variabelStatus === 'sudah' ? 'completed' : 'pending';
                const indikatorClass = indikatorStatus === 'sudah' ? 'completed' : 'pending';
                const disetujuiClass = disetujuiStatus === 'sudah' ? 'completed' : 'pending';
                
                rowHTML += `
                    <td class="status-cell"><span class="status ${kegiatanClass}">${kegiatanStatus === 'sudah' ? 'Sudah' : 'Belum'}</span></td>
                    <td class="status-cell"><span class="status ${variabelClass}">${variabelStatus === 'sudah' ? 'Sudah' : 'Belum'}</span></td>
                    <td class="status-cell"><span class="status ${indikatorClass}">${indikatorStatus === 'sudah' ? 'Sudah' : 'Belum'}</span></td>
                    <td class="status-cell"><span class="status ${disetujuiClass}">${disetujuiStatus === 'sudah' ? 'Sudah' : 'Belum'}</span></td>
                    <td>${yearData.namaKegiatan || '-'}</td>
                `;
            } else {
                // Empty cells if no data for this year
                rowHTML += `
                    <td class="status-cell">-</td>
                    <td class="status-cell">-</td>
                    <td class="status-cell">-</td>
                    <td class="status-cell">-</td>
                    <td>-</td>
                `;
            }
        });
        
        row.innerHTML = rowHTML;
        tableBody.appendChild(row);
    });
}

function renderRekomendasiTable(data) {
    const tableBody = document.querySelector('#rekomendasi-table tbody');
    tableBody.innerHTML = '';
    const thead = document.querySelector('#rekomendasi-table thead');
    
    // Group data by year
    const years = [...new Set(data.map(item => item.tahun))].filter(year => year && year.toString().trim() !== '').sort((a, b) => b - a);
    
    // Update table header - menghilangkan tulisan "Tahun"
    let headerHTML = `
        <tr>
            <th rowspan="2">Nama OPD</th>
    `;
    
    // Header untuk setiap tahun (colspan sesuai jumlah kolom per tahun)
    years.forEach(year => {
        headerHTML += `<th colspan="4" class="year-header">${year}</th>`;
    });
    
    headerHTML += `</tr><tr>`;
    
    // Sub-header untuk setiap kolom dalam tahun
    years.forEach(() => {
        headerHTML += `
            <th class="sub-header">Rekomendasi Kegiatan</th>
            <th class="sub-header">Rekomendasi Variabel</th>
            <th class="sub-header">Rekomendasi Indikator</th>
            <th class="sub-header">Nama Kegiatan</th>
        `;
    });
    
    headerHTML += `</tr>`;
    thead.innerHTML = headerHTML;
    
    // Group data by OPD
    const opds = [...new Set(data.map(item => item.opd))].sort();
    
    opds.forEach(opd => {
        const row = document.createElement('tr');
        let rowHTML = `<td>${opd}</td>`;
        
        years.forEach(year => {
            const yearData = data.find(item => item.opd === opd && item.tahun == year);
            
            if (yearData) {
                const kegiatanStatus = getStatus(yearData.rekomendasiKegiatan);
                const variabelStatus = getStatus(yearData.rekomendasiVariabel);
                const indikatorStatus = getStatus(yearData.rekomendasiIndikator);
                
                const kegiatanClass = kegiatanStatus === 'sudah' ? 'completed' : 'pending';
                const variabelClass = variabelStatus === 'sudah' ? 'completed' : 'pending';
                const indikatorClass = indikatorStatus === 'sudah' ? 'completed' : 'pending';
                
                rowHTML += `
                    <td class="status-cell"><span class="status ${kegiatanClass}">${kegiatanStatus === 'sudah' ? 'Sudah' : 'Belum'}</span></td>
                    <td class="status-cell"><span class="status ${variabelClass}">${variabelStatus === 'sudah' ? 'Sudah' : 'Belum'}</span></td>
                    <td class="status-cell"><span class="status ${indikatorClass}">${indikatorStatus === 'sudah' ? 'Sudah' : 'Belum'}</span></td>
                    <td>${yearData.namaKegiatan || '-'}</td>
                `;
            } else {
                // Empty cells if no data for this year
                rowHTML += `
                    <td class="status-cell">-</td>
                    <td class. status-cell">-</td>
                    <td class="status-cell">-</td>
                    <td>-</td>
                `;
            }
        });
        
        row.innerHTML = rowHTML;
        tableBody.appendChild(row);
    });
}

function filterPembinaanTable() {
    const selectedYear = document.getElementById('tahun-filter').value;
    const selectedOpd = document.getElementById('opd-filter').value;

    const allData = JSON.parse(localStorage.getItem('pembinaanData')) || [];
    let filteredData = [...allData];

    if (selectedYear !== 'all') {
        filteredData = filteredData.filter(item => {
            const itemYear = extractYearFromDate(item.tanggal);
            return itemYear === selectedYear;
        });
    }

    if (selectedOpd !== 'all') {
        const selectedOpdText = document.querySelector(`#opd-filter option[value="${selectedOpd}"]`).text;
        filteredData = filteredData.filter(item => 
            item.opd === selectedOpdText
        );
    }

    renderPembinaanTable(filteredData);
}

function filterMetadataTable() {
    const selectedYear = document.getElementById('metadata-tahun-filter').value;
    const selectedOpd = document.getElementById('metadata-opd-filter').value;

    const allData = JSON.parse(localStorage.getItem('metadataData')) || [];
    let filteredData = [...allData];

    if (selectedYear !== 'all') {
        filteredData = filteredData.filter(item => 
            item.tahun == selectedYear
        );
    }

    if (selectedOpd !== 'all') {
        const selectedOpdText = document.querySelector(`#metadata-opd-filter option[value="${selectedOpd}"]`).text;
        filteredData = filteredData.filter(item => 
            item.opd === selectedOpdText
        );
    }

    renderMetadataTable(filteredData);
}

function filterRekomendasiTable() {
    const selectedYear = document.getElementById('rekomendasi-tahun-filter').value;
    const selectedOpd = document.getElementById('rekomendasi-opd-filter').value;

    const allData = JSON.parse(localStorage.getItem('rekomendasiData')) || [];
    let filteredData = [...allData];

    if (selectedYear !== 'all') {
        filteredData = filteredData.filter(item => 
            item.tahun == selectedYear
        );
    }

    if (selectedOpd !== 'all') {
        const selectedOpdText = document.querySelector(`#rekomendasi-opd-filter option[value="${selectedOpd}"]`).text;
        filteredData = filteredData.filter(item => 
            item.opd === selectedOpdText
        );
    }

    renderRekomendasiTable(filteredData);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    
    try {
        let date;
        if (dateString.includes('/')) {
            const parts = dateString.split('/');
            date = new Date(parts[2], parts[1] - 1, parts[0]);
        } else if (dateString.includes('-')) {
            date = new Date(dateString);
        } else {
            return dateString;
        }
        
        if (isNaN(date.getTime())) {
            return dateString;
        }
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}