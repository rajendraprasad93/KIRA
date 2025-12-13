// WardMap - Interactive Leaflet map with filterable pins

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Custom marker icons based on status
const createCustomIcon = (status) => {
    const colors = {
        open: '#EF4444',       // Red
        in_progress: '#F59E0B', // Yellow
        resolved: '#10B981'     // Green
    };
    
    const color = colors[status] || '#6B7280';
    
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            background-color: ${color};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

const WardMap = ({ pins, activeFilter, onFilterChange }) => {
    const [selectedPin, setSelectedPin] = useState(null);

    if (!pins || pins.length === 0) return null;

    // Filter pins based on active filter
    const filteredPins = activeFilter === 'all' 
        ? pins 
        : pins.filter(pin => pin.category === activeFilter);

    const filterOptions = [
        { id: 'all', label: 'All', count: pins.length },
        { id: 'streetlight', label: 'Streetlight', count: pins.filter(p => p.category === 'streetlight').length },
        { id: 'pothole', label: 'Pothole', count: pins.filter(p => p.category === 'pothole').length },
        { id: 'drainage', label: 'Drainage', count: pins.filter(p => p.category === 'drainage').length },
        { id: 'garbage', label: 'Garbage', count: pins.filter(p => p.category === 'garbage').length }
    ];

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            marginBottom: '2rem'
        }}>
            {/* Map Header with Filters */}
            <div style={{
                padding: '1rem',
                background: 'linear-gradient(to right, #F9FAFB, #F3F4F6)',
                borderBottom: '1px solid #E5E7EB'
            }}>
                <h2 style={{
                    margin: '0 0 0.75rem 0',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#111827'
                }}>
                    🗺️ Ward Issues Map
                </h2>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                }}>
                    {filterOptions.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => onFilterChange && onFilterChange(filter.id)}
                            style={{
                                padding: '0.5rem 0.875rem',
                                borderRadius: '9999px',
                                border: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                backgroundColor: activeFilter === filter.id ? '#10B981' : '#E5E7EB',
                                color: activeFilter === filter.id ? 'white' : '#4B5563',
                                boxShadow: activeFilter === filter.id ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (activeFilter !== filter.id) {
                                    e.currentTarget.style.backgroundColor = '#D1D5DB';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeFilter !== filter.id) {
                                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                                }
                            }}
                        >
                            {filter.label} ({filter.count})
                        </button>
                    ))}
                </div>
                
                {/* Legend */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginTop: '0.75rem',
                    fontSize: '0.75rem',
                    color: '#6B7280'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                        Open
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                        In Progress
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                        Resolved
                    </div>
                </div>
            </div>

            {/* Leaflet Map */}
            <div style={{ height: '450px', width: '100%' }}>
                <MapContainer
                    center={[12.9234, 77.5678]}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {filteredPins.map(pin => (
                        <Marker
                            key={pin.id}
                            position={[pin.lat, pin.lng]}
                            icon={createCustomIcon(pin.status)}
                            eventHandlers={{
                                click: () => setSelectedPin(pin)
                            }}
                        >
                            <Popup>
                                <div style={{ minWidth: '200px' }}>
                                    <div style={{
                                        fontWeight: 'bold',
                                        fontSize: '0.875rem',
                                        marginBottom: '0.5rem',
                                        color: '#111827'
                                    }}>
                                        {pin.id}
                                    </div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: '#6B7280',
                                        marginBottom: '0.25rem',
                                        textTransform: 'capitalize'
                                    }}>
                                        📍 {pin.category}
                                    </div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: '#4B5563',
                                        marginBottom: '0.75rem'
                                    }}>
                                        {pin.title}
                                    </div>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.625rem',
                                        fontWeight: '600',
                                        marginBottom: '0.75rem',
                                        backgroundColor: pin.status === 'open' ? '#FEE2E2' :
                                                       pin.status === 'in_progress' ? '#FEF3C7' : '#D1FAE5',
                                        color: pin.status === 'open' ? '#991B1B' :
                                              pin.status === 'in_progress' ? '#92400E' : '#065F46'
                                    }}>
                                        {pin.status.replace('_', ' ').toUpperCase()}
                                    </div>
                                    <button style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        backgroundColor: '#10B981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}>
                                        👀 View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default WardMap;
