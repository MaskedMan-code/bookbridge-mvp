/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookRequest, UserProfile, RequestReply } from '../types';
import { MessageSquare, Sparkles, MapPin, User, Send, GraduationCap, CheckCircle2, Award } from 'lucide-react';

interface RequestCardProps {
  key?: string;
  request: BookRequest;
  currentUser: UserProfile | null;
  onAddReply: (requestId: string, message: string, notesTitle?: string) => void;
  currencySymbol: string;
}

export default function RequestCard({ request, currentUser, onAddReply, currencySymbol }: RequestCardProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [attachNotes, setAttachNotes] = useState(false);
  const [notesTitleInput, setNotesTitleInput] = useState('');

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentUser) return;

    onAddReply(
      request.id,
      replyText.trim(),
      attachNotes ? (notesTitleInput.trim() || `${request.field} Notes`) : undefined
    );
    setReplyText('');
    setNotesTitleInput('');
    setAttachNotes(false);
  };

  // Field styling helper
  const getFieldStyles = (field: string) => {
    switch (field) {
      case 'Medical':
        return 'text-red-700 bg-red-50 border-red-100';
      case 'BTech':
        return 'text-purple-700 bg-purple-50 border-purple-100';
      case 'Commerce':
        return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'Arts':
        return 'text-orange-700 bg-orange-50 border-orange-100';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div 
      className={`rounded-lg overflow-hidden transition-all duration-200 ${
        request.isBoosted 
          ? 'border-2 border-[#ffa825] bg-[#fffdf5] shadow-sm hover:shadow-md' 
          : 'border border-slate-200 bg-white hover:border-slate-300'
      }`}
      id={`request-card-${request.id}`}
    >
      {/* Top Header */}
      {request.isBoosted && (
        <div className="bg-[#ffa825] text-slate-900 px-4 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 select-none">
          <Sparkles size={14} className="fill-slate-900 animate-pulse" />
          Priority Request • Boosted Top Listing
        </div>
      )}

      <div className="p-5">
        <div className="flex justify-between items-start gap-4 mb-3">
          {/* Categorization & Subject */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider border ${getFieldStyles(request.field)}`}>
              {request.field} • {request.semester || request.year}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold font-mono">
              SUB: {request.subject}
            </span>
          </div>

          <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
            REQUESTING
          </span>
        </div>

        {/* Title and details */}
        <h3 className="font-extrabold text-slate-800 text-base md:text-lg tracking-tight leading-snug">
          {request.title}
        </h3>
        <p className="text-sm text-slate-600 mt-2 whitespace-pre-line leading-relaxed">
          {request.description}
        </p>

        {/* Location & Requester profile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 text-[#003466] flex items-center justify-center font-bold text-xs border border-slate-200">
              {request.requesterName.charAt(0)}
            </div>
            <div>
              <span className="font-bold text-slate-700 inline-flex items-center gap-1">
                <span>{request.requesterName}</span>
                {(request.requesterRole === 'Alumni' || request.requesterId === 'user_priya' || request.requesterId === 'user_rohit' || (typeof window !== 'undefined' && localStorage.getItem(`bb_verified_${request.requesterId}`) === 'true')) && (
                  <span className="text-emerald-600 inline-flex items-center" title="Verified College Member">
                    <Award size={11} className="fill-emerald-600 text-white" />
                  </span>
                )}
              </span>
              <span className="mx-1 hidden sm:inline">•</span>
              <span className="text-[11px] text-slate-500 font-medium">
                {request.requesterRole} Student @ {request.requesterCollege}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-600 font-semibold self-start sm:self-auto bg-slate-50 border border-slate-100 px-2 py-1 rounded">
            <MapPin size={12} className="text-slate-400" />
            <span>{request.requesterCity}</span>
          </div>
        </div>

        {/* Actions section */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-xs font-bold text-[#003466] hover:text-[#00284e] flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-50 rounded border border-transparent hover:border-slate-200 transition"
          >
            <MessageSquare size={14} />
            <span>
              {request.replies && request.replies.length > 0 
                ? `${request.replies.length} Senior ${request.replies.length === 1 ? 'Reply' : 'Replies'}` 
                : 'Offer Help / Reply First'}
            </span>
          </button>

          {!showReplies && (
            <button
              onClick={() => setShowReplies(true)}
              className={`text-xs font-bold px-4 py-2 rounded shadow-sm hover:opacity-90 transition ${
                request.isBoosted 
                  ? 'bg-[#ffa825] text-slate-900' 
                  : 'bg-[#003466] text-white'
              }`}
            >
              I can provide this
            </button>
          )}
        </div>

        {/* Collapsible Replies & Form */}
        {showReplies && (
          <div className="mt-4 pt-4 border-t border-slate-100/80 bg-slate-50/50 p-4 rounded-lg border border-slate-100 space-y-4">
            {/* List Replies */}
            {request.replies && request.replies.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Replies from Seniors & Alumni:
                </h4>
                {request.replies.map((reply) => (
                  <div key={reply.id} className="bg-white p-3.5 rounded border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap size={13} className="text-[#006a61]" />
                        <span className="font-bold text-xs text-slate-800">{reply.responderName}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100">
                          {reply.responderRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(reply.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* School context */}
                    <div className="text-[10px] text-slate-500 mb-2 italic">
                      {reply.responderCollege}
                    </div>

                    <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                      {reply.message}
                    </p>

                    {/* Shared notes/handwritten files */}
                    {reply.notesTitle && (
                      <div className="mt-2 flex items-center gap-1.5 bg-[#006a61]/5 border border-[#006a61]/20 p-1.5 rounded text-[11px] text-[#006a61] font-semibold">
                        <CheckCircle2 size={12} className="fill-[#006a61]/10" />
                        <span>Attached Notes: {reply.notesTitle}</span>
                      </div>
                    )}

                    {/* Contact detail */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
                      <span>Contact details shared:</span>
                      <span className="font-mono text-slate-800 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/50">
                        {reply.responderContact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-400 font-medium">
                No replies yet. Be the first to help this classmate!
              </div>
            )}

            {/* Form to submit reply */}
            {currentUser ? (
              <form onSubmit={handleReplySubmit} className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#006a61]/15 text-[#006a61] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-1 border border-[#006a61]/20">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="flex-grow space-y-2">
                    <textarea
                      rows={2}
                      required
                      placeholder={
                        currentUser.role === 'Junior' 
                          ? "Ask a follow up question or offer notes..." 
                          : `Reply to ${request.requesterName} - offer your book or handwritten notes!`
                      }
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#003466] focus:border-[#003466] outline-none bg-white placeholder-slate-400"
                    />

                    {/* Option to attach digital notes link */}
                    {currentUser.role !== 'Junior' && (
                      <div className="space-y-2">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-slate-600 select-none">
                          <input
                            type="checkbox"
                            checked={attachNotes}
                            onChange={(e) => setAttachNotes(e.target.checked)}
                            className="rounded border-slate-300 text-[#006a61] focus:ring-[#006a61] w-3 h-3"
                          />
                          I want to share digital lecture notes/PDF too
                        </label>

                        {attachNotes && (
                          <input
                            type="text"
                            placeholder="e.g. Handwritten Anatomy Sem 1 Notes.pdf"
                            value={notesTitleInput}
                            onChange={(e) => setNotesTitleInput(e.target.value)}
                            className="w-full text-[10px] p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#006a61] outline-none bg-white font-medium"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReplies(false)}
                    className="px-3 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#003466] hover:bg-[#00284e] text-white text-[11px] font-bold px-3 py-1 rounded flex items-center gap-1 shadow-xs transition"
                  >
                    <Send size={11} />
                    Send Reply
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-2 bg-slate-100 rounded text-xs text-slate-500 border border-slate-200">
                Please <span className="font-bold text-[#003466]">Register / Log In</span> to reply to requests.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
