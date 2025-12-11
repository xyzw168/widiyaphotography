// galeri.js - Logika Galeri Pelanggan Widiya Photo

// Ambil elemen DOM utama
const galleryList = document.getElementById('gallery-list');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
let photoData = [];

// Fungsi untuk memuat data JSON dari file statis (galeri-data.json)
async function loadGalleryData() {
    // Tampilkan pesan loading
    galleryList.innerHTML = '<p class="no-results">Memuat data...</p>';
    
    try {
        // Coba ambil file JSON. Pastikan nama file ini SAMA PERSIS dengan nama file di GitHub.
        const response = await fetch('galeri-data.json'); 
        
        if (!response.ok) {
            // Jika status HTTP bukan 200 (misalnya 404 Not Found), lempar error.
            throw new Error(`Gagal memuat data. Status: ${response.status} (${response.statusText}). Pastikan galeri-data.json ada.`);
        }
        
        photoData = await response.json();
        
        // Setelah data dimuat, jalankan filter/sortir default
        filterGallery(); 

    } catch (error) {
        // Tangani error, tampilkan di UI dan Console
        console.error('CRITICAL ERROR:', error);
        galleryList.innerHTML = `<p class="no-results" style="color: red;">
            ❌ ERROR KRITIS: Gagal memuat data galeri. <br>
            Cek konsol browser (F12) untuk detail error. <br>
            Kemungkinan penyebab: ${error.message}
        </p>`;
    }
}

// Fungsi utama untuk memfilter, mengurutkan, dan menampilkan data
// Fungsi ini dipanggil setiap kali input search/sort diubah
function filterGallery() {
    // Gunakan salinan data untuk filtering
    let filteredData = [...photoData]; 
    const searchTerm = searchInput.value.toLowerCase().trim();
    const sortMethod = sortSelect.value;

    // 1. FILTER BERDASARKAN NAMA
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            // Mencari kecocokan di nama pelanggan
            item.nama_pelanggan.toLowerCase().includes(searchTerm)
        );
    }

    // 2. SORTIR BERDASARKAN TANGGAL
    if (sortMethod === 'terbaru') {
        // Urutkan menurun (Descending)
        filteredData.sort((a, b) => new Date(b.tanggal_acara) - new Date(a.tanggal_acara));
    } else if (sortMethod === 'terlama') {
        // Urutkan menaik (Ascending)
        filteredData.sort((a, b) => new Date(a.tanggal_acara) - new Date(b.tanggal_acara));
    }

    // 3. TAMPILKAN HASIL
    renderGallery(filteredData);
}

// Fungsi untuk menampilkan hasil ke dalam elemen HTML
function renderGallery(data) {
    galleryList.innerHTML = ''; // Kosongkan daftar sebelumnya

    if (data.length === 0) {
        galleryList.innerHTML = '<p class="no-results">Tidak ada hasil yang ditemukan. Coba kata kunci lain atau periksa data Anda.</p>';
        return;
    }

    data.forEach(item => {
        // Pastikan tanggal valid sebelum diformat
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

// Inisialisasi: Mulai memuat data saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', loadGalleryData);

// Fungsi filterGallery harus global agar dapat dipanggil dari event HTML (onkeyup/onchange)
window.filterGallery = filterGallery;
