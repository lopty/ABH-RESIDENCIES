import React, { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Clock, ExternalLink, MessageCircle } from "lucide-react";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  published_date: string;
  read_time: string;
  image_url: string;
  video_url: string;
  summary: string;
  content: string;
  author: string;
  source_url: string;
  source_name: string;
  ai_generated: boolean;
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
  return (
    <div className="space-y-5">
      {content.split("\n\n").filter(Boolean).map((para, i) => (
        <p key={i} className="text-[15px] text-gray-700 leading-relaxed">{para}</p>
      ))}
    </div>
  );
}

interface Props {
  slug: string;
  onNavigate: (path: string) => void;
}

export default function BlogPostPage({ slug, onNavigate }: Props) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`/api/blog/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data) => { setPost(data); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | Residence Abudhabi`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", post.summary);

    const schemaEl = document.getElementById("article-schema");
    if (schemaEl) schemaEl.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "article-schema";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.summary,
      image: post.image_url,
      author: { "@type": "Organization", name: post.author || "Residence Abudhabi Editorial" },
      publisher: {
        "@type": "Organization",
        name: "Residence Abudhabi",
        logo: { "@type": "ImageObject", url: "https://residenceabudhabi.com/logo.png" },
      },
      datePublished: post.created_at || post.published_date,
      dateModified: post.created_at || post.published_date,
      mainEntityOfPage: { "@type": "WebPage", "@id": `https://residenceabudhabi.com/blog/${post.slug}` },
    });
    document.head.appendChild(script);
    return () => { document.getElementById("article-schema")?.remove(); };
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-3xl font-light text-[#1C2B4A] mb-4">Article Not Found</h1>
        <p className="text-gray-500 mb-8">This article may have been moved or removed.</p>
        <button onClick={() => onNavigate("/blog")} className="text-[#C9A96E] hover:underline text-sm font-semibold">
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <button
          onClick={() => onNavigate("/blog")}
          className="flex items-center space-x-2 text-xs text-gray-400 hover:text-[#C9A96E] uppercase tracking-widest font-bold mb-10 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Blog</span>
        </button>

        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-[#1C2B4A] text-white px-3 py-1.5">
            {post.category}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#1C2B4A] leading-snug mb-5">
          {post.title}
        </h1>

        <p className="text-base text-gray-600 mb-6 leading-relaxed border-l-2 border-[#C9A96E] pl-4">
          {post.summary}
        </p>

        <div className="flex items-center space-x-4 text-[11px] text-gray-400 uppercase tracking-widest mb-8">
          <span className="flex items-center space-x-1.5">
            <Calendar size={12} />
            <span>{post.published_date}</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Clock size={12} />
            <span>{post.read_time}</span>
          </span>
          <span>{post.author || "Residence Abudhabi Editorial"}</span>
        </div>

        {post.image_url && (
          <div className="mb-8 aspect-[16/9] overflow-hidden">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
            {post.source_name && post.source_url && (
              <p className="text-[10px] text-gray-400 mt-1">
                Image source:{" "}
                <a href={post.source_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A96E]">
                  {post.source_name}
                </a>
              </p>
            )}
          </div>
        )}

        {post.video_url && embedVideo(post.video_url)}

        <article className="mb-12">
          {renderContent(post.content)}
        </article>

        {post.source_url && (
          <div className="border border-[#EAE6DF] p-4 mb-8 flex items-start space-x-3">
            <ExternalLink size={14} className="text-[#C9A96E] mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-1">Source</p>
              <a href={post.source_url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#C9A96E] hover:underline">
                {post.source_name || post.source_url}
              </a>
            </div>
          </div>
        )}

        <div className="bg-[#1C2B4A] text-white p-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9A96E] mb-3">Speak with an Advisor</p>
          <h2 className="font-serif text-2xl font-light mb-3">Interested in Abu Dhabi Property?</h2>
          <p className="text-sm text-gray-300 mb-6">Our consultants are available 6 days a week to walk you through any investment opportunity.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate("/contact")}
              className="bg-[#C9A96E] hover:bg-[#b8945c] text-white text-[10px] font-bold tracking-widest uppercase px-8 py-3 transition-colors cursor-pointer"
            >
              Book a Consultation
            </button>
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hello, I read your article "${post.title}" and would like to know more.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 border border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E] hover:text-white text-[10px] font-bold tracking-widest uppercase px-8 py-3 transition-colors"
            >
              <MessageCircle size={14} />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-[#EAE6DF]">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4">Continue Reading</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Buy Property in Abu Dhabi", path: "/buy" },
              { label: "Jumeirah Residences Guide", path: "/properties/jumeirah-residences" },
              { label: "Al Maryah Island Guide", path: "/properties/al-maryah-island" },
              { label: "All Articles", path: "/blog" },
            ].map((link) => (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className="text-[11px] border border-[#EAE6DF] px-4 py-2 text-gray-600 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
