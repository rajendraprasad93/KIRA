# GrievanceGenie - Backend API Contracts

## Overview
This document outlines the API contracts, data models, and integration points for the GrievanceGenie backend.

## Data Models

### 1. Issue Model
```python
{
  "id": "GG-2025-00123",  # Auto-generated
  "citizen_name": "Rajesh Kumar",
  "citizen_phone": "+91XXXXXXXXXX",
  "category": "drainage",  # water, drainage, roads, garbage, electricity, infrastructure, others
  "category_name": "Drainage / Sewage",
  "severity": "High",  # Low, Medium, High
  "description": "Issue description",
  "location": "MG Road, Ward 12",
  "coordinates": {
    "lat": 12.9716,
    "lng": 77.5946
  },
  "photos": ["url1", "url2"],  # File URLs
  "status": "verifying",  # reported, verifying, assigned, in_progress, resolved, unverified
  "department": "Water & Sanitation",
  "reported_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T11:00:00Z",
  "timeline": [
    {
      "status": "Reported",
      "date": "2025-01-15T10:30:00Z"
    }
  ]
}
```

### 2. Verification Model
```python
{
  "id": "auto-generated",
  "issue_id": "GG-2025-00123",
  "verifier_phone": "+91XXXXXXXXXX",
  "response": "yes",  # yes, no, not_sure
  "verified_at": "2025-01-15T11:30:00Z"
}
```

### 3. Officer Model (Simple)
```python
{
  "id": "auto-generated",
  "name": "Ramesh Kumar",
  "email": "ramesh.kumar@city.gov.in",
  "department": "Water & Sanitation",
  "password_hash": "hashed_password"
}
```

## API Endpoints

### Issue Management

#### POST /api/issues
Create new issue
**Request:**
```json
{
  "citizen_name": "Rajesh Kumar",
  "citizen_phone": "+91XXXXXXXXXX",
  "category": "drainage",
  "category_name": "Drainage / Sewage",
  "severity": "High",
  "description": "Issue description",
  "location": "MG Road, Ward 12",
  "coordinates": {
    "lat": 12.9716,
    "lng": 77.5946
  },
  "location_text": "MG Road area"
}
```
**Response:** Created issue object with ID

#### POST /api/issues/:issue_id/photos
Upload photos for an issue
**Request:** multipart/form-data with photo files
**Response:** Updated issue with photo URLs

#### GET /api/issues
Get all issues with optional filters
**Query params:** 
- status (optional)
- category (optional)
- verification (optional: all, verified, unverified)
**Response:** Array of issues

#### GET /api/issues/:issue_id
Get single issue details
**Response:** Issue object

#### PUT /api/issues/:issue_id/status
Update issue status (officer only)
**Request:**
```json
{
  "status": "in_progress",
  "notes": "Work started"
}
```
**Response:** Updated issue

### Verification Management

#### POST /api/verifications
Submit community verification
**Request:**
```json
{
  "issue_id": "GG-2025-00123",
  "response": "yes"
}
```
**Response:** Verification object

#### GET /api/issues/:issue_id/verifications
Get verification stats for an issue
**Response:**
```json
{
  "yes": 4,
  "no": 0,
  "not_sure": 1,
  "total": 5
}
```

### Statistics

#### GET /api/stats
Get dashboard statistics
**Response:**
```json
{
  "new_today": 2,
  "verifying": 1,
  "in_progress": 1,
  "resolved_this_week": 3,
  "unverified": 1
}
```

## Frontend Integration Points

### Mock Data to Replace

1. **mock.js** - Remove and replace with API calls:
   - `mockIssues` → GET /api/issues
   - `mockCategories` → Keep static (no API needed)
   - `getStats()` → GET /api/stats

2. **ReportIssuePage.jsx**:
   - handleSubmit() → POST /api/issues
   - Photo upload → POST /api/issues/:id/photos

3. **MyIssuesPage.jsx**:
   - Load issues → GET /api/issues

4. **IssueDetailPage.jsx**:
   - Load issue → GET /api/issues/:id
   - Load verifications → GET /api/issues/:id/verifications

5. **VerificationPage.jsx**:
   - Submit verification → POST /api/verifications

6. **OfficerDashboard.jsx**:
   - Load stats → GET /api/stats
   - Load issues → GET /api/issues

7. **OfficerIssueDetail.jsx**:
   - Update status → PUT /api/issues/:id/status
   - Save notes → PUT /api/issues/:id/status

## File Upload Strategy

- Store uploaded photos in `/app/backend/uploads/` directory
- Serve static files via FastAPI
- Return file URLs in format: `${BACKEND_URL}/uploads/filename.jpg`
- Frontend will display these URLs directly

## Implementation Notes

1. Generate issue IDs using format: GG-YYYY-NNNNN
2. Store timestamps in UTC
3. No authentication for MVP (can be added later)
4. Verifications tracked by issue_id aggregation
5. Timeline auto-updated when status changes
