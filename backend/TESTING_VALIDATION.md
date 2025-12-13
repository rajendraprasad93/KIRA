# Testing Image Validation - Quick Guide

## Current Status

Your validation IS working! Here's what each result means:

```javascript
{
  ai_score: 0,        // 0% = NOT AI-generated ✅ (means it's REAL)
  confidence: 0.85,   // 85% confident it's authentic
  has_gps: false,     // No GPS data in image
  warnings: ['LOCATION_NOT_AVAILABLE']  // Warning: no GPS
}
```

## What Each Score Means

### AI Score (ai_generated_score)
- **0.0 - 0.2** = Real photo ✅
- **0.2 - 0.5** = Uncertain 
- **0.5 - 0.8** = Likely AI-generated ⚠️
- **0.8 - 1.0** = AI-generated (REJECTED) ❌

### Confidence Score
- Starts at 1.0 (100%)
- Deductions for warnings:
  - No GPS: -15%
  - AI-generated: -100%
  - Duplicate: -70%
  - Location mismatch: varies

## Test Different Images

### 1. Real Photo from Camera
**Expected:**
```javascript
{
  ai_score: 0.0 - 0.15,
  confidence: 0.90+,
  has_gps: true,
  status: "accepted"
}
```

### 2. Screenshot (No GPS)
**Expected:**
```javascript
{
  ai_score: 0.0 - 0.15,
  confidence: 0.85,  // Lower due to no GPS
  has_gps: false,
  warnings: ['LOCATION_NOT_AVAILABLE'],
  status: "accepted"
}
```

### 3. AI-Generated Image
**Upload from DALL-E, Midjourney, etc.**

**Expected:**
```javascript
{
  ai_score: 0.80+,  // High AI score!
  confidence: 0.0 - 0.2,
  status: "rejected",
  reason_codes: ['AI_GENERATED']
}
```

### 4. Duplicate Image
**Upload same image twice (after first issue is resolved)**

**Expected:**
```javascript
{
  ai_score: 0.0 - 0.15,
  status: "rejected",
  reason_codes: ['RESUBMITTED_IMAGE']
}
```

## Check Backend Logs

**Restart your backend and watch the terminal:**

```bash
cd backend
python run.py
```

**When you upload an image, you should see:**

```
🔍 Calling Sightengine API...
    API User: 1664177876
   Image: C:\Users\rajad\KIRA\backend\uploads\temp_abc123.jpg

✅ Sightengine Response:
   AI Probability: 15.20%
   Threshold: 80.00%
   Is AI Generated: False
```

**If Sightengine is NOT configured:**
```
⚠️  WARNING: Sightengine API not configured!
   SIGHTENGINE_API_USER: None
   SIGHTENGINE_API_SECRET: None
```

## Troubleshooting

### If ai_score is always 0:

**Check 1:** Backend logs
- Look for "🔍 Calling Sightengine API..."
- If you see "⚠️ WARNING: Sightengine API not configured" → Check `.env` file

**Check 2:** Verify `.env` file
```bash
# Should have:
SIGHTENGINE_API_USER=1664177876
SIGHTENGINE_API_SECRET=eJKEKu2X4d4GfmAMwRortJBBWs4kWo7w
```

**Check 3:** Restart backend
```bash
# After editing .env, always restart:
python run.py
```

**Check 4:** Test API manually
```python
import requests

response = requests.post(
    'https://api.sightengine.com/1.0/check.json',
    files={'media': open('test.jpg', 'rb')},
    data={
        'api_user': '1664177876',
        'api_secret': 'eJKEKu2X4d4GfmAMwRortJBBWs4kWo7w',
        'models': 'genai'
    }
)
print(response.json())
```

### If validation passes but shouldn't:

- Check `AI_GENERATION_THRESHOLD` in `.env` (default: 0.8)
- Lower it to test: `AI_GENERATION_THRESHOLD=0.5`

### If getting API errors:

- Check Sightengine account status
- Verify API credits/quota
- Check internet connection

## Quick Test Workflow

1. **Start backend:**
   ```bash
   python run.py
   ```

2. **Upload real photo**
   - Should show low AI score (< 0.2)
   - Status: Accepted

3. **Upload AI image** (from DALL-E)
   - Should show high AI score (> 0.8)
   - Status: Rejected

4. **Check backend terminal**
   - Should see "🔍 Calling Sightengine API..."
   - Should see "✅ Sightengine Response: AI Probability: XX%"

## Next Steps

1. Upload different image types
2. Watch backend terminal logs
3. Verify Sightengine is being called
4. If AI score stays 0, share backend logs
