// galeri.js - Logika untuk Galeri Pelanggan

const galleryList = document.getElementById('gallery-list');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
let photoData = [];

// Fungsi untuk memuat data JSON dari file statis
async function loadGalleryData() {
    try {
        const response = await fetch('galeri-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        photoData = await response.json();
        // Setelah data dimuat, tampilkan sesuai default sort
        filterGallery(); 
    } catch (error) {
        galleryList.innerHTML = '<p class="no-results" style="color: red;">ERROR: Gagal memuat data galeri. Pastikan file galeri-data.json ada.</p>';
        console.error('Error loading gallery data:', error);
    }
}

// Fungsi utama untuk memfilter, mengurutkan, dan menampilkan data
function filterGallery() {
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
    // Menggunakan fungsi Date untuk membandingkan tanggal acara
    if (sortMethod === 'terbaru') {
        filteredData.sort((a, b) => new Date(b.tanggal_acara) - new Date(a.tanggal_acara));
    } else if (sortMethod === 'terlama') {
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
        // Format tanggal agar lebih mudah dibaca
        const dateObj = new Date(item.tanggal_acara);
        const formattedDate = dateObj.toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

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
