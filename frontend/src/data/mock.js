// Mock data for GrievanceGenie

export const mockCategories = [
  { id: 'water', name: 'Water Supply' },
  { id: 'drainage', name: 'Drainage / Sewage' },
  { id: 'roads', name: 'Roads / Potholes' },
  { id: 'garbage', name: 'Garbage & Sanitation' },
  { id: 'electricity', name: 'Street Light / Electricity' },
  { id: 'infrastructure', name: 'Public Infrastructure' },
  { id: 'others', name: 'Others' }
];

export const mockIssues = [
  {
    id: 'GG-2025-00123',
    citizenName: 'Rajesh Kumar',
    source: 'official', // official, social_media
    evidenceScore: 85, // 0-100
    isPublicIssue: true,
    category: 'drainage',
    categoryName: 'Drainage / Sewage',
    severity: 'High',
    description: 'There is drainage water leaking on the main road near the market for the last 3 days. The smell is unbearable and water is spreading across the road.',
    location: 'MG Road, Ward 12, Near City Market',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    photos: [
      'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400',
      'https://images.unsplash.com/photo-1582578598774-a377d4b32223?w=400'
    ],
    status: 'verifying',
    assignedWorkerId: null,
    reportedAt: new Date('2025-01-15T10:30:00'),
    verifications: {
      yes: 4,
      no: 0,
      notSure: 1,
      total: 5
    },
    department: 'Water & Sanitation',
    timeline: [
      { status: 'Reported', date: new Date('2025-01-15T10:30:00') },
      { status: 'Being verified', date: new Date('2025-01-15T11:00:00') }
    ]
  },
  {
    id: 'GG-2025-00122',
    citizenName: 'Priya Sharma',
    source: 'official',
    evidenceScore: 92,
    isPublicIssue: true,
    category: 'roads',
    categoryName: 'Roads / Potholes',
    severity: 'Medium',
    description: 'Large pothole on the main road causing traffic problems. Two-wheelers are at risk of accidents.',
    location: 'Brigade Road, Ward 8',
    coordinates: { lat: 12.9698, lng: 77.6024 },
    photos: [
      'https://images.unsplash.com/photo-1580644767589-e62fa2e1b626?w=400'
    ],
    status: 'in_progress',
    assignedWorkerId: 'w-002',
    reportedAt: new Date('2025-01-14T14:20:00'),
    verifications: {
      yes: 5,
      no: 0,
      notSure: 0,
      total: 5
    },
    department: 'Roads & Infrastructure',
    timeline: [
      { status: 'Reported', date: new Date('2025-01-14T14:20:00') },
      { status: 'Verified', date: new Date('2025-01-14T15:00:00') },
      { status: 'Assigned', date: new Date('2025-01-14T16:30:00') },
      { status: 'In Progress', date: new Date('2025-01-15T09:00:00') }
    ]
  },
  {
    id: 'GG-2025-00121',
    citizenName: 'Mohammed Ali',
    source: 'official',
    evidenceScore: 75,
    isPublicIssue: true,
    category: 'garbage',
    categoryName: 'Garbage & Sanitation',
    severity: 'High',
    description: 'Garbage has not been collected for 5 days. Pile is growing and attracting stray animals.',
    location: 'Jayanagar 4th Block',
    coordinates: { lat: 12.9250, lng: 77.5937 },
    photos: [],
    status: 'resolved',
    reportedAt: new Date('2025-01-10T08:15:00'),
    verifications: {
      yes: 3,
      no: 0,
      notSure: 0,
      total: 3
    },
    department: 'Sanitation',
    timeline: [
      { status: 'Reported', date: new Date('2025-01-10T08:15:00') },
      { status: 'Verified', date: new Date('2025-01-10T09:00:00') },
      { status: 'Assigned', date: new Date('2025-01-10T10:30:00') },
      { status: 'In Progress', date: new Date('2025-01-11T08:00:00') },
      { status: 'Resolved', date: new Date('2025-01-12T16:00:00') }
    ]
  },
  {
    id: 'GG-2025-00120',
    citizenName: 'Lakshmi Devi',
    category: 'electricity',
    categoryName: 'Street Light / Electricity',
    severity: 'Medium',
    description: 'Street lights not working in the area for past week. Safety concern during night.',
    location: 'Indiranagar 2nd Stage',
    coordinates: { lat: 12.9784, lng: 77.6408 },
    photos: [],
    status: 'assigned',
    reportedAt: new Date('2025-01-13T19:30:00'),
    verifications: {
      yes: 4,
      no: 0,
      notSure: 0,
      total: 4
    },
    department: 'Electricity',
    timeline: [
      { status: 'Reported', date: new Date('2025-01-13T19:30:00') },
      { status: 'Verified', date: new Date('2025-01-13T20:00:00') },
      { status: 'Assigned', date: new Date('2025-01-14T10:00:00') }
    ]
  },
  {
    id: 'GG-2025-00119',
    citizenName: 'Suresh Patel',
    category: 'water',
    categoryName: 'Water Supply',
    severity: 'High',
    description: 'No water supply for 2 days in the entire area. Residents facing severe problems.',
    location: 'Whitefield, Zone 3',
    coordinates: { lat: 12.9698, lng: 77.7499 },
    photos: [],
    status: 'reported',
    reportedAt: new Date('2025-01-15T06:00:00'),
    verifications: {
      yes: 0,
      no: 0,
      notSure: 0,
      total: 0
    },
    department: 'Water Supply',
    timeline: [
      { status: 'Reported', date: new Date('2025-01-15T06:00:00') }
    ]
  }
];

export const mockDepartments = [
  'Water Supply',
  'Water & Sanitation',
  'Roads & Infrastructure',
  'Sanitation',
  'Electricity',
  'Public Works'
];

export const mockOfficers = [
  {
    id: 'off-001',
    name: 'Ramesh Kumar',
    department: 'Water & Sanitation',
    email: 'ramesh.kumar@city.gov.in'
  },
  {
    id: 'off-002',
    name: 'Sunita Singh',
    department: 'Roads & Infrastructure',
    email: 'sunita.singh@city.gov.in'
  }
];

export const mockWorkers = [
  {
    id: 'w-001',
    name: 'Raju Mechanic',
    department: 'Water & Sanitation',
    status: 'available', // available, busy, off_duty
    currentTask: null,
    phone: '+919876543210'
  },
  {
    id: 'w-002',
    name: 'Road Repair Team A',
    department: 'Roads & Infrastructure',
    status: 'busy',
    currentTask: 'GG-2025-00122',
    phone: '+919876543211'
  },
  {
    id: 'w-003',
    name: 'Sanitation Squad 4',
    department: 'Sanitation',
    status: 'available',
    currentTask: null,
    phone: '+919876543212'
  }
];

export const mockSocialPosts = [
  {
    id: 'soc-001',
    platform: 'twitter',
    username: '@bangalore_citizen',
    content: 'Huge water logging near Sony Signal, Koramangala. Traffic is completely stalled. #BangaloreRains',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
    timestamp: '2 hours ago',
    predictedCategory: 'drainage',
    predictedLocation: 'Sony Signal, Koramangala',
    confidence: 0.92,
    status: 'candidate' // candidate, verified, ignored
  },
  {
    id: 'soc-002',
    platform: 'instagram',
    username: 'city_watcher',
    content: 'Garbage pile up in HSR Sector 2 is getting out of hand.',
    imageUrl: 'https://images.unsplash.com/photo-1530587198088-9409aff43d4c?w=400',
    timestamp: '5 hours ago',
    predictedCategory: 'garbage',
    predictedLocation: 'HSR Layout, Sector 2',
    confidence: 0.88,
    status: 'candidate'
  }
];

// Helper to calculate Crowd Score
export const getCrowdScore = (verifications) => {
  return (verifications.yes * 2) - verifications.no;
};

// Helper function to get issues by citizen (mock)
export const getIssuesByCitizen = (citizenName) => {
  return mockIssues.filter(issue => issue.citizenName === citizenName);
};

// Helper function to get issues by status
export const getIssuesByStatus = (status) => {
  return mockIssues.filter(issue => issue.status === status);
};

// Helper function to get stats
export const getStats = () => {
  return {
    newToday: mockIssues.filter(i => {
      const today = new Date();
      return i.reportedAt.toDateString() === today.toDateString();
    }).length,
    verifying: mockIssues.filter(i => i.status === 'verifying').length,
    inProgress: mockIssues.filter(i => i.status === 'in_progress').length,
    resolvedThisWeek: mockIssues.filter(i => {
      if (i.status !== 'resolved') return false;
      const lastTimeline = i.timeline[i.timeline.length - 1];
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lastTimeline.date >= weekAgo;
    }).length,
    unverified: mockIssues.filter(i => i.verifications.total === 0).length
  };
};

// Helper function to register a new officer
export const registerOfficer = (officerData) => {
  const newOfficer = {
    id: `off-${String(mockOfficers.length + 1).padStart(3, '0')}`,
    ...officerData
  };
  mockOfficers.push(newOfficer);
  return newOfficer;
};

// Helper function to login an officer
export const loginOfficer = (email, password) => {
  // In a real app, we would verify password. Here just check email existence for demo.
  // For 'demo' purposes, let's treat any non-empty password as valid if email doesn't exist yet, 
  // or match email if it does.
  const officer = mockOfficers.find(o => o.email === email);
  if (officer) return officer;
  return null;
};