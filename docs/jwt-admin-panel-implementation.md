# JWT Authentication & Dynamic Admin Panel — Implementation Summary

**Project**: Adyom Foundation (MERN Stack)  
**Date**: June 10, 2026  
**Status**: ✅ Complete

---

## Overview

Implemented full JWT-based authentication with role-in-token, Cloudinary image upload support via Multer, and dynamic admin panel forms with multipart/form-data for Blog and Artwork management.

---

## Backend Changes

### 1. [`backend/src/controllers/authController.js`](backend/src/controllers/authController.js)

**Change**: Added `role` parameter to `generateToken()` and updated all call sites.

```js
// Before
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { ... });

// After
const generateToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { ... });
```

- [`register`](backend/src/controllers/authController.js:54) — passes `user.role`
- [`login`](backend/src/controllers/authController.js:100) — passes `user.role`
- [`changePassword`](backend/src/controllers/authController.js:160) — passes `user.role`

**Why**: The JWT must carry the user's role so the `authorize` middleware can verify it without a database hit.

---

### 2. [`backend/src/middleware/auth.js`](backend/src/middleware/auth.js)

**Change**: Added `verifyToken` and `verifyAdmin` convenience exports.

```js
// Line 80-81
const verifyToken = protect;                                          // alias
const verifyAdmin = (req, res, next) => authorize('admin')(req, res, next);
```

These are exported alongside the existing `protect`, `authorize`, `optionalAuth`.

---

### 3. [`backend/src/controllers/blogController.js`](backend/src/controllers/blogController.js)

**Changes**:

#### `createPost` (line 53)
Rewritten for **multipart/form-data** support:

- Parses `tags` from JSON string OR comma-separated string
- Handles `isPublished` / `featured` as boolean strings (`"true"` / `"false"`)
- Attaches `req.file.path` (Cloudinary URL) as `coverImage`
- Retains `author` and `authorName` from `req.user`

#### `updatePost` (line 87)
Same multipart-aware logic for partial updates:

- Only updates fields that are present in `req.body`
- Same tags/boolean parsing
- Supports `req.file` for coverImage replacement

#### 🐛 Bug Fixed — Duplicate `exports.updatePost`
The file had **two** `exports.updatePost` declarations (lines 87 and 117). In Node.js, the **last export wins**, so the simple version at line 117 was silently overriding the multipart-aware version. **Removed the duplicate at line 117**.

---

### 4. [`backend/src/controllers/artworkController.js`](backend/src/controllers/artworkController.js)

**Change**: Added `adminCreateArtwork` function (line 29).

```js
exports.adminCreateArtwork = async (req, res) => {
    // Builds images array from req.file.path
    // Auto-sets status: approved, isPublic: true, reviewedBy: req.user._id
};
```

Allows admins to upload artwork with an image file directly (vs. member submissions which use URL references).

---

### 5. [`backend/src/routes/blog.js`](backend/src/routes/blog.js)

**Change**: Added `upload.single('coverImage')` middleware to POST and PUT routes.

```js
router.post('/', protect, authorize('admin'), upload.single('coverImage'), createPost);
router.put('/:id', protect, authorize('admin'), upload.single('coverImage'), updatePost);
```

---

### 6. [`backend/src/routes/artworks.js`](backend/src/routes/artworks.js)

**Change**: Added admin-only upload route.

```js
router.post('/admin', protect, authorize('admin'), upload.single('image'), adminCreateArtwork);
```

Uses multer field name `'image'` (distinct from blog's `'coverImage'`).

---

## Frontend Changes

### 7. [`frontend/src/api/index.js`](frontend/src/api/index.js)

**Change**: Added three new API methods with `multipart/form-data` headers.

```js
// Blog API (lines 67-71)
blogAPI.createWithImage: (formData) => API.post('/blog', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
blogAPI.updateWithImage: (id, formData) => API.put(`/blog/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),

// Artwork API (line 90-91)
artworkAPI.adminCreate: (formData) => API.post('/artworks/admin', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
```

---

### 8. [`frontend/src/pages/admin/AdminBlog.jsx`](frontend/src/pages/admin/AdminBlog.jsx)

**Full rewrite** (451 lines) with the following features:

| Feature | Details |
|---------|---------|
| **Create Form** | Title, Category (dropdown matching backend enum: `art`, `culture`, `education`, `community`, `technology`, `wellness`, `folklore`), Excerpt, Content, Tags (comma-separated), isPublished toggle, Featured toggle |
| **Image Upload** | File input → `FileReader` → base64 preview thumbnail |
| **Submission** | Builds `FormData`, calls `blogAPI.createWithImage()` |
| **Validation** | Title + Content required; inline error messages |
| **Loading State** | `submitLoading` state disables button, shows spinner |
| **Tabular View** | Posts table with search, status filter, category filter, delete with confirm dialog |
| **Fallbacks** | Static fallback data if API fails |

---

### 9. [`frontend/src/pages/admin/AdminArtworks.jsx`](frontend/src/pages/admin/AdminArtworks.jsx)

**Enhanced** with admin upload form (696 lines):

| Feature | Details |
|---------|---------|
| **Upload Form** | Title, Category (folk-art, tribal-art, painting, sculpture, textile, pottery, mixed-media, other), Artist Name, Description |
| **Image Upload** | File input → `FileReader` → preview |
| **Submission** | Builds `FormData` with `status: 'approved'`, `isPublic: 'true'`; calls `artworkAPI.adminCreate()` |
| **Validation** | Title + Image required |
| **Preserved Features** | Review/moderation workflow (approve/reject/delete), stats cards, search/filter, rejection modal, detail modal |

---

## Auth Flow Verification ✅

All three frontend auth files were verified as **fully consistent** (no changes needed):

| File | Key Logic |
|------|-----------|
| [`AuthContext.jsx`](frontend/src/context/AuthContext.jsx:60-62) | `isAdmin = user?.role === 'admin'`, `isAuthenticated = !!user` |
| [`Login.jsx`](frontend/src/pages/Login.jsx:29) | Admins → `navigate('/admin')`, members → `navigate(from \|\| '/dashboard')` |
| [`ProtectedRoute.jsx`](frontend/src/components/layout/ProtectedRoute.jsx:20) | `roles && !roles.includes(user?.role)` → redirect to `/` |
| [`App.jsx`](frontend/src/App.jsx:72-89) | Admin routes: `roles={['admin']}`, Member routes: `roles={['member', 'admin']}` |

---

## File Change Summary

| # | File | Action |
|---|------|--------|
| 1 | `backend/src/controllers/authController.js` | ✏️ Modified — added `role` to JWT payload |
| 2 | `backend/src/middleware/auth.js` | ✏️ Modified — added `verifyToken`/`verifyAdmin` exports |
| 3 | `backend/src/controllers/blogController.js` | ✏️ Rewrote `createPost`, added `updatePost`, removed duplicate |
| 4 | `backend/src/controllers/artworkController.js` | ✏️ Added `adminCreateArtwork` |
| 5 | `backend/src/routes/blog.js` | ✏️ Added `upload.single('coverImage')` to POST/PUT |
| 6 | `backend/src/routes/artworks.js` | ✏️ Added `POST /admin` with `upload.single('image')` |
| 7 | `frontend/src/api/index.js` | ✏️ Added `createWithImage`, `updateWithImage`, `adminCreate` |
| 8 | `frontend/src/pages/admin/AdminBlog.jsx` | ✏️ Full rewrite — multipart form + image preview |
| 9 | `frontend/src/pages/admin/AdminArtworks.jsx` | ✏️ Enhanced — admin upload form |
| — | `frontend/src/context/AuthContext.jsx` | 👀 Verified — no changes needed |
| — | `frontend/src/pages/Login.jsx` | 👀 Verified — no changes needed |
| — | `frontend/src/components/layout/ProtectedRoute.jsx` | 👀 Verified — no changes needed |
| — | `frontend/src/App.jsx` | 👀 Verified — no changes needed |

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  POST /api/auth/login                                           │
│  Body: { email, password }                                      │
│  Response: { token, user: { id, name, email, role } }          │
│                                                                 │
│  Token stored as "adyom_token" in localStorage                  │
│  User  stored as "adyom_user" in localStorage                   │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  Admin uploads Blog (multipart/form-data)                       │
│                                                                 │
│  POST /api/blog                                                 │
│  Authorization: Bearer <jwt>                                    │
│  Body: FormData { title, content, excerpt, category,            │
│         tags, isPublished, featured, coverImage (file) }        │
│                                                                 │
│  1. auth middleware: verify JWT → attach req.user (with role)   │
│  2. authorize('admin'): check req.user.role === 'admin'         │
│  3. upload.single('coverImage'): multer → Cloudinary            │
│  4. blogController.createPost: parse FormData, create document  │
│  5. Response: { success: true, data: { ...post } }              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Environment Variables Required

```env
# Backend (backend/.env)
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
MONGODB_URI=mongodb://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## User Model Roles

The [User model](backend/src/models/User.js:24) uses enum `['guest', 'member', 'admin']` with default `'member'`. Both `AuthContext` and `ProtectedRoute` check for `'admin'` role, which is fully compatible.