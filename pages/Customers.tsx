import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Mail, Phone, MoreVertical, MapPin, User } from 'lucide-react';

type CustomerStatus = 'Active' | 'Inactive' | 'Lead';
type CustomerType = 'Individual' | 'Company';

type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  customerType: CustomerType;
  contactPerson: string | null;
  address: string | null;
  activeProjects?: number;
  totalBilled?: number;
  status: CustomerStatus;
};

type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
};

const API_BASE = import.meta.env.VITE_API_URL;

type FormState = {
  name: string;
  email: string;
  phone: string;
  customerType: CustomerType;
  contactPerson: string;
  address: string;
  status: CustomerStatus;
};

const emptyForm: FormState = {
  name: '',
  email: '',
  phone: '',
  customerType: 'Individual',
  contactPerson: '',
  address: '',
  status: 'Active',
};

const formatCurrency = (value?: number) => {
  const amount = Number(value ?? 0);
  return `LKR ${amount.toLocaleString()}`;
};

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const debouncedSearch = useMemo(() => search.trim(), [search]);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setMode('create');
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
    setOpenMenuId(null);
  }

  function openEdit(c: Customer) {
    setMode('edit');
    setEditingId(c.id);
    setForm({
      name: c.name ?? '',
      email: c.email ?? '',
      phone: c.phone ?? '',
      customerType: c.customerType ?? 'Individual',
      contactPerson: c.contactPerson ?? '',
      address: c.address ?? '',
      status: c.status ?? 'Active',
    });
    setIsModalOpen(true);
    setOpenMenuId(null);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSaving(false);
  }

  async function loadCustomers(signal?: AbortSignal) {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('per_page', String(perPage));
    if (debouncedSearch) params.set('search', debouncedSearch);

    const res = await fetch(`${API_BASE}/customers?${params.toString()}`, { signal });
    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const json = await res.json();

    if (Array.isArray(json)) {
      setCustomers(json as Customer[]);
      setTotal((json as Customer[]).length);
      setLastPage(1);
    } else {
      const paged = json as Partial<PaginatedResponse<Customer>>;
      setCustomers(paged.data ?? []);
      setTotal(paged.total ?? 0);
      setLastPage(paged.last_page ?? 1);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        await loadCustomers(controller.signal);
      } catch (e) {
        if ((e as any)?.name !== 'AbortError') console.error(e);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [page, perPage, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const showingFrom = total === 0 ? 0 : (page - 1) * perPage + 1;
  const showingTo = Math.min(page * perPage, total);

  async function handleSave() {
    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        customerType: form.customerType,
        contactPerson: form.contactPerson.trim() || null,
        address: form.address.trim() || null,
        status: form.status,
      };

      if (!payload.name) {
        alert('Name is required');
        return;
      }

      if (mode === 'create') {
        const res = await fetch(`${API_BASE}/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      } else {
        const res = await fetch(`${API_BASE}/customers/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      }

      closeModal();
      setLoading(true);
      await loadCustomers();
    } catch (e) {
      console.error(e);
      alert('Save failed. Check backend console / network tab.');
    } finally {
      setSaving(false);
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setOpenMenuId(null);
      const ok = confirm('Delete this customer?');
      if (!ok) return;

      const res = await fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);

      setLoading(true);
      await loadCustomers();
    } catch (e) {
      console.error(e);
      alert('Delete failed. Check backend console / network tab.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white rounded-[2.5rem] border border-[#F1F3FF] overflow-hidden mindskills-shadow">
        <div className="p-8 border-b border-[#F1F3FF] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-[#2F2F2F] tracking-tight">Customer Directory</h2>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">
              Manage customer records and communication details
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center bg-[#F5F7FF] border border-[#F1F3FF] rounded-2xl px-5 py-3 w-80 shadow-inner group focus-within:bg-white transition-all">
              <Search size={16} className="text-slate-400 mr-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter customers..."
                className="bg-transparent border-none outline-none text-xs w-full font-bold"
              />
            </div>

            <button
              onClick={openCreate}
              className="flex items-center gap-3 bg-[#4B49AC] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#4B49AC]/20 hover:-translate-y-0.5 transition-all shrink-0"
            >
              <Plus size={18} />
              Add Client
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-[#7978E9] text-white">
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Customer</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Type</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Communication</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Contact Person</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Address</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Summary</th>
                <th className="px-8 py-6 text-right text-[11px] font-black uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F1F3FF]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-8 py-10 text-sm font-black text-slate-400">
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-8 py-10 text-sm font-black text-slate-400">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#F5F7FF] transition-colors group">
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#F1F3FF] text-[#4B49AC] rounded-2xl flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform shadow-inner">
                          {(customer.name || '').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 tracking-tight">{customer.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            ID: #{customer.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-7">
                      <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[#F1F3FF] text-[#4B49AC]">
                        {customer.customerType}
                      </span>
                    </td>

                    <td className="px-8 py-7">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600 text-[11px] font-bold">
                          <Mail size={12} className="text-[#4B49AC]" />
                          {customer.email ?? '—'}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                          <Phone size={12} />
                          {customer.phone ?? '—'}
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-7">
                      <div className="flex items-center gap-2 text-slate-600 text-[11px] font-bold">
                        <User size={12} className="text-[#4B49AC]" />
                        {customer.contactPerson ?? '—'}
                      </div>
                    </td>

                    <td className="px-8 py-7">
                      <div className="flex items-center gap-2 text-slate-600 text-[11px] font-bold max-w-[220px]">
                        <MapPin size={12} className="text-[#4B49AC] shrink-0" />
                        <span className="truncate">{customer.address ?? '—'}</span>
                      </div>
                    </td>

                    <td className="px-8 py-7">
                      <span
                        className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                          customer.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : customer.status === 'Inactive'
                            ? 'bg-slate-200 text-slate-600'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>

                    <td className="px-8 py-7">
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-slate-600">
                          Projects: <span className="text-slate-800 font-black">{customer.activeProjects ?? 0}</span>
                        </p>
                        <p className="text-[11px] font-bold text-slate-600">
                          Billed: <span className="text-slate-800 font-black">{formatCurrency(customer.totalBilled)}</span>
                        </p>
                      </div>
                    </td>

                    <td className="px-8 py-7 text-right">
                      <div className="flex items-center justify-end gap-3 relative">
                        <button
                          onClick={() => setOpenMenuId((prev) => (prev === customer.id ? null : customer.id))}
                          className="p-3 bg-white border border-[#F1F3FF] text-slate-400 rounded-xl hover:text-slate-600"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openMenuId === customer.id && (
                          <div className="absolute right-0 top-14 w-44 bg-white border border-[#F1F3FF] rounded-2xl shadow-xl overflow-hidden z-50">
                            <button
                              onClick={() => openEdit(customer)}
                              className="w-full text-left px-5 py-3 text-xs font-black text-slate-700 hover:bg-[#F5F7FF]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(customer.id)}
                              className="w-full text-left px-5 py-3 text-xs font-black text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-10 bg-[#F5F7FF]/50 border-t border-[#F1F3FF] flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing {showingFrom}-{showingTo} of {total} Clients
          </p>

          <div className="inline-flex gap-3">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-[11px] font-black text-[#4B49AC] hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <button className="w-10 h-10 bg-[#4B49AC] rounded-xl text-[11px] font-black text-white shadow-lg shadow-[#4B49AC]/20">
              {page}
            </button>

            <button
              disabled={page >= lastPage}
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              className="px-5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-[11px] font-black text-slate-400 hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-[999]"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-[2rem] border border-[#F1F3FF] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-[#F1F3FF]">
              <h3 className="text-lg font-black text-slate-800">
                {mode === 'create' ? 'Add Client' : 'Edit Client'}
              </h3>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">
                {mode === 'create' ? 'Create a new customer record' : 'Update customer details'}
              </p>
            </div>

            <div className="p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="mt-2 w-full bg-[#F5F7FF] border border-[#F1F3FF] rounded-2xl px-4 py-3 text-sm font-bold outline-none"
                    placeholder="Customer name"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Type</label>
                  <select
                    value={form.customerType}
                    onChange={(e) => setForm((f) => ({ ...f, customerType: e.target.value as CustomerType }))}
                    className="mt-2 w-full bg-[#F5F7FF] border border-[#F1F3FF] rounded-2xl px-4 py-3 text-sm font-bold outline-none"
                  >
                    <option>Individual</option>
                    <option>Company</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="mt-2 w-full bg-[#F5F7FF] border border-[#F1F3FF] rounded-2xl px-4 py-3 text-sm font-bold outline-none"
                    placeholder="billing@company.com"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="mt-2 w-full bg-[#F5F7FF] border border-[#F1F3FF] rounded-2xl px-4 py-3 text-sm font-bold outline-none"
                    placeholder="+94 ..."
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Person</label>
                  <input
                    value={form.contactPerson}
                    onChange={(e) => setForm((f) => ({ ...f, contactPerson: e.target.value }))}
                    className="mt-2 w-full bg-[#F5F7FF] border border-[#F1F3FF] rounded-2xl px-4 py-3 text-sm font-bold outline-none"
                    placeholder="Main contact person"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as CustomerStatus }))}
                    className="mt-2 w-full bg-[#F5F7FF] border border-[#F1F3FF] rounded-2xl px-4 py-3 text-sm font-bold outline-none"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Lead</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    className="mt-2 w-full bg-[#F5F7FF] border border-[#F1F3FF] rounded-2xl px-4 py-3 text-sm font-bold outline-none min-h-[100px] resize-none"
                    placeholder="Customer address"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-[#F1F3FF] flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-3 rounded-2xl bg-white border border-[#CBD5E1] text-[11px] font-black text-slate-500 hover:shadow-md transition-all"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                onClick={handleSave}
                className="px-8 py-3 rounded-2xl bg-[#4B49AC] text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-[#4B49AC]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;