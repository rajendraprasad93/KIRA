
import React, { useState, useEffect, useRef } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import StatsCards from '../components/Dashboard/StatsCards';
import ComplaintCard from '../components/Dashboard/ComplaintCard';
import WardStats from '../components/Dashboard/WardStats';
import Leaderboard from '../components/Dashboard/Leaderboard';
import BottomNav from '../components/common/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { data, loading, refreshData } = useDashboardData();
    const { logout, language, changeLanguage, toggleTheme, theme } = useAuth();
    const navigate = useNavigate();
    const [refreshing, setRefreshing] = useState(false);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const leaderboardRef = useRef(null);

    // Pull-to-refresh simulation
    const handleRefresh = () => {
        setRefreshing(true);
        refreshData();
        setTimeout(() => setRefreshing(false), 1500);
    };

    // Scroll to leaderboard section
    const scrollToLeaderboard = () => {
        leaderboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Handle logout
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }}>
                <div style={{ color: '#10B981', fontWeight: '600' }}>🔄 Loading your dashboard...</div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F3F4F6', paddingBottom: '80px' }}>
            {/* Header */}
            <header style={{ 
                background: 'linear-gradient(to right, #10B981, #059669)', 
                padding: '1.5rem', 
                paddingBottom: '3rem',
                color: 'white'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>👋 Welcome back, {data.user.name.split(' ')[0]}!</h1>
                        <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>{data.user.ward}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
                        {/* Theme Toggle */}
                        <button 
                            onClick={toggleTheme}
                            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', color: 'white', fontSize: '1rem' }}
                            title="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        {/* Profile/Logout */}
                        <button 
                            onClick={handleLogout}
                            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', color: 'white', fontSize: '1rem' }}
                            title="Logout"
                        >
                            🚪
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content - Overlapping Header */}
            <main style={{ padding: '0 1rem', marginTop: '-2rem' }}>
                <StatsCards 
                    user={data.user} 
                    stats={data.stats} 
                    onPointsClick={scrollToLeaderboard}
                    onRankClick={scrollToLeaderboard}
                    onIssuesClick={() => navigate('/my-complaints')}
                />

                {/* Report Button */}
                <button 
                    onClick={() => navigate('/report')}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        backgroundColor: '#10B981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        marginBottom: '1.5rem',
                        boxShadow: '0 4px 6px rgba(16, 185, 129, 0.4)',
                        cursor: 'pointer'
                    }}
                >
                    <span style={{ fontSize: '1.25rem' }}>➕</span> REPORT NEW ISSUE
                </button>

                {/* My Complaints */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0', color: '#374151' }}>📋 My Complaints ({data.stats.pending} Pending)</h3>
                        <button onClick={() => navigate('/my-complaints')} style={{ fontSize: '0.75rem', color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>View All</button>
                    </div>
                    
                    {data.recentComplaints.length > 0 ? (
                        data.recentComplaints.map(complaint => (
                            <ComplaintCard key={complaint.id} complaint={complaint} />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
                            <p style={{ color: '#6B7280' }}>No complaints yet. Great start!</p>
                        </div>
                    )}
                </div>

                <WardStats 
                    wardName={data.user.ward} 
                    stats={data.wardStats} 
                    onViewFullStats={() => navigate('/ward-portal')}
                    onMapClick={() => navigate('/ward-portal')}
                />

                <div ref={leaderboardRef}>
                    <Leaderboard 
                        list={data.leaderboard} 
                        onViewTop10={scrollToLeaderboard}
                    />
                </div>
            </main>

            <BottomNav />
        </div>
    );
};

export default Dashboard;
