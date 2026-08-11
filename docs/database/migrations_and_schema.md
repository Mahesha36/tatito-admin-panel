# 🗄️ Database Schema & Migrations — Tatito Fashions Backend

## 1. Tables Overview

### **`users` Table**
- `id` (bigint, Primary Key)
- `name` (string)
- `email` (string, unique)
- `phone_number` (string, unique)
- `gender` (string, nullable — `Male`, `Female`, `Other`)
- `date_of_birth` (string, nullable — `DD/MM/YYYY`)
- `password` (hashed string)
- `created_at`, `updated_at` (timestamps)

### **`otps` Table**
- `id` (bigint, Primary Key)
- `phone_number` (string)
- `otp` (string)
- `expires_at` (timestamp — 5-minute validity window)
- `attempts` (integer, default `0`)
- `created_at`, `updated_at` (timestamps)

---

## 2. Key Migrations Executed

1. `0001_01_01_000000_create_users_table.php` -> Standard users table.
2. `2026_07_27_073147_add_phone_number_to_users_table.php` -> Unique `phone_number` column.
3. `2026_07_27_080225_create_otps_table.php` -> OTP records table.
4. `2026_07_30_180000_add_gender_and_dob_to_users_table.php` -> Added `gender` and `date_of_birth` columns.
