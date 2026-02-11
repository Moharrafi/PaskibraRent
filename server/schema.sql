
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  item_id VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 1,
  rental_days INT DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(50) PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  total_price DECIMAL(15, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Menunggu',
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  rental_duration INT NOT NULL,
  customer_name VARCHAR(255),
  customer_institution VARCHAR(255),
  customer_phone VARCHAR(50),
  customer_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS booking_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id VARCHAR(50) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  item_qty INT NOT NULL,
  item_price DECIMAL(15, 2) NOT NULL,
  item_category VARCHAR(50),
  item_image VARCHAR(512),
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS products;
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  rental_duration INT DEFAULT 3,
  stock INT DEFAULT 0,
  description LONGTEXT,
  image_urls LONGTEXT, -- JSON string or comma-separated
  material VARCHAR(255),
  tags LONGTEXT, -- JSON string or comma-separated
  package_contents TEXT, -- JSON string
  sizes TEXT, -- JSON string
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS gallery;
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  image_url VARCHAR(512) NOT NULL,
  date DATE,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data for Products (from constants.ts)
INSERT INTO products (name, category, price, rental_duration, stock, description, image_urls, material, tags, package_contents, sizes)
SELECT * FROM (SELECT 
'Seragam KOPASKA (Hijau)' as name, 'fullset' as category, 1600000 as price, 3 as rental_duration, 1 as stock, 
'Seragam kebanggaan KOPASKA dengan warna hijau khas yang melambangkan ketangguhan dan harmoni. Potongan presisi untuk penampilan terbaik.' as description, 
'["/images/WhatsApp Image 2026-02-05 at 21.17.00.jpeg"]' as image_urls, 
'Japan Drill Premium' as material, 
'["kopaska", "hijau", "fullset", "seragam"]' as tags,
'["Atribut Kople", "Evolet", "Boots", "Pet + Emblem"]' as package_contents,
'["S", "M", "L", "XL", "XXL"]' as sizes
) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM products WHERE name = 'Seragam KOPASKA (Hijau)'
) LIMIT 1;

INSERT INTO products (name, category, price, rental_duration, stock, description, image_urls, material, tags, package_contents, sizes)
SELECT * FROM (SELECT 
'Seragam SHERIF (Hitam Emas)', 'fullset', 1800000, 3, 1, 
'Seragam SHERIF dengan kombinasi warna hitam dan emas yang mewah. Dirancang untuk pasukan yang ingin tampil gagah dan berkelas.', 
'["/images/WhatsApp Image 2026-02-06 at 13.09.57.jpeg"]', 
'Drill Castillo High Quality', 
'["sherif", "hitam", "emas", "fullset", "seragam"]',
'["Atribut Kople", "Evolet", "Boots", "Pet + Emblem"]',
'["S", "M", "L", "XL", "XXL"]' 
) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM products WHERE name = 'Seragam SHERIF (Hitam Emas)'
) LIMIT 1;

INSERT INTO products (name, category, price, rental_duration, stock, description, image_urls, material, tags, package_contents, sizes)
SELECT * FROM (SELECT 
'Seragam ARJUNA (Abu)', 'fullset', 1900000, 3, 1, 
'Seragam ARJUNA berwarna abu elegan dengan ornamen emas mewah. Pilihan utama untuk variasi formasi yang memberikan kesan kuat dan disiplin.', 
'["/images/WhatsApp Image 2026-02-06 at 13.14.12.webp"]', 
'High Twist Premium & Songket', 
'["arjuna", "abu", "fullset"]',
'["Atribut Kople", "Evolet", "Boots", "Pet + Emblem"]',
'["S", "M", "L", "XL"]'
) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM products WHERE name = 'Seragam ARJUNA (Abu)'
) LIMIT 1;

INSERT INTO products (name, category, price, rental_duration, stock, description, image_urls, material, tags, package_contents, sizes)
SELECT * FROM (SELECT 
'Set Atribut Evolet & Pangkat', 'aksesoris', 45000, 3, 50, 
'Set evolet bahu dan tanda pangkat bordir emas kualitas premium. Menambah kewibawaan pasukan.', 
'["/images/WhatsApp Image 2026-02-05 at 21.17.00.jpeg"]', 
'Bordir Komputer Benang Emas', 
'["aksesoris", "pangkat", "emas"]',
'["Sepasang Evolet Bahu", "Sepasang Tanda Pangkat (Bisa Request Tingkatan)"]',
'["All Size"]'
) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM products WHERE name = 'Set Atribut Evolet & Pangkat'
) LIMIT 1;

INSERT INTO products (name, category, price, rental_duration, stock, description, image_urls, material, tags, package_contents, sizes)
SELECT * FROM (SELECT 
'Sepatu PDH Pantofel Hitam Mengkilap', 'sepatu', 75000, 3, 30, 
'Sepatu pantofel bahan kulit sintetis premium, nyaman dipakai baris-berbaris lama. Sol anti-slip dan tidak berisik.', 
'["/images/WhatsApp Image 2026-02-05 at 21.10.13.jpeg"]', 
'Kulit Sintetis Glossy (Kilap)', 
'["sepatu", "aksesoris", "hitam"]',
'["Sepasang Sepatu", "Box Penyimpanan"]',
'["37", "38", "39", "40", "41", "42", "43", "44"]'
) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM products WHERE name = 'Sepatu PDH Pantofel Hitam Mengkilap'
) LIMIT 1;

INSERT INTO products (name, category, price, rental_duration, stock, description, image_urls, material, tags, package_contents, sizes)
SELECT * FROM (SELECT 
'Peci Paskibra Garuda', 'aksesoris', 25000, 3, 100, 
'Peci hitam bahan beludru halus dengan pin Garuda emas yang kokoh. Standar nasional.', 
'["/images/WhatsApp Image 2026-02-05 at 21.10.14.jpeg"]', 
'Beludru Contessa Super', 
'["topi", "aksesoris", "kepala"]',
'["Peci", "Pin Garuda Logam"]',
'["No. 5", "No. 6", "No. 7", "No. 8", "No. 9"]'
) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM products WHERE name = 'Peci Paskibra Garuda'
) LIMIT 1;

INSERT INTO products (name, category, price, rental_duration, stock, description, image_urls, material, tags, package_contents, sizes)
SELECT * FROM (SELECT 
'Sarung Tangan Putih (1 Lusin)', 'aksesoris', 120000, 3, 200, 
'Sarung tangan katun putih tebal. Harga untuk 12 pasang. Wajib untuk upacara bendera agar tangan tidak licin.', 
'["/images/ee.jpeg"]', 
'Katun Spandek (Melar & Halus)', 
'["aksesoris", "tangan", "grosir"]',
'["12 Pasang Sarung Tangan"]',
'["All Size Dewasa"]'
) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM products WHERE name = 'Sarung Tangan Putih (1 Lusin)'
) LIMIT 1;

-- Seed Data for Gallery (from storageService.ts)
INSERT INTO gallery (title, image_url, date, location)
SELECT * FROM (SELECT 
'Pengibaran Bendera HUT RI', '/images/WhatsApp Image 2026-02-05 at 21.18.04.jpeg', '2024-08-17', 'Kantor Bupati Bogor'
) AS tmp WHERE NOT EXISTS (SELECT title FROM gallery WHERE title = 'Pengibaran Bendera HUT RI') LIMIT 1;

INSERT INTO gallery (title, image_url, date, location)
SELECT * FROM (SELECT 
'Lomba Ketangkasan Baris Berbaris', '/images/WhatsApp Image 2026-02-06 at 13.14.12.jpeg', '2024-05-02', 'GOR Padjajaran'
) AS tmp WHERE NOT EXISTS (SELECT title FROM gallery WHERE title = 'Lomba Ketangkasan Baris Berbaris') LIMIT 1;

INSERT INTO gallery (title, image_url, date, location)
SELECT * FROM (SELECT 
'Pasukan 8 Pengibar Pagi', '/images/WhatsApp Image 2026-02-05 at 21.19.08.jpeg', '2024-08-17', 'Lapangan Tegar Beriman'
) AS tmp WHERE NOT EXISTS (SELECT title FROM gallery WHERE title = 'Pasukan 8 Pengibar Pagi') LIMIT 1;

INSERT INTO gallery (title, image_url, date, location)
SELECT * FROM (SELECT 
'Format Barisan Variasi', '/images/ww.jpeg', '2024-11-10', 'Plaza Balaikota'
) AS tmp WHERE NOT EXISTS (SELECT title FROM gallery WHERE title = 'Format Barisan Variasi') LIMIT 1;

INSERT INTO gallery (title, image_url, date, location)
SELECT * FROM (SELECT 
'Persiapan Upacara Penurunan', '/images/tt.jpeg', '2024-08-17', 'Kantor Bupati Bogor'
) AS tmp WHERE NOT EXISTS (SELECT title FROM gallery WHERE title = 'Persiapan Upacara Penurunan') LIMIT 1;

INSERT INTO gallery (title, image_url, date, location)
SELECT * FROM (SELECT 
'Juara Umum LKBB 2024', '/images/qq.jpeg', '2024-12-20', 'Stadion Pakansari'
) AS tmp WHERE NOT EXISTS (SELECT title FROM gallery WHERE title = 'Juara Umum LKBB 2024') LIMIT 1;
