/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookResource, SUPPORTED_CURRENCIES } from '../types';
import { BookOpen, MapPin, User, Store, ArrowRight, Share2, Heart, Award } from 'lucide-react';
import React, { useState } from 'react';

interface BookCardProps {
  key?: string;
  book: BookResource;
  onView: (book: BookResource) => void;
  onContact: (book: BookResource) => void;
  currencySymbol: string;
}

export default function BookCard({ book, onView, onContact, currencySymbol }: BookCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  // Field color tokens
  const getFieldColors = (field: string) => {
    switch (field) {
      case 'Medical':
        return { bg: 'bg-red-50 text-red-700 border-red-100', dot: 'bg-red-500' };
      case 'BTech':
        return { bg: 'bg-purple-50 text-purple-700 border-purple-100', dot: 'bg-purple-500' };
      case 'Commerce':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' };
      case 'Arts':
        return { bg: 'bg-orange-50 text-orange-700 border-orange-100', dot: 'bg-orange-500' };
      default:
        return { bg: 'bg-slate-50 text-slate-700 border-slate-100', dot: 'bg-slate-500' };
    }
  };

  const fieldColor = getFieldColors(book.field);

  return (
    <div 
      className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md h-full group"
      id={`book-card-${book.id}`}
    >
      {/* Visual Top Area */}
      <div className="relative aspect-[1.3] bg-slate-50 border-b border-slate-100 flex items-center justify-center p-6 overflow-hidden">
        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-sm border ${
            book.type === 'Sharing' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
              : 'bg-blue-50 text-blue-700 border-blue-100'
          }`}>
            {book.type === 'Sharing' ? 'SHARING (FREE)' : 'RENTING'}
          </span>
        </div>

        {/* Favorite */}
        <button 
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className="absolute top-3 left-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-400 hover:text-rose-500 hover:bg-white transition"
        >
          <Heart size={14} className={isLiked ? "fill-rose-500 text-rose-500" : ""} />
        </button>

        {/* Book Cover Placeholder */}
        <div className="text-slate-300 group-hover:scale-105 transition-transform duration-300 flex flex-col items-center">
          <BookOpen size={48} className="stroke-[1.5]" />
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mt-2 font-semibold">
            {book.field} • {book.year}
          </span>
        </div>
      </div>

      {/* Main Details */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          {/* Discipline Tag */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${fieldColor.bg} flex items-center gap-1 uppercase tracking-wider`}>
              <span className={`w-1 h-1 rounded-full ${fieldColor.dot}`} />
              {book.field} • {book.semester || book.year}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight group-hover:text-[#003466] transition-colors line-clamp-2">
            {book.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 italic font-medium">By {book.author}</p>
          
          {/* Description */}
          <p className="text-xs text-slate-600 mt-2.5 line-clamp-2">
            {book.description}
          </p>
        </div>

        {/* Footer info: Price or Condition */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              {book.type === 'Renting' ? (
                <div className="text-xs">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Rental Fee</span>
                  <span className="font-bold text-[#006a61] text-base">
                    {currencySymbol}{book.rate}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium"> / {book.ratePeriod || 'month'}</span>
                </div>
              ) : (
                <div className="text-xs">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Condition</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[10px]">
                    {book.condition || 'Good'}
                  </span>
                </div>
              )}
            </div>

            {/* Location context */}
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Location</span>
              <span className="text-[10px] text-slate-700 font-semibold flex items-center justify-end gap-0.5 mt-0.5">
                <MapPin size={10} className="text-slate-400" />
                {book.ownerCity}
              </span>
            </div>
          </div>

          {/* Owner details */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/60">
            <div className="flex items-center gap-1.5 max-w-[60%]">
              {book.ownerRole === 'BookStore' ? (
                <Store size={12} className="text-[#003466] flex-shrink-0" />
              ) : (
                <User size={12} className="text-[#006a61] flex-shrink-0" />
              )}
              <span className="text-[10px] text-slate-500 truncate font-medium flex items-center gap-1" title={book.ownerName}>
                <span>{book.ownerName}</span>
                {(book.ownerRole === 'Alumni' || book.ownerRole === 'BookStore' || book.ownerId === 'user_rohit' || book.ownerId === 'user_priya' || (typeof window !== 'undefined' && localStorage.getItem(`bb_verified_${book.ownerId}`) === 'true')) && (
                  <span className="text-emerald-600 inline-flex items-center" title="Verified College Member">
                    <Award size={11} className="fill-emerald-600 text-white" />
                  </span>
                )}
              </span>
            </div>

            <button 
              onClick={() => onView(book)}
              className="text-[#003466] hover:text-[#00284e] text-xs font-bold flex items-center gap-0.5 group/btn"
            >
              {book.type === 'Renting' ? 'Rent Now' : 'Details'}
              <ArrowRight size={12} className="transform group-hover/btn:translate-x-0.5 transition" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
