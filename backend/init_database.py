"""
MongoDB Database Initialization Script
Creates indexes and seed data for GrievanceGenie
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, timedelta
import uuid

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def init_database():
    """Initialize MongoDB database with indexes and optional seed data"""
    print("\n" + "="*60)
    print("🚀 Initializing GrievanceGenie Database")
    print("="*60 + "\n")
    
    try:
        # Connect to MongoDB
        mongo_url = os.environ.get('MONGO_URL')
        db_name = os.environ.get('DB_NAME', 'grievance_genie')
        
        if not mongo_url:
            print("❌ MONGO_URL not found in .env")
            return
        
        print(f"📡 Connecting to database: {db_name}")
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        # Test connection
        await client.server_info()
        print("✅ Connected successfully!\n")
        
        #  ─────────────── CREATE INDEXES ───────────────
        print("📑 Creating indexes...\n")
        
        # Issues collection indexes
        print("  Creating indexes for 'issues' collection:")
        await db.issues.create_index([("id", 1)], unique=True)
        print("    ✅ Unique index on 'id'")
        
        await db.issues.create_index([("status", 1)])
        print("    ✅ Index on 'status'")
        
        await db.issues.create_index([("category", 1)])
        print("    ✅ Index on 'category'")
        
        await db.issues.create_index([("reported_at", -1)])
        print("    ✅ Descending index on 'reported_at'")
        
        await db.issues.create_index([("reported_by", 1)])
        print("    ✅ Index on 'reported_by'")
        
        # Geospatial index for location-based queries
        await db.issues.create_index([("location", "2dsphere")])
        print("    ✅ Geospatial index on 'location'")
        
        # Verifications collection indexes
        print("\n  Creating indexes for 'verifications' collection:")
        await db.verifications.create_index([("issue_id", 1)])
        print("    ✅ Index on 'issue_id'")
        
        await db.verifications.create_index([("user_id", 1)])
        print("    ✅ Index on 'user_id'")
        
        await db.verifications.create_index([("verified_at", -1)])
        print("    ✅ Descending index on 'verified_at'")
        
        # Compound index for quick lookups
        await db.verifications.create_index([("issue_id", 1), ("user_id", 1)], unique=True)
        print("    ✅ Compound unique index on 'issue_id' + 'user_id'")
        
        # Users collection indexes (future use)
        print("\n  Creating indexes for 'users' collection:")
        await db.users.create_index([("phone", 1)], unique=True)
        print("    ✅ Unique index on 'phone'")
        
        await db.users.create_index([("points", -1)])
        print("    ✅ Descending index on 'points' (for leaderboard)")
        
        await db.users.create_index([("ward", 1)])
        print("    ✅ Index on 'ward'")
        
        print("\n✅ All indexes created successfully!")
        
        # ─────────────── SEED DATA (OPTIONAL) ───────────────
        print("\n" + "-"*60)
        seed = input("\n🌱 Do you want to add sample data? (y/n): ").lower().strip()
        
        if seed == 'y':
            print("\n📦 Seeding sample data...\n")
            
            # Sample users
            sample_users = [
                {
                    "phone": "9876543210",
                    "name": "Rajendra Prasad",
                    "email": "rajendra@example.com",
                    "ward": "Ward 12 - Ashok Nagar",
                    "points": 125,
                    "rank": 1,
                    "badges": ["first_reporter", "active_citizen"],
                    "created_at": datetime.utcnow() - timedelta(days=30),
                    "updated_at": datetime.utcnow()
                },
                {
                    "phone": "9876543211",
                    "name": "Priya Sharma",
                    "email": "priya@example.com",
                    "ward": "Ward 12 - Ashok Nagar",
                    "points": 95,
                    "rank": 2,
                    "badges": ["active_citizen"],
                    "created_at": datetime.utcnow() - timedelta(days=25),
                    "updated_at": datetime.utcnow()
                }
            ]
            
            for user in sample_users:
                await db.users.update_one(
                    {"phone": user["phone"]},
                    {"$set": user},
                    upsert=True
                )
            print(f"  ✅ Added {len(sample_users)} sample users")
            
            # Sample issues
            sample_issues = [
                {
                    "id": "GG-2025-00001",
                    "title": "Pothole on MG Road",
                    "category": "roads",
                    "severity": "high",
                    "description": "Large pothole near Coffee Day Square causing traffic issues",
                    "location": {
                        "lat": 12.9716,
                        "lng": 77.5946,
                        "address": "MG Road, Bangalore, Karnataka"
                    },
                    "department": "Roads & Infrastructure",
                    "status": "in_progress",
                    "photos": [],
                    "reported_by": "9876543210",
                    "reported_at": datetime.utcnow() - timedelta(days=5),
                    "updated_at": datetime.utcnow() - timedelta(hours=2),
                    "timeline": [
                        {"status": "Reported", "date": datetime.utcnow() - timedelta(days=5)},
                        {"status": "Being verified", "date": datetime.utcnow() - timedelta(days=5)},
                        {"status": "Assigned", "date": datetime.utcnow() - timedelta(days=3)},
                        {"status": "In Progress", "date": datetime.utcnow() - timedelta(hours=2)}
                    ]
                },
                {
                    "id": "GG-2025-00002",
                    "title": "Streetlight not working",
                    "category": "electricity",
                    "severity": "medium",
                    "description": "Streetlight not working for past 3 days",
                    "location": {
                        "lat": 12.9698,
                        "lng": 77.5938,
                        "address": "Brigade Road, Bangalore, Karnataka"
                    },
                    "department": "Electricity",
                    "status": "resolved",
                    "photos": [],
                    "reported_by": "9876543211",
                    "reported_at": datetime.utcnow() - timedelta(days=4),
                    "updated_at": datetime.utcnow() - timedelta(days=1),
                    "timeline": [
                        {"status": "Reported", "date": datetime.utcnow() - timedelta(days=4)},
                        {"status": "Being verified", "date": datetime.utcnow() - timedelta(days=4)},
                        {"status": "Assigned", "date": datetime.utcnow() - timedelta(days=2)},
                        {"status": "Resolved", "date": datetime.utcnow() - timedelta(days=1)}
                    ]
                },
                {
                    "id": "GG-2025-00003",
                    "title": "Garbage not collected",
                    "category": "garbage",
                    "severity": "low",
                    "description": "Garbage bin overflowing, not collected for 2 days",
                    "location": {
                        "lat": 12.9730,
                        "lng": 77.5920,
                        "address": "Residency Road, Bangalore, Karnataka"
                    },
                    "department": "Sanitation",
                    "status": "verifying",
                    "photos": [],
                    "reported_by": "9876543210",
                    "reported_at": datetime.utcnow() - timedelta(hours=6),
                    "updated_at": datetime.utcnow() - timedelta(hours=6),
                    "timeline": [
                        {"status": "Reported", "date": datetime.utcnow() - timedelta(hours=6)},
                        {"status": "Being verified", "date": datetime.utcnow() - timedelta(hours=6)}
                    ]
                }
            ]
            
            for issue in sample_issues:
                await db.issues.update_one(
                    {"id": issue["id"]},
                    {"$set": issue},
                    upsert=True
                )
            print(f"  ✅ Added {len(sample_issues)} sample issues")
            
            # Sample verifications
            sample_verifications = [
                {
                    "id": str(uuid.uuid4()),
                    "issue_id": "GG-2025-00001",
                    "user_id": "9876543211",
                    "response": "yes",
                    "location": {"lat": 12.9716, "lng": 77.5946},
                    "verified_at": datetime.utcnow() - timedelta(days=4)
                },
                {
                    "id": str(uuid.uuid4()),
                    "issue_id": "GG-2025-00002",
                    "user_id": "9876543210",
                    "response": "yes",
                    "location": {"lat": 12.9698, "lng": 77.5938},
                    "verified_at": datetime.utcnow() - timedelta(days=3)
                }
            ]
            
            for verification in sample_verifications:
                await db.verifications.update_one(
                    {"issue_id": verification["issue_id"], "user_id": verification["user_id"]},
                    {"$set": verification},
                    upsert=True
                )
            print(f"  ✅ Added {len(sample_verifications)} sample verifications")
            
            print("\n✅ Sample data seeded successfully!")
        
        # ─────────────── SUMMARY ───────────────
        print("\n" + "="*60)
        print("📊 Database Statistics")
        print("="*60)
        
        collections = await db.list_collection_names()
        for coll_name in ['users', 'issues', 'verifications']:
            count = await db[coll_name].count_documents({})
            print(f"  {coll_name.capitalize()}: {count} document(s)")
        
        print("\n" + "="*60)
        print("🎉 DATABASE INITIALIZATION COMPLETE!")
        print("="*60)
        print("\n✅ Your GrievanceGenie database is ready to use!")
        print("\n💡 Next steps:")
        print("   1. Run: python run.py")
        print("   2. Test: http://localhost:5000/api/health")
        print("   3. Create issues via API or frontend")
        print("="*60 + "\n")
        
        client.close()
        
    except Exception as e:
        print(f"\n❌ Initialization failed: {str(e)}")
        print("\n💡 Make sure:")
        print("   1. MongoDB is running")
        print("   2. .env file has correct MONGO_URL")
        print("   3. You have network access (if using Atlas)")

if __name__ == "__main__":
    asyncio.run(init_database())
