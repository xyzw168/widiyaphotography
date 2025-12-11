// galeri.js - Logika Galeri Pelanggan Widiya Photo
const galleryList = document.getElementById('gallery-list');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
let photoData = [];
let isDataLoaded = false; // <-- VARIABEL STATUS BARU

async function loadGalleryData() {
    galleryList.innerHTML = '<p class="no-results">Memuat data...</p>';
    
    try {
        const response = await fetch('galeri-data.json'); 
        
        if (!response.ok) {
            throw new Error(`Gagal memuat data. Status: ${response.status} (${response.statusText}).`);
        }
        
        photoData = await response.json();
        isDataLoaded = true; // <-- DATA BERHASIL DIMUAT

        // Panggil filterGallery untuk menampilkan pesan sambutan default
        filterGallery(); 

    } catch (error) {
        // Blok penanganan error
        console.error('CRITICAL ERROR:', error);
        galleryList.innerHTML = `<p class="no-results" style="color: red;">
            ❌ ERROR: Gagal memuat data galeri. <br>
            Cek konsol browser (F12) untuk detail error teknis. <br>
            Pesan Teknis: ${error.message}
        </p>`;
    }
}

function filterGallery() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    // LOGIKA PERUBAHAN: TAMPILKAN PESAN SAMBUTAN JIKA KOSONG
    if (isDataLoaded && searchTerm.length < 2) { 
        galleryList.innerHTML = '<p class="no-results">Silakan ketik minimal 2 huruf pertama nama Anda di kolom pencarian di atas.</p>';
        return; // Hentikan fungsi agar tidak menampilkan semua data atau error
    }

    // Hanya lanjutkan filtering jika ada term pencarian (minimal 2 karakter)
    let filteredData = [...photoData]; 
    const sortMethod = sortSelect.value;
    
    // ... (Logika filter dan sort di sini) ...
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            item.nama_pelanggan.toLowerCase().includes(searchTerm)
        );
    }
    if (sortMethod === 'terbaru') {
        filteredData.sort((a, b) => new Date(b.tanggal_acara) - new Date(a.tanggal_acara));
    } else if (sortMethod === 'terlama') {
        filteredData.sort((a, b) => new Date(a.tanggal_acara) - new Date(b.tanggal_acara));
    }
    // TAMPILKAN HASIL
    renderGallery(filteredData);
}

// Fungsi renderGallery (tidak diubah)
function renderGallery(data) {
    galleryList.innerHTML = ''; 

    if (data.length === 0) {
        galleryList.innerHTML = '<p class="no-results">Tidak ada hasil yang ditemukan untuk nama tersebut. Silakan cek kembali ejaan Anda.</p>';
        return;
    }

    data.forEach(item => {
        const dateObj = new Date(item.tanggal_acara);
        const formattedDate = dateObj instanceof Date && !isNaN(dateObj) ?
                              dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) :
                              'Tanggal Tidak Valid';

        const itemHtml = `
            <div class="gallery-item">
                <h3>${item.nama_pelanggan} (${item.kategori})</h3>
                <p><strong>Tanggal Acara:</strong> ${formattedDate}</p>
                <p><strong>ID Pesanan:</strong> ${item.id}</p>
                <a href="${item.link_drive}" target="_blank" rel="noopener noreferrer">
                    Buka Folder Google Drive
                </a>
            </div>
        `;
        galleryList.insertAdjacentHTML('beforeend', itemHtml);
    });
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', loadGalleryData);
window.filterGallery = filterGallery;
