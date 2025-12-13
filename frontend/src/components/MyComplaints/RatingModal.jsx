// RatingModal - Worker rating interface with gamification

import React, { useState } from 'react';
import complaintsService from '../../services/complaintsService';

const RatingModal = ({ isOpen, onClose, complaint, onRatingSubmitted }) => {
    const [ratings, setRatings] = useState({
        overall: 0,
        speed: 0,
        quality: 0,
        communication: 0
    });
    const [selectedFeedback, setSelectedFeedback] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen || !complaint) return null;

    const feedbackOptions = [
        'Quick response',
        'Good photos',
        'Professional',
        'Perfect fix',
        'Polite',
        'Thorough work'
    ];

    const handleStarClick = (category, value) => {
        setRatings(prev => ({ ...prev, [category]: value }));
    };

    const toggleFeedback = (option) => {
        setSelectedFeedback(prev =>
            prev.includes(option)
                ? prev.filter(f => f !== option)
                : [...prev, option]
        );
    };

    const handleSubmit = async () => {
        if (ratings.overall === 0) {
            alert('Please provide an overall rating');
            return;
        }

        setSubmitting(true);
        try {
            const result = await complaintsService.submitRating(complaint.id, {
                ...ratings,
                feedback: selectedFeedback
            });

            alert(`✅ ${result.message}\n🏆 +${result.points} points earned!`);
            if (onRatingSubmitted) {
                onRatingSubmitted(result);
            }
            onClose();
        } catch (error) {
            alert('Failed to submit rating. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const StarRating = ({ value, onChange, label }) => (
        <div style={{ marginBottom: '0.75rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.25rem'
            }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#4B5563' }}>
                    {label}
                </span>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            onClick={() => onChange(star)}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'transform 0.1s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {star <= value ? '⭐' : '☆'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                animation: 'fadeIn 0.3s ease'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    maxWidth: '450px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: '1.25rem',
                    borderBottom: '1px solid #E5E7EB',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#111827' }}>
                            ⭐ Rate This Resolution
                        </h3>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#6B7280' }}>
                            {complaint.id} • {complaint.category}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            color: '#9CA3AF',
                            cursor: 'pointer',
                            padding: 0,
                            width: '2rem',
                            height: '2rem'
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Worker Info */}
                {complaint.worker && (
                    <div style={{
                        padding: '1rem 1.25rem',
                        backgroundColor: '#F9FAFB',
                        borderBottom: '1px solid #E5E7EB'
                    }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>WORKER</p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                            👷 {complaint.worker.name} ({complaint.worker.role})
                        </p>
                    </div>
                )}

                {/* Rating Form */}
                <div style={{ padding: '1.25rem' }}>
                    <StarRating
                        label="Overall Experience"
                        value={ratings.overall}
                        onChange={(val) => handleStarClick('overall', val)}
                    />
                    <StarRating
                        label="Response Speed"
                        value={ratings.speed}
                        onChange={(val) => handleStarClick('speed', val)}
                    />
                    <StarRating
                        label="Work Quality"
                        value={ratings.quality}
                        onChange={(val) => handleStarClick('quality', val)}
                    />
                    <StarRating
                        label="Communication"
                        value={ratings.communication}
                        onChange={(val) => handleStarClick('communication', val)}
                    />

                    {/* Quick Feedback */}
                    <div style={{ marginTop: '1rem' }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: '600', color: '#4B5563' }}>
                            What went well? (Optional)
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {feedbackOptions.map(option => (
                                <button
                                    key={option}
                                    onClick={() => toggleFeedback(option)}
                                    style={{
                                        padding: '0.375rem 0.75rem',
                                        backgroundColor: selectedFeedback.includes(option) ? '#DBEAFE' : 'white',
                                        border: `1px solid ${selectedFeedback.includes(option) ? '#3B82F6' : '#E5E7EB'}`,
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        color: selectedFeedback.includes(option) ? '#1E40AF' : '#6B7280',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {selectedFeedback.includes(option) ? '✓ ' : ''}{option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Rewards Preview */}
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        backgroundColor: '#FEF3C7',
                        border: '1px solid #FDE68A',
                        borderRadius: '0.5rem',
                        textAlign: 'center'
                    }}>
                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700', color: '#92400E' }}>
                            🏆 Earn up to +20 points!
                        </p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.625rem', color: '#B45309' }}>
                            +10 base • +5 for 5-star • +5 for detailed feedback
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '1rem 1.25rem',
                    borderTop: '1px solid #E5E7EB',
                    display: 'flex',
                    gap: '0.75rem'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#6B7280',
                            cursor: 'pointer'
                        }}
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || ratings.overall === 0}
                        style={{
                            flex: 2,
                            padding: '0.75rem',
                            backgroundColor: ratings.overall === 0 ? '#D1D5DB' : '#10B981',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: 'white',
                            cursor: ratings.overall === 0 ? 'not-allowed' : 'pointer',
                            opacity: submitting ? 0.6 : 1
                        }}
                    >
                        {submitting ? 'Submitting...' : '✓ Submit Rating'}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default RatingModal;
