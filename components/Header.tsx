
import React from 'react';
import { Search, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    db.logout();
    window.dispatchEvent(new Event('auth-change'));
    navigate('/signin');
  };

  return (
    <header className="h-24 flex items-center justify-between px-10 border-b border-[#F1F3FF] shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-6 flex-1">
        <div className="flex items-center gap-3 flex-1 max-xl">
          <div className="relative flex items-center bg-[#F5F7FF] border border-[#F1F3FF] rounded-2xl px-5 py-3 w-full shadow-inner focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <Search size={16} className="text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search everything..." 
              className="bg-transparent border-none outline-none text-xs w-full font-bold text-slate-700"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
         <button className="p-3 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all relative group">
           <Bell size={22} />
           <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
         </button>

         <div className="h-10 w-px bg-[#F1F3FF]"></div>

         <div className="flex items-center gap-4 pl-2 group relative">
            <div className="text-right hidden md:block">
               <p className="text-[11px] font-black text-[#2F2F2F] uppercase tracking-tight leading-none">Felix Tondura</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Administrator</p>
            </div>
            
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 p-0.5 border border-primary/5 group-hover:border-primary/20 transition-all overflow-hidden">
                 <img 
                   src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                   alt="user" 
                   className="w-full h-full rounded-[0.9rem] object-cover bg-white"
                 />
              </div>
              <button 
                onClick={handleLogout}
                className="absolute -top-1 -right-1 p-1.5 bg-rose-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110 active:scale-95"
                title="Sign Out"
              >
                <LogOut size={12} />
              </button>
            </div>
         </div>
      </div>
    </header>
  );
};

export default Header;
