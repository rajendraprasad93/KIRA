# Image Authenticity & Misuse Detection Pipeline

## Overview

The Image Authenticity & Misuse Detection Pipeline is a comprehensive validation system designed to ensure the integrity and authenticity of images submitted through GrievanceGenie. This system helps prevent fraud, detect AI-generated content, and identify duplicate or resubmitted images.

## Features

### 1. **AI-Generated Image Detection** 🤖
- Integrates with Sightengine API to detect AI-generated or synthetic images
- Configurable threshold (default: 80% probability)
- Graceful fallback when API is unavailable

### 2. **EXIF Metadata Analysis** 📍
- Extracts GPS coordinates from images
- Validates location against user's reported position
- Radius-based validation (default: 10km)
- Timestamp extraction for audit trail
- Camera/device information extraction

### 3. **Duplicate Detection** 🔍
- Perceptual hashing (pHash) for image fingerprinting
- Similarity-based duplicate detection using Hamming distance
- Tracks previously resolved complaints to prevent resubmission
- Configurable similarity threshold

### 4. **Decision Engine** ⚖️
- Multi-factor validation with weighted scoring
- Confidence score calculation (0-1 scale)
- Critical flags (auto-reject):
  - AI_GENERATED
  - RESUBMITTED_IMAGE
- Warning flags (log but may accept):
  - LOCATION_NOT_AVAILABLE
  - LOCATION_MISMATCH
  - IMAGE_ISSUE_MISMATCH

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   /api/validate-image                   │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────▼───────────┐
         │  STEP 1: File         │
         │  Validation           │
         │  (Format, Size)       │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │  STEP 2: Sightengine  │
         │  AI Detection         │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │  STEP 3: EXIF         │
         │  Metadata & GPS       │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │  STEP 4: Perceptual   │
         │  Hash & Duplicates    │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │  STEP 5: Issue-Image  │
         │  Consistency          │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │  STEP 6: Decision     │
         │  Engine               │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │  Response:            │
         │  Accepted/Rejected    │
         └───────────────────────┘
```

## Installation

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

New packages added:
- `Pillow` - Image processing
- `piexif` - EXIF metadata extraction
- `imagehash` - Perceptual hashing
- `python-magic-bin` - File type validation
- `geopy` - Geographic distance calculations

### 2. Configure Environment Variables

Update your `.env` file with the following:

```bash
# Sightengine API (Image Authenticity Detection)
SIGHTENGINE_API_USER=your-sightengine-user-id
SIGHTENGINE_API_SECRET=your-sightengine-api-secret

# Image Validation Settings
MAX_IMAGE_SIZE_MB=10
ALLOWED_IMAGE_FORMATS=jpg,jpeg,png,webp
AI_GENERATION_THRESHOLD=0.8
HASH_SIMILARITY_THRESHOLD=5
LOCATION_RADIUS_KM=10
```

### 3. Initialize Database Indexes

The system will automatically create necessary MongoDB indexes on startup. You can also manually initialize:

```python
from services.hash_service import create_indexes
await create_indexes()
```

## API Usage

### Endpoint: `POST /api/validate-image`

Validate an uploaded image for authenticity and misuse.

**Request:**

```bash
curl -X POST http://localhost:5000/api/validate-image \
  -F "image=@/path/to/image.jpg" \
  -F "issue_type=pothole" \
  -F "latitude=13.0827" \
  -F "longitude=80.2707"
```

**Parameters:**
- `image` (File, required): Image file (JPG, PNG, WEBP)
- `issue_type` (string, required): Type of issue ("pothole", "garbage", "streetlight", etc.)
- `latitude` (float, optional): User's latitude
- `longitude` (float, optional): User's longitude

**Response (Accepted):**

```json
{
  "status": "accepted",
  "reason_codes": [],
  "ai_generated_score": 0.12,
  "exif_status": {
    "has_gps": true,
    "location_valid": true,
    "timestamp": "2025-12-13T10:30:00",
    "distance_km": 0.5,
    "camera_make": "Apple",
    "camera_model": "iPhone 13 Pro"
  },
  "hash_match": {
    "is_duplicate": false,
    "similarity_score": 0.0,
    "original_issue_id": null
  },
  "confidence_score": 0.92,
  "message": "Image validation passed successfully."
}
```

**Response (Rejected):**

```json
{
  "status": "rejected",
  "reason_codes": ["AI_GENERATED"],
  "ai_generated_score": 0.95,
  "exif_status": {
    "has_gps": false,
    "location_valid": false,
    "timestamp": null,
    "distance_km": null,
    "camera_make": null,
    "camera_model": null
  },
  "hash_match": {
    "is_duplicate": false,
    "similarity_score": 0.0,
    "original_issue_id": null
  },
  "confidence_score": 0.05,
  "message": "This image appears to be AI-generated or synthetic. Please upload a genuine photograph of the issue."
}
```

## Service Modules

### 1. **sightengine_service.py**

Handles AI-generated image detection via Sightengine API.

```python
from services import sightengine_service

# Detect AI-generated images
result = sightengine_service.detect_ai_generated("/path/to/image.jpg")
# Returns: {"is_ai_generated": bool, "ai_probability": float, "error": str}

# Boolean check
is_fake = sightengine_service.is_ai_generated("/path/to/image.jpg", threshold=0.8)
```

### 2. **exif_service.py**

Extracts and validates EXIF metadata.

```python
from services import exif_service

# Extract GPS coordinates
coords = exif_service.extract_gps_coordinates("/path/to/image.jpg")
# Returns: (latitude, longitude) or None

# Extract timestamp
timestamp = exif_service.extract_timestamp("/path/to/image.jpg")
# Returns: datetime object or None

# Validate location
is_valid = exif_service.validate_location(
    image_coords=(13.0827, 80.2707),
    user_coords=(13.0830, 80.2710),
    max_radius_km=10
)
# Returns: bool

# Calculate distance
distance = exif_service.calculate_distance(
    coord1=(13.0827, 80.2707),
    coord2=(13.0830, 80.2710)
)
# Returns: float (km)
```

### 3. **hash_service.py**

Generates perceptual hashes and detects duplicates.

```python
from services import hash_service

# Generate perceptual hash
phash = hash_service.generate_phash("/path/to/image.jpg")
# Returns: hex string

# Find similar images
similar = await hash_service.find_similar_hashes(phash, threshold=5)
# Returns: List[dict] with similarity scores

# Store hash
await hash_service.store_hash(
    issue_id="GG-2025-12345",
    phash=phash,
    image_path="/uploads/image.jpg",
    status="pending"
)

# Update when resolved
await hash_service.update_hash_status("GG-2025-12345", "resolved")
```

### 4. **decision_engine.py**

Makes final validation decisions.

```python
from services import decision_engine

# Make decision
validation_results = {
    "ai_detection": {...},
    "exif_data": {...},
    "hash_match": {...},
    "issue_match": {...}
}

decision = decision_engine.make_decision(validation_results)
# Returns: dict with status, reason_codes, confidence_score, etc.

# Get user-friendly message
message = decision_engine.get_rejection_message(["AI_GENERATED", "LOCATION_MISMATCH"])
```

## Configuration

### Thresholds

Adjust validation behavior via environment variables:

- **AI_GENERATION_THRESHOLD** (default: 0.8): Probability above which images are flagged as AI-generated
- **HASH_SIMILARITY_THRESHOLD** (default: 5): Maximum Hamming distance for duplicate detection
- **LOCATION_RADIUS_KM** (default: 10): Maximum acceptable distance between image GPS and user location
- **MAX_IMAGE_SIZE_MB** (default: 10): Maximum file size
- **ALLOWED_IMAGE_FORMATS** (default: jpg,jpeg,png,webp): Comma-separated list of allowed formats

## Testing

### 1. Test with Sample Images

```bash
# Test with real photo
curl -X POST http://localhost:5000/api/validate-image \
  -F "image=@tests/sample_photo.jpg" \
  -F "issue_type=pothole" \
  -F "latitude=13.0827" \
  -F "longitude=80.2707"

# Test with AI-generated image
curl -X POST http://localhost:5000/api/validate-image \
  -F "image=@tests/ai_generated.png" \
  -F "issue_type=garbage"

# Test duplicate detection (upload same image twice)
curl -X POST http://localhost:5000/api/validate-image \
  -F "image=@tests/duplicate.jpg" \
  -F "issue_type=streetlight"
```

### 2. Monitor Logs

```bash
# View validation pipeline logs
tail -f backend.log
```

Look for log entries showing each step of the pipeline.

### 3. Check Database

```python
# View stored hashes
from motor.motor_asyncio import AsyncIOMotorClient
client = AsyncIOMotorClient('mongodb://localhost:27017')
db = client['grievance_genie']

# Get all stored hashes
hashes = await db.image_hashes.find().to_list(100)
print(hashes)
```

## Security Considerations

✅ **API Key Protection**: Sightengine credentials stored in `.env`, never exposed to frontend  
✅ **Input Validation**: File type, size, and format validation before processing  
✅ **Temporary File Cleanup**: Rejected images are automatically deleted  
✅ **Error Handling**: Graceful fallbacks when external APIs fail  
✅ **Audit Logging**: All validation decisions logged for review  
✅ **Rate Limiting**: Consider implementing rate limits on the endpoint (future enhancement)

## Troubleshooting

### Sightengine API Errors

**Error:** "API credentials not configured"
**Solution:** Add `SIGHTENGINE_API_USER` and `SIGHTENGINE_API_SECRET` to `.env`

**Error:** "API request failed: Connection timeout"
**Solution:** Check internet connection. System will fallback gracefully and log warning.

### EXIF Extraction Issues

**Warning:** "No EXIF data found"
**Cause:** Image may be screenshot or edited (EXIF stripped)
**Impact:** Location validation skipped, flagged with LOCATION_NOT_AVAILABLE

### MongoDB Errors

**Error:** "image_hashes collection not found"
**Solution:** Indexes are created automatically. Restart server or manually run:
```python
await hash_service.create_indexes()
```

## Future Enhancements

1. **Image Classification**: Integrate Gemini Vision API for automated issue-image matching
2. **NSFW Detection**: Add content moderation using Sightengine
3. **Tampering Detection**: Detect image manipulation/photoshopping
4. **Face Blur**: Automatically blur faces for privacy
5. **Metadata Stripping**: Remove sensitive EXIF data before storage
6. **Rate Limiting**: Add per-user rate limits to prevent abuse

## Support

For issues or questions:
- Check logs in `backend.log`
- Review validation response `reason_codes`
- Test with known-good images first
- Verify all environment variables are set

## License

Part of GrievanceGenie - Civic Issue Reporting System
