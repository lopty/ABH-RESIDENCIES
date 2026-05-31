import React, { useState } from "react";
import { Plus, Trash2, Edit3, Save, X, LogOut, Eye, EyeOff, Building2, BookOpen } from "lucide-react";
import { propertiesData } from "../data";
import { blogPosts as initialBlogPosts, BlogPost } from "../blogData";
import { Property } from "../types";

const ADMIN_PASSWORD = "rad2026admin";

interface AdminPanelProps {
  onNavigate: (path: string) => void;
}

type Tab = "properties" | "blog";

const emptyProperty: Omit<Property, "id"> = {
  name: "",
  location: "",
  price: "",
  priceNumeric: 0,
  type: "Apartment",
  area: "Al Maryah Island",
  badge: "Off-Plan",
  image: "",
  bedrooms: 1,
  bathrooms: 1,
  sizeSqFt: 0,
  description: "",
};

const emptyBlog: Omit<BlogPost, "slug"> = {
  title: "",
  category: "Market News",
  date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  readTime: "5 min read",
  image: "",
  summary: "",
  content: [""],
};

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [tab, setTab] = useState<Tab>("properties");

  const [properties, setProperties] = useState<Property[]>(() =>
    JSON.parse(localStorage.getItem("rad_properties") || JSON.stringify(propertiesData))
  );
  const [blogs, setBlogs] = useState<BlogPost[]>(() =>
    JSON.parse(localStorage.getItem("rad_blogs") || JSON.stringify(initialBlogPosts))
  );

  const [editingProp, setEditingProp] = useState<Property | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [showPropForm, setShowPropForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [newProp, setNewProp] = useState<Omit<Property, "id">>(emptyProperty);
  const [newBlog, setNewBlog] = useState<Omit<BlogPost, "slug">>(emptyBlog);

  const saveProperties = (updated: Property[]) => {
    setProperties(updated);
    localStorage.setItem("rad_properties", JSON.stringify(updated));
  };

  const saveBlogs = (updated: BlogPost[]) => {
    setBlogs(updated);
    localStorage.setItem("rad_blogs", JSON.stringify(updated));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
      setTimeout(() => setPwError(false), 2000);
    }
  };

  const deleteProperty = (id: string) => {
    if (confirm("Delete this property?")) saveProperties(properties.filter((p) => p.id !== id));
  };

  const deleteBlog = (slug: string) => {
    if (confirm("Delete this blog post?")) saveBlogs(blogs.filter((b) => b.slug !== slug));
  };

  const addProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `prop-${Date.now()}`;
    const updated = [...properties, { ...newProp, id }];
    saveProperties(updated);
    setNewProp(emptyProperty);
    setShowPropForm(false);
  };

  const addBlog = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newBlog.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80);
    const updated = [{ ...newBlog, slug }, ...blogs];
    saveBlogs(updated);
    setNewBlog(emptyBlog);
    setShowBlogForm(false);
  };

  const startEditProp = (p: Property) => {
    setEditingProp({ ...p });
    setShowPropForm(false);
  };

  const saveEditProp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProp) return;
    saveProperties(properties.map((p) => (p.id === editingProp.id ? editingProp : p)));
    setEditingProp(null);
  };

  const startEditBlog = (b: BlogPost) => {
    setEditingBlog({ ...b, content: [...b.content] });
    setShowBlogForm(false);
  };

  const saveEditBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    saveBlogs(blogs.map((b) => (b.slug === editingBlog.slug ? editingBlog : b)));
    setEditingBlog(null);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-sm p-8 border border-[#EAE6DF] shadow-lg border-t-4 border-t-[#C9A96E]">
          <div className="text-center mb-8 space-y-2">
            <h1 className="font-serif text-2xl font-light text-[#1A1A1A]">Admin Panel</h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Residence Abu Dhabi</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Admin Password"
                value={pwInput}
                onChange={(e) => setPwInput(e.target.value)}
                className={`w-full border ${pwError ? "border-red-400" : "border-[#EAE6DF]"} px-4 py-3 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none pr-10`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {pwError && <p className="text-red-500 text-xs text-center">Incorrect password</p>}
            <button
              type="submit"
              className="w-full bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase py-3 rounded-none"
            >
              SIGN IN
            </button>
          </form>
          <button
            onClick={() => onNavigate("/")}
            className="mt-6 text-[10px] text-gray-400 hover:text-[#C9A96E] w-full text-center block uppercase tracking-widest transition-colors cursor-pointer"
          >
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
          <span className="text-[#C9A96E] text-xs font-semibold uppercase tracking-widest">Residence Abu Dhabi</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate("/")}
            className="text-xs text-gray-300 hover:text-white uppercase tracking-widest cursor-pointer transition-colors"
          >
            View Site
          </button>
          <button
            onClick={() => setAuthed(false)}
            className="flex items-center space-x-1 text-xs text-gray-300 hover:text-white cursor-pointer"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex space-x-1 mb-8 border-b border-[#EAE6DF]">
          <button
            onClick={() => setTab("properties")}
            className={`flex items-center space-x-2 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${
              tab === "properties"
                ? "bg-white text-[#1C2B4A] border-t-2 border-t-[#C9A96E] border-x border-[#EAE6DF] -mb-px"
                : "text-gray-500 hover:text-[#1C2B4A]"
            }`}
          >
            <Building2 size={14} />
            <span>Properties ({properties.length})</span>
          </button>
          <button
            onClick={() => setTab("blog")}
            className={`flex items-center space-x-2 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${
              tab === "blog"
                ? "bg-white text-[#1C2B4A] border-t-2 border-t-[#C9A96E] border-x border-[#EAE6DF] -mb-px"
                : "text-gray-500 hover:text-[#1C2B4A]"
            }`}
          >
            <BookOpen size={14} />
            <span>Blog Posts ({blogs.length})</span>
          </button>
        </div>

        {tab === "properties" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl font-light text-[#1A1A1A]">Property Listings</h2>
              <button
                onClick={() => { setShowPropForm(!showPropForm); setEditingProp(null); }}
                className="flex items-center space-x-2 bg-[#C9A96E] hover:bg-[#b8945c] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Property</span>
              </button>
            </div>

            {(showPropForm) && (
              <PropertyForm
                data={newProp}
                onChange={setNewProp}
                onSubmit={addProperty}
                onCancel={() => setShowPropForm(false)}
                submitLabel="Add Property"
              />
            )}

            {editingProp && (
              <PropertyForm
                data={editingProp}
                onChange={(d) => setEditingProp({ ...editingProp, ...d })}
                onSubmit={saveEditProp}
                onCancel={() => setEditingProp(null)}
                submitLabel="Save Changes"
                title="Edit Property"
              />
            )}

            <div className="grid gap-4">
              {properties.map((p) => (
                <div key={p.id} className="bg-white border border-[#EAE6DF] p-4 flex items-center gap-4">
                  <img src={p.image} alt={p.name} className="w-24 h-16 object-cover flex-shrink-0 bg-gray-100" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">{p.name}</h3>
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-[#C9A96E] text-white px-2 py-0.5 shrink-0">{p.badge}</span>
                    </div>
                    <p className="text-xs text-gray-500">{p.location}</p>
                    <p className="text-xs font-semibold text-[#1C2B4A] mt-1">{p.price}</p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => startEditProp(p)}
                      className="p-2 text-gray-400 hover:text-[#1C2B4A] border border-[#EAE6DF] hover:border-[#1C2B4A] transition-colors cursor-pointer"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => deleteProperty(p.id)}
                      className="p-2 text-gray-400 hover:text-red-500 border border-[#EAE6DF] hover:border-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "blog" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl font-light text-[#1A1A1A]">Blog Posts</h2>
              <button
                onClick={() => { setShowBlogForm(!showBlogForm); setEditingBlog(null); }}
                className="flex items-center space-x-2 bg-[#C9A96E] hover:bg-[#b8945c] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Post</span>
              </button>
            </div>

            {showBlogForm && (
              <BlogForm
                data={newBlog}
                onChange={setNewBlog}
                onSubmit={addBlog}
                onCancel={() => setShowBlogForm(false)}
                submitLabel="Publish Post"
              />
            )}

            {editingBlog && (
              <BlogForm
                data={editingBlog}
                onChange={(d) => setEditingBlog({ ...editingBlog, ...d })}
                onSubmit={saveEditBlog}
                onCancel={() => setEditingBlog(null)}
                submitLabel="Save Changes"
                title="Edit Blog Post"
              />
            )}

            <div className="grid gap-4">
              {blogs.map((b) => (
                <div key={b.slug} className="bg-white border border-[#EAE6DF] p-4 flex items-center gap-4">
                  <img src={b.image} alt={b.title} className="w-24 h-16 object-cover flex-shrink-0 bg-gray-100" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-[#1C2B4A] text-white px-2 py-0.5 shrink-0">{b.category}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900 truncate mt-1">{b.title}</h3>
                    <p className="text-xs text-gray-400">{b.date} · {b.readTime}</p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => startEditBlog(b)}
                      className="p-2 text-gray-400 hover:text-[#1C2B4A] border border-[#EAE6DF] hover:border-[#1C2B4A] transition-colors cursor-pointer"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => deleteBlog(b.slug)}
                      className="p-2 text-gray-400 hover:text-red-500 border border-[#EAE6DF] hover:border-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PropertyForm({
  data,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
  title = "Add New Property",
}: {
  data: Omit<Property, "id">;
  onChange: (d: Omit<Property, "id">) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
  title?: string;
}) {
  return (
    <div className="bg-white border border-[#C9A96E] p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-lg font-light text-[#1A1A1A]">{title}</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-700 cursor-pointer"><X size={16} /></button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Property Name *</label>
            <input required type="text" value={data.name} onChange={(e) => onChange({ ...data, name: e.target.value })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Location *</label>
            <input required type="text" value={data.location} onChange={(e) => onChange({ ...data, location: e.target.value })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none" placeholder="e.g. Al Maryah Island, Abu Dhabi" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Price (Display) *</label>
            <input required type="text" value={data.price} onChange={(e) => onChange({ ...data, price: e.target.value })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none" placeholder="e.g. AED 5,000,000" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Price (Numeric) *</label>
            <input required type="number" value={data.priceNumeric} onChange={(e) => onChange({ ...data, priceNumeric: Number(e.target.value) })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Type *</label>
            <select value={data.type} onChange={(e) => onChange({ ...data, type: e.target.value as Property["type"] })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none appearance-none">
              <option>Apartment</option><option>Penthouse</option><option>Villa</option><option>Mansion</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Area *</label>
            <select value={data.area} onChange={(e) => onChange({ ...data, area: e.target.value as Property["area"] })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none appearance-none">
              <option>Al Maryah Island</option><option>Saadiyat Island</option><option>Yas Island</option><option>Al Reem Island</option><option>Ramhan Island</option><option>Al Raha Beach</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Badge *</label>
            <select value={data.badge} onChange={(e) => onChange({ ...data, badge: e.target.value as Property["badge"] })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none appearance-none">
              <option>Off-Plan</option><option>Ready</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Bedrooms *</label>
            <input required type="number" min={1} value={data.bedrooms} onChange={(e) => onChange({ ...data, bedrooms: Number(e.target.value) })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Bathrooms *</label>
            <input required type="number" min={1} step={0.5} value={data.bathrooms} onChange={(e) => onChange({ ...data, bathrooms: Number(e.target.value) })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Size (sqft) *</label>
            <input required type="number" value={data.sizeSqFt} onChange={(e) => onChange({ ...data, sizeSqFt: Number(e.target.value) })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Image URL *</label>
          <input required type="url" value={data.image} onChange={(e) => onChange({ ...data, image: e.target.value })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none" placeholder="https://..." />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Description *</label>
          <textarea required rows={3} value={data.description} onChange={(e) => onChange({ ...data, description: e.target.value })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none" />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="flex items-center space-x-2 bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase px-6 py-3 cursor-pointer">
            <Save size={13} /><span>{submitLabel}</span>
          </button>
          <button type="button" onClick={onCancel} className="text-[10px] font-bold tracking-widest uppercase text-gray-500 hover:text-gray-800 px-4 py-3 border border-[#EAE6DF] cursor-pointer">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function BlogForm({
  data,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
  title = "New Blog Post",
}: {
  data: Omit<BlogPost, "slug">;
  onChange: (d: Omit<BlogPost, "slug">) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
  title?: string;
}) {
  const updateParagraph = (idx: number, val: string) => {
    const c = [...data.content];
    c[idx] = val;
    onChange({ ...data, content: c });
  };

  const addParagraph = () => onChange({ ...data, content: [...data.content, ""] });

  const removeParagraph = (idx: number) => {
    const c = data.content.filter((_, i) => i !== idx);
    onChange({ ...data, content: c.length ? c : [""] });
  };

  return (
    <div className="bg-white border border-[#C9A96E] p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-lg font-light text-[#1A1A1A]">{title}</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-700 cursor-pointer"><X size={16} /></button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Title *</label>
            <input required type="text" value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Category *</label>
            <select value={data.category} onChange={(e) => onChange({ ...data, category: e.target.value as BlogPost["category"] })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none appearance-none">
              <option>Market News</option><option>Investment Guides</option><option>Area Profiles</option><option>Off Plan</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Date *</label>
            <input required type="text" value={data.date} onChange={(e) => onChange({ ...data, date: e.target.value })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none" placeholder="e.g. May 31, 2026" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Read Time</label>
            <input type="text" value={data.readTime} onChange={(e) => onChange({ ...data, readTime: e.target.value })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none" placeholder="e.g. 5 min read" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Image URL *</label>
            <input required type="url" value={data.image} onChange={(e) => onChange({ ...data, image: e.target.value })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none" placeholder="https://..." />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Summary *</label>
          <textarea required rows={2} value={data.summary} onChange={(e) => onChange({ ...data, summary: e.target.value })} className="w-full border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Content Paragraphs *</label>
          {data.content.map((p, i) => (
            <div key={i} className="flex gap-2">
              <textarea
                required
                rows={3}
                value={p}
                onChange={(e) => updateParagraph(i, e.target.value)}
                placeholder={i === 0 ? "First paragraph (shown as standfirst)" : `Paragraph ${i + 1}`}
                className="flex-1 border border-[#EAE6DF] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none rounded-none"
              />
              {data.content.length > 1 && (
                <button type="button" onClick={() => removeParagraph(i)} className="text-gray-400 hover:text-red-500 cursor-pointer shrink-0 self-start mt-1"><X size={14} /></button>
              )}
            </div>
          ))}
          <button type="button" onClick={addParagraph} className="flex items-center space-x-1 text-[10px] font-bold text-[#C9A96E] uppercase tracking-widest hover:text-[#b8945c] cursor-pointer">
            <Plus size={12} /><span>Add Paragraph</span>
          </button>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="flex items-center space-x-2 bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase px-6 py-3 cursor-pointer">
            <Save size={13} /><span>{submitLabel}</span>
          </button>
          <button type="button" onClick={onCancel} className="text-[10px] font-bold tracking-widest uppercase text-gray-500 hover:text-gray-800 px-4 py-3 border border-[#EAE6DF] cursor-pointer">Cancel</button>
        </div>
      </form>
    </div>
  );
}
