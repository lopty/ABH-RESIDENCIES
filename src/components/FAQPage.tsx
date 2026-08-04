import React, { useState } from "react";
import { ChevronDown, ChevronUp, Check, Phone } from "lucide-react";
import { faqItems } from "../blogData";

interface FAQPageProps {
  onRequestCallback: () => void;
}

export default function FAQPage({ onRequestCallback }: FAQPageProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : openIndex);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#F8F6F2]/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumbs */}
        <div className="text-xs uppercase tracking-widest text-[#C9A96E] mb-6 font-medium space-x-2">
          <span>Home</span>
          <span>•</span>
          <span className="text-gray-500">FAQ Page</span>
        </div>

        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-semibold tracking-[0.4em] uppercase text-[#C9A96E] block">
            KNOWLEDGE ACADEMY & ADVISORY
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#1A1A1A] tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-light max-w-xl mx-auto tracking-wide leading-relaxed">
            Essential legal, payment, and area information for foreign citizens and institutional wealth allocating into Abu Dhabi.
          </p>
        </div>

        {/* Collapsible Accordion Stream */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqItems.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white border border-[#EAE6DF] shadow-sm transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left py-5 px-6 flex justify-between items-center bg-white hover:bg-[#F8F6F2]/50 transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="font-serif text-[15px] sm:text-lg text-slate-950 font-medium tracking-tight pr-4">
                    {item.question}
                  </span>
                  <span className="text-[#C9A96E]">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 border-t border-[#F8F6F2] font-sans text-xs sm:text-sm text-gray-600 font-light leading-relaxed animate-fadeIn">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Help Grid */}
        <div className="mt-16 bg-white border border-[#EAE6DF] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-lg space-y-6">
          <div className="w-12 h-1 bg-[#C9A96E] mx-auto" />
          <h3 className="font-serif text-xl sm:text-2xl text-slate-950 font-normal">
            Require tailor-made legal coordination?
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed font-light">
            Our accredited advisors coordinate freehold trust deeds, UAE Golden Visa applications, and multi-signature developer handshakes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <button
              onClick={onRequestCallback}
              className="bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase px-6 py-3 rounded-none w-full sm:w-auto transition-all"
            >
              REQUEST VIP CALLBACK
            </button>
            <a
              href="https://wa.me/971554226593?text=Hello.%20I%20have%20questions%20regarding%20Abu%20Dhabi%20freehold%20property%20investing."
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] text-white text-[10px] font-bold tracking-widest uppercase px-6 py-3 rounded-none w-full sm:w-auto text-center block"
            >
              CHAT WITH LIVE BROKER
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
