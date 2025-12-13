"""
Test script for Image Authenticity Pipeline

This script demonstrates how to test the image validation endpoint.
"""

import requests
import sys
from pathlib import Path

# Configuration
API_URL = "http://localhost:5000/api/validate-image"

def test_validate_image(image_path, issue_type="pothole", lat=None, lng=None):
    """
    Test the image validation endpoint.
    
    Args:
        image_path: Path to image file
        issue_type: Type of issue
        lat: Optional latitude
        lng: Optional longitude
    """
    print(f"\n{'='*60}")
    print(f"Testing Image Validation")
    print(f"{'='*60}")
    print(f"Image: {image_path}")
    print(f"Issue Type: {issue_type}")
    if lat and lng:
        print(f"Location: ({lat}, {lng})")
    print(f"{'='*60}\n")
    
    try:
        # Prepare the request
        with open(image_path, 'rb') as img_file:
            files = {'image': img_file}
            data = {'issue_type': issue_type}
            
            if lat is not None:
                data['latitude'] = lat
            if lng is not None:
                data['longitude'] = lng
            
            # Make the request
            print("Sending request to API...")
            response = requests.post(API_URL, files=files, data=data)
            
            # Check response
            if response.status_code == 200:
                result = response.json()
                print("\n✅ Validation Complete!")
                print(f"\nStatus: {result['status'].upper()}")
                print(f"Confidence Score: {result['confidence_score']:.2%}")
                
                if result['reason_codes']:
                    print(f"\nFlags: {', '.join(result['reason_codes'])}")
                
                print(f"\n--- AI Detection ---")
                print(f"AI Generated Score: {result['ai_generated_score']:.2%}")
                
                print(f"\n--- EXIF Status ---")
                exif = result['exif_status']
                print(f"Has GPS: {exif['has_gps']}")
                if exif['has_gps']:
                    print(f"Location Valid: {exif['location_valid']}")
                    if exif['distance_km']:
                        print(f"Distance: {exif['distance_km']:.2f} km")
                print(f"Timestamp: {exif.get('timestamp', 'N/A')}")
                print(f"Camera: {exif.get('camera_make', 'N/A')} {exif.get('camera_model', 'N/A')}")
                
                print(f"\n--- Duplicate Check ---")
                hash_match = result['hash_match']
                print(f"Is Duplicate: {hash_match['is_duplicate']}")
                if hash_match['is_duplicate']:
                    print(f"Similarity: {hash_match['similarity_score']:.2%}")
                    print(f"Original Issue: {hash_match['original_issue_id']}")
                
                print(f"\n--- Message ---")
                print(result.get('message', 'N/A'))
                
                return result
                
            else:
                print(f"\n❌ Request Failed!")
                print(f"Status Code: {response.status_code}")
                print(f"Error: {response.text}")
                return None
                
    except FileNotFoundError:
        print(f"\n❌ Error: Image file not found: {image_path}")
        return None
    except requests.exceptions.ConnectionError:
        print(f"\n❌ Error: Cannot connect to API at {API_URL}")
        print("Make sure the backend server is running: python run.py")
        return None
    except Exception as e:
        print(f"\n❌ Unexpected Error: {str(e)}")
        return None


def main():
    """Main test function"""
    print("\n" + "="*60)
    print("Image Authenticity Pipeline - Test Script")
    print("="*60)
    
    # Check if image path provided
    if len(sys.argv) < 2:
        print("\nUsage: python test_image_validation.py <image_path> [issue_type] [lat] [lng]")
        print("\nExample:")
        print("  python test_image_validation.py photos/pothole.jpg pothole 13.0827 80.2707")
        print("\nIssue types: pothole, garbage, streetlight, water, drainage, roads, electricity")
        sys.exit(1)
    
    # Parse arguments
    image_path = sys.argv[1]
    issue_type = sys.argv[2] if len(sys.argv) > 2 else "pothole"
    lat = float(sys.argv[3]) if len(sys.argv) > 3 else None
    lng = float(sys.argv[4]) if len(sys.argv) > 4 else None
    
    # Run test
    result = test_validate_image(image_path, issue_type, lat, lng)
    
    # Summary
    print(f"\n{'='*60}")
    if result:
        if result['status'] == 'accepted':
            print("✅ TEST PASSED - Image Accepted")
        else:
            print("⚠️  TEST COMPLETED - Image Rejected")
    else:
        print("❌ TEST FAILED")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
