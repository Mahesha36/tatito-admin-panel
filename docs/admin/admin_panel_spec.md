# 🛠️ Admin Panel & Database Master Specification — Tatito Fashions

> **Purpose**: This document serves as the authoritative blueprint for Admin Panel developers, Database Engineers, and API Developers. It specifies the exact Admin Panel UI forms, database schema, required input fields, and output API JSON structures for all app screens including Home Screen, Weddings, Customisation, Jewellery, Events, and Bookings.

---

## 📌 Table of Contents
1. [General System Standards](#1-general-system-standards)
2. [Module 0: Home Screen & Dynamic Feed Management](#module-0-home-screen--dynamic-feed-management)
3. [Module 1: Weddings Hub Management](#module-1-weddings-hub-management)
4. [Module 2: Customisation Atelier Management](#module-2-customisation-atelier-management)
5. [Module 3: High Jewellery Vault Management](#module-3-high-jewellery-vault-management)
6. [Module 4: Events & VIP Passbook Management](#module-4-events--vip-passbook-management)
7. [Module 5: Stylist & Consultation Bookings](#module-5-stylist--consultation-bookings)
8. [Hand-off Instructions for Admin Developers](#hand-off-instructions-for-admin-developers)

---

## 1. General System Standards

- **Status Field Convention**: Every table includes `is_active` (boolean, default `1`) to allow Admin to toggle visibility on Web/Mobile apps instantly.
- **Image/Media Uploads**: All image inputs store relative storage paths (`uploads/weddings/banner1.jpg`) and return full CDN/app URLs in APIs (`http://domain.com/storage/uploads/weddings/banner1.jpg`).
- **Video Add Links**: Supports direct `.mp4` URLs, HLS streams, or CDN video links (`video_url`) for dynamic video banners and runway reels.
- **Standard Soft Deletes**: Use Laravel Soft Deletes (`deleted_at`) to prevent accidental data loss.

---

## Module 0: Home Screen & Dynamic Feed Management

### 1. Admin Panel UI Screens Needed
- `Admin > Home > Collections`: Manage Main Collections categorized by Gender (**Men**, **Women**, **Kids**).
- `Admin > Home > Video Banners`: Add/Edit video reels and promo video clips (**Video Add Link**, Title, Subtitle, Overlay CTA text).
- `Admin > Home > Dynamic Layout Blocks ("Any Collection")`: Create customizable Home Feed widgets where Admin selects layout presentation type:
  - 🖼️ `banner`: Full-width hero image banner.
  - 🃏 `card_ui`: 2-column or horizontal scrolling cards UI.
  - 🎥 `video`: Auto-playing video card / runway clip.
  - 🔲 `category_grid`: Grid representation for Men/Women/Kids.

### 2. Database Tables & Fields

#### Table: `home_collections`
| Column Name | Data Type | Input Type / Validation | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key | Collection ID |
| `target_module` | Enum | Dropdown (`fashions`, `weddings`, `jewellery`) | Which section this collection belongs to |
| `gender` | Enum | Dropdown (`Men`, `Women`, `Kids`) | Gender categorization |
| `title` | String(100) | Text (Required) | e.g. "Groom Couture", "Royal Lehengas" |
| `subtitle` | String(150) | Text | Short tag line |
| `image_path` | String(255) | File Upload | Collection card background image |
| `video_url` | String(255) | URL Input (Nullable) | Video Add Link for animated collection card |
| `sort_order` | Integer | Number (Default 0) | Display order |
| `is_active` | Boolean | Toggle Switch | Active status |

#### Table: `home_dynamic_sections`
| Column Name | Data Type | Input Type / Validation | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key | Section ID |
| `section_title` | String(150) | Text (Required) | e.g. "Trending Haute Couture" |
| `section_subtitle`| String(200) | Text | Subtitle caption |
| `layout_type` | Enum | Dropdown (`banner`, `card_ui`, `video`, `category_grid`) | UI presentation style on Web/App |
| `media_type` | Enum | Dropdown (`image`, `video`) | Media type |
| `image_path` | String(255) | File Upload (Nullable) | Image banner |
| `video_url` | String(255) | URL Input (Nullable) | Video Add Link |
| `cta_label` | String(50) | Text | Button label (e.g. "Explore Collection") |
| `cta_target_route`| String(100)| Text | App/Web destination route |
| `sort_order` | Integer | Number (Default 0) | Display order |
| `is_active` | Boolean | Toggle Switch | Active status |

---

## Module 1: Weddings Hub Management

### 1. Admin Panel UI Screens Needed
- `Admin > Weddings > Collections`: Add/Edit Wedding Collections filtered by Gender (**Men**, **Women**, **Kids**).
- `Admin > Weddings > Banners`: Add/Edit Hero Banners & Video Add Links.
- `Admin > Weddings > Featured Couture`: Select/Assign Featured Bridal Products.

### 2. Database Tables & Fields

#### Table: `wedding_collections`
| Column Name | Data Type | Validation / Input Type | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key | Collection ID |
| `gender` | Enum | Dropdown (`Men`, `Women`, `Kids`) | Gender target |
| `title` | String(100) | Text (Required) | e.g. "Royal Bridal Lehengas", "Groom Couture" |
| `subtitle` | String(150) | Text | e.g. "Handcrafted zari & velvet couture" |
| `count_badge` | String(50) | Text | e.g. "120+ Outfits" |
| `image_path` | String(255) | File Upload | Collection card background image |
| `video_url` | String(255) | URL Input (Nullable) | Video Add Link for runway trailer |
| `sort_order` | Integer | Number (Default 0) | Display ordering |
| `is_active` | Boolean | Toggle Switch | Active status |

---

## Module 2: Customisation Atelier Management

### 1. Admin Panel UI Screens Needed
- `Admin > Customisation > Studios`: Manage Bespoke Atelier Departments (*Men's Atelier*, *Women's Couture*, *High Jewellery Crafting*).
- `Admin > Customisation > Options & Swatches`: Manage Brands (*Sabyasachi*, *Raymond*), Fabrics (*Italian Silk*, *Zardozi Velvet*), and Color Swatches (Name + Hex Code `#801B1B`).
- `Admin > Customisation > Bespoke Orders`: View & Process incoming customer tailor-fit measurement forms.

### 2. Database Tables & Fields

#### Table: `customisation_studios`
| Column Name | Data Type | Input Type | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key | Studio ID (`men`, `women`, `jewellery`) |
| `category_name` | String(100) | Text | e.g. "Men's Couture Atelier" |
| `subtitle` | String(150) | Text | Department description |
| `icon_name` | String(50) | Text | e.g. `man-outline` |
| `badge_text` | String(50) | Text | e.g. "MASTER TAILORED" |

#### Table: `customisation_options`
| Column Name | Data Type | Input Type | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key | Option ID |
| `type` | Enum | Dropdown (`brand`, `fabric`, `color_swatch`) | Type of option |
| `name` | String(100) | Text | Brand/Fabric/Color Name |
| `hex_code` | String(10) | Color Picker (Nullable) | Required for `color_swatch` |

#### Table: `customisation_requests` (Incoming Customer Orders)
| Column Name | Data Type | Input Type | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key | Custom Order ID |
| `user_id` | BigInt (FK) | Read-only | Linked User ID |
| `item_name` | String(150) | Read-only | Selected Silhouette/Item |
| `brand` | String(100) | Read-only | Selected Brand |
| `fabric` | String(100) | Read-only | Selected Fabric |
| `color` | String(50) | Read-only | Selected Color Swatch |
| `measurements` | JSON | View JSON / Structured | Bust, Waist, Shoulder, Sleeve, Neck, Inseam |
| `special_notes` | Text | Textarea | Custom embroidery instructions |
| `appointment_date` | Date | Date Display | Master fitting date |
| `status` | Enum | Dropdown (`Pending`, `Tailoring in Progress`, `Ready for Fitting`, `Completed`) | Admin updates status |

---

## Module 3: High Jewellery Vault Management

### 1. Admin Panel UI Screens Needed
- `Admin > Jewellery > Collections`: Add/Edit Jewellery Collections filtered by Gender (**Men**, **Women**).
- `Admin > Jewellery > Categories`: Add/Edit Jewellery Categories (*Polki & Kundan*, *Solitaires*, *22K Gold*, *Bridal Sets*).
- `Admin > Jewellery > Products`: Add/Edit High Jewellery Items (Name, Gender Target, Category, Price, Original Price, Purity Tag, Images, Ratings).

### 2. Database Tables & Fields

#### Table: `jewellery_products`
| Column Name | Data Type | Input Type | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key | Product ID |
| `gender` | Enum | Dropdown (`Men`, `Women`, `Unisex`) | Gender target (e.g. Gold Chains for Men, Polki Chokers for Women) |
| `category_id` | BigInt (FK) | Dropdown (Categories) | Linked Category |
| `name` | String(150) | Text | e.g. "Royal Heritage Polki Choker" |
| `price` | Decimal(10,2) | Currency Input | Selling price (e.g. `485000.00`) |
| `original_price` | Decimal(10,2) | Currency Input (Nullable) | Original price (e.g. `550000.00`) |
| `purity_tag` | String(100) | Text | e.g. "22K BIS Gold · Uncut Diamonds" |
| `badge_tag` | String(50) | Text | e.g. "ROYAL HERITAGE", "IGI CERTIFIED" |
| `rating` | Decimal(2,1) | Number (Default 5.0) | Rating score |
| `image_path` | String(255) | File Upload | Product main image |

---

## Module 4: Events & VIP Passbook Management

### 1. Admin Panel UI Screens Needed
- `Admin > Events > Calendar`: Create/Edit Fashion Runway Shows, Trunk Exhibitions, & Jewellery Galas with Video Trailers.
- `Admin > Events > RSVPs`: View and approve User Ticket Reservations.

### 2. Database Tables & Fields

#### Table: `events`
| Column Name | Data Type | Input Type | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key | Event ID |
| `title` | String(150) | Text (Required) | e.g. "The Royal Couture Week 2026" |
| `category` | String(50) | Dropdown (`Runway Premiere`, `Trunk Show`, `Jewellery Gala`, `Atelier Salon`) | Event category |
| `event_date` | Date | Date Picker | Date of event |
| `event_time` | String(50) | Text | e.g. "07:00 PM IST" |
| `location` | String(150) | Text | e.g. "Taj Palace, New Delhi" |
| `host` | String(100) | Text | e.g. "Sabyasachi x Tatito Atelier" |
| `pass_type` | String(50) | Text | e.g. "FRONT ROW RUNWAY" |
| `ticket_prefix` | String(20) | Text | e.g. "TT-VIP-9941" |
| `price` | String(50) | Text | e.g. "Complimentary VIP Pass" |
| `available_seats`| Integer | Number | Total available seats |
| `image_path` | String(255) | File Upload | Event cover photo |
| `video_url` | String(255) | URL Input (Nullable) | Video Add Link for runway trailer |

---

## Module 5: Stylist & Consultation Bookings

#### Table: `stylist_bookings`
| Column Name | Data Type | Input Type | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key | Booking ID |
| `user_id` | BigInt (FK) | Read-only | Linked User ID |
| `service_type` | String(100) | Read-only | e.g. "Bridal Consultation", "Groom Styling" |
| `notes` | Text | Read-only | User notes |
| `booking_date` | DateTime | Date/Time | Requested date/time |
| `status` | Enum | Dropdown (`Pending`, `Confirmed`, `Completed`, `Cancelled`) | Admin status update |

---

## Hand-off Instructions for Admin Developers

1. **Database Setup**: Run migrations as specified in the schema tables above.
2. **Form Layouts**: Build Filament / Custom Laravel Admin CRUD forms using the specified input types (Text, Dropdown, Image File Upload, Video Add Link, Date Pickers).
3. **Dynamic Presentation**: Respect `layout_type` (`banner`, `card_ui`, `video`, `category_grid`) and `gender` filters (`Men`, `Women`, `Kids`) so Web and Mobile apps dynamically render the custom layouts created by Admin.
4. **API Integration**: Backend controllers serve these rows as clean REST APIs for Web and Mobile apps.
