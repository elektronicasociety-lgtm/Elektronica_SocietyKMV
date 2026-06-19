import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import * as mockData from "./data-mock";

// Dynamic loading of Firebase credentials from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app;
let auth: any = null;
let db: any = null;
let storage: any = null;
let isFirebaseEnabled = false;

// Attempt Firebase initialization only if the main keys are provided
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    isFirebaseEnabled = true;
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization failed, falling back to mock systems.", error);
  }
} else {
  console.log("Firebase keys missing. Running ELEKTRONICA in local simulation mode.");
}

// -------------------------------------------------------------
// LOCAL STATE SIMULATOR (for fallback mode)
// -------------------------------------------------------------

// Helper to clean any Google Drive URLs or Windows Absolute Paths into clean relative/direct image URLs
export const cleanInputUrl = (url: string): string => {
  if (typeof url !== 'string') return url;
  
  // 1. Sanitize Windows Absolute/Relative File Path (if user pasted directly from File Explorer or typed public/...)
  let normalized = url.replace(/\\/g, '/').trim();
  
  // Look for "public/" in the path and extract everything after it (ensuring it starts with '/')
  const publicMatch = normalized.match(/(?:^|\/)public(\/.*)$/i);
  if (publicMatch && publicMatch[1]) {
    normalized = publicMatch[1];
  }

  // 2. Extract Google Drive File ID using regex and clean to direct download link
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]{25,})/;
  const match = normalized.match(driveRegex);
  if (match && match[1]) {
    const fileId = match[1];
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // 3. Ensure any local relative path starts with a "/" for correct Next.js routing (unless it's an external url or empty)
  if (
    normalized.length > 0 && 
    !normalized.startsWith('/') && 
    !normalized.startsWith('http://') && 
    !normalized.startsWith('https://') && 
    !normalized.startsWith('data:')
  ) {
    return '/' + normalized;
  }
  
  return normalized;
};

const URL_FIELDS = [
  "photoUrl",
  "bannerUrl",
  "gallery",
  "fileUrl",
  "proofUrl",
  "annualReportUrl",
  "yearbookPdfUrl"
];

export const cleanObjectDriveUrls = (obj: any, keyName?: string): any => {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    // Only clean if it is a known URL field
    if (keyName && URL_FIELDS.includes(keyName)) {
      return cleanInputUrl(obj);
    }
    // Self-healing: Strip leading slash if it was mistakenly prepended to a non-URL field
    if (typeof keyName === 'string' && !URL_FIELDS.includes(keyName)) {
      if (obj.startsWith('/') && !obj.includes('/', 1)) {
        return obj.substring(1);
      }
      if (obj.startsWith('/') && /^\/\d{4}-\d{2}-\d{2}/.test(obj)) {
        return obj.substring(1);
      }
      if (obj.startsWith('/') && /^\/(msg|tic|proj|event|alum|res)-/.test(obj)) {
        return obj.substring(1);
      }
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanObjectDriveUrls(item, keyName));
  }
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cleaned[key] = cleanObjectDriveUrls(obj[key], key);
      }
    }
    return cleaned;
  }
  return obj;
};

const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(`elektronica_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setLocalStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`elektronica_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error("Local storage sync error", e);
  }
};

interface SimulatedDB {
  tic: mockData.TICRecord[];
  sessions: mockData.SessionRecord[];
  projects: mockData.Project[];
  events: mockData.Event[];
  gallery: mockData.GalleryImage[];
  achievements: mockData.Achievement[];
  alumni: mockData.Alumnus[];
  resources: mockData.Resource[];
  subscribers: string[];
  certificates: any[];
  contact_messages: mockData.ContactMessage[];
}

// Initialize simulated database from mock seed files
const getSimulatedDB = (): SimulatedDB => {
  const dbData = {
    tic: getLocalStorageItem("tic", getLocalStorageItem("tic_records", mockData.mockTICRecords)),
    sessions: getLocalStorageItem("sessions", mockData.mockSessions),
    projects: getLocalStorageItem("projects", mockData.mockProjects),
    events: getLocalStorageItem("events", mockData.mockEvents),
    gallery: getLocalStorageItem("gallery", mockData.mockGallery),
    achievements: getLocalStorageItem("achievements", mockData.mockAchievements),
    alumni: getLocalStorageItem("alumni", mockData.mockAlumni),
    resources: getLocalStorageItem("resources", mockData.mockResources),
    subscribers: getLocalStorageItem("subscribers", [] as string[]),
    certificates: getLocalStorageItem("certificates", [
      { id: "EL-2027-001", recipientName: "Siddharth Sharma", eventName: "InnovateX 2027", issueDate: "2027-02-18", role: "Winner" },
      { id: "EL-2026-042", recipientName: "Aryan Goel", eventName: "Practical PCB Design Workshop", issueDate: "2026-10-10", role: "Participant" }
    ]),
    contact_messages: getLocalStorageItem("contact_messages", mockData.mockContactMessages)
  };
  return cleanObjectDriveUrls(dbData) as SimulatedDB;
};

export { app, auth, db, storage, isFirebaseEnabled };

// -------------------------------------------------------------
// UNIFIED DATA ACCESS APIS
// -------------------------------------------------------------

export async function fetchTICRecords(): Promise<mockData.TICRecord[]> {
  // If Firebase is fully set up, we could call firestore APIs.
  // For local compatibility and immediate production delivery, we use the simulated DB client
  const sdb = getSimulatedDB();
  return sdb.tic;
}

export async function fetchSessions(): Promise<mockData.SessionRecord[]> {
  const sdb = getSimulatedDB();
  return sdb.sessions;
}

export async function fetchProjects(): Promise<mockData.Project[]> {
  const sdb = getSimulatedDB();
  return sdb.projects;
}

export async function fetchEvents(): Promise<mockData.Event[]> {
  const sdb = getSimulatedDB();
  return sdb.events;
}

export async function fetchGalleryImages(): Promise<mockData.GalleryImage[]> {
  const sdb = getSimulatedDB();
  return sdb.gallery;
}

export async function fetchAchievements(): Promise<mockData.Achievement[]> {
  const sdb = getSimulatedDB();
  return sdb.achievements;
}

export async function fetchAlumni(): Promise<mockData.Alumnus[]> {
  const sdb = getSimulatedDB();
  return sdb.alumni.filter(a => a.approved !== false); // only show approved alumni
}

export async function fetchAllAlumniRaw(): Promise<mockData.Alumnus[]> {
  const sdb = getSimulatedDB();
  return sdb.alumni;
}

export async function fetchResources(): Promise<mockData.Resource[]> {
  const sdb = getSimulatedDB();
  return sdb.resources;
}

export async function addSubscriber(email: string): Promise<boolean> {
  const sdb = getSimulatedDB();
  if (sdb.subscribers.includes(email)) return true;
  sdb.subscribers.push(email);
  setLocalStorageItem("subscribers", sdb.subscribers);
  return true;
}

export async function verifyCertificate(id: string): Promise<any | null> {
  const sdb = getSimulatedDB();
  const cert = sdb.certificates.find(c => c.id.toLowerCase() === id.toLowerCase());
  return cert || null;
}

export async function fetchContactMessages(): Promise<mockData.ContactMessage[]> {
  const sdb = getSimulatedDB();
  return sdb.contact_messages || [];
}


// -------------------------------------------------------------
// WRITE OPERATIONS (Used by Admin Panel)
// -------------------------------------------------------------

export async function saveItem(collectionName: string, item: any): Promise<boolean> {
  const sdb = getSimulatedDB() as any;
  if (!sdb[collectionName]) return false;
  
  const cleanedItem = cleanObjectDriveUrls(item);
  const idx = sdb[collectionName].findIndex((x: any) => x.id === cleanedItem.id);
  if (idx > -1) {
    sdb[collectionName][idx] = { ...sdb[collectionName][idx], ...cleanedItem };
  } else {
    sdb[collectionName].push(cleanedItem);
  }
  setLocalStorageItem(collectionName, sdb[collectionName]);
  return true;
}

export async function deleteItem(collectionName: string, id: string): Promise<boolean> {
  const sdb = getSimulatedDB() as any;
  if (!sdb[collectionName]) return false;
  
  sdb[collectionName] = sdb[collectionName].filter((x: any) => x.id !== id);
  setLocalStorageItem(collectionName, sdb[collectionName]);
  return true;
}
