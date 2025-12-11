// galeri.js - Logika Galeri Pelanggan (SIMPLIFIED & FINAL)
// VERSI INI MENDUKUNG PENCARIAN BERDASARKAN NAMA ATAU TANGGAL (YYYY-MM-DD)

const galleryList = document.getElementById('gallery-list');
const searchInput = document.getElementById('search-input');
let photoData = [];
let isDataLoaded = false; 

async function loadGalleryData() {
    galleryList.innerHTML = '<p class="no-results">Memuat data...</p>';
    
    try {
        const response = await fetch('galeri-data.json'); 
        
        if (!response.ok) {
            throw new Error(`Gagal memuat data. Status: ${response.status}.`);
        }
        
        photoData = await response.json();
        isDataLoaded = true; // Data berhasil dimuat

        // Tampilkan pesan sambutan default
        filterGallery(); 

    } catch (error) {
        // Blok penanganan error
        console.error('CRITICAL ERROR:', error);
        galleryList.innerHTML = `<p class="no-results" style="color: red;">
            ❌ ERROR KRITIS: Gagal memuat data. <br>
            Pesan Teknis: ${error.message}
        </p>`;
    }
}

function filterGallery() {
    let filteredData = [...photoData]; 
    const searchTerm = searchInput.value.toLowerCase().trim();

    // TAMPILKAN PESAN SAMBUTAN JIKA KOSONG
    if (isDataLoaded && searchTerm.length < 2) { 
        galleryList.innerHTML = '<p class="no-results">Silakan ketik minimal 2 huruf pertama nama Anda atau sebagian tanggal (Contoh: 2025-12) di kolom pencarian di atas.</p>';
        return; 
    }
    
    // 🔍 FILTER BERDASARKAN NAMA ATAU TANGGAL ACARA
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            // Cek apakah nama pelanggan mengandung search term (case-insensitive)
            item.nama_pelanggan.toLowerCase().includes(searchTerm) ||
            
            // ATAU Cek apakah tanggal acara (YYYY-MM-DD) mengandung search term
            item.tanggal_acara.includes(searchTerm)
        );
    }

    renderGallery(filteredData);
}

function renderGallery(data) {
    galleryList.innerHTML = ''; 

    if (data.length === 0) {
        galleryList.innerHTML = '<p class="no-results">Tidak ada hasil yang ditemukan.</p>';
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

document.addEventListener('DOMContentLoaded', loadGalleryData);
window.filterGallery = filterGallery;
