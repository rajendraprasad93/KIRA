import React from 'react';

const AIResults = ({ analysis, onSubmit, onRetake, onEdit }) => {
    if (!analysis) return null;

    const severityConfig = {
        high: { color: '#EF4444', bg: '#FEF2F2', label: 'High Priority' },
        medium: { color: '#F59E0B', bg: '#FFFBEB', label: 'Medium Priority' },
        low: { color: '#10B981', bg: '#ECFDF5', label: 'Low Priority' }
    };

    const config = severityConfig[analysis.severity] || severityConfig.medium;

    return (
        <div style={{ padding: '1.5rem', backgroundColor: '#F3F4F6', minHeight: '100vh' }}>
            {/* Success Banner */}
            <div style={{
                background: 'linear-gradient(to right, #10B981, #059669)',
                padding: '1rem',
                borderRadius: '0.5rem',
                color: 'white',
                marginBottom: '1rem',
                textAlign: 'center'
            }}>
                <p style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>✨</p>
                <h2 style={{ margin: 0, fontSize: '1.125rem' }}>AI Analysis Complete!</h2>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: '0.25rem 0 0 0' }}>Confidence: {Math.round(analysis.confidence * 100)}%</p>
            </div>

            {/* Analysis Results Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>{analysis.icon}</span>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>{analysis.displayName}</h3>
                        <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.625rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: config.bg,
                            color: config.color,
                            marginTop: '0.25rem'
                        }}>
                            {config.label}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                        <span>📝</span>
                        <div>
                            <strong>Description:</strong><br/>
                            {analysis.description}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📍</span>
                        <div>
                            <strong>Location:</strong> {analysis.location.lat.toFixed(4)}°N, {analysis.location.lng.toFixed(4)}°E
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>⚠️</span>
                        <div>
                            <strong>Safety Risk:</strong> {analysis.safety_risk.replace('_', ' ')}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>⏱️</span>
                        <div>
                            <strong>Estimated Duration:</strong> {analysis.duration_estimate.replace('_', ' ')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                    onClick={onSubmit}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        backgroundColor: '#10B981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(16, 185, 129, 0.4)'
                    }}
                >
                    ✨ Perfect! Submit Now
                </button>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={onEdit}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            backgroundColor: '#F3F4F6',
                            color: '#374151',
                            border: '1px solid #D1D5DB',
                            borderRadius: '0.375rem',
                            fontWeight: '500',
                            cursor: 'pointer'
                        }}
                    >
                        🔧 Edit Details
                    </button>
                    <button
                        onClick={onRetake}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            backgroundColor: '#F3F4F6',
                            color: '#374151',
                            border: '1px solid #D1D5DB',
                            borderRadius: '0.375rem',
                            fontWeight: '500',
                            cursor: 'pointer'
                        }}
                    >
                        📷 Retake Photo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIResults;
