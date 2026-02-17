
import React from 'react';
import { Users, Plus, Search, Mail, Phone, ExternalLink, MoreVertical, ShieldCheck } from 'lucide-react';

const mockCustomers = [
  { id: '1', name: 'SoftVibe Solutions', email: 'billing@softvibe.com', phone: '+94 77 123 4567', activeProjects: 3, totalBilled: 'LKR 850k', status: 'Enterprise' },
  { id: '2', name: 'Global Logistics', email: 'finance@globallog.com', phone: '+94 11 999 8888', activeProjects: 1, totalBilled: 'LKR 1.2M', status: 'Premium' },
  { id: '3', name: 'Duro Tires Ltd', email: 'contact@durotires.lk', phone: '+94 71 444 5555', activeProjects: 2, totalBilled: 'LKR 45k', status: 'Regular' },
  { id: '4', name: 'Green Gardens', email: 'hello@greengardens.com', phone: '+94 70 222 1111', activeProjects: 0, totalBilled: 'LKR 0', status: 'New' },
];

const Customers: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white rounded-[2.5rem] border border-[#F1F3FF] overflow-hidden mindskills-shadow">
        <div className="p-8 border-b border-[#F1F3FF] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-[#2F2F2F] tracking-tight">Customer Directory</h2>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Manage client lifecycle and accounts</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative flex items-center bg-[#F5F7FF] border border-[#F1F3FF] rounded-2xl px-5 py-3 w-80 shadow-inner group focus-within:bg-white transition-all">
                <Search size={16} className="text-slate-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="Filter customers..." 
                  className="bg-transparent border-none outline-none text-xs w-full font-bold"
                />
             </div>
             <button className="flex items-center gap-3 bg-[#4B49AC] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#4B49AC]/20 hover:-translate-y-0.5 transition-all shrink-0">
               <Plus size={18} />
               Add Client
             </button>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#7978E9] text-white">
              <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Customer Entity</th>
              <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Communication</th>
              <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Project Load</th>
              <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Tier</th>
              <th className="px-10 py-6 text-right text-[11px] font-black uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3FF]">
            {mockCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-[#F5F7FF] transition-colors group">
                <td className="px-10 py-7">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-[#F1F3FF] text-[#4B49AC] rounded-2xl flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform shadow-inner">
                      {customer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 tracking-tight">{customer.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: #CST-00{customer.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-7">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-600 text-[11px] font-bold">
                       <Mail size={12} className="text-[#4B49AC]" />
                       {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                       <Phone size={12} />
                       {customer.phone}
                    </div>
                  </div>
                </td>
                <td className="px-10 py-7">
                  <div className="flex items-center gap-2">
                     <span className="text-sm font-black text-slate-800">{customer.activeProjects}</span>
                     <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Active</span>
                  </div>
                </td>
                <td className="px-10 py-7">
                  <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                    customer.status === 'Enterprise' ? 'bg-[#4BDBE2] text-white' :
                    customer.status === 'Premium' ? 'bg-[#7978E9] text-white' :
                    'bg-[#F1F3FF] text-[#4B49AC]'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-10 py-7 text-right">
                   <div className="flex items-center justify-end gap-3">
                      <button className="p-3 bg-white border border-[#F1F3FF] text-[#4B49AC] rounded-xl hover:shadow-md transition-all">
                        <ExternalLink size={16} />
                      </button>
                      <button className="p-3 bg-white border border-[#F1F3FF] text-slate-400 rounded-xl hover:text-slate-600">
                        <MoreVertical size={16} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="p-10 bg-[#F5F7FF]/50 border-t border-[#F1F3FF] flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing 1-4 of 42 Clients</p>
            <div className="inline-flex gap-3">
               <button className="px-5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-[11px] font-black text-[#4B49AC] hover:shadow-md transition-all">Previous</button>
               <button className="w-10 h-10 bg-[#4B49AC] rounded-xl text-[11px] font-black text-white shadow-lg shadow-[#4B49AC]/20">1</button>
               <button className="px-5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-[11px] font-black text-slate-400 hover:shadow-md transition-all">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
