
import React from 'react';

const MetricBox = ({ label, value, subtext }) => (
    <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', backgroundColor: '#F9FAFB', borderRadius: '0.375rem' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>{value}</div>
        <div style={{ fontSize: '0.75rem', color: '#4B5563' }}>{label}</div>
        {subtext && <div style={{ fontSize: '0.625rem', color: '#10B981' }}>{subtext}</div>}
    </div>
);

const WardStats = ({ wardName, stats, onViewFullStats, onMapClick }) => {
    return (
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>🗺️ {wardName} Dashboard</h3>
                <button 
                    onClick={onViewFullStats}
                    style={{ fontSize: '0.75rem', color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                >
                    View Full Stats →
                </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <MetricBox label="Issues" value={stats.totalIssues} subtext="This Month" />
                <MetricBox label="Fixed" value={stats.resolved} subtext={`${stats.resolutionRate}% Rate`} />
                <MetricBox label="Avg Time" value={stats.avgFixTime} />
            </div>

            {/* Mini Map Placeholder */}
            <div 
                onClick={onMapClick}
                style={{ 
                height: '100px', 
                backgroundColor: '#E5E7EB', 
                borderRadius: '0.375rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundImage: 'radial-gradient(circle at 20% 40%, rgba(239, 68, 68, 0.4) 4px, transparent 5px), radial-gradient(circle at 60% 70%, rgba(16, 185, 129, 0.4) 4px, transparent 5px), radial-gradient(circle at 80% 30%, rgba(16, 185, 129, 0.4) 4px, transparent 5px)',
                backgroundSize: '100% 100%',
                cursor: 'pointer',
                transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '600' }}>📈 View Ward Map & Stats</span>
            </div>
        </div>
    );
};

export default WardStats;
