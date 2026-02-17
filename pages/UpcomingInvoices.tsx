
import React, { useState, useEffect } from 'react';
import { CalendarClock, CheckCircle2, MoreVertical, Repeat } from 'lucide-react';
import { Invoice, RecurrencePeriod, InvoiceStatus } from '../types';
import { db } from '../db';

const UpcomingInvoices: React.FC = () => {
  // Use state to store the list of upcoming invoices after they are fetched
  const [upcoming, setUpcoming] = useState<Invoice[]>([]);

  // Fetch invoices asynchronously and filter them in useEffect
  useEffect(() => {
    const fetchUpcomingInvoices = async () => {
      const data = await db.getInvoices();
      const filtered = data.filter(i => i.is_recurring && i.status !== InvoiceStatus.PAID);
      setUpcoming(filtered);
    };
    fetchUpcomingInvoices();
  }, []);

  const handleGenerate = (invoice: Invoice) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newInvoice: Invoice = {
      ...invoice,
      id: newId,
      invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`,
      status: InvoiceStatus.PENDING,
      date: new Date().toISOString().split('T')[0],
      is_recurring: false // The generated instance is not recurring itself
    };
    
    db.addInvoice(newInvoice);
    alert(`System Action: Executed generation for ${invoice.customer_name}. Record saved to Database.`);
    setUpcoming(upcoming.filter(u => u.id !== invoice.id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white rounded-[2.5rem] border border-[#F1F3FF] overflow-hidden mindskills-shadow">
        <div className="p-8 border-b border-[#F1F3FF] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-logo font-black text-[#2F2F2F] tracking-tight">Recurring Ledger</h2>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Pending automation tasks for the next 30 days</p>
          </div>
          <button className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all shrink-0">
             <Repeat size={18} />
             New Automation
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#7978E9] text-white">
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Customer Entity</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Cadence</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Unit Value</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Next Run</th>
                <th className="px-10 py-6 text-right text-[11px] font-black uppercase tracking-[0.2em]">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3FF]">
              {upcoming.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#F5F7FF] transition-colors group">
                  <td className="px-10 py-7">
                    <div>
                      <p className="text-sm font-black text-slate-800 tracking-tight">{inv.customer_name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Template ID: {inv.invoice_number}</p>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <span className="px-4 py-1.5 bg-[#E0F9FA] text-[#4BDBE2] rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#4BDBE2]/10">
                      {inv.recurrence_period}
                    </span>
                  </td>
                  <td className="px-10 py-7">
                    <p className="text-sm font-black text-primary">LKR {inv.amount.toLocaleString()}</p>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-2">
                      <CalendarClock size={14} className="text-primary" />
                      <span className="text-[11px] text-slate-700 font-black">Scheduled</span>
                    </div>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleGenerate(inv)}
                        className="flex items-center gap-2 bg-[#4BDBE2] text-white hover:opacity-90 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#4BDBE2]/20"
                      >
                        <CheckCircle2 size={14} />
                        Execute
                      </button>
                      <button className="p-3 text-slate-300 hover:text-slate-600 bg-white border border-[#F1F3FF] rounded-xl">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {upcoming.length === 0 && (
            <div className="p-24 text-center">
              <div className="bg-[#F5F7FF] w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CalendarClock size={40} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Queue Depleted</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">All scheduled tasks have been processed for the current cycle.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingInvoices;
