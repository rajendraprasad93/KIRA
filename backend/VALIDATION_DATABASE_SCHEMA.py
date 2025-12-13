"""
MongoDB Schema for Image Validation Storage

Collection: image_validations

This collection stores complete validation records for all uploaded images.
"""

# Document Structure:
{
    "_id": ObjectId("..."),
    
    # Basic Info
    "validation_id": "VAL-20251213-ABC123",  # Unique validation ID
    "created_at": ISODate("2025-12-13T18:20:00Z"),
    
    # Image Info
    "image": {
        "filename": "photo.jpg",
        "path": "/uploads/issues/GG-2025-001/photo_abc123.jpg",
        "url": "http://localhost:5000/uploads/...",
        "size_bytes": 245632,
        "format": "jpeg",
        "dimensions": {
            "width": 1920,
            "height": 1080
        }
    },
    
    # Validation Results
    "validation": {
        "status": "accepted",  # accepted | rejected
        "confidence_score": 0.85,
        "reason_codes": ["LOCATION_NOT_AVAILABLE"],
        "message": "Image validation passed successfully..."
    },
    
    # AI Detection
    "ai_detection": {
        "ai_probability": 0.01,
        "is_ai_generated": False,
        "threshold": 0.8,
        "service": "sightengine",
        "skipped": False,
        "error": null
    },
    
    # EXIF Metadata
    "exif": {
        "has_data": True,
        "camera": {
            "make": "Nothing",
            "model": "A059"
        },
        "timestamp": ISODate("2025-12-13T16:42:17Z"),
        "gps": {
            "has_gps": True,
            "coordinates": {
                "latitude": 26.81113888888889,
                "longitude": 75.8907638888889
            },
            "address": {
                "formatted": "Sanganer Tehsil, Rajasthan, India - 302025",
                "city": "Jaipur",
                "state": "Rajasthan",
                "country": "India",
                "postcode": "302025"
            },
            "location_valid": False,
            "distance_km": None,
            "user_location": {
                "latitude": None,
                "longitude": None
            }
        }
    },
    
    # Hash Data
    "hash": {
        "perceptual_hash": "99996666cc993366",
        "algorithm": "pHash",
        "is_duplicate": False,
        "similarity_score": 0,
        "original_issue_id": None,
        "matched_hash_id": None
    },
    
    # Issue Association (if uploaded with issue)
    "issue": {
        "issue_id": "GG-2025-001",
        "issue_type": "pothole",
        "created_at": ISODate("2025-12-13T18:15:00Z")
    },
    
    # User Info (optional)
    "user": {
        "user_id": "user_123",
        "ip_address": "127.0.0.1"
    },
    
    # Metadata
    "metadata": {
        "processing_time_ms": 2340,
        "validation_version": "1.0"
    }
}

# Indexes:
db.image_validations.createIndex({"validation_id": 1}, {unique: true})
db.image_validations.createIndex({"created_at": -1})
db.image_validations.createIndex({"issue.issue_id": 1})
db.image_validations.createIndex({"validation.status": 1})
db.image_validations.createIndex({"hash.perceptual_hash": 1})
db.image_validations.createIndex({"exif.gps.coordinates": "2dsphere"})  # For geo queries
