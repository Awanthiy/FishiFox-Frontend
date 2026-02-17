
import React from 'react';
import { FileBadge, Plus, Search, CheckCircle, Clock, XCircle, MoreVertical, FileText, Send } from 'lucide-react';

const mockQuotes = [
  { id: '1', number: 'QT-8801', customer: 'SoftVibe Solutions', amount: 'LKR 250,000', status: 'Pending', date: 'Mar 15, 2024' },
  { id: '2', number: 'QT-8805', customer: 'Global Logistics', amount: 'LKR 1,450,000', status: 'Approved', date: 'Mar 10, 2024' },
  { id: '3', number: 'QT-8808', customer: 'Ceylon Tea', amount: 'USD 1,200', status: 'Rejected', date: 'Mar 01, 2024' },
];

const Quotations: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white rounded-[2.5rem] border border-[#F1F3FF] overflow-hidden mindskills-shadow">
        <div className="p-8 border-b border-[#F1F3FF] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-[#2F2F2F] tracking-tight">Estimates Vault</h2>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Proposal history and conversion tracking</p>
          </div>
          <button className="flex items-center gap-3 bg-[#4B49AC] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#4B49AC]/20 hover:-translate-y-0.5 transition-all shrink-0">
             <Send size={18} />
             New Estimate
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#7978E9] text-white">
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Quote Reference</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Customer Entity</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Projected Value</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Date</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em]">State</th>
                <th className="px-10 py-6 text-right text-[11px] font-black uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3FF]">
              {mockQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-[#F5F7FF] transition-colors group">
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#F1F3FF] text-[#4B49AC] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                        <FileBadge size={18} />
                      </div>
                      <span className="text-xs font-black text-slate-800 tracking-tight">{quote.number}</span>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <span className="text-xs font-bold text-slate-600">{quote.customer}</span>
                  </td>
                  <td className="px-10 py-7">
                    <span className="text-sm font-black text-[#4B49AC]">{quote.amount}</span>
                  </td>
                  <td className="px-10 py-7 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    {quote.date}
                  </td>
                  <td className="px-10 py-7">
                    {quote.status === 'Approved' ? (
                      <span className="px-4 py-1.5 bg-[#E0F9FA] text-[#4BDBE2] text-[9px] font-black uppercase tracking-widest rounded-xl border border-[#4BDBE2]/10 flex items-center gap-1.5 w-fit">
                        <CheckCircle size={12} /> Approved
                      </span>
                    ) : quote.status === 'Rejected' ? (
                      <span className="px-4 py-1.5 bg-[#FFF1F2] text-[#E11D48] text-[9px] font-black uppercase tracking-widest rounded-xl border border-[#E11D48]/10 flex items-center gap-1.5 w-fit">
                        <XCircle size={12} /> Rejected
                      </span>
                    ) : (
                      <span className="px-4 py-1.5 bg-[#F5F7FF] text-[#4B49AC] text-[9px] font-black uppercase tracking-widest rounded-xl border border-[#4B49AC]/10 flex items-center gap-1.5 w-fit">
                        <Clock size={12} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex items-center justify-end gap-3">
                       {quote.status === 'Approved' && (
                        <button className="bg-[#4BDBE2] text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 shadow-lg shadow-[#4BDBE2]/20 transition-all flex items-center gap-2">
                          <FileText size={12} /> Convert
                        </button>
                      )}
                      <button className="p-3 bg-white border border-[#F1F3FF] text-slate-300 hover:text-slate-600 rounded-xl">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Quotations;
