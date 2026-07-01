/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  UserProfile, 
  BookResource, 
  BookRequest, 
  SUPPORTED_CURRENCIES, 
  CurrencyConfig, 
  AcademicField 
} from './types';
import { 
  getSavedProfile, 
  saveProfile, 
  getSavedBooks, 
  saveBooks, 
  getSavedRequests, 
  saveRequests,
  PRE_SEEDED_COLLEGES,
  PRE_SEEDED_CITIES
} from './data';
import RegisterModal from './components/RegisterModal';
import BookCard from './components/BookCard';
import RequestCard from './components/RequestCard';
import PaymentModal from './components/PaymentModal';
import PostModal from './components/PostModal';
import ChatModal from './components/ChatModal';
import AdminPanel from './components/AdminPanel';

import { 
  BookOpen, 
  Search, 
  MapPin, 
  School, 
  Sparkles, 
  Plus, 
  LogOut, 
  User, 
  ChevronRight, 
  BookOpenCheck,
  Building2,
  Calendar,
  Layers,
  Heart,
  Store,
  MessageSquare,
  HelpCircle,
  Clock,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Award,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Profiles & Database State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [books, setBooks] = useState<BookResource[]>([]);
  const [requests, setRequests] = useState<BookRequest[]>([]);

  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState<'All' | AcademicField>('All');
  const [selectedCity, setSelectedCity] = useState<'All' | string>('All');
  const [selectedCollege, setSelectedCollege] = useState<'All' | string>('All');
  const [activeTab, setActiveTab] = useState<'resources' | 'requests'>('resources');

  // Currency State (defaults to INR ₹)
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyConfig>(SUPPORTED_CURRENCIES[0]);

  // Modal Triggers
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [activeRequestToBoost, setActiveRequestToBoost] = useState<BookRequest | null>(null);

  // Selected Book/Rental Detail State
  const [selectedBook, setSelectedBook] = useState<BookResource | null>(null);
  const [rentalMonths, setRentalMonths] = useState(1);

  // Chat & Admin Panel States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTargetUser, setChatTargetUser] = useState<{ id: string; name: string; role: any; collegeName: string; email?: string } | null>(null);
  const [chatBookContext, setChatBookContext] = useState<BookResource | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Temporary container for request awaiting boost payment
  const [pendingRequestData, setPendingRequestData] = useState<Omit<BookRequest, 'id' | 'requesterId' | 'requesterName' | 'requesterRole' | 'requesterCollege' | 'requesterCity' | 'createdAt' | 'replies'> | null>(null);

  // Stats / Counters
  const [stats, setStats] = useState({ booksCount: 0, sharedCount: 0, savings: 34500 });

  // Load Saved State on Mount
  useEffect(() => {
    const profile = getSavedProfile();
    setCurrentUser(profile);
    
    // Auto-open registration if no profile found
    if (!profile) {
      setIsRegisterOpen(true);
    }

    setBooks(getSavedBooks());
    setRequests(getSavedRequests());
  }, []);

  // Update Stats when DB changes
  useEffect(() => {
    if (books.length > 0) {
      const sharing = books.filter(b => b.type === 'Sharing').length;
      const renting = books.filter(b => b.type === 'Renting').length;
      setStats({
        booksCount: books.length,
        sharedCount: sharing,
        savings: (sharing * 850) + (renting * 450) + 12400 // Estimate
      });
    }
  }, [books]);

  // Handle User Registration
  const handleRegister = (profile: UserProfile) => {
    setCurrentUser(profile);
    saveProfile(profile);
    setIsRegisterOpen(false);

    // Sync currency if Indian user
    if (profile.city === 'New Delhi' || profile.city === 'Mumbai' || profile.city === 'Kolkata' || profile.city === 'Bengaluru') {
      setCurrentCurrency(SUPPORTED_CURRENCIES[0]); // INR ₹
    } else {
      setCurrentCurrency(SUPPORTED_CURRENCIES[1]); // USD $
    }
  };

  // Log Out
  const handleLogOut = () => {
    localStorage.removeItem('bb_profile');
    setCurrentUser(null);
    setIsRegisterOpen(true);
  };

  // Handle Post Book/Notes (Sharing or Renting)
  const handlePostBook = (bookData: any) => {
    if (!currentUser) return;

    const newBook: BookResource = {
      ...bookData,
      id: 'book_' + Date.now(),
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerRole: currentUser.role,
      ownerCollege: currentUser.collegeName,
      ownerCity: currentUser.city,
      ownerContact: currentUser.email,
      createdAt: new Date().toISOString(),
    };

    const updatedBooks = [newBook, ...books];
    setBooks(updatedBooks);
    saveBooks(updatedBooks);
    setIsPostOpen(false);
  };

  // Handle Post Book Request
  const handlePostRequest = (requestData: any, shouldTriggerBoost: boolean) => {
    if (!currentUser) return;

    const partialRequest: Omit<BookRequest, 'id' | 'requesterId' | 'requesterName' | 'requesterRole' | 'requesterCollege' | 'requesterCity' | 'createdAt' | 'replies'> = {
      ...requestData,
    };

    if (shouldTriggerBoost) {
      // Hold the request in state, open the checkout portal
      setPendingRequestData(partialRequest);
      setIsPaymentOpen(true);
    } else {
      // Publish standard free request
      const newRequest: BookRequest = {
        ...partialRequest,
        id: 'req_' + Date.now(),
        requesterId: currentUser.id,
        requesterName: currentUser.name,
        requesterRole: currentUser.role,
        requesterCollege: currentUser.collegeName,
        requesterCity: currentUser.city,
        isBoosted: false,
        createdAt: new Date().toISOString(),
        replies: []
      };

      const updatedRequests = [newRequest, ...requests];
      setRequests(updatedRequests);
      saveRequests(updatedRequests);
      setIsPostOpen(false);
      setActiveTab('requests'); // Switch to requests board
    }
  };

  // Handle Payment success for Priority Boost
  const handlePaymentSuccess = (currencyCode: string, fee: number) => {
    if (!currentUser || !pendingRequestData) return;

    const newRequest: BookRequest = {
      ...pendingRequestData,
      id: 'req_' + Date.now(),
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterRole: currentUser.role,
      requesterCollege: currentUser.collegeName,
      requesterCity: currentUser.city,
      isBoosted: true,
      boostAmount: fee,
      boostCurrency: currencyCode,
      createdAt: new Date().toISOString(),
      replies: []
    };

    const updatedRequests = [newRequest, ...requests];
    setRequests(updatedRequests);
    saveRequests(updatedRequests);
    
    // Reset temporary pending containers
    setPendingRequestData(null);
    setIsPaymentOpen(false);
    setIsPostOpen(false);
    setActiveTab('requests'); // Show their boosted request
  };

  // Handle replying to junior requests
  const handleAddReply = (requestId: string, message: string, notesTitle?: string) => {
    if (!currentUser) return;

    const replyId = 'reply_' + Date.now();
    const newReply = {
      id: replyId,
      requestId,
      responderId: currentUser.id,
      responderName: currentUser.name,
      responderRole: currentUser.role,
      responderCollege: currentUser.collegeName,
      responderContact: currentUser.email,
      message,
      createdAt: new Date().toISOString(),
      notesTitle
    };

    const updatedRequests = requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          replies: [...(req.replies || []), newReply]
        };
      }
      return req;
    });

    setRequests(updatedRequests);
    saveRequests(updatedRequests);
  };

  // Start chat with dynamic recipient
  const handleStartChat = (targetUser: any, bookContext: BookResource | null) => {
    if (!currentUser) {
      setIsRegisterOpen(true);
      return;
    }
    setChatTargetUser({
      id: targetUser.id || targetUser.ownerId,
      name: targetUser.name || targetUser.ownerName,
      role: targetUser.role || targetUser.ownerRole || 'Junior',
      collegeName: targetUser.collegeName || targetUser.ownerCollege || 'Academic Partner',
      email: targetUser.email || targetUser.ownerContact || ''
    });
    setChatBookContext(bookContext);
    setIsChatOpen(true);
  };

  // Toggle Admin Persona for simulation purposes
  const handleToggleAdminRole = () => {
    if (!currentUser) {
      alert('Please sign in / create a profile first to toggle administrative role!');
      return;
    }
    const nextRole = currentUser.role === 'Admin' ? 'Junior' : 'Admin';
    const updatedProfile: UserProfile = {
      ...currentUser,
      role: nextRole,
      isAdmin: nextRole === 'Admin'
    };
    setCurrentUser(updatedProfile);
    saveProfile(updatedProfile);
    
    // Set visual confirmation of verified status
    if (nextRole === 'Admin') {
      localStorage.setItem(`bb_verified_${currentUser.id}`, 'true');
    }
  };

  // Filters calculation
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesField = selectedField === 'All' || book.field === selectedField;
    const matchesCity = selectedCity === 'All' || book.ownerCity === selectedCity;
    const matchesCollege = selectedCollege === 'All' || book.ownerCollege === selectedCollege;

    return matchesSearch && matchesField && matchesCity && matchesCollege;
  });

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesField = selectedField === 'All' || req.field === selectedField;
    const matchesCity = selectedCity === 'All' || req.requesterCity === selectedCity;
    const matchesCollege = selectedCollege === 'All' || req.requesterCollege === selectedCollege;

    return matchesSearch && matchesField && matchesCity && matchesCollege;
  });

  // Segregate Boosted Priority Requests (always show on top/side for high response rates)
  const priorityRequests = requests.filter(req => req.isBoosted);

  // Unique list of cities and colleges from databases for dropdown lists
  const availableCities = Array.from(new Set([
    ...PRE_SEEDED_CITIES,
    ...books.map(b => b.ownerCity),
    ...requests.map(r => r.requesterCity)
  ])).filter(Boolean);

  const availableColleges = Array.from(new Set([
    ...PRE_SEEDED_COLLEGES,
    ...books.map(b => b.ownerCollege),
    ...requests.map(r => r.requesterCollege)
  ])).filter(col => col && col !== 'Book Store Partner');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* HEADER NAVIGATION */}
      <nav className="sticky top-0 bg-[#003466] text-white shadow-md z-30 border-b border-slate-700/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#ffa825] text-slate-900 p-2 rounded-lg font-black flex items-center justify-center shadow">
              <BookOpenCheck size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight flex items-center gap-1 font-serif">
                Book Bridge
              </span>
              <span className="text-[9px] text-[#ffa825] font-mono tracking-widest font-bold block uppercase -mt-1">
                Academic Exchange
              </span>
            </div>
          </div>

          {/* Desktop controls */}
          <div className="hidden md:flex items-center gap-6">
            {/* Currency switcher dropdown */}
            <div className="flex items-center gap-1 bg-[#00284e] border border-slate-800/40 px-2 py-1 rounded text-xs">
              <span className="text-[10px] text-slate-400 font-bold mr-1">Currency:</span>
              <select
                value={currentCurrency.code}
                onChange={(e) => {
                  const match = SUPPORTED_CURRENCIES.find(c => c.code === e.target.value);
                  if (match) setCurrentCurrency(match);
                }}
                className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
              >
                {SUPPORTED_CURRENCIES.map(curr => (
                  <option key={curr.code} value={curr.code} className="bg-[#00284e] text-white">
                    {curr.symbol} {curr.code}
                  </option>
                ))}
              </select>
            </div>

            {currentUser && (
              <button
                onClick={() => setIsChatOpen(true)}
                className="bg-[#00284e] hover:bg-slate-800 text-slate-300 hover:text-[#ffa825] px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 border border-slate-700 transition cursor-pointer"
                title="My Chats & Messages"
              >
                <MessageSquare size={13} className="text-[#ffa825]" />
                <span>My Chats</span>
              </button>
            )}

            <button
              onClick={() => setIsAdminOpen(true)}
              className="bg-amber-600 hover:bg-amber-500 text-slate-950 px-3 py-1.5 rounded text-xs font-black flex items-center gap-1 transition cursor-pointer shadow"
              title="Admin Panel & Verification Hub"
            >
              <ShieldCheck size={13} />
              <span>Admin Portal</span>
              {currentUser?.role === 'Admin' && <span className="bg-slate-950 text-amber-400 text-[8px] px-1 rounded uppercase font-mono">Live</span>}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* Profile Widget */}
                <div className="text-right">
                  <span className="text-xs font-bold block leading-none">{currentUser.name}</span>
                  <span className="text-[10px] text-[#ffa825] font-bold uppercase tracking-wider mt-0.5 inline-block">
                    {currentUser.role} • {currentUser.field}
                    {currentUser.isVerified && <span className="text-emerald-400 font-bold ml-1">✓</span>}
                  </span>
                </div>
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                  title="Edit Profile & Upload ID"
                >
                  <User size={15} />
                </button>
                <button
                  onClick={handleLogOut}
                  className="p-1.5 rounded-full bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 border border-red-900/40 transition cursor-pointer"
                  title="Log Out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="bg-[#ffa825] hover:bg-[#e09118] text-slate-950 font-black px-4 py-2 rounded text-xs tracking-wide shadow transition cursor-pointer"
              >
                Join / Sign In
              </button>
            )}

            <button
              onClick={() => {
                if (!currentUser) {
                  setIsRegisterOpen(true);
                } else {
                  setIsPostOpen(true);
                }
              }}
              className="bg-[#006a61] hover:bg-[#005149] text-white px-4 py-2 rounded text-xs font-extrabold flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Plus size={15} />
              <span>Post Listing</span>
            </button>
          </div>

          {/* Mobile triggers */}
          <div className="flex md:hidden items-center gap-1.5">
            {currentUser && (
              <button
                onClick={() => setIsChatOpen(true)}
                className="bg-[#00284e] text-[#ffa825] p-1.5 rounded border border-slate-700/60"
                title="My Chats"
              >
                <MessageSquare size={15} />
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="bg-amber-600 text-slate-950 p-1.5 rounded"
              title="Admin Portal"
            >
              <ShieldCheck size={15} />
            </button>
            <button
              onClick={() => {
                if (!currentUser) setIsRegisterOpen(true);
                else setIsPostOpen(true);
              }}
              className="bg-[#006a61] text-white p-1.5 rounded"
            >
              <Plus size={15} />
            </button>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="bg-slate-800 text-slate-200 p-1.5 rounded"
            >
              <User size={15} />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO BANNER & CRISIS CONTEXT */}
      <div className="bg-[#003466]/5 border-b border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-2 max-w-4xl">
            <div className="inline-flex items-center gap-1.5 bg-[#ffa825]/10 text-[#a36504] border border-[#ffa825]/20 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide">
              <Award size={13} className="fill-[#ffa825]/10" />
              Seniors Helping Juniors Scheme
            </div>
            <h1 className="text-xl md:text-3xl font-black text-[#0b1c30] tracking-tight leading-tight">
              Bridging the College Textbook Expense Crisis
            </h1>
            <p className="text-slate-600 text-xs md:text-sm max-w-2xl leading-relaxed">
              Medical and technical syllabus textbooks can retail for up to <strong>₹12,000 / $150 per semester</strong>. Book Bridge connects juniors with seniors, alumni, and local shops for free sharing or pocket-friendly book rentals.
            </p>
          </div>
        </div>
      </div>

      {/* FILTER & CONTROL PANEL */}
      <header className="bg-white border-b border-slate-200 py-4 px-4 sticky top-16 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Main search and selectors */}
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-grow">
              <span className="absolute left-3.5 top-3 text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search by book name, authors, syllabus, or topic notes (e.g., Anatomy, Algorithms)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none text-xs focus:ring-1 focus:ring-[#003466] focus:border-[#003466] focus:bg-white placeholder-slate-400 font-medium"
              />
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:flex gap-2.5">
              {/* City Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs">
                <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-slate-700 outline-none w-full font-semibold cursor-pointer"
                >
                  <option value="All">All Cities</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* College Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs">
                <School size={14} className="text-slate-400 flex-shrink-0" />
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="bg-transparent text-slate-700 outline-none max-w-[150px] truncate font-semibold cursor-pointer"
                >
                  <option value="All">All Colleges</option>
                  {availableColleges.map((col) => (
                    <option key={col} value={col}>{col.split(',')[0]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs Row */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 flex-wrap gap-3">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
              <button
                onClick={() => setSelectedField('All')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border transition flex-shrink-0 ${
                  selectedField === 'All'
                    ? 'bg-[#003466] border-[#003466] text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                All Subjects
              </button>
              {(['Medical', 'BTech', 'Commerce', 'Arts'] as AcademicField[]).map((field) => (
                <button
                  key={field}
                  onClick={() => setSelectedField(field)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border transition flex-shrink-0 ${
                    selectedField === field
                      ? 'bg-[#006a61] border-[#006a61] text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {field}
                </button>
              ))}
            </div>

            {/* Active filters status */}
            {(selectedField !== 'All' || selectedCity !== 'All' || selectedCollege !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedField('All');
                  setSelectedCity('All');
                  setSelectedCollege('All');
                  setSearchQuery('');
                }}
                className="text-[10px] font-bold text-red-600 hover:underline uppercase tracking-wider"
              >
                Clear Filters ×
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN BENTO BOX LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT/MAIN CONTAINER: DYNAMIC FEED PANEL (9 COLUMNS) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* TAB SELECTOR: AVAILABLE vs REQUESTS */}
            <div className="bg-white rounded-lg border border-slate-200/80 p-1 shadow-xs flex">
              <button
                onClick={() => setActiveTab('resources')}
                className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider rounded-md transition flex items-center justify-center gap-2 ${
                  activeTab === 'resources'
                    ? 'bg-[#003466] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <BookOpen size={15} />
                <span>Available Resources ({filteredBooks.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider rounded-md transition flex items-center justify-center gap-2 ${
                  activeTab === 'requests'
                    ? 'bg-[#003466] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <MessageSquare size={15} />
                <span>Student Notes/Book Queries ({filteredRequests.length})</span>
              </button>
            </div>

            {/* TAB CONTENT: AVAILABLE RESOURCES */}
            {activeTab === 'resources' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-base font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                      <Layers size={16} className="text-[#006a61]" />
                      Available Academic Textbooks
                    </h2>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Browse shared textbooks by seniors/alumni, or bookstore partner rental plans.
                    </p>
                  </div>
                </div>

                {filteredBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {filteredBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        currencySymbol={currentCurrency.symbol}
                        onView={(b) => setSelectedBook(b)}
                        onContact={(b) => setSelectedBook(b)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-slate-200 p-10 text-center text-slate-400">
                    <BookOpen size={48} className="mx-auto text-slate-300 stroke-[1.2] mb-3" />
                    <h3 className="font-bold text-slate-700">No resources found</h3>
                    <p className="text-xs mt-1 max-w-sm mx-auto">
                      There are no available books or notes matching your filter keywords. Try searching for other disciplines.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: JUNIOR QUERIES / NOTES REQUESTS */}
            {activeTab === 'requests' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                      <HelpCircle size={16} className="text-[#003466]" />
                      Active Student Needs
                    </h2>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Queries posted by juniors searching for specific textbooks or notes. Seniors, click replies to respond.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (!currentUser) setIsRegisterOpen(true);
                      else setIsPostOpen(true);
                    }}
                    className="text-xs font-bold text-[#006a61] hover:underline"
                  >
                    + Ask for a Book
                  </button>
                </div>

                {filteredRequests.length > 0 ? (
                  <div className="space-y-4">
                    {/* Render Boosted Requests first */}
                    {filteredRequests
                      .sort((a, b) => (b.isBoosted ? 1 : 0) - (a.isBoosted ? 1 : 0))
                      .map((req) => (
                        <RequestCard
                          key={req.id}
                          request={req}
                          currentUser={currentUser}
                          currencySymbol={currentCurrency.symbol}
                          onAddReply={handleAddReply}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-slate-200 p-10 text-center text-slate-400">
                    <MessageSquare size={48} className="mx-auto text-slate-300 stroke-[1.2] mb-3" />
                    <h3 className="font-bold text-slate-700">No student queries found</h3>
                    <p className="text-xs mt-1 max-w-sm mx-auto">
                      No active requests match your selection. Juniors, can't find what you need? Post a request query!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT CONTAINER: PRIORITY HIGHLIGHT BOARD & ADVISORY SIDEBAR (3 COLUMNS) */}
          <div className="lg:col-span-3 space-y-5">
            
            {/* PRIORITY BOARD WIDGET (Always showcases priority requests) */}
            <div className="bg-white border-2 border-[#ffa825] rounded-xl overflow-hidden shadow-xs">
              <div className="bg-[#ffa825] text-slate-950 px-3.5 py-2.5 flex items-center gap-1.5 font-black text-xs uppercase tracking-wider">
                <Sparkles size={14} className="fill-slate-950 text-slate-950" />
                <span>Priority Student Needs</span>
              </div>
              
              <div className="p-3.5 space-y-3 divide-y divide-slate-100">
                {priorityRequests.length > 0 ? (
                  priorityRequests.slice(0, 3).map((req) => (
                    <div key={req.id} className="pt-3 first:pt-0">
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-[9px] font-bold text-[#ffa825] bg-slate-950 px-1.5 py-0.2 rounded uppercase">
                          {req.field}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">{req.requesterRole}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs mt-1.5 line-clamp-1">
                        {req.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">
                        {req.description}
                      </p>
                      
                      <div className="mt-2.5 flex justify-between items-center text-[10px]">
                        <span className="text-slate-400 font-medium">By {req.requesterName}</span>
                        <button
                          onClick={() => {
                            setActiveTab('requests');
                            // scroll or highlight
                            const element = document.getElementById(`request-card-${req.id}`);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }}
                          className="text-[#003466] hover:underline font-bold"
                        >
                          Help Reply
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5 text-xs text-slate-400">
                    No active priority requests. Juniors can boost requests to show here!
                  </div>
                )}
              </div>
            </div>

            {/* ADVISORY/SAFETY CORNER (How Book Bridge Works) */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 text-xs">
              <h3 className="font-black text-slate-800 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
                Bridge Guidelines
              </h3>
              
              <div className="space-y-2.5">
                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-[10px] border border-emerald-100 flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-slate-600 leading-normal">
                    <strong>P2P Sharing</strong>: All student-to-student transactions are strictly for <strong>sharing/free loans</strong>. Commercial sale by peers is disallowed.
                  </p>
                </div>

                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-[10px] border border-blue-100 flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-slate-600 leading-normal">
                    <strong>Bookstore Renting</strong>: Only registered and verified <strong>Bookshops</strong> are allowed to charge rental fees. This keeps stores reliable.
                  </p>
                </div>

                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-[10px] border border-amber-100 flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-slate-600 leading-normal">
                    <strong>Handovers</strong>: Meet in public on-campus spaces (Libraries, Cafeterias) for book inspections and safety.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                <span>Book Bridge v1.2</span>
                <span className="flex items-center gap-0.5 text-[#006a61] font-semibold">
                  <ShieldCheck size={11} /> Secured Platform
                </span>
              </div>
            </div>

            {/* SPONSOR DEPARTMENTS AND PARTNERS (Scholarly) */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-[11px] text-slate-400 space-y-2">
              <span className="uppercase tracking-widest font-bold font-mono block text-[9px]">Registered Colleges</span>
              <div className="grid grid-cols-2 gap-1.5 text-slate-500 font-medium">
                <span>• AIIMS Delhi</span>
                <span>• DTU CSE</span>
                <span>• SRCC Commerce</span>
                <span>• LSR Arts</span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1.5 border-t border-slate-200/60 leading-normal">
                Departmental libraries can upload excess catalog books for bulk lending to freshmen.
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#00284e] text-slate-300 border-t border-slate-800 py-8 px-4 mt-12 text-center md:text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[#ffa825] text-slate-950 font-black flex items-center justify-center text-xs">
              B
            </span>
            <span className="font-bold text-white tracking-wide">Book Bridge Institutional Network</span>
          </div>

          <p className="text-slate-400 max-w-md md:text-right text-center leading-normal">
            An open educational resources (OER) support project combating inflation on study resources. All peer exchanges are non-profit under public scholarship parameters.
          </p>
        </div>
      </footer>

      {/* MODAL SYSTEM */}
      
      {/* 1. REGISTRATION MODAL */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onRegister={handleRegister}
        onClose={currentUser ? () => setIsRegisterOpen(false) : undefined}
      />

      {/* 2. POST RESOURCE/REQUEST MODAL */}
      <PostModal
        isOpen={isPostOpen}
        currentUser={currentUser}
        currencySymbol={currentCurrency.symbol}
        onClose={() => setIsPostOpen(false)}
        onPostBook={handlePostBook}
        onPostRequest={handlePostRequest}
      />

      {/* 3. SIMULATED BOOSTER PAYMENT GATEWAY */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => {
          setIsPaymentOpen(false);
          // Save the pending request as standard free request instead if they cancel payment
          if (currentUser && pendingRequestData) {
            const fallbackRequest: BookRequest = {
              ...pendingRequestData,
              id: 'req_' + Date.now(),
              requesterId: currentUser.id,
              requesterName: currentUser.name,
              requesterRole: currentUser.role,
              requesterCollege: currentUser.collegeName,
              requesterCity: currentUser.city,
              isBoosted: false,
              createdAt: new Date().toISOString(),
              replies: []
            };
            const updatedRequests = [fallbackRequest, ...requests];
            setRequests(updatedRequests);
            saveRequests(updatedRequests);
            setPendingRequestData(null);
            setIsPostOpen(false);
          }
        }}
        onSuccess={handlePaymentSuccess}
        requestTitle={pendingRequestData?.title || 'Book Request'}
      />

      {/* 5. AUDITED DIRECT P2P CHAT MODAL */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setChatTargetUser(null);
          setChatBookContext(null);
        }}
        currentUser={currentUser}
        initialTargetUser={chatTargetUser || undefined}
        initialBookContext={chatBookContext || undefined}
      />

      {/* 6. ADMINISTRATIVE AUDIT & VERIFICATION HUB */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={currentUser}
        onToggleAdminRole={handleToggleAdminRole}
        onUpdateUser={(updatedProfile) => {
          setCurrentUser(updatedProfile);
          saveProfile(updatedProfile);
          // Store verification in localStorage so it stays persistent
          localStorage.setItem(`bb_verified_${updatedProfile.id}`, 'true');
        }}
      />

      {/* 4. DETAIL PREVIEW & CHECKOUT / CONTACT DIALOG */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200"
            >
              {/* Cover view */}
              <div className="bg-slate-50 border-b border-slate-100 p-6 flex flex-col items-center justify-center relative">
                <button
                  onClick={() => { setSelectedBook(null); setRentalMonths(1); }}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-200/50 transition"
                >
                  <X size={16} />
                </button>

                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                  selectedBook.type === 'Sharing' 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  <BookOpen size={28} />
                </div>

                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  selectedBook.type === 'Sharing'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : 'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                  {selectedBook.type === 'Sharing' ? 'Free Peer Sharing' : 'Verified Store Rental'}
                </span>

                <h3 className="font-extrabold text-slate-900 text-base md:text-lg text-center mt-3 tracking-tight leading-snug">
                  {selectedBook.title}
                </h3>
                <p className="text-xs text-slate-500 italic mt-1 font-semibold">By {selectedBook.author}</p>
              </div>

              {/* Body details */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Field & Syllabus</span>
                    <span className="font-bold text-slate-800">{selectedBook.field} ({selectedBook.year})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Location</span>
                    <span className="font-bold text-slate-800">{selectedBook.ownerCity}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Description / Notes</span>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {selectedBook.description}
                  </p>
                </div>

                {/* Rental calculator / handover details */}
                {selectedBook.type === 'Renting' ? (
                  <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Calculate Rental Package:</span>
                      <span className="text-xs font-mono font-bold text-blue-800 bg-blue-100/50 px-2 py-0.5 rounded border border-blue-100">
                        {currentCurrency.symbol}{selectedBook.rate}/{selectedBook.ratePeriod}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Select Duration</label>
                        <select
                          value={rentalMonths}
                          onChange={(e) => setRentalMonths(Number(e.target.value))}
                          className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white font-bold outline-none"
                        >
                          <option value={1}>1 Month Rental</option>
                          <option value={3}>3 Months Rental</option>
                          <option value={5}>Full Semester (5 Mo)</option>
                        </select>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Rental Fee</span>
                        <span className="text-lg font-black text-slate-900 block mt-1">
                          {currentCurrency.symbol}{selectedBook.rate ? (selectedBook.rate * rentalMonths) : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg">
                    <span className="text-xs font-bold text-emerald-800 block">Peer Handover Terms:</span>
                    <p className="text-[11px] text-emerald-700 leading-relaxed mt-1">
                      This textbook is listed for **free sharing**. Coordinate with the senior below. Please check the pages upon meeting at library/campus.
                    </p>
                  </div>
                )}

                {/* Owner contact details */}
                <div className="pt-3 border-t border-slate-100 text-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Owner / Bookstore Details</span>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3 bg-slate-50 p-2 rounded">
                      <div>
                        <strong className="text-slate-800 font-bold block">{selectedBook.ownerName}</strong>
                        <span className="text-[10px] text-slate-500">{selectedBook.ownerCollege}</span>
                      </div>
                      <span className={`text-[9px] font-bold uppercase border px-1.5 rounded ${
                        selectedBook.ownerRole === 'BookStore' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {selectedBook.ownerRole}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const targetUser = {
                            id: selectedBook.ownerId,
                            name: selectedBook.ownerName,
                            role: selectedBook.ownerRole,
                            collegeName: selectedBook.ownerCollege,
                            email: selectedBook.ownerContact
                          };
                          handleStartChat(targetUser, selectedBook);
                          setSelectedBook(null); // Close drawer to focus on chat
                        }}
                        className="flex-1 bg-[#006a61] text-white hover:bg-[#005149] text-xs font-bold px-4 py-2.5 rounded shadow transition flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare size={13} />
                        <span>Start Instant Chat</span>
                      </button>

                      <a
                        href={`mailto:${selectedBook.ownerContact}?subject=Book Bridge - Interest in "${selectedBook.title}"`}
                        className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold px-3 py-2.5 rounded border border-slate-200 transition flex items-center justify-center gap-1"
                        title="Alternative Email Contact"
                      >
                        <MessageCircle size={13} />
                        <span>Email</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
