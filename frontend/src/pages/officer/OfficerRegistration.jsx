import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserPlus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { registerOfficer, mockDepartments } from '../../data/mock';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

const OfficerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (value) => {
    setFormData(prev => ({ ...prev, department: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.name || !formData.email || !formData.department || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Register officer
    const newOfficer = registerOfficer({
      name: formData.name,
      email: formData.email,
      department: formData.department
    });

    // Simulate login by saving to localStorage (mock session)
    localStorage.setItem('currentUser', JSON.stringify(newOfficer));
    
    toast.success('Registration successful! Welcome to the portal.');
    navigate('/officer/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="card w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(0, 61, 130, 0.1)' }}>
            <Shield className="w-8 h-8" style={{ color: 'var(--primary)' }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
            Official Registration
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Create an account to manage civic issues
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="Officer Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              Department
            </label>
            <Select value={formData.department} onValueChange={handleDepartmentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {mockDepartments.map((dept, idx) => (
                  <SelectItem key={idx} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="official@city.gov.in"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-6"
          >
            <UserPlus className="w-5 h-5" />
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
          <button 
            onClick={() => navigate('/officer/login')}
            className="font-semibold hover:underline"
            style={{ color: 'var(--primary)' }}
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfficerRegistration;
