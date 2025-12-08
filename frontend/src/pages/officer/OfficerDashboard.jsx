import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, TrendingUp, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { mockIssues, mockCategories, getStats } from '../../data/mock';
import MapComponent from '../../components/MapComponent';
import IssueCard from '../../components/IssueCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

const OfficerDashboard = () => {
  const navigate = useNavigate();
  const stats = getStats();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterVerification, setFilterVerification] = useState('all');

  const filteredIssues = mockIssues.filter(issue => {
    const statusMatch = filterStatus === 'all' || issue.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || issue.category === filterCategory;
    let verificationMatch = true;
    if (filterVerification === 'verified') {
      verificationMatch = issue.verifications.yes >= 3;
    } else if (filterVerification === 'unverified') {
      verificationMatch = issue.verifications.yes < 3;
    }
    return statusMatch && categoryMatch && verificationMatch;
  });

  // Prepare map markers
  const mapMarkers = mockIssues.map(issue => ({
    lat: issue.coordinates.lat,
    lng: issue.coordinates.lng,
    title: issue.id,
    description: issue.categoryName
  }));

  const statCards = [
    { 
      title: 'New Today', 
      value: stats.newToday, 
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'var(--primary)'
    },
    { 
      title: 'In Verification', 
      value: stats.verifying, 
      icon: <Clock className="w-6 h-6" />,
      color: 'var(--warning)'
    },
    { 
      title: 'In Progress', 
      value: stats.inProgress, 
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'var(--accent)'
    },
    { 
      title: 'Resolved This Week', 
      value: stats.resolvedThisWeek, 
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: 'var(--success)'
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-surface)', minHeight: '100vh' }}>
      {/* Header */}
      <header 
        className="py-4 px-6 shadow-sm"
        style={{ backgroundColor: 'var(--bg-white)' }}
      >
        <div className="container flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
              Water & Sanitation Department
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Officer Dashboard
            </p>
          </div>
          <button
            onClick={() => navigate('/officer/login')}
            className="btn-secondary flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, idx) => (
            <div key={idx} className="card">
              <div className="flex items-center justify-between mb-2">
                <div style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stat.value}
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {stat.title}
              </p>
            </div>
          ))}
        </div>

        {/* Hotspot Map */}
        <div className="card mb-8">
          <h3 className="mb-4" style={{ color: 'var(--text-primary)' }}>Issue Hotspot Map</h3>
          <div className="h-96">
            <MapComponent 
              position={{ lat: 12.9716, lng: 77.5946 }} 
              zoom={12}
              markers={mapMarkers}
              height="100%"
            />
          </div>
          <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
            Click on markers to see issue details. Red clusters indicate high-severity verified issues.
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <h3 className="mb-4" style={{ color: 'var(--text-primary)' }}>Filter Issues</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Status
              </label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="verifying">Verifying</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Category
              </label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {mockCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Verification
              </label>
              <Select value={filterVerification} onValueChange={setFilterVerification}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Needs Verification</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {filteredIssues.length} Issue{filteredIssues.length !== 1 ? 's' : ''}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredIssues.map(issue => (
            <IssueCard 
              key={issue.id} 
              issue={issue}
              onClick={() => navigate(`/officer/issue/${issue.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;