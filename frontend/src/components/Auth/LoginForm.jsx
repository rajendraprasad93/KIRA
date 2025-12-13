
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTranslation } from '../../utils/language';
import { validatePhone, formatPhone } from '../../utils/validators';
import OTPSender from './OTPSender';

const LoginForm = () => {
    const { login, language } = useAuth();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');

    const handlePhoneChange = (e) => {
        const formatted = formatPhone(e.target.value);
        setPhone(formatted);
        setError('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        
        if (!validatePhone(phone)) {
            setError(getTranslation(language, 'errors.phoneInvalid'));
            return;
        }

        if (otp.length !== 6) {
            setError(getTranslation(language, 'errors.otpInvalid'));
            return;
        }

        // Simulate login verification
        // In real app, verify OTP with backend
        login({ 
            id: 'citizen_123',
            name: 'Demo User',
            phone: phone,
            ward: 'Ward 1'
        });
    };

    return (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                    {getTranslation(language, 'phone')}
                </label>
                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '10px', top: '12px', color: '#6B7280' }}>+91</span>
                    <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="98765 43210"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            paddingLeft: '3rem',
                            borderRadius: '0.375rem',
                            border: error ? '1px solid #EF4444' : '1px solid #D1D5DB',
                            outline: 'none'
                        }}
                    />
                </div>
                {error && <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{error}</p>}
            </div>

            {!otpSent ? (
                <OTPSender phone={phone} onOtpSent={() => setOtpSent(true)} />
            ) : (
                <>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                            {getTranslation(language, 'enterOTP')}
                        </label>
                        <input
                            type="text"
                            maxLength="6"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="123456"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #D1D5DB',
                                textAlign: 'center',
                                letterSpacing: '0.5em',
                                fontSize: '1.25rem'
                            }}
                        />
                         <div style={{ marginTop: '0.5rem' }}>
                            <OTPSender phone={phone} onOtpSent={() => setOtpSent(true)} />
                         </div>
                    </div>

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
                            cursor: 'pointer',
                            marginTop: '0.5rem'
                        }}
                    >
                        {getTranslation(language, 'login')}
                    </button>
                </>
            )}
        </form>
    );
};

export default LoginForm;
