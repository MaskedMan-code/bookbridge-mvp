/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, AlertTriangle, MessageSquare, Check, X, ShieldAlert, Users, Image as ImageIcon, Send, BadgeAlert, AlertCircle 
} from 'lucide-react';
import { UserProfile, ChatThread, ChatMessage } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUpdateUser: (profile: UserProfile) => void;
  onToggleAdminRole: () => void;
}

export default function AdminPanel({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onToggleAdminRole
}: AdminPanelProps) {
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [warningText, setWarningText] = useState('');
  const [activeTab, setActiveTab] = useState<'verifications' | 'chats' | 'docs'>('verifications');

  // Load all user profiles and chats
  useEffect(() => {
    if (!isOpen) return;

    // Load active chats
    const savedChats = localStorage.getItem('bb_chats');
    if (savedChats) {
      try {
        setChats(JSON.parse(savedChats));
      } catch (e) {
        console.error(e);
      }
    }

    // Since we don't have a backend, we can collect registered users. 
    // Let's load the current profile, seed users, and any other profiles we can discover
    const loadedUsers: UserProfile[] = [];
    
    // 1. Current user
    const profile = localStorage.getItem('bb_profile');
    if (profile) {
      try {
        loadedUsers.push(JSON.parse(profile));
      } catch (e) {}
    }

    // 2. Discover from book listings, requests, replies, or pre-seeded lists
    // Let's read from our localStorage lists
    const savedBooksStr = localStorage.getItem('bb_books');
    if (savedBooksStr) {
      try {
        const books = JSON.parse(savedBooksStr);
        books.forEach((b: any) => {
          if (!loadedUsers.some(u => u.id === b.ownerId)) {
            loadedUsers.push({
              id: b.ownerId,
              name: b.ownerName,
              role: b.ownerRole,
              collegeName: b.ownerCollege,
              city: b.ownerCity,
              field: b.field,
              age: 21,
              email: b.ownerContact || 'student@college.edu',
              year: b.year,
              isVerified: b.ownerRole === 'Alumni' || b.ownerRole === 'BookStore',
              verificationStatus: b.ownerRole === 'Alumni' || b.ownerRole === 'BookStore' ? 'Approved' : 'Unverified'
            });
          }
        });
      } catch (e) {}
    }

    // Add pre-seeded users if not already included
    const SEED_USERS_MOCK = [
      {
        id: 'user_arjun',
        name: 'Arjun Mehta',
        field: 'Medical' as const,
        age: 20,
        email: 'arjun.mehta@aiims.edu',
        year: '2nd Year',
        semester: 'Semester 3',
        collegeName: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
        city: 'New Delhi',
        role: 'Junior' as const,
        isVerified: false,
        verificationStatus: 'Pending' as const,
        verificationIdUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=300&auto=format&fit=crop' // simulated card
      },
      {
        id: 'user_sneha',
        name: 'Sneha Sharma',
        field: 'BTech' as const,
        age: 19,
        email: 'sneha.sharma@dtu.ac.in',
        year: '2nd Year',
        semester: 'Semester 4',
        collegeName: 'Delhi Technological University (DTU), Delhi',
        city: 'New Delhi',
        role: 'Junior' as const,
        isVerified: false,
        verificationStatus: 'Pending' as const,
        verificationIdUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=300&auto=format&fit=crop' // simulated card
      },
      {
        id: 'user_priya',
        name: 'Priya Iyer',
        field: 'Commerce' as const,
        age: 22,
        email: 'priya.iyer@srcc.du.ac.in',
        year: '3rd Year',
        semester: 'Semester 6',
        collegeName: 'Sri Ram College of Commerce (SRCC), Delhi',
        city: 'New Delhi',
        role: 'Senior' as const,
        isVerified: true,
        verificationStatus: 'Approved' as const,
      }
    ];

    SEED_USERS_MOCK.forEach(su => {
      if (!loadedUsers.some(u => u.id === su.id)) {
        loadedUsers.push(su);
      }
    });

    setAllUsers(loadedUsers);
  }, [isOpen]);

  if (!isOpen) return null;

  // Handles approving student verification request
  const handleApproveVerification = (userId: string) => {
    // 1. Update list
    const updatedUsers = allUsers.map(u => {
      if (u.id === userId) {
        return { ...u, isVerified: true, verificationStatus: 'Approved' as const };
      }
      return u;
    });
    setAllUsers(updatedUsers);

    // 2. If it is the current user, save it in local storage & call update callback
    if (currentUser && currentUser.id === userId) {
      const updatedProfile = { ...currentUser, isVerified: true, verificationStatus: 'Approved' as const };
      localStorage.setItem('bb_profile', JSON.stringify(updatedProfile));
      onUpdateUser(updatedProfile);
    }

    // 3. Keep verified statuses consistent across listings. Let's update listings in local storage!
    const savedBooksStr = localStorage.getItem('bb_books');
    if (savedBooksStr) {
      try {
        const books = JSON.parse(savedBooksStr);
        const updatedBooks = books.map((b: any) => {
          if (b.ownerId === userId) {
            return { ...b, ownerVerified: true };
          }
          return b;
        });
        localStorage.setItem('bb_books', JSON.stringify(updatedBooks));
      } catch (e) {}
    }

    // Trigger local state updates if needed
    alert('Student account verified successfully! A verified tick-mark badge is now visible on their listings.');
  };

  // Handles rejecting verification
  const handleRejectVerification = (userId: string) => {
    const updatedUsers = allUsers.map(u => {
      if (u.id === userId) {
        return { ...u, isVerified: false, verificationStatus: 'Rejected' as const };
      }
      return u;
    });
    setAllUsers(updatedUsers);

    if (currentUser && currentUser.id === userId) {
      const updatedProfile = { ...currentUser, isVerified: false, verificationStatus: 'Rejected' as const };
      localStorage.setItem('bb_profile', JSON.stringify(updatedProfile));
      onUpdateUser(updatedProfile);
    }
  };

  // Admin Warn Command (injects System notice to the chat thread)
  const handleWarnThread = (threadId: string) => {
    if (!warningText.trim()) return;

    const selectedChat = chats.find(c => c.id === threadId);
    if (!selectedChat) return;

    const warnMsg: ChatMessage = {
      id: 'warn_' + Date.now(),
      senderId: 'system',
      senderName: '⚠️ BRIDGE SAFETY ADMIN',
      senderRole: 'Admin',
      text: `⚠️ ADMIN INTERVENTION WARNING: ${warningText.trim()}`,
      createdAt: new Date().toISOString()
    };

    const updatedChat: ChatThread = {
      ...selectedChat,
      messages: [...selectedChat.messages, warnMsg],
      updatedAt: new Date().toISOString()
    };

    const updatedChats = chats.map(c => c.id === threadId ? updatedChat : c);
    setChats(updatedChats);
    localStorage.setItem('bb_chats', JSON.stringify(updatedChats));
    setWarningText('');
  };

  const pendingUsers = allUsers.filter(u => u.verificationStatus === 'Pending');
  const selectedChat = chats.find(c => c.id === selectedChatId);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700/60 text-slate-100 rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
        id="admin-panel-container"
      >
        {/* Panel Header */}
        <div className="bg-[#0f172a] border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500 border border-amber-500/20">
              <ShieldAlert size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white font-serif">Book Bridge Safety Admin Console</h3>
                <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider animate-pulse">
                  Live Audit Active
                </span>
              </div>
              <p className="text-xs text-slate-400">Review student ID uploads, verify credentials, and moderate active peer chats.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleAdminRole}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                currentUser?.role === 'Admin'
                  ? 'bg-amber-600 border-amber-500 text-white hover:bg-amber-700'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {currentUser?.role === 'Admin' ? '🛡️ You are Admin (Click to Toggle)' : '🔑 Enable Admin Simulation'}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded transition"
              id="admin-close-btn"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Access Admin Info Section */}
        <div className="bg-slate-800/80 border-b border-slate-700/60 px-6 py-3 shrink-0 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-500 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-300">
            <span className="font-bold text-white uppercase tracking-wider">How to Access Admin Privileges:</span> In an active workspace, you can easily access this administrative mode by clicking the <span className="bg-[#ffa825] text-slate-900 font-extrabold px-1 rounded">🛡️ Admin Portal</span> link in the top header. Click <span className="underline font-semibold cursor-pointer text-amber-400" onClick={onToggleAdminRole}>"Enable Admin Simulation"</span> above to toggle back and forth to simulate standard or administrator personas!
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="bg-slate-900/80 border-b border-slate-800 shrink-0 flex gap-1 px-6 pt-2">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wide border-b-2 transition ${
              activeTab === 'verifications'
                ? 'border-emerald-500 text-emerald-400 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Student Verifications ({pendingUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('chats')}
            className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wide border-b-2 transition ${
              activeTab === 'chats'
                ? 'border-indigo-500 text-indigo-400 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Safe Chats Auditing ({chats.length})
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wide border-b-2 transition ${
              activeTab === 'docs'
                ? 'border-amber-500 text-amber-400 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Audit Guidelines
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden flex min-h-0">
          
          {/* TAB 1: VERIFICATIONS */}
          {activeTab === 'verifications' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Verification Requests Awaiting ID Review ({pendingUsers.length})
                </h4>
              </div>

              {pendingUsers.length === 0 ? (
                <div className="p-12 text-center bg-slate-800/30 rounded-xl border border-dashed border-slate-800 text-slate-400 text-xs">
                  <ShieldCheck size={40} className="mx-auto mb-2 text-emerald-500/75" />
                  No pending student verification requests. Every college student has been reviewed!
                  <p className="mt-1 text-[10px] text-slate-500">Sign up another user or upload a new Student ID to see it list here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingUsers.map(user => (
                    <div 
                      key={user.id} 
                      className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 flex flex-col gap-3 justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-white font-extrabold text-sm">{user.name}</span>
                            <p className="text-[10px] text-slate-400">📧 {user.email} • {user.age} Years</p>
                          </div>
                          <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                            {user.role} • {user.field}
                          </span>
                        </div>

                        <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800 text-xs text-slate-300">
                          <p className="font-semibold text-[10px] text-slate-400 uppercase">Registered College:</p>
                          <p className="font-bold text-white mt-0.5">🏫 {user.collegeName}</p>
                          <p className="text-[10px] text-slate-400 mt-1">📍 Location: {user.city} • Year: {user.year}</p>
                        </div>

                        {user.verificationIdUrl ? (
                          <div className="space-y-1 bg-slate-900 p-2 rounded border border-slate-800">
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                              <ImageIcon size={10} /> Uploaded ID Card / File:
                            </span>
                            <div className="h-44 bg-slate-950 flex items-center justify-center overflow-hidden rounded">
                              {user.verificationIdUrl.startsWith('data:image') || user.verificationIdUrl.startsWith('http') ? (
                                <img 
                                  src={user.verificationIdUrl} 
                                  alt="Student ID card upload" 
                                  className="h-full w-full object-contain hover:scale-110 transition duration-300 cursor-pointer"
                                  onClick={() => window.open(user.verificationIdUrl, '_blank')}
                                />
                              ) : (
                                <span className="text-xs text-slate-500 font-mono">{user.verificationIdUrl}</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-red-950/20 text-red-400 border border-red-950/40 text-xs rounded">
                            ⚠️ No ID document attached but status is pending.
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => handleRejectVerification(user.id)}
                          className="flex-1 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 hover:text-white border border-rose-800/40 py-2 rounded text-xs font-bold transition flex items-center justify-center gap-1"
                        >
                          <X size={14} /> Reject Upload
                        </button>
                        <button
                          onClick={() => handleApproveVerification(user.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded text-xs font-extrabold transition flex items-center justify-center gap-1 shadow-md"
                        >
                          <Check size={14} /> Approve & Verify Member
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CHATS AUDITING */}
          {activeTab === 'chats' && (
            <div className="flex-1 flex overflow-hidden">
              {/* Chat Threads Sidebar */}
              <div className="w-1/3 border-r border-slate-800 bg-slate-950/50 flex flex-col">
                <div className="p-3 bg-slate-900 border-b border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Live Peer Chat Threads ({chats.length})
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-800">
                  {chats.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-xs">
                      No dynamic chats in progress on Book Bridge.
                    </div>
                  ) : (
                    chats.map(thread => {
                      const participantsStr = thread.participants.map(p => p.name).join(' ↔ ');
                      const isActive = thread.id === selectedChatId;
                      const msgCount = thread.messages.length;

                      return (
                        <button
                          key={thread.id}
                          onClick={() => setSelectedChatId(thread.id)}
                          className={`w-full p-3 text-left flex flex-col gap-1 transition ${
                            isActive ? 'bg-slate-800/80 border-l-4 border-indigo-500' : 'hover:bg-slate-800/40'
                          }`}
                        >
                          <span className="font-extrabold text-xs text-white truncate">
                            {participantsStr}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1 rounded">
                              {msgCount} messages
                            </span>
                            {thread.bookTitle && (
                              <span className="text-[9px] text-slate-400 truncate max-w-[120px]">
                                📖 {thread.bookTitle}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Chat Auditing Transcript View */}
              <div className="flex-1 flex flex-col bg-slate-900/40">
                {selectedChat ? (
                  <>
                    <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Auditing Conversation:</span>
                        <h4 className="text-sm font-black text-white mt-0.5">
                          {selectedChat.participants.map(p => `${p.name} (${p.role})`).join(' and ')}
                        </h4>
                      </div>
                      {selectedChat.bookTitle && (
                        <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded">
                          Item: {selectedChat.bookTitle}
                        </span>
                      )}
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                      {selectedChat.messages.map((msg, index) => {
                        const isSystem = msg.senderId === 'system';
                        return (
                          <div 
                            key={index}
                            className={`flex ${isSystem ? 'justify-center' : 'justify-start'}`}
                          >
                            <div className={`p-2.5 rounded text-xs max-w-[85%] ${
                              isSystem
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold'
                                : 'bg-slate-800 text-slate-200 border border-slate-700/50'
                            }`}>
                              {!isSystem && (
                                <div className="flex gap-4 mb-0.5 justify-between">
                                  <span className="font-extrabold text-[10px] text-slate-400">
                                    {msg.senderName} ({msg.senderRole})
                                  </span>
                                  <span className="text-[8px] text-slate-500">
                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                  </span>
                                </div>
                              )}
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Safety Warnings Panel */}
                    <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2 shrink-0">
                      <div className="flex items-center gap-1 text-[10px] font-black text-amber-500 uppercase">
                        <AlertTriangle size={12} /> Inject Interactive Safety Warning (Simulate Moderate Response)
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Please keep interaction focused on book collection, do not request credit card details."
                          value={warningText}
                          onChange={(e) => setWarningText(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          onClick={() => handleWarnThread(selectedChat.id)}
                          className="bg-amber-600 hover:bg-amber-500 text-slate-900 font-extrabold px-4 rounded text-xs flex items-center gap-1"
                        >
                          <Send size={12} /> Send Warning
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                    <MessageSquare size={36} className="text-slate-700 mb-2" />
                    <p className="text-xs">Select an active peer chat thread from the left to start auditing</p>
                    <p className="text-[10px] text-slate-600 max-w-sm mt-1">
                      Admins have legal responsibility to monitor transactions to prevent high price black market sales and scam listings.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: GUIDELINES */}
          {activeTab === 'docs' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-4 max-w-3xl">
              <h4 className="text-white font-serif text-lg font-bold">Book Bridge Community Exchange Guidelines</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                As a designated administrator of Book Bridge, you protect the campus network. Follow these best practices:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-400 space-y-2 pl-2">
                <li>
                  <strong className="text-emerald-400">Student ID Verification:</strong> Always verify that the uploaded ID card is valid, matches the user's name, and matches their specified college. Reject any invalid or duplicate uploads.
                </li>
                <li>
                  <strong className="text-amber-400">Zero Commercial Prostitution:</strong> Book Bridge is meant for free sharing or pocket-friendly book rentals. If you see students trying to sell notes at high black market price, send a severe safety warning.
                </li>
                <li>
                  <strong className="text-sky-400">Safe Public Pickups:</strong> Always warn juniors and seniors to meet in secure campus spots, like libraries, cafeterias, or near metro gates. Never inside private hostels alone.
                </li>
              </ul>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
