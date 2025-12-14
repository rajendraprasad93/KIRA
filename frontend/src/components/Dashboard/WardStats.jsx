
import React from 'react';

const MetricBox = ({ label, value, subtext }) => (
    <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', backgroundColor: '#F9FAFB', borderRadius: '0.375rem' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>{value}</div>
        <div style={{ fontSize: '0.75rem', color: '#4B5563' }}>{label}</div>
        {subtext && <div style={{ fontSize: '0.625rem', color: '#10B981' }}>{subtext}</div>}
    </div>
);

const WardStats = ({ wardName, stats, onViewFullStats, onMapClick }) => {
    // Helper function for area breakdown
    const getAreaIcon = (type) => {
        const icons = {
            'road_street': '🛣️',
            'footpath': '🚶',
            'public_park': '🌳',
            'residential_area': '🏠',
            'commercial_area': '🏪',
            'government_property': '🏛️'
        };
        return icons[type] || '📋';
    };

    const getAreaName = (type) => {
        const names = {
            'road_street': 'Roads',
            'footpath': 'Footpaths',
            'public_park': 'Parks',
            'residential_area': 'Residential',
            'commercial_area': 'Commercial',
            'government_property': 'Government'
        };
        return names[type] || 'Other';
    };

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>🗺️ {wardName} Analytics</h3>
                <button 
                    onClick={onViewFullStats}
                    style={{ fontSize: '0.75rem', color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                >
                    View Full Stats →
                </button>
            </div>

            {/* Primary Stats */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <MetricBox label="Total Issues" value={stats.totalIssues} subtext="This Month" />
                <MetricBox label="Resolved" value={stats.resolved} subtext={`${stats.resolutionRate}% Rate`} />
                <MetricBox label="Avg Fix Time" value={stats.avgFixTime} />
            </div>

            {/* Duration-based Priority Analysis */}
            {stats.durationStats && (
                <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                        ⏰ Issue Age Distribution
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.25rem' }}>
                        <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#ECFDF5', borderRadius: '0.25rem' }}>
                            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#059669' }}>{stats.durationStats.today}</div>
                            <div style={{ fontSize: '0.625rem', color: '#047857' }}>Today</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#FFFBEB', borderRadius: '0.25rem' }}>
                            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#D97706' }}>{stats.durationStats.recent}</div>
                            <div style={{ fontSize: '0.625rem', color: '#92400E' }}>1-3 Days</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#FEF2F2', borderRadius: '0.25rem' }}>
                            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#DC2626' }}>{stats.durationStats.moderate}</div>
                            <div style={{ fontSize: '0.625rem', color: '#991B1B' }}>3-7 Days</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#7F1D1D20', borderRadius: '0.25rem' }}>
                            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#7F1D1D' }}>{stats.durationStats.critical}</div>
                            <div style={{ fontSize: '0.625rem', color: '#7F1D1D' }}>Critical</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Area-wise Breakdown */}
            {stats.areaBreakdown && (
                <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                        🏷️ Issues by Area Type
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.25rem' }}>
                        {Object.entries(stats.areaBreakdown).map(([type, count]) => (
                            <div key={type} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.25rem',
                                padding: '0.375rem',
                                backgroundColor: '#F9FAFB',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem'
                            }}>
                                <span>{getAreaIcon(type)}</span>
                                <span style={{ fontWeight: '600', color: '#111827' }}>{count}</span>
                                <span style={{ color: '#6B7280', fontSize: '0.625rem' }}>{getAreaName(type)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Impact Analysis */}
            {stats.impactStats && (
                <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                        ⚠️ High Impact Issues
                    </h4>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#DC2626' }}>
                            <span>🚗</span>
                            <span style={{ fontWeight: '600' }}>{stats.impactStats.blockingTraffic}</span>
                            <span>Traffic</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#D97706' }}>
                            <span>🚶</span>
                            <span style={{ fontWeight: '600' }}>{stats.impactStats.blockingPedestrians}</span>
                            <span>Pedestrian</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#7C2D12' }}>
                            <span>👃</span>
                            <span style={{ fontWeight: '600' }}>{stats.impactStats.causingBadSmell}</span>
                            <span>Odor</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#B91C1C' }}>
                            <span>🏥</span>
                            <span style={{ fontWeight: '600' }}>{stats.impactStats.nearSchoolHospital}</span>
                            <span>Critical</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Mini Map */}
            <div 
                onClick={onMapClick}
                style={{ 
                height: '100px', 
                backgroundColor: '#E5E7EB', 
                borderRadius: '0.375rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundImage: `
                    radial-gradient(circle at 20% 40%, rgba(239, 68, 68, 0.6) 3px, transparent 4px),
                    radial-gradient(circle at 60% 70%, rgba(16, 185, 129, 0.6) 3px, transparent 4px),
                    radial-gradient(circle at 80% 30%, rgba(16, 185, 129, 0.6) 3px, transparent 4px),
                    radial-gradient(circle at 30% 80%, rgba(245, 158, 11, 0.6) 3px, transparent 4px),
                    radial-gradient(circle at 70% 20%, rgba(239, 68, 68, 0.6) 3px, transparent 4px)
                `,
                backgroundSize: '100% 100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                position: 'relative'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '600' }}>📈 Interactive Ward Map</div>
                    <div style={{ fontSize: '0.625rem', color: '#9CA3AF' }}>View locations & real-time status</div>
                </div>
            </div>
        </div>
    );
};

export default WardStats;
