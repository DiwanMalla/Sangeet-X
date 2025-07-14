# Song Edit Feature Setup

## Overview

The song edit feature allows administrators to modify song details including title, artist, album, genre, year, duration, cover image, and audio URL.

## Features

- ✅ Edit all song metadata
- ✅ Upload new cover images
- ✅ Change cover image via URL
- ✅ Remove existing cover images
- ✅ Form validation
- ✅ Loading states and error handling
- ✅ Responsive design matching current theme

## Requirements

### Environment Variables

Make sure you have these environment variables set in your `.env.local` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Cloudinary Upload Preset

1. Go to your Cloudinary dashboard
2. Navigate to Settings > Upload
3. Create an upload preset named "sangeetx"
4. Set it to "Unsigned" if you want to allow uploads without authentication
5. Configure any transformations you want (optional)

## How to Use

### For Admins:

1. Navigate to `/admin/songs`
2. Find the song you want to edit
3. Click the Edit (pencil) icon in the Actions column
4. The edit modal will open with current song data pre-filled
5. Make your changes:
   - **Cover Image**: Either upload a new file or enter an image URL
   - **Song Details**: Update title, artist, album, genre, year
   - **Technical Details**: Modify duration and audio URL
6. Click "Save Changes" to apply updates

### Image Upload Options:

- **File Upload**: Click "Upload Image" and select a file from your device
- **URL Input**: Enter a direct image URL in the text field
- **Remove Image**: Click the X button on the preview to remove the current image

## API Endpoints Used

### Upload Image

- **POST** `/api/upload/image`
- Accepts: `multipart/form-data` with `file` field
- Returns: `{ success: true, data: { url: string, public_id: string } }`

### Update Song

- **PUT** `/api/songs/[id]`
- Accepts: JSON with song data
- Returns: Updated song object

## Error Handling

- Image upload failures show specific error messages
- Network errors are caught and displayed to the user
- Form validation prevents submission with missing required fields
- Loading states prevent multiple submissions

## Security Notes

- File type validation (images only)
- File size limit (5MB max)
- Server-side upload handling
- Input sanitization on all form fields

## Troubleshooting

### "Failed to upload image" Error

1. Check Cloudinary environment variables
2. Verify upload preset exists and is configured correctly
3. Check file size (must be < 5MB)
4. Ensure file is a valid image format

### Song Update Fails

1. Check network connection
2. Verify all required fields are filled
3. Check browser console for detailed error messages
4. Ensure API endpoints are accessible

## Technical Implementation

### Frontend Features:

- React state management for form data
- File upload with preview
- Image URL input as fallback
- Real-time form validation
- Optimistic UI updates

### Backend Features:

- Secure file upload handling
- Cloudinary integration
- Database update operations
- Error handling and validation

## Future Enhancements

- Bulk edit functionality
- Image cropping/editing
- Audio file upload
- Drag & drop interface
- Progress indicators for uploads
