# SangeetX TODO - User Features Implementation

## High Priority Items

### 1. User Authentication & Registration System

**Status:** Not Started  
**Priority:** Critical  
**Estimated Time:** 2-3 days

#### Tasks:

- [ ] **User Registration/Login UI**

  - Create registration form component
  - Create login form component
  - Add form validation (email, password strength, etc.)
  - Implement responsive design for auth pages

- [ ] **Backend Authentication**

  - Set up authentication middleware (NextAuth.js recommended)
  - Configure session management
  - Add password hashing (bcrypt)
  - Create user registration API endpoint
  - Create user login API endpoint
  - Add JWT token handling

- [ ] **Database User Management**

  - User model already exists in schema
  - Add user seed data for testing
  - Create user profile management endpoints

- [ ] **Authentication State Management**
  - Create auth context/provider
  - Add protected route middleware
  - Update navbar to show user info when logged in
  - Add logout functionality

#### Files to Create/Modify:

- `src/app/auth/login/page.tsx`
- `src/app/auth/register/page.tsx`
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/login/route.ts`
- `src/contexts/auth-context.tsx`
- `src/middleware.ts` (for protected routes)
- `src/components/auth/login-form.tsx`
- `src/components/auth/register-form.tsx`

---

### 2. Playlist & Favorites System (Post-Authentication)

**Status:** Partially Implemented (APIs created, frontend needs auth integration)  
**Priority:** High  
**Estimated Time:** 1-2 days  
**Dependencies:** User Authentication must be completed first

#### Current Issues to Fix:

- [ ] **Foreign Key Constraint Error**
  - The mock user ID `"mock-user-id"` doesn't exist in the users table
  - Replace all mock user IDs with actual authenticated user IDs
  - Add proper error handling for non-existent users

#### Tasks to Complete:

- [ ] **Update Song Page Integration**

  - Replace `mockUserId` with actual authenticated user ID from context
  - Add proper error handling for playlist/favorites operations
  - Show loading states during API calls
  - Add success/error toast notifications
  - Handle unauthenticated users gracefully

- [ ] **Playlist Management Features**

  - Create playlist detail page (`/playlist/[id]`)
  - Add playlist editing functionality
  - Implement drag-and-drop song reordering
  - Add playlist cover image upload
  - Create "My Playlists" page

- [ ] **Favorites Management**

  - Create "Liked Songs" page
  - Add bulk operations (remove multiple songs)
  - Show liked status across the app (song cards, lists)

- [ ] **Enhanced UI Components**
  - Add click outside handler for dropdown menus
  - Improve responsive design for mobile
  - Add keyboard navigation support
  - Implement virtualization for large playlists

#### Files to Modify:

- `src/app/song/[id]/page.tsx` (replace mockUserId)
- `src/app/api/favorites/route.ts` (add better error handling)
- `src/app/api/playlists/route.ts` (add user validation)
- `src/app/api/playlists/[id]/route.ts` (add ownership checks)
- `src/app/api/playlists/[id]/songs/route.ts` (add ownership checks)

#### New Files to Create:

- `src/app/playlist/[id]/page.tsx`
- `src/app/playlists/page.tsx` (My Playlists)
- `src/app/favorites/page.tsx` (Liked Songs)
- `src/components/playlist/playlist-card.tsx`
- `src/components/playlist/playlist-editor.tsx`
- `src/components/common/toast-notification.tsx`

---

### 3. Enhanced Karaoke Subtitle System

**Status:** Completed ✅  
**Priority:** Medium

#### Completed Features:

- ✅ Scrollable subtitles when sync is off
- ✅ Modern UI design with gradient backgrounds
- ✅ Auto-centering current subtitle when synced
- ✅ Responsive controls and status indicators
- ✅ Smooth animations and transitions

---

## Medium Priority Items

### 4. User Profile Management

**Status:** Not Started  
**Priority:** Medium  
**Estimated Time:** 1 day

#### Tasks:

- [ ] Create user profile page
- [ ] Add profile picture upload
- [ ] Implement profile editing
- [ ] Add user statistics (total playlists, liked songs, etc.)
- [ ] Create public profile view for sharing

### 5. Social Features

**Status:** Not Started  
**Priority:** Medium  
**Estimated Time:** 2-3 days

#### Tasks:

- [ ] Add playlist sharing functionality
- [ ] Implement public/private playlist settings
- [ ] Create collaborative playlists
- [ ] Add user following system
- [ ] Show activity feed

### 6. Search & Discovery

**Status:** Basic implementation exists  
**Priority:** Medium  
**Estimated Time:** 1-2 days

#### Tasks:

- [ ] Add search filters (genre, year, artist)
- [ ] Implement search history
- [ ] Add trending songs/artists
- [ ] Create recommendation system
- [ ] Add recently played section

---

## Low Priority Items

### 7. Admin Enhancements

**Status:** Partially Implemented  
**Priority:** Low

#### Tasks:

- [ ] Add user management in admin panel
- [ ] Implement content moderation tools
- [ ] Add analytics dashboard
- [ ] Create automated content processing

### 8. Performance Optimizations

**Status:** Not Started  
**Priority:** Low

#### Tasks:

- [ ] Implement virtualization for large lists
- [ ] Add caching strategies
- [ ] Optimize image loading
- [ ] Add service worker for offline functionality

---

## Technical Debt & Code Quality

### 1. Error Handling

- [ ] Implement global error boundary
- [ ] Add comprehensive error logging
- [ ] Create user-friendly error messages
- [ ] Add retry mechanisms for API calls

### 2. Testing

- [ ] Add unit tests for components
- [ ] Implement integration tests for APIs
- [ ] Add end-to-end tests for user flows
- [ ] Set up continuous testing pipeline

### 3. Documentation

- [ ] Update API documentation
- [ ] Add component documentation
- [ ] Create deployment guide
- [ ] Write user manual

---

## Database Schema Updates Needed

### Post-Authentication Implementation:

1. **Add missing indexes:**

   ```sql
   CREATE INDEX idx_favorites_user_id ON favorites(user_id);
   CREATE INDEX idx_playlists_user_id ON playlists(user_id);
   CREATE INDEX idx_play_history_user_id ON play_history(user_id);
   ```

2. **Add constraints for data integrity:**
   ```sql
   ALTER TABLE favorites ADD CONSTRAINT unique_user_song UNIQUE(user_id, song_id);
   ALTER TABLE playlist_songs ADD CONSTRAINT unique_playlist_song UNIQUE(playlist_id, song_id);
   ```

---

## Environment Variables Needed

```env
# Authentication
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/sangeetx

# File Upload (for profile pictures, playlist covers)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (for registration confirmation)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

---

## Immediate Next Steps

1. **Start with User Authentication**

   - This is the foundation for all user-specific features
   - Choose authentication strategy (NextAuth.js recommended)
   - Create basic login/register flow

2. **Update Playlist/Favorites System**

   - Fix the foreign key constraint error
   - Replace mock user IDs with real authentication
   - Add proper error handling

3. **Test Core User Flow**

   - Register → Login → Like Songs → Create Playlists → Add Songs to Playlists
   - Ensure all APIs work with real user data

4. **Polish UI/UX**
   - Add loading states
   - Implement toast notifications
   - Improve responsive design
   - Add keyboard navigation

---

## Notes

- The playlist and favorites APIs are already implemented but need authentication integration
- The karaoke subtitle system is complete and working well
- The main blocker is the missing user authentication system
- Once authentication is in place, the existing APIs should work with minimal changes
- Consider using NextAuth.js for quick authentication setup
- Database schema is well-designed and supports all planned features

## Current Error Details

**Playlist Creation Error:**

```
Foreign key constraint violated on the constraint: `playlists_userId_fkey`
```

**Root Cause:**
The mock user ID `"mock-user-id"` doesn't exist in the users table, causing the foreign key constraint to fail.

**Solution:**
Implement user authentication and replace all instances of `mockUserId` with actual authenticated user IDs from the session/context.
