import React, { FormEvent } from "react";
import { SlidersHorizontal, MapPin, Bed, Bath, Maximize2, Building2, ChevronDown, ThumbsUp, Award, AwardIcon } from "lucide-react";
import { Property } from "../types";
import { propertiesData } from "../data";

interface BuyPageProps {
  searchType: string;
  setSearchType: (v: string) => void;
  searchLocation: string;
  setSearchLocation: (v: string) => void;
  searchBudget: string;
  setSearchBudget: (v: string) => void;
  filteredProperties: Property[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch: (e: FormEvent) => void;
  onReset: () => void;
  onSelectProperty: (property: Property) => void;
}

export default function BuyPage({
  searchType,
  setSearchType,
  searchLocation,
  setSearchLocation,
  searchBudget,
  setSearchBudget,
  filteredProperties,
  activeTab,
  onTabChange,
  onSearch,
  onReset,
  onSelectProperty
}: BuyPageProps) {

  const propertyTypes = ["Apartment", "Penthouse", "Villa", "Mansion"];
  const locations = ["Saadiyat Island", "Yas Island", "Al Reem Island", "Ramhan Island", "Al Maryah Island", "Al Raha Beach"];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#F8F6F2]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Path */}
        <div className="text-xs uppercase tracking-widest text-[#C9A96E] mb-6 font-medium space-x-2">
          <span>Home</span>
          <span>•</span>
          <span className="text-gray-500">Buy Properties</span>
        </div>

        {/* Page Banner Title */}
        <div className="text-center mb-12 space-y-4">
          <span className="text-xs font-semibold tracking-[0.4em] uppercase text-[#C9A96E] block font-sans">
            CURATED REAL ESTATE PORTFOLIO
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#1A1A1A] tracking-tight">
            Premium Properties For Sale
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-light max-w-xl mx-auto tracking-wide leading-relaxed">
            Browse our carefully vetted catalog of freehold luxury apartments, water-front penthouses, and private estates across Abu Dhabi's elite investment zones.
          </p>
        </div>

        {/* Search filter block */}
        <div className="bg-white p-6 border border-[#EAE6DF] shadow-md mb-12">
          <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* TYPE Dropdown */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Property Configuration</label>
              <div className="relative">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full bg-[#F8F6F2] text-xs font-medium uppercase tracking-wider py-2.5 px-3 border border-[#EAE6DF] focus:border-[#C9A96E] focus:outline-none appearance-none rounded-none text-gray-800 cursor-pointer"
                >
                  <option value="">All Types</option>
                  {propertyTypes.map((t) => (
                    <option key={t} value={t}>{t}s</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* LOCATION Dropdown */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Area / Geographic Quadrant</label>
              <div className="relative">
                <select
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-[#F8F6F2] text-xs font-medium uppercase tracking-wider py-2.5 px-3 border border-[#EAE6DF] focus:border-[#C9A96E] focus:outline-none appearance-none rounded-none text-gray-800 cursor-pointer"
                >
                  <option value="">All Areas</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* BUDGET Dropdown */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Premium Budget Tier</label>
              <div className="relative">
                <select
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                  className="w-full bg-[#F8F6F2] text-xs font-medium uppercase tracking-wider py-2.5 px-3 border border-[#EAE6DF] focus:border-[#C9A96E] focus:outline-none appearance-none rounded-none text-gray-800 cursor-pointer"
                >
                  <option value="">Any Budget</option>
                  <option value="Under AED 5M">Under AED 5,000,000</option>
                  <option value="AED 5M - 10M">AED 5,000,000 – AED 10,000,000</option>
                  <option value="Over AED 10M">Over AED 10,000,000</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* ACTION TRIGGERS */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              <button
                type="submit"
                className="bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase py-3 px-4 text-center select-none transition-colors rounded-none cursor-pointer"
              >
                APPLY PARAMETERS
              </button>
              {(searchType || searchLocation || searchBudget) && (
                <button
                  type="button"
                  onClick={onReset}
                  className="bg-transparent hover:bg-gray-100 text-gray-400 hover:text-gray-800 text-[10px] font-bold tracking-widest uppercase py-2.5 px-4 border border-[#EAE6DF] text-center rounded-none select-none"
                >
                  CLEAR
                </button>
              )}
            </div>

          </form>
        </div>

        {/* Filters Swapper category tab */}
        <div className="flex flex-wrap gap-2 items-center justify-between mb-8 pb-4 border-b border-[#EAE6DF]/60">
          <div className="flex flex-wrap gap-1.5">
            {["All", "Apartment", "Penthouse", "Villa", "Mansion"].map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`text-[9px] font-bold tracking-widest uppercase py-2 px-3 transition-all rounded-none cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#1C2B4A] text-white border border-[#1C2B4A]"
                    : "bg-white hover:bg-gray-50 text-gray-500 border border-[#EAE6DF]"
                }`}
              >
                {tab === "All" ? "All" : `${tab}s`}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-bold text-gray-400 font-mono tracking-widest uppercase">
            [ SECURED ENTRIES: {filteredProperties.length} ]
          </span>
        </div>

        {/* Property Grid listings */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white border border-[#EAE6DF] max-w-lg mx-auto p-12 text-center space-y-4 shadow-xl">
            <Building2 className="mx-auto text-gray-300" size={48} />
            <h4 className="font-serif text-2xl font-light text-slate-850">No properties match parameters</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-light font-sans">
              Our discrete off-market portfolio coordinate multi-signature high-rise listings and island locations that are never made public. Request an off-list brief.
            </p>
            <button
              onClick={onReset}
              className="bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase py-3 px-6 rounded-none inline-block"
            >
              LOAD COMPLETE PORTFOLIO
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <article
                key={property.id}
                onClick={() => onSelectProperty(property)}
                className="group bg-white border border-[#EAE6DF] overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-750"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#C9A96E] text-white text-[9px] font-bold uppercase tracking-widest py-1 px-2 shadow-sm">
                      {property.badge}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-950 text-[9px] font-bold uppercase tracking-widest py-1 px-2.5 border border-gray-100">
                      {property.type}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      <MapPin size={10} className="text-[#C9A96E]" />
                      <span>{property.location}</span>
                    </div>
                    <h4 className="font-serif text-lg font-normal text-gray-950 group-hover:text-[#C9A96E] transition-colors leading-snug">
                      {property.name}
                    </h4>
                    <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-2 font-sans">
                      {property.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F8F6F2] space-y-4">
                    {/* Size list */}
                    <div className="grid grid-cols-3 gap-1.5 text-center text-gray-500 text-[10px] font-medium font-sans">
                      <div className="bg-[#F8F6F2] py-2 flex flex-col items-center">
                        <Bed size={12} className="text-[#C9A96E] mb-1" />
                        <span>{property.bedrooms} Beds</span>
                      </div>
                      <div className="bg-[#F8F6F2] py-2 flex flex-col items-center">
                        <Bath size={12} className="text-[#C9A96E] mb-1" />
                        <span>{property.bathrooms} Baths</span>
                      </div>
                      <div className="bg-[#F8F6F2] py-2 flex flex-col items-center">
                        <Maximize2 size={12} className="text-[#C9A96E] mb-1" />
                        <span>{property.sizeSqFt.toLocaleString()} sqft</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <div>
                        <span className="text-[8px] text-gray-400 block tracking-normal uppercase font-bold">Invesment price</span>
                        <span className="text-sm font-serif font-semibold text-gray-950">{property.price}</span>
                      </div>
                      <span className="text-[9px] font-bold tracking-widest text-[#C9A96E] uppercase border-b border-[#C9A96E]/50 pb-0.5 group-hover:border-[#C9A96E] transition-colors">
                        ENQUIRE PORTMANTEAU
                      </span>
                    </div>
                  </div>
                </div>

              </article>
            ))}
          </div>
        )}

        {/* 4 Trust points in line with Section 6 */}
        <div className="mt-20 border-t border-[#EAE6DF]/60 pt-16">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-semibold text-[#C9A96E] tracking-[0.4em] uppercase">SECURING TRUST SIGNAL</span>
            <h3 className="font-serif text-xl sm:text-3xl text-[#1A1A1A] font-light">Why Buy With Residence Abudhabi?</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-5 border border-[#EAE6DF]/60 text-left space-y-2 relative">
              <div className="text-[#C9A96E] font-medium font-serif text-lg">[ 01 ]</div>
              <h4 className="font-serif font-semibold text-sm text-gray-950">Direct Developer Priority</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed font-light">Priority booking gates at first launch pricing with Aldar, Emaar and custom local design architects.</p>
            </div>
            <div className="bg-white p-5 border border-[#EAE6DF]/60 text-left space-y-2 relative">
              <div className="text-[#C9A96E] font-medium font-serif text-lg">[ 02 ]</div>
              <h4 className="font-serif font-semibold text-sm text-gray-950">Zero Bureaucracy Checks</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed font-light">Our legal officers streamline direct escrow coordinates and digital reservation filings in under 24 hours.</p>
            </div>
            <div className="bg-white p-5 border border-[#EAE6DF]/60 text-left space-y-2 relative">
              <div className="text-[#C9A96E] font-medium font-serif text-lg">[ 03 ]</div>
              <h4 className="font-serif font-semibold text-sm text-gray-950">Golden Residency Paths</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed font-light">End-to-end alignment with the real estate-based 10-year Golden Visa application board.</p>
            </div>
            <div className="bg-white p-5 border border-[#EAE6DF]/60 text-left space-y-2 relative">
              <div className="text-[#C9A96E] font-medium font-serif text-lg">[ 04 ]</div>
              <h4 className="font-serif font-semibold text-sm text-gray-950">Discreet Off-List catalog</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed font-light">Direct phone access to off-market penthouses and private lagoons that never touch public files.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
