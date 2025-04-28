# back-end

Folder ini berisi bagian back-end untuk sistem kelola data dan presensi karyawan.

Sebelum menggunakan, buat database yang berisi dua tabel dan satu view untuk menyimpan data. Kodenya terletak dalam `schema.sql`.

Setelah tabel-tabel dibuat di database, buat berkas `.env` berisi berikut:

```properties
# Server port
PORT=3000

# CORS
EMPLOYEE_DOMAIN=http://localhost:5173
ADMIN_DOMAIN=http://localhost:5173

# Database configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=

# JWT configuration
JWT_SECRET=
JWT_ISSUER=

# bcrypt configuration
BCRYPT_SALT_ROUNDS=10

# Sending/receiving token
TOKEN_VIA_COOKIE=true
```

Nilai `EMPLOYEE_DOMAIN` dan `ADMIN_DOMAIN` berisi alamat ke bagian _front-end_ presensi karyawan dan kelola karyawan.

Nilai `DB_*` berisi konfigurasi untuk menyambung ke server _database_.

Nilai `JWT_*` berisi konfigurasi pembuatan dan pemeriksaan JWT.

Nilai `TOKEN_VIA_COOKIE` menentukan pengiriman dan penggunaan token menggunakan kuki (`true`) atau _header_ (`false`).

Setelah berkas `.env` selesai diisi, jalankan dengan perintah berikut di dalam folder ini:

```bash
# Memasang dependensi (cukup dijalankan sekali)
npm install
# Memulai program (dijalankan setiap memulai program)
npm run dev
```
