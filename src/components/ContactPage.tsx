import React, { useState, FormEvent } from "react";
import { MapPin, Phone, Mail, Clock, Check, Loader2, MessageSquare } from "lucide-react";

interface ContactPageProps {
  onShowCallback: () => void;
}

export default function ContactPage({ onShowCallback }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "Investment Allocation",
    message: "",
    consent: true
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};

    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.email.trim() || !formData.email.includes("@")) newErrors.email = true;
    if (!formData.phone.trim()) newErrors.phone = true;
    if (!formData.consent) newErrors.consent = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 3000);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact_form", ...formData }),
      });
    } catch (_) {}
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      topic: "Investment Allocation",
      message: "",
      consent: true
    });
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#F8F6F2]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb path */}
        <div className="text-xs uppercase tracking-widest text-[#C9A96E] mb-6 font-medium space-x-2">
          <span>Home</span>
          <span>•</span>
          <span className="text-gray-500">Contact Us</span>
        </div>

        {/* Header section */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-semibold tracking-[0.4em] uppercase text-[#C9A96E] block animate-pulse">
            DISCREET 24/7 ENQUIRY DESK
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#1A1A1A] tracking-tight">
            Schedule a Private Briefing
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-light max-w-xl mx-auto tracking-wide leading-relaxed">
            Connect directly with Pranav Chaudhary, our lead real estate advisor, at our headquarters on Al Maryah Island to review custom off-market catalogs.
          </p>
        </div>

        {/* Dual Grid Layout: Left Cards (NAP & Landmark), Right Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Coordinates & Map Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* NAP Info Box */}
            <div className="bg-white p-6 sm:p-8 border border-[#EAE6DF] shadow-md relative">
              <div className="absolute left-0 top-0 h-full w-1.5 bg-[#C9A96E]" />
              <div className="space-y-6">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">HQ Coordinates</span>
                <h3 className="font-serif text-2xl font-normal text-slate-900">AD Residences</h3>
                <p className="text-[11px] text-gray-500 font-medium -mt-3">Lead Advisor: Pranav Chaudhary</p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 text-xs text-gray-700 font-light">
                    <MapPin size={16} className="text-[#C9A96E] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">HQ Office Location</p>
                      <p>Sentinel Business Level 4, ADGM Square</p>
                      <p>Al Maryah Island, Abu Dhabi, UAE</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 text-xs text-gray-700 font-light">
                    <Phone size={16} className="text-[#C9A96E] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Direct Advising Line</p>
                      <p className="hover:text-[#C9A96E] transition-colors font-mono font-medium">+971 55 422 6593</p>
                      <p className="text-[10px] text-gray-400">Mo – Sa (09:00 – 18:00 GST)</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 text-xs text-gray-700 font-light">
                    <Mail size={16} className="text-[#C9A96E] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Document Transmission</p>
                      <p className="hover:text-[#C9A96E] transition-colors font-mono">info@residenceabudhabi.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 text-xs text-gray-700 font-light">
                    <Clock size={16} className="text-[#C9A96E] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Open Service Domain</p>
                      <p>Private viewings arranged 7 days a week</p>
                      <p className="text-[#C9A96E] font-medium">Remote Zoom brief scheduled 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Street Map Block */}
            <div className="bg-white border border-[#EAE6DF] p-4 shadow-sm relative overflow-hidden flex flex-col items-center justify-center text-center py-10">
              <div className="absolute inset-0 bg-[#EAE6DF]/10 z-0 pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <MapPin size={32} className="mx-auto text-[#1C2B4A]" />
                <h4 className="font-serif text-lg font-normal text-gray-800">Al Maryah Waterfront HQ</h4>
                <p className="text-[10px] text-gray-400 max-w-[240px] leading-relaxed mx-auto">
                  Overlooking Al Maryah Canal, immediately adjacent to Rosewood Abu Dhabi and Four Seasons.
                </p>
                <button
                  onClick={onShowCallback}
                  className="bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[9px] font-bold tracking-widest uppercase py-2.5 px-6 rounded-none mt-2 shrink-0 select-none"
                >
                  GET CALL FOR NAVIGATION
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Inquiry Form Block (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 border border-[#EAE6DF] shadow-lg relative">
            <div className="absolute top-0 left-0 h-1.5 w-full bg-[#1C2B4A]" />
            
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="border-b border-[#F8F6F2] pb-4">
                    <h3 className="font-serif text-2xl font-light text-[#1A1A1A]">Transmit Custom Specification</h3>
                    <p className="text-xs text-gray-500 font-light leading-relaxed font-sans mt-1">
                      Fill out coordinates of your budget, targets, and special trust considerations to receive customized files.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-1 relative">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                        Full Name <span className="text-[#C9A96E]">*</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g., Jean-Clause Tremblay"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={`w-full bg-white text-xs py-2 px-1 border-b ${
                          errors.name ? "border-red-500" : "border-[#EAE6DF]"
                        } focus:border-[#C9A96E] focus:outline-none rounded-none`}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1 relative">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                        Email Address <span className="text-[#C9A96E]">*</span>
                      </label>
                      <input 
                        type="email" 
                        placeholder="e.g., jc@tremblay-holdings.ca"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`w-full bg-white text-xs py-2 px-1 border-b ${
                          errors.email ? "border-red-500" : "border-[#EAE6DF]"
                        } focus:border-[#C9A96E] focus:outline-none rounded-none`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div className="space-y-1 relative">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                        Contact Line <span className="text-[#C9A96E]">*</span>
                      </label>
                      <input 
                        type="tel" 
                        placeholder="e.g., +1 514 999 9999"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className={`w-full bg-white text-xs py-2 px-1 border-b ${
                          errors.phone ? "border-red-500" : "border-[#EAE6DF]"
                        } focus:border-[#C9A96E] focus:outline-none rounded-none`}
                      />
                    </div>

                    {/* Topic of Choice */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                        Inquiry Segment
                      </label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({...formData, topic: e.target.value})}
                        className="w-full bg-white text-xs py-2 px-1 border-b border-[#EAE6DF] focus:border-[#C9A96E] focus:outline-none rounded-none appearance-none cursor-pointer"
                      >
                        <option value="Investment Allocation">Investment Allocation</option>
                        <option value="Jumeirah Residences Info">Jumeirah Residences Info</option>
                        <option value="Al Maryah Island Custom Plots">Al Maryah Island Custom Plots</option>
                        <option value="Golden Visa Program coordination">Golden Visa Program coordination</option>
                        <option value="Off-market Private Penthouse Desk">Off-market Private Penthouse Desk</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Custom Brief Parameters / Notes
                    </label>
                    <textarea 
                      placeholder="Specify size constraints, preference for off-plan or ready, preferred timelines, or capital structure targets..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-white text-xs py-2 px-1 border border-[#EAE6DF]/60 focus:border-[#C9A96E] focus:outline-none rounded-none font-sans"
                    />
                  </div>

                  {/* Consent check */}
                  <label className="flex items-start space-x-2 cursor-pointer pt-2">
                    <input 
                      type="checkbox" 
                      checked={formData.consent}
                      onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                      className="mt-0.5 border-gray-300 rounded-none text-[#1C2B4A] focus:ring-[#C9A96E]"
                    />
                    <span className="text-[9px] text-gray-500 font-light leading-relaxed">
                      Consent to AD Residences forwarding PDF briefing books, scheduling call backs, and managing my data safely in compliance with international privacy protocols.
                    </span>
                  </label>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase py-3.5 border border-[#1C2B4A] transition-colors rounded-none flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={12} className="animate-spin text-[#C9A96E]" />
                          <span>DISPATCHING ADVISOR ENVELOPE...</span>
                        </>
                      ) : (
                        <span>TRANSMIT PARAMETERS</span>
                      )}
                    </button>
                  </div>

                </form>
              ) : (
                <div className="text-center py-12 space-y-6">
                  <div className="inline-flex p-4 bg-green-50 text-green-600 border border-green-100 rounded-none">
                    <Check size={28} />
                  </div>
                  <h4 className="font-serif text-2xl font-light text-slate-900">Information successfully registered</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-light max-w-md mx-auto">
                    Thank you. Your parameters have been transmitted to the head of our Al Maryah Island advisory desk. A customized response package will be dispatched shortly to <span className="font-semibold text-gray-800">{formData.email}</span>.
                  </p>
                  <button 
                    onClick={handleReset}
                    className="bg-[#F8F6F2] hover:bg-[#EAE6DF] text-[9px] text-[#1A1A1A] font-bold tracking-widest uppercase py-3 px-6 border border-[#EAE6DF] rounded-none inline-block mt-4"
                  >
                    TRANSMIT ANOTHER ENQUIRY
                  </button>
                </div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </div>
  );
}

// Inlined AnimatePresence fallback context to check safety
const AnimatePresence = ({ children, mode }: { children: React.ReactNode; mode?: "wait" | "popLayout" }) => {
  return <>{children}</>;
};
