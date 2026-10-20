# Minzo MVP Backend API Documentation

Base URL prefixes:
- `GET /hello` → health check (`I am alive`)
- `/api/v1/auth`
- `/api/v1/business`
- `/api/v1/users`
- `/api/v1/admin`

---

## Response Pattern

Most successful responses follow:

```json
{
  "success": true,
  "message": "some success message",
  "data": {}
}
```

Validation errors (Joi middleware):

```json
{
  "error": {
    "message": ["...validation message(s)"]
  }
}
```

Not found fallback:

```json
{
  "error": {
    "status": 404,
    "message": "Not Found"
  }
}
```

---

## Auth Routes (`/api/v1/auth`)

### 1) `POST /sign-in`
**Validator:** `loginUserSchema`
- `identifier` (string, required)
- `password` (string, required)

**Functionality:** Logs user in.

**Protection:** Public

**Success Response (200):**
```json
{
  "success": true,
  "message": "user logged in successfully",
  "data": { "user": {} }
}
```

---

### 2) `POST /sign-up`
**Validator:** `registerUserSchema`
- `name` (string, required)
- `password` (string, required)
- `email` (valid email, required)
- `phone` (string, required)

**Functionality:** Registers a normal user.

**Protection:** Public

**Success Response (200):**
```json
{
  "success": true,
  "message": "user registered successfully",
  "data": { "user": {} }
}
```

---

### 3) `POST /sign-up-user-with-business`
**Validator:** `registerUserAndBusinessSchema`

**User fields**
- `name` (string, required)
- `password` (string, required)
- `email` (valid email, required)
- `phone` (string, required)

**Business fields**
- `businessName` (string, required)
- `businessEmail` (valid email, required)
- `businessPhone` (string, required)
- `address` (string, required)
- `county` (string, required)
- `city` (string, required)
- `type` (string, required)
- `registrationDocumentUrl` (valid URI, required)

**Optional business fields**
- `description` (string)
- `longitude` (number)
- `latitude` (number)
- `website` (valid URI)
- `openingHours` (any)
- `doctors` (array of strings)
- `headNurse` (string)
- `services` (array of strings)

**Functionality:** Creates a user and a business in one flow.

**Protection:** Public

**Success Response (200):**
```json
{
  "success": true,
  "message": "business and user registered successfully",
  "data": {}
}
```

---

## Business Routes (`/api/v1/business`)

### 1) `GET /all`
**Validator:** None
**Functionality:** Fetches businesses (supports query filters in service layer).
**Protection:** Public

**Success Response (200):**
```json
{
  "success": true,
  "message": "businesses fetched successfully",
  "data": { "user": {} }
}
```

---

### 2) `GET /one/:id`
**Validator:** None
**Functionality:** Fetches one business by ID.
**Protection:** Public

**Success Response (200):**
```json
{
  "success": true,
  "message": "business fetched successfully",
  "data": { "business": {} }
}
```

---

### 3) `GET /nearby`
**Validator:** None
**Functionality:** Fetches nearby businesses (query-based).
**Protection:** Public

**Success Response (200):**
```json
{
  "success": true,
  "message": "nearby businesses fetched successfully",
  "data": { "businesses": [] }
}
```

---

### 4) `GET /top-rated`
**Validator:** None
**Functionality:** Fetches top-rated businesses.
**Protection:** Public

**Success Response (200):**
```json
{
  "success": true,
  "message": "top rated businesses fetched successfully",
  "data": { "businesses": [] }
}
```

---

### 5) `GET /ratings/:id`
**Validator:** None
**Functionality:** Fetches all ratings for a business.
**Protection:** Public

**Success Response (200):**
```json
{
  "success": true,
  "message": "business ratings fetched successfully",
  "data": { "ratings": [] }
}
```

---

### 6) `PUT /claim`
**Validator:** `claimBusinessSchema` (from `validators/user`, details not visible in retrieved snippet)
**Functionality:** Claim a business profile.
**Protection:** **Protected (Normal User)** via `requireAuth`

**Success Response:** Handled by `claimBusinessController` (not fully shown in retrieved snippet).

---

## User Routes (`/api/v1/users`)

### 1) `GET /me`
**Validator:** None
**Functionality:** Returns currently authenticated user.
**Protection:** **Protected (Normal User)** via `requireAuth`

**Success Response (200):**
```json
{
  "success": true,
  "message": "current user retrieved successfully",
  "data": { "user": {} }
}
```

---

### 2) `POST /submit-rating`
**Validator:** `submitARatingSchema` (from `validators/user`, full Joi shape not shown in retrieved snippet)
**Functionality:** Submits a rating.
**Protection:** **Protected (Normal User)** via `requireAuth`

**Success Response:** Returned by `submitRatingController` (not fully shown in retrieved snippet).

---

## Admin Routes (`/api/v1/admin`)

> Admin route file was not fully included in retrieved snippets, but related validators/controllers show expected endpoints.

### Known Admin Validators

#### `registerAdminSchema`
- `name` (string, required)
- `password` (string, required)
- `email` (valid email, optional)
- `phone` (string, optional)

#### `loginAdminSchema`
- `identifier` (string, required)
- `password` (string, required)

#### `reviewRatingSchema`
- `businessId` (string, required)
- `userId` (string, required)
- `approvalStatus` (`approved` | `rejected`, required)
- `comment` (string, optional)

#### `reviewBusinessVerificationSchema`
- `businessId` (string, required)
- `approvalStatus` (`approved` | `rejected`, required)

### Known Admin Functionalities from Controllers
- Register admin
- Login admin
- Get an admin
- Get current admin
- Approve/reject rating
- Approve/reject business verification
- Get audit logs
- Bulk add businesses
- Get pending ratings
- Get pending businesses

**Likely Protection:** Admin-only routes are expected to be protected (admin auth middleware), but route-level middleware could not be fully confirmed from retrieved snippets.

---

## Protected Route Matrix

### Protected for Normal User
- `GET /api/v1/users/me`
- `POST /api/v1/users/submit-rating`
- `PUT /api/v1/business/claim`

### Protected for Admin
- Admin moderation and audit endpoints (exact route paths not fully confirmed in retrieved snippets)
- Likely includes rating approval, business approval, audit logs, pending lists, bulk add

### Public Routes
- All auth signup/signin endpoints
- Most business discovery endpoints (`/all`, `/one/:id`, `/nearby`, `/top-rated`, `/ratings/:id`)
- Health check `/hello`

---

## Validation Middleware Notes

Global validator utility merges:
- `req.body`
- `req.query`
- `req.paramas` (typo in code; likely intended `req.params`)

If validation fails, returns 400 with Joi detail messages.

---

## Suggested Next Step (to complete this doc to 100%)

To finalize **all** admin/user validator shapes and exact route paths, inspect:
- `src/routes/api/admin.js`
- `src/controllers/userControllers.js`
- `src/middleware/validators/user.js`

Then fill in:
- exact admin endpoint URLs
- full Joi fields for `claimBusinessSchema` and `submitARatingSchema`
- concrete response payload shapes from user/admin controllers/services