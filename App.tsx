
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Search,
  Menu,
  X,
  Phone,
  Clock,
  MapPin,
  TrendingUp,
  CheckCircle,
  ShieldCheck,
  ShoppingBag,
  Info,
  ChevronRight,
  Plus,
  ArrowLeft,
  User as UserIcon,
  LogOut,
  Camera,
  Star,
  Ambulance,
  Flame,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


import { Business, Product, Order, Ad, User } from './types';
import { CATEGORIES, MOCK_BUSINESSES, MOCK_PRODUCTS, MOCK_ADS } from './constants';

// --- Context/Store Hooks Simulation ---
const useStore = () => {
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [ads] = useState<Ad[]>(MOCK_ADS);

  useEffect(() => {
    const savedUser = localStorage.getItem('kolpolok_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedOrders = localStorage.getItem('kolpolok_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  const login = (name: string, phone: string) => {
    const newUser = { name, phone, isLoggedIn: true };
    setUser(newUser);
    localStorage.setItem('kolpolok_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kolpolok_user');
  };

  const placeOrder = (orderDetails: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderDetails,
      id: Math.random().toString(36).substr(2, 9),
      status: 'New',
      createdAt: new Date().toISOString()
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('kolpolok_orders', JSON.stringify(updatedOrders));
    return newOrder;
  };

  return { businesses, products, orders, user, ads, login, logout, placeOrder, setOrders };
};

// --- Components ---

const Header: React.FC<{ onMenuClick: () => void, user: User | null }> = ({ onMenuClick, user }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">K</div>
        <span className="font-bold text-gray-900 tracking-tight">Kolpolok Unity</span>
      </Link>
      <div className="flex items-center space-x-4">
        {user ? (
          <Link to="/profile" className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <UserIcon size={18} />
          </Link>
        ) : (
          <Link to="/login" className="text-sm font-medium text-blue-600">Login</Link>
        )}
        <button onClick={onMenuClick} className="p-1 text-gray-600 hover:text-gray-900">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};

const Banner: React.FC<{ ads: Ad[] }> = ({ ads }) => {
  const bannerAds = ads.filter(ad => ad.placement === 'Homepage');
  if (!bannerAds.length) return null;
  return (
    <div className="px-4 py-4 overflow-hidden">
      <div className="flex space-x-4 overflow-x-auto no-scrollbar snap-x">
        {bannerAds.map(ad => (
          <div key={ad.id} className="min-w-full snap-center rounded-2xl overflow-hidden shadow-sm">
            <img src={ad.image} alt="Advertisement" className="w-full h-40 object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

const BusinessCard: React.FC<{ business: Business }> = ({ business }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative group overflow-hidden"
    >
      {business.isSponsored && (
        <span className="absolute top-0 right-0 bg-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg text-gray-800 uppercase tracking-widest">
          Sponsored
        </span>
      )}
      <Link to={`/business/${business.id}`}>
        <div className="flex items-start space-x-4">
          <img src={business.logo} alt={business.name} className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1">
              <h3 className="text-base font-bold text-gray-900 truncate">{business.name}</h3>
              {business.isVerified && <CheckCircle size={14} className="text-blue-500 fill-blue-50" />}
            </div>
            <p className="text-xs text-blue-600 font-medium mb-1">{business.category}</p>
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{business.description}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-2">
            {business.isTrending && <div className="flex items-center text-[10px] font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100"><TrendingUp size={10} className="mr-1" />Trending</div>}
            {business.isTrusted && <div className="flex items-center text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100"><ShieldCheck size={10} className="mr-1" />Trusted</div>}
          </div>
          <button className="bg-blue-600 text-white p-2 rounded-full shadow-md shadow-blue-200">
            <Phone size={16} />
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

const Footer: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex items-center justify-between z-40">
      <Link to="/directory" className={`flex flex-col items-center space-y-1 transition-colors ${isActive('/directory') ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}>
        <Search size={22} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Explore</span>
      </Link>
      <Link to="/shop" className={`flex flex-col items-center space-y-1 transition-colors ${isActive('/shop') ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}>
        <ShoppingBag size={22} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Shop</span>
      </Link>

      <Link to="/about" className={`flex flex-col items-center space-y-1 transition-colors ${isActive('/about') ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}>
        <Info size={22} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Club</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center space-y-1 transition-colors ${isActive('/profile') ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}>
        <UserIcon size={22} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
      </Link>
    </footer>
  );
};

// --- Pages ---

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 to-indigo-800 text-white rounded-b-[40px] px-6 pt-10 pb-20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center max-w-lg mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs font-semibold tracking-wide uppercase">Community Live</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Kolpolok <span className="text-blue-300">Unity</span>
          </h1>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Your exclusive digital gateway to neighbors, local businesses, and club services.
          </p>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl flex items-center space-x-3 mb-8 shadow-lg max-w-sm mx-auto">
            <Search className="text-blue-200 ml-2" size={20} />
            <input
              type="text"
              placeholder="Search (e.g. Rice, Medicine...)"
              className="bg-transparent border-none text-white placeholder-blue-200 focus:outline-none w-full text-sm font-medium"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value;
                  if (val.trim()) navigate('/directory', { state: { initialSearch: val } });
                }
              }}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['Grocery', 'Pharmacy', 'Food', 'Salon'].map((cat) => (
              <button
                key={cat}
                onClick={() => navigate('/directory', { state: { initialCategory: cat } })}
                className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-full px-4 py-1.5 text-xs font-semibold backdrop-blur-sm transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/directory')}
              className="bg-white text-blue-900 px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-transform flex items-center justify-center space-x-2"
            >
              <Search size={18} />
              <span>Browse Directory</span>
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="bg-indigo-600/30 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-600/40 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <ShoppingBag size={18} />
              <span>Visit Shop</span>
            </button>
          </div>
        </div>
      </div>


      {/* Emergency Support */}
      < div className="px-6 py-6 -mt-6 relative z-30" >
        <h3 className="text-sm font-bold text-gray-900 mb-4 px-2">Emergency Support</h3>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between">
          {[
            { icon: Ambulance, label: 'Medical', color: 'text-red-500', bg: 'bg-red-50' },
            { icon: ShieldCheck, label: 'Security', color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: Flame, label: 'Fire', color: 'text-orange-500', bg: 'bg-orange-50' },
            { icon: Phone, label: 'Helpline', color: 'text-green-600', bg: 'bg-green-50' }
          ].map((item, idx) => (
            <button key={idx} className="flex flex-col items-center space-y-2 group">
              <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center shadow-sm group-active:scale-95 transition-transform`}>
                <item.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-gray-600">{item.label}</span>
            </button>
          ))}
        </div>
      </div >

      {/* Stats Section */}
      < div className="px-6 relative z-20 max-w-lg mx-auto mb-8" >
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex justify-between text-center divide-x divide-gray-100">
          <div className="flex-1 px-2">
            <p className="text-2xl font-black text-blue-600">5k+</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Families</p>
          </div>
          <div className="flex-1 px-2">
            <p className="text-2xl font-black text-indigo-600">1.2k</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Businesses</p>
          </div>
          <div className="flex-1 px-2">
            <p className="text-2xl font-black text-green-600">100%</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verified</p>
          </div>
        </div>
      </div >

      {/* Trending Section */}
      < div className="py-2 mb-6" >
        <div className="px-6 flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-gray-900">Trending Now</h3>
          <button onClick={() => navigate('/directory')} className="text-blue-600 text-xs font-bold flex items-center group">
            See All <ChevronRight size={14} className="ml-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        <div className="flex overflow-x-auto px-6 gap-4 pb-4 snap-x no-scrollbar">
          {MOCK_BUSINESSES.filter(b => b.isTrending).map(b => (
            <div key={b.id} className="min-w-[280px] snap-center">
              <BusinessCard business={b} />
            </div>
          ))}
        </div>
      </div >

      {/* Happening Now */}
      < div className="px-6 mb-24" >
        <h3 className="text-lg font-bold text-gray-900 mb-4">Happening Now</h3>
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10">
            <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-3">
              Community Event
            </div>
            <h4 className="text-2xl font-black mb-2">Winter Badminton Fest 2026</h4>
            <div className="flex items-center space-x-4 text-indigo-100 text-sm mb-6">
              <div className="flex items-center"><Calendar size={14} className="mr-1.5" /> Feb 20, 5 PM</div>
              <div className="flex items-center"><MapPin size={14} className="mr-1.5" /> Playground B</div>
            </div>
            <button className="w-full bg-white text-indigo-900 font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform">
              Register Now
            </button>
          </div>
        </div>
      </div >


    </div >
  );
};
const DirectoryPage: React.FC<{ businesses: Business[], ads: Ad[] }> = ({ businesses, ads }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState((location.state as any)?.initialSearch || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>((location.state as any)?.initialCategory || null);

  useEffect(() => {
    if ((location.state as any)?.initialSearch !== undefined) {
      setSearchQuery((location.state as any).initialSearch);
    }
    if ((location.state as any)?.initialCategory !== undefined) {
      setSelectedCategory((location.state as any).initialCategory);
    }
  }, [location.state]);

  const filteredBusinesses = useMemo(() => {
    let list = [...businesses];

    if (selectedCategory) {
      list = list.filter(b => b.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(b =>
        b.name.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query)
      );
    }

    // Sorting Logic: Sponsored -> Ranking Priority -> Trending -> Alphabetical
    return list.sort((a, b) => {
      if (a.isSponsored !== b.isSponsored) return a.isSponsored ? -1 : 1;
      if (a.rankingPriority !== b.rankingPriority) return b.rankingPriority - a.rankingPriority;
      if (a.isTrending !== b.isTrending) return a.isTrending ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [businesses, searchQuery, selectedCategory]);

  return (
    <div className="pb-20">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Discover Kolpolok</h1>
        <p className="text-gray-500 text-sm">Find the best local services in your community.</p>
      </div>

      <div className="px-4 sticky top-[61px] z-30 bg-slate-50 py-2">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" size={20} />
          <input
            type="text"
            placeholder="Search for grocery, tailor, salon..."
            className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Banner ads={ads} />

      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center justify-between">
          Categories
          <span className="text-xs text-blue-600 font-medium">See All</span>
        </h2>
        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${!selectedCategory ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 border border-gray-100 shadow-sm'}`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 border border-gray-100 shadow-sm'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-4">
        {filteredBusinesses.map(b => (
          <BusinessCard key={b.id} business={b} />
        ))}
        {filteredBusinesses.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search size={32} />
            </div>
            <p className="text-gray-500 font-medium">No results found for your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const BusinessProfilePage: React.FC<{ businesses: Business[] }> = ({ businesses }) => {
  const { id } = useParams();
  const business = businesses.find(b => b.id === id);
  const navigate = useNavigate();

  if (!business) return <div className="p-10 text-center">Business not found</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="relative h-64">
        <img src={business.picture} className="w-full h-full object-cover" alt={business.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md text-white rounded-full"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="px-6 -mt-12 relative z-10 pb-24">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-start justify-between">
            <img src={business.logo} className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-white -mt-16" alt={business.name} />
            <div className="flex space-x-2 mt-2">
              {business.isVerified && <CheckCircle className="text-blue-500" size={24} />}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mt-4">{business.name}</h1>
          <p className="text-blue-600 font-medium">{business.category}</p>

          <div className="mt-6 space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin size={20} className="text-gray-400 flex-shrink-0 mt-1" />
              <p className="text-gray-600 leading-relaxed">{business.address}</p>
            </div>
            <div className="flex items-start space-x-3">
              <Info size={20} className="text-gray-400 flex-shrink-0 mt-1" />
              <p className="text-gray-600 leading-relaxed">{business.description}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <a
              href={`tel:${business.phone}`}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all"
            >
              <Phone size={20} />
              <span>Call Now</span>
            </a>
            <button className="flex items-center justify-center space-x-2 bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-200 active:scale-95 transition-all">
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Location Map</h2>
          <div className="bg-gray-100 h-48 rounded-3xl flex items-center justify-center text-gray-400">
            <MapPin size={32} />
            <span className="ml-2 font-medium">Map Preview</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShopPage: React.FC<{ products: Product[], user: User | null, placeOrder: (o: any) => void }> = ({ products, user, placeOrder }) => {
  const navigate = useNavigate();

  const handleOrder = (product: Product) => {
    if (!user) {
      navigate('/login?redirect=shop');
      return;
    }

    // Simulate Order Confirmation Flow
    const confirmed = window.confirm(`Confirm order for ${product.name} at ৳${product.price}?`);
    if (confirmed) {
      placeOrder({
        customerName: user.name,
        phone: user.phone,
        address: 'Block A, Kolpolok R/A', // Simplified for MVP
        productId: product.id,
        productName: product.name
      });
      alert('Order placed successfully! We will contact you soon.');
    }
  };

  return (
    <div className="pb-20">
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-gray-900">Kolpolok Club Shop</h1>
        <p className="text-gray-500 text-sm">Exclusive products for club members.</p>
      </div>

      <div className="p-4 grid grid-cols-1 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="flex overflow-x-auto no-scrollbar snap-x h-64 bg-gray-50">
              {p.images.map((img, i) => (
                <img key={i} src={img} className="min-w-full snap-center object-cover" alt={p.name} />
              ))}
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${p.stockStatus === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {p.stockStatus}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-4">{p.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-extrabold text-blue-600">৳{p.price}</span>
                <button
                  onClick={() => handleOrder(p)}
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center space-x-2 active:scale-95 transition-all shadow-md"
                >
                  <ShoppingBag size={18} />
                  <span>Order</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfilePage: React.FC<{ user: User | null, orders: Order[], logout: () => void }> = ({ user, orders, logout }) => {
  if (!user) return <div className="p-10 text-center">Please login to view profile</div>;

  const myOrders = orders.filter(o => o.phone === user.phone);

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-sm mb-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-full flex items-center justify-center mb-4 ring-4 ring-white shadow-lg shadow-blue-50">
            <span className="text-3xl font-black text-blue-600">{user.name.charAt(0)}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
          <p className="text-gray-400 font-medium mb-6">{user.phone}</p>

          <button
            onClick={logout}
            className="flex items-center space-x-2 text-sm font-bold text-red-500 bg-red-50 px-6 py-2.5 rounded-2xl hover:bg-red-100 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-gray-50 p-4 rounded-2xl text-center">
            <span className="block text-2xl font-black text-gray-900">{myOrders.length}</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Orders</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl text-center">
            <span className="block text-2xl font-black text-gray-900">0</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Favorites</span>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
            Recent Orders
            <span className="text-xs text-blue-600 font-bold">See All</span>
          </h2>
          <div className="space-y-3">
            {myOrders.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-3xl border border-gray-100 shadow-sm border-dashed">
                <p className="text-gray-400 text-sm font-medium">No orders found.</p>
                <button className="mt-4 text-blue-600 text-sm font-bold hover:underline">Start Shopping</button>
              </div>
            ) : (
              myOrders.map(o => (
                <div key={o.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{o.productName}</h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${o.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                    {o.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50">
              <div className="flex items-center space-x-3 text-gray-600">
                <UserIcon size={18} />
                <span className="text-sm font-medium">Edit Profile</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50">
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin size={18} />
                <span className="text-sm font-medium">Saved Addresses</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3 text-gray-600">
                <ShieldCheck size={18} />
                <span className="text-sm font-medium">Privacy & Security</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage: React.FC<{ login: (n: string, p: string) => void }> = ({ login }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      login(name, phone);
      navigate(-1);
    }
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-blue-200 mb-8">K</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
      <p className="text-gray-500 text-center mb-10">Enter your details to join the Kolpolok R/A community.</p>

      <form onSubmit={handleLogin} className="w-full space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
          <input
            required
            type="text"
            placeholder="e.g. Abdullah Al Mamun"
            className="w-full bg-gray-100 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500/20"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
          <input
            required
            type="tel"
            placeholder="e.g. 01712345678"
            className="w-full bg-gray-100 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500/20"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 mt-4 active:scale-95 transition-all"
        >
          Enter the Club
        </button>
      </form>
    </div>
  );
};

const ClubPage: React.FC = () => {
  return (
    <div className="pb-20">
      <div className="px-6 py-10 bg-gradient-to-br from-indigo-900 to-blue-800 text-white rounded-b-[60px] shadow-2xl">
        <h1 className="text-3xl font-black mb-4">Kolpolok Unity Club</h1>
        <p className="text-blue-100 leading-relaxed opacity-90">
          Dedicated to building a stronger, safer, and more connected community for all 5,000+ families of Kolpolok Residential Area.
        </p>
      </div>

      <div className="p-6 -mt-10">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
            <h4 className="2xl font-black text-blue-600">5k+</h4>
            <p className="text-xs text-gray-500 font-bold uppercase mt-1">Families</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
            <h4 className="2xl font-black text-green-600">120+</h4>
            <p className="text-xs text-gray-500 font-bold uppercase mt-1">Businesses</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-8 mt-4">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3" />
            Our Vision
          </h2>
          <p className="text-gray-600 leading-relaxed bg-white p-5 rounded-3xl border border-gray-50 shadow-sm">
            To create a digital ecosystem where residents can easily find trusted services, buy quality products, and stay updated with the society events without clutter.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3" />
            Join the Committee
          </h2>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-600 mb-6">Apply for membership to get exclusive benefits and a voice in our society meetings.</p>
            <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2">
              <Plus size={20} />
              <span>Membership Request</span>
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3" />
              Event Gallery
            </div>
            <button className="text-xs text-blue-600 font-bold">Upload</button>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <img src="https://picsum.photos/seed/event1/300/300" className="rounded-2xl h-32 w-full object-cover" alt="Event 1" />
            <img src="https://picsum.photos/seed/event2/300/300" className="rounded-2xl h-32 w-full object-cover" alt="Event 2" />
            <div className="rounded-2xl h-32 w-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
              <Camera size={24} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<{ businesses: Business[], orders: Order[], setOrders: any }> = ({ businesses, orders, setOrders }) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'orders'>('listings');

  const updateOrderStatus = (id: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('kolpolok_orders', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="p-6 bg-gray-900 text-white">
        <h1 className="text-2xl font-bold">Control Panel</h1>
        <p className="text-gray-400 text-sm">Manage listings and orders.</p>

        <div className="flex bg-white/10 rounded-xl p-1 mt-6">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'listings' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
          >
            Listings
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'orders' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
          >
            Orders ({orders.length})
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'listings' ? (
          <div className="space-y-4">
            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2">
              <Plus size={20} />
              <span>Add New Business</span>
            </button>
            {businesses.map(b => (
              <div key={b.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100">
                <div className="flex items-center space-x-3">
                  <img src={b.logo} className="w-10 h-10 rounded-lg" alt="" />
                  <div>
                    <h5 className="font-bold text-sm">{b.name}</h5>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{b.category}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-xs font-bold text-blue-600 px-3 py-1 bg-blue-50 rounded-lg">Edit</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-bold text-gray-900">{o.productName}</h5>
                    <p className="text-xs text-gray-500">Order ID: #{o.id}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${o.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {o.status}
                  </span>
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-sm font-medium text-gray-700">{o.customerName}</p>
                  <p className="text-sm text-gray-500">{o.phone}</p>
                  <p className="text-xs text-gray-400 italic">{o.address}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateOrderStatus(o.id, 'Contacted')}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-xs font-bold"
                  >
                    Contacted
                  </button>
                  <button
                    onClick={() => updateOrderStatus(o.id, 'Completed')}
                    className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-xs font-bold"
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-center text-gray-500 py-20">No orders to manage.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const { businesses, products, orders, user, ads, login, logout, placeOrder, setOrders } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show popup ad after 3 seconds for new sessions
    const timer = setTimeout(() => setShowPopup(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="max-w-md mx-auto bg-slate-50 min-h-screen relative shadow-2xl overflow-x-hidden">
        <Header onMenuClick={() => setIsMenuOpen(true)} user={user} />

        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
              />
              <div className="fixed inset-0 z-[60] pointer-events-none flex justify-center">
                <div className="w-full max-w-md relative h-full">
                  <motion.div
                    initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                    className="absolute top-0 right-0 bottom-0 w-3/4 bg-white shadow-2xl pointer-events-auto p-6"
                  >
                    <div className="flex justify-between items-center mb-10">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">K</div>
                      <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-400">
                        <X size={24} />
                      </button>
                    </div>
                    <nav className="space-y-6">
                      <Link to="/directory" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-4 text-lg font-bold text-gray-800">
                        <Search className="text-blue-600" size={24} />
                        <span>Directory</span>
                      </Link>
                      <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-4 text-lg font-bold text-gray-800">
                        <ShoppingBag className="text-green-600" size={24} />
                        <span>Club Shop</span>
                      </Link>
                      <Link to="/about" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-4 text-lg font-bold text-gray-800">
                        <Info className="text-indigo-600" size={24} />
                        <span>About Club</span>
                      </Link>
                      <div className="h-px bg-gray-100 my-4" />
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-4 text-sm font-bold text-gray-400 uppercase tracking-widest">
                        <span>Admin Panel</span>
                      </Link>
                    </nav>
                  </motion.div>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPopup && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowPopup(false)}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl overflow-hidden shadow-2xl relative w-full max-w-sm"
              >
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-4 right-4 p-1.5 bg-black/20 text-white rounded-full z-10"
                >
                  <X size={18} />
                </button>
                <img src={MOCK_ADS.find(a => a.placement === 'Popup')?.image} className="w-full h-80 object-cover" alt="Ad" />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Weekend Special!</h3>
                  <p className="text-gray-500 mb-6">Get 20% off at select stores in Block A. Show this app to redeem.</p>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-200"
                  >
                    View Participating Stores
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/directory" element={<DirectoryPage businesses={businesses} ads={ads} />} />
          <Route path="/business/:id" element={<BusinessProfilePage businesses={businesses} />} />
          <Route path="/shop" element={<ShopPage products={products} user={user} placeOrder={placeOrder} />} />
          <Route path="/profile" element={<ProfilePage user={user} orders={orders} logout={logout} />} />
          <Route path="/login" element={<LoginPage login={login} />} />
          <Route path="/about" element={<ClubPage />} />
          <Route path="/admin" element={<AdminDashboard businesses={businesses} orders={orders} setOrders={setOrders} />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}
