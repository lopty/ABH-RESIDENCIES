import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit3, Save, X, LogOut, Eye, EyeOff, Building2, BookOpen, Upload, Link, RefreshCw, Sparkles, Loader2, Video } from "lucide-react";

interface AdminPanelProps {
  onNavigate: (path: string) => void;
}

type Tab = "properties" | "blog";

interface DBProperty {
  id: string;
  name: string;
  location: string;
  price: string;
  price_numeric: number;
  type: string;
  area: string;
  badge: string;
  image_url: string;
  video_url: string;
  bedrooms: number;
  bathrooms: number;
  size_sqft: number;
  description: string;
  featured: boolean;
}

interface DBBlogPost {
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
  status: string;
  ai_generated: boolean;
  source_url: string;
  source_name: string;
  author: string;
}

const emptyProp: Omit<DBProperty, "id"> = {
  name: "", location: "", price: "", price_numeric: 0, type: "Apartment",
  area: "Al Maryah Island", badge: "Off-Plan", image_url: "", video_url: "",
  bedrooms: 1, bathrooms: 1, size_sqft: 0, description: "", featured: false,
};

const emptyBlog: Omit<DBBlogPost, "id" | "slug" | "ai_generated"> = {
  title: "", category: "Market News",
  published_date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  read_time: "5 min read", image_url: "", video_url: "", summary: "",
  content: "", status: "published", source_url: "", source_name: "",
  author: "AD Residences Editorial",
};

const ADMIN_PASSWORD = "rad2026admin";

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [tab, setTab] = useState<Tab>("properties");

  const [properties, setProperties] = useState<DBProperty[]>([]);
  const [blogs, setBlogs] = useState<DBBlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingProp, setEditingProp] = useState<DBProperty | null>(null);
  const [editingBlog, setEditingBlog] = useState<DBBlogPost | null>(null);
  const [showPropForm, setShowPropForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [newProp, setNewProp] = useState<Omit<DBProperty, "id">>(emptyProp);
  const [newBlog, setNewBlog] = useState<Omit<DBBlogPost, "id" | "slug" | "ai_generated">>(emptyBlog);

  const [generating, setGenerating] = useState(false);
  const [genType, setGenType] = useState("news_rewrite");
  const [genMsg, setGenMsg] = useState("");

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/properties");
      setProperties(await r.json());
    } catch (_) {}
    setLoading(false);
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/blog?all=true");
      setBlogs(await r.json());
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    if (authed) { fetchProperties(); fetchBlogs(); }
  }, [authed]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); }
    else { setPwError(true); setTimeout(() => setPwError(false), 2000); }
  };

  const deleteProp = async (id: string) => {
    if (!confirm("Delete this property?")) return;
    await fetch(`/api/properties/${id}`, { method: "DELETE" });
    setProperties((p) => p.filter((x) => x.id !== id));
  };

  const deleteBlog = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    setBlogs((b) => b.filter((x) => x.id !== id));
  };

  const addProp = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch("/api/properties", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newProp) });
    const data = await r.json();
    setProperties((p) => [data, ...p]);
    setNewProp(emptyProp);
    setShowPropForm(false);
  };

  const updateProp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProp) return;
    const r = await fetch(`/api/properties/${editingProp.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingProp) });
    const data = await r.json();
    setProperties((p) => p.map((x) => (x.id === editingProp.id ? data : x)));
    setEditingProp(null);
  };

  const addBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newBlog) });
    const data = await r.json();
    setBlogs((b) => [data, ...b]);
    setNewBlog(emptyBlog);
    setShowBlogForm(false);
  };

  const updateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    const r = await fetch(`/api/blog/${editingBlog.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingBlog) });
    const data = await r.json();
    setBlogs((b) => b.map((x) => (x.id === editingBlog.id ? data : x)));
    setEditingBlog(null);
  };

  const triggerGenerate = async () => {
    setGenerating(true);
    setGenMsg("");
    try {
      const r = await fetch("/api/generate-article", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: genType }) });
      const data = await r.json();
      if (data.success) {
        setGenMsg("Article generated and published!");
        await fetchBlogs();
      } else {
        setGenMsg(`Error: ${data.error}`);
      }
    } catch (e) {
      setGenMsg("Request failed");
    }
    setGenerating(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-sm p-8 border border-[#EAE6DF] shadow-lg border-t-4 border-t-[#C9A96E]">
          <div className="text-center mb-8 space-y-2">
            <h1 className="font-serif text-2xl font-light text-[#1A1A1A]">Admin Panel</h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest">AD Residences</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input type={showPw ? "text" : "password"} placeholder="Admin Password" value={pwInput} onChange={(e) => setPwInput(e.target.value)}
                className={`w-full border ${pwError ? "border-red-400" : "border-[#EAE6DF]"} px-4 py-3 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none pr-10`} autoFocus autoComplete="new-password" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {pwError && <p className="text-red-500 text-xs text-center">Incorrect password</p>}
            <button type="submit" className="w-full bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase py-3 rounded-none cursor-pointer">SIGN IN</button>
          </form>
          <button onClick={() => onNavigate("/")} className="mt-6 text-[10px] text-gray-400 hover:text-[#C9A96E] w-full text-center block uppercase tracking-widest transition-colors cursor-pointer">
            ← Back to Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <div className="bg-[#1C2B4A] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-serif text-lg font-bold tracking-widest">ADMIN PANEL</span>
          <span className="text-[#C9A96E] text-xs font-semibold uppercase tracking-widest">AD Residences</span>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => onNavigate("/")} className="text-xs text-gray-300 hover:text-white uppercase tracking-widest cursor-pointer">View Site</button>
          <button onClick={() => setAuthed(false)} className="flex items-center space-x-1 text-xs text-gray-300 hover:text-white cursor-pointer">
            <LogOut size={14} /><span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex space-x-1 mb-8 border-b border-[#EAE6DF]">
          {(["properties", "blog"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center space-x-2 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${tab === t ? "bg-white text-[#1C2B4A] border-t-2 border-t-[#C9A96E] border-x border-[#EAE6DF] -mb-px" : "text-gray-500 hover:text-[#1C2B4A]"}`}>
              {t === "properties" ? <Building2 size={14} /> : <BookOpen size={14} />}
              <span>{t === "properties" ? `Properties (${properties.length})` : `Blog (${blogs.length})`}</span>
            </button>
          ))}
        </div>

        {tab === "properties" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl font-light text-[#1A1A1A]">Property Listings</h2>
              <div className="flex items-center space-x-2">
                <button onClick={fetchProperties} className="p-2 text-gray-400 hover:text-[#1C2B4A] border border-[#EAE6DF] cursor-pointer" title="Refresh"><RefreshCw size={14} /></button>
                <button onClick={() => { setShowPropForm(!showPropForm); setEditingProp(null); }}
                  className="flex items-center space-x-2 bg-[#C9A96E] hover:bg-[#b8945c] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2.5 cursor-pointer">
                  <Plus size={14} /><span>Add Property</span>
                </button>
              </div>
            </div>

            {showPropForm && (
              <PropertyForm data={newProp} onChange={setNewProp} onSubmit={addProp} onCancel={() => setShowPropForm(false)} submitLabel="Add Property" />
            )}
            {editingProp && (
              <PropertyForm data={editingProp} onChange={(d) => setEditingProp({ ...editingProp, ...d })} onSubmit={updateProp} onCancel={() => setEditingProp(null)} submitLabel="Save Changes" title="Edit Property" />
            )}

            {loading && <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>}
            <div className="grid gap-3">
              {properties.map((p) => (
                <div key={p.id} className="bg-white border border-[#EAE6DF] p-4 flex items-center gap-4">
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="w-24 h-16 object-cover flex-shrink-0" /> : <div className="w-24 h-16 bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-300 text-xs">No image</div>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">{p.name}</h3>
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-[#C9A96E] text-white px-2 py-0.5 shrink-0">{p.badge}</span>
                      {p.featured && <span className="text-[9px] font-bold uppercase tracking-widest bg-[#1C2B4A] text-white px-2 py-0.5 shrink-0">Featured</span>}
                    </div>
                    <p className="text-xs text-gray-500">{p.location}</p>
                    <p className="text-xs font-semibold text-[#1C2B4A] mt-1">{p.price}</p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button onClick={() => { setEditingProp({ ...p }); setShowPropForm(false); }} className="p-2 text-gray-400 hover:text-[#1C2B4A] border border-[#EAE6DF] cursor-pointer"><Edit3 size={14} /></button>
                    <button onClick={() => deleteProp(p.id)} className="p-2 text-gray-400 hover:text-red-500 border border-[#EAE6DF] cursor-pointer"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              {!loading && properties.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No properties yet. Add your first one above.</p>}
            </div>
          </div>
        )}

        {tab === "blog" && (
          <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <h2 className="font-serif text-xl font-light text-[#1A1A1A]">Blog Posts</h2>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center border border-[#EAE6DF] bg-white overflow-hidden">
                  <select value={genType} onChange={(e) => setGenType(e.target.value)} className="text-[10px] uppercase tracking-widest px-3 py-2.5 border-none outline-none bg-transparent cursor-pointer appearance-none">
                    <option value="news_rewrite">News Rewrite</option>
                    <option value="investment_analysis">Investment Analysis</option>
                    <option value="project_jumeirah">Jumeirah Spotlight</option>
                    <option value="project_almaryah">Al Maryah Spotlight</option>
                    <option value="economy_lifestyle">Economy + Lifestyle</option>
                    <option value="market_opportunity">Market Opportunity</option>
                  </select>
                  <button onClick={triggerGenerate} disabled={generating}
                    className="flex items-center space-x-1.5 bg-[#1C2B4A] hover:bg-[#131E33] disabled:opacity-60 text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2.5 cursor-pointer transition-colors">
                    {generating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                    <span>{generating ? "Generating..." : "AI Generate"}</span>
                  </button>
                </div>
                <button onClick={fetchBlogs} className="p-2 text-gray-400 hover:text-[#1C2B4A] border border-[#EAE6DF] bg-white cursor-pointer" title="Refresh"><RefreshCw size={14} /></button>
                <button onClick={() => { setShowBlogForm(!showBlogForm); setEditingBlog(null); }}
                  className="flex items-center space-x-2 bg-[#C9A96E] hover:bg-[#b8945c] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2.5 cursor-pointer">
                  <Plus size={14} /><span>Add Post</span>
                </button>
              </div>
            </div>

            {genMsg && <div className={`text-xs px-4 py-3 font-medium ${genMsg.startsWith("Error") || genMsg === "Request failed" ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>{genMsg}</div>}

            {showBlogForm && (
              <BlogForm data={newBlog} onChange={setNewBlog} onSubmit={addBlog} onCancel={() => setShowBlogForm(false)} submitLabel="Publish Post" />
            )}
            {editingBlog && (
              <BlogForm data={editingBlog} onChange={(d) => setEditingBlog({ ...editingBlog, ...d })} onSubmit={updateBlog} onCancel={() => setEditingBlog(null)} submitLabel="Save Changes" title="Edit Post" />
            )}

            {loading && <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>}
            <div className="grid gap-3">
              {blogs.map((b) => (
                <div key={b.id} className="bg-white border border-[#EAE6DF] p-4 flex items-center gap-4">
                  {b.image_url ? <img src={b.image_url} alt={b.title} className="w-24 h-16 object-cover flex-shrink-0" /> : <div className="w-24 h-16 bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-300 text-xs">No image</div>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-[#1C2B4A] text-white px-2 py-0.5 shrink-0">{b.category}</span>
                      {b.ai_generated && <span className="text-[9px] font-bold uppercase tracking-widest bg-purple-600 text-white px-2 py-0.5 shrink-0">AI</span>}
                      {b.status === "draft" && <span className="text-[9px] font-bold uppercase tracking-widest bg-yellow-500 text-white px-2 py-0.5 shrink-0">Draft</span>}
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 mt-1">{b.title}</h3>
                    <p className="text-xs text-gray-400">{b.published_date} · {b.read_time}</p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button onClick={() => window.open(`/blog/${b.slug}`, "_blank")} className="p-2 text-gray-400 hover:text-[#C9A96E] border border-[#EAE6DF] cursor-pointer" title="Preview"><Eye size={14} /></button>
                    <button onClick={() => { setEditingBlog({ ...b }); setShowBlogForm(false); }} className="p-2 text-gray-400 hover:text-[#1C2B4A] border border-[#EAE6DF] cursor-pointer"><Edit3 size={14} /></button>
                    <button onClick={() => deleteBlog(b.id)} className="p-2 text-gray-400 hover:text-red-500 border border-[#EAE6DF] cursor-pointer"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              {!loading && blogs.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No posts yet. Use AI Generate or add manually.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ImageField({ value, onChange, label = "Image" }: { value: string; onChange: (v: string) => void; label?: string }) {
  const [mode, setMode] = useState<"url" | "upload">(value && !value.startsWith("http") ? "upload" : "url");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const r = await fetch("/api/upload-image", { method: "POST", body: fd });
      const data = await r.json();
      if (data.url) onChange(data.url);
    } catch (_) {}
    setUploading(false);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
        <div className="flex rounded overflow-hidden border border-[#EAE6DF]">
          <button type="button" onClick={() => setMode("url")} className={`flex items-center space-x-1 px-2 py-1 text-[10px] cursor-pointer ${mode === "url" ? "bg-[#1C2B4A] text-white" : "text-gray-500 hover:bg-gray-50"}`}><Link size={10} /><span>URL</span></button>
          <button type="button" onClick={() => setMode("upload")} className={`flex items-center space-x-1 px-2 py-1 text-[10px] cursor-pointer ${mode === "upload" ? "bg-[#1C2B4A] text-white" : "text-gray-500 hover:bg-gray-50"}`}><Upload size={10} /><span>Upload</span></button>
        </div>
      </div>
      {mode === "url" ? (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none" />
      ) : (
        <div className="flex items-center gap-2">
          <input type="file" ref={fileRef} onChange={handleFile} accept="image/*" className="hidden" />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="flex items-center space-x-2 border border-[#EAE6DF] px-3 py-2 text-xs text-gray-600 hover:border-[#C9A96E] cursor-pointer disabled:opacity-60 transition-colors">
            {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
            <span>{uploading ? "Uploading..." : "Choose file"}</span>
          </button>
          {value && <span className="text-xs text-gray-400 truncate max-w-[200px]">{value}</span>}
        </div>
      )}
      {value && <img src={value} alt="Preview" className="mt-2 h-20 object-cover border border-[#EAE6DF]" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
    </div>
  );
}

function VideoField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-1"><Video size={11} /><span>Video URL (YouTube or Vimeo — optional)</span></label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..." className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none" />
    </div>
  );
}

function PropertyForm({ data, onChange, onSubmit, onCancel, submitLabel, title = "Add New Property" }: {
  data: Omit<DBProperty, "id">; onChange: (d: Omit<DBProperty, "id">) => void;
  onSubmit: (e: React.FormEvent) => void; onCancel: () => void; submitLabel: string; title?: string;
}) {
  const inp = "w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none";
  return (
    <div className="bg-white border border-[#C9A96E] p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-lg font-light">{title}</h3>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-700 cursor-pointer"><X size={16} /></button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Property Name *</label><input required type="text" value={data.name} onChange={(e) => onChange({ ...data, name: e.target.value })} className={inp} /></div>
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Location *</label><input required type="text" value={data.location} onChange={(e) => onChange({ ...data, location: e.target.value })} placeholder="e.g. Al Maryah Island, Abu Dhabi" className={inp} /></div>
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Display Price *</label><input required type="text" value={data.price} onChange={(e) => onChange({ ...data, price: e.target.value })} placeholder="e.g. AED 3,500,000" className={inp} /></div>
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Numeric Price</label><input type="number" value={data.price_numeric} onChange={(e) => onChange({ ...data, price_numeric: Number(e.target.value) })} className={inp} /></div>
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Type</label>
            <select value={data.type} onChange={(e) => onChange({ ...data, type: e.target.value })} className={inp + " appearance-none"}>
              <option>Apartment</option><option>Penthouse</option><option>Villa</option><option>Mansion</option>
            </select></div>
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Area</label>
            <select value={data.area} onChange={(e) => onChange({ ...data, area: e.target.value })} className={inp + " appearance-none"}>
              <option>Al Maryah Island</option><option>Saadiyat Island</option><option>Yas Island</option><option>Al Reem Island</option><option>Ramhan Island</option><option>Al Raha Beach</option>
            </select></div>
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Badge</label>
            <select value={data.badge} onChange={(e) => onChange({ ...data, badge: e.target.value })} className={inp + " appearance-none"}>
              <option>Off-Plan</option><option>Ready</option>
            </select></div>
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Bedrooms</label><input type="number" min={1} value={data.bedrooms} onChange={(e) => onChange({ ...data, bedrooms: Number(e.target.value) })} className={inp} /></div>
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Bathrooms</label><input type="number" min={1} step={0.5} value={data.bathrooms} onChange={(e) => onChange({ ...data, bathrooms: Number(e.target.value) })} className={inp} /></div>
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Size (sqft)</label><input type="number" value={data.size_sqft} onChange={(e) => onChange({ ...data, size_sqft: Number(e.target.value) })} className={inp} /></div>
        </div>
        <ImageField value={data.image_url} onChange={(v) => onChange({ ...data, image_url: v })} />
        <VideoField value={data.video_url} onChange={(v) => onChange({ ...data, video_url: v })} />
        <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Description *</label><textarea required rows={3} value={data.description} onChange={(e) => onChange({ ...data, description: e.target.value })} className={inp} /></div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" checked={data.featured} onChange={(e) => onChange({ ...data, featured: e.target.checked })} className="accent-[#C9A96E]" />
          <span className="text-xs text-gray-600">Featured property (shown prominently)</span>
        </label>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="flex items-center space-x-2 bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase px-6 py-3 cursor-pointer"><Save size={13} /><span>{submitLabel}</span></button>
          <button type="button" onClick={onCancel} className="text-[10px] font-bold tracking-widest uppercase text-gray-500 hover:text-gray-800 px-4 py-3 border border-[#EAE6DF] cursor-pointer">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function BlogForm({ data, onChange, onSubmit, onCancel, submitLabel, title = "New Blog Post" }: {
  data: Omit<DBBlogPost, "id" | "slug" | "ai_generated">; onChange: (d: Omit<DBBlogPost, "id" | "slug" | "ai_generated">) => void;
  onSubmit: (e: React.FormEvent) => void; onCancel: () => void; submitLabel: string; title?: string;
}) {
  const inp = "w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none";
  return (
    <div className="bg-white border border-[#C9A96E] p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-lg font-light">{title}</h3>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-700 cursor-pointer"><X size={16} /></button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="md:col-span-2 space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Title *</label><input required type="text" value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} className={inp} /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Category</label>
            <select value={data.category} onChange={(e) => onChange({ ...data, category: e.target.value })} className={inp + " appearance-none"}>
              <option>Market News</option><option>Investment Guides</option><option>Area Profiles</option><option>Off Plan</option>
            </select></div>
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Status</label>
            <select value={data.status} onChange={(e) => onChange({ ...data, status: e.target.value })} className={inp + " appearance-none"}>
              <option value="published">Published</option><option value="draft">Draft</option>
            </select></div>
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Date</label><input type="text" value={data.published_date} onChange={(e) => onChange({ ...data, published_date: e.target.value })} placeholder="e.g. May 31, 2026" className={inp} /></div>
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Read Time</label><input type="text" value={data.read_time} onChange={(e) => onChange({ ...data, read_time: e.target.value })} placeholder="e.g. 7 min read" className={inp} /></div>
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Author</label><input type="text" value={data.author} onChange={(e) => onChange({ ...data, author: e.target.value })} className={inp} /></div>
          <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Source Name (if rewrite)</label><input type="text" value={data.source_name} onChange={(e) => onChange({ ...data, source_name: e.target.value })} placeholder="e.g. The National" className={inp} /></div>
          <div className="md:col-span-2 space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Source URL</label><input type="text" value={data.source_url} onChange={(e) => onChange({ ...data, source_url: e.target.value })} placeholder="https://..." className={inp} /></div>
        </div>
        <ImageField value={data.image_url} onChange={(v) => onChange({ ...data, image_url: v })} />
        <VideoField value={data.video_url} onChange={(v) => onChange({ ...data, video_url: v })} />
        <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Summary / Meta Description *</label><textarea required rows={2} value={data.summary} onChange={(e) => onChange({ ...data, summary: e.target.value })} placeholder="One or two sentences describing the article (used for SEO)" className={inp} /></div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Content *</label>
          <p className="text-[10px] text-gray-400">You can write plain text (paragraphs separated by blank lines) or paste HTML for rich formatting.</p>
          <textarea required rows={16} value={data.content} onChange={(e) => onChange({ ...data, content: e.target.value })} placeholder="Write your article content here. Use blank lines between paragraphs, or paste HTML with <h2>, <p>, <strong>, <a> tags." className={inp + " font-mono text-xs leading-relaxed"} />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="flex items-center space-x-2 bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase px-6 py-3 cursor-pointer"><Save size={13} /><span>{submitLabel}</span></button>
          <button type="button" onClick={onCancel} className="text-[10px] font-bold tracking-widest uppercase text-gray-500 hover:text-gray-800 px-4 py-3 border border-[#EAE6DF] cursor-pointer">Cancel</button>
        </div>
      </form>
    </div>
  );
}
