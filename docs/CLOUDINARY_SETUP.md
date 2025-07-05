# Cloudinary Setup Guide for SangeetX

## Step 1: Create Upload Preset

1. Log into your Cloudinary dashboard at [cloudinary.com](https://cloudinary.com)
2. Go to **Settings** → **Upload** 
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: `sangeetx_preset`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `sangeetx`
   - **Resource type**: `Auto`
   - **Format**: `Auto`
   - **Quality**: `Auto`
   - **Overwrite**: `True`
   - **Unique filename**: `True`

## Step 2: Enable Auto Upload

1. In the same upload preset settings:
   - **Auto tagging**: `sangeetx,music`
   - **Auto backup**: `True` (optional)
   - **Notification URL**: Leave blank for now

## Step 3: Configure Transformations (Optional)

For images (album covers):
- **Width**: 500
- **Height**: 500
- **Crop**: `fill`
- **Quality**: `auto`

For audio files:
- **Format**: `mp3`
- **Quality**: `auto`
- **Bitrate**: `128`

## Step 4: Test the Configuration

After creating the preset, test it by:
1. Starting your dev server: `npm run dev`
2. Going to `/admin/upload`
3. Uploading a test image and audio file
4. Check your Cloudinary media library

## Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="drbxfo8yh"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="sangeetx_preset"
CLOUDINARY_API_KEY="e-VX2uACGPKCyraf3zUPgBbFEDA"
CLOUDINARY_API_SECRET="diwanMalla"
```

## Troubleshooting

### Upload fails with "Invalid preset"
- Double-check the preset name matches exactly
- Ensure the preset is set to "Unsigned"
- Make sure the preset is active

### CORS errors
- Check that your upload preset allows uploads from your domain
- For development, ensure localhost is allowed

### Large file uploads fail
- Check your Cloudinary account limits
- Increase timeout settings if needed
- Consider chunked uploads for very large files

## Security Notes

- Never expose your API secret in client-side code
- Use signed uploads for production
- Consider implementing rate limiting
- Monitor your Cloudinary usage and costs

## Next Steps

1. Create the upload preset as described above
2. Test the upload functionality
3. Configure any additional transformations needed
4. Set up monitoring and alerts for usage limits
