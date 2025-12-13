"""
EXIF Service - Metadata Extraction and GPS Validation

This service extracts EXIF metadata from images and validates GPS coordinates.
"""

import os
import logging
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
import piexif
from typing import Optional, Tuple, Dict
from datetime import datetime
from math import radians, cos, sin, asin, sqrt

logger = logging.getLogger(__name__)

# Configuration
LOCATION_RADIUS_KM = float(os.environ.get("LOCATION_RADIUS_KM", "10"))


def extract_exif(image_path: str) -> Dict:
    """
    Extract all EXIF metadata from an image.
    
    Args:
        image_path: Absolute path to the image file
        
    Returns:
        dict: EXIF metadata or empty dict if not available
    """
    try:
        image = Image.open(image_path)
        exif_data = image._getexif()
        
        if not exif_data:
            logger.info(f"No EXIF data found in image: {image_path}")
            return {}
        
        # Decode EXIF tags
        decoded_exif = {}
        for tag_id, value in exif_data.items():
            tag = TAGS.get(tag_id, tag_id)
            decoded_exif[tag] = value
        
        return decoded_exif
        
    except Exception as e:
        logger.error(f"Failed to extract EXIF data: {str(e)}")
        return {}


def extract_gps_coordinates(image_path: str) -> Optional[Tuple[float, float]]:
    """
    Extract GPS coordinates from image EXIF data.
    
    Args:
        image_path: Absolute path to the image file
        
    Returns:
        tuple: (latitude, longitude) or None if GPS data not available
    """
    try:
        print(f"\n🗺️  GPS EXTRACTION DEBUG:")
        print(f"   Image: {image_path}")
        
        exif_dict = piexif.load(image_path)
        
        print(f"   EXIF keys found: {list(exif_dict.keys())}")
        
        # Check if GPS data exists - use 'GPS' string key, not piexif.GPSIFD constant
        if 'GPS' not in exif_dict or not exif_dict['GPS']:
            print(f"   ❌ No GPS data found in EXIF")
            logger.info(f"No GPS data in image: {image_path}")
            return None
        
        gps_info = exif_dict['GPS']
        print(f"   ✅ GPS IFD found!")
        print(f"   GPS IFD keys: {list(gps_info.keys())}")
        print(f"   GPS data: {gps_info}")
        
        # Extract GPS coordinates using piexif tag constants
        lat_tag = piexif.GPSIFD.GPSLatitude
        lon_tag = piexif.GPSIFD.GPSLongitude
        lat_ref_tag = piexif.GPSIFD.GPSLatitudeRef
        lon_ref_tag = piexif.GPSIFD.GPSLongitudeRef
        
        if lat_tag not in gps_info or lon_tag not in gps_info:
            print(f"   ❌ GPSLatitude ({lat_tag}) or GPSLongitude ({lon_tag}) tag missing")
            print(f"   Available tags: {list(gps_info.keys())}")
            return None
        
        # Get latitude
        lat = gps_info[lat_tag]
        lat_ref = gps_info.get(lat_ref_tag, b'N')
        print(f"   Raw Latitude: {lat}, Ref: {lat_ref}")
        latitude = _convert_to_degrees(lat)
        if lat_ref == b'S':
            latitude = -latitude
        
        # Get longitude
        lon = gps_info[lon_tag]
        lon_ref = gps_info.get(lon_ref_tag, b'E')
        print(f"   Raw Longitude: {lon}, Ref: {lon_ref}")
        longitude = _convert_to_degrees(lon)
        if lon_ref == b'W':
            longitude = -longitude
        
        print(f"   ✅ Extracted GPS: ({latitude}, {longitude})")
        logger.info(f"Extracted GPS: ({latitude}, {longitude})")
        return (latitude, longitude)
        
    except Exception as e:
        print(f"   ❌ GPS extraction error: {str(e)}")
        import traceback
        traceback.print_exc()
        logger.error(f"Failed to extract GPS coordinates: {str(e)}")
        return None


def _convert_to_degrees(value):
    """
    Helper function to convert GPS coordinates to degrees.
    
    Args:
        value: GPS coordinate in degrees, minutes, seconds format
        
    Returns:
        float: Decimal degrees
    """
    d = float(value[0][0]) / float(value[0][1])
    m = float(value[1][0]) / float(value[1][1])
    s = float(value[2][0]) / float(value[2][1])
    
    return d + (m / 60.0) + (s / 3600.0)


def extract_timestamp(image_path: str) -> Optional[datetime]:
    """
    Extract the timestamp when the image was taken.
    
    Args:
        image_path: Absolute path to the image file
        
    Returns:
        datetime: Image capture timestamp or None
    """
    try:
        exif_data = extract_exif(image_path)
        
        # Try different timestamp fields
        timestamp_fields = ['DateTimeOriginal', 'DateTime', 'DateTimeDigitized']
        
        for field in timestamp_fields:
            if field in exif_data:
                timestamp_str = exif_data[field]
                # Parse EXIF datetime format: "YYYY:MM:DD HH:MM:SS"
                timestamp = datetime.strptime(timestamp_str, "%Y:%m:%d %H:%M:%S")
                logger.info(f"Extracted timestamp: {timestamp}")
                return timestamp
        
        logger.info(f"No timestamp found in EXIF data")
        return None
        
    except Exception as e:
        logger.error(f"Failed to extract timestamp: {str(e)}")
        return None


def calculate_distance(coord1: Tuple[float, float], coord2: Tuple[float, float]) -> float:
    """
    Calculate the great circle distance between two points on Earth using Haversine formula.
    
    Args:
        coord1: (latitude, longitude) of first point
        coord2: (latitude, longitude) of second point
        
    Returns:
        float: Distance in kilometers
    """
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    
    # Convert to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    
    # Radius of Earth in kilometers
    r = 6371
    
    distance = c * r
    logger.info(f"Distance between {coord1} and {coord2}: {distance:.2f} km")
    
    return distance


def validate_location(
    image_coords: Tuple[float, float],
    user_coords: Tuple[float, float],
    max_radius_km: Optional[float] = None
) -> bool:
    """
    Validate if image GPS coordinates are within acceptable radius of user's location.
    
    Args:
        image_coords: (latitude, longitude) from image EXIF
        user_coords: (latitude, longitude) from user's location
        max_radius_km: Maximum acceptable distance in km (optional)
        
    Returns:
        bool: True if within acceptable radius, False otherwise
    """
    if max_radius_km is None:
        max_radius_km = LOCATION_RADIUS_KM
    
    distance = calculate_distance(image_coords, user_coords)
    is_valid = distance <= max_radius_km
    
    if not is_valid:
        logger.warning(
            f"Location mismatch: {distance:.2f}km exceeds threshold of {max_radius_km}km"
        )
    
    return is_valid


def extract_camera_info(image_path: str) -> Dict[str, Optional[str]]:
    """
    Extract camera/device information from EXIF data.
    
    Args:
        image_path: Absolute path to the image file
        
    Returns:
        dict: Camera make and model
    """
    try:
        exif_data = extract_exif(image_path)
        
        return {
            "camera_make": exif_data.get("Make"),
            "camera_model": exif_data.get("Model")
        }
        
    except Exception as e:
        logger.error(f"Failed to extract camera info: {str(e)}")
        return {"camera_make": None, "camera_model": None}


def reverse_geocode(latitude: float, longitude: float) -> Optional[Dict[str, str]]:
    """
    Convert GPS coordinates to human-readable address using OpenStreetMap Nominatim API.
    
    Args:
        latitude: GPS latitude
        longitude: GPS longitude
        
    Returns:
        dict: Address information or None if failed
            {
                "address": "Full formatted address",
                "city": "City name",
                "state": "State/Province",
                "country": "Country",
                "postcode": "Postal code"
            }
    """
    try:
        import requests
        
        # Nominatim API endpoint (Free, no API key needed)
        url = "https://nominatim.openstreetmap.org/reverse"
        
        params = {
            'lat': latitude,
            'lon': longitude,
            'format': 'json',
            'addressdetails': 1,
            'zoom': 18  # Get detailed address
        }
        
        headers = {
            'User-Agent': 'GrievanceGenie/1.0'  # Required by Nominatim
        }
        
        print(f"\n🗺️  REVERSE GEOCODING:")
        print(f"   Coordinates: ({latitude}, {longitude})")
        
        response = requests.get(url, params=params, headers=headers, timeout=5)
        response.raise_for_status()
        
        data = response.json()
        
        if 'error' in data:
            print(f"   ❌ Geocoding error: {data.get('error')}")
            return None
        
        # Extract address components
        address_data = data.get('address', {})
        
        # Build formatted address
        address_parts = []
        
        # Add road/street
        if 'road' in address_data:
            address_parts.append(address_data['road'])
        
        # Add suburb/neighborhood
        if 'suburb' in address_data:
            address_parts.append(address_data['suburb'])
        elif 'neighbourhood' in address_data:
            address_parts.append(address_data['neighbourhood'])
        
        # Add city
        city = (address_data.get('city') or 
                address_data.get('town') or 
                address_data.get('village') or
                address_data.get('county'))
        
        if city:
            address_parts.append(city)
        
        # Add state
        state = address_data.get('state')
        if state:
            address_parts.append(state)
        
        # Add country
        country = address_data.get('country')
        
        # Add postcode
        postcode = address_data.get('postcode')
        
        formatted_address = ', '.join(address_parts)
        if country:
            formatted_address += f", {country}"
        if postcode:
            formatted_address += f" - {postcode}"
        
        result = {
            "address": formatted_address or data.get('display_name', 'Address not found'),
            "city": city,
            "state": state,
            "country": country,
            "postcode": postcode
        }
        
        print(f"   ✅ Address: {result['address']}")
        logger.info(f"Reverse geocoded: {result['address']}")
        
        return result
        
    except requests.exceptions.Timeout:
        print(f"   ⚠️  Geocoding timeout")
        logger.warning("Reverse geocoding timeout")
        return None
    except Exception as e:
        print(f"   ❌ Geocoding failed: {str(e)}")
        logger.error(f"Reverse geocoding failed: {str(e)}")
        return None
