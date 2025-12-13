"""
Decision Engine - Image Validation Decision Logic

This service aggregates all validation results and makes final accept/reject decisions.
"""

import logging
from typing import Dict, List

logger = logging.getLogger(__name__)

# Flag severity levels
CRITICAL_FLAGS = ["AI_GENERATED", "RESUBMITTED_IMAGE", "NO_EXIF_DATA"]
WARNING_FLAGS = ["LOCATION_NOT_AVAILABLE", "LOCATION_MISMATCH", "IMAGE_ISSUE_MISMATCH"]


def make_decision(validation_results: Dict) -> Dict:
    """
    Make final accept/reject decision based on all validation results.
    
    Args:
        validation_results: Dictionary containing all validation data:
            - ai_detection: dict from sightengine_service
            - exif_data: dict from exif_service  
            - hash_match: dict from hash_service
            - issue_match: dict from issue classification (optional)
            
    Returns:
        dict: Final decision with structure:
            {
                "status": "accepted" | "rejected",
                "reason_codes": [...],
                "ai_generated_score": float,
                "exif_status": {...},
                "hash_match": {...},
                "confidence_score": float
            }
    """
    reason_codes = []
    status = "accepted"  # Default to accepted
    
    # Extract validation data
    ai_detection = validation_results.get("ai_detection", {})
    exif_data = validation_results.get("exif_data", {})
    hash_match = validation_results.get("hash_match", {})
    issue_match = validation_results.get("issue_match", {})
    
    # Check AI-generated flag (CRITICAL)
    if ai_detection.get("is_ai_generated", False):
        reason_codes.append("AI_GENERATED")
        status = "rejected"
        logger.warning(
            f"Image rejected: AI-generated probability {ai_detection.get('ai_probability', 0):.2%}"
        )
    
    # Check duplicate/resubmission (CRITICAL)
    if hash_match.get("is_duplicate", False):
        reason_codes.append("RESUBMITTED_IMAGE")
        status = "rejected"
        logger.warning(
            f"Image rejected: Duplicate of issue {hash_match.get('original_issue_id')}"
        )
    
    # Check EXIF requirement (CRITICAL if REQUIRE_EXIF is enabled)
    import os
    require_exif = os.environ.get("REQUIRE_EXIF", "false").lower() == "true"
    has_any_exif = exif_data.get("has_gps") or exif_data.get("timestamp") or exif_data.get("camera_make")
    
    if require_exif and not has_any_exif:
        reason_codes.append("NO_EXIF_DATA")
        status = "rejected"
        logger.warning(
            "⚠️  Image rejected: No EXIF data found (STRICT MODE enabled)"
        )
        print(f"\n⚠️  STRICT MODE: Image rejected - No EXIF data")
        print(f"   This will reject WhatsApp photos, screenshots, social media images!")
    
    # Check GPS availability (WARNING - unless in strict mode where it's already rejected)
    if status != "rejected" and not exif_data.get("has_gps", False):
        reason_codes.append("LOCATION_NOT_AVAILABLE")
        logger.info("Warning: Image does not contain GPS data")
    
    # Check location mismatch (WARNING)
    elif not exif_data.get("location_valid", True):
        reason_codes.append("LOCATION_MISMATCH")
        logger.info(
            f"Warning: GPS location mismatch (distance: {exif_data.get('distance_km', 'N/A')}km)"
        )
    
    # Check issue-image consistency (WARNING)
    if not issue_match.get("is_match", True):
        reason_codes.append("IMAGE_ISSUE_MISMATCH")
        logger.info(
            f"Warning: Image may not match issue type '{issue_match.get('expected_type')}'"
        )
    
    # Calculate confidence score
    confidence_score = calculate_confidence_score(validation_results, reason_codes)
    
    # Prepare response
    decision = {
        "status": status,
        "reason_codes": reason_codes,
        "ai_generated_score": ai_detection.get("ai_probability", 0.0),
        "exif_status": {
            "has_gps": exif_data.get("has_gps", False),
            "location_valid": exif_data.get("location_valid", False),
            "timestamp": exif_data.get("timestamp"),
            "distance_km": exif_data.get("distance_km"),
            "camera_make": exif_data.get("camera_make"),
            "camera_model": exif_data.get("camera_model")
        },
        "hash_match": {
            "is_duplicate": hash_match.get("is_duplicate", False),
            "similarity_score": hash_match.get("similarity_score", 0.0),
            "original_issue_id": hash_match.get("original_issue_id"),
        },
        "confidence_score": confidence_score
    }
    
    logger.info(
        f"Decision: {status.upper()} | "
        f"Confidence: {confidence_score:.2%} | "
        f"Flags: {', '.join(reason_codes) if reason_codes else 'None'}"
    )
    
    return decision


def calculate_confidence_score(validation_results: Dict, reason_codes: List[str]) -> float:
    """
    Calculate confidence score (0-1) based on validation results.
    
    Higher score = more confident the image is authentic.
    
    Args:
        validation_results: All validation data
        reason_codes: List of reason codes/flags
        
    Returns:
        float: Confidence score between 0.0 and 1.0
    """
    score = 1.0  # Start with perfect score
    
    ai_detection = validation_results.get("ai_detection", {})
    exif_data = validation_results.get("exif_data", {})
    hash_match = validation_results.get("hash_match", {})
    
    # Deduct for critical flags
    if "AI_GENERATED" in reason_codes:
        # Deduct based on AI probability
        ai_prob = ai_detection.get("ai_probability", 0.8)
        score -= ai_prob  # Full deduction if 100% AI-generated
    
    if "RESUBMITTED_IMAGE" in reason_codes:
        # Deduct heavily for duplicates
        similarity = hash_match.get("similarity_score", 1.0)
        score -= (0.7 * similarity)  # Up to 70% deduction
    
    if "NO_EXIF_DATA" in reason_codes:
        # Heavy penalty for missing EXIF (strict mode)
        score -= 0.9  # 90% deduction - almost certain reject
    
    # Deduct for warning flags (smaller penalties)
    if "LOCATION_NOT_AVAILABLE" in reason_codes:
        score -= 0.15  # 15% penalty for missing GPS
    
    if "LOCATION_MISMATCH" in reason_codes:
        # Penalty based on distance
        distance = exif_data.get("distance_km")
        max_allowed = exif_data.get("max_allowed_km", 10)
        
        # Only apply penalty if distance is available
        if distance is not None and max_allowed > 0:
            penalty = min(0.25, (distance / max_allowed) * 0.1)
            score -= penalty
        else:
            # Default penalty if distance not available
            score -= 0.15
    
    if "IMAGE_ISSUE_MISMATCH" in reason_codes:
        score -= 0.10  # 10% penalty for type mismatch
    
    # Ensure score stays in valid range
    score = max(0.0, min(1.0, score))
    
    return score


def should_auto_reject(reason_codes: List[str]) -> bool:
    """
    Determine if image should be automatically rejected based on reason codes.
    
    Args:
        reason_codes: List of validation flags
        
    Returns:
        bool: True if should auto-reject
    """
    # Auto-reject if any critical flag is present
    for code in reason_codes:
        if code in CRITICAL_FLAGS:
            return True
    
    return False


def get_rejection_message(reason_codes: List[str]) -> str:
    """
    Generate human-readable rejection message.
    
    Args:
        reason_codes: List of reason codes
        
    Returns:
        str: User-friendly rejection message
    """
    messages = {
        "AI_GENERATED": "This image appears to be AI-generated or synthetic. Please upload a genuine photograph of the issue.",
        "RESUBMITTED_IMAGE": "This image has already been submitted for a resolved complaint. Please upload a new photo.",
        "NO_EXIF_DATA": "This image does not contain EXIF metadata. Please upload a photo taken directly from your camera with location services enabled. Note: WhatsApp and social media images are not accepted.",
        "LOCATION_MISMATCH": "The GPS location in the image does not match your reported location. This may indicate the photo was taken elsewhere.",
        "LOCATION_NOT_AVAILABLE": "No GPS data found in the image. For verification, please ensure location services are enabled when taking photos.",
        "IMAGE_ISSUE_MISMATCH": "The image content may not match the selected issue type. Please verify you've selected the correct category."
    }
    
    # Get messages for all reason codes
    result_messages = []
    for code in reason_codes:
        if code in messages:
            result_messages.append(messages[code])
    
    if not result_messages:
        return "Image validation passed."
    
    return " | ".join(result_messages)
