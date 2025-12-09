import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HardHat, Lock, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { mockWorkers } from '../../data/mock';

const WorkerLogin = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone) {
      toast.error('Please enter phone number');
      return;
    }
    // Check if worker exists (mock)
    const worker = mockWorkers.find(w => w.phone === phone);
    if (!worker) {
      toast.error('Number not registered as a field worker');
      return;
    }
    
    setShowOtp(true);
    toast.success(`OTP sent to ${phone}`);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (otp === '1234') { // Mock OTP
      const worker = mockWorkers.find(w => w.phone === phone);
      localStorage.setItem('currentWorker', JSON.stringify(worker));
      toast.success(`Welcome, ${worker.name}`);
      navigate('/worker/dashboard');
    } else {
      toast.error('Invalid OTP (Try 1234)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 text-white">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-orange-600">
            <HardHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Field Agent App</h1>
          <p className="text-gray-400">GrievanceGenie Worker Portal</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          {!showOtp ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 text-white focus:outline-none focus:border-orange-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-400">Enter OTP sent to {phone}</p>
                <button 
                  type="button" 
                  onClick={() => setShowOtp(false)}
                  className="text-xs text-orange-400 hover:underline mt-1"
                >
                  Change Number
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  One Time Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 text-white focus:outline-none focus:border-orange-500 tracking-widest text-lg"
                    placeholder="• • • •"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Verify & Login
              </button>
            </form>
          )}
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              For registered municipal contractors only.
            </p>
            <p className="text-xs text-gray-600 mt-2">
               Demo Number: +919876543210 (Raju)
            </p>
        </div>
      </div>
    </div>
  );
};

export default WorkerLogin;
