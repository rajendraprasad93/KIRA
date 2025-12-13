// TimelineView - Expandable timeline showing complaint progress

import React from 'react';

const TimelineView = ({ timeline, isExpanded, resolutionTime, avgResolutionTime }) => {
    if (!isExpanded || !timeline || timeline.length === 0) {
        return null;
    }

    return (
        <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#F9FAFB',
            borderRadius: '0.5rem',
            border: '1px solid #E5E7EB',
            animation: 'slideDown 0.3s ease-out'
        }}>
            <h4 style={{
                margin: '0 0 0.75rem 0',
                fontSize: '0.875rem',
                fontWeight: '700',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                📈 COMPLAINT TIMELINE
            </h4>

            {/* Timeline Events */}
            <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                {/* Vertical line */}
                <div style={{
                    position: 'absolute',
                    left: '0.4375rem',
                    top: '0.5rem',
                    bottom: '0.5rem',
                    width: '2px',
                    backgroundColor: '#E5E7EB'
                }} />

                {timeline.map((event, index) => (
                    <div
                        key={event.id}
                        style={{
                            position: 'relative',
                            marginBottom: index < timeline.length - 1 ? '1rem' : '0',
                            paddingBottom: index < timeline.length - 1 ? '1rem' : '0'
                        }}
                    >
                        {/* Timeline dot */}
                        <div style={{
                            position: 'absolute',
                            left: '-1.5rem',
                            top: '0.25rem',
                            width: '0.875rem',
                            height: '0.875rem',
                            backgroundColor: event.color,
                            borderRadius: '50%',
                            border: '2px solid white',
                            boxShadow: '0 0 0 2px ' + event.color + '40',
                            zIndex: 1
                        }} />

                        {/* Event content */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: '0.625rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #E5E7EB'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '0.25rem'
                            }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: event.color
                                }}>
                                    {event.icon} {event.title}
                                </span>
                                <span style={{
                                    fontSize: '0.625rem',
                                    color: '#9CA3AF'
                                }}>
                                    {event.time}
                                </span>
                            </div>
                            <p style={{
                                margin: '0 0 0.25rem 0',
                                fontSize: '0.75rem',
                                color: '#4B5563',
                                lineHeight: '1.4'
                            }}>
                                {event.description}
                            </p>
                            {event.actor && (
                                <p style={{
                                    margin: 0,
                                    fontSize: '0.625rem',
                                    color: '#9CA3AF',
                                    fontStyle: 'italic'
                                }}>
                                    by {event.actor}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Performance Badge */}
            {resolutionTime && avgResolutionTime && (
                <div style={{
                    marginTop: '1rem',
                    padding: '0.625rem',
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    borderRadius: '0.375rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span style={{ fontSize: '1.25rem' }}>⚡</span>
                    <div>
                        <p style={{
                            margin: 0,
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            color: '#065F46'
                        }}>
                            {resolutionTime} total
                        </p>
                        <p style={{
                            margin: 0,
                            fontSize: '0.625rem',
                            color: '#059669'
                        }}>
                            vs avg {avgResolutionTime} - Exceptional!
                        </p>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        max-height: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        max-height: 1000px;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default TimelineView;
