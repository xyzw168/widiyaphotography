// galeri.js - Logika Galeri Pelanggan Widiya Photo

const galleryList = document.getElementById('gallery-list');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
let photoData = [];

// Tambahkan status untuk mengontrol tampilan awal
let isDataLoaded = false; 

// Fungsi untuk memuat data JSON dari file statis
async function loadGalleryData() {
    // Tampilkan pesan loading saat memulai
    galleryList.innerHTML = '<p class="no-results">Memuat data...</p>';
    
    try {
        const response = await fetch('galeri-data.json'); 
        
        if (!response.ok) {
            // Jika status 404 atau error HTTP lainnya
            throw new Error(`Gagal memuat data. Status: ${response.status} (${response.statusText}).`);
        }
        
        photoData = await response.json();
        isDataLoaded = true; // Data berhasil dimuat

        // Panggil filterGallery untuk menampilkan pesan sambutan default
        filterGallery(); 

    } catch (error) {
        // Blok penanganan error akan tampil hanya jika pengambilan data gagal
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
    // Tampilkan pesan sambutan jika data sudah dimuat tapi kolom pencarian kosong
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (isDataLoaded && searchTerm.length < 2) { // Tambahkan batas pencarian minimal 2 karakter
        galleryList.innerHTML = '<p class="no-results">Silakan ketik minimal 2 huruf pertama nama Anda di kolom pencarian di atas.</p>';
        return; // Hentikan fungsi agar tidak menampilkan semua data atau error
    }

    // Hanya lanjutkan filtering jika ada term pencarian
    let filteredData = [...photoData]; 
    const sortMethod = sortSelect.value;
    
    // Lanjutkan FILTER BERDASARKAN NAMA
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            item.nama_pelanggan.toLowerCase().includes(searchTerm)
        );
    }

    // Lanjutkan SORTIR BERDASARKAN TANGGAL
    if (sortMethod === 'terbaru') {
        filteredData.sort((a, b) => new Date(b.tanggal_acara) - new Date(a.tanggal_acara));
    } else if (sortMethod === 'terlama') {
        filteredData.sort((a, b) => new Date(a.tanggal_acara) - new Date(b.tanggal_acara));
    }

    // TAMPILKAN HASIL
    renderGallery(filteredData);
}

// Fungsi untuk menampilkan hasil ke dalam elemen HTML
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
