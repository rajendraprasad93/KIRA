import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { loginOfficer } from '../../data/mock';

const OfficerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      const officer = loginOfficer(email, password);
      if (officer) {
        // Simulate session
        localStorage.setItem('currentUser', JSON.stringify(officer));
        toast.success(`Welcome back, ${officer.name}`);
        navigate('/officer/dashboard');
      } else {
        // For demo, if not found, suggest registering
        toast.error('Invalid credentials. If you are new, please register.');
      }
    } else {
      toast.error('Please enter email and password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="card w-full max-w-sm p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(0, 61, 130, 0.1)' }}>
            <Shield className="w-8 h-8" style={{ color: 'var(--primary)' }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
            Official Login
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Access the GrievanceGenie officer portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              Email ID
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full pl-10"
                placeholder="officer@city.gov.in"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn-primary w-full py-3 mt-2"
          >
            Login to Dashboard
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span style={{ color: 'var(--text-secondary)' }}>New officer? </span>
          <button 
            onClick={() => navigate('/officer/register')}
            className="font-semibold hover:underline"
            style={{ color: 'var(--primary)' }}
          >
            Register Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfficerLogin;