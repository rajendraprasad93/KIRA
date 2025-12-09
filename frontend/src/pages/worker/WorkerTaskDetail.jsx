import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Camera, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { mockIssues } from '../../data/mock';
import MapComponent from '../../components/MapComponent';

const WorkerTaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // In real app, fetch task by ID
    const foundTask = mockIssues.find(i => i.id === taskId);
    if (foundTask) {
      setTask(foundTask);
      setStatus(foundTask.status);
    }
  }, [taskId]);

  if (!task) return <div className="p-4 text-white">Loading task...</div>;

  const handleStatusUpdate = (newStatus) => {
    // Mock update
    setStatus(newStatus);
    task.status = newStatus; // Mutating mock directly for demo updates
    if (newStatus === 'resolved') {
      toast.success('Task marked as COMPLETED! Good job.');
      setTimeout(() => navigate('/worker/dashboard'), 1500);
    } else {
      toast.success(`Status updated to: ${newStatus.replace('_', ' ')}`);
    }
  };

  const handlePhotoUpload = () => {
    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      toast.success('Evidence photo uploaded successfully');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-6 relative">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center gap-4 sticky top-0 z-10 shadow-md">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-gray-300" />
        </button>
        <div>
          <h1 className="font-bold text-lg">Task Details</h1>
          <p className="text-xs text-gray-400">{taskId}</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Map Preview */}
        <div className="h-48 rounded-xl overflow-hidden border border-gray-700 bg-gray-800 relative group">
          <MapComponent 
            position={task.coordinates} 
            interactive={false} 
            height="100%"
          />
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${task.coordinates.lat},${task.coordinates.lng}`}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-3 right-3 bg-blue-600 text-white text-xs px-3 py-2 rounded-full shadow-lg font-bold"
          >
            Open Navigation
          </a>
        </div>

        {/* Info Card */}
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 space-y-4">
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wider">Issue Category</span>
            <div className="font-semibold text-lg">{task.categoryName}</div>
          </div>
          
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wider">Description</span>
            <p className="text-gray-300 leading-relaxed mt-1">
              {task.description}
            </p>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
            <div className="text-sm text-gray-300">{task.location}</div>
          </div>
        </div>

        {/* Action Zone */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Update Status</h3>
          
          {status === 'assigned' && (
            <button
              onClick={() => handleStatusUpdate('in_progress')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all active:scale-95"
            >
              <Clock className="w-5 h-5" />
              Start Work
            </button>
          )}

          {status === 'in_progress' && (
            <div className="space-y-3">
              <div 
                onClick={handlePhotoUpload}
                className="border-2 border-dashed border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-800 transition-colors"
              >
                <Camera className="w-8 h-8 text-orange-500" />
                <span className="text-sm text-gray-400">
                  {uploading ? 'Uploading...' : 'Tap to capture completion photo'}
                </span>
              </div>

              <button
                onClick={() => handleStatusUpdate('resolved')}
                disabled={uploading}
                className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5" />
                Mark as Completed
              </button>
            </div>
          )}

          {status === 'resolved' && (
             <div className="bg-green-900/30 border border-green-900 text-green-200 p-4 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6" />
                <div>
                   <div className="font-bold">Task Completed</div>
                   <div className="text-xs opacity-75">Good job! Return to dashboard.</div>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerTaskDetail;
