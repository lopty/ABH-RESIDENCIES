import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, Calendar, User, Eye, Search, ChevronRight } from "lucide-react";
import { blogPosts, BlogPost } from "../blogData";

interface BlogPageProps {
  onShowConsultation: () => void;
  onNavigate: (path: string) => void;
  initialSlug?: string;
}

export default function BlogPage({ onShowConsultation, onNavigate, initialSlug }: BlogPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  // Sync with dynamic deep slug changes (such as linking from homepage or properties page!)
  useEffect(() => {
    if (initialSlug) {
      const match = blogPosts.find(p => p.slug === initialSlug);
      if (match) {
        setActivePost(match);
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }
    }
    setActivePost(null);
  }, [initialSlug]);

  // Read view navigation helpers
  const handleSelectPost = (post: BlogPost) => {
    setActivePost(post);
    // Push the updated path logically to update URL deep linking!
    window.history.pushState({}, "", `/blog/${post.slug}`);
    // Scroll top
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleBackToGrid = () => {
    setActivePost(null);
    window.history.pushState({}, "", "/blog");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Filter & search posts database
  const categories = ["All", "Market News", "Investment Guides", "Area Profiles", "Off Plan"];
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Render Single Article Detail View
  if (activePost) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Back button and relative route path */}
          <button 
            onClick={handleBackToGrid}
            className="group flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-[#C9A96E] transition-colors mb-8 focus:outline-none cursor-pointer"
          >
            <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Market Advisory Blog</span>
          </button>

          {/* Article Header metrics */}
          <div className="space-y-4 mb-8">
            <span className="bg-[#C9A96E] text-white text-[9px] font-bold uppercase tracking-widest py-1 px-2.5">
              {activePost.category}
            </span>
            
            <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#1A1A1A] leading-tight tracking-tight">
              {activePost.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono pt-2">
              <span className="flex items-center space-x-1">
                <Calendar size={12} className="text-[#C9A96E]" />
                <span>{activePost.date}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock size={12} className="text-[#C9A96E]" />
                <span>{activePost.readTime}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <User size={12} className="text-[#C9A96E]" />
                <span>RESIDENCE ADVISORY BOARD</span>
              </span>
            </div>
          </div>

          {/* Full-width elegant image header */}
          <div className="aspect-[21/9] bg-gray-100 border border-[#EAE6DF] overflow-hidden mb-12">
            <img 
              src={activePost.image} 
              alt={activePost.title}
              className="w-full h-full object-cover brightness-[0.98]"
            />
          </div>

          {/* Article Main Markdown-like Body copy */}
          <div className="prose max-w-none text-[#1A1A1A] font-light leading-relaxed space-y-6 text-sm sm:text-base font-sans tracking-wide border-b border-[#EAE6DF] pb-12 mb-12">
            
            {/* Displaying first paragraph as a bold standfirst */}
            <p className="font-medium text-[#1A1A1A] text-base sm:text-lg border-l-4 border-[#C9A96E] pl-6 py-1 bg-[#F8F6F2]/40">
              {activePost.content[0]}
            </p>

            {activePost.content.slice(1).map((paragraph, index) => (
              <p key={index} className="text-gray-700">
                {paragraph}
              </p>
            ))}

          </div>

          {/* Dedicated call-out box inside individual post */}
          <div className="bg-[#F8F6F2] p-8 border border-[#EAE6DF] text-center space-y-6 mb-12">
            <div className="w-12 h-1 bg-[#C9A96E] mx-auto" />
            <h3 className="font-serif text-2xl font-normal text-slate-900 leading-tight">
              Review exclusive opportunities related to this article?
            </h3>
            <p className="text-xs text-gray-500 font-light max-w-lg mx-auto leading-relaxed">
              We frequently coordinate off-plan allocation charts, pricing tables, and golden-visa portfolios for high-yield structures matching these parameters.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
              <button
                onClick={onShowConsultation}
                className="bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase px-6 py-3.5 rounded-none w-full sm:w-auto transition-all cursor-pointer"
              >
                REQUEST DISCREET BRIEFING
              </button>
              <button
                onClick={() => onNavigate("/properties/jumeirah-residences")}
                className="bg-transparent hover:bg-white text-[#1C2B4A] border border-[#1C2B4A] hover:border-[#131E33] text-[10px] font-bold tracking-widest uppercase px-6 py-3.5 rounded-none w-full sm:w-auto transition-all cursor-pointer"
              >
                VIEW FEATURING PROJECTS
              </button>
            </div>
          </div>

          {/* Related articles links */}
          <div className="space-y-6">
            <h4 className="font-serif text-xl font-normal text-gray-950 border-b border-gray-100 pb-3">
              Read Further Advisory Articles
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts
                .filter(p => p.slug !== activePost.slug)
                .slice(0, 2)
                .map(post => (
                  <article 
                    key={post.slug}
                    onClick={() => handleSelectPost(post)}
                    className="p-5 border border-[#EAE6DF] hover:border-[#C9A96E] bg-white text-left transition-all duration-300 cursor-pointer space-y-3"
                  >
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#C9A96E] font-mono">
                      {post.category}
                    </span>
                    <h5 className="font-serif text-base font-normal text-gray-900 line-clamp-2 leading-snug">
                      {post.title}
                    </h5>
                    <span className="text-[10px] font-bold text-[#1C2B4A] uppercase tracking-widest block pt-2">
                      READ POST →
                    </span>
                  </article>
                ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Render Grid Index View
  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#F8F6F2]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-semibold tracking-[0.4em] uppercase text-[#C9A96E] block">
            MARKET BRIEFINGS & EDITORIALS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#1A1A1A] tracking-tight">
            Abu Dhabi Real Estate Blog
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-light max-w-xl mx-auto tracking-wide leading-relaxed">
            Market analysis reports, Golden Visa specifications, rental indexes, and custom master guides directly compiled by our investment intelligence desk.
          </p>
        </div>

        {/* Filter bar & Search wrapper */}
        <div className="bg-white p-5 border border-[#EAE6DF] mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
          
          {/* Category switcher */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[9px] font-bold tracking-widest uppercase py-2 px-3 transition-colors rounded-none cursor-pointer ${
                  activeCategory === cat 
                    ? "bg-[#1C2B4A] text-white" 
                    : "bg-[#F8F6F2] text-gray-600 hover:bg-[#EAE6DF]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick search input */}
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search advisor briefings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-[#F8F6F2] py-2 px-3 pl-9 border border-[#EAE6DF] focus:border-[#C9A96E] focus:outline-none rounded-none text-gray-800"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

        </div>

        {/* Grid stream */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white border border-[#EAE6DF] p-10 text-center max-w-md mx-auto space-y-4">
            <Search size={32} className="mx-auto text-gray-300" />
            <h4 className="font-serif text-xl font-light text-gray-800">No matching articles found</h4>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              We offer off-line briefings on special topics. Contact our desk to fetch a Custom Market Study.
            </p>
            <button 
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
              className="bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[9px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-none"
            >
              RESET ADVANCE FILTER
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article 
                key={post.slug}
                onClick={() => handleSelectPost(post)}
                className="group bg-white border border-[#EAE6DF] overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative overflow-hidden aspect-[16/10] bg-gray-50">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#C9A96E] text-white text-[9px] font-bold uppercase tracking-widest py-1 px-2 shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[9px] font-bold tracking-wider text-gray-400 font-mono">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h4 className="font-serif text-lg sm:text-xl font-normal text-gray-900 group-hover:text-[#C9A96E] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-gray-500 font-light line-clamp-3 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F8F6F2] flex justify-between items-center">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#1C2B4A] group-hover:text-[#C9A96E] transition-colors">
                      READ BRIEFING →
                    </span>
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
