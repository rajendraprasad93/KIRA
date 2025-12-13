// Mock complaint data for Phase 4: My Complaints Screen

export const mockComplaints = [
    {
        id: "GG-00001",
        category: "Streetlight",
        status: "in_progress",
        location: "Ashok Nagar, Ward 12",
        gps: { lat: 12.9234, lng: 77.5678 },
        daysAgo: 3,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Streetlight not working since last week",
        severity: "medium",
        worker: {
            name: "Ravi Kumar",
            phone: "+919876543210",
            role: "Lineman",
            status: "en_route",
            eta: "30 min"
        },
        photos: {
            before: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=400",
            after: null
        },
        timeline: [
            {
                id: 1,
                time: "2:45 PM",
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                status: "reported",
                title: "REPORTED",
                description: "Rajesh uploaded photo (AI: Streetlight)",
                icon: "📱",
                color: "#EF4444",
                actor: "Rajesh (Citizen)"
            },
            {
                id: 2,
                time: "2:47 PM",
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000).toISOString(),
                status: "routed",
                title: "ROUTED",
                description: "Electricity Dept confirmed (AI routing)",
                icon: "⚡",
                color: "#10B981",
                actor: "System"
            },
            {
                id: 3,
                time: "2:50 PM",
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
                status: "assigned",
                title: "ASSIGNED",
                description: "Senior Engineer assigned to Ravi",
                icon: "👷",
                color: "#F59E0B",
                actor: "Sr. Engineer Sharma"
            },
            {
                id: 4,
                time: "2:52 PM",
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 7 * 60 * 1000).toISOString(),
                status: "in_progress",
                title: "EN ROUTE",
                description: "Ravi en route to location (GPS tracking active)",
                icon: "🚗",
                color: "#F59E0B",
                actor: "Ravi Kumar"
            }
        ],
        aiVerification: null,
        rating: null
    },
    {
        id: "GG-00002",
        category: "Pothole",
        status: "resolved",
        location: "Main Road, Sector 5",
        gps: { lat: 12.9345, lng: 77.5789 },
        daysAgo: 0,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        description: "Large pothole causing traffic issues",
        severity: "high",
        worker: {
            name: "Ravi Kumar",
            phone: "+919876543210",
            role: "Road Worker",
            status: "completed",
            eta: null
        },
        photos: {
            before: "https://images.unsplash.com/photo-1625806786037-2af608423424?w=400",
            after: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400"
        },
        timeline: [
            {
                id: 1,
                time: "9:15 AM",
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                status: "reported",
                title: "REPORTED",
                description: "Citizen uploaded photo (AI: Pothole)",
                icon: "📱",
                color: "#EF4444",
                actor: "Rajesh (Citizen)"
            },
            {
                id: 2,
                time: "9:20 AM",
                timestamp: new Date(Date.now() - 4.9 * 60 * 60 * 1000).toISOString(),
                status: "verified",
                title: "VERIFIED",
                description: "8 neighbors verified issue",
                icon: "✅",
                color: "#10B981",
                actor: "Community"
            },
            {
                id: 3,
                time: "9:30 AM",
                timestamp: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString(),
                status: "assigned",
                title: "ASSIGNED",
                description: "Assigned to Ravi (Road Worker)",
                icon: "👷",
                color: "#F59E0B",
                actor: "PWD Officer"
            },
            {
                id: 4,
                time: "10:00 AM",
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                status: "in_progress",
                title: "WORK IN PROGRESS",
                description: "Ravi arrived at site (GPS logged)",
                icon: "🔧",
                color: "#F59E0B",
                actor: "Ravi Kumar"
            },
            {
                id: 5,
                time: "11:15 AM",
                timestamp: new Date(Date.now() - 2.75 * 60 * 60 * 1000).toISOString(),
                status: "resolved",
                title: "RESOLVED",
                description: "Ravi uploaded after photo (AI verified)",
                icon: "✅",
                color: "#10B981",
                actor: "Ravi Kumar"
            }
        ],
        aiVerification: {
            valid: true,
            confidence: 0.98,
            sameLocation: true,
            samePothole: true,
            fixed: true
        },
        rating: null,
        resolutionTime: "2 hours",
        avgResolutionTime: "14 days"
    },
    {
        id: "GG-00003",
        category: "Garbage",
        status: "pending",
        location: "Green Park Colony",
        gps: { lat: 12.9456, lng: 77.5890 },
        daysAgo: 1,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Overflowing garbage bin not collected for 3 days",
        severity: "high",
        worker: null,
        photos: {
            before: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400",
            after: null
        },
        timeline: [
            {
                id: 1,
                time: "Yesterday 3:30 PM",
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                status: "reported",
                title: "REPORTED",
                description: "Photo uploaded (AI: Garbage overflow)",
                icon: "📱",
                color: "#EF4444",
                actor: "Rajesh (Citizen)"
            },
            {
                id: 2,
                time: "Yesterday 3:35 PM",
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
                status: "pending",
                title: "AWAITING VERIFICATION",
                description: "Needs 5 more neighbor verifications",
                icon: "⏳",
                color: "#F59E0B",
                actor: "System"
            }
        ],
        aiVerification: null,
        rating: null,
        verificationProgress: { current: 3, required: 8 }
    },
    {
        id: "GG-00004",
        category: "Water Supply",
        status: "resolved",
        location: "MG Road Junction",
        gps: { lat: 12.9567, lng: 77.5901 },
        daysAgo: 7,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Leaking water pipe wasting water",
        severity: "high",
        worker: {
            name: "Kumar Swamy",
            phone: "+919123456789",
            role: "Plumber",
            status: "completed",
            eta: null
        },
        photos: {
            before: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400",
            after: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400"
        },
        timeline: [
            {
                id: 1,
                time: "7 days ago",
                timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: "reported",
                title: "REPORTED",
                description: "Water leak reported with photo",
                icon: "📱",
                color: "#EF4444",
                actor: "Rajesh (Citizen)"
            },
            {
                id: 2,
                time: "6 days ago",
                timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                status: "assigned",
                title: "ASSIGNED",
                description: "Kumar Swamy assigned to fix leak",
                icon: "👷",
                color: "#F59E0B",
                actor: "Water Dept"
            },
            {
                id: 3,
                time: "5 days ago",
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                status: "resolved",
                title: "RESOLVED",
                description: "Pipe repaired and tested",
                icon: "✅",
                color: "#10B981",
                actor: "Kumar Swamy"
            }
        ],
        aiVerification: { valid: true, confidence: 0.95 },
        rating: {
            overall: 5,
            speed: 4,
            quality: 5,
            communication: 5,
            feedback: ["Quick response", "Professional", "Perfect fix"],
            submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        }
    },
    {
        id: "GG-00005",
        category: "Drainage",
        status: "closed",
        location: "Park Avenue",
        gps: { lat: 12.9678, lng: 77.6012 },
        daysAgo: 30,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Blocked drain causing water logging",
        severity: "medium",
        worker: null,
        photos: {
            before: "https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=400",
            after: null
        },
        timeline: [
            {
                id: 1,
                time: "30 days ago",
                timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                status: "reported",
                title: "REPORTED",
                description: "Drainage issue reported",
                icon: "📱",
                color: "#EF4444",
                actor: "Rajesh (Citizen)"
            },
            {
                id: 2,
                time: "15 days ago",
                timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                status: "closed",
                title: "CLOSED",
                description: "Auto-closed due to no verification",
                icon: "⚠️",
                color: "#6B7280",
                actor: "System"
            }
        ],
        aiVerification: null,
        rating: null
    }
];

export const nearbyVerifications = [
    {
        id: "GG-00045",
        category: "Drainage",
        description: "Drainage overflow on street",
        location: "Kathakali Nagar",
        distance: "200m",
        gps: { lat: 12.9240, lng: 77.5680 },
        photo: "https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=400",
        verifications: { current: 3, required: 8 },
        points: 15
    },
    {
        id: "GG-00046",
        category: "Streetlight",
        description: "Multiple street lights not working",
        location: "Temple Street",
        distance: "450m",
        gps: { lat: 12.9250, lng: 77.5685 },
        photo: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=400",
        verifications: { current: 5, required: 8 },
        points: 15
    }
];

// Helper to get complaints by status
export const getComplaintsByStatus = (status) => {
    if (status === 'all') return mockComplaints;
    return mockComplaints.filter(c => c.status === status);
};

// Count by status
export const getComplaintCounts = () => {
    return {
        all: mockComplaints.length,
        pending: mockComplaints.filter(c => c.status === 'pending').length,
        in_progress: mockComplaints.filter(c => c.status === 'in_progress').length,
        resolved: mockComplaints.filter(c => c.status === 'resolved').length,
        closed: mockComplaints.filter(c => c.status === 'closed').length
    };
};
