# COBWEB BOOTH

Photo booth web bertema "pahlawan laba-laba" — **desain karakter orisinal**, bukan Spider-Man/karakter Marvel.
Alur meniru BeautyPlus Photo Booth: pilih filter → jepret 4 foto berurutan → tempel stiker → unduh strip foto.

## Karakter orisinal

| Nama | Peran | Catatan |
|---|---|---|
| **Nightweb** | Hero utama | Lensa oval tunggal asimetris, palet crimson & emas |
| **Glitchback** | Musuh | Motif glitch/retak digital, palet ungu & sian |
| **Lantern-Fly** | Sahabat | Kacamata bulat kembar + lentera bercahaya, palet teal & emas |

Ditambah 3 stiker FX (efek suara "ZIP!", lambang generik, hiasan jaring). Semua digambar ulang sebagai SVG murni —
tidak ada aset yang meniru desain kostum, logo, atau tipografi milik Marvel/Sony. Jika ingin memakainya secara
komersial, tetap disarankan untuk terus menjauh dari kemiripan visual dengan IP Spider-Man asli.

## Fitur

- **4 jepretan otomatis** dengan hitung mundur — durasi bisa dipilih **3 / 5 / 10 detik** di layar setup
- **Jam live** tampil di layar kamera, dan setiap foto otomatis diberi **stempel tanggal & jam** saat dijepret
- **Ambil ulang per foto** — tombol "⟲ Ambil ulang" di tiap foto membuka kamera lagi hanya untuk foto itu, tanpa mengulang sesi
- **Efek suara** — bunyi hitung mundur, bunyi rana (shutter), dan **musik latar chiptune** selama sesi berlangsung; semua disintesis langsung di browser (tidak ada file audio eksternal) dan bisa dimatikan lewat tombol 🔊/🔇 di pojok kanan atas
- **Dua pilihan layout** hasil akhir: **strip memanjang** (4×1, gaya Life4Cuts) atau **grid 2×2**
- **Caption teks kustom** per foto, ditulis di kolom kontrol dan otomatis tercetak di bawah tiap foto pada hasil unduhan
- Stiker karakter orisinal (gaya pixel/anime) yang bisa digeser, diputar, dan diubah ukuran

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka URL yang muncul di terminal (default `http://localhost:5173`). Izinkan akses kamera saat diminta browser.

> Kamera (`getUserMedia`) hanya berjalan di **localhost** atau domain **HTTPS**. Saat deploy, pastikan hosting
> menyediakan HTTPS (Vercel/Netlify otomatis menyediakan ini).

## Build untuk produksi

```bash
npm run build
npm run preview   # opsional, untuk cek hasil build
```

Hasil build ada di folder `dist/` — tinggal upload ke hosting statis (Vercel, Netlify, Cloudflare Pages, dst).

## Struktur proyek

```
src/
  App.jsx                  # alur tahap: setup → capture → edit
  index.css                # sistem desain komik (warna, tipografi, panel)
  components/
    Viewfinder.jsx          # kamera + hitung mundur + 4 jepretan
    StickerBelt.jsx         # sabuk stiker (pilih gaya pixel/anime)
    StripPreview.jsx        # editor: tempel/geser/putar/resize stiker, pilih warna bingkai, unduh
    ComicToggle.jsx         # saklar "web-shooter" pixel/anime
    FilterRail.jsx          # pilihan filter kamera
  stickers/
    stickerData.js          # semua SVG karakter (pixel + anime) — di sinilah menambah karakter baru
  utils/
    compositor.js            # capture frame + render strip final ke canvas
```

## Menambah stiker/karakter baru

Tambahkan entri baru di `src/stickers/stickerData.js` mengikuti pola yang ada:

```js
{ id: 'namamu', name: 'Nama Tampil', category: 'Hero', pixel: svgPixelString, anime: svgAnimeString }
```

Gunakan viewBox `0 0 100 100` agar proporsi konsisten dengan stiker lain.

## Ide pengembangan lanjutan

- Simpan riwayat strip ke local storage / akun pengguna
- Tambah mode video boomerang selain foto diam
- Tambah lebih banyak varian frame (pola jaring, halftone dots) sebagai border-image
- Tambah efek suara shutter & musik latar saat sesi berjalan
