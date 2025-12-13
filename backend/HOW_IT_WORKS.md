# Image Validation - How It Works

## What Happens When You Upload a Photo

When you upload a photo to GrievanceGenie, it goes through a **6-step validation pipeline** to ensure authenticity:

### ✅ Step 1: Basic Validation
- Checks file format (jpg, jpeg, png, webp)
- Checks file size (max 10MB)
- Rejects invalid files immediately

### 🤖 Step 2: AI-Generated Detection
- Sends image to Sightengine API (if configured)
- Detects if image is AI-generated/synthetic
- **Rejects** if AI probability > 80%
- **Gracefully skips** if API not configured

### 📍 Step 3: EXIF & GPS Validation  
- Extracts GPS coordinates from photo
- Compares with your reported location
- Checks distance (default: must be within 10km)
- **Warns** if GPS missing or mismatched
- Extracts camera info and timestamp

### 🔍 Step 4: Duplicate Detection
- Generates perceptual hash (pHash)
- Compares with previously resolved issues
- **Rejects** if duplicate found
- Stores hash for future comparisons

### 🎯 Step 5: Issue-Type Matching
- Verifies photo matches issue type
- Currently uses placeholder (always passes)
- Future: Will use Gemini Vision API

### ⚖️ Step 6: Final Decision
- Calculates confidence score (0-100%)
- **Accepts** if no critical flags
- **Rejects** if AI-generated or duplicate
- **Warns** for missing GPS or location mismatch

## Response Format

```json
{
  "photos": ["http://localhost:5000/uploads/GG-2025-12345_abc123.jpg"],
  "validation_results": [
    {
      "filename": "photo.jpg",
      "status": "accepted",
      "url": "http://localhost:5000/uploads/...",
      "confidence_score": 0.92,
      "warnings": []
    }
  ],
  "summary": {
    "total": 1,
    "accepted": 1,
    "rejected": 0
  }
}
```

## Why Photos Get Rejected

### 🚫 Critical Rejections (Auto-reject):
1. **AI_GENERATED** - Image appears to be AI-generated (> 80% probability)
2. **RESUBMITTED_IMAGE** - Duplicate of already resolved issue

### ⚠️ Warnings (Logged but accepted):
1. **LOCATION_NOT_AVAILABLE** - No GPS data in photo
2. **LOCATION_MISMATCH** - GPS location doesn't match reported location
3. **IMAGE_ISSUE_MISMATCH** - Photo doesn't match issue type (future)

## Configuration

Edit `.env` file:

```bash
# Sightengine API (Optional - for AI detection)
SIGHTENGINE_API_USER=your-user-id
SIGHTENGINE_API_SECRET=your-api-secret

# Thresholds
AI_GENERATION_THRESHOLD=0.8      # 80% probability
HASH_SIMILARITY_THRESHOLD=5      # Hamming distance
LOCATION_RADIUS_KM=10            # GPS tolerance

# Limits
MAX_IMAGE_SIZE_MB=10
ALLOWED_IMAGE_FORMATS=jpg,jpeg,png,webp
```

## Without Sightengine API

If Sightengine credentials are **NOT configured**:
- ✅ System still works!
- ✅ EXIF validation runs
- ✅ Duplicate detection runs
- ⚠️ AI detection is skipped (logs warning)
- ✅ Photos are accepted unless duplicates

## How to Test

### Test Real Photo:
```bash
# Upload via frontend or use curl
curl -X POST http://localhost:5000/api/issues/GG-2025-12345/photos \
  -F "photos=@real_photo.jpg"
```

### Expected Result:
```json
{
  "status": "accepted",
  "confidence_score": 0.85,
  "warnings": ["LOCATION_NOT_AVAILABLE"]  // If no GPS
}
```

### Test AI-Generated Photo:
- Upload an image from DALL-E, Midjourney, etc.
- Should be **rejected** if Sightengine is configured

### Test Duplicate:
- Upload same photo twice for different issues
- Second upload should be **rejected** if first issue is resolved

## Logs to Check

Look for these log messages:

```
INFO: Validating photo: photo.jpg for issue GG-2025-12345
INFO: Step 2: AI-generated image detection
WARNING: Sightengine API credentials not configured. Skipping AI detection.
INFO: Step 3: EXIF metadata extraction
INFO: Step 4: Perceptual hash generation and duplicate check
INFO: Step 6: Running decision engine
INFO: Decision: ACCEPTED | Confidence: 92% | Flags: LOCATION_NOT_AVAILABLE
INFO: Photo accepted: photo.jpg - Confidence: 92%
```

## Troubleshooting

**Q: All photos are being rejected!**
- Check if Sightengine API is configured correctly
- Check server logs for specific rejection reasons
- Verify `.env` file has correct format

**Q: AI detection always reports 0%**
- Sightengine API not configured (this is OK!)
- System will still validate using other methods

**Q: Photos with GPS are flagged as LOCATION_MISMATCH**
- Check `LOCATION_RADIUS_KM` setting
- Verify coordinates in issue are correct
- Default is 10km tolerance

**Q: Duplicate detection not working**
- Hashes only stored for **resolved** issues
- Check if previous issue was marked as resolved
- Check MongoDB `image_hashes` collection

## Next Steps

1. **Optional**: Get Sightengine API credentials from sightengine.com
2. **Optional**: Add to `.env` file for AI detection
3. Test with real photos from your camera/phone
4. Test with screenshots (will have LOCATION_NOT_AVAILABLE warning)
5. Mark an issue as resolved and try uploading same photo again (should reject)

## Summary

The system provides **multi-layered validation** to ensure photo authenticity while being **flexible** enough to work even without external APIs. Real photos from cameras/phones will pass validation, while AI-generated or duplicate photos will be rejected.
