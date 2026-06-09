import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, Calendar, User, Search, ChevronRight, ExternalLink, MessageCircle } from "lucide-react";
import { blogPosts as staticPosts } from "../blogData";

interface BlogPageProps {
  onShowConsultation: () => void;
  onNavigate: (path: string) => void;
  initialSlug?: string;
}

interface UnifiedPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  summary: string;
  content: string;
  isFromDB: boolean;
  videoUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
  author?: string;
  aiGenerated?: boolean;
}

const WHATSAPP = "971554226593";

function embedVideo(url: string) {
  if (!url) return null;
  let src = "";
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (yt) src = `https://www.youtube.com/embed/${yt[1]}`;
  else if (vm) src = `https://player.vimeo.com/video/${vm[1]}`;
  if (!src) return null;
  return (
    <div className="aspect-video w-full mb-8">
      <iframe src={src} className="w-full h-full" allowFullScreen title="Video" />
    </div>
  );
}

function renderContent(content: string) {
  if (!content) return null;
  if (content.trimStart().startsWith("<")) {
    return (
      <div
        className="prose prose-lg max-w-none text-gray-700 leading-relaxed
          prose-headings:font-serif prose-headings:text-[#1C2B4A] prose-headings:font-light
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:mb-5 prose-p:text-[15px]
          prose-a:text-[#C9A96E] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[#1C2B4A] prose-strong:font-semibold
          prose-ul:my-4 prose-li:mb-2"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  const paras = content.split("\n\n").filter(Boolean);
  return (
    <div className="space-y-5">
      {paras[0] && (
        <p className="font-medium text-[#1A1A1A] text-base sm:text-lg border-l-4 border-[#C9A96E] pl-6 py-1 bg-[#F8F6F2]/40">
          {paras[0]}
        </p>
      )}
      {paras.slice(1).map((p, i) => (
        <p key={i} className="text-[15px] text-gray-700 leading-relaxed">{p}</p>
      ))}
    </div>
  );
}

export default function BlogPage({ onShowConsultation, onNavigate, initialSlug }: BlogPageProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePost, setActivePost] = useState<UnifiedPost | null>(null);
  const [allPosts, setAllPosts] = useState<UnifiedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      let dbPosts: UnifiedPost[] = [];
      try {
        const r = await fetch("/api/blog");
        if (r.ok) {
          const data = await r.json();
          dbPosts = data.map((p: any) => ({
            slug: p.slug,
            title: p.title,
            category: p.category,
            date: p.published_date || "",
            readTime: p.read_time || "5 min read",
            image: p.image_url || "",
            summary: p.summary || "",
            content: p.content || "",
            isFromDB: true,
            videoUrl: p.video_url || "",
            sourceUrl: p.source_url || "",
            sourceName: p.source_name || "",
            author: p.author || "AB Residences Editorial",
            aiGenerated: p.ai_generated || false,
          }));
        }
      } catch (_) {}

      const dbSlugs = new Set(dbPosts.map((p) => p.slug));
      const staticNorm: UnifiedPost[] = staticPosts
        .filter((p) => !dbSlugs.has(p.slug))
        .map((p) => ({
          slug: p.slug,
          title: p.title,
          category: p.category,
          date: p.date,
          readTime: p.readTime,
          image: p.image,
          summary: p.summary,
          content: p.content.join("\n\n"),
          isFromDB: false,
          author: "AB Residences Editorial",
        }));

      const merged = [...dbPosts, ...staticNorm];
      setAllPosts(merged);

      if (initialSlug) {
        const match = merged.find((p) => p.slug === initialSlug);
        if (match) { setActivePost(match); window.scrollTo({ top: 0, behavior: "instant" }); }
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!allPosts.length) return;
    if (initialSlug) {
      const match = allPosts.find((p) => p.slug === initialSlug);
      if (match) { setActivePost(match); window.scrollTo({ top: 0, behavior: "instant" }); return; }
    }
    setActivePost(null);
  }, [initialSlug, allPosts.length]);

  const handleSelectPost = (post: UnifiedPost) => {
    setActivePost(post);
    window.history.pushState({}, "", `/blog/${post.slug}`);
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = `${post.title} | AB Residences`;
  };

  const handleBack = () => {
    setActivePost(null);
    window.history.pushState({}, "", "/blog");
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = "Abu Dhabi Real Estate Blog | AB Residences";
  };

  const categories = ["All", "Market News", "Investment Guides", "Area Profiles", "Off Plan"];
  const filteredPosts = allPosts.filter((p) => {
    const catOk = activeCategory === "All" || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const searchOk = !q || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q);
    return catOk && searchOk;
  });

  if (activePost) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <button onClick={handleBack}
            className="group flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-[#C9A96E] transition-colors mb-10 focus:outline-none cursor-pointer">
            <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Blog</span>
          </button>

          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="bg-[#C9A96E] text-white text-[9px] font-bold uppercase tracking-widest py-1 px-2.5">{activePost.category}</span>
            {activePost.aiGenerated && <span className="bg-purple-600 text-white text-[9px] font-bold uppercase tracking-widest py-1 px-2.5">AI Editorial</span>}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#1A1A1A] leading-tight tracking-tight mb-4">
            {activePost.title}
          </h1>

          <p className="text-base text-gray-600 mb-6 leading-relaxed border-l-2 border-[#C9A96E] pl-4">
            {activePost.summary}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-8">
            <span className="flex items-center space-x-1"><Calendar size={12} className="text-[#C9A96E]" /><span>{activePost.date}</span></span>
            <span>•</span>
            <span className="flex items-center space-x-1"><Clock size={12} className="text-[#C9A96E]" /><span>{activePost.readTime}</span></span>
            <span>•</span>
            <span className="flex items-center space-x-1"><User size={12} className="text-[#C9A96E]" /><span>{activePost.author || "AB Residences Editorial"}</span></span>
          </div>

          {activePost.image && (
            <div className="aspect-[16/9] bg-gray-100 overflow-hidden mb-8">
              <img src={activePost.image} alt={activePost.title} className="w-full h-full object-cover" />
              {activePost.sourceName && activePost.sourceUrl && (
                <p className="text-[10px] text-gray-400 mt-1">
                  Image: <a href={activePost.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A96E]">{activePost.sourceName}</a>
                </p>
              )}
            </div>
          )}

          {activePost.videoUrl && embedVideo(activePost.videoUrl)}

          <article className="mb-10 border-b border-[#EAE6DF] pb-10">
            {renderContent(activePost.content)}
          </article>

          {activePost.sourceUrl && (
            <div className="border border-[#EAE6DF] p-4 mb-8 flex items-start space-x-3">
              <ExternalLink size={14} className="text-[#C9A96E] mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-1">Source</p>
                <a href={activePost.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#C9A96E] hover:underline">
                  {activePost.sourceName || activePost.sourceUrl}
                </a>
              </div>
            </div>
          )}

          <div className="bg-[#F8F6F2] p-8 border border-[#EAE6DF] text-center space-y-5 mb-10">
            <div className="w-10 h-0.5 bg-[#C9A96E] mx-auto" />
            <h3 className="font-serif text-2xl font-normal text-slate-900 leading-tight">
              Interested in Abu Dhabi Property?
            </h3>
            <p className="text-xs text-gray-500 font-light max-w-lg mx-auto leading-relaxed">
              Our advisors coordinate off-plan allocations, pricing structures, and golden visa portfolios for serious investors.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
              <button onClick={onShowConsultation}
                className="bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase px-6 py-3.5 rounded-none w-full sm:w-auto transition-all cursor-pointer">
                Book a Consultation
              </button>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 border border-[#1C2B4A] text-[#1C2B4A] hover:bg-[#1C2B4A] hover:text-white text-[10px] font-bold tracking-widest uppercase px-6 py-3.5 w-full sm:w-auto transition-all">
                <MessageCircle size={13} /><span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-xl font-normal text-gray-950 border-b border-gray-100 pb-3">Further Reading</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allPosts.filter((p) => p.slug !== activePost.slug).slice(0, 2).map((post) => (
                <article key={post.slug} onClick={() => handleSelectPost(post)}
                  className="p-5 border border-[#EAE6DF] hover:border-[#C9A96E] bg-white text-left transition-all cursor-pointer space-y-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#C9A96E]">{post.category}</span>
                  <h5 className="font-serif text-base font-normal text-gray-900 line-clamp-2 leading-snug">{post.title}</h5>
                  <span className="text-[10px] font-bold text-[#1C2B4A] uppercase tracking-widest block pt-1">READ ARTICLE →</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#F8F6F2]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-semibold tracking-[0.4em] uppercase text-[#C9A96E] block">Market Briefings & Editorials</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#1A1A1A] tracking-tight">Abu Dhabi Real Estate Blog</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-light max-w-xl mx-auto leading-relaxed">
            Market analysis, investment guides, project spotlights, and economy insights compiled by our advisory team — updated daily.
          </p>
        </div>

        <div className="bg-white p-5 border border-[#EAE6DF] mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`text-[9px] font-bold tracking-widest uppercase py-2 px-3 transition-colors cursor-pointer ${activeCategory === cat ? "bg-[#1C2B4A] text-white" : "bg-[#F8F6F2] text-gray-600 hover:bg-[#EAE6DF]"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <input type="text" placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-[#F8F6F2] py-2 px-3 pl-9 border border-[#EAE6DF] focus:border-[#C9A96E] focus:outline-none rounded-none" />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading articles...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white border border-[#EAE6DF] p-10 text-center max-w-md mx-auto space-y-4">
            <Search size={32} className="mx-auto text-gray-300" />
            <h4 className="font-serif text-xl font-light text-gray-800">No articles found</h4>
            <button onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
              className="bg-[#1C2B4A] text-white text-[9px] font-bold tracking-widest uppercase px-5 py-2.5 cursor-pointer">
              RESET FILTER
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.slug} onClick={() => handleSelectPost(post)}
                className="group bg-white border border-[#EAE6DF] overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col">
                <div className="relative overflow-hidden aspect-[16/10] bg-gray-50">
                  {post.image ? (
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-[#1C2B4A] flex items-center justify-center">
                      <span className="text-[#C9A96E] font-serif text-lg opacity-50">AB Residences</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5">
                    <span className="bg-[#C9A96E] text-white text-[9px] font-bold uppercase tracking-widest py-1 px-2 shadow-sm">{post.category}</span>
                    {post.aiGenerated && <span className="bg-purple-600 text-white text-[9px] font-bold uppercase tracking-widest py-1 px-2">AI</span>}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[9px] font-bold tracking-wider text-gray-400 font-mono">
                      <span>{post.date}</span><span>•</span><span>{post.readTime}</span>
                    </div>
                    <h4 className="font-serif text-lg sm:text-xl font-normal text-gray-900 group-hover:text-[#C9A96E] transition-colors leading-snug line-clamp-2">{post.title}</h4>
                    <p className="text-xs text-gray-500 font-light line-clamp-3 leading-relaxed">{post.summary}</p>
                  </div>
                  <div className="pt-2 border-t border-[#F8F6F2] flex justify-between items-center">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#1C2B4A] group-hover:text-[#C9A96E] transition-colors">READ ARTICLE →</span>
                    <ChevronRight size={14} className="text-[#1C2B4A] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
