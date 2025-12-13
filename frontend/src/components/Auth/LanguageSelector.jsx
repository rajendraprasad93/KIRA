
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LanguageSelector = () => {
    const { language, changeLanguage, languages } = useAuth();
    
    return (
        <select 
            value={language} 
            onChange={(e) => changeLanguage(e.target.value)}
            style={{
                padding: '0.2rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                fontSize: '0.875rem',
                lineHeight: '1.25rem',
                backgroundColor: 'white',
                color: '#374151',
                outline: 'none'
            }}
        >
            {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                    {lang.native}
                </option>
            ))}
        </select>
    );
};

export default LanguageSelector;
