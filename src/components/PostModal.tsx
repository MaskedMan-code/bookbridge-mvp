/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookResource, BookRequest, UserProfile, AcademicField } from '../types';
import { PRE_SEEDED_COLLEGES, PRE_SEEDED_CITIES } from '../data';
import { X, Book, FileText, Sparkles, Store, Check, Info } from 'lucide-react';

interface PostModalProps {
  isOpen: boolean;
  currentUser: UserProfile | null;
  onClose: () => void;
  onPostBook: (book: Omit<BookResource, 'id' | 'ownerId' | 'ownerName' | 'ownerRole' | 'ownerCollege' | 'ownerCity' | 'ownerContact' | 'createdAt'>) => void;
  onPostRequest: (request: Omit<BookRequest, 'id' | 'requesterId' | 'requesterName' | 'requesterRole' | 'requesterCollege' | 'requesterCity' | 'createdAt' | 'replies'>, shouldTriggerBoost: boolean) => void;
  currencySymbol: string;
}

export default function PostModal({ isOpen, currentUser, onClose, onPostBook, onPostRequest, currencySymbol }: PostModalProps) {
  const [activeTab, setActiveTab] = useState<'resource' | 'request'>('resource');

  // Resource Form States
  const [resTitle, setResTitle] = useState('');
  const [resAuthor, setResAuthor] = useState('');
  const [resField, setResField] = useState<AcademicField>('Medical');
  const [resYear, setResYear] = useState('1st Year');
  const [resSemester, setResSemester] = useState('Semester 1');
  const [resDescription, setResDescription] = useState('');
  const [resCondition, setResCondition] = useState<'New' | 'Like New' | 'Good' | 'Fair'>('Good');
  const [resRate, setResRate] = useState<number>(100);
  const [resRatePeriod, setResRatePeriod] = useState<'month' | 'semester'>('month');

  // Request Form States
  const [reqTitle, setReqTitle] = useState('');
  const [reqSubject, setReqSubject] = useState('');
  const [reqField, setReqField] = useState<AcademicField>('Medical');
  const [reqYear, setReqYear] = useState('1st Year');
  const [reqSemester, setReqSemester] = useState('Semester 1');
  const [reqDescription, setReqDescription] = useState('');
  const [reqShouldBoost, setReqShouldBoost] = useState(false);

  if (!isOpen) return null;

  // Determine available types
  const isBookstore = currentUser?.role === 'BookStore';
  const displayRentFields = isBookstore;

  const handleResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim() || !resAuthor.trim()) return;

    onPostBook({
      title: resTitle.trim(),
      author: resAuthor.trim(),
      field: resField,
      year: resYear,
      semester: resSemester,
      description: resDescription.trim(),
      type: isBookstore ? 'Renting' : 'Sharing',
      condition: isBookstore ? undefined : resCondition,
      rate: isBookstore ? Number(resRate) : undefined,
      ratePeriod: isBookstore ? resRatePeriod : undefined,
    });

    // Reset fields
    setResTitle('');
    setResAuthor('');
    setResDescription('');
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim() || !reqSubject.trim()) return;

    onPostRequest({
      title: reqTitle.trim(),
      subject: reqSubject.trim(),
      field: reqField,
      year: reqYear,
      semester: reqSemester,
      description: reqDescription.trim(),
      isBoosted: false, // will handle after payment if requested
    }, reqShouldBoost);

    // Reset fields
    setReqTitle('');
    setReqSubject('');
    setReqDescription('');
    setReqShouldBoost(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200"
        id="post-modal-container"
      >
        {/* Header */}
        <div className="border-b border-slate-100 p-5 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#003466]/10 text-[#003466] flex items-center justify-center">
              <Book size={18} />
            </span>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Create New Listing
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* User context info */}
        {currentUser ? (
          <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 text-xs text-slate-500 flex items-center justify-between">
            <span>
              Posting as: <strong className="text-slate-700">{currentUser.name}</strong> 
              <span className="text-slate-400 font-bold mx-1.5">•</span> 
              Role: <strong className="text-slate-700">{currentUser.role}</strong>
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded font-semibold">
              {currentUser.city}
            </span>
          </div>
        ) : (
          <div className="bg-amber-50 border-b border-amber-100 px-5 py-3 text-xs text-amber-700 flex items-center gap-1">
            <Info size={14} />
            <span>Please register to complete posting of items.</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="grid grid-cols-2 border-b border-slate-100 text-sm font-bold bg-slate-50/50">
          <button
            onClick={() => setActiveTab('resource')}
            className={`py-3.5 text-center transition border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'resource'
                ? 'border-[#003466] text-[#003466] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText size={16} />
            <span>
              {isBookstore ? 'Post Rental Book' : 'Share Book/Notes'}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('request')}
            className={`py-3.5 text-center transition border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'request'
                ? 'border-[#003466] text-[#003466] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles size={16} />
            <span>Ask for a Book</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {activeTab === 'resource' ? (
            /* SHARE RESOURCE FORM */
            <form onSubmit={handleResourceSubmit} className="space-y-4">
              {isBookstore && (
                <div className="bg-blue-50 border border-blue-100 text-blue-800 p-3 rounded text-xs flex items-center gap-2">
                  <Store size={16} className="text-blue-600 flex-shrink-0" />
                  <span>
                    As a verified **Book Store**, your items are listed under **Rentals**. Students will see your monthly or semester-based rates.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Book / Note Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BD Chaurasia's Human Anatomy Vol 1"
                    value={resTitle}
                    onChange={(e) => setResTitle(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded outline-none bg-white focus:border-[#003466]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Author / Publisher</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. B.D. Chaurasia"
                    value={resAuthor}
                    onChange={(e) => setResAuthor(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded outline-none bg-white focus:border-[#003466]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Field / Discipline</label>
                  <select
                    value={resField}
                    onChange={(e) => setResField(e.target.value as AcademicField)}
                    className="w-full text-xs p-2 border border-slate-300 rounded bg-white outline-none focus:border-[#003466]"
                  >
                    <option value="Medical">Medical Science</option>
                    <option value="BTech">B.Tech / Engg</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Humanities / Arts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Academic Year</label>
                  <select
                    value={resYear}
                    onChange={(e) => setResYear(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded bg-white outline-none focus:border-[#003466]"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Intern / Graduate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Semester</label>
                  <select
                    value={resSemester}
                    onChange={(e) => setResSemester(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded bg-white outline-none focus:border-[#003466]"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
                    <option value="N/A">Not Applicable</option>
                  </select>
                </div>
              </div>

              {/* RENTAL FIELDS OR CONDITION */}
              {displayRentFields ? (
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-3">
                  <h4 className="text-xs font-bold text-[#003466] uppercase tracking-wider">Bookstore Rental Configuration</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Rental Rate ({currencySymbol})</label>
                      <input
                        type="number"
                        min="1"
                        required
                        placeholder="e.g. 150"
                        value={resRate}
                        onChange={(e) => setResRate(Number(e.target.value))}
                        className="w-full text-xs p-2 border border-slate-300 rounded outline-none bg-white focus:border-[#003466]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Pricing Duration</label>
                      <select
                        value={resRatePeriod}
                        onChange={(e) => setResRatePeriod(e.target.value as 'month' | 'semester')}
                        className="w-full text-xs p-2 border border-slate-300 rounded bg-white outline-none focus:border-[#003466]"
                      >
                        <option value="month">per Month</option>
                        <option value="semester">per Semester</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Book Condition</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['New', 'Like New', 'Good', 'Fair'] as const).map((cond) => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => setResCondition(cond)}
                        className={`py-2 rounded text-xs font-bold border transition ${
                          resCondition === cond
                            ? 'bg-[#006a61] border-[#006a61] text-white'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description & Handover Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe book details, marks, highlights, and coordinate where interested students can pick it up..."
                  value={resDescription}
                  onChange={(e) => setResDescription(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded outline-none bg-white focus:border-[#003466] placeholder-slate-400"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!currentUser}
                  className="bg-[#003466] disabled:bg-[#003466]/40 hover:bg-[#00284e] text-white text-xs font-bold px-5 py-2 rounded shadow transition"
                >
                  {isBookstore ? 'Publish Rental Offer' : 'Publish Book for Sharing'}
                </button>
              </div>
            </form>
          ) : (
            /* BOOK REQUEST FORM */
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Book / Notes Title Request</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Guyton & Hall Physiology 13th Ed"
                    value={reqTitle}
                    onChange={(e) => setReqTitle(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded outline-none bg-white focus:border-[#003466]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject / Topic Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Medical Physiology"
                    value={reqSubject}
                    onChange={(e) => setReqSubject(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded outline-none bg-white focus:border-[#003466]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Field / Discipline</label>
                  <select
                    value={reqField}
                    onChange={(e) => setReqField(e.target.value as AcademicField)}
                    className="w-full text-xs p-2 border border-slate-300 rounded bg-white outline-none focus:border-[#003466]"
                  >
                    <option value="Medical">Medical Science</option>
                    <option value="BTech">B.Tech / Engg</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Humanities / Arts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Academic Year</label>
                  <select
                    value={reqYear}
                    onChange={(e) => setReqYear(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded bg-white outline-none focus:border-[#003466]"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Semester</label>
                  <select
                    value={reqSemester}
                    onChange={(e) => setReqSemester(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded bg-white outline-none focus:border-[#003466]"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
                    <option value="N/A">Not Applicable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Why you need it & Priority context</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell seniors why you need it, which exam you are preparing for, and how soon you'd need to pick it up..."
                  value={reqDescription}
                  onChange={(e) => setReqDescription(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded outline-none bg-white focus:border-[#003466] placeholder-slate-400"
                />
              </div>

              {/* BOOST ACTION TOGGLE */}
              <div className="bg-amber-50/50 border border-[#ffa825]/30 p-3.5 rounded-lg space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <label className="text-xs font-black text-slate-800 flex items-center gap-1.5 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reqShouldBoost}
                        onChange={(e) => setReqShouldBoost(e.target.checked)}
                        className="rounded border-[#ffa825] text-[#ffa825] focus:ring-[#ffa825] w-4 h-4"
                      />
                      <Sparkles size={14} className="text-[#ffa825] fill-[#ffa825]/20" />
                      Boost to Priority Request (Top Listing)
                    </label>
                    <p className="text-[10px] text-slate-500 leading-normal pl-5">
                      Increase query visibility by 800%. Shows at the top of other students' lists for a secure micro-payment.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-xs text-slate-800 bg-amber-100 border border-[#ffa825]/40 px-2 py-0.5 rounded block">
                      {currencySymbol === '₹' ? '₹35' : '$1.99'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!currentUser}
                  className={`text-xs font-bold px-5 py-2 rounded shadow transition flex items-center gap-1 ${
                    reqShouldBoost 
                      ? 'bg-[#ffa825] text-slate-950 hover:bg-[#ff9a00]' 
                      : 'bg-[#003466] text-white hover:bg-[#00284e]'
                  }`}
                >
                  {reqShouldBoost ? (
                    <>
                      <Sparkles size={13} className="fill-slate-900" />
                      <span>Proceed to Boost Pay</span>
                    </>
                  ) : (
                    <span>Submit Free Request</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
