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

  // Home types as listed by Emirates Developments. Sizes and prices are not published, so none are shown.
  const unitTypes = [
    { name: "1 Bedroom Apartment", href: "/jumeirah-residences-al-maryah-island-1-bedroom" },
    { name: "2 Bedroom Apartment", href: "/jumeirah-residences-al-maryah-island-2-bedroom" },
    { name: "3 and 4 Bedroom Apartments", href: "/jumeirah-residences-al-maryah-island-floor-plans" },
    { name: "5 Bedroom Penthouse", href: "/jumeirah-residences-al-maryah-island-penthouse" }
  ];

  // Amenities as listed by Emirates Developments on its project page
  const amenities = [
    { title: "Wellness", desc: "Personalised wellness experiences" },
    { title: "Private Dining", desc: "Private dining offered to residents" },
    { title: "Concierge", desc: "Concierge services from the Jumeirah brand" },
    { title: "Floating Terraces", desc: "Terraces set into the building" },
    { title: "Sky-High Gardens", desc: "Landscaped gardens high in the tower" },
    { title: "Elevated Pool", desc: "A pool raised above the island" },
    { title: "Luxury Retail", desc: "Retail within the development" },
    { title: "Fine Dining and Leisure", desc: "Restaurants and leisure experiences" }
  ];

  const landmarks = [
    { name: "Cleveland Clinic Abu Dhabi", distance: "On Al Maryah Island" },
    { name: "The Galleria Al Maryah Island", distance: "On Al Maryah Island" },
    { name: "Abu Dhabi Global Market (ADGM)", distance: "On Al Maryah Island" },
    { name: "Al Reem Island", distance: "Across the water" }
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
              <span className="text-[9px] uppercase tracking-wider text-white/80 block">DEVELOPER</span>
              <span className="font-serif text-xl sm:text-2xl text-white font-medium block">Emirates Developments</span>
              <span className="text-[9px] text-[#C9A96E] uppercase tracking-widest block mt-0.5">With Jumeirah as brand partner</span>
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
              Jumeirah Residences Al Maryah Island is a branded residential project by Emirates Developments in partnership with Jumeirah. It offers one to four bedroom apartments and five bedroom penthouses on the island that is home to ADGM. The design is credited to Killa Design.
            </p>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-light">
              Al Maryah Island is also where The Galleria Al Maryah Island and Cleveland Clinic Abu Dhabi are located. Emirates Developments has not yet published prices, sizes or a payment plan, so those are requested unit by unit through AD Residences.
            </p>

            {/* Landmarks listing */}
            <div className="pt-6 border-t border-[#F8F6F2] space-y-4">
              <h4 className="font-serif text-lg font-normal text-gray-900">On the Island</h4>
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
                  AD Residences requests current availability, layouts and pricing from the developer on your behalf and arranges a briefing.
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
                  <span>Off-plan: handover date to be confirmed with the developer</span>
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
            <span className="text-xs font-semibold text-[#C9A96E] tracking-[0.4em] uppercase">HOME TYPES</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#1A1A1A]">Homes at Jumeirah Residences</h2>
          </div>

          <div className="bg-white border border-[#EAE6DF] shadow-md overflow-x-auto rounded-none">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#1C2B4A] text-white uppercase text-[9px] font-semibold tracking-widest border-b border-slate-700">
                  <th className="py-4 px-6">Home Type</th>
                  <th className="py-4 px-6">Details</th>
                  <th className="py-4 px-6 text-center">Enquire</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8F6F2] text-xs text-slate-800">
                {unitTypes.map((unit, idx) => (
                  <tr key={idx} className="hover:bg-[#F8F6F2]/30 transition-colors">
                    <td className="py-4 px-6 font-serif font-medium text-sm text-gray-950">{unit.name}</td>
                    <td className="py-4 px-6 font-light text-gray-500">
                      <a href={unit.href} className="underline hover:text-[#C9A96E]">Read about this layout</a>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => onSelectPropertyById("jumeirah-residences-al-maryah-island")}
                        className="text-[9px] font-bold uppercase tracking-wider text-[#1C2B4A] hover:text-[#C8A261] border border-[#EAE6DF] hover:border-[#C9A96E] px-3 py-1.5 transition-all text-center rounded-none select-none"
                      >
                        REQUEST AVAILABILITY
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
          <span className="text-xs font-semibold text-[#C9A96E] tracking-[0.4em] uppercase">WHAT THE DEVELOPER LISTS</span>
          <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#1A1A1A]">Amenities</h2>
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
