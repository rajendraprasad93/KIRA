// ComplaintCardEnhanced - Enhanced complaint card with timeline, photos, and actions

import React, { useState } from 'react';
import TimelineView from './TimelineView';
import LiveIndicator from './LiveIndicator';
import PhotoGalleryModal from './PhotoGalleryModal';
import RatingModal from './RatingModal';
import complaintsService from '../../services/complaintsService';

const ComplaintCardEnhanced = ({ complaint, onUpdate }) => {
    const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
    const [showPhotoGallery, setShowPhotoGallery] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                color: '#EF4444',
                bgColor: '#FEE2E2',
                emoji: '🔴',
                label: 'PENDING',
                message: 'Awaiting verification'
            },
            in_progress: {
                color: '#F59E0B',
                bgColor: '#FEF3C7',
                emoji: '🟡',
                label: 'IN PROGRESS',
                message: 'Worker assigned'
            },
            resolved: {
                color: '#10B981',
                bgColor: '#D1FAE5',
                emoji: '🟢',
                label: 'RESOLVED',
                message: 'Fixed! Rate the worker'
            },
            closed: {
                color: '#6B7280',
                bgColor: '#F3F4F6',
                emoji: '⚠️',
                label: 'CLOSED',
                message: `Closed ${complaint.daysAgo} days ago`
            }
        };
        return configs[status] || configs.pending;
    };

    const statusConfig = getStatusConfig(complaint.status);

    const handleCallWorker = () => {
        if (complaint.worker?.phone) {
            complaintsService.callWorker(complaint.worker.phone);
        }
    };

    const handleShare = async () => {
        try {
            const result = await complaintsService.shareComplaintSuccess(complaint.id);
            if (result) {
                alert(result.message);
            }
        } catch (error) {
            console.error('Share failed:', error);
        }
    };

    return (
        <>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1rem',
                border: `2px solid ${statusConfig.color}20`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.2s ease'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '0.75rem'
                }}>
                    <div style={{ flex: 1 }}>
                        <span style={{
                            fontSize: '0.675rem',
                            fontWeight: '600',
                            color: '#9CA3AF',
                            display: 'block',
                            marginBottom: '0.25rem'
                        }}>
                            {complaint.id}
                        </span>
                        <h3 style={{
                            margin: 0,
                            fontSize: '1rem',
                            fontWeight: '700',
                            color: '#111827',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            {complaint.category}
                            <span style={{
                                fontSize: '0.75rem',
                                color: '#9CA3AF',
                                fontWeight: '400'
                            }}>
                                {complaint.daysAgo === 0 ? 'Today' : `${complaint.daysAgo}d ago`}
                            </span>
                        </h3>
                    </div>
                    
                    <div style={{
                        padding: '0.375rem 0.75rem',
                        backgroundColor: statusConfig.bgColor,
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}>
                        <span>{statusConfig.emoji}</span>
                        <span style={{
                            fontSize: '0.625rem',
                            fontWeight: '700',
                            color: statusConfig.color
                        }}>
                            {statusConfig.label}
                        </span>
                    </div>
                </div>

                {/* Location */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                    fontSize: '0.75rem',
                    color: '#6B7280'
                }}>
                    <span>📍 {complaint.location}</span>
                </div>

                {/* Worker Status / Message */}
                <div style={{ marginBottom: '0.75rem' }}>
                    {complaint.worker ? (
                        <div>
                            <p style={{
                                margin: '0 0 0.25rem 0',
                                fontSize: '0.75rem',
                                color: '#4B5563'
                            }}>
                                👷 <strong>{complaint.worker.name}</strong> ({complaint.worker.role})
                            </p>
                            {complaint.worker.status && (
                                <LiveIndicator 
                                    status={complaint.worker.status} 
                                    eta={complaint.worker.eta}
                                />
                            )}
                        </div>
                    ) : (
                        <p style={{
                            margin: 0,
                            fontSize: '0.75rem',
                            color: '#6B7280',
                            fontStyle: 'italic'
                        }}>
                            {statusConfig.message}
                        </p>
                    )}
                </div>

                {/* Verification Progress */}
                {complaint.verificationProgress && (
                    <div style={{
                        padding: '0.5rem',
                        backgroundColor: '#FEF3C7',
                        borderRadius: '0.375rem',
                        marginBottom: '0.75rem'
                    }}>
                        <p style={{
                            margin: 0,
                            fontSize: '0.75rem',
                            color: '#92400E'
                        }}>
                            ⏳ {complaint.verificationProgress.current}/{complaint.verificationProgress.required} neighbors verified
                        </p>
                    </div>
                )}

                {/* Rating Display (if already rated) */}
                {complaint.rating && (
                    <div style={{
                        padding: '0.5rem',
                        backgroundColor: '#FEF3C7',
                        borderRadius: '0.375rem',
                        marginBottom: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{ fontSize: '1.25rem' }}>⭐</span>
                        <div>
                            <p style={{
                                margin: 0,
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                color: '#92400E'
                            }}>
                                {'⭐'.repeat(complaint.rating.overall)} Rated {complaint.rating.overall}/5
                            </p>
                            {complaint.rating.feedback && complaint.rating.feedback.length > 0 && (
                                <p style={{
                                    margin: '0.125rem 0 0 0',
                                    fontSize: '0.625rem',
                                    color: '#B45309'
                                }}>
                                    {complaint.rating.feedback.join(', ')}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: complaint.status === 'resolved' && !complaint.rating ? '1fr 1fr 1fr' : '1fr 1fr',
                    gap: '0.5rem',
                    marginBottom: isTimelineExpanded ? 0 : '0.75rem'
                }}>
                    <button
                        onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
                        style={{
                            padding: '0.625rem',
                            backgroundColor: isTimelineExpanded ? '#DBEAFE' : '#F9FAFB',
                            border: `1px solid ${isTimelineExpanded ? '#3B82F6' : '#D1D5DB'}`,
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: isTimelineExpanded ? '#1E40AF' : '#374151',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        📈 {isTimelineExpanded ? 'Hide' : 'View'} Timeline
                    </button>
                    
                    {complaint.photos && (
                        <button
                            onClick={() => setShowPhotoGallery(true)}
                            style={{
                                padding: '0.625rem',
                                backgroundColor: '#F9FAFB',
                                border: '1px solid #D1D5DB',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                color: '#374151',
                                cursor: 'pointer'
                            }}
                        >
                            📸 Photos
                        </button>
                    )}

                    {complaint.status === 'resolved' && !complaint.rating && (
                        <button
                            onClick={() => setShowRatingModal(true)}
                            style={{
                                padding: '0.625rem',
                                backgroundColor: '#FEF3C7',
                                border: '1px solid #FDE68A',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: '#92400E',
                                cursor: 'pointer'
                            }}
                        >
                            ⭐ Rate Now
                        </button>
                    )}
                </div>

                {/* Secondary Actions */}
                {(complaint.worker?.phone || complaint.status === 'resolved') && (
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        marginTop: '0.5rem'
                    }}>
                        {complaint.worker?.phone && (
                            <button
                                onClick={handleCallWorker}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    backgroundColor: 'white',
                                    border: '1px solid #10B981',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#10B981',
                                    cursor: 'pointer'
                                }}
                            >
                                📞 Call Worker
                            </button>
                        )}
                        {complaint.status === 'resolved' && (
                            <button
                                onClick={handleShare}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    backgroundColor: 'white',
                                    border: '1px solid #3B82F6',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#3B82F6',
                                    cursor: 'pointer'
                                }}
                            >
                                📤 Share Success
                            </button>
                        )}
                    </div>
                )}

                {/* Timeline Expansion */}
                <TimelineView
                    timeline={complaint.timeline}
                    isExpanded={isTimelineExpanded}
                    resolutionTime={complaint.resolutionTime}
                    avgResolutionTime={complaint.avgResolutionTime}
                />
            </div>

            {/* Modals */}
            <PhotoGalleryModal
                isOpen={showPhotoGallery}
                onClose={() => setShowPhotoGallery(false)}
                complaint={complaint}
            />

            <RatingModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                complaint={complaint}
                onRatingSubmitted={(result) => {
                    if (onUpdate) {
                        onUpdate(complaint.id, { rating: result });
                    }
                }}
            />
        </>
    );
};

export default ComplaintCardEnhanced;
