import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, HardHat, ArrowRight } from 'lucide-react';

const UnifiedPortal = () => {
  const navigate = useNavigate();

  const portals = [
    {
      title: 'Citizen Portal',
      description: 'Report issues, track status, and help your community.',
      icon: <Users className="w-12 h-12 text-blue-600" />,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      action: () => navigate('/citizen'),
      btnText: 'Enter as Citizen'
    },
    {
      title: 'Government Official',
      description: 'Manage complaints, assign tasks, and monitor city status.',
      icon: <Shield className="w-12 h-12 text-indigo-600" />,
      color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
      action: () => navigate('/officer/login'),
      btnText: 'Officer Login'
    },
    {
      title: 'Field Worker',
      description: 'View assigned tasks, update status, and upload proof.',
      icon: <HardHat className="w-12 h-12 text-orange-600" />,
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      action: () => navigate('/worker/login'),
      btnText: 'Worker Login'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <div className="inline-block p-4 rounded-2xl bg-white shadow-lg mb-6">
          <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            GrievanceGenie
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-700">Select Your Portal</h1>
        <p className="text-slate-500 mt-2">Welcome to the city's civic issue management system</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl w-full">
        {portals.map((portal, idx) => (
          <div 
            key={idx}
            className={`card group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl border-2 ${portal.color}`}
            onClick={portal.action}
          >
            <div className="flex flex-col items-center text-center p-6">
              <div className="mb-6 p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                {portal.icon}
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">{portal.title}</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {portal.description}
              </p>
              <button className="flex items-center gap-2 font-semibold text-slate-700 group-hover:text-black transition-colors">
                {portal.btnText} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-slate-400 text-sm">
        © 2025 Smart City Initiative
      </div>
    </div>
  );
};

export default UnifiedPortal;
