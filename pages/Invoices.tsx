
import React, { useState, useEffect } from 'react';
import { FileText, Edit3, Trash2, Download } from 'lucide-react';
import { InvoiceStatus, Invoice } from '../types';
import { db } from '../db';

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Fetch invoices asynchronously on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      const data = await db.getInvoices();
      setInvoices(data);
    };
    fetchInvoices();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white rounded-[2rem] border border-[#F1F3FF] overflow-hidden mindskills-shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#7978E9] text-white">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] first:rounded-tl-2xl">Invoice Number</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Customer Entity</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Value</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Billing Date</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-right last:rounded-tr-2xl">Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3FF]">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-[#F5F7FF] transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F1F3FF] text-[#4B49AC] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText size={18} />
                    </div>
                    <span className="text-xs font-black text-slate-800 tracking-tight">{inv.invoice_number}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <p className="text-xs font-bold text-slate-700">{inv.customer_name}</p>
                </td>
                <td className="px-8 py-5">
                  <p className="text-xs font-black text-[#4B49AC]">LKR {inv.amount.toLocaleString()}</p>
                </td>
                <td className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {inv.date}
                </td>
                <td className="px-8 py-5">
                  <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                    inv.status === InvoiceStatus.PAID ? 'bg-[#4BDBE2] text-white' :
                    inv.status === InvoiceStatus.PENDING ? 'bg-[#FFB64D] text-white' :
                    'bg-[#4B49AC] text-white'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-emerald-500 text-white rounded-lg shadow-sm"><Download size={14} /></button>
                    <button className="p-2 bg-[#7978E9] text-white rounded-lg shadow-sm"><Edit3 size={14} /></button>
                    <button className="p-2 bg-rose-500 text-white rounded-lg shadow-sm"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && (
          <div className="p-20 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">No invoices found in database.</div>
        )}
        <div className="p-6 bg-[#F5F7FF]/50 border-t border-[#F1F3FF] flex items-center justify-center gap-2">
           <button className="w-8 h-8 rounded-lg border border-[#CBD5E1] text-[#4B49AC] font-black text-xs flex items-center justify-center hover:bg-white transition-colors">1</button>
           <button className="w-8 h-8 rounded-lg border border-[#CBD5E1] text-slate-400 font-black text-xs flex items-center justify-center hover:bg-white transition-colors">2</button>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
