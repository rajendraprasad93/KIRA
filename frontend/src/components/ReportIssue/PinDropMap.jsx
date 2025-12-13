import React from 'react';

const PinDropMap = ({ location, onLocationChange }) => {
    // In production, integrate Google Maps or Leaflet
    // For MVP, showing a static visual representation
    
    return (
        <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#111827' }}>📍 Pin Your Location</h3>
            
            {/* Mock Map */}
            <div style={{
                height: '200px',
                backgroundColor: '#E5E7EB',
                borderRadius: '0.375rem',
                position: 'relative',
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.6) 8px, transparent 9px)',
                backgroundSize: '100% 100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem'
            }}>
                <div style={{ textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.9)', padding: '1rem', borderRadius: '0.375rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>Interactive Map</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: '0.25rem 0 0 0' }}>
                        {location ? `${location.lat.toFixed(4)}°N, ${location.lng.toFixed(4)}°E` : 'Detecting...'}
                    </p>
                </div>
                
                {/* Pin Icon */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', fontSize: '2rem' }}>
                    📍
                </div>
            </div>

            {location && (
                <div style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                    <p style={{ margin: '0 0 0.25rem 0' }}><strong>Ward:</strong> Ward 12</p>
                    <p style={{ margin: 0 }}><strong>Landmark:</strong> Near Bus Stop (50m)</p>
                </div>
            )}

            <button
                onClick={() => alert('GPS refresh functionality')}
                style={{
                    width: '100%',
                    marginTop: '0.75rem',
                    padding: '0.625rem',
                    backgroundColor: '#F3F4F6',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    cursor: 'pointer'
                }}
            >
                🔄 Refresh Location
            </button>
        </div>
    );
};

export default PinDropMap;
