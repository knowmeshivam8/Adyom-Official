# Adyom Foundation - Implementation Plan

This document maps the requirements from `program_requirements.md` onto the existing backend. Each item is marked with its implementation status.

> **Legend**: ✅ Done | ⚠️ Partial | ❌ Not Done

---

## 1. Database Schema Updates

### 1.1 `Program` Model (`backend/src/models/Program.js`)

| Requirement | Status | Notes |
|---|---|---|
| `programType` enum field | ✅ Done | Added with all 7 program types |
| `duration` field | ✅ Done | Already existed, now used properly |
| `format` (online/offline/hybrid) | ✅ Done | Added with default `online` |
| `isSponsored` flag | ✅ Done | Boolean field added |
| `sponsorDetails` field | ✅ Done | String field added |
| `modules[].materialListUrl` | ✅ Done | Downloadable material list per module |
| `modules[].isActive` | ✅ Done | Admin toggle for locking/unlocking modules |
| `modules[].sessions[]` with types | ✅ Done | Supports `creation`, `application`, `live-recording` |

### 1.2 `User` Model (`backend/src/models/User.js`)

| Requirement | Status | Notes |
|---|---|---|
| `activeSessionToken` field | ✅ Done | Stores the JWT jti for single-session enforcement |
| `organization` field | ✅ Done | For corporate/school group tracking |
| `enrolledPrograms[].attendance[]` | ✅ Done | Pratibimb 41-day attendance tracking |

### 1.3 `Artwork` Model (`backend/src/models/Artwork.js`)

| Requirement | Status | Notes |
|---|---|---|
| `programModuleId` field | ✅ Done | References nested module within a program |
| `moduleName` field | ✅ Done | Denormalized for easy querying |
| `submissionType` enum | ✅ Done | Supports `artwork`, `activity`, `pratibimb-canvas` |

### 1.4 `Certificate` Model (`backend/src/models/Certificate.js`)

| Requirement | Status | Notes |
|---|---|---|
| `certificateType` enum | ✅ Done | Distinguishes `excellence` vs `completion` |

---

## 2. API & Controller Updates

### 2.1 Authentication & Security (`authController.js`)

| Requirement | Status | Notes |
|---|---|---|
| Generate `jti` on login and store as `activeSessionToken` | ✅ Done | Uses `crypto.randomBytes(32)` |
| Generate `jti` on register | ✅ Done | New users get a session token immediately |
| Invalidate old sessions on login | ✅ Done | Updates `activeSessionToken`, old JWT fails middleware check |
| Invalidate sessions on password change | ✅ Done | New `activeSessionToken` generated |
| Logout clears `activeSessionToken` | ✅ Done | Sets to `null` |
| Middleware enforces single-session | ✅ Done | Compares `decoded.jti` against `user.activeSessionToken` |
| Optional auth skips single-session check | ✅ Done | Non-critical endpoints don't enforce it |

### 2.2 Assignments & Gallery (`artworkController.js`)

| Requirement | Status | Notes |
|---|---|---|
| Accept `moduleName` and `submissionType` on submit | ✅ Done | Both `submitArtwork` and `adminCreateArtwork` updated |
| Accept `programModuleId` on submit | ✅ Done | Both endpoints handle it |
| On approval → set `isPublic: true` | ✅ Done | `approveArtwork` sets `isPublic: true` in the update |
| On approval → auto-check Excellence certs (3 & 6 modules) | ✅ Done | `checkAndIssueCertificates` helper runs on approve |
| On rejection → set `isPublic: false` | ✅ Done | `rejectArtwork` sets `isPublic: false` |

### 2.3 Certificate Controller (`certificateController.js`)

| Requirement | Status | Notes |
|---|---|---|
| Admin can issue certificates directly | ✅ Done | `POST /api/certificates` with `certificateType` |
| Completion certificate with eligibility check | ✅ Done | KalaPath offline requires 5 artworks; others at admin discretion |
| Prevent duplicate completion certificates | ✅ Done | Checks for existing cert before issuing |

### 2.4 Dashboard & Gamification (`dashboardController.js`)

| Requirement | Status | Notes |
|---|---|---|
| Mark daily attendance (Pratibimb) | ✅ Done | `POST /api/dashboard/attendance` |
| Prevent duplicate attendance per day | ✅ Done | Checks if already marked today |
| Get attendance stats | ✅ Done | `GET /api/dashboard/attendance/:programId` |
| Leaderboard — top attendees | ✅ Done | `GET /api/dashboard/leaderboard` (admin) |
| Leaderboard — top submitters | ✅ Done | `GET /api/dashboard/top-submitters` (admin) |
| User dashboard stats | ✅ Done | `GET /api/dashboard/stats` |
| Dashboard route registered in `server.js` | ✅ Done | `app.use('/api/dashboard', ...)` on line 56 |

---

## 3. Gaps Found — All 9 ✅ Implemented

The following items from `program_requirements.md` were previously missing and have now been fully implemented.

### ✅ 3.1 Pratibimb Completion Certificate (41-Day Auto-Issue)

**Implemented in** [`backend/src/controllers/certificateController.js`](backend/src/controllers/certificateController.js): The `issueCompletionCertificate` function now checks Pratibimb attendance — requires ≥ 41 days of attendance before auto-issuing a completion certificate. The check queries the User model's `enrolledPrograms[].attendance` array.

---

### ✅ 3.2 Chaitanya/Sparsh Completion Certificate (49-Week Check)

**Implemented in** [`backend/src/controllers/certificateController.js`](backend/src/controllers/certificateController.js): For Chaitanya and Sparsh program types, the certificate controller now verifies that the enrollment date is at least 49 weeks (343 days) in the past. If the program hasn't elapsed 49 weeks, the certificate is denied with a descriptive reason.

---

### ✅ 3.3 KalaPath Online Completion (Video Progress Tracking)

**Implemented across multiple files:**
- [`backend/src/models/User.js`](backend/src/models/User.js): Added `videoProgress[]` array to `enrolledPrograms` subdocument with fields: `videoId`, `moduleTitle`, `sessionIndex`, `watchedAt`, `completed`, `lastPosition`.
- [`backend/src/controllers/learningController.js`](backend/src/controllers/learningController.js): Added `markVideoProgress` (tracks video completion, updates progress percentage, supports resume) and `getVideoProgress` (returns progress for a program).
- [`backend/src/routes/learning.js`](backend/src/routes/learning.js): Added `POST /api/learning/video-progress` and `GET /api/learning/video-progress/:programId` routes.
- [`frontend/src/components/ui/SecureVideoPlayer.jsx`](frontend/src/components/ui/SecureVideoPlayer.jsx): Reusable protected video player component with progress tracking via API.
- [`frontend/src/api/index.js`](frontend/src/api/index.js): Added `markVideoProgress` and `getVideoProgress` API methods.

---

### ✅ 3.4 Community Meet — Detail Acceptance Without Registration

**Implemented across multiple files:**
- [`backend/src/models/CommunityAttendee.js`](backend/src/models/CommunityAttendee.js): New model for guest attendees with fields: `name`, `email`, `organization`, `meetId`, `meetTitle`, `program`, `guestId`, `joinedAt`, `leftAt`, `duration`, `notes`. Compound unique index on `{ email, meetId }`.
- [`backend/src/controllers/communityController.js`](backend/src/controllers/communityController.js): Added `meetJoin` (no-auth endpoint), `meetLeave` (marks leftAt), `getMeetAttendees` (admin), `getMeetAttendeeStats` (admin aggregate).
- [`backend/src/routes/community.js`](backend/src/routes/community.js): Added `POST /api/community/meet-join`, `POST /api/community/meet-leave`, `GET /api/community/meet-attendees/:meetId`, `GET /api/community/meet-stats`.

---

### ✅ 3.5 Sponsor Code / Free Enrollment Flow

**Implemented across multiple files:**
- [`backend/src/models/SponsorCode.js`](backend/src/models/SponsorCode.js): New model with fields: `code` (unique, uppercase), `program`, `organization`, `description`, `maxUses` (0=unlimited), `usedCount`, `expiresAt`, `isActive`, `createdBy`. Instance method `isValid()`.
- [`backend/src/controllers/sponsorController.js`](backend/src/controllers/sponsorController.js): `createSponsorCode`, `getAllSponsorCodes`, `toggleSponsorCode`, `deleteSponsorCode`, `validateSponsorCode` (public), `enrollProgram` (with sponsor code support — zeros out payment, sets organization).
- [`backend/src/routes/sponsors.js`](backend/src/routes/sponsors.js): Public routes (`POST /api/sponsors/validate`, `POST /api/sponsors/enroll`) and admin routes.
- [`backend/src/server.js`](backend/src/server.js): Registered `app.use('/api/sponsors', ...)` on line 57.

---

### ✅ 3.6 KalaVritti — Product Marketplace

**Implemented across multiple files:**
- [`backend/src/models/Product.js`](backend/src/models/Product.js): New model with fields: `title`, `slug` (auto-generated), `description`, `images[]`, `price`, `currency`, `compareAtPrice`, `seller`, `sellerName`, `category` (enum), `artForm`, `status` (available/sold/reserved/draft), `quantity`, `isPublished`, `featured`, `dimensions`, `weight`, `tags[]`, `program`. Pre-save hook for slug generation.
- [`backend/src/controllers/productController.js`](backend/src/controllers/productController.js): `getAllProducts`, `getProductBySlug`, `getAllProductsAdmin`, `createProduct`, `updateProduct`, `deleteProduct`, `markAsSold`, `getFeaturedProducts`.
- [`backend/src/routes/products.js`](backend/src/routes/products.js): Public (`GET /api/products/featured`, `GET /api/products/slug/:slug`, `GET /api/products/`) and admin routes.
- [`backend/src/server.js`](backend/src/server.js): Registered `app.use('/api/products', ...)` on line 58.

---

### ✅ 3.7 Frontend — Video Security (No Download / No Record)

**Implemented in** [`frontend/src/components/ui/SecureVideoPlayer.jsx`](frontend/src/components/ui/SecureVideoPlayer.jsx): A reusable, protected video player component with:
- `<video controlsList="nodownload noplaybackrate nofullscreen" disablePictureInPicture>` — prevents browser download
- `onContextMenu={(e) => e.preventDefault()}` — disables right-click save
- Progress tracking via backend API (`markVideoProgress` / `getVideoProgress`)
- Resume from last position support
- Custom controls (play/pause, mute, fullscreen, seek)
- Loading, error, and completed states

---

### ✅ 3.8 Frontend — Pratibimb Dashboard UI

**Implemented in** [`frontend/src/pages/dashboard/DashboardPratibimb.jsx`](frontend/src/pages/dashboard/DashboardPratibimb.jsx): A dedicated dashboard with:
- 41-day calendar grid with color-coded attendance status (green=attended, red=missed, gold=today)
- Month navigation with prev/next controls
- Daily attendance marking via `POST /api/dashboard/attendance` with duplicate prevention
- Canvas progress photo upload section
- Live session links sidebar
- Completion tracker with circular progress SVG (percentage-based)
- Streak counter (consecutive days)
- Stats cards (completed days, streak, progress %, days remaining)
- Sadhana tips sidebar

**Routing & Navigation:**
- [`frontend/src/App.jsx`](frontend/src/App.jsx): Added `DashboardPratibimb` import and `/dashboard/pratibimb` route.
- [`frontend/src/components/layout/DashboardLayout.jsx`](frontend/src/components/layout/DashboardLayout.jsx): Added "Pratibimb" nav item with Sparkles icon to member sidebar.
- [`frontend/src/api/index.js`](frontend/src/api/index.js): Added `dashboardAPI` with `markAttendance`, `getAttendance`, `getStats`, `getLeaderboard`, `getTopSubmitters`, `getMostInnovative` methods.

---

### ✅ 3.9 Most Innovative Award

**Implemented across multiple files:**
- [`backend/src/models/Artwork.js`](backend/src/models/Artwork.js): Added `isInnovative` (Boolean), `innovativeNominatedBy` (ref User), `innovativeNominatedAt` (Date) fields.
- [`backend/src/controllers/artworkController.js`](backend/src/controllers/artworkController.js): Added `toggleInnovative` function — admin toggles `isInnovative` flag on artworks.
- [`backend/src/routes/artworks.js`](backend/src/routes/artworks.js): Added `PUT /api/artworks/:id/innovative` admin route.
- [`backend/src/controllers/dashboardController.js`](backend/src/controllers/dashboardController.js): Added `getMostInnovative` — aggregation pipeline counting artworks with `isInnovative=true` per artist, with user lookup.
- [`backend/src/routes/dashboard.js`](backend/src/routes/dashboard.js): Added `GET /api/dashboard/most-innovative` admin route.

---

## 4. Summary

| Category | Total Items | ✅ Done | ❌ Not Done |
|---|---|---|---|
| Schema Updates | 12 | 12 | 0 |
| Auth & Security | 7 | 7 | 0 |
| Artwork & Gallery | 5 | 5 | 0 |
| Certificates | 3 | 3 | 0 |
| Dashboard & Gamification | 6 | 6 | 0 |
| **Gaps (New Work)** | **9** | **9** | **0** |

**All 9 implementation gaps have been resolved.** The full implementation plan is now complete, covering all backend models, controllers, routes, and frontend components required by `program_requirements.md`.

### Files Created/Modified Summary

| File | Action | Gap |
|---|---|---|
| `backend/src/models/CommunityAttendee.js` | Created | 3.4 |
| `backend/src/models/SponsorCode.js` | Created | 3.5 |
| `backend/src/models/Product.js` | Created | 3.6 |
| `backend/src/controllers/sponsorController.js` | Created | 3.5 |
| `backend/src/controllers/productController.js` | Created | 3.6 |
| `backend/src/routes/sponsors.js` | Created | 3.5 |
| `backend/src/routes/products.js` | Created | 3.6 |
| `frontend/src/components/ui/SecureVideoPlayer.jsx` | Created | 3.7 |
| `frontend/src/pages/dashboard/DashboardPratibimb.jsx` | Created | 3.8 |
| `backend/src/controllers/certificateController.js` | Modified | 3.1, 3.2 |
| `backend/src/models/User.js` | Modified | 3.3 |
| `backend/src/controllers/learningController.js` | Modified | 3.3 |
| `backend/src/routes/learning.js` | Modified | 3.3 |
| `backend/src/controllers/communityController.js` | Modified | 3.4 |
| `backend/src/routes/community.js` | Modified | 3.4 |
| `backend/src/models/Artwork.js` | Modified | 3.9 |
| `backend/src/controllers/artworkController.js` | Modified | 3.9 |
| `backend/src/routes/artworks.js` | Modified | 3.9 |
| `backend/src/controllers/dashboardController.js` | Modified | 3.9 |
| `backend/src/routes/dashboard.js` | Modified | 3.9 |
| `backend/src/server.js` | Modified | 3.5, 3.6 |
| `frontend/src/api/index.js` | Modified | 3.3, 3.8 |
| `frontend/src/App.jsx` | Modified | 3.8 |
| `frontend/src/components/layout/DashboardLayout.jsx` | Modified | 3.8 |
