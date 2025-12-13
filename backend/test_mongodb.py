import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def test_connection():
    """Test MongoDB connection and basic operations"""
    print("\n" + "="*60)
    print("🔍 MongoDB Connection Test")
    print("="*60 + "\n")
    
    try:
        # Get connection details
        mongo_url = os.environ.get('MONGO_URL')
        db_name = os.environ.get('DB_NAME', 'grievance_genie')
        
        if not mongo_url:
            print("❌ ERROR: MONGO_URL not found in .env file")
            print("\n💡 Please create .env file with:")
            print("   MONGO_URL=mongodb+srv://...")
            print("   DB_NAME=grievance_genie")
            return
        
        # Show connection info (hide password)
        if '@' in mongo_url:
            safe_url = mongo_url.split('@')[0].split('//')[0] + '//***:***@' + mongo_url.split('@')[1]
        else:
            safe_url = mongo_url
        
        print(f"📡 Connecting to: {safe_url}")
        print(f"🗄️  Database: {db_name}\n")
        
        # Connect to MongoDB
        client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
        db = client[db_name]
        
        # Test 1: Server Info
        print("1️⃣  Testing server connection...")
        server_info = await client.server_info()
        print(f"   ✅ MongoDB version: {server_info.get('version')}")
        
        # Test 2: Write operation
        print("\n2️⃣  Testing write operation...")
        test_doc = {
            "test": "Hello MongoDB!",
            "timestamp": datetime.utcnow().isoformat(),
            "from": "GrievanceGenie Backend"
        }
        result = await db.test_collection.insert_one(test_doc)
        print(f"   ✅ Document inserted with ID: {result.inserted_id}")
        
        # Test 3: Read operation
        print("\n3️⃣  Testing read operation...")
        found = await db.test_collection.find_one({"_id": result.inserted_id})
        print(f"   ✅ Document retrieved: {found.get('test')}")
        
        # Test 4: Update operation
        print("\n4️⃣  Testing update operation...")
        await db.test_collection.update_one(
            {"_id": result.inserted_id},
            {"$set": {"updated": True}}
        )
        updated = await db.test_collection.find_one({"_id": result.inserted_id})
        print(f"   ✅ Document updated: {updated.get('updated')}")
        
        # Test 5: Delete operation
        print("\n5️⃣  Testing delete operation...")
        delete_result = await db.test_collection.delete_one({"_id": result.inserted_id})
        print(f"   ✅ Document deleted: {delete_result.deleted_count} document(s)")
        
        # Test 6: List collections
        print("\n6️⃣  Listing existing collections...")
        collections = await db.list_collection_names()
        if collections:
            print(f"   📚 Found {len(collections)} collection(s):")
            for coll in collections:
                count = await db[coll].count_documents({})
                print(f"      - {coll}: {count} document(s)")
        else:
            print("   📚 No collections yet (database is empty)")
        
        # Close connection
        client.close()
        
        # Success summary
        print("\n" + "="*60)
        print("🎉 ALL TESTS PASSED!")
        print("="*60)
        print(f"✅ Connection successful to: {db_name}")
        print(f"✅ All CRUD operations working")
        print(f"✅ Your backend is ready to use MongoDB!")
        print("="*60 + "\n")
        
    except Exception as e:
        print("\n" + "="*60)
        print("❌ CONNECTION FAILED")
        print("="*60)
        print(f"\nError: {str(e)}\n")
        print("💡 Troubleshooting Steps:")
        print("   1. Check if .env file exists in backend directory")
        print("   2. Verify MONGO_URL is correct")
        print("   3. For Atlas: Check Network Access settings")
        print("   4. For Atlas: Verify username/password")
        print("   5. For local: Ensure MongoDB is running")
        print("   6. Try: mongosh to test connection manually")
        print("="*60 + "\n")

if __name__ == "__main__":
    asyncio.run(test_connection())
