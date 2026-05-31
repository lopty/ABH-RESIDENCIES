import React, { useState } from "react";
import { MapPin, ArrowRight, Building2, TrendingUp, DollarSign, Award, Check, ChevronDown, ChevronUp } from "lucide-react";

interface AlMaryahIslandPageProps {
  onShowConsultation: () => void;
  onNavigate: (path: string) => void;
}

export default function AlMaryahIslandPage({ onShowConsultation, onNavigate }: AlMaryahIslandPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = [
    { title: "Average Rental Yield", value: "7.5% – 8.2% Net", label: "highest corporate yields in Abu Dhabi" },
    { title: "Avg Price per Sq Ft", value: "AED 2,100 – 2,400", label: "strong capital appreciation trends" },
    { title: "Commercial Density", value: "ADGM Corporate Hub", label: "home to 500+ global sovereign funds" },
    { title: "Infrastructure Score", value: "9.9 / 10 Tier", label: "underground paths, world-class clinics" }
  ];

  const landmarks = [
    { name: "The Galleria Luxury Mall", desc: "A luxury shopping destination containing Chanel, Hermes, Zuma, and LPM." },
    { name: "Cleveland Clinic Abu Dhabi", desc: "A world-renowned medical diagnostic facility fully integrated into the island's map." },
    { name: "ADGM Office Square", desc: "Abu Dhabi's award-winning International financial freezone hosting global trust funds." },
    { name: "Four Seasons & Rosewood Resorts", desc: "Ultra-premium five star hotels located on Al Maryah's continuous waterfront boardwalk." }
  ];

  const islandsFaq = [
    {
      q: "Why is Al Maryah Island considered a premium zone?",
      a: "As Abu Dhabi's designated Central Business District and legal financial freezone (ADGM), Al Maryah maintains a unique legal system, high employee density, and extremely premium master development laws, guaranteeing high demand."
    },
    {
      q: "Are the apartments on Al Maryah freehold for foreigners?",
      a: "Yes. Al Maryah Island is an designated freehold investment zone which grants foreign nationals of any nationality 100% absolute ownership rights of properties, including branded penthouses."
    },
    {
      q: "What is the capital appreciation trend on the island?",
      a: "Because Al Maryah is fully developed with extremely scarce remaining plots, property values have experienced sharp upward trajectories (averaging 12-15% annual gains) as major towers finish."
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Path */}
        <div className="text-xs uppercase tracking-widest text-[#C9A96E] mb-6 font-medium space-x-2">
          <span>Home</span>
          <span>•</span>
          <span>Area Guides</span>
          <span>•</span>
          <span className="text-gray-500">Al Maryah Island</span>
        </div>

        {/* 1. Full-width Hero Banner */}
        <div className="relative aspect-[4/3] sm:aspect-[16/7] lg:aspect-[21/9] bg-gray-100 overflow-hidden border border-[#EAE6DF] mb-16">
          <img 
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1600&auto=format&fit=crop&q=80" 
            alt="Al Maryah Island skylines and financial waterfront" 
            className="w-full h-full object-cover filter brightness-[0.9]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent z-10" />
          <div className="absolute bottom-6 left-6 right-6 z-20 text-white space-y-2">
            <span className="text-[10px] font-bold text-[#C9A96E] uppercase tracking-[0.4em] block">PREMIER WATERFRONT DISTRICT</span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-none">
              Al Maryah Island
            </h1>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-light font-sans max-w-xl">
              Abu Dhabi's elite waterfront financial district, seamlessly merging commercial sovereignty with exclusive branded residential living.
            </p>
          </div>
        </div>

        {/* 2. Area Guide Description & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="w-16 h-1 bg-[#C9A96E]" />
            <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#1A1A1A] leading-tight tracking-tight">
              The Sovereign Center of Abu Dhabi's Financial Power & Luxury.
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-light">
              Managed as a prestigious independent freezone with a direct English Common Law court structure, Al Maryah Island stands as Abu Dhabi’s global gateway. Beyond its skyscrapers, it boasts the capital's highest concentration of fine dining, luxury hospitality, and high-performance medical infrastructure.
            </p>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-light">
              With a continuous 5.4 km landscaped waterfront promenade and absolute underground pedestrian climate links connecting the retail towers, Al Maryah provides residents an uninterrupted premium living experience protected from the elements.
            </p>

            <div className="pt-6 border-t border-[#F8F6F2] space-y-4">
              <h3 className="font-serif text-lg font-normal text-gray-900">Lifestyle Landmarks & Luxury</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {landmarks.map((l, idx) => (
                  <div key={idx} className="p-4 bg-[#F8F6F2]/40 border border-[#EAE6DF]/40 space-y-1">
                    <h4 className="font-serif font-semibold text-sm text-gray-950">{l.name}</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-light">{l.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side: Quick facts box */}
          <div className="lg:col-span-5 bg-[#F8F6F2] p-8 border border-[#EAE6DF] shadow-md relative">
            <div className="absolute top-0 right-0 h-1.5 w-full bg-[#1C2B4A]" />
            <div className="space-y-6">
              <h3 className="font-serif text-xl font-normal text-slate-900 pb-3 border-b border-[#EAE6DF]">
                Al Maryah Key Investment Stats
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {stats.map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block">{s.title}</span>
                    <span className="font-serif text-xl sm:text-2xl font-light text-[#C9A96E] block tracking-tight">{s.value}</span>
                    <span className="text-[10px] text-gray-500 font-light font-sans block leading-none">{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#EAE6DF] space-y-2">
                <button
                  onClick={onShowConsultation}
                  className="w-full bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase py-3.5 rounded-none cursor-pointer"
                >
                  REQUEST DETAILED MASTER BOOKLET
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Featured Available Projects inside Al Maryah */}
        <div className="bg-[#F8F6F2]/30 p-8 sm:p-12 border border-[#EAE6DF] mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="bg-[#C9A96E] text-white text-[9px] font-bold uppercase tracking-widest py-1 px-2">
                CURATED PREMIER PROJECT
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-light text-[#1A1A1A] leading-tight">
                Jumeirah Residences on Al Maryah Island
              </h3>
              <p className="text-xs text-gray-650 leading-relaxed font-light">
                Discover the island's flagship residential masterwork. Absolute waterfront luxury apartments and duplex penthouses starting from AED 3,000,000. Under Jumeirah hospitality management.
              </p>
              
              <button 
                onClick={() => onNavigate("/properties/jumeirah-residences")}
                className="group inline-flex items-center space-x-2 text-xs font-semibold text-[#1C2B4A] tracking-[0.2em] uppercase border-b border-[#C9A96E] pb-1 hover:text-[#C9A96E] transition-colors cursor-pointer"
              >
                <span>EXPLORE JUMEIRAH RESIDENCES</span>
                <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform text-[#C9A96E]" />
              </button>
            </div>

            <div className="lg:col-span-7 bg-white relative overflow-hidden aspect-[16/9] border border-[#EAE6DF]">
              <img 
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80" 
                alt="Jumeirah Residences front towers" 
                className="w-full h-full object-cover filter brightness-[0.95]"
              />
            </div>

          </div>
        </div>

        {/* 4. Al Maryah FAQ Expanders */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-semibold text-[#C9A96E] tracking-[0.4em] uppercase">DISTRICT LEGAL MATRIX</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-light">Al Maryah Island Buying FAQs</h3>
          </div>

          <div className="space-y-4">
            {islandsFaq.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white border border-[#EAE6DF] shadow-sm">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left py-4 px-6 flex justify-between items-center bg-white hover:bg-[#F8F6F2]/40 transition-colors focus:outline-none cursor-pointer"
                  >
                    <span className="font-serif text-sm sm:text-base font-medium text-gray-950 pr-4">
                      {item.q}
                    </span>
                    <span className="text-[#C9A96E]">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 border-t border-[#F8F6F2] text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
