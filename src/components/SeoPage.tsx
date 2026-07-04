import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp, CheckCircle, ExternalLink } from "lucide-react";
import { SeoPageData } from "../seo/types";

interface SeoPageProps {
  page: SeoPageData;
  onCta: () => void;
}

export default function SeoPage({ page, onCta }: SeoPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroImg = page.heroImg || "/jumeirah-hero.png";

  const navigate = (href: string) => {
    window.history.pushState({}, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative h-[52vh] min-h-[360px] overflow-hidden">
        <img src={heroImg} alt={page.headline} className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          {page.eyebrow && (
            <p className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase font-semibold mb-4">
              {page.eyebrow}
            </p>
          )}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-4xl mb-4">
            {page.headline}
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl leading-relaxed mb-8">
            {page.subheadline}
          </p>
          <button
            onClick={onCta}
            className="inline-flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8955c] text-white text-xs font-bold tracking-[0.2em] uppercase px-8 py-4 transition-colors cursor-pointer"
          >
            Speak with an Advisor
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      {page.stats && page.stats.length > 0 && (
        <div className="bg-[#1C2B4A] text-white">
          <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {page.stats.map((stat, i) => (
              <div key={i}>
                <div className="text-[#C9A96E] text-xl sm:text-2xl font-bold font-serif">{stat.value}</div>
                <div className="text-white/70 text-xs tracking-wide mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

        {/* Intro */}
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-14 border-l-4 border-[#C9A96E] pl-6">
          {page.intro}
        </p>

        {/* Content Sections */}
        <div className="space-y-12 mb-16">
          {page.sections.map((section, i) => (
            <div key={i} className="flex gap-5">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle size={20} className="text-[#C9A96E]" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1C2B4A] mb-3">
                  {section.heading}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {section.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Data Table */}
        {page.table && (
          <div className="mb-16 overflow-x-auto">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1C2B4A] mb-4">Key Figures at a Glance</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1C2B4A] text-white">
                  {page.table.headers.map((h, i) => (
                    <th key={i} className="text-left px-4 py-3 font-semibold tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {page.table.rows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    {row.cells.map((cell, ci) => (
                      <td key={ci} className="px-4 py-3 text-gray-700 border-b border-gray-100">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FAQ */}
        {page.faq && page.faq.length > 0 && (
          <div className="mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C2B4A] mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {page.faq.map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-sm overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <h3 className="text-sm sm:text-base font-semibold text-[#1C2B4A] pr-4">{item.question}</h3>
                    {openFaq === i
                      ? <ChevronUp size={16} className="text-[#C9A96E] flex-shrink-0" />
                      : <ChevronDown size={16} className="text-[#C9A96E] flex-shrink-0" />
                    }
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed bg-white border-t border-gray-100">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Pages */}
        {page.relatedPages && page.relatedPages.length > 0 && (
          <div className="mb-16 p-6 bg-gray-50 border border-gray-100 rounded-sm">
            <h3 className="text-xs text-[#C9A96E] tracking-widest uppercase font-semibold mb-4">Related Guides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {page.relatedPages.map((link, i) => (
                <button
                  key={i}
                  onClick={() => navigate(link.href)}
                  className="flex items-center gap-2 text-sm text-[#1C2B4A] hover:text-[#C9A96E] transition-colors text-left cursor-pointer"
                >
                  <ExternalLink size={12} className="flex-shrink-0 text-[#C9A96E]" />
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="pt-12 border-t border-gray-100 text-center">
          <p className="text-xs text-[#C9A96E] tracking-widest uppercase font-semibold mb-3">
            AD Residences · Abu Dhabi
          </p>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#1C2B4A] font-semibold mb-3">
            Ready to Take the Next Step?
          </h3>
          <p className="text-gray-500 text-sm mb-8 max-w-lg mx-auto">
            Speak with a AD Residences advisor. Private briefings available by appointment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onCta}
              className="inline-flex items-center justify-center gap-2 bg-[#1C2B4A] hover:bg-[#131E33] text-white text-xs font-bold tracking-[0.2em] uppercase px-10 py-4 transition-colors cursor-pointer"
            >
              Request a Briefing
              <ArrowRight size={14} />
            </button>
            <a
              href="https://wa.me/971554226593"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-[#1C2B4A] text-[#1C2B4A] hover:bg-[#1C2B4A] hover:text-white text-xs font-bold tracking-[0.2em] uppercase px-10 py-4 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
