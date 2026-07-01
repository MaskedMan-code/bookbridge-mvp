/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Send, ShieldAlert, MessageSquare, Clock, GraduationCap, Store, UserCheck, CheckCircle2 
} from 'lucide-react';
import { UserProfile, ChatThread, ChatMessage, BookResource } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  initialTargetUser?: { id: string; name: string; role: any; collegeName: string; email?: string } | null;
  initialBookContext?: BookResource | null;
}

export default function ChatModal({
  isOpen,
  onClose,
  currentUser,
  initialTargetUser,
  initialBookContext
}: ChatModalProps) {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  // Load threads from localStorage
  useEffect(() => {
    if (!isOpen || !currentUser) return;

    const savedChats = localStorage.getItem('bb_chats');
    let allThreads: ChatThread[] = [];
    
    if (savedChats) {
      try {
        allThreads = JSON.parse(savedChats);
      } catch (e) {
        console.error(e);
      }
    } else {
      // Seed some friendly demo chats
      allThreads = [
        {
          id: 'thread_seed_1',
          participantIds: ['user_sneha', 'user_rohit'],
          participants: [
            { id: 'user_sneha', name: 'Sneha Sharma', role: 'Junior', collegeName: 'Delhi Technological University (DTU), Delhi' },
            { id: 'user_rohit', name: 'Dr. Rohit Sen', role: 'Alumni', collegeName: 'All India Institute of Medical Sciences (AIIMS), New Delhi' }
          ],
          bookId: 'book_1',
          bookTitle: "BD Chaurasia's Human Anatomy",
          updatedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
          messages: [
            {
              id: 'm1',
              senderId: 'user_sneha',
              senderName: 'Sneha Sharma',
              senderRole: 'Junior',
              text: "Hello Dr. Rohit! I saw your anatomy book. Is it still available for sharing? I'm a medical enthusiast doing some cross-disciplinary work.",
              createdAt: new Date(Date.now() - 3600 * 1000).toISOString()
            },
            {
              id: 'm2',
              senderId: 'user_rohit',
              senderName: 'Dr. Rohit Sen',
              senderRole: 'Alumni',
              text: "Hi Sneha! Yes, it's absolutely available. I'd love to pass it down to support your studies. Where can we meet?",
              createdAt: new Date(Date.now() - 3300 * 1000).toISOString()
            },
            {
              id: 'm3',
              senderId: 'user_sneha',
              senderName: 'Sneha Sharma',
              senderRole: 'Junior',
              text: "That is wonderful! Can we meet at the AIIMS Metro Station tomorrow around 4 PM?",
              createdAt: new Date(Date.now() - 3000 * 1000).toISOString()
            }
          ]
        },
        {
          id: 'thread_seed_2',
          participantIds: ['user_arjun', 'store_1'],
          participants: [
            { id: 'user_arjun', name: 'Arjun Mehta', role: 'Junior', collegeName: 'All India Institute of Medical Sciences (AIIMS), New Delhi' },
            { id: 'store_1', name: 'City Medical & Technical Book House', role: 'BookStore', collegeName: 'Multiple Colleges (Partner)' }
          ],
          bookId: 'book_2',
          bookTitle: "Robbins & Cotran Pathologic Basis of Disease",
          updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
          messages: [
            {
              id: 'm1_2',
              senderId: 'user_arjun',
              senderName: 'Arjun Mehta',
              senderRole: 'Junior',
              text: "Hello! I want to rent the pathology core textbook for this semester. Do you have physical copies in stock right now?",
              createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
            },
            {
              id: 'm2_2',
              senderId: 'store_1',
              senderName: 'City Medical & Technical Book House',
              senderRole: 'BookStore',
              text: "Hello Arjun! Yes, we have 3 copies in like-new condition. You can drop by our store near DU Campus, or we can ship it to you. Rent is ₹220 per month.",
              createdAt: new Date(Date.now() - 4.5 * 3600 * 1000).toISOString()
            }
          ]
        }
      ];
      localStorage.setItem('bb_chats', JSON.stringify(allThreads));
    }

    // Filter threads for current user
    const myThreads = allThreads.filter(t => t.participantIds.includes(currentUser.id));
    setThreads(myThreads);

    // Handle deep linked initial target user
    if (initialTargetUser && initialTargetUser.id !== currentUser.id) {
      // Find if thread already exists
      const existingThread = myThreads.find(t => 
        t.participantIds.includes(initialTargetUser.id) &&
        (!initialBookContext || t.bookId === initialBookContext.id)
      );

      if (existingThread) {
        setActiveThreadId(existingThread.id);
      } else {
        // Create a new temporary thread
        const newThreadId = 'thread_' + Date.now();
        const newThread: ChatThread = {
          id: newThreadId,
          participantIds: [currentUser.id, initialTargetUser.id],
          participants: [
            {
              id: currentUser.id,
              name: currentUser.name,
              role: currentUser.role,
              collegeName: currentUser.collegeName
            },
            {
              id: initialTargetUser.id,
              name: initialTargetUser.name,
              role: initialTargetUser.role as any,
              collegeName: initialTargetUser.collegeName
            }
          ],
          bookId: initialBookContext?.id || undefined,
          bookTitle: initialBookContext?.title || undefined,
          messages: [
            {
              id: 'system_welcome',
              senderId: 'system',
              senderName: 'Book Bridge Assistant',
              senderRole: 'Admin',
              text: `👋 Chat started regarding: ${initialBookContext ? `"${initialBookContext.title}"` : 'Book Exchange Request'}. Speak respectfully and coordinate handovers in public spots.`,
              createdAt: new Date().toISOString()
            }
          ],
          updatedAt: new Date().toISOString()
        };

        const updatedAll = [newThread, ...allThreads];
        localStorage.setItem('bb_chats', JSON.stringify(updatedAll));
        setThreads([newThread, ...myThreads]);
        setActiveThreadId(newThreadId);
      }
    } else if (myThreads.length > 0 && !activeThreadId) {
      setActiveThreadId(myThreads[0].id);
    }
  }, [isOpen, currentUser, initialTargetUser, initialBookContext]);

  if (!isOpen || !currentUser) return null;

  const activeThread = threads.find(t => t.id === activeThreadId);
  const otherParticipant = activeThread?.participants.find(p => p.id !== currentUser.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeThreadId || !activeThread) return;

    const newMessage: ChatMessage = {
      id: 'm_' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text: messageText.trim(),
      createdAt: new Date().toISOString()
    };

    // Update locally and in global state
    const updatedThread: ChatThread = {
      ...activeThread,
      messages: [...activeThread.messages, newMessage],
      updatedAt: new Date().toISOString()
    };

    const savedChats = localStorage.getItem('bb_chats');
    let allThreads: ChatThread[] = [];
    if (savedChats) {
      try {
        allThreads = JSON.parse(savedChats);
      } catch (e) {
        console.error(e);
      }
    }

    const updatedAll = allThreads.map(t => t.id === activeThread.id ? updatedThread : t);
    localStorage.setItem('bb_chats', JSON.stringify(updatedAll));

    setThreads(prev => prev.map(t => t.id === activeThread.id ? updatedThread : t));
    setMessageText('');

    // Scroll chat area down
    setTimeout(() => {
      const container = document.getElementById('chat-messages-scroll');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Junior': return 'bg-sky-50 text-sky-700 border-sky-200/60';
      case 'Senior': return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
      case 'Alumni': return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'BookStore': return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'College': return 'bg-purple-50 text-purple-700 border-purple-200/60';
      default: return 'bg-slate-50 text-slate-700 border-slate-200/60';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden border border-slate-200"
        id="chat-modal-container"
      >
        {/* Chat Modal Header */}
        <div className="bg-[#003466] text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-[#ffa825]" />
            <div>
              <h3 className="text-lg font-extrabold tracking-tight">Academic Chat & Exchange Bridge</h3>
              <p className="text-[10px] text-slate-300 font-medium">Safe & Monitored Study Space for Peers</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded transition"
            id="chat-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Safety Guideline Indicator */}
        <div className="bg-amber-50 border-b border-amber-100 px-5 py-2 flex items-center gap-2 shrink-0">
          <ShieldAlert size={14} className="text-[#ffa825] shrink-0" />
          <p className="text-[11px] text-[#8c5b05] font-semibold">
            🛡️ <span className="font-extrabold text-slate-800">Admin Safety Audit Mode:</span> This chat is monitored by Book Bridge Admins. Keep chats friendly, strictly educational, and report unsafe messages.
          </p>
        </div>

        {/* Modal Main Area */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Threads Sidebar */}
          <div className="w-1/3 border-r border-slate-200 bg-slate-50/50 flex flex-col">
            <div className="p-3 bg-slate-100/50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Active Conversations ({threads.length})
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {threads.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No active chats yet. Start a chat by clicking "Contact Owner" on any book listing!
                </div>
              ) : (
                threads.map(thread => {
                  const participant = thread.participants.find(p => p.id !== currentUser.id);
                  const lastMessage = thread.messages[thread.messages.length - 1];
                  const isActive = thread.id === activeThreadId;

                  return (
                    <button
                      key={thread.id}
                      onClick={() => setActiveThreadId(thread.id)}
                      className={`w-full p-3.5 text-left flex flex-col gap-1 transition ${
                        isActive ? 'bg-white border-l-4 border-[#003466]' : 'hover:bg-slate-100/50'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-bold text-xs text-slate-800 truncate">
                          {participant?.name || 'Academic Exchange'}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium shrink-0">
                          {new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold uppercase tracking-wide ${getRoleBadgeColor(participant?.role || 'Junior')}`}>
                          {participant?.role || 'Peer'}
                        </span>
                        {thread.bookTitle && (
                          <span className="text-[9px] bg-slate-100 text-slate-600 font-bold truncate max-w-[120px] px-1 rounded">
                            📖 {thread.bookTitle}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-1">
                        {lastMessage?.text || 'No messages yet'}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Messages Pane */}
          <div className="flex-1 flex flex-col bg-slate-50">
            {activeThread ? (
              <>
                {/* Active Chat Header */}
                <div className="bg-white p-4 border-b border-slate-200 shadow-2xs shrink-0 flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                      {otherParticipant?.name}
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold uppercase tracking-wide ${getRoleBadgeColor(otherParticipant?.role || 'Junior')}`}>
                        {otherParticipant?.role}
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium max-w-sm truncate">
                      🏫 {otherParticipant?.collegeName}
                    </p>
                  </div>
                  {activeThread.bookTitle && (
                    <div className="bg-sky-50 border border-sky-100 text-sky-800 text-xs px-2.5 py-1 rounded-lg max-w-[200px] truncate">
                      <span className="font-bold">Book:</span> {activeThread.bookTitle}
                    </div>
                  )}
                </div>

                {/* Messages Scroll Container */}
                <div 
                  id="chat-messages-scroll"
                  className="flex-1 p-4 overflow-y-auto space-y-3"
                >
                  {activeThread.messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUser.id;
                    const isSystem = msg.senderId === 'system';

                    if (isSystem) {
                      return (
                        <div key={msg.id || index} className="flex justify-center my-2">
                          <span className="text-[10px] bg-slate-200/80 text-slate-600 font-bold px-3 py-1 rounded-full text-center max-w-md">
                            {msg.text}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={msg.id || index}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] rounded-lg p-3 text-xs leading-relaxed ${
                          isMe 
                            ? 'bg-[#003466] text-white rounded-br-none shadow-sm' 
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                        }`}>
                          <div className="flex justify-between items-center gap-4 mb-1">
                            <span className="font-extrabold text-[9px] opacity-75">
                              {isMe ? 'You' : msg.senderName}
                            </span>
                            <span className="text-[8px] opacity-50">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input Box */}
                <form 
                  onSubmit={handleSendMessage}
                  className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center shrink-0"
                >
                  <input
                    type="text"
                    placeholder={`Type your friendly message to ${otherParticipant?.name || 'peer'}...`}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 px-3.5 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#003466] focus:border-[#003466]"
                    maxLength={1000}
                    id="chat-message-input-field"
                  />
                  <button
                    type="submit"
                    className="bg-[#003466] hover:bg-[#00284e] text-white p-2 rounded-lg transition shrink-0"
                    id="chat-send-msg-btn"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <MessageSquare size={48} className="text-slate-300 mb-2" />
                <p className="text-xs font-semibold">Select a conversation to start chatting</p>
                <p className="text-[10px] text-slate-400 max-w-xs mt-1">
                  Keep communications clean, polite, and coordinated. Bridge admins will inspect transactions.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
