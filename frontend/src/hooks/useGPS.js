import { useState, useEffect, useCallback } from 'react';

export const useGPS = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getCurrentLocation = useCallback(() => {
        setLoading(true);
        
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
                setError(null);
                setLoading(false);
            },
            (err) => {
                setError('Unable to retrieve your location. Please enable GPS.');
                setLoading(false);
                console.error('GPS error:', err);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }, []);

    useEffect(() => {
        getCurrentLocation();
    }, [getCurrentLocation]);

    return {
        location,
        error,
        loading,
        refreshLocation: getCurrentLocation
    };
};
