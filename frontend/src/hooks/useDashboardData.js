
import { useState, useEffect } from 'react';

// Mock Data
const MOCK_DATA = {
  user: {
    name: "Rajesh Kumar",
    phone: "+919876543210",
    ward: "Ward 12",
    points: 85,
    rank: 3,
    totalUsersInWard: 127,
    badges: ["Early Reporter", "Community Leader"]
  },
  stats: {
    totalReported: 8,
    resolved: 7,
    pending: 2,
    avgResolutionTime: "2.1 days",
    satisfaction: 94
  },
  wardStats: {
    totalIssues: 47,
    resolved: 43,
    resolutionRate: 91,
    avgFixTime: "2.1 days"
  },
  recentComplaints: [
    {
      id: "GG-00001",
      category: "Streetlight",
      status: "pending",
      daysAgo: 3,
      location: "Ashok Nagar",
      worker: "Ravi (Lineman)",
      thumbnail: "https://placehold.co/100x100?text=Streetlight"
    },
    {
      id: "GG-00002",
      category: "Pothole",
      status: "in_progress",
      daysAgo: 1,
      location: "Main Road",
      worker: "Unassigned",
      thumbnail: "https://placehold.co/100x100?text=Pothole"
    }
  ],
  leaderboard: [
    { rank: 1, name: "Rajesh Kumar", points: 85, isUser: true },
    { rank: 2, name: "Priya Sharma", points: 72, isUser: false },
    { rank: 3, name: "Amit Patel", points: 68, isUser: false }
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
