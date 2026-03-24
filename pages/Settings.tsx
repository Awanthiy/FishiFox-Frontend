import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  User,
  Camera,
  CheckCircle2,
  Mail,
  RefreshCw,
  ShieldCheck,
  Building2,
  Phone,
  MapPin,
  FileText,
  ImageIcon,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;

type ProfileDTO = {
  name: string;
  email: string;
  role: string;
  avatar_seed: string;
  avatar_url: string | null;
};

type AppearanceDTO = {
  theme: "light";
  accent: "purple";
  reduced_motion: boolean;
};

type CompanyUI = {
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  invoice_header: string;
  invoice_footer: string;
  company_logo_preview: string | null;
};

type SettingsDTO = {
  profile: ProfileDTO;
  appearance?: {
    theme: "system" | "light" | "dark";
    accent: "purple" | "teal" | "slate";
    reduced_motion: boolean;
  };
  company?: {
    company_name?: string;
    company_email?: string;
    company_phone?: string;
    company_address?: string;
    invoice_header?: string;
    invoice_footer?: string;
    company_logo?: string | null;
  };
};

function applyThemeLightOnly() {
  document.documentElement.classList.remove("dark");
}

function applyAccentPurpleOnly() {
  document.documentElement.setAttribute("data-accent", "purple");
}

function applyReducedMotion(on: boolean) {
  document.documentElement.classList.toggle("reduce-motion", on);
}

function persistAppearance(next: AppearanceDTO) {
  try {
    localStorage.setItem("fishifox-appearance", JSON.stringify(next));
  } catch {}
}

async function readErrorMessage(res: Response) {
  const text = await res.text();

  try {
    const json = text ? JSON.parse(text) : null;
    return json?.message || json?.error || `Request failed: ${res.status}`;
  } catch {
    return text || `Request failed: ${res.status}`;
  }
}

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);
  const [uploadingCompanyLogo, setUploadingCompanyLogo] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");

  const [profile, setProfile] = useState<ProfileDTO>({
    name: "Felix Tondura",
    email: "felix@fishifox.com",
    role: "Administrator",
    avatar_seed: "Felix",
    avatar_url: null,
  });

  const [appearance, setAppearance] = useState<AppearanceDTO>({
    theme: "light",
    accent: "purple",
    reduced_motion: false,
  });

  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const [company, setCompany] = useState<CompanyUI>({
    company_name: "",
    company_email: "",
    company_phone: "",
    company_address: "",
    invoice_header: "",
    invoice_footer: "",
    company_logo_preview: null,
  });

  const fileRef = useRef<HTMLInputElement | null>(null);
  const companyLogoRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setSaveSuccess("");

        const res = await fetch(`${API_BASE}/settings`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(await readErrorMessage(res));
        }

        const json: SettingsDTO = await res.json();

        setProfile(json.profile);
        setNameInput(json.profile.name ?? "");
        setEmailInput(json.profile.email ?? "");

        setCompany({
          company_name: json.company?.company_name ?? "",
          company_email: json.company?.company_email ?? "",
          company_phone: json.company?.company_phone ?? "",
          company_address: json.company?.company_address ?? "",
          invoice_header: json.company?.invoice_header ?? "",
          invoice_footer: json.company?.invoice_footer ?? "",
          company_logo_preview: json.company?.company_logo ?? null,
        });

        const next: AppearanceDTO = {
          theme: "light",
          accent: "purple",
          reduced_motion: !!json.appearance?.reduced_motion,
        };

        setAppearance(next);
        applyThemeLightOnly();
        applyAccentPurpleOnly();
        applyReducedMotion(next.reduced_motion);
        persistAppearance(next);

        fetch(`${API_BASE}/settings/appearance`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        }).catch(() => {});

        window.dispatchEvent(new Event("fishifox-settings-changed"));
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          console.error(e);
          alert(e?.message || "Failed to load settings");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const avatarSrc = useMemo(() => {
    if (profile.avatar_url) return profile.avatar_url;
    const seed = encodeURIComponent(profile.avatar_seed || profile.name || "User");
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  }, [profile.avatar_url, profile.avatar_seed, profile.name]);

  async function saveProfile() {
    try {
      setSavingProfile(true);
      setSaveSuccess("");

      const payload = {
        name: nameInput.trim(),
        email: emailInput.trim(),
        avatar_seed: nameInput.trim() || "User",
      };

      if (!payload.name) {
        alert("Name is required");
        return;
      }

      if (!payload.email) {
        alert("Email is required");
        return;
      }

      const res = await fetch(`${API_BASE}/settings/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await readErrorMessage(res));
      }

      const json: ProfileDTO = await res.json();

      setProfile(json);
      setNameInput(json.name ?? "");
      setEmailInput(json.email ?? "");
      setSaveSuccess("Profile updated successfully");

      applyThemeLightOnly();
      applyAccentPurpleOnly();
      applyReducedMotion(appearance.reduced_motion);

      window.dispatchEvent(new Event("fishifox-settings-changed"));
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Profile sync failed");
    } finally {
      setSavingProfile(false);
    }
  }

  async function uploadAvatar(file: File) {
    try {
      setUploadingAvatar(true);
      setSaveSuccess("");

      const fd = new FormData();
      fd.append("avatar", file);

      const res = await fetch(`${API_BASE}/settings/profile/avatar`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        throw new Error(await readErrorMessage(res));
      }

      const json: { avatar_url: string } = await res.json();

      setProfile((prev) => ({
        ...prev,
        avatar_url: json.avatar_url,
      }));

      setSaveSuccess("Avatar updated successfully");

      applyThemeLightOnly();
      applyAccentPurpleOnly();
      applyReducedMotion(appearance.reduced_motion);

      window.dispatchEvent(new Event("fishifox-settings-changed"));
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Avatar upload failed");
    } finally {
      setUploadingAvatar(false);
    }
  }

  function handleCompanyInput<K extends keyof CompanyUI>(key: K, value: CompanyUI[K]) {
    setCompany((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function saveCompany() {
    try {
      setSavingCompany(true);
      setSaveSuccess("");

      if (!company.company_name.trim()) {
        alert("Company name is required");
        return;
      }

      const payload = {
        company_name: company.company_name.trim(),
        company_email: company.company_email.trim(),
        company_phone: company.company_phone.trim(),
        company_address: company.company_address.trim(),
        invoice_header: company.invoice_header.trim(),
        invoice_footer: company.invoice_footer.trim(),
      };

      const res = await fetch(`${API_BASE}/settings/company`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await readErrorMessage(res));
      }

      const json = await res.json();

      setCompany((prev) => ({
        ...prev,
        company_name: json.company_name ?? "",
        company_email: json.company_email ?? "",
        company_phone: json.company_phone ?? "",
        company_address: json.company_address ?? "",
        invoice_header: json.invoice_header ?? "",
        invoice_footer: json.invoice_footer ?? "",
        company_logo_preview: json.company_logo ?? prev.company_logo_preview,
      }));

      setSaveSuccess("Company settings saved successfully");
      window.dispatchEvent(new Event("fishifox-settings-changed"));
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Company settings save failed");
    } finally {
      setSavingCompany(false);
    }
  }

  async function uploadCompanyLogo(file: File) {
    try {
      setUploadingCompanyLogo(true);
      setSaveSuccess("");

      const fd = new FormData();
      fd.append("company_logo", file);

      const res = await fetch(`${API_BASE}/settings/company/logo`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        throw new Error(await readErrorMessage(res));
      }

      const json: { company_logo: string | null } = await res.json();

      setCompany((prev) => ({
        ...prev,
        company_logo_preview: json.company_logo,
      }));

      setSaveSuccess("Company logo uploaded successfully");
      window.dispatchEvent(new Event("fishifox-settings-changed"));
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Company logo upload failed");
    } finally {
      setUploadingCompanyLogo(false);
    }
  }

  if (loading) {
    return (
      <div className="p-12">
        <div className="bg-white rounded-[3rem] border border-[#F1F3FF] mindskills-shadow p-16 text-center text-slate-400 font-black uppercase tracking-widest">
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="bg-white rounded-[3rem] border border-[#F1F3FF] mindskills-shadow p-10 lg:p-14">
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-[#2F2F2F] tracking-tight">
                Settings
              </h3>
              <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">
                Profile & Company Setup
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <ShieldCheck size={16} />
              <span className="text-[11px] font-black uppercase tracking-widest">
                Light Mode Locked
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <User size={18} className="text-primary" />
              <h4 className="text-lg font-black text-slate-800">Profile Details</h4>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 p-1 border border-[#F1F3FF] overflow-hidden">
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    className="w-full h-full rounded-[2.2rem] object-cover bg-white"
                  />
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadAvatar(file);
                    e.currentTarget.value = "";
                  }}
                />

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-lg hover:scale-110 transition-all border-4 border-white disabled:opacity-60"
                  title="Upload photo"
                >
                  {uploadingAvatar ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Camera size={16} />
                  )}
                </button>
              </div>

              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-black text-[#2F2F2F] tracking-tight">
                  {profile.name}
                </h3>
                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">
                  {profile.role} Account
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-2 mt-4 text-secondary">
                  <CheckCircle2 size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Verified Identity
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[#F1F3FF]">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Full Identity
                </label>
                <div className="relative flex items-center bg-slate-50 border border-[#F1F3FF] rounded-2xl px-5 py-4 w-full focus-within:bg-white transition-all">
                  <User size={16} className="text-primary mr-3" />
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full font-bold text-[#2F2F2F]"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email Terminal
                </label>
                <div className="relative flex items-center bg-slate-50 border border-[#F1F3FF] rounded-2xl px-5 py-4 w-full focus-within:bg-white transition-all">
                  <Mail size={16} className="text-primary mr-3" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full font-bold text-[#2F2F2F]"
                    placeholder="Enter email"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={saveProfile}
                disabled={savingProfile}
                className="bg-primary text-white px-10 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-2xl shadow-primary/25 hover:-translate-y-1 transition-all disabled:opacity-60 disabled:translate-y-0 flex items-center gap-3"
              >
                {savingProfile ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : null}
                {savingProfile ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>

          <div className="space-y-8 pt-8 border-t border-[#F1F3FF]">
            <div className="flex items-center gap-3">
              <Building2 size={18} className="text-primary" />
              <h4 className="text-lg font-black text-slate-800">Company Details</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Company Name
                </label>
                <div className="relative flex items-center bg-slate-50 border border-[#F1F3FF] rounded-2xl px-5 py-4">
                  <Building2 size={16} className="text-primary mr-3" />
                  <input
                    type="text"
                    value={company.company_name}
                    onChange={(e) => handleCompanyInput("company_name", e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full font-bold text-[#2F2F2F]"
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Company Email
                </label>
                <div className="relative flex items-center bg-slate-50 border border-[#F1F3FF] rounded-2xl px-5 py-4">
                  <Mail size={16} className="text-primary mr-3" />
                  <input
                    type="email"
                    value={company.company_email}
                    onChange={(e) => handleCompanyInput("company_email", e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full font-bold text-[#2F2F2F]"
                    placeholder="Enter company email"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Company Phone
                </label>
                <div className="relative flex items-center bg-slate-50 border border-[#F1F3FF] rounded-2xl px-5 py-4">
                  <Phone size={16} className="text-primary mr-3" />
                  <input
                    type="text"
                    value={company.company_phone}
                    onChange={(e) => handleCompanyInput("company_phone", e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full font-bold text-[#2F2F2F]"
                    placeholder="Enter company phone"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Company Address
                </label>
                <div className="relative flex items-center bg-slate-50 border border-[#F1F3FF] rounded-2xl px-5 py-4">
                  <MapPin size={16} className="text-primary mr-3" />
                  <input
                    type="text"
                    value={company.company_address}
                    onChange={(e) => handleCompanyInput("company_address", e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full font-bold text-[#2F2F2F]"
                    placeholder="Enter company address"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Company Logo
              </label>

              <div className="flex flex-col md:flex-row md:items-center gap-5">
                <div className="w-28 h-28 rounded-[2rem] bg-slate-50 border border-[#F1F3FF] overflow-hidden flex items-center justify-center">
                  {company.company_logo_preview ? (
                    <img
                      src={company.company_logo_preview}
                      alt="Company Logo Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={28} className="text-slate-300" />
                  )}
                </div>

                <div className="flex-1">
                  <input
                    ref={companyLogoRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadCompanyLogo(file);
                      e.currentTarget.value = "";
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => companyLogoRef.current?.click()}
                    disabled={uploadingCompanyLogo}
                    className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-100 text-slate-700 font-black text-[12px] uppercase tracking-widest border border-[#F1F3FF] hover:bg-slate-200 transition-all disabled:opacity-60"
                  >
                    {uploadingCompanyLogo ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <ImageIcon size={16} />
                    )}
                    {uploadingCompanyLogo ? "Uploading..." : "Choose Logo"}
                  </button>

                  <p className="text-xs font-bold text-slate-400 mt-3">
                    Upload your real company logo here.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Invoice Header Text
                </label>
                <div className="relative flex items-start bg-slate-50 border border-[#F1F3FF] rounded-2xl px-5 py-4">
                  <FileText size={16} className="text-primary mr-3 mt-1" />
                  <textarea
                    value={company.invoice_header}
                    onChange={(e) => handleCompanyInput("invoice_header", e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full font-bold text-[#2F2F2F] min-h-[100px] resize-none"
                    placeholder="Example: Thank you for choosing our company..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Invoice Footer Text
                </label>
                <div className="relative flex items-start bg-slate-50 border border-[#F1F3FF] rounded-2xl px-5 py-4">
                  <FileText size={16} className="text-primary mr-3 mt-1" />
                  <textarea
                    value={company.invoice_footer}
                    onChange={(e) => handleCompanyInput("invoice_footer", e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full font-bold text-[#2F2F2F] min-h-[100px] resize-none"
                    placeholder="Example: Payment due within 7 days. Thank you for your business."
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={saveCompany}
                disabled={savingCompany}
                className="bg-[#4B49AC] text-white px-10 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-2xl shadow-[#4B49AC]/25 hover:-translate-y-1 transition-all disabled:opacity-60 disabled:translate-y-0 flex items-center gap-3"
              >
                {savingCompany ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : null}
                {savingCompany ? "Saving..." : "Save Company Details"}
              </button>
            </div>
          </div>

          {saveSuccess ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700 text-sm font-bold">
              {saveSuccess}
            </div>
          ) : null}

          <div className="hidden">
            {appearance.theme} {appearance.accent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;