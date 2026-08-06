# 📡 Auth Endpoints — Tatito Fashions Backend

## 1. Standard Response Envelope

All API endpoints return JSON conforming to the standardized envelope structure:

```json
{
  "success": boolean,
  "code": integer,
  "message": string,
  "data": object | null,
  "errors": object | null
}
```

---

## 2. API Endpoint Specifications

### **1. Send OTP (`POST /api/v1/auth/send-otp`)**
- **Inputs**: `{ "phoneNumber": "9876543210" }`
- **Output (`200 OK`)**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "OTP sent successfully",
    "data": { "otp": 654321 }
  }
  ```

---

### **2. Verify OTP (`POST /api/v1/auth/verify-otp`)**
- **Inputs**: `{ "phoneNumber": "9876543210", "otp": "654321" }`
- **Output (`200 OK - Existing User`)**:
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
- **Output (`200 OK - New User`)**:
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

---

### **3. User Registration (`POST /api/v1/auth/register`)**
- **Inputs**: `{ "name": "...", "email": "...", "phoneNumber": "...", "gender": "...", "dateOfBirth": "..." }`
- **Output (`201 Created`)**: Returns `success: true`, `code: 201`, OAuth token, and complete `user` object.

---

### **4. User Login (`POST /api/v1/auth/login`)**
- **Inputs**: `{ "phoneNumber": "...", "otp": "..." }`
- **Output (`200 OK`)**: Returns token and user profile object.
- **Output (`404 Not Found`)**: `{ "success": false, "code": 404, "message": "User not found. Please register first." }`
