import { ArrowRight, CheckCircle } from "lucide-react";

interface Section {
  heading: string;
  body: string;
}

interface LandingPageProps {
  slug: string;
  headline: string;
  subheadline: string;
  heroImg: string;
  ctaLabel: string;
  onCta: () => void;
  sections: Section[];
}

export default function LandingPage({ headline, subheadline, heroImg, ctaLabel, onCta, sections }: LandingPageProps) {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <img src={heroImg} alt={headline} className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase font-semibold mb-4">AB Residences · Abu Dhabi</p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-3xl mb-4">
            {headline}
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl leading-relaxed mb-8">
            {subheadline}
          </p>
          <button
            onClick={onCta}
            className="inline-flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8955c] text-white text-xs font-bold tracking-[0.2em] uppercase px-8 py-4 transition-colors cursor-pointer"
          >
            {ctaLabel}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Content sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="space-y-14">
          {sections.map((section, i) => (
            <div key={i} className="flex gap-6">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle size={20} className="text-[#C9A96E]" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1C2B4A] mb-3">
                  {section.heading}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {section.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 pt-12 border-t border-gray-100 text-center">
          <p className="text-xs text-[#C9A96E] tracking-widest uppercase font-semibold mb-3">Ready to take the next step?</p>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#1C2B4A] font-semibold mb-6">
            Speak with an AB Residences Specialist
          </h3>
          <button
            onClick={onCta}
            className="inline-flex items-center gap-2 bg-[#1C2B4A] hover:bg-[#131E33] text-white text-xs font-bold tracking-[0.2em] uppercase px-10 py-4 transition-colors cursor-pointer"
          >
            {ctaLabel}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
