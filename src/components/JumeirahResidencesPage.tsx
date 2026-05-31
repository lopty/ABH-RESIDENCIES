import React from "react";
import { Bed, Bath, Maximize2, MapPin, Check, Plus, ShoppingBag, HelpCircle, Eye, ShieldCheck, ArrowRight, MessageCircle } from "lucide-react";

interface JumeirahResidencesPageProps {
  onShowConsultation: () => void;
  onShowCallback: () => void;
  onSelectPropertyById: (id: string) => void;
}

export default function JumeirahResidencesPage({ 
  onShowConsultation, 
  onShowCallback, 
  onSelectPropertyById 
}: JumeirahResidencesPageProps) {

  // Unit types specs array
  const unitTypes = [
    { name: "1 Bedroom Luxury Suite", size: "1,140 – 1,320 sq ft", price: "AED 3,000,000", layout: "Dual Balcony + Dressing Room" },
    { name: "2 Bedroom Waterfront Suite", size: "1,850 – 2,100 sq ft", price: "AED 4,900,000", layout: "Powder Room+ Maid's Quarters" },
    { name: "3 Bedroom Premium Residence", size: "2,900 – 3,250 sq ft", price: "AED 7,200,000", layout: "Triple View Wrap Terrace" },
    { name: "Waterfront Duplex Penthouse", size: "4,200 – 5,800 sq ft", price: "From AED 14,500,000", layout: "Private Overhang Pool + Lift" }
  ];

  const amenities = [
    { title: "Sunset Infinity Pool", desc: "Overlooking Al Maryah Island canal" },
    { title: "Athletic Wellness Center", desc: "Fully equipped with techno-gym suites" },
    { title: "24/7 Private Concierge", desc: "Legendary Jumeirah branded hospitality keys" },
    { title: "Steam, Sauna & Hammam", desc: "Private thermal paths for residents" },
    { title: "Resident Club & Lounge", desc: "Bespoke fine-dining cigar cellars" },
    { title: "Elite Private Cinema", desc: "12-seat bespoke state-of-the-art cinema" },
    { title: "Secure Guarded Portals", desc: "Biometric security and VIP visitor management" },
    { title: "Private Berth Valet", desc: "Direct access to waterfront yacht anchorages" }
  ];

  const landmarks = [
    { name: "Cleveland Clinic Abu Dhabi", distance: "2 mins walk" },
    { name: "The Galleria Luxury Mall", distance: "3 mins walk (Direct connected pathway)" },
    { name: "Abu Dhabi Global Market (ADGM)", distance: "4 mins walk (Underground corridor)" },
    { name: "Zuma and LPM Restaurants", distance: "5 mins walk (Waterfront boardwalk tour)" },
    { name: "Saadiyat Cultural Hub (Louvre)", distance: "12 mins drive" },
    { name: "Abu Dhabi International Airport", distance: "22 mins drive" }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-white">
      
      {/* 1. Hero Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        {/* Breadcrumb path */}
        <div className="text-xs uppercase tracking-widest text-[#C9A96E] mb-6 font-medium space-x-2">
          <span>Home</span>
          <span>•</span>
          <span>Featured Projects</span>
          <span>•</span>
          <span className="text-gray-500">Jumeirah Residences</span>
        </div>

        <div className="relative aspect-[21/9] sm:aspect-[16/6] bg-gray-100 overflow-hidden border border-[#EAE6DF] mb-10">
          <img 
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&auto=format&fit=crop&q=80" 
            alt="Jumeirah Residences Abu Dhabi master exterior design" 
            className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />
          
          <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col md:flex-row md:items-end justify-between text-white gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#C9A96E] uppercase tracking-[0.35em] block">LEGENDARY BRANDED RESIDENCES</span>
              <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-white leading-none">
                Jumeirah Residences
              </h1>
              <p className="text-xs text-white/90 uppercase tracking-widest font-sans font-light flex items-center pt-1">
                <MapPin size={12} className="text-[#C9A96E] mr-1" /> Al Maryah Island, Abu Dhabi
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 border border-white/20 text-left shrink-0 max-w-sm">
              <span className="text-[9px] uppercase tracking-wider text-white/80 block">INVESTMENT ENTRY TIER</span>
              <span className="font-serif text-xl sm:text-2xl text-white font-medium block">Starting AED 3,000,000</span>
              <span className="text-[9px] text-[#C9A96E] uppercase tracking-widest block mt-0.5">50/50 Handover Payment Plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Structured Copy Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: General info about project */}
          <div className="lg:col-span-7 space-y-6">
            <div className="w-16 h-1 bg-[#C9A96E]" />
            <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#1A1A1A] leading-tight tracking-tight">
              A Waterfront Sanctuary <span className="italic font-normal">Sovereignly</span> Managed by Jumeirah hospitality keys.
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-light">
              Designed as a crystalline beacon slicing Al Maryah's skyline, Jumeirah Residences fuses world-record corporate centrality with secure resort hospitality. Developed in elite synchronization with leading master-minds, each residence ensures uninterrupted canal corridors and absolute off-market exclusivity.
            </p>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-light">
              Residents hold immediate integration keys to Cleveland Clinic, VIP subterranean pathways to The Galleria Mall fine-dining cells, and preferential reservations across the entire Michelin-starred Zuma/LPM corridors flanking the island's boardwalks.
            </p>

            {/* Landmarks listing */}
            <div className="pt-6 border-t border-[#F8F6F2] space-y-4">
              <h4 className="font-serif text-lg font-normal text-gray-900">Adjacent Connectivity & Landmarks</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {landmarks.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs border-b border-[#F8F6F2] pb-2 text-gray-700">
                    <span className="font-medium text-gray-900">{m.name}</span>
                    <span className="text-gray-400 font-mono tracking-wide shrink-0">{m.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Quick Spec Box with Contact Trigger */}
          <div className="lg:col-span-5 bg-[#F8F6F2] p-8 border border-[#EAE6DF] shadow-md relative">
            <div className="absolute top-0 right-0 h-1.5 w-full bg-[#1C2B4A]" />
            <div className="space-y-6 text-center">
              <ShieldCheck size={32} className="mx-auto text-[#C9A96E]" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Accredited Allocation Registry</span>
                <h4 className="font-serif text-xl font-normal text-slate-900 leading-tight">Securing the Finest Units</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed max-w-sm mx-auto font-sans font-light">
                  Our private client advisory handles global priority portfolios, tax optimization structures, and direct builder handshakes for qualified citizens.
                </p>
              </div>

              <div className="border-t border-b border-[#EAE6DF] py-4 space-y-2 text-xs text-left text-gray-700 font-light font-sans">
                <div className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 bg-[#C9A96E] shrink-0" />
                  <span>Freehold Ownership for Foreign Nationals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 bg-[#C9A96E] shrink-0" />
                  <span>Eligible for 10-Year UAE Golden Visa</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 bg-[#C9A96E] shrink-0" />
                  <span>Guaranteed high corporate occupancy indices</span>
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={onShowConsultation}
                  className="w-full bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase py-3.5 transition-colors rounded-none cursor-pointer"
                >
                  REQUEST INVESTMENT PROSPECTUS
                </button>
                <button 
                  onClick={onShowCallback}
                  className="w-full bg-white hover:bg-[#F8F6F2] text-[#1A1A1A] border border-[#EAE6DF] text-[10px] font-bold tracking-widest uppercase py-3.5 transition-colors rounded-none cursor-pointer"
                >
                  DIAL ASSIGNED ADVISOR NOW
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Unit Types & Sizing Table */}
      <div className="bg-[#F8F6F2]/30 py-20 border-t border-b border-[#EAE6DF]/60 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold text-[#C9A96E] tracking-[0.4em] uppercase">AVAILABILITY & PRICING</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#1A1A1A]">Curated Sizing Matrices</h2>
          </div>

          <div className="bg-white border border-[#EAE6DF] shadow-md overflow-x-auto rounded-none">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#1C2B4A] text-white uppercase text-[9px] font-semibold tracking-widest border-b border-slate-700">
                  <th className="py-4 px-6">Unit Configuration</th>
                  <th className="py-4 px-6">Average Sizing (Sq Ft)</th>
                  <th className="py-4 px-6">Luxury Layout Attributes</th>
                  <th className="py-4 px-6 text-right">Exclusive Guide Price</th>
                  <th className="py-4 px-6 text-center">Inquiry Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8F6F2] text-xs text-slate-800">
                {unitTypes.map((unit, idx) => (
                  <tr key={idx} className="hover:bg-[#F8F6F2]/30 transition-colors">
                    <td className="py-4 px-6 font-serif font-medium text-sm text-gray-950">{unit.name}</td>
                    <td className="py-4 px-6 font-mono text-gray-500 font-light">{unit.size}</td>
                    <td className="py-4 px-6 font-light text-gray-500">{unit.layout}</td>
                    <td className="py-4 px-6 text-right font-serif font-medium text-[#C9A96E] text-sm">{unit.price}</td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => onSelectPropertyById("prop-5")}
                        className="text-[9px] font-bold uppercase tracking-wider text-[#1C2B4A] hover:text-[#C8A261] border border-[#EAE6DF] hover:border-[#C9A96E] px-3 py-1.5 transition-all text-center rounded-none select-none"
                      >
                        BOOK PORTFOLIO
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Amenities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold text-[#C9A96E] tracking-[0.4em] uppercase">FIVE STAR LIVING CAPABILITY</span>
          <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#1A1A1A]">Elite Amenities Stream</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.map((item, idx) => (
            <div key={idx} className="p-6 border border-[#EAE6DF] hover:border-[#C9A96E] rounded-none transition-colors group space-y-2">
              <span className="text-[10px] font-bold text-gray-300 font-mono tracking-widest block group-hover:text-[#C9A96E] transition-colors">
                [ 0{idx + 1} ]
              </span>
              <h4 className="font-serif text-base font-normal text-slate-950">{item.title}</h4>
              <p className="text-[11px] text-gray-500 font-light leading-relaxed font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
