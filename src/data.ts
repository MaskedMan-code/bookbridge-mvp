/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookResource, BookRequest, UserProfile } from './types';

// Pre-seeded colleges
export const PRE_SEEDED_COLLEGES = [
  'All India Institute of Medical Sciences (AIIMS), New Delhi',
  'Delhi Technological University (DTU), Delhi',
  'Sri Ram College of Commerce (SRCC), Delhi',
  'Maulana Azad Medical College (MAMC), New Delhi',
  'Indian Institute of Technology (IIT), Delhi',
  'Lady Shri Ram College (LSR), Delhi',
  'Netaji Subhas University of Technology (NSUT), Delhi',
  'Hansraj College, Delhi University',
  'National Institute of Fashion Technology (NIFT), Delhi',
];

// Pre-seeded cities
export const PRE_SEEDED_CITIES = [
  'New Delhi',
  'Mumbai',
  'Bengaluru',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Noida',
];

// Pre-seeded default Bookstore profiles
export const DEFAULT_BOOKSTORES = [
  {
    id: 'store_1',
    name: 'City Medical & Technical Book House',
    email: 'citybooks@example.com',
    collegeName: 'Multiple Colleges (Partner)',
    city: 'New Delhi',
    role: 'BookStore' as const,
    field: 'Medical' as const,
    age: 42,
    year: 'N/A',
  },
  {
    id: 'store_2',
    name: 'Campus Tech Book Rental',
    email: 'campustech@example.com',
    collegeName: 'DTU & IIT Partner',
    city: 'New Delhi',
    role: 'BookStore' as const,
    field: 'BTech' as const,
    age: 38,
    year: 'N/A',
  },
  {
    id: 'store_3',
    name: 'College Corner Bookstore',
    email: 'collegecorner@example.com',
    collegeName: 'DU North Campus Partner',
    city: 'New Delhi',
    role: 'BookStore' as const,
    field: 'Commerce' as const,
    age: 45,
    year: 'N/A',
  }
];

// Pre-seeded default user profiles to act as authors
export const SEED_USERS: UserProfile[] = [
  {
    id: 'user_arjun',
    name: 'Arjun Mehta',
    field: 'Medical',
    age: 20,
    email: 'arjun.mehta@aiims.edu',
    year: '2nd Year',
    semester: 'Semester 3',
    collegeName: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
    city: 'New Delhi',
    role: 'Junior',
  },
  {
    id: 'user_sneha',
    name: 'Sneha Sharma',
    field: 'BTech',
    age: 19,
    email: 'sneha.sharma@dtu.ac.in',
    year: '2nd Year',
    semester: 'Semester 4',
    collegeName: 'Delhi Technological University (DTU), Delhi',
    city: 'New Delhi',
    role: 'Junior',
  },
  {
    id: 'user_rohit',
    name: 'Dr. Rohit Sen',
    field: 'Medical',
    age: 25,
    email: 'rohit.sen@alumni.aiims.edu',
    year: 'Graduate',
    collegeName: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
    city: 'New Delhi',
    role: 'Alumni',
  },
  {
    id: 'user_priya',
    name: 'Priya Iyer',
    field: 'Commerce',
    age: 22,
    email: 'priya.iyer@srcc.du.ac.in',
    year: '3rd Year',
    semester: 'Semester 6',
    collegeName: 'Sri Ram College of Commerce (SRCC), Delhi',
    city: 'New Delhi',
    role: 'Senior',
  },
  {
    id: 'user_kabir',
    name: 'Kabir Das',
    field: 'Arts',
    age: 21,
    email: 'kabir.arts@lsr.du.ac.in',
    year: '3rd Year',
    semester: 'Semester 5',
    collegeName: 'Lady Shri Ram College (LSR), Delhi',
    city: 'New Delhi',
    role: 'Senior',
  }
];

// Pre-seeded Book resources (Sharing and Renting)
export const INITIAL_BOOKS: BookResource[] = [
  {
    id: 'book_1',
    title: "BD Chaurasia's Human Anatomy (Volume 1: Upper Limb & Thorax)",
    author: 'B.D. Chaurasia',
    field: 'Medical',
    year: '1st Year',
    semester: 'Semester 1',
    description: 'Very clean copy of BD Chaurasia Vol 1. Minimal pencil markings, no highlighted pages. Perfect for incoming medical freshers. Happy to hand it over at MAMC campus or nearby metro station.',
    type: 'Sharing',
    condition: 'Like New',
    ownerId: 'user_rohit',
    ownerName: 'Dr. Rohit Sen',
    ownerRole: 'Alumni',
    ownerCollege: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
    ownerCity: 'New Delhi',
    ownerContact: 'rohit.sen@alumni.aiims.edu',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), // 3 days ago
  },
  {
    id: 'book_2',
    title: 'Robbins & Cotran Pathologic Basis of Disease',
    author: 'Vinay Kumar, Abul K. Abbas',
    field: 'Medical',
    year: '2nd Year',
    semester: 'Semester 3',
    description: 'Pathology core textbook available for rent. High-demand textbook for clinical rotations. Renting for ₹220/month. Multiple copies in stock.',
    type: 'Renting',
    rate: 220,
    ratePeriod: 'month',
    ownerId: 'store_1',
    ownerName: 'City Medical & Technical Book House',
    ownerRole: 'BookStore',
    ownerCollege: 'Multiple Colleges (Partner)',
    ownerCity: 'New Delhi',
    ownerContact: '+91 98765 43210',
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'book_3',
    title: 'Introduction to Algorithms (CLRS) - Third Edition',
    author: 'Cormen, Leiserson, Rivest, Stein',
    field: 'BTech',
    year: '2nd Year',
    semester: 'Semester 3',
    description: 'The standard algorithms bible. Finished my DSA course and do not need it anymore. Sharing for free with any junior who wants to crack coding rounds. DTU hostel 4 pickup.',
    type: 'Sharing',
    condition: 'Good',
    ownerId: 'user_kabir',
    ownerName: 'Kabir Das',
    ownerRole: 'Senior',
    ownerCollege: 'Delhi Technological University (DTU), Delhi',
    ownerCity: 'New Delhi',
    ownerContact: 'kabir.arts@lsr.du.ac.in',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), // 5 days ago
  },
  {
    id: 'book_4',
    title: 'Discrete Mathematics and Its Applications',
    author: 'Kenneth H. Rosen',
    field: 'BTech',
    year: '2nd Year',
    semester: 'Semester 4',
    description: 'Excellent rental offer for discrete math textbook. Standard syllabus textbook for CSE and IT branches. Clean pages, hardcover. Rent at ₹120 per month or ₹500 for the full semester.',
    type: 'Renting',
    rate: 120,
    ratePeriod: 'month',
    ownerId: 'store_2',
    ownerName: 'Campus Tech Book Rental',
    ownerRole: 'BookStore',
    ownerCollege: 'DTU & IIT Partner',
    ownerCity: 'New Delhi',
    ownerContact: '+91 99999 88888',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), // 12 hours ago
  },
  {
    id: 'book_5',
    title: 'Principles of Microeconomics (Mankiw)',
    author: 'N. Gregory Mankiw',
    field: 'Commerce',
    year: '1st Year',
    semester: 'Semester 1',
    description: 'Eco Hons course book. Clean pages. Happy to share with classmates or SRCC juniors. Let me know if you need macroeconomics notes too, I can email them to you.',
    type: 'Sharing',
    condition: 'Good',
    ownerId: 'user_priya',
    ownerName: 'Priya Iyer',
    ownerRole: 'Senior',
    ownerCollege: 'Sri Ram College of Commerce (SRCC), Delhi',
    ownerCity: 'New Delhi',
    ownerContact: 'priya.iyer@srcc.du.ac.in',
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 'book_6',
    title: 'T.S. Grewal Double Entry Book Keeping (Financial Accounting)',
    author: 'T.S. Grewal',
    field: 'Commerce',
    year: '1st Year',
    semester: 'Semester 2',
    description: 'Available for short-term rental. Ideal for BCom accounts courses. Comes with solved questions booklet. Rent is ₹80/month.',
    type: 'Renting',
    rate: 80,
    ratePeriod: 'month',
    ownerId: 'store_3',
    ownerName: 'College Corner Bookstore',
    ownerRole: 'BookStore',
    ownerCollege: 'DU North Campus Partner',
    ownerCity: 'New Delhi',
    ownerContact: '+91 11223 34455',
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), // 4 days ago
  },
  {
    id: 'book_7',
    title: 'A History of Western Philosophy',
    author: 'Bertrand Russell',
    field: 'Arts',
    year: '3rd Year',
    semester: 'Semester 5',
    description: 'Comprehensive study of philosophical thought. Handing over to any history/philosophy student. Has beautiful marginalia and reading highlights that might be helpful!',
    type: 'Sharing',
    condition: 'Fair',
    ownerId: 'user_kabir',
    ownerName: 'Kabir Das',
    ownerRole: 'Senior',
    ownerCollege: 'Lady Shri Ram College (LSR), Delhi',
    ownerCity: 'New Delhi',
    ownerContact: 'kabir.arts@lsr.du.ac.in',
    createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(), // 6 days ago
  }
];

// Pre-seeded Book Requests (from Juniors)
export const INITIAL_REQUESTS: BookRequest[] = [
  {
    id: 'req_1',
    title: 'Guyton and Hall: Textbook of Medical Physiology',
    subject: 'Human Physiology',
    field: 'Medical',
    year: '1st Year',
    semester: 'Semester 2',
    description: 'Urgently looking for Guyton and Hall for university exams starting next week. If any senior or alumnus is willing to share or lend it for a month, it would save me heavily. Can pick up anywhere near AIIMS or MAMC campuses.',
    requesterId: 'user_arjun',
    requesterName: 'Arjun Mehta',
    requesterRole: 'Junior',
    requesterCollege: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
    requesterCity: 'New Delhi',
    isBoosted: true,
    boostAmount: 35,
    boostCurrency: 'INR',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), // 5 hours ago
    replies: [
      {
        id: 'reply_1_1',
        requestId: 'req_1',
        responderId: 'user_rohit',
        responderName: 'Dr. Rohit Sen',
        responderRole: 'Alumni',
        responderCollege: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
        responderContact: 'rohit.sen@alumni.aiims.edu',
        message: 'Hey Arjun! I have my old Guyton (13th Edition) lying in my hostel room. I can hand it over to you tomorrow afternoon near the library. It is completely free to keep.',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      }
    ]
  },
  {
    id: 'req_2',
    title: 'Discrete Mathematics Handwritten Lecture Notes',
    subject: 'Discrete Structures',
    field: 'BTech',
    year: '2nd Year',
    semester: 'Semester 3',
    description: 'Looking for high-quality handwritten exam notes or cheat sheets for Discrete Math. Especially DTU syllabus topics (graphs, recurrence relations, generating functions). Happy to buy coffee or print copy!',
    requesterId: 'user_sneha',
    requesterName: 'Sneha Sharma',
    requesterRole: 'Junior',
    requesterCollege: 'Delhi Technological University (DTU), Delhi',
    requesterCity: 'New Delhi',
    isBoosted: true,
    boostAmount: 1.99,
    boostCurrency: 'USD',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), // 8 hours ago
    replies: []
  },
  {
    id: 'req_3',
    title: 'Double Entry Book Keeping (TS Grewal Vol 2)',
    subject: 'Financial Accounting',
    field: 'Commerce',
    year: '1st Year',
    semester: 'Semester 1',
    description: 'Need TS Grewal Financial accounting books for reference. If any senior who has completed Semester 1 has it, please reply. Can meet at DU North campus.',
    requesterId: 'user_priya',
    requesterName: 'Priya Iyer',
    requesterRole: 'Senior', // Wait, junior/senior role
    requesterCollege: 'Sri Ram College of Commerce (SRCC), Delhi',
    requesterCity: 'New Delhi',
    isBoosted: false,
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), // 1 day ago
    replies: []
  },
  {
    id: 'req_4',
    title: 'Introduction to Political Theory by O.P. Gauba',
    subject: 'Political Science',
    field: 'Arts',
    year: '1st Year',
    semester: 'Semester 1',
    description: 'Looking for OP Gauba for foundational reading in Arts. Notes or textbook both are appreciated. Will return after December finals!',
    requesterId: 'user_kabir',
    requesterName: 'Kabir Das',
    requesterRole: 'Senior',
    requesterCollege: 'Lady Shri Ram College (LSR), Delhi',
    requesterCity: 'New Delhi',
    isBoosted: false,
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), // 2 days ago
    replies: []
  }
];

// Helper to load profile from localStorage or initialize with seed
export function getSavedProfile(): UserProfile | null {
  const profile = localStorage.getItem('bb_profile');
  if (profile) {
    try {
      return JSON.parse(profile);
    } catch (e) {
      console.error(e);
    }
  }
  return null;
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem('bb_profile', JSON.stringify(profile));
}

// Helper to get books from localStorage or initialize
export function getSavedBooks(): BookResource[] {
  const books = localStorage.getItem('bb_books');
  if (books) {
    try {
      return JSON.parse(books);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem('bb_books', JSON.stringify(INITIAL_BOOKS));
  return INITIAL_BOOKS;
}

export function saveBooks(books: BookResource[]) {
  localStorage.setItem('bb_books', JSON.stringify(books));
}

// Helper to get requests from localStorage or initialize
export function getSavedRequests(): BookRequest[] {
  const requests = localStorage.getItem('bb_requests');
  if (requests) {
    try {
      return JSON.parse(requests);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem('bb_requests', JSON.stringify(INITIAL_REQUESTS));
  return INITIAL_REQUESTS;
}

export function saveRequests(requests: BookRequest[]) {
  localStorage.setItem('bb_requests', JSON.stringify(requests));
}
