import React, { useState } from 'react';
import { CheckCircle, Edit3, MapPin, AlertTriangle, Eye, Brain } from 'lucide-react';

const ExtractedIssueForm = ({ extractedData, visionAnalysis, onSubmit, onEdit, onRetake }) => {
    const [formData, setFormData] = useState({
        category: extractedData?.category || 'others',
        severity: extractedData?.severity || 'Medium',
        description: extractedData?.description || '',
        citizenName: '',
        citizenPhone: '',
        location: extractedData?.location || ''
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.citizenName.trim()) {
            alert('Please enter your name');
            return;
        }
        onSubmit(formData);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'garbage': '🗑️',
            'roads': '🛣️',
            'water': '💧',
            'drainage': '🚰',
            'electricity': '💡',
            'infrastructure': '🏗️',
            'others': '⚠️'
        };
        return icons[category] || '📋';
    };

    const getCategoryName = (category) => {
        const names = {
            'garbage': 'Garbage Issue',
            'roads': 'Road Issue',
            'water': 'Water Issue',
            'drainage': 'Drainage Issue',
            'electricity': 'Electricity Issue',
            'infrastructure': 'Infrastructure Issue',
            'others': 'Other Issue'
        };
        return names[category] || 'Civic Issue';
    };

    const getSeverityColor = (severity) => {
        const colors = {
            'High': { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
            'Medium': { bg: '#FFFBEB', color: '#D97706', border: '#FED7AA' },
            'Low': { bg: '#ECFDF5', color: '#059669', border: '#BBF7D0' }
        };
        return colors[severity] || colors.Medium;
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#F3F4F6', 
            padding: '1rem'
        }}>
            <div style={{ 
                maxWidth: '600px', 
                margin: '0 auto',
                backgroundColor: 'white',
                borderRadius: '1rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <CheckCircle className="w-12 h-12 mx-auto mb-3" />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        ✨ AI Analysis Complete!
                    </h2>
                    <p style={{ opacity: 0.9, fontSize: '0.875rem' }}>
                        Confidence: {extractedData?.confidence || 0}% • Review and submit
                    </p>
                </div>

                {/* Vision Analysis Summary */}
                {visionAnalysis && (
                    <div style={{ 
                        padding: '1.5rem', 
                        backgroundColor: '#EFF6FF',
                        borderBottom: '1px solid #E5E7EB'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                            <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ 
                                    fontSize: '0.875rem', 
                                    fontWeight: '600', 
                                    color: '#1E40AF',
                                    margin: '0 0 0.5rem 0'
                                }}>
                                    AI Vision Analysis
                                </h3>
                                <p style={{ 
                                    fontSize: '0.8125rem', 
                                    color: '#1E3A8A',
                                    margin: '0 0 0.75rem 0',
                                    lineHeight: '1.4'
                                }}>
                                    {visionAnalysis.visual_summary}
                                </p>
                                {visionAnalysis.detected_objects && visionAnalysis.detected_objects.length > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Eye className="w-4 h-4 text-blue-500" />
                                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                            Detected: {visionAnalysis.detected_objects.join(', ')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                    {/* Issue Type */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ 
                            display: 'block', 
                            fontSize: '0.875rem', 
                            fontWeight: '600', 
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Issue Type
                        </label>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.75rem',
                            padding: '0.75rem',
                            backgroundColor: '#F9FAFB',
                            borderRadius: '0.5rem',
                            border: '1px solid #E5E7EB'
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>{getCategoryIcon(formData.category)}</span>
                            <div style={{ flex: 1 }}>
                                {isEditing ? (
                                    <select
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '0.375rem',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        <option value="garbage">Garbage Issue</option>
                                        <option value="roads">Road Issue</option>
                                        <option value="water">Water Issue</option>
                                        <option value="drainage">Drainage Issue</option>
                                        <option value="electricity">Electricity Issue</option>
                                        <option value="infrastructure">Infrastructure Issue</option>
                                        <option value="others">Other Issue</option>
                                    </select>
                                ) : (
                                    <span style={{ fontWeight: '500', color: '#111827' }}>
                                        {getCategoryName(formData.category)}
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsEditing(!isEditing)}
                                style={{
                                    padding: '0.25rem',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6B7280'
                                }}
                            >
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Severity */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ 
                            display: 'block', 
                            fontSize: '0.875rem', 
                            fontWeight: '600', 
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Severity Level
                        </label>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.75rem',
                            padding: '0.75rem',
                            backgroundColor: getSeverityColor(formData.severity).bg,
                            borderRadius: '0.5rem',
                            border: `1px solid ${getSeverityColor(formData.severity).border}`
                        }}>
                            <AlertTriangle 
                                className="w-5 h-5" 
                                style={{ color: getSeverityColor(formData.severity).color }}
                            />
                            <div style={{ flex: 1 }}>
                                {isEditing ? (
                                    <select
                                        value={formData.severity}
                                        onChange={(e) => handleInputChange('severity', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '0.375rem',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        <option value="Low">Low Priority</option>
                                        <option value="Medium">Medium Priority</option>
                                        <option value="High">High Priority</option>
                                    </select>
                                ) : (
                                    <span style={{ 
                                        fontWeight: '500', 
                                        color: getSeverityColor(formData.severity).color 
                                    }}>
                                        {formData.severity} Priority
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ 
                            display: 'block', 
                            fontSize: '0.875rem', 
                            fontWeight: '600', 
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Describe the issue in detail..."
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #D1D5DB',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    {/* Location */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ 
                            display: 'block', 
                            fontSize: '0.875rem', 
                            fontWeight: '600', 
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Location
                        </label>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'start', 
                            gap: '0.75rem',
                            padding: '0.75rem',
                            backgroundColor: '#F0F9FF',
                            borderRadius: '0.5rem',
                            border: '1px solid #BAE6FD'
                        }}>
                            <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '500', color: '#1E40AF', marginBottom: '0.25rem' }}>
                                    {extractedData.location?.address || 'Location from GPS'}
                                </div>
                                {/* Debug: Show what we have */}
                                {console.log('🗺️ Location data:', extractedData.location)}
                                {extractedData.location?.lat && extractedData.location?.lng && (
                                    <div style={{ fontSize: '0.75rem', color: '#6B7280', fontFamily: 'monospace' }}>
                                        {extractedData.location.lat.toFixed(6)}°N, {extractedData.location.lng.toFixed(6)}°E
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Citizen Details */}
                    <div style={{ 
                        padding: '1rem',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '0.5rem',
                        marginBottom: '1.5rem'
                    }}>
                        <h3 style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: '600', 
                            color: '#374151',
                            marginBottom: '1rem'
                        }}>
                            Your Details
                        </h3>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ 
                                display: 'block', 
                                fontSize: '0.75rem', 
                                fontWeight: '500', 
                                color: '#6B7280',
                                marginBottom: '0.25rem'
                            }}>
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={formData.citizenName}
                                onChange={(e) => handleInputChange('citizenName', e.target.value)}
                                placeholder="Enter your full name"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ 
                                display: 'block', 
                                fontSize: '0.75rem', 
                                fontWeight: '500', 
                                color: '#6B7280',
                                marginBottom: '0.25rem'
                            }}>
                                Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                value={formData.citizenPhone}
                                onChange={(e) => handleInputChange('citizenPhone', e.target.value)}
                                placeholder="Enter your phone number"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem'
                                }}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                backgroundColor: '#10B981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <CheckCircle className="w-5 h-5" />
                            Submit Issue Report
                        </button>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                type="button"
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
                                🔧 Edit Manually
                            </button>
                            <button
                                type="button"
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
                </form>
            </div>
        </div>
    );
};

export default ExtractedIssueForm;