// galeri.js

const galleryList = document.getElementById('gallery-list');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
let photoData = [];

// Fungsi untuk memuat data JSON
async function loadGalleryData() {
    try {
        const response = await fetch('galeri-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        photoData = await response.json();
        // Setelah data dimuat, jalankan filter/sortir
        filterGallery(); 
    } catch (error) {
        galleryList.innerHTML = '<p class="no-results" style="color: red;">ERROR: Gagal memuat data galeri. Cek file galeri-data.json.</p>';
        console.error('Error loading gallery data:', error);
    }
}

// Fungsi utama untuk memfilter dan menampilkan data
function filterGallery() {
    let filteredData = [...photoData]; // Salin data agar data asli tidak berubah
    const searchTerm = searchInput.value.toLowerCase();
    const sortMethod = sortSelect.value;

    // 1. FILTER BERDASARKAN NAMA
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            item.nama_pelanggan.toLowerCase().includes(searchTerm)
        );
    }

    // 2. SORTIR BERDASARKAN TANGGAL
    if (sortMethod === 'terbaru') {
        filteredData.sort((a, b) => new Date(b.tanggal_acara) - new Date(a.tanggal_acara));
    } else if (sortMethod === 'terlama') {
        filteredData.sort((a, b) => new Date(a.tanggal_acara) - new Date(b.tanggal_acara));
    }

    // 3. TAMPILKAN HASIL
    renderGallery(filteredData);
}

// Fungsi untuk menampilkan data ke HTML
function renderGallery(data) {
    galleryList.innerHTML = ''; // Kosongkan daftar sebelumnya

    if (data.length === 0) {
        galleryList.innerHTML = '<p class="no-results">Tidak ada hasil yang ditemukan. Coba kata kunci lain.</p>';
        return;
    }

    data.forEach(item => {
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

// Mulai memuat data saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', loadGalleryData);

// Setel fungsi filterGallery agar bisa diakses di HTML
window.filterGallery = filterGallery;
