"""
Hash Service - Perceptual Hashing for Duplicate Detection

This service generates perceptual hashes (pHash) for images and detects duplicates/resubmissions.
"""

import os
import logging
from PIL import Image
import imagehash
from typing import List, Dict, Optional
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)

# Configuration
HASH_SIMILARITY_THRESHOLD = int(os.environ.get("HASH_SIMILARITY_THRESHOLD", "5"))

# MongoDB connection (will be initialized by main app)
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'grievance_genie')]
image_hashes_collection = db.image_hashes


def generate_phash(image_path: str) -> str:
    """
    Generate perceptual hash (pHash) for an image.
    
    Args:
        image_path: Absolute path to the image file
        
    Returns:
        str: Hexadecimal perceptual hash
    """
    try:
        image = Image.open(image_path)
        # Generate perceptual hash using imagehash library
        phash = imagehash.phash(image, hash_size=8)
        hash_str = str(phash)
        
        logger.info(f"Generated pHash for {image_path}: {hash_str}")
        return hash_str
        
    except Exception as e:
        logger.error(f"Failed to generate pHash: {str(e)}")
        raise


def hash_distance(hash1: str, hash2: str) -> int:
    """
    Calculate Hamming distance between two perceptual hashes.
    
    Args:
        hash1: First hash string
        hash2: Second hash string
        
    Returns:
        int: Hamming distance (0 = identical, higher = more different)
    """
    try:
        h1 = imagehash.hex_to_hash(hash1)
        h2 = imagehash.hex_to_hash(hash2)
        distance = h1 - h2  # imagehash overloads the - operator for Hamming distance
        
        return distance
        
    except Exception as e:
        logger.error(f"Failed to calculate hash distance: {str(e)}")
        return 999  # Return high distance on error


async def find_similar_hashes(phash: str, threshold: Optional[int] = None) -> List[Dict]:
    """
    Search for similar perceptual hashes in the database.
    
    Args:
        phash: Perceptual hash to search for
        threshold: Maximum Hamming distance for similarity (optional)
        
    Returns:
        list: List of matching hash documents with similarity scores
    """
    if threshold is None:
        threshold = HASH_SIMILARITY_THRESHOLD
    
    try:
        # Get all stored hashes (only for resolved issues)
        stored_hashes = await image_hashes_collection.find(
            {"status": "resolved"}
        ).to_list(10000)
        
        similar_hashes = []
        
        for stored_hash in stored_hashes:
            distance = hash_distance(phash, stored_hash["image_hash"])
            
            if distance <= threshold:
                similar_hashes.append({
                    "issue_id": stored_hash["issue_id"],
                    "image_hash": stored_hash["image_hash"],
                    "similarity_score": (threshold - distance) / threshold,  # Normalize to 0-1
                    "distance": distance,
                    "created_at": stored_hash.get("created_at")
                })
        
        # Sort by similarity (most similar first)
        similar_hashes.sort(key=lambda x: x["distance"])
        
        if similar_hashes:
            logger.warning(f"Found {len(similar_hashes)} similar image(s) in database")
        else:
            logger.info("No similar images found in database")
        
        return similar_hashes
        
    except Exception as e:
        logger.error(f"Failed to search for similar hashes: {str(e)}")
        return []


async def store_hash(issue_id: str, phash: str, image_path: str, status: str = "pending") -> None:
    """
    Store perceptual hash in database.
    
    Args:
        issue_id: Issue ID this image belongs to
        phash: Perceptual hash string
        image_path: Path to the image file
        status: Issue status (only 'resolved' issues are used for duplicate detection)
    """
    try:
        hash_document = {
            "issue_id": issue_id,
            "image_hash": phash,
            "image_path": image_path,
            "status": status,
            "created_at": datetime.utcnow()
        }
        
        # Upsert: update if exists, insert if not
        await image_hashes_collection.update_one(
            {"issue_id": issue_id},
            {"$set": hash_document},
            upsert=True
        )
        
        logger.info(f"Stored hash for issue {issue_id} with status '{status}'")
        
    except Exception as e:
        logger.error(f"Failed to store hash: {str(e)}")
        raise


async def update_hash_status(issue_id: str, status: str) -> None:
    """
    Update the status of a stored hash.
    Call this when an issue is resolved to enable duplicate detection.
    
    Args:
        issue_id: Issue ID
        status: New status ('resolved', 'rejected', etc.)
    """
    try:
        await image_hashes_collection.update_one(
            {"issue_id": issue_id},
            {"$set": {"status": status}}
        )
        
        logger.info(f"Updated hash status for issue {issue_id} to '{status}'")
        
    except Exception as e:
        logger.error(f"Failed to update hash status: {str(e)}")


async def create_indexes():
    """
    Create database indexes for efficient hash lookups.
    Should be called during app initialization.
    """
    try:
        await image_hashes_collection.create_index("issue_id", unique=True)
        await image_hashes_collection.create_index([("created_at", -1)])
        await image_hashes_collection.create_index("status")
        
        logger.info("Created indexes for image_hashes collection")
        
    except Exception as e:
        logger.error(f"Failed to create indexes: {str(e)}")
