
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Shield, 
  Bell, 
  Database, 
  Palette, 
  CreditCard, 
  Mail, 
  Lock,
  ChevronRight,
  Camera,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { db } from '../db';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isWiping, setIsWiping] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: <User size={18} />, desc: 'Personal details and identity' },
    { id: 'security', label: 'Security', icon: <Shield size={18} />, desc: 'Password and authentication' },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} />, desc: 'Alerts and system updates' },
    { id: 'billing', label: 'Billing & Plans', icon: <CreditCard size={18} />, desc: 'Subscription and invoices' },
    { id: 'database', label: 'System & Database', icon: <Database size={18} />, desc: 'Manage local data cache' },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} />, desc: 'UI theme and customization' },
  ];

  const handleWipeDatabase = () => {
    if (confirm('CRITICAL ACTION: This will permanently delete all local records, customers, and active sessions. This cannot be undone. Proceed?')) {
      setIsWiping(true);
      setTimeout(() => {
        db.clearAll();
        window.dispatchEvent(new Event('auth-change'));
        navigate('/signin');
      }, 1500);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-80 space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left p-6 rounded-[2rem] transition-all flex items-center gap-4 border group ${
                activeSection === item.id 
                ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' 
                : 'bg-white text-slate-500 border-[#F1F3FF] hover:border-primary/20 hover:bg-slate-50'
              }`}
            >
              <div className={`p-3 rounded-2xl transition-all ${
                activeSection === item.id ? 'bg-white/10' : 'bg-primary/5 text-primary'
              }`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-black tracking-tight ${activeSection === item.id ? 'text-white' : 'text-[#2F2F2F]'}`}>
                  {item.label}
                </p>
                <p className={`text-[10px] font-bold truncate mt-0.5 ${activeSection === item.id ? 'text-white/60' : 'text-slate-400'}`}>
                  {item.desc}
                </p>
              </div>
              <ChevronRight size={16} className={`transition-all ${activeSection === item.id ? 'opacity-100 translate-x-1' : 'opacity-0'}`} />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-[3rem] border border-[#F1F3FF] mindskills-shadow p-10 lg:p-14 min-h-[500px]">
            {activeSection === 'profile' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 p-1 border border-[#F1F3FF] overflow-hidden">
                      <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                        alt="Profile" 
                        className="w-full h-full rounded-[2.2rem] object-cover bg-white"
                      />
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-lg hover:scale-110 transition-all border-4 border-white">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl font-black text-[#2F2F2F] tracking-tight">Felix Tondura</h3>
                    <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Administrator Account</p>
                    <div className="flex items-center gap-2 mt-4 text-secondary">
                       <CheckCircle2 size={14} />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Identity</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[#F1F3FF]">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity</label>
                    <div className="relative flex items-center bg-slate-50 border border-[#F1F3FF] rounded-2xl px-5 py-4 w-full focus-within:bg-white transition-all group">
                      <User size={16} className="text-primary mr-3" />
                      <input type="text" defaultValue="Felix Tondura" className="bg-transparent border-none outline-none text-sm w-full font-bold text-[#2F2F2F]" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Terminal</label>
                    <div className="relative flex items-center bg-slate-50 border border-[#F1F3FF] rounded-2xl px-5 py-4 w-full focus-within:bg-white transition-all group">
                      <Mail size={16} className="text-primary mr-3" />
                      <input type="email" defaultValue="felix@fishifox.com" className="bg-transparent border-none outline-none text-sm w-full font-bold text-[#2F2F2F]" />
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex justify-end">
                  <button className="bg-primary text-white px-10 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-2xl shadow-primary/25 hover:-translate-y-1 transition-all">
                    Synchronize Changes
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'database' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                   <h3 className="text-2xl font-black text-[#2F2F2F] tracking-tight">System & Data Control</h3>
                   <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Management of local storage and environment state</p>
                </div>

                <div className="p-10 bg-rose-50 rounded-[3rem] border border-rose-100 space-y-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12">
                      <AlertTriangle size={120} className="text-rose-600" />
                   </div>
                   
                   <div className="relative z-10">
                     <div className="flex items-center gap-3 text-rose-600 mb-4">
                        <AlertTriangle size={24} />
                        <h4 className="text-lg font-black uppercase tracking-tight">Danger Zone</h4>
                     </div>
                     <p className="text-rose-900/60 font-medium leading-relaxed max-w-xl">
                        Removing the database will purge all localized records including customers, projects, and invoices. This action is intended for system resets or clearing private data before environment migration.
                     </p>
                   </div>

                   <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                      <button 
                        onClick={handleWipeDatabase}
                        disabled={isWiping}
                        className="flex items-center justify-center gap-3 bg-rose-600 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all disabled:opacity-50"
                      >
                        {isWiping ? (
                          <RefreshCw size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                        {isWiping ? 'Purging Systems...' : 'Wipe Local Database'}
                      </button>
                      <button className="flex items-center justify-center gap-3 bg-white text-rose-600 border border-rose-200 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all">
                        Download Backup (.JSON)
                      </button>
                   </div>
                </div>

                <div className="space-y-4">
                   <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Environment</h5>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Storage Driver</p>
                         <p className="text-sm font-black text-slate-800 mt-1">LocalStorage V2</p>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                         <p className="text-[10px] font-bold text-slate-400 uppercase">System Status</p>
                         <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <p className="text-sm font-black text-slate-800">Synchronized</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {['security', 'notifications', 'billing', 'appearance'].includes(activeSection) && (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner border border-[#F1F3FF]">
                  {menuItems.find(m => m.id === activeSection)?.icon}
                </div>
                <h3 className="text-2xl font-black text-[#2F2F2F] tracking-tight capitalize">{activeSection} Module</h3>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2 max-w-xs">
                  This configuration panel is currently being optimized for Fishifox V2 architecture.
                </p>
                <button className="mt-10 px-8 py-3 bg-slate-50 text-primary border border-primary/10 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all">
                  Request Beta Access
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
