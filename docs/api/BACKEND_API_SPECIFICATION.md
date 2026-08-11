# 📡 Tatito Fashions — Complete Backend API Specification

> **Target Audience**: Backend Developers, API Engineers, Frontend (React/Next.js) & Mobile (React Native) Developers.  
> **Base URL**: `/api/v1`  
> **Headers**: `Content-Type: application/json`, `Authorization: Bearer <token>`  
> **Compatibility**: 100% Dual-Compatible (Web Client + Mobile App).

---

## 📋 Table of Contents
1. [Global API Response Envelope](#1-global-api-response-envelope)
2. [Module 1: Authentication & User Profile](#module-1-authentication--user-profile)
3. [Module 2: Home Screen & Dynamic Feeds](#module-2-home-screen--dynamic-feeds)
4. [Module 3: Weddings Hub](#module-3-weddings-hub)
5. [Module 4: Customisation Atelier](#module-4-customisation-atelier)
6. [Module 5: High Jewellery Vault](#module-5-high-jewellery-vault)
7. [Module 6: Events & VIP Passbook](#module-6-events--vip-passbook)
8. [Module 7: Products & Categories](#module-7-products--categories)
9. [Module 8: Cart, Wishlist, Orders & Addresses](#module-8-cart-wishlist-orders--addresses)

---

## 1. Global API Response Envelope

Every single API endpoint returns JSON matching this standardized structure:

### **Success Response (`200 OK` / `201 Created`)**
```json
{
  "success": true,
  "code": 200,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### **Error Response (`400 Bad Request` / `422 Unprocessable` / `404 Not Found`)**
```json
{
  "success": false,
  "code": 422,
  "message": "Validation Error",
  "errors": {
    "phoneNumber": ["The phone number field is required."]
  }
}
```

---

## Module 1: Authentication & User Profile

### **1.1 Send OTP**
- **Method & Route**: `POST /api/v1/auth/send-otp`
- **Request Body**:
  ```json
  {
    "phoneNumber": "9876543210"
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "OTP sent successfully",
    "data": {
      "otp": "654321"
    }
  }
  ```

### **1.2 Verify OTP**
- **Method & Route**: `POST /api/v1/auth/verify-otp`
- **Request Body**:
  ```json
  {
    "phoneNumber": "9876543210",
    "otp": "654321"
  }
  ```
- **Response (`200 OK - Existing User`)**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "OTP Verified Successfully",
    "data": {
      "is_new_user": false,
      "token": "eyJ0eXAi...",
      "refreshToken": null,
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@gmail.com",
        "phone_number": "9876543210",
        "gender": "Male",
        "date_of_birth": "15/08/1998"
      }
    }
  }
  ```
- **Response (`200 OK - New User`)**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "OTP Verified. Please complete registration.",
    "data": {
      "is_new_user": true,
      "token": null,
      "refreshToken": null
    }
  }
  ```

### **1.3 Register User**
- **Method & Route**: `POST /api/v1/auth/register`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@gmail.com",
    "phoneNumber": "9876543210",
    "gender": "Male",
    "dateOfBirth": "15/08/1998"
  }
  ```
- **Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "code": 201,
    "message": "User Registered Successfully",
    "data": {
      "is_new_user": false,
      "token": "eyJ0eXAi...",
      "refreshToken": null,
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@gmail.com",
        "phone_number": "9876543210",
        "gender": "Male",
        "date_of_birth": "15/08/1998"
      }
    }
  }
  ```

### **1.4 Login User**
- **Method & Route**: `POST /api/v1/auth/login`
- **Request Body**: `{ "phoneNumber": "9876543210", "otp": "654321" }`
- **Response (`200 OK`)**: Returns token and user object.

---

## Module 2: Home Screen & Dynamic Feeds

### **2.1 Fetch Home Feed**
- **Method & Route**: `GET /api/v1/home/feed`
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Home feed fetched successfully",
    "data": {
      "hero_banners": [
        {
          "id": 1,
          "title": "Summer Royal Collection",
          "subtitle": "Bespoke Couture 2026",
          "image_path": "http://domain.com/storage/uploads/banners/hero1.jpg",
          "video_url": "http://domain.com/storage/uploads/videos/hero_trailer.mp4",
          "cta_text": "Shop Collection"
        }
      ],
      "gender_collections": {
        "men": [ ... ],
        "women": [ ... ],
        "kids": [ ... ]
      },
      "dynamic_sections": [
        {
          "id": 101,
          "title": "Trending Runway Clips",
          "layout_type": "video",
          "video_url": "http://domain.com/storage/uploads/videos/runway.mp4"
        },
        {
          "id": 102,
          "title": "Featured Designers",
          "layout_type": "card_ui",
          "items": [ ... ]
        }
      ]
    }
  }
  ```

### **2.2 Fetch Home Collections by Gender**
- **Method & Route**: `GET /api/v1/home/collections?gender=Men`
- **Query Params**: `gender` (`Men`, `Women`, `Kids`)
- **Response (`200 OK`)**: Returns list of collections for specified gender.

---

## Module 3: Weddings Hub

### **3.1 Fetch Weddings Hub**
- **Method & Route**: `GET /api/v1/weddings/hub`
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Weddings hub data fetched successfully",
    "data": {
      "banner": {
        "tagline": "ROYAL WEDDING EDITION",
        "title": "The Grand Bridal Couture",
        "subtitle": "Explore bespoke wedding ensembles handcrafted for your unforgettable moments.",
        "image_path": "http://domain.com/storage/uploads/weddings/hero.jpg",
        "video_url": "http://domain.com/storage/uploads/weddings/bridal_runway.mp4"
      },
      "collections": {
        "women": [
          { "id": "w1", "title": "Royal Bridal Lehengas", "count": "120+ Outfits", "image": "..." }
        ],
        "men": [
          { "id": "w2", "title": "Groom Couture & Sherwanis", "count": "85+ Outfits", "image": "..." }
        ],
        "kids": [
          { "id": "w3", "title": "Junior Royal Festive Wear", "count": "45+ Outfits", "image": "..." }
        ]
      },
      "featured_products": [ ... ]
    }
  }
  ```

### **3.2 Book Wedding Stylist Consultation**
- **Method & Route**: `POST /api/v1/bookings/consultation`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "serviceType": "Bridal Consultation",
    "bookingDate": "2026-08-15 14:00:00",
    "notes": "Custom Zardozi fitting for bridal lehenga"
  }
  ```
- **Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "code": 201,
    "message": "Consultation appointment booked successfully"
  }
  ```

---

## Module 4: Customisation Atelier

### **4.1 Fetch Bespoke Studios & Departments**
- **Method & Route**: `GET /api/v1/customisation/studios`
- **Response (`200 OK`)**: Returns Men's Atelier, Women's Couture, and High Jewellery Crafting items and badges.

### **4.2 Fetch Customisation Options & Swatches**
- **Method & Route**: `GET /api/v1/customisation/options`
- **Response (`200 OK`)**: Returns Brands list, Fabric options list, and Color Swatches (`name`, `hex_code`).

### **4.3 Submit Custom Tailoring Order**
- **Method & Route**: `POST /api/v1/customisation/requests`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "itemName": "Hand-Embroidered Velvet Sherwani",
    "brand": "Tatito Atelier (Signature)",
    "fabric": "Pure Italian Silk",
    "color": "Royal Crimson Red",
    "measurements": {
      "chest": "40",
      "waist": "34",
      "shoulder": "18",
      "sleeve": "25",
      "neck": "16",
      "inseam": "32"
    },
    "specialNotes": "Heavy gold zardozi on cuffs and collar",
    "appointmentDate": "2026-08-20"
  }
  ```
- **Response (`201 Created`)**: Returns Order ID, timestamp, and status `"Tailoring in Progress"`.

### **4.4 Fetch User Active Bespoke Orders**
- **Method & Route**: `GET /api/v1/customisation/orders`
- **Response (`200 OK`)**: Returns list of customer's custom tailoring orders and live tailoring status.

---

## Module 5: High Jewellery Vault

### **5.1 Fetch High Jewellery Vault Hub**
- **Method & Route**: `GET /api/v1/jewellery/hub`
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Jewellery hub fetched successfully",
    "data": {
      "vault_banner": {
        "title": "High Jewellery Atelier",
        "subtitle": "Bespoke Nizam Polki, Certified Solitaires & 22K BIS Hallmarked Gold Ornaments.",
        "image_path": "..."
      },
      "categories": [
        { "id": "cat_all", "name": "All Jewels" },
        { "id": "cat_polki", "name": "Polki & Kundan" },
        { "id": "cat_solitaire", "name": "Solitaires" },
        { "id": "cat_gold", "name": "22K Gold" },
        { "id": "cat_bridal", "name": "Bridal Sets" }
      ],
      "products": [ ... ]
    }
  }
  ```

### **5.2 Fetch Jewellery Products by Filter**
- **Method & Route**: `GET /api/v1/jewellery/products?gender=Women&category=cat_polki`
- **Query Params**: `gender` (`Men`, `Women`), `category` (`cat_polki`, etc.)
- **Response (`200 OK`)**: Returns filtered list of high jewellery items.

---

## Module 6: Events & VIP Passbook

### **6.1 Fetch Events Calendar**
- **Method & Route**: `GET /api/v1/events`
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Events list fetched successfully",
    "data": [
      {
        "id": "e1",
        "title": "The Royal Couture Week 2026",
        "category": "Runway Premiere",
        "day": "15",
        "month": "AUG",
        "time": "07:00 PM IST",
        "location": "Taj Palace, New Delhi",
        "host": "Sabyasachi x Tatito Atelier",
        "type": "FRONT ROW RUNWAY",
        "ticketNo": "TT-VIP-9941",
        "price": "Complimentary VIP Pass",
        "image": "...",
        "video_url": "..."
      }
    ]
  }
  ```

### **6.2 RSVP / Reserve VIP Ticket**
- **Method & Route**: `POST /api/v1/events/rsvp`
- **Request Body**: `{ "eventId": "e1" }`
- **Response (`200 OK`)**: Returns confirmed ticket pass details.

### **6.3 Fetch User Confirmed VIP Passes**
- **Method & Route**: `GET /api/v1/events/my-passes`
- **Response (`200 OK`)**: Returns user's confirmed VIP passes list.

---

## Module 7: Products & Categories

### **7.1 List Products**
- **Method & Route**: `GET /api/v1/products?category_id=1&gender=Women`
- **Response (`200 OK`)**: Returns paginated products list.

### **7.2 Product Detail**
- **Method & Route**: `GET /api/v1/products/{id}`
- **Response (`200 OK`)**: Returns product details, images, available sizes, colors, and ratings.

---

## Module 8: Cart, Wishlist, Orders & Addresses

### **8.1 Cart Management**
- `GET /api/v1/cart`: Fetch current cart items & price totals.
- `POST /api/v1/cart/add`: Add product variant to cart.
- `PUT /api/v1/cart/items/{itemId}`: Update item quantity.
- `DELETE /api/v1/cart/items/{itemId}`: Remove item from cart.

### **8.2 Wishlist Management**
- `GET /api/v1/wishlist`: Fetch saved wishlist products.
- `POST /api/v1/wishlist/toggle`: Add or remove product from wishlist.

### **8.3 Orders & Checkout**
- `GET /api/v1/user/orders`: Fetch user order history.
- `POST /api/v1/orders/checkout`: Place new order.

### **8.4 Address Management**
- `GET /api/v1/user/addresses`: Fetch user saved delivery addresses.
- `POST /api/v1/user/addresses`: Save new delivery address.
