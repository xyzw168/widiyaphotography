// galeri.js - Logika Galeri Pelanggan (SIMPLIFIED)

// Ambil elemen DOM utama (Hapus sortSelect)
const galleryList = document.getElementById('gallery-list');
const searchInput = document.getElementById('search-input');
let photoData = [];
let isDataLoaded = false; 

// Fungsi untuk memuat data JSON dari file statis
async function loadGalleryData() {
    // Tampilkan pesan loading saat memulai
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

// Fungsi utama untuk memfilter (Hapus Logika Sortir)
function filterGallery() {
    let filteredData = [...photoData]; 
    const searchTerm = searchInput.value.toLowerCase().trim();

    // 1. TAMPILKAN PESAN SAMBUTAN JIKA KOSONG
    if (isDataLoaded && searchTerm.length < 2) { 
        galleryList.innerHTML = '<p class="no-results">Silakan ketik minimal 2 huruf pertama nama Anda di kolom pencarian di atas.</p>';
        return; 
    }
    
    // 2. FILTER BERDASARKAN NAMA (JIKA ADA INPUT)
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            item.nama_pelanggan.toLowerCase().includes(searchTerm)
        );
    }

    // 3. TAMPILKAN HASIL
    renderGallery(filteredData);
}

// Fungsi untuk menampilkan hasil
function renderGallery(data) {
    galleryList.innerHTML = ''; 

    if (data.length === 0) {
        galleryList.innerHTML = '<p class="no-results">Tidak ada hasil yang ditemukan. Cek kembali ejaan atau hubungi admin.</p>';
        return;
    }

    data.forEach(item => {
        // Format tanggal (masih berguna)
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
