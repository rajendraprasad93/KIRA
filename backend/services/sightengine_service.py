"""
Sightengine Service - AI-Generated Image Detection

This service integrates with the Sightengine API to detect AI-generated or synthetic images.
"""

import os
import requests
import logging
from typing import Dict, Optional

logger = logging.getLogger(__name__)

# Configuration from environment
SIGHTENGINE_API_USER = os.environ.get("SIGHTENGINE_API_USER")
SIGHTENGINE_API_SECRET = os.environ.get("SIGHTENGINE_API_SECRET")

# FALLBACK: If not loaded from environment, try reading .env directly
if not SIGHTENGINE_API_USER or not SIGHTENGINE_API_SECRET:
    print("⚠️  Environment variables not loaded, trying to read .env directly...")
    from pathlib import Path
    env_file = Path(__file__).parent.parent / '.env'
    if env_file.exists():
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    if '=' in line:
                        key, value = line.split('=', 1)
                        key = key.strip()
                        value = value.strip()
                        if key == 'SIGHTENGINE_API_USER':
                            SIGHTENGINE_API_USER = value
                            print(f"✓ Loaded SIGHTENGINE_API_USER: {value}")
                        elif key == 'SIGHTENGINE_API_SECRET':
                            SIGHTENGINE_API_SECRET = value
                            print(f"✓ Loaded SIGHTENGINE_API_SECRET: ***{value[-4:]}")

AI_GENERATION_THRESHOLD = float(os.environ.get("AI_GENERATION_THRESHOLD", "0.8"))


# Sightengine API endpoint
SIGHTENGINE_URL = "https://api.sightengine.com/1.0/check.json"


def detect_ai_generated(image_path: str) -> Dict:
    """
    Detect if an image is AI-generated using Sightengine API.
    
    Args:
        image_path: Absolute path to the image file
        
    Returns:
        dict: {
            "is_ai_generated": bool,
            "ai_probability": float,
            "error": Optional[str]
        }
    """
    # Check if API credentials are configured
    if not SIGHTENGINE_API_USER or not SIGHTENGINE_API_SECRET:
        logger.warning("⚠️  Sightengine API credentials not configured. Skipping AI detection.")
        print(f"\n⚠️  WARNING: Sightengine API not configured!")
        print(f"   SIGHTENGINE_API_USER: {SIGHTENGINE_API_USER}")
        print(f"   SIGHTENGINE_API_SECRET: {'***' if SIGHTENGINE_API_SECRET else 'None'}")
        return {
            "is_ai_generated": False,
            "ai_probability": 0.0,
            "error": "API credentials not configured",
            "skipped": True
        }
    
    print(f"\n🔍 Calling Sightengine API...")
    print(f"   API User: {SIGHTENGINE_API_USER}")
    print(f"   Image: {image_path}")
    
    try:
        # Prepare the API request
        with open(image_path, 'rb') as image_file:
            files = {'media': image_file}
            data = {
                'api_user': SIGHTENGINE_API_USER,
                'api_secret': SIGHTENGINE_API_SECRET,
                'models': 'genai'  # AI-generated image detection model
            }
            
            logger.info(f"Sending image to Sightengine for AI detection: {image_path}")
            
            # Make API request
            response = requests.post(
                SIGHTENGINE_URL,
                files=files,
                data=data,
                timeout=10
            )
            
            response.raise_for_status()
            result = response.json()
            
            # Check for API errors
            if result.get('status') == 'failure':
                error_msg = result.get('error', {}).get('message', 'Unknown error')
                print(f"❌ Sightengine API Error: {error_msg}")
                logger.error(f"Sightengine API error: {error_msg}")
                return {
                    "is_ai_generated": False,
                    "ai_probability": 0.0,
                    "error": error_msg,
                    "skipped": True
                }
            
            # Extract AI-generated probability
            # The response structure: {"type": {"ai_generated": 0.95}}
            ai_prob = result.get('type', {}).get('ai_generated', 0.0)
            
            print(f"✅ Sightengine Response:")
            print(f"   AI Probability: {ai_prob:.2%}")
            print(f"   Threshold: {AI_GENERATION_THRESHOLD:.2%}")
            print(f"   Is AI Generated: {ai_prob >= AI_GENERATION_THRESHOLD}")
            
            logger.info(f"AI detection result: {ai_prob:.2%} probability")
            
            return {
                "is_ai_generated": ai_prob >= AI_GENERATION_THRESHOLD,
                "ai_probability": ai_prob,
                "error": None,
                "skipped": False
            }
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Sightengine API request failed: {str(e)}")
        return {
            "is_ai_generated": False,
            "ai_probability": 0.0,
            "error": f"API request failed: {str(e)}",
            "skipped": True
        }
    except Exception as e:
        logger.error(f"Unexpected error in AI detection: {str(e)}")
        return {
            "is_ai_generated": False,
            "ai_probability": 0.0,
            "error": f"Unexpected error: {str(e)}",
            "skipped": True
        }


def is_ai_generated(image_path: str, threshold: Optional[float] = None) -> bool:
    """
    Simple boolean check if image is AI-generated.
    
    Args:
        image_path: Absolute path to the image file
        threshold: Custom threshold (optional, defaults to env config)
        
    Returns:
        bool: True if AI-generated probability exceeds threshold
    """
    result = detect_ai_generated(image_path)
    
    # If skipped due to error, return False (don't block)
    if result.get("skipped"):
        return False
    
    # Use custom threshold if provided
    if threshold is not None:
        return result.get("ai_probability", 0.0) >= threshold
    
    return result.get("is_ai_generated", False)
