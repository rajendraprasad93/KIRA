
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTranslation } from '../../utils/language';
import { validatePhone, formatPhone, validateName, validateEmail } from '../../utils/validators';

const SignupForm = () => {
    const { login, language } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        ward: 'Ward 1',
        consent: true
    });
    const [errors, setErrors] = useState({});

    // Hardcoded wards for demo
    const wards = Array.from({ length: 20 }, (_, i) => `Ward ${i + 1}`);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        let finalValue = value;
        if (name === 'phone') {
             finalValue = formatPhone(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : finalValue
        }));
        
        // Clear error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        const newErrors = {};
        if (!validateName(formData.name)) newErrors.name = getTranslation(language, 'errors.nameRequired');
        if (!validatePhone(formData.phone)) newErrors.phone = getTranslation(language, 'errors.phoneInvalid');
        if (formData.email && !validateEmail(formData.email)) newErrors.email = "Invalid email";
        if (!formData.ward) newErrors.ward = getTranslation(language, 'errors.wardRequired');

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Simulate signup
        login({
            id: 'citizen_new',
            name: formData.name,
            phone: formData.phone,
            ward: formData.ward,
            role: 'CITIZEN'
        });
    };

    const handleVoiceSignup = () => {
        alert("Voice signup feature coming soon!");
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {/* Name */}
            <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                    {getTranslation(language, 'fullName')} *
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.375rem',
                        border: errors.name ? '1px solid #EF4444' : '1px solid #D1D5DB',
                        outline: 'none'
                    }}
                />
                {errors.name && <p style={{ color: '#EF4444', fontSize: '0.875rem' }}>{errors.name}</p>}
            </div>

            {/* Phone */}
             <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                    {getTranslation(language, 'phone')} *
                </label>
                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '10px', top: '12px', color: '#6B7280' }}>+91</span>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="98765 43210"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            paddingLeft: '3rem',
                            borderRadius: '0.375rem',
                            border: errors.phone ? '1px solid #EF4444' : '1px solid #D1D5DB',
                            outline: 'none'
                        }}
                    />
                </div>
                {errors.phone && <p style={{ color: '#EF4444', fontSize: '0.875rem' }}>{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                    {getTranslation(language, 'email')}
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.375rem',
                        border: errors.email ? '1px solid #EF4444' : '1px solid #D1D5DB',
                        outline: 'none'
                    }}
                />
                 {errors.email && <p style={{ color: '#EF4444', fontSize: '0.875rem' }}>{errors.email}</p>}
            </div>

            {/* Ward */}
             <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                    {getTranslation(language, 'ward')} *
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '0.375rem',
                            border: errors.ward ? '1px solid #EF4444' : '1px solid #D1D5DB',
                            outline: 'none',
                            backgroundColor: 'white'
                        }}
                    >
                        {wards.map(ward => (
                            <option key={ward} value={ward}>{ward}</option>
                        ))}
                    </select>
                     <button
                        type="button"
                        onClick={() => alert("Detecting ward via GPS...")}
                        style={{
                            padding: '0.75rem',
                            backgroundColor: '#E5E7EB',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer'
                        }}
                        title={getTranslation(language, 'detectWard')}
                    >
                        📍
                    </button>
                </div>
            </div>

             {/* Voice Signup Button */}
            <button
                type="button"
                onClick={handleVoiceSignup}
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}
            >
                Start Voice Signup 🎙️
            </button>

             {/* Continue Button */}
            <button
                type="submit"
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#10B981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                }}
            >
                {getTranslation(language, 'continue')}
            </button>
        </form>
    );
};

export default SignupForm;
