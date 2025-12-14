
import { useState, useEffect } from 'react';

// Enhanced Mock Data with new analytics
const MOCK_DATA = {
  user: {
    name: "Rajesh Kumar",
    phone: "+919876543210",
    ward: "Ward 12",
    points: 85,
    rank: 3,
    totalUsersInWard: 127,
    badges: ["Early Reporter", "Community Leader", "Location Verifier"]
  },
  stats: {
    totalReported: 8,
    resolved: 7,
    pending: 2,
    avgResolutionTime: "2.1 days",
    satisfaction: 94,
    // NEW: Enhanced analytics
    criticalIssues: 1, // Issues > 1 week old
    highImpactIssues: 3, // Blocking traffic/pedestrians
    locationAccuracy: 95, // % with confirmed GPS
    responseTime: "4.2 hours" // Avg time to first response
  },
  wardStats: {
    totalIssues: 47,
    resolved: 43,
    resolutionRate: 91,
    avgFixTime: "2.1 days",
    // NEW: Area-wise breakdown
    areaBreakdown: {
      road_street: 18,
      footpath: 12,
      public_park: 8,
      residential_area: 6,
      commercial_area: 2,
      government_property: 1
    },
    // NEW: Duration-based priority
    durationStats: {
      today: 5,
      recent: 12, // 1-3 days
      moderate: 18, // 3-7 days  
      critical: 12 // > 1 week
    },
    // NEW: Impact analysis
    impactStats: {
      blockingTraffic: 8,
      blockingPedestrians: 15,
      causingBadSmell: 22,
      nearSchoolHospital: 6,
      publicVisibility: 41
    }
  },
  recentComplaints: [
    {
      id: "GG-00001",
      category: "Streetlight",
      status: "pending",
      daysAgo: 3,
      location: "Ashok Nagar",
      worker: "Ravi (Lineman)",
      thumbnail: "https://placehold.co/100x100?text=Streetlight",
      // NEW: Enhanced details
      affectedAreaType: "road_street",
      issueDuration: "3_7_days",
      priority: "high",
      impactFlags: ["blockingPedestrians", "openToPublicView"],
      confirmedLocation: {
        lat: 26.835900,
        lng: 75.815400,
        label: "Near Gandhi Nagar Bus Stop"
      }
    },
    {
      id: "GG-00002", 
      category: "Pothole",
      status: "in_progress",
      daysAgo: 1,
      location: "Main Road",
      worker: "Suresh (Road Maintenance)",
      thumbnail: "https://placehold.co/100x100?text=Pothole",
      // NEW: Enhanced details
      affectedAreaType: "road_street",
      issueDuration: "1_3_days",
      priority: "critical",
      impactFlags: ["blockingTraffic", "openToPublicView"],
      confirmedLocation: {
        lat: 26.841234,
        lng: 75.823456,
        label: "Main Road near City Mall"
      }
    },
    {
      id: "GG-00003",
      category: "Garbage",
      status: "resolved",
      daysAgo: 5,
      location: "Residential Colony",
      worker: "Completed",
      thumbnail: "https://placehold.co/100x100?text=Garbage",
      // NEW: Enhanced details
      affectedAreaType: "residential_area",
      issueDuration: "more_than_week",
      priority: "medium",
      impactFlags: ["causingBadSmell", "openToPublicView"],
      confirmedLocation: {
        lat: 26.829876,
        lng: 75.807654,
        label: "Shanti Nagar Colony Gate"
      }
    }
  ],
  leaderboard: [
    { rank: 1, name: "Rajesh Kumar", points: 85, isUser: true, badges: 3 },
    { rank: 2, name: "Priya Sharma", points: 72, isUser: false, badges: 2 },
    { rank: 3, name: "Amit Patel", points: 68, isUser: false, badges: 1 }
  ]
};

export const useDashboardData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = () => {
        setLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setData(MOCK_DATA);
            setLoading(false);
        }, 1500);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refreshData = () => {
        fetchData();
    };

    return { data, loading, error, refreshData };
};
