
import React from 'react';
import { Settings, Plus, DollarSign, Clock, Search, MoreVertical, LayoutGrid } from 'lucide-react';

const mockServices = [
  { id: '1', name: 'Custom Web Development', price: 150000, cost: 45000, currency: 'LKR', time: '4-8 Weeks', icon: '💻' },
  { id: '2', name: 'Mobile App (iOS/Android)', price: 450000, cost: 120000, currency: 'LKR', time: '12-16 Weeks', icon: '📱' },
  { id: '3', name: 'Cloud Server Setup', price: 250, cost: 45, currency: 'USD', time: '1 Week', icon: '☁️' },
  { id: '4', name: 'Monthly Maintenance', price: 15000, cost: 2000, currency: 'LKR', time: 'Monthly', icon: '🛠️' },
];

const Services: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#2F2F2F] tracking-tight">Service Catalog</h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Management of standardized product units</p>
        </div>
        <button className="flex items-center gap-3 bg-[#4B49AC] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#4B49AC]/20 hover:-translate-y-0.5 transition-all">
          <Plus size={18} />
          Define New Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {mockServices.map((service) => (
          <div key={service.id} className="bg-white p-8 rounded-[3rem] border border-[#F1F3FF] mindskills-shadow group hover:border-[#4B49AC]/20 transition-all">
            <div className="flex items-center justify-between mb-8">
              <div className="w-16 h-16 bg-[#F5F7FF] rounded-[2rem] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner border border-[#F1F3FF]">
                {service.icon}
              </div>
              <button className="p-2 text-slate-300 hover:text-[#4B49AC] transition-colors">
                 <MoreVertical size={20} />
              </button>
            </div>
            
            <div className="mb-8">
               <h3 className="text-lg font-black text-[#2F2F2F] tracking-tight leading-tight min-h-[50px]">{service.name}</h3>
               <div className="flex items-center gap-2 mt-3">
                  <span className="w-2 h-2 rounded-full bg-[#4BDBE2]"></span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profit Optimized</span>
               </div>
            </div>
            
            <div className="space-y-5 pt-8 border-t border-[#F1F3FF]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <DollarSign size={14} className="text-[#4B49AC]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Rate</span>
                </div>
                <span className="text-sm font-black text-[#4B49AC]">{service.currency} {service.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">SLA</span>
                </div>
                <span className="text-[11px] font-bold text-slate-600">{service.time}</span>
              </div>
            </div>
            
            <button className="mt-8 w-full py-3.5 bg-[#F5F7FF] text-[#4B49AC] rounded-2xl text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-[#4B49AC]/20 hover:bg-white transition-all">
               Edit Parameters
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
