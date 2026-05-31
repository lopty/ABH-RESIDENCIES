import React, { useState, useEffect } from "react";
import { X, Loader2, Check } from "lucide-react";

interface InterestPopupProps {
  pageName: string;
}

const POPUP_KEY = "rad_popup_shown";

export default function InterestPopup({ pageName }: InterestPopupProps) {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const already = sessionStorage.getItem(POPUP_KEY);
    if (already) return;
    const timer = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setVisible(false);
    sessionStorage.setItem(POPUP_KEY, "1");
  };

  const validate = () => {
    const e: Record<string, boolean> = {};
    if (!form.name.trim()) e.name = true;
    if (!form.email.trim() || !form.email.includes("@")) e.email = true;
    if (!form.phone.trim()) e.phone = true;
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTimeout(() => setErrors({}), 3000);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "interest_popup",
          page: pageName,
          ...form,
        }),
      });
    } catch (_) {}
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(POPUP_KEY, "1");
    }, 2500);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
      />
      <div className="relative bg-white w-full max-w-md shadow-2xl border-t-4 border-[#C9A96E] z-10 p-8">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {!success ? (
          <>
            <div className="mb-6 space-y-2">
              <span className="text-[10px] font-bold text-[#C9A96E] uppercase tracking-widest block">
                Interested in Abu Dhabi Properties?
              </span>
              <h3 className="font-serif text-2xl font-light text-[#1A1A1A]">
                Get in Touch
              </h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Leave your details and our advisors will reach out with exclusive listings tailored for you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  Full Name <span className="text-[#C9A96E]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full text-sm py-3 px-4 border ${
                    errors.name ? "border-red-400" : "border-[#EAE6DF]"
                  } focus:border-[#C9A96E] focus:outline-none rounded-none bg-white text-gray-900`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  Email Address <span className="text-[#C9A96E]">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full text-sm py-3 px-4 border ${
                    errors.email ? "border-red-400" : "border-[#EAE6DF]"
                  } focus:border-[#C9A96E] focus:outline-none rounded-none bg-white text-gray-900`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  Phone Number <span className="text-[#C9A96E]">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center border border-[#EAE6DF] px-3 bg-[#F8F6F2] text-xs text-gray-600 shrink-0 select-none">
                    +971
                  </div>
                  <input
                    type="tel"
                    placeholder="55 000 0000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`min-w-0 flex-1 py-3 px-4 border ${
                      errors.phone ? "border-red-400" : "border-[#EAE6DF]"
                    } focus:border-[#C9A96E] focus:outline-none rounded-none bg-white text-gray-900`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase py-4 transition-colors rounded-none flex items-center justify-center space-x-2 mt-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 size={12} className="animate-spin text-[#C9A96E]" />
                    <span>SUBMITTING...</span>
                  </>
                ) : (
                  <span>SUBMIT</span>
                )}
              </button>

              <p className="text-[9px] text-gray-400 text-center font-light leading-relaxed">
                Your data is handled securely and in compliance with privacy regulations.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex p-3 bg-green-50 border border-green-100 text-green-600 mx-auto">
              <Check size={24} />
            </div>
            <h4 className="font-serif text-xl font-light text-slate-900">Thank You!</h4>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Our advisors will be in touch with you shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
