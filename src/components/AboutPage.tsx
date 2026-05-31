import React from "react";
import { Check, Heart, Shield, Users } from "lucide-react";

interface AboutPageProps {
  onShowConsultation: () => void;
}

export default function AboutPage({ onShowConsultation }: AboutPageProps) {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-white">
      
      {/* 1. Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        {/* Breadcrumbs */}
        <div className="text-xs uppercase tracking-widest text-[#C9A96E] mb-6 font-medium space-x-2">
          <span>Home</span>
          <span>•</span>
          <span className="text-gray-500">About Us</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
          <div>
            <span className="text-xs font-semibold tracking-[0.4em] uppercase text-[#C9A96E] block mb-3">
              ESTATE LEADERS SINCE 2014
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#1A1A1A] tracking-tight leading-tight">
              Honesty. Mastery. <br />
              <span className="italic font-normal">Privileged</span> Allocations.
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed max-w-lg lg:ml-auto tracking-wide pb-2">
            Residence Abu Dhabi operates as an elite boutique advisory, bypassing standard listing channels to directly link global wealth managers, institutional trust funds, and private citizens to premier freehold assets.
          </p>
        </div>
      </div>

      {/* 2. Hero Image Dual Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          <div className="md:col-span-8 overflow-hidden aspect-[16/9] md:aspect-auto md:h-[450px] border border-[#EAE6DF]">
            <img 
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop&q=80" 
              alt="Elite yacht club marina waterfront lifestyle" 
              className="w-full h-full object-cover filter brightness-[0.98]"
            />
          </div>
          <div className="md:col-span-4 bg-[#F8F6F2] p-8 sm:p-10 flex flex-col justify-between border border-[#EAE6DF] relative">
            <div className="absolute top-0 right-0 h-1 bg-[#C9A96E] w-full" />
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-[#C9A96E] uppercase tracking-widest block">Core Numbers</span>
              <h3 className="font-serif text-2xl font-light text-slate-950 tracking-tight">Enterprise Scale</h3>
              <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                By focusing on discrete, low-volume high-value portfolios, we maintain an unparalleled level of execution quality.
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-[#EAE6DF]">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] uppercase text-gray-400 tracking-wider">Active Portfolio</span>
                <span className="font-serif text-xl text-slate-950 font-medium">AED 2 Billion+</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] uppercase text-gray-400 tracking-wider">Accredited Advisers</span>
                <span className="font-serif text-xl text-slate-950 font-medium">18 Elite Off-Market</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] uppercase text-gray-400 tracking-wider font-semibold text-[#C9A96E]">Referral Rate</span>
                <span className="font-serif text-xl text-[#C9A96E] font-medium">98% Satisfied</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Our Value Pillars */}
      <div className="bg-[#F8F6F2]/40 py-20 border-t border-b border-[#EAE6DF]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold text-[#C9A96E] tracking-[0.4em] uppercase">THE RESIDENCE CHARTER</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#1A1A1A]">How We Safeguard Your Investments</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-[#EAE6DF] text-center space-y-4">
              <div className="inline-flex p-3 bg-[#F8F6F2] text-[#C9A96E] rounded-none mb-2">
                <Shield size={24} />
              </div>
              <h4 className="font-serif text-lg font-normal text-slate-900">Absolute Transparency</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                We strictly bypass shadow markups and hidden booking structures. Every price card published traces directly back to developers' master books.
              </p>
            </div>

            <div className="bg-white p-8 border border-[#EAE6DF] text-center space-y-4">
              <div className="inline-flex p-3 bg-[#F8F6F2] text-[#C9A96E] rounded-none mb-2">
                <Users size={24} />
              </div>
              <h4 className="font-serif text-lg font-normal text-slate-900">Assigned Concierge Key</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Each investor receives an assigned legal coordinator. We handle site visits, municipal handshakes, and Golden Visa processing end-to-end.
              </p>
            </div>

            <div className="bg-white p-8 border border-[#EAE6DF] text-center space-y-4">
              <div className="inline-flex p-3 bg-[#F8F6F2] text-[#C9A96E] rounded-none mb-2">
                <Heart size={24} />
              </div>
              <h4 className="font-serif text-lg font-normal text-slate-900">Curatorial Standard</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                We refuse 90% of listing requests in the capital. Our catalog covers only high-aesthetic buildings in verified high-yield locations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center pt-20">
        <span className="text-xs font-bold text-[#C9A96E] uppercase tracking-widest block mb-1">
          REWRITE YOUR UAE PROPERTY FUTURE
        </span>
        <h3 className="font-serif text-3xl sm:text-4xl font-light text-slate-900 mb-6">
          Ready to review off-market broadsheets?
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 font-light max-w-lg mx-auto leading-relaxed mb-8">
          Instruct our desk with your parameters of budget, bedrooms, and location to generate a customized digital briefing booklet.
        </p>
        <button
          onClick={onShowConsultation}
          className="bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[11px] font-bold tracking-widest uppercase px-8 py-3.5 transition-all text-center rounded-none cursor-pointer"
        >
          CONNECT WITH DISCREET REGISTERED BROKER
        </button>
      </div>

    </div>
  );
}
