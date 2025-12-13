// Mock WebSocket Service - Simulates real-time updates for complaint tracking

class MockWebSocket {
    constructor() {
        this.listeners = {};
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    // Connect to WebSocket (simulated)
    connect() {
        console.log('📡 Connecting to WebSocket...');
        
        setTimeout(() => {
            this.connected = true;
            this.reconnectAttempts = 0;
            console.log('✅ WebSocket connected');
            this.emit('connected', { timestamp: new Date().toISOString() });
            
            // Start simulating events
            this.startSimulation();
        }, 1000);
    }

    // Disconnect from WebSocket
    disconnect() {
        this.connected = false;
        this.stopSimulation();
        console.log('❌ WebSocket disconnected');
        this.emit('disconnected', { timestamp: new Date().toISOString() });
    }

    // Subscribe to events
    on(eventType, callback) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }
        this.listeners[eventType].push(callback);
    }

    // Unsubscribe from events
    off(eventType, callback) {
        if (!this.listeners[eventType]) return;
        this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback);
    }

    // Emit events to listeners
    emit(eventType, data) {
        if (!this.listeners[eventType]) return;
        this.listeners[eventType].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('Error in WebSocket listener:', error);
            }
        });
    }

    // Start simulating real-time events
    startSimulation() {
        // Simulate worker status updates every 10 seconds
        this.workerUpdateInterval = setInterval(() => {
            if (!this.connected) return;
            
            const updates = [
                {
                    type: 'worker_location',
                    complaintId: 'GG-00001',
                    worker: 'Ravi Kumar',
                    location: { lat: 12.9234, lng: 77.5678 },
                    eta: '25 min',
                    timestamp: new Date().toISOString()
                },
                {
                    type: 'status_change',
                    complaintId: 'GG-00001',
                    oldStatus: 'assigned',
                    newStatus: 'in_progress',
                    message: 'Worker has arrived at location',
                    timestamp: new Date().toISOString()
                }
            ];
            
            const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
            this.emit('update', randomUpdate);
            console.log('📡 WebSocket update:', randomUpdate.type);
        }, 15000); // Every 15 seconds

        // Simulate timeline events every 20 seconds
        this.timelineEventInterval = setInterval(() => {
            if (!this.connected) return;
            
            const events = [
                {
                    type: 'timeline_event',
                    complaintId: 'GG-00001',
                    event: {
                        id: Date.now(),
                        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                        timestamp: new Date().toISOString(),
                        status: 'in_progress',
                        title: 'UPDATE',
                        description: 'Worker checking equipment',
                        icon: '🔧',
                        color: '#F59E0B',
                        actor: 'Ravi Kumar'
                    },
                    timestamp: new Date().toISOString()
                },
                {
                    type: 'verification_update',
                    complaintId: 'GG-00003',
                    verifications: { current: 4, required: 8 },
                    message: '1 more neighbor verified!',
                    timestamp: new Date().toISOString()
                }
            ];
            
            const randomEvent = events[Math.floor(Math.random() * events.length)];
            this.emit('timeline', randomEvent);
            console.log('📡 WebSocket timeline event:', randomEvent.type);
        }, 20000); // Every 20 seconds

        // Simulate notifications every 30 seconds
        this.notificationInterval = setInterval(() => {
            if (!this.connected) return;
            
            const notifications = [
                {
                    type: 'notification',
                    title: 'Worker Update',
                    message: 'Ravi is 10 minutes away from GG-00001',
                    complaintId: 'GG-00001',
                    icon: '🚗',
                    timestamp: new Date().toISOString()
                },
                {
                    type: 'notification',
                    title: 'Verification Needed',
                    message: 'Help verify a nearby issue and earn +15 points',
                    icon: '👥',
                    timestamp: new Date().toISOString()
                }
            ];
            
            const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
            this.emit('notification', randomNotification);
            console.log('📡 WebSocket notification:', randomNotification.title);
        }, 30000); // Every 30 seconds
    }

    // Stop simulations
    stopSimulation() {
        if (this.workerUpdateInterval) clearInterval(this.workerUpdateInterval);
        if (this.timelineEventInterval) clearInterval(this.timelineEventInterval);
        if (this.notificationInterval) clearInterval(this.notificationInterval);
    }

    // Manually trigger an update (for testing)
    triggerUpdate(complaintId, updateType) {
        const updates = {
            worker_arrived: {
                type: 'status_change',
                complaintId,
                oldStatus: 'assigned',
                newStatus: 'in_progress',
                message: 'Worker has arrived at location',
                timestamp: new Date().toISOString()
            },
            work_complete: {
                type: 'status_change',
                complaintId,
                oldStatus: 'in_progress',
                newStatus: 'resolved',
                message: 'Work completed successfully',
                timestamp: new Date().toISOString()
            },
            photo_uploaded: {
                type: 'timeline_event',
                complaintId,
                event: {
                    id: Date.now(),
                    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                    timestamp: new Date().toISOString(),
                    status: 'resolved',
                    title: 'PHOTO UPLOADED',
                    description: 'Worker uploaded completion photo',
                    icon: '📸',
                    color: '#10B981',
                    actor: 'Worker'
                },
                timestamp: new Date().toISOString()
            }
        };

        const update = updates[updateType];
        if (update) {
            this.emit('update', update);
            console.log('📡 Manual WebSocket update triggered:', updateType);
        }
    }
}

// Create singleton instance
const mockWebSocket = new MockWebSocket();

export default mockWebSocket;
