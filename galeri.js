// galeri.js - Logika Galeri Pelanggan Widiya Photo

// Ambil elemen DOM utama dari index.html
const galleryList = document.getElementById('gallery-list');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
let photoData = [];

// Fungsi untuk memuat data JSON dari file statis (galeri-data.json)
async function loadGalleryData() {
    // Tampilkan pesan loading di UI
    galleryList.innerHTML = '<p class="no-results">Memuat data...</p>';
    
    try {
        // Coba ambil file JSON. Pastikan nama file ini SAMA PERSIS.
        const response = await fetch('galeri-data.json'); 
        
        if (!response.ok) {
            // Jika status 404 (Not Found) atau error HTTP lainnya
            throw new Error(`Gagal memuat data. Status: ${response.status} (${response.statusText}).`);
        }
        
        // Coba parsing (mengubah) teks JSON menjadi objek JavaScript
        photoData = await response.json();
        
        // Setelah data dimuat, tampilkan sesuai default sort (terbaru)
        filterGallery(); 

    } catch (error) {
        // Blok penanganan error (catch) akan menangkap masalah fetching atau parsing JSON
        console.error('CRITICAL ERROR:', error);
        galleryList.innerHTML = `<p class="no-results" style="color: red;">
            ❌ ERROR: Gagal memuat data galeri. <br>
            Cek konsol browser (F12) untuk detail error teknis. <br>
            Pesan Teknis: ${error.message}
        </p>`;
    }
}

// Fungsi utama untuk memfilter, mengurutkan, dan menampilkan data
function filterGallery() {
    // Gunakan salinan data untuk filtering agar data asli tetap utuh
    let filteredData = [...photoData]; 
    const searchTerm = searchInput.value.toLowerCase().trim();
    const sortMethod = sortSelect.value;

    // 1. FILTER BERDASARKAN NAMA
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
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
        galleryList.innerHTML = '<p class="no-results">Tidak ada hasil yang ditemukan untuk kata kunci tersebut.</p>';
        return;
    }

    data.forEach(item => {
        // Pastikan format tanggal valid
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
        // Masukkan item baru ke dalam daftar
        galleryList.insertAdjacentHTML('beforeend', itemHtml);
    });
}

// Inisialisasi: Mulai memuat data saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', loadGalleryData);

// Setel fungsi agar dapat dipanggil dari event HTML (onkeyup/onchange) di index.html
window.filterGallery = filterGallery;
