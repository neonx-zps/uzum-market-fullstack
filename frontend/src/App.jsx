import React, { useState, useEffect } from "react";

const API_BASE = "http://127.0.0.1:8000/api";

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);
  const [user, setUser] = useState(null);
  
  // Tovar ichiga kirish (Product Modal)
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("about"); // 'about', 'specs', 'reviews'
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Auth modal
  const [authModal, setAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ username: "", password: "", passwordConfirm: "", fullName: "" });
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/categories/`)
      .then((r) => r.json())
      .then((d) => setCategories(d))
      .catch(() => {});

    fetch(`${API_BASE}/products/`)
      .then((r) => r.json())
      .then((d) => setProducts(d))
      .catch(() => {});

    const savedUser = localStorage.getItem("uzum_user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (authMode === "register") {
      if (authForm.password !== authForm.passwordConfirm) {
        setAuthError("Kiritilgan parollar mos kelmadi!");
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/auth/register/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: authForm.username,
            password: authForm.password,
            password_confirm: authForm.passwordConfirm,
            first_name: authForm.fullName,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          const u = { username: data.username, token: data.token, name: data.first_name || data.username };
          setUser(u);
          localStorage.setItem("uzum_user", JSON.stringify(u));
          setAuthModal(false);
        } else {
          setAuthError(data.error || "Xatolik yuz berdi");
        }
      } catch {
        setAuthError("Server bilan aloqa yo'q");
      }
    } else {
      try {
        const res = await fetch(`${API_BASE}/auth/login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: authForm.username, password: authForm.password }),
        });
        const data = await res.json();
        if (res.ok) {
          const u = { username: data.username, token: data.token, name: data.first_name || data.username };
          setUser(u);
          localStorage.setItem("uzum_user", JSON.stringify(u));
          setAuthModal(false);
        } else {
          setAuthError(data.error || "Login yoki parol xato");
        }
      } catch {
        setAuthError("Server bilan aloqa yo'q");
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("uzum_user");
  };

  const addToCart = (product, e) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, change) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + change;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const toggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const openProductDetail = (prod) => {
    setActiveProduct(prod);
    setSelectedImageIdx(0);
    setActiveTab("about");
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCat === "all" || p.category?.slug === selectedCat || p.category === selectedCat;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-gray-900 flex flex-col font-sans selection:bg-[#7000FF] selection:text-white transition-colors duration-300">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setSelectedCat("all")}>
            <div className="w-10 h-10 rounded-2xl bg-[#7000FF] flex items-center justify-center text-white font-black text-2xl shadow-md group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
              U
            </div>
            <div>
              <span className="text-2xl font-black text-[#7000FF] tracking-tight group-hover:opacity-90 transition">uzum market</span>
              <span className="block text-[10px] text-gray-400 -mt-1 font-semibold uppercase tracking-wider">Topshirish punkti</span>
            </div>
          </div>

          {/* Search bar with smooth interaction */}
          <div className="flex-1 max-w-2xl relative">
            <input
              type="text"
              placeholder="Mahsulotlar va toifalar bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-100/80 border border-transparent focus:border-[#7000FF] focus:bg-white rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none transition-all duration-200 focus:shadow-[0_0_0_4px_rgba(112,0,255,0.1)]"
            />
            <svg className="w-5 h-5 absolute left-3.5 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100 transition hover:bg-purple-100">
                <span className="text-sm font-bold text-[#7000FF]">👤 {user.name}</span>
                <button onClick={logout} className="text-xs text-red-500 hover:underline font-semibold ml-1">Chiqish</button>
              </div>
            ) : (
              <button
                onClick={() => { setAuthMode("login"); setAuthModal(true); }}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-gray-100 hover:bg-gray-200 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Kirish
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-purple-50 text-[#7000FF] hover:bg-[#7000FF] hover:text-white hover:scale-105 active:scale-90 transition-all duration-200 shadow-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-black rounded-full h-5 w-5 flex items-center justify-center animate-bounce shadow">
                  {cart.reduce((a, c) => a + c.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto text-sm border-t border-gray-100 scroll-smooth no-scrollbar">
          <button
            onClick={() => setSelectedCat("all")}
            className={`px-4 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCat === "all" ? "bg-[#7000FF] text-white shadow-md shadow-purple-200" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/60"
            }`}
          >
            Barchasi ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.slug)}
              className={`px-4 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCat === cat.slug ? "bg-[#7000FF] text-white shadow-md shadow-purple-200" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/60"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        {/* Banner with floating effect */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#7000FF] via-[#8525FF] to-[#A14BFF] p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
          <div className="z-10">
            <span className="inline-block px-3.5 py-1 bg-amber-400 text-slate-900 font-extrabold text-xs rounded-full uppercase tracking-wider mb-3 shadow">
              Katta aksiya haftaligi
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Uzum Marketda 400+ qulay tanlov!</h1>
            <p className="text-purple-100 text-sm mt-2 max-w-lg">
              Ertagayoq topshirish punktlariga 1 kun ichida bepul yetkazib beramiz. Istalgan tovarga bosing va to'liq ma'lumot oling.
            </p>
          </div>
          <div className="z-10 bg-white/15 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 transform hover:scale-105 transition duration-300">
            <p className="text-xs uppercase font-extrabold text-amber-300">Halol muddatli to'lov</p>
            <p className="text-xl font-black mt-0.5">Uzum Nasiya 12 oy</p>
            <p className="text-[11px] text-white/80 mt-1">Boshlang'ich to'lovsiz</p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredProducts.slice(0, visibleCount).map((p) => {
            const isFav = favorites.includes(p.id);
            const monthlyPrice = Math.round((p.price * 1.2) / 12);
            return (
              <div
                key={p.id}
                onClick={() => openProductDetail(p)}
                className="bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer transform hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative pt-[100%] bg-gray-50 overflow-hidden">
                  <img
                    src={p.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <button
                    onClick={(e) => toggleFavorite(p.id, e)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur hover:bg-white shadow-sm hover:scale-125 active:scale-95 transition-all duration-200 z-10"
                  >
                    <span className={`text-sm ${isFav ? "text-red-500" : "text-gray-300 group-hover:text-gray-400"}`}>♥</span>
                  </button>
                  <span className="absolute bottom-2 left-2 bg-purple-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur">
                    1 kunda
                  </span>
                </div>

                {/* Content */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                      <span>★ {p.rating || "4.9"}</span>
                      <span className="text-gray-400 font-normal">({p.reviews_count || 120} sharh)</span>
                    </div>
                    <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 mt-1 group-hover:text-[#7000FF] transition-colors duration-200">
                      {p.title}
                    </h3>
                    <div className="mt-2 inline-block bg-amber-100/80 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                      {monthlyPrice.toLocaleString()} so'm/oy
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-gray-900">{Number(p.price).toLocaleString()} so'm</p>
                      {p.old_price && (
                        <p className="text-[10px] text-gray-400 line-through -mt-0.5">{Number(p.old_price).toLocaleString()} so'm</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => addToCart(p, e)}
                      className="p-2.5 rounded-xl bg-purple-50 text-[#7000FF] hover:bg-[#7000FF] hover:text-white active:scale-90 transition-all duration-200 shadow-sm"
                      title="Savatga qo'shish"
                    >
                      🛒
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredProducts.length && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 24)}
              className="px-8 py-3.5 bg-white border-2 border-[#7000FF] text-[#7000FF] hover:bg-[#7000FF] hover:text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              Yana 24 ta ko'rsatish ({visibleCount} / {filteredProducts.length})
            </button>
          </div>
        )}
      </main>

      {/* TOVAR SAHIFASI (UZUM STYLE PRODUCT MODAL) */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col md:flex-row transform transition-all duration-300 scale-100">
            
            {/* Modal Yopish tugmasi */}
            <button
              onClick={() => setActiveProduct(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-xl font-bold transition hover:rotate-90 duration-300"
            >
              ✕
            </button>

            {/* Chap tomon: Rasmlar va Galereya */}
            <div className="w-full md:w-1/2 p-6 bg-gray-50 flex flex-col items-center justify-between border-r border-gray-100">
              <div className="w-full h-80 sm:h-96 flex items-center justify-center relative overflow-hidden rounded-2xl bg-white p-4 shadow-inner">
                <img
                  src={activeProduct.image_url}
                  alt={activeProduct.title}
                  className="max-h-full max-w-full object-contain transition-all duration-300 transform hover:scale-110"
                />
                <span className="absolute top-3 left-3 bg-[#7000FF] text-white text-xs font-black px-2.5 py-1 rounded-lg">
                  Uzum Kafolati
                </span>
              </div>

              {/* Qo'shimcha rasmlar miniatyurasi */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1 w-full justify-center">
                {[activeProduct.image_url, activeProduct.image_url, activeProduct.image_url].map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedImageIdx(i)}
                    className={`w-16 h-16 rounded-xl border-2 p-1 bg-white cursor-pointer transition-all ${
                      selectedImageIdx === i ? "border-[#7000FF] scale-105 shadow-md" : "border-gray-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            </div>

            {/* O'ng tomon: Tavsif, Xarakteristika, Narx va Savat */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                  <span className="text-amber-500 font-bold">★ {activeProduct.rating || "4.9"}</span>
                  <span>({activeProduct.reviews_count || 120} ta baho)</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-bold">Buyurtma: 500+ marta</span>
                </div>

                <h2 className="text-xl font-black text-gray-900 mt-2 leading-tight">
                  {activeProduct.title}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">Toifa:</span>
                  <span className="text-xs font-bold text-[#7000FF] bg-purple-50 px-2 py-0.5 rounded">
                    {activeProduct.category?.name || "Boshqa toifalar"}
                  </span>
                </div>

                {/* Narx qismi */}
                <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-black text-[#7000FF]">
                      {Number(activeProduct.price).toLocaleString()} so'm
                    </span>
                    {activeProduct.old_price && (
                      <span className="text-sm text-gray-400 line-through">
                        {Number(activeProduct.old_price).toLocaleString()} so'm
                      </span>
                    )}
                  </div>
                  
                  {/* Nasiya kalkulyator bloki */}
                  <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-amber-800">Uzum Nasiya muddatli to'lov:</p>
                      <p className="text-xs font-black text-amber-950">
                        Oyiga {Math.round((activeProduct.price * 1.2) / 12).toLocaleString()} so'mdan / 12 oy
                      </p>
                    </div>
                    <span className="text-xs font-black bg-amber-400 text-black px-2 py-1 rounded-lg">0% Oldindan to'lov</span>
                  </div>
                </div>

                {/* Tablar: Tavsif / Xususiyatlar / Sharhlar */}
                <div className="mt-6 border-b border-gray-200 flex gap-4 text-sm font-bold">
                  <button
                    onClick={() => setActiveTab("about")}
                    className={`pb-2 transition ${activeTab === "about" ? "border-b-2 border-[#7000FF] text-[#7000FF]" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    Mahsulot tavsifi
                  </button>
                  <button
                    onClick={() => setActiveTab("specs")}
                    className={`pb-2 transition ${activeTab === "specs" ? "border-b-2 border-[#7000FF] text-[#7000FF]" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    Xususiyatlari
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`pb-2 transition ${activeTab === "reviews" ? "border-b-2 border-[#7000FF] text-[#7000FF]" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    Sharhlar ({activeProduct.reviews_count || 120})
                  </button>
                </div>

                {/* Tab tarkibi */}
                <div className="py-3 text-xs text-gray-600 leading-relaxed max-h-40 overflow-y-auto">
                  {activeTab === "about" && (
                    <p>{activeProduct.description || "Ushbu mahsulot yuqori sifatli materiallardan tayyorlangan bo'lib, kundalik foydalanish uchun juda qulay va chidamli. Barcha xalqaro sifat standartlariga to'liq javob beradi."}</p>
                  )}
                  {activeTab === "specs" && (
                    <div className="space-y-2">
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-gray-400">Ishlab chiqaruvchi</span>
                        <span className="font-semibold text-gray-800">Original Brand (Kafolat 12 oy)</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-gray-400">Holati</span>
                        <span className="font-semibold text-gray-800">Yangi, qadoqda</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-gray-400">Yetkazib berish</span>
                        <span className="font-semibold text-emerald-600">Ertaga topshirish punktida bepul</span>
                      </div>
                    </div>
                  )}
                  {activeTab === "reviews" && (
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-800">Azizbek Qodirov</span>
                          <span className="text-amber-500">★★★★★</span>
                        </div>
                        <p className="mt-1 text-[11px] text-gray-500">Juda zo'r tovar ekan, buyurtma qilgan kunimning ertasiga yetib keldi. Tavsiya qilaman!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pastki tugmalar */}
              <div className="pt-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => addToCart(activeProduct)}
                  className="flex-1 py-3.5 rounded-2xl bg-[#7000FF] text-white font-black text-sm hover:bg-[#5e00d8] active:scale-95 transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
                >
                  <span>🛒</span> Savatga qo'shish
                </button>
                <button
                  onClick={(e) => toggleFavorite(activeProduct.id, e)}
                  className="px-4 rounded-2xl border border-gray-200 hover:bg-gray-100 transition active:scale-90 flex items-center justify-center text-lg"
                >
                  <span className={favorites.includes(activeProduct.id) ? "text-red-500" : "text-gray-400"}>♥</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Savat Modali (Drawer) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div className="bg-white w-full max-w-md h-full flex flex-col p-6 shadow-2xl animate-slideLeft">
            <div className="flex items-center justify-between pb-4 border-b">
              <h2 className="text-lg font-black">Savatcha ({cart.length})</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-2xl text-gray-400 hover:text-black transition">×</button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-5xl">🛒</span>
                  <p className="text-gray-500 mt-2 font-medium">Savatchangiz hozircha bo'sh</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center border border-gray-100 p-3 rounded-2xl hover:shadow-sm transition">
                    <img src={item.image_url} alt="" className="w-14 h-14 object-contain rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate text-gray-800">{item.title}</p>
                      <p className="text-xs text-[#7000FF] font-black mt-0.5">{Number(item.price).toLocaleString()} so'm</p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-lg bg-white shadow-xs font-bold hover:bg-gray-200 transition">-</button>
                      <span className="text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-lg bg-white shadow-xs font-bold hover:bg-gray-200 transition">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 font-medium">Jami to'lov:</span>
                <span className="text-xl font-black text-[#7000FF]">{totalPrice.toLocaleString()} so'm</span>
              </div>
              <button
                disabled={cart.length === 0}
                onClick={() => {
                  alert("🎉 Buyurtmangiz qabul qilindi! Ertaga topshirish punktidan olishingiz mumkin.");
                  setCart([]);
                  setIsCartOpen(false);
                }}
                className="w-full py-3.5 rounded-2xl bg-[#7000FF] text-white font-bold hover:bg-[#5f00da] transition-all duration-200 active:scale-95 disabled:opacity-50 shadow-lg shadow-purple-200"
              >
                Buyurtmani rasmiylashtirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {authModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-scaleUp">
            <button onClick={() => setAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">✕</button>

            <div className="flex gap-4 border-b pb-2 mb-4">
              <button
                onClick={() => setAuthMode("login")}
                className={`text-sm font-black pb-1 border-b-2 transition ${authMode === "login" ? "border-[#7000FF] text-[#7000FF]" : "border-transparent text-gray-400"}`}
              >
                Kirish
              </button>
              <button
                onClick={() => setAuthMode("register")}
                className={`text-sm font-black pb-1 border-b-2 transition ${authMode === "register" ? "border-[#7000FF] text-[#7000FF]" : "border-transparent text-gray-400"}`}
              >
                Ro'yxatdan o'tish
              </button>
            </div>

            {authError && <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl mb-3">{authError}</div>}

            <form onSubmit={handleAuth} className="space-y-3">
              {authMode === "register" && (
                <input
                  type="text"
                  placeholder="To'liq ismingiz"
                  required
                  value={authForm.fullName}
                  onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#7000FF] transition"
                />
              )}
              <input
                type="text"
                placeholder="Login yoki telefon"
                required
                value={authForm.username}
                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                className="w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#7000FF] transition"
              />
              <input
                type="password"
                placeholder="Parol"
                required
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#7000FF] transition"
              />
              {authMode === "register" && (
                <input
                  type="password"
                  placeholder="Parolni qayta takrorlang"
                  required
                  value={authForm.passwordConfirm}
                  onChange={(e) => setAuthForm({ ...authForm, passwordConfirm: e.target.value })}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#7000FF] transition"
                />
              )}
              <button type="submit" className="w-full py-3 rounded-xl bg-[#7000FF] text-white font-bold text-sm hover:bg-[#5f00da] active:scale-95 transition">
                {authMode === "register" ? "Ro'yxatdan o'tish" : "Tizimga kirish"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}