# Seed Data Image Fix for Android Emulator

## Problem
Images from `images.unsplash.com` were not loading in Android emulator due to network connectivity issues.

## Solution
Replaced all Unsplash URLs with `via.placeholder.com` URLs that are more reliable in Android emulators.

## Changes Made

### 1. Added Helper Function
```javascript
const getPlaceholderImage = (brand, name, index) => {
  const colors = ['3b82f6', '10b981', 'f59e0b', 'ef4444', '8b5cf6', 'ec4899'];
  const color = colors[index % colors.length];
  return `https://via.placeholder.com/500x500/${color}/ffffff?text=${encodeURIComponent(brand + ' ' + name)}`;
};
```

### 2. Updated All 30 Shoes
- All Unsplash URLs replaced with placeholder.com URLs
- Each shoe now has a unique colored placeholder with brand and name text
- Images are properly indexed (0-29) for unique colors

## Next Steps

### 1. Reseed the Database
Run the seed script to update all images:

```bash
cd backend
node seedData.js
```

This will:
- Clear existing shoes from database
- Insert 30 new shoes with placeholder images
- Display confirmation of inserted shoes

### 2. Verify Images Load
After reseeding:
- Check Android emulator - images should now display
- Check physical device - images should still work
- Images will show colored placeholders with brand/name text

## Image Format
Each placeholder image:
- Size: 500x500 pixels
- Background: Rotating colors (blue, green, orange, red, purple, pink)
- Text: Brand + Shoe Name in white
- Format: PNG via placeholder.com

## Alternative Solutions

If placeholder.com also doesn't work in your emulator:

### Option 1: Use Base64 Placeholder Images
Convert small placeholder images to base64 and embed directly.

### Option 2: Host Images Locally
Store images in `frontend/assets/` and reference them directly.

### Option 3: Use Your Own Image URLs
Replace placeholder URLs with your own hosted images.

## Testing

After reseeding, verify:
1. ✅ All 30 shoes have images
2. ✅ Images display in Android emulator
3. ✅ Images display on physical device
4. ✅ No console errors about image loading

## Notes

- Placeholder images are temporary - replace with actual product images in production
- SafeImage component handles errors gracefully with fallback images
- All images are now using HTTPS URLs which work better in emulators

