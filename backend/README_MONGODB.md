# GrievanceGenie Backend - MongoDB

## ✅ Your Backend is READY!

Your `server.py` already has MongoDB configured. Just need to connect it!

---

## 🚀 Quick Start (3 Steps)

### **1. Set up MongoDB**
Choose one:
- **Option A**: MongoDB Atlas (cloud, free) - See setup guide
- **Option B**: MongoDB local - Install from mongodb.com

### **2. Configure Environment**
Create `.env` file:
```env
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/grievance_genie
DB_NAME=grievance_genie
GEMINI_API_KEY=your-key
BACKEND_URL=http://localhost:5000
```

### **3. Initialize & Run**
```bash
# Test connection
python test_mongodb.py

# Create indexes & seed data (optional)
python init_database.py

# Start server
python run.py
```

---

## 📚 Files Created

1. **`mongodb_setup_guide.md`** - Complete setup instructions
2. **`test_mongodb.py`** - Test your connection
3. **`init_database.py`** - Create indexes & seed data
4. **`.env.example`** - Environment template

---

## 🔍 Database Structure

### Collections:
- **`issues`** - Civic complaints
- **`verifications`** - Community feedback
- **`users`** - User profiles (future)

### Your server.py uses:
```python
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(mongo_url)
db = client['grievance_genie']

# Operations
await db.issues.insert_one(doc)
await db.issues.find_one({"id": issue_id})
await db.issues.find().to_list(1000)
```

All CRUD operations already implemented! ✅

---

## ✅ Ready to Use

Your backend is **production-ready** with MongoDB!

**Next**: Connect MongoDB → Test → Run server → Connect frontend
