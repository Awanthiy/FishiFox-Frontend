
import React from 'react';
import { BellRing, Globe, ShieldCheck, Server, AlertCircle } from 'lucide-react';
import { ServiceType } from '../types';

const mockExpirations = [
  { id: '1', item: 'fishifox.com', project: 'Internal Ops', type: ServiceType.DOMAIN, date: '13 Nov. 2023', days: 5 },
  { id: '2', item: 'Site SSL Root', project: 'SoftVibe Redesign', type: ServiceType.SSL, date: '25 Mar 2024', days: 15 },
  { id: '3', item: 'Production Cluster', project: 'Duro Tires', type: ServiceType.HOSTING, date: '10 Jan 2024', days: 40 },
  { id: '4', item: 'Dev-Backup S3', project: 'Global Logistics', type: ServiceType.OTHER, date: '02 Feb 2024', days: -30 },
];

const Expirations: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white rounded-[2rem] border border-[#F1F3FF] overflow-hidden mindskills-shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#7978E9] text-white">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] first:rounded-tl-2xl">Service Asset</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Category</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Expiry Date</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Project Mapping</th>
              <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] last:rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3FF]">
            {mockExpirations.map((item) => (
              <tr key={item.id} className="hover:bg-[#F5F7FF] transition-colors group">
                <td className="px-8 py-6">
                  <div>
                    <p className="text-xs font-black text-slate-800">{item.item}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: {item.id}00X</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex gap-1 flex-wrap">
                    <span className="px-3 py-1 bg-[#4BDBE2] text-white text-[9px] font-black uppercase rounded-lg shadow-sm">
                       {item.type}
                    </span>
                    {item.days < 7 && (
                      <span className="px-3 py-1 bg-[#FFB64D] text-white text-[9px] font-black uppercase rounded-lg shadow-sm">
                        Urgent
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6 text-xs font-black text-[#4B49AC]">
                  {item.date}
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs font-bold text-slate-500 hover:text-[#4B49AC] cursor-pointer transition-colors">{item.project}</span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 bg-[#4BDBE2] text-white rounded-lg"><Globe size={14} /></button>
                    <button className="p-2 bg-[#7978E9] text-white rounded-lg"><BellRing size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-8 bg-[#F5F7FF]/50 border-t border-[#F1F3FF] flex items-center justify-center">
            <div className="inline-flex gap-2">
               <button className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-xs font-bold text-[#4B49AC] hover:bg-white transition-all shadow-sm">First</button>
               <button className="px-4 py-2 bg-[#4B49AC] rounded-lg text-xs font-bold text-white shadow-lg shadow-[#4B49AC]/20">1</button>
               <button className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-xs font-bold text-slate-400 hover:bg-white transition-all">Last</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Expirations;
