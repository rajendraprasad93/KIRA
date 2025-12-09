import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, MapPin, Calendar, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { mockIssues } from '../../data/mock';

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const storedWorker = JSON.parse(localStorage.getItem('currentWorker'));
    if (!storedWorker) {
      navigate('/worker/login');
    } else {
      setWorker(storedWorker);
    }
  }, [navigate]);

  if (!worker) return null;

  // Find assigned tasks
  const myTasks = mockIssues.filter(issue => issue.assignedWorkerId === worker.id);
  
  // Find completed tasks (mock logic for demo: status 'resolved' and assigned to me)
  const completedTasks = mockIssues.filter(issue => 
    issue.assignedWorkerId === worker.id && issue.status === 'resolved'
  );

  const activeTasks = myTasks.filter(task => task.status !== 'resolved');

  const handleLogout = () => {
    localStorage.removeItem('currentWorker');
    navigate('/worker/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Mobile App Header */}
      <header className="bg-gray-800 p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold text-orange-500">Field Agent</h1>
          <p className="text-xs text-gray-400">{worker.name}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
        >
          <LogOut className="w-5 h-5 text-gray-300" />
        </button>
      </header>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        
        {/* Status Card */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-750 p-5 rounded-xl border border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 text-sm">Target Today</span>
            <span className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded-full">On Track</span>
          </div>
          <div className="flex gap-4">
             <div className="text-center flex-1">
                <div className="text-3xl font-bold text-white">{activeTasks.length}</div>
                <div className="text-xs text-gray-400">Pending</div>
             </div>
             <div className="w-px bg-gray-700"></div>
             <div className="text-center flex-1">
                <div className="text-3xl font-bold text-green-500">{completedTasks.length}</div>
                <div className="text-xs text-gray-400">Done</div>
             </div>
          </div>
        </div>

        {/* Task List */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Assigned Tasks ({activeTasks.length})
          </h2>
          
          <div className="space-y-4">
            {activeTasks.length === 0 ? (
              <div className="text-center py-10 bg-gray-800 rounded-xl border border-dashed border-gray-700">
                <CheckCircle2 className="w-12 h-12 text-green-900 mx-auto mb-3" />
                <p className="text-gray-400">No pending tasks!</p>
              </div>
            ) : (
              activeTasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => navigate(`/worker/task/${task.id}`)}
                  className="bg-gray-800 p-4 rounded-xl border border-gray-700 active:scale-95 transition-transform cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded">
                      {task.categoryName}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.severity === 'High' ? 'bg-red-900 text-red-200' : 'bg-yellow-900 text-yellow-200'
                    }`}>
                      {task.severity} Priority
                    </span>
                  </div>
                  
                  <h3 className="font-bold mb-2 line-clamp-1">{task.description}</h3>
                  
                  <div className="space-y-2 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="line-clamp-1">{task.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Due: Tomorrow</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <span className="text-xs text-gray-500">ID: {task.id}</span>
                    <div className="flex items-center gap-1 text-orange-500 text-sm font-medium">
                      Start Work <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
