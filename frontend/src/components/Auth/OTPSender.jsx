
import React, { useState, useEffect } from 'react';
import { getTranslation } from '../../utils/language';
import { useAuth } from '../../contexts/AuthContext';

const OTPSender = ({ phone, onOtpSent }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { language } = useAuth();
    
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);
    
    const handleSendOTP = () => {
        // Here we would integrate with actual SMS service
        // For demo, we just simulate sending
        setTimeLeft(45);
        if (onOtpSent) onOtpSent();
    };
    
    return (
        <button
            type="button"
            onClick={handleSendOTP}
            disabled={timeLeft > 0 || !phone || phone.length < 10}
            style={{
                width: '100%',
                marginTop: '0.5rem',
                padding: '0.5rem',
                backgroundColor: timeLeft > 0 ? '#9CA3AF' : '#E5E7EB',
                color: timeLeft > 0 ? '#F9FAFB' : '#374151',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: timeLeft > 0 ? 'not-allowed' : 'pointer',
                fontWeight: '500'
            }}
        >
            {timeLeft > 0 
                ? `${getTranslation(language, 'resendOTP')} (${timeLeft}s)` 
                : getTranslation(language, 'sendOTP')}
        </button>
    );
};

export default OTPSender;
