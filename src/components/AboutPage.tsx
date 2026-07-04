import React from "react";
import { Check, Heart, Shield, Users, Star, Quote } from "lucide-react";

interface AboutPageProps {
  onShowConsultation: () => void;
}

const reviews = [
  {
    name: "Vaibhav Bansal",
    rating: 5,
    time: "3 months ago",
    initials: "V",
    color: "bg-[#C2185B]",
    text: "We have been in touch with Pranav for some market research for the last few months. While we haven't been able to make the purchase decision yet, he did a thorough job of patiently understanding our requirements and suggested appropriate projects accordingly. Would strongly recommend him.",
  },
  {
    name: "zena zeng",
    rating: 5,
    time: "3 months ago",
    initials: "Z",
    color: "bg-[#1C2B4A]",
    text: "I had a positive experience working with Pranav. He knows the Aldar Rise by Athalon project really well. He explained it thoroughly and with patience.",
  },
  {
    name: "Nik Kokotovich",
    rating: 5,
    time: "8 months ago",
    initials: "N",
    color: "bg-[#2E7D32]",
    text: "Pranav was exceptional to deal with. He helped me purchase a property on Al Marjan Island and was very professional and patient with me throughout the process and continues to be. I can't recommend highly enough!",
  },
  {
    name: "Shafeek M K",
    rating: 5,
    time: "3 months ago",
    initials: "S",
    color: "bg-[#E65100]",
    badge: "Local Guide · 16 reviews",
    text: "Verified Google reviewer",
  },
];

export default function AboutPage({ onShowConsultation }: AboutPageProps) {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-white">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-xs uppercase tracking-widest text-[#C9A96E] mb-6 font-medium space-x-2">
          <span>Home</span>
          <span>•</span>
          <span className="text-gray-500">About</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
          <div>
            <span className="text-xs font-semibold tracking-[0.4em] uppercase text-[#C9A96E] block mb-3">
              THE ADVISER BEHIND THE DESK
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#1A1A1A] tracking-tight leading-tight">
              Honesty. Mastery. <br />
              <span className="italic font-normal">Privileged</span> Allocations.
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed max-w-lg lg:ml-auto tracking-wide pb-2">
            AD Residences operates as an elite boutique advisory, bypassing standard listing channels to directly link global wealth managers, institutional trust funds, and private citizens to premier freehold assets.
          </p>
        </div>
      </div>

      {/* ── Pranav Bio Section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-[#EAE6DF] overflow-hidden">

          {/* Portrait */}
          <div className="lg:col-span-5 relative">
            <div className="h-[480px] lg:h-full min-h-[480px] overflow-hidden bg-[#1A1A1A]">
              <img
                src="/pranav-portrait.png"
                alt="Pranav Chaudhary — Founder, AD Residences"
                className="w-full h-full object-cover object-top opacity-90 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-[#C9A96E] text-[9px] font-bold tracking-[0.4em] uppercase mb-1">Founder & Lead Adviser</p>
                <p className="text-white font-serif text-2xl font-light">Pranav Chaudhary</p>
              </div>
            </div>
          </div>

          {/* Bio content */}
          <div className="lg:col-span-7 bg-[#F8F6F2] p-10 sm:p-14 flex flex-col justify-center space-y-8">
            <div className="w-12 h-[2px] bg-[#C9A96E]" />

            <div className="space-y-5 text-sm text-gray-600 font-light leading-relaxed">
              <p>
                Pranav grew up in the UAE and spent a decade in New York City working in client-facing roles at two of the world's most respected institutions —{" "}
                <span className="font-semibold text-[#1A1A1A]">PricewaterhouseCoopers</span> and{" "}
                <span className="font-semibold text-[#1A1A1A]">JP Morgan Chase</span>. Those years sharpened an instinct for precision, discretion, and deep client understanding that defines every engagement at AD Residences.
              </p>
              <p>
                Returning to the UAE with a global lens, Pranav channels his passion into Abu Dhabi's most compelling luxury developments — with particular expertise in{" "}
                <span className="font-semibold text-[#1A1A1A]">Al Maryah Island</span>, the emirate's premier financial and lifestyle district steps from ADGM, Four Seasons, and the city's foremost waterfront addresses.
              </p>
              <p>
                His approach is unhurried and consultative: understanding each client's capital goals first, then curating a shortlist from off-market allocations rather than public listings. The result is a process that feels less like transacting property and more like a privileged introduction.
              </p>
            </div>

            {/* Credentials row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#EAE6DF]">
              {[
                { label: "Institutions", value: "PwC · JP Morgan" },
                { label: "Based in", value: "Abu Dhabi, UAE" },
                { label: "Speciality", value: "Al Maryah · ADGM" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-[11px] font-semibold text-[#1A1A1A] leading-tight">{item.value}</p>
                </div>
              ))}
            </div>

            <button
              onClick={onShowConsultation}
              className="self-start bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase px-7 py-3 transition-colors rounded-none cursor-pointer"
            >
              SPEAK WITH PRANAV
            </button>
          </div>
        </div>
      </div>

      {/* ── Google Reviews ── */}
      <div className="bg-[#F8F6F2]/50 border-t border-b border-[#EAE6DF] py-20 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-2">
            <span className="text-xs font-semibold text-[#C9A96E] tracking-[0.4em] uppercase block">VERIFIED CLIENT FEEDBACK</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#1A1A1A]">What Clients Say</h2>
            <div className="flex items-center justify-center gap-1 pt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-[#F4B400] text-[#F4B400]" />
              ))}
              <span className="text-xs text-gray-500 ml-2 font-light">5.0 · Google Reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {reviews.map((r) => (
              <div key={r.name} className="bg-white border border-[#EAE6DF] p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`${r.color} w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {r.initials}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#1A1A1A] leading-tight">{r.name}</p>
                      {r.badge && <p className="text-[9px] text-gray-400 mt-0.5">{r.badge}</p>}
                    </div>
                  </div>
                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={11} className="fill-[#F4B400] text-[#F4B400]" />
                    ))}
                    <span className="text-[9px] text-gray-400 ml-2">{r.time}</span>
                  </div>
                </div>

                {/* Review text */}
                <p className="text-[11px] text-gray-600 leading-relaxed font-light flex-1">
                  {r.text !== "Verified Google reviewer" ? `"${r.text}"` : (
                    <span className="italic text-gray-400">5-star verified Google review</span>
                  )}
                </p>

                {/* Google badge */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-[#EAE6DF]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-[9px] text-gray-400 font-medium">Posted on Google</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Value Pillars ── */}
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold text-[#C9A96E] tracking-[0.4em] uppercase">THE RESIDENCE CHARTER</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#1A1A1A]">How We Safeguard Your Investments</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-[#F8F6F2] p-8 border border-[#EAE6DF] text-center space-y-4">
              <div className="inline-flex p-3 bg-white text-[#C9A96E] rounded-none mb-2 border border-[#EAE6DF]">
                <Shield size={22} />
              </div>
              <h4 className="font-serif text-lg font-normal text-slate-900">Absolute Transparency</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                We strictly bypass shadow markups and hidden booking structures. Every price card published traces directly back to developers' master books.
              </p>
            </div>
            <div className="bg-[#F8F6F2] p-8 border border-[#EAE6DF] text-center space-y-4">
              <div className="inline-flex p-3 bg-white text-[#C9A96E] rounded-none mb-2 border border-[#EAE6DF]">
                <Users size={22} />
              </div>
              <h4 className="font-serif text-lg font-normal text-slate-900">Assigned Concierge Key</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Each investor receives an assigned legal coordinator. We handle site visits, municipal handshakes, and Golden Visa processing end-to-end.
              </p>
            </div>
            <div className="bg-[#F8F6F2] p-8 border border-[#EAE6DF] text-center space-y-4">
              <div className="inline-flex p-3 bg-white text-[#C9A96E] rounded-none mb-2 border border-[#EAE6DF]">
                <Heart size={22} />
              </div>
              <h4 className="font-serif text-lg font-normal text-slate-900">Curatorial Standard</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                We refuse 90% of listing requests in the capital. Our catalog covers only high-aesthetic buildings in verified high-yield locations.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold text-[#C9A96E] uppercase tracking-widest block mb-2">
              REWRITE YOUR UAE PROPERTY FUTURE
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-light text-slate-900 mb-5">
              Ready to review off-market broadsheets?
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-light max-w-lg mx-auto leading-relaxed mb-8">
              Instruct our desk with your parameters of budget, bedrooms, and location to generate a customized digital briefing booklet.
            </p>
            <button
              onClick={onShowConsultation}
              className="bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[11px] font-bold tracking-widest uppercase px-8 py-3.5 transition-all rounded-none cursor-pointer"
            >
              CONNECT WITH PRANAV
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
