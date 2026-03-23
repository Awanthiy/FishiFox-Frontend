import React, { useEffect, useState } from 'react';
import { FileText, Edit3, Trash2, Download, Plus, Mail } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL;

const InvoiceStatus = {
  PAID: 'PAID',
  PENDING: 'PENDING',
  OVERDUE: 'OVERDUE',
} as const;

interface Invoice {
  id: number;
  invoice_number: string;
  customer_name: string;
  customer_email?: string;
  currency: string;
  amount: number;
  date: string;
  status: keyof typeof InvoiceStatus;
}

interface InvoiceForm {
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  amount: string;
  currency: string;
  billing_date: string;
  status: keyof typeof InvoiceStatus;
}

const emptyForm: InvoiceForm = {
  invoice_number: '',
  customer_name: '',
  customer_email: '',
  amount: '0',
  currency: 'LKR',
  billing_date: '',
  status: InvoiceStatus.PENDING,
};

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<InvoiceForm>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [sendingEmailId, setSendingEmailId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  async function fetchInvoices(signal?: AbortSignal) {
    const res = await fetch(`${API_BASE}/invoices`, { signal });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    setInvoices(Array.isArray(json) ? json : json?.data ?? []);
  }

  async function refresh() {
    setLoading(true);
    try {
      await fetchInvoices();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        await fetchInvoices(controller.signal);
      } catch (e: unknown) {
        if ((e as DOMException).name !== 'AbortError') console.error(e);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  function openCreate() {
    setMode('create');
    setEditingId(null);
    setForm({ ...emptyForm });
    setIsModalOpen(true);
  }

  function openEdit(inv: Invoice) {
    setMode('edit');
    setEditingId(inv.id);
    setForm({
      invoice_number: inv.invoice_number || '',
      customer_name: inv.customer_name || '',
      customer_email: inv.customer_email || '',
      amount: String(inv.amount ?? 0),
      currency: inv.currency || 'LKR',
      billing_date: inv.date || '',
      status: inv.status || InvoiceStatus.PENDING,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSaving(false);
  }

  async function handleSave() {
    const payload = {
      invoice_number: form.invoice_number.trim() || null,
      customer_name: form.customer_name.trim(),
      customer_email: form.customer_email.trim() || null,
      amount: Number(form.amount || 0),
      currency: form.currency.trim() || 'LKR',
      billing_date: form.billing_date.trim() || null,
      status: form.status,
    };

    if (!payload.customer_name) {
      alert('Customer name is required');
      return;
    }

    if (payload.customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.customer_email)) {
      alert('Enter a valid customer email');
      return;
    }

    if (Number.isNaN(payload.amount) || payload.amount < 0) {
      alert('Amount must be 0 or more');
      return;
    }

    try {
      setSaving(true);

      if (mode === 'create') {
        const res = await fetch(`${API_BASE}/invoices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
      } else if (editingId !== null) {
        const res = await fetch(`${API_BASE}/invoices/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
      }

      closeModal();
      await refresh();
    } catch (e: unknown) {
      console.error(e);
      alert('Save failed. Check backend logs / network tab.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this invoice?')) return;

    try {
      const res = await fetch(`${API_BASE}/invoices/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      await refresh();
    } catch (e: unknown) {
      console.error(e);
      alert('Delete failed. Check backend logs / network tab.');
    }
  }

  async function handleDownload(id: number, invoiceNumber?: string) {
    try {
      setDownloadingId(id);

      const res = await fetch(`${API_BASE}/invoices/${id}/download`, {
        method: 'GET',
      });

      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber || 'invoice'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (e: unknown) {
      console.error(e);
      alert('PDF download failed. Check backend / network tab.');
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleSendEmail(id: number) {
    try {
      setSendingEmailId(id);

      const res = await fetch(`${API_BASE}/invoices/${id}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error(await res.text());

      alert('Invoice email sent successfully.');
    } catch (e: unknown) {
      console.error(e);
      alert('Email send failed. Check backend / network tab.');
    } finally {
      setSendingEmailId(null);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="flex items-center gap-3 bg-[#4B49AC] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#4B49AC]/20 hover:-translate-y-0.5 transition-all"
        >
          <Plus size={18} />
          Add Invoice
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-[#F1F3FF] overflow-hidden mindskills-shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#7978E9] text-white">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] first:rounded-tl-2xl">
                Invoice Number
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">
                Customer Entity
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">
                Customer Email
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">
                Value
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">
                Billing Date
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">
                Status
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-right last:rounded-tr-2xl">
                Management
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F1F3FF]">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-8 py-10 text-sm font-black text-slate-400">
                  Loading invoices...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-20 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                  No invoices found in database.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#F5F7FF] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F1F3FF] text-[#4B49AC] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText size={18} />
                      </div>
                      <span className="text-xs font-black text-slate-800 tracking-tight">
                        {inv.invoice_number}
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-slate-700">{inv.customer_name}</p>
                  </td>

                  <td className="px-8 py-5">
                    <p className="text-xs font-medium text-slate-500">
                      {inv.customer_email || '—'}
                    </p>
                  </td>

                  <td className="px-8 py-5">
                    <p className="text-xs font-black text-[#4B49AC]">
                      {inv.currency} {Number(inv.amount ?? 0).toLocaleString()}
                    </p>
                  </td>

                  <td className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {inv.date || '—'}
                  </td>

                  <td className="px-8 py-5">
                    <span
                      className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        inv.status === InvoiceStatus.PAID
                          ? 'bg-[#4BDBE2] text-white'
                          : inv.status === InvoiceStatus.PENDING
                          ? 'bg-[#FFB64D] text-white'
                          : 'bg-[#4B49AC] text-white'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDownload(inv.id, inv.invoice_number)}
                        disabled={downloadingId === inv.id}
                        title="Download PDF"
                        className="p-2 bg-emerald-500 text-white rounded-lg shadow-sm disabled:opacity-50"
                      >
                        <Download size={14} />
                      </button>

                      <button
                        onClick={() => handleSendEmail(inv.id)}
                        disabled={sendingEmailId === inv.id || !inv.customer_email}
                        title={inv.customer_email ? 'Send Invoice Email' : 'No customer email'}
                        className="p-2 bg-sky-500 text-white rounded-lg shadow-sm disabled:opacity-50"
                      >
                        <Mail size={14} />
                      </button>

                      <button
                        onClick={() => openEdit(inv)}
                        className="p-2 bg-[#7978E9] text-white rounded-lg shadow-sm"
                        title="Edit Invoice"
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="p-2 bg-rose-500 text-white rounded-lg shadow-sm"
                        title="Delete Invoice"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-[999]"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-xl bg-white rounded-[2rem] border border-[#F1F3FF] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 space-y-5">
              <h2 className="text-xl font-black text-slate-800">
                {mode === 'create' ? 'Create Invoice' : 'Edit Invoice'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Invoice Number"
                  value={form.invoice_number}
                  onChange={(e) => setForm((prev) => ({ ...prev, invoice_number: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E6E9FF] outline-none"
                />

                <input
                  type="text"
                  placeholder="Customer Name"
                  value={form.customer_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, customer_name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E6E9FF] outline-none"
                />

                <input
                  type="email"
                  placeholder="Customer Email"
                  value={form.customer_email}
                  onChange={(e) => setForm((prev) => ({ ...prev, customer_email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E6E9FF] outline-none md:col-span-2"
                />

                <input
                  type="number"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E6E9FF] outline-none"
                />

                <input
                  type="text"
                  placeholder="Currency"
                  value={form.currency}
                  onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E6E9FF] outline-none"
                />

                <input
                  type="date"
                  value={form.billing_date}
                  onChange={(e) => setForm((prev) => ({ ...prev, billing_date: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E6E9FF] outline-none"
                />

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      status: e.target.value as keyof typeof InvoiceStatus,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#E6E9FF] outline-none"
                >
                  <option value={InvoiceStatus.PENDING}>Pending</option>
                  <option value={InvoiceStatus.PAID}>Paid</option>
                  <option value={InvoiceStatus.OVERDUE}>Overdue</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-[#4B49AC] text-white font-bold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : mode === 'create' ? 'Create Invoice' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;