// Custom hook for managing complaints with real-time updates

import { useState, useEffect, useCallback } from 'react';
import complaintsService from '../services/complaintsService';
import mockWebSocket from '../services/mockWebSocket';

export const useComplaints = (userId, initialFilter = 'all') => {
    const [complaints, setComplaints] = useState([]);
    const [counts, setCounts] = useState({
        all: 0,
        pending: 0,
        in_progress: 0,
        resolved: 0,
        closed: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState(initialFilter);
    const [wsConnected, setWsConnected] = useState(false);

    // Fetch complaints
    const fetchComplaints = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await complaintsService.getUserComplaints(userId, filter);
            setComplaints(response.complaints);
            setCounts(response.counts);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching complaints:', err);
        } finally {
            setLoading(false);
        }
    }, [userId, filter]);

    // Refresh complaints
    const refresh = useCallback(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    // Update a specific complaint
    const updateComplaint = useCallback((complaintId, updates) => {
        setComplaints(prevComplaints =>
            prevComplaints.map(complaint =>
                complaint.id === complaintId
                    ? { ...complaint, ...updates }
                    : complaint
            )
        );
    }, []);

    // Add timeline event to a complaint
    const addTimelineEvent = useCallback((complaintId, event) => {
        setComplaints(prevComplaints =>
            prevComplaints.map(complaint =>
                complaint.id === complaintId
                    ? {
                        ...complaint,
                        timeline: [...(complaint.timeline || []), event]
                    }
                    : complaint
            )
        );
    }, []);

    // Handle WebSocket updates
    useEffect(() => {
        const handleUpdate = (data) => {
            console.log('WebSocket update received:', data);
            
            if (data.type === 'status_change') {
                updateComplaint(data.complaintId, {
                    status: data.newStatus
                });
            } else if (data.type === 'worker_location') {
                updateComplaint(data.complaintId, {
                    worker: {
                        ...complaints.find(c => c.id === data.complaintId)?.worker,
                        eta: data.eta
                    }
                });
            }
        };

        const handleTimelineEvent = (data) => {
            console.log('Timeline event received:', data);
            
            if (data.type === 'timeline_event') {
                addTimelineEvent(data.complaintId, data.event);
            } else if (data.type === 'verification_update') {
                updateComplaint(data.complaintId, {
                    verificationProgress: data.verifications
                });
            }
        };

        const handleConnected = () => {
            setWsConnected(true);
            console.log('✅ WebSocket connected');
        };

        const handleDisconnected = () => {
            setWsConnected(false);
            console.log('❌ WebSocket disconnected');
        };

        // Subscribe to WebSocket events
        mockWebSocket.on('update', handleUpdate);
        mockWebSocket.on('timeline', handleTimelineEvent);
        mockWebSocket.on('connected', handleConnected);
        mockWebSocket.on('disconnected', handleDisconnected);

        // Connect WebSocket
        if (!mockWebSocket.connected) {
            mockWebSocket.connect();
        }

        // Cleanup
        return () => {
            mockWebSocket.off('update', handleUpdate);
            mockWebSocket.off('timeline', handleTimelineEvent);
            mockWebSocket.off('connected', handleConnected);
            mockWebSocket.off('disconnected', handleDisconnected);
        };
    }, [updateComplaint, addTimelineEvent, complaints]);

    // Fetch complaints on mount and filter change
    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    return {
        complaints,
        counts,
        loading,
        error,
        filter,
        setFilter,
        refresh,
        wsConnected,
        updateComplaint,
        addTimelineEvent
    };
};

export default useComplaints;
