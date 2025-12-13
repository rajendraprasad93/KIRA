import React, { useState } from 'react';

const CATEGORIES = [
    { value: 'streetlight_not_working', label: 'Streetlight', icon: '💡' },
    { value: 'pothole', label: 'Pothole', icon: '🛣️' },
    { value: 'drainage_overflow', label: 'Drainage', icon: '🚰' },
    { value: 'garbage_overflow', label: 'Garbage', icon: '🗑️' },
    { value: 'water_supply', label: 'Water Supply', icon: '💧' },
    { value: 'other', label: 'Other', icon: '📝' }
];

const ManualForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        category: initialData?.category || '',
        description: initialData?.description || '',
        severity: initialData?.severity || 'medium',
        duration: '1_week'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div style={{ padding: '1.5rem', backgroundColor: '#F3F4F6', minHeight: '100vh' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>📝 Manual Entry</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Category */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: '#374151' }}>
                        Category *
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #D1D5DB',
                            backgroundColor: 'white',
                            fontSize: '1rem'
                        }}
                    >
                        <option value="">Select category...</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.icon} {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: '#374151' }}>
                        Description *
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        rows={4}
                        placeholder="Describe the issue..."
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #D1D5DB',
                            fontSize: '1rem',
                            resize: 'vertical'
                        }}
                    />
                </div>

                {/* Severity */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: '#374151' }}>
                        Severity *
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['low', 'medium', 'high'].map(level => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => setFormData({ ...formData, severity: level })}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    border: formData.severity === level ? '2px solid #10B981' : '1px solid #D1D5DB',
                                    borderRadius: '0.375rem',
                                    backgroundColor: formData.severity === level ? '#ECFDF5' : 'white',
                                    color: formData.severity === level ? '#10B981' : '#374151',
                                    fontWeight: formData.severity === level ? '600' : '400',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {level === 'low' ? '🟢' : level === 'medium' ? '🟡' : '🔴'} {level}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                        type="submit"
                        style={{
                            flex: 1,
                            padding: '1rem',
                            backgroundColor: '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        Submit Complaint
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            style={{
                                padding: '1rem',
                                backgroundColor: '#F3F4F6',
                                color: '#374151',
                                border: '1px solid #D1D5DB',
                                borderRadius: '0.5rem',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ManualForm;
