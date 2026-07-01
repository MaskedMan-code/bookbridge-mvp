/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AcademicField = 'Medical' | 'BTech' | 'Arts' | 'Commerce';

export type UserRole = 'Junior' | 'Senior' | 'Alumni' | 'College' | 'BookStore' | 'Admin';

export interface UserProfile {
  id: string;
  name: string;
  field: AcademicField;
  age: number;
  email: string;
  year: string;
  semester?: string;
  collegeName: string;
  city: string;
  role: UserRole;
  isVerified?: boolean;
  verificationStatus?: 'Unverified' | 'Pending' | 'Approved' | 'Rejected';
  verificationIdUrl?: string; // base64 or file name mock url
  isAdmin?: boolean;
}

export interface BookResource {
  id: string;
  title: string;
  author: string;
  field: AcademicField;
  year: string;
  semester?: string;
  description: string;
  type: 'Sharing' | 'Renting';
  condition?: 'New' | 'Like New' | 'Good' | 'Fair';
  rate?: number; // Price in selected currency
  ratePeriod?: 'month' | 'semester';
  ownerId: string;
  ownerName: string;
  ownerRole: UserRole;
  ownerCollege: string;
  ownerCity: string;
  ownerContact: string;
  imageUrl?: string;
  createdAt: string;
}

export interface BookRequest {
  id: string;
  title: string;
  subject: string;
  field: AcademicField;
  year: string;
  semester?: string;
  description: string;
  requesterId: string;
  requesterName: string;
  requesterRole: UserRole;
  requesterCollege: string;
  requesterCity: string;
  isBoosted: boolean;
  boostAmount?: number;
  boostCurrency?: string;
  createdAt: string;
  replies?: RequestReply[];
}

export interface RequestReply {
  id: string;
  requestId: string;
  responderId: string;
  responderName: string;
  responderRole: UserRole;
  responderCollege: string;
  responderContact: string;
  message: string;
  createdAt: string;
  notesTitle?: string;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  boostFee: number;
  rentSymbol: string;
  conversionRateToINR: number; // For calculation if needed
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'INR', symbol: '₹', rentSymbol: '₹', boostFee: 35, conversionRateToINR: 1 },
  { code: 'USD', symbol: '$', rentSymbol: '$', boostFee: 1.99, conversionRateToINR: 83 },
  { code: 'EUR', symbol: '€', rentSymbol: '€', boostFee: 1.80, conversionRateToINR: 90 },
  { code: 'GBP', symbol: '£', rentSymbol: '£', boostFee: 1.50, conversionRateToINR: 105 },
];

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  participantIds: string[]; // [user1Id, user2Id]
  participants: {
    id: string;
    name: string;
    role: UserRole;
    collegeName: string;
  }[];
  bookId?: string;
  bookTitle?: string;
  messages: ChatMessage[];
  updatedAt: string;
}

