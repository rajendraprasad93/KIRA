// Mock Ward Data for Ward Portal (Ashok Nagar - Ward 12)

export const mockWardData = {
    ward: {
        id: "12",
        name: "Ashok Nagar",
        rank: 3,
        totalWards: 25,
        performance: {
            resolutionRate: 91,
            avgFixDays: 2.1,
            satisfaction: 94
        }
    },
    stats: {
        totalIssues: 47,
        resolved: 43,
        avgFixTime: "2.1 days",
        todayNew: 3,
        todayResolved: 5,
        pending: 4,
        inProgress: 0
    },
    mapPins: [
        // Open Issues (Red)
        { id: "GG-00001", lat: 12.9234, lng: 77.5678, status: "open", category: "streetlight", title: "Broken streetlight" },
        { id: "GG-00003", lat: 12.9245, lng: 77.5690, status: "open", category: "garbage", title: "Overflowing bin" },
        { id: "GG-00007", lat: 12.9210, lng: 77.5650, status: "open", category: "pothole", title: "Large pothole" },
        
        // In Progress (Yellow)
        { id: "GG-00002", lat: 12.9240, lng: 77.5680, status: "in_progress", category: "pothole", title: "Road repair ongoing" },
        { id: "GG-00005", lat: 12.9250, lng: 77.5695, status: "in_progress", category: "drainage", title: "Drain cleaning" },
        
        // Resolved (Green)
        { id: "GG-00004", lat: 12.9220, lng: 77.5660, status: "resolved", category: "drainage", title: "Fixed drain" },
        { id: "GG-00006", lat: 12.9230, lng: 77.5670, status: "resolved", category: "streetlight", title: "Replaced bulb" },
        { id: "GG-00008", lat: 12.9255, lng: 77.5685, status: "resolved", category: "pothole", title: "Filled pothole" },
        { id: "GG-00009", lat: 12.9215, lng: 77.5655, status: "resolved", category: "garbage", title: "Cleared waste" },
        { id: "GG-00010", lat: 12.9235, lng: 77.5675, status: "resolved", category: "streetlight", title: "Fixed wiring" },
        { id: "GG-00011", lat: 12.9242, lng: 77.5682, status: "resolved", category: "drainage", title: "Unblocked drain" },
    ],
    trends: [
        { 
            category: "Streetlight", 
            total: 12, 
            resolved: 12, 
            rate: 100, 
            color: "#10B981",
            icon: "💡",
            avgDays: 1.5 
        },
        { 
            category: "Drainage", 
            total: 15, 
            resolved: 14, 
            rate: 93, 
            color: "#3B82F6",
            icon: "🌊",
            avgDays: 2.0 
        },
        { 
            category: "Pothole", 
            total: 12, 
            resolved: 11, 
            rate: 92, 
            color: "#F59E0B",
            icon: "🚧",
            avgDays: 2.5 
        },
        { 
            category: "Garbage", 
            total: 8, 
            resolved: 6, 
            rate: 75, 
            color: "#EF4444",
            icon: "🗑️",
            avgDays: 3.2 
        }
    ],
    activeVotes: [
        { 
            id: "GG-00045", 
            title: "Main Road Pothole (School Zone)", 
            location: "MG Road near St. Mary's School",
            votes: { 
                urgent: 65, 
                normal: 28, 
                low: 7 
            },
            totalVotes: 100,
            daysAgo: 2
        },
        { 
            id: "GG-00046", 
            title: "Street Light Cluster (Park Area)", 
            location: "Green Park, 5th Cross",
            votes: { 
                urgent: 42, 
                normal: 35, 
                low: 8 
            },
            totalVotes: 85,
            daysAgo: 1
        }
    ],
    achievements: [
        { 
            id: 1,
            title: "🥇 Cleanest Ward Dec 2024", 
            description: "All garbage issues resolved <48h",
            date: "Dec 2024",
            badge: "🏆"
        },
        { 
            id: 2,
            title: "⚡ Lightning Fixes", 
            description: "91% resolved <3 days vs city avg 14d",
            date: "This Month",
            badge: "⚡"
        },
        { 
            id: 3,
            title: "🌟 100% Streetlight Success", 
            description: "Perfect record on lighting issues",
            date: "Nov 2024",
            badge: "💡"
        },
        { 
            id: 4,
            title: "👥 Community Champions", 
            description: "Highest citizen participation (450+ active)",
            date: "This Quarter",
            badge: "👥"
        }
    ],
    topContributors: [
        { name: "Rajesh Kumar", points: 450, issues: 12, rank: 1 },
        { name: "Priya Sharma", points: 380, issues: 10, rank: 2 },
        { name: "Amit Patel", points: 320, issues: 8, rank: 3 }
    ],
    comparisonData: {
        wardRank: 3,
        totalWards: 25,
        betterThan: 88, // Better than 88% of wards
        improvements: [
            { metric: "Resolution Rate", value: 91, cityAvg: 72, rank: 3 },
            { metric: "Avg Fix Time", value: 2.1, cityAvg: 14, rank: 2 },
            { metric: "Satisfaction", value: 94, cityAvg: 78, rank: 5 }
        ]
    }
};

// Helper functions
export const getMapPinsByFilter = (filter) => {
    if (filter === 'all') return mockWardData.mapPins;
    return mockWardData.mapPins.filter(pin => pin.category === filter);
};

export const getMapPinsByStatus = (status) => {
    if (status === 'all') return mockWardData.mapPins;
    return mockWardData.mapPins.filter(pin => pin.status === status);
};

export default mockWardData;
