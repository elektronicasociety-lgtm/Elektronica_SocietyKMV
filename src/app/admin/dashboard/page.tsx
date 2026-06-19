"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PCBBackground from "@/components/effects/PCBBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  fetchProjects, fetchEvents, fetchGalleryImages, fetchAllAlumniRaw, fetchResources,
  fetchSessions, fetchTICRecords, saveItem, deleteItem, fetchContactMessages 
} from "@/lib/firebase";
import { Project, Event, GalleryImage, Alumnus, Resource, SessionRecord, TICRecord } from "@/lib/data-mock";
import { 
  LayoutDashboard, FolderKanban, CalendarRange, Image, Users2, FileText, 
  BookOpen, LogOut, Plus, Trash2, Edit3, Download, RefreshCw, Check, AlertCircle, ShieldAlert, X,
  GraduationCap, Mail
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Telemetry counts
  const [counts, setCounts] = useState({
    projects: 0,
    events: 0,
    gallery: 0,
    alumni: 0,
    resources: 0,
    sessions: 0,
    faculty: 0
  });

  // DB States
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [alumni, setAlumni] = useState<Alumnus[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [ticRecords, setTicRecords] = useState<TICRecord[]>([]);

  // Editing state
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTargetCollection, setEditTargetCollection] = useState("");
  const [modalSubTab, setModalSubTab] = useState("officers");

  // Yearbook generation state
  const [yearbookSession, setYearbookSession] = useState("2026-27");
  const [compiling, setCompiling] = useState(false);
  const [compileLogs, setCompileLogs] = useState<string[]>([]);
  const [yearbookSuccess, setYearbookSuccess] = useState(false);

  // Contact messages state
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [messageSearch, setMessageSearch] = useState("");
  const [messageFilter, setMessageFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  // Verification checks on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authorized = localStorage.getItem("elektronica_is_admin") === "true";
      if (!authorized) {
        router.push("/admin");
      } else {
        setIsAdmin(true);
      }
    }
  }, [router]);

  // Load all DB elements for CRUD
  const loadDatabase = async () => {
    try {
      const p = await fetchProjects();
      const e = await fetchEvents();
      const g = await fetchGalleryImages();
      const al = await fetchAllAlumniRaw();
      const r = await fetchResources();
      const s = await fetchSessions();
      const tics = await fetchTICRecords();
      const msgs = await fetchContactMessages();

      setProjects(p);
      setEvents(e);
      setGallery(g);
      setAlumni(al);
      setResources(r);
      setSessions(s);
      setTicRecords(tics);
      setContactMessages(msgs);

      setCounts({
        projects: p.length,
        events: e.length,
        gallery: g.length,
        alumni: al.length,
        resources: r.length,
        sessions: s.length,
        faculty: tics.length
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadDatabase();
    }
  }, [isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem("elektronica_is_admin");
    router.push("/admin");
  };

  // CRUD Delete
  const handleDelete = async (collection: string, id: string) => {
    if (!confirm("Confirm removal of this record?")) return;
    const success = await deleteItem(collection, id);
    if (success) {
      loadDatabase();
    }
  };

  // CRUD Save Trigger
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.id) return;
    
    const success = await saveItem(editTargetCollection, editingItem);
    if (success) {
      setEditModalOpen(false);
      setEditingItem(null);
      loadDatabase();
    }
  };

  // Contact Message Actions
  const toggleMessageRead = async (msg: any) => {
    const updated = { ...msg, read: !msg.read };
    const success = await saveItem("contact_messages", updated);
    if (success) {
      loadDatabase();
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Confirm removal of this contact query?")) return;
    const success = await deleteItem("contact_messages", id);
    if (success) {
      loadDatabase();
    }
  };

  const openMessageDetails = async (msg: any) => {
    setSelectedMessage(msg);
    setMessageModalOpen(true);
    if (!msg.read) {
      const updated = { ...msg, read: true };
      await saveItem("contact_messages", updated);
      loadDatabase();
    }
  };

  const filteredMessages = contactMessages.filter((msg) => {
    const matchesStatus =
      messageFilter === "all" ||
      (messageFilter === "unread" && !msg.read) ||
      (messageFilter === "read" && msg.read);
    const query = messageSearch.toLowerCase();
    const matchesSearch =
      msg.name.toLowerCase().includes(query) ||
      msg.email.toLowerCase().includes(query) ||
      msg.subject.toLowerCase().includes(query) ||
      msg.message.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const unreadCount = contactMessages.filter(m => !m.read).length;

  // CRUD Edit Init
  const startEdit = (collection: string, item: any) => {
    setEditTargetCollection(collection);
    
    const itemToEdit = { ...item };
    if (collection === "sessions") {
      const defaultLeader = (role: string) => ({
        name: "", role, photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300", email: "", linkedIn: "", bio: ""
      });
      
      itemToEdit.president = itemToEdit.president || defaultLeader("President");
      itemToEdit.vicePresident = itemToEdit.vicePresident || defaultLeader("Vice President");
      itemToEdit.secretary = itemToEdit.secretary || defaultLeader("Secretary");
      itemToEdit.jointSecretary = itemToEdit.jointSecretary || defaultLeader("Joint Secretary");
      itemToEdit.treasurer = itemToEdit.treasurer || defaultLeader("Treasurer");
      
      if (!itemToEdit.roboticsHeads || itemToEdit.roboticsHeads.length < 2) {
        const currentArr = itemToEdit.roboticsHeads || [];
        itemToEdit.roboticsHeads = [
          currentArr[0] || defaultLeader("Robotics Head"),
          currentArr[1] || defaultLeader("Robotics Head")
        ];
      }
      if (!itemToEdit.roboticsCoHeads || itemToEdit.roboticsCoHeads.length < 2) {
        const currentArr = itemToEdit.roboticsCoHeads || [];
        itemToEdit.roboticsCoHeads = [
          currentArr[0] || defaultLeader("Robotics Co-Head"),
          currentArr[1] || defaultLeader("Robotics Co-Head")
        ];
      }
      itemToEdit.contentHead = itemToEdit.contentHead || defaultLeader("Content Head");
      itemToEdit.contentCoHead = itemToEdit.contentCoHead || defaultLeader("Content Co-Head");
      
      if (!itemToEdit.seniorExecutives || itemToEdit.seniorExecutives.length < 4) {
        const currentArr = itemToEdit.seniorExecutives || [];
        itemToEdit.seniorExecutives = [
          currentArr[0] || defaultLeader("Senior Executive"),
          currentArr[1] || defaultLeader("Senior Executive"),
          currentArr[2] || defaultLeader("Senior Executive"),
          currentArr[3] || defaultLeader("Senior Executive")
        ];
      }
      if (!itemToEdit.juniorExecutives || itemToEdit.juniorExecutives.length < 4) {
        const currentArr = itemToEdit.juniorExecutives || [];
        itemToEdit.juniorExecutives = [
          currentArr[0] || defaultLeader("Junior Executive"),
          currentArr[1] || defaultLeader("Junior Executive"),
          currentArr[2] || defaultLeader("Junior Executive"),
          currentArr[3] || defaultLeader("Junior Executive")
        ];
      }

      itemToEdit.members = itemToEdit.members || [];
      itemToEdit.achievements = itemToEdit.achievements || [];
      itemToEdit.events = itemToEdit.events || [];
      itemToEdit.projects = itemToEdit.projects || [];
      itemToEdit.gallery = itemToEdit.gallery || [];
    }
    
    setEditingItem(itemToEdit);
    setEditModalOpen(true);
  };

  // CRUD Create Init
  const startCreate = (collection: string) => {
    setEditTargetCollection(collection);
    const itemId = `${collection.slice(0, 3)}-${Date.now()}`;
    let defaultItem: any = null;
    
    if (collection === "projects") {
      defaultItem = {
        id: itemId,
        name: "",
        description: "",
        category: "robotics",
        teamMembers: [{ name: "Siddharth Sharma", role: "Developer" }],
        technologies: ["STM32", "C++"],
        githubLink: "#",
        gallery: ["https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600"],
        status: "completed",
        sessionId: "2026-27",
        createdAt: new Date().toISOString(),
        featured: false
      } as Project;
    } else if (collection === "events") {
      defaultItem = {
        id: itemId,
        title: "",
        description: "",
        category: "workshop",
        date: new Date().toISOString(),
        venue: "KMV Campus",
        speakers: [{ name: "Dr. Jyoti Anand", designation: "Teacher-In-Charge", organization: "KMV" }],
        bannerUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600",
        gallery: [],
        attendanceCount: 50,
        sessionId: "2026-27"
      } as Event;
    } else if (collection === "resources") {
      defaultItem = {
        id: itemId,
        title: "",
        category: "manuals",
        description: "",
        fileUrl: "#",
        downloadCount: 0,
        semester: 1,
        uploadedAt: new Date().toISOString()
      } as Resource;
    } else if (collection === "alumni") {
      defaultItem = {
        id: itemId,
        name: "",
        passingBatch: 2026,
        positionsHeld: ["Member"],
        currentCompany: "Google",
        currentRole: "Engineer",
        linkedIn: "#",
        photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300",
        achievements: [],
        approved: true
      } as Alumnus;
    } else if (collection === "gallery") {
      defaultItem = {
        id: itemId,
        title: "",
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600",
        category: "workshops",
        sessionId: "2026-27",
        uploadedAt: new Date().toISOString()
      } as GalleryImage;
    } else if (collection === "tic") {
      defaultItem = {
        id: itemId,
        name: "",
        designation: "Associate Professor, Department of Electronics",
        qualification: "",
        email: "",
        bio: "",
        message: "",
        photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300",
        startYear: new Date().getFullYear(),
        endYear: null,
        achievements: [],
        eventsConducted: [],
        projectsGuided: []
      } as TICRecord;
    } else if (collection === "sessions") {
      const defaultLeader = (role: string) => ({
        name: "", role, photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300", email: "", linkedIn: "", bio: ""
      });
      defaultItem = {
        id: "",
        startYear: new Date().getFullYear(),
        endYear: new Date().getFullYear() + 1,
        ticId: "tic-1",
        ticName: "Dr. Jyoti Anand",
        president: defaultLeader("President"),
        vicePresident: defaultLeader("Vice President"),
        secretary: defaultLeader("Secretary"),
        jointSecretary: defaultLeader("Joint Secretary"),
        treasurer: defaultLeader("Treasurer"),
        roboticsHeads: [defaultLeader("Robotics Head"), defaultLeader("Robotics Head")],
        roboticsCoHeads: [defaultLeader("Robotics Co-Head"), defaultLeader("Robotics Co-Head")],
        contentHead: defaultLeader("Content Head"),
        contentCoHead: defaultLeader("Content Co-Head"),
        seniorExecutives: [
          defaultLeader("Senior Executive"),
          defaultLeader("Senior Executive"),
          defaultLeader("Senior Executive"),
          defaultLeader("Senior Executive")
        ],
        juniorExecutives: [
          defaultLeader("Junior Executive"),
          defaultLeader("Junior Executive"),
          defaultLeader("Junior Executive"),
          defaultLeader("Junior Executive")
        ],
        coreTeam: [],
        members: [],
        achievements: [],
        events: [],
        projects: [],
        gallery: []
      } as SessionRecord;
    }

    setEditingItem(defaultItem);
    setEditModalOpen(true);
  };

  // Yearbook generation log triggers
  const compileYearbook = () => {
    setCompiling(true);
    setYearbookSuccess(false);
    setCompileLogs([]);
    
    const logs = [
      `Initializing Digital Yearbook compiler for session ${yearbookSession}...`,
      "Fetching student bearing lists from database...",
      `Found ${projects.filter(p => p.sessionId === yearbookSession).length} projects matching parameters.`,
      `Found ${events.filter(e => e.sessionId === yearbookSession).length} event telemetry feeds.`,
      "Compiling text ASCII graphics header...",
      "Structuring accomplishments and research logs...",
      "Generating download buffer..."
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setCompileLogs(prev => [...prev, `[LOG] ${log}`]);
        if (index === logs.length - 1) {
          setCompiling(false);
          setYearbookSuccess(true);
          triggerYearbookDownload();
        }
      }, (index + 1) * 700);
    });
  };

  const triggerYearbookDownload = () => {
    const sessionProj = projects.filter(p => p.sessionId === yearbookSession);
    const sessionEvt = events.filter(e => e.sessionId === yearbookSession);
    
    let textContent = `
============================================================
       ELEKTRONICA DIGITAL YEARBOOK - SESSION ${yearbookSession}
   Electronics Society, Keshav Mahavidyalaya, DU
============================================================

[DEPARTMENT COORDINATES]
Department: Department of Electronics
Institution: Keshav Mahavidyalaya, University of Delhi
Mascot Status: Online

------------------------------------------------------------
[EXECUTIVE TEAM OFFICE BEARERS]
- President: Siddharth Sharma
- Vice President: Ananya Kapoor
- Secretary: Aryan Goel
- Treasurer: Ishita Verma

------------------------------------------------------------
[HARDWARE BLUEPRINT SHOWCASE]
`;
    sessionProj.forEach(p => {
      textContent += `
* PROJECT: ${p.name}
  Category: ${p.category} | Status: ${p.status}
  Technologies: ${p.technologies.join(", ")}
  Description: ${p.description}
  GitHub Link: ${p.githubLink}
`;
    });

    textContent += `
------------------------------------------------------------
[EVENT HISTORY LOGS]
`;
    sessionEvt.forEach(e => {
      textContent += `
* EVENT: ${e.title}
  Category: ${e.category} | Date: ${e.date}
  Venue: ${e.venue} | Attendees: ${e.attendanceCount}
  Description: ${e.description}
`;
    });

    textContent += `
============================================================
             END OF INSTITUTIONAL ARCHIVE RECORD
============================================================
`;
    
    const element = document.createElement("a");
    const file = new Blob([textContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Elektronica_Yearbook_${yearbookSession}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Export JSON backups
  const exportCollectionJSON = (collectionName: string, data: unknown[]) => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = `Elektronica_Backup_${collectionName}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center font-mono text-xs text-text-secondary p-4">
        <div className="max-w-xs text-center space-y-4">
          <ShieldAlert className="h-10 w-10 text-rose-500 mx-auto" />
          <p>GATEWAY ENCRYPTION ACTIVE. REDIRECTING AUTHORIZATION...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PCBBackground />
      <Navbar />

      <main className="flex-grow pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
            
            {/* 1. SIDEBAR CONTROLLER */}
            <div className="lg:col-span-3 space-y-4 text-left">
              <Card hoverEffect={false} className="p-4 bg-card-bg border border-card-border space-y-4">
                
                <div className="flex items-center space-x-2 border-b border-card-border pb-3">
                  <span className="w-2 h-2 rounded-full bg-primary-accent animate-ping" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">
                    Console Console
                  </span>
                </div>

                <div className="space-y-1">
                  {[
                    { id: "overview", label: "Overview", icon: LayoutDashboard },
                    { id: "faculty", label: "Faculty / TICs", icon: GraduationCap },
                    { id: "projects", label: "Projects Manager", icon: FolderKanban },
                    { id: "events", label: "Events Manager", icon: CalendarRange },
                    { id: "leadership", label: "Student Leadership", icon: Users2 },
                    { id: "gallery", label: "Gallery Manager", icon: Image },
                    { id: "alumni", label: "Alumni Manager", icon: Users2 },
                    { id: "resources", label: "Resources", icon: BookOpen },
                    { id: "contact_messages", label: "Contact Messages", icon: Mail },
                    { id: "yearbook", label: "Yearbook Compiler", icon: FileText },
                    { id: "backups", label: "System Backups", icon: Download }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        suppressHydrationWarning
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                          activeTab === tab.id
                            ? "bg-primary-accent text-black font-semibold shadow-[0_0_10px_rgba(215,255,0,0.15)]"
                            : "text-text-secondary hover:text-text-primary hover:bg-card-bg"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{tab.label}</span>
                        </div>
                        {tab.id === "contact_messages" && unreadCount > 0 && (
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono leading-none font-bold ${
                            activeTab === tab.id ? 'bg-black text-primary-accent' : 'bg-primary-accent text-black'
                          }`}>
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  suppressHydrationWarning
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-rose-400 hover:text-text-primary hover:bg-rose-500/10 transition-colors border border-rose-500/10 mt-4"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Exit Session</span>
                </button>

              </Card>
            </div>

            {/* 2. DYNAMIC WORKSPACE PANEL */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* TAB CONTENT: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6 text-left">
                  
                  {/* Summary Metric Badges */}
                  <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                    {[
                      { label: "Faculty/TICs", val: counts.faculty },
                      { label: "Projects", val: counts.projects },
                      { label: "Events", val: counts.events },
                      { label: "Leadership", val: counts.sessions },
                      { label: "Gallery", val: counts.gallery },
                      { label: "Alumni Logs", val: counts.alumni },
                      { label: "Resources", val: counts.resources }
                    ].map((m, i) => (
                      <Card key={i} hoverEffect={true} className="p-4 bg-card-bg flex flex-col justify-center text-center">
                        <span className="text-2xl font-bold font-display text-text-primary">{m.val}</span>
                        <span className="text-[9px] font-mono uppercase text-text-secondary mt-1">{m.label}</span>
                      </Card>
                    ))}
                  </div>

                  {/* System Telemetry graphs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card hoverEffect={false} className="p-6 bg-card-bg border border-card-border">
                      <h3 className="text-xs font-mono uppercase text-text-primary tracking-widest border-b border-card-border pb-2 mb-4">
                        Web Traffic Telemetry
                      </h3>
                      <div className="h-40 flex items-end justify-between px-2 pt-4 relative">
                        {/* simulated chart columns */}
                        {[15, 30, 25, 45, 60, 50, 75, 90, 85].map((val, idx) => (
                          <div key={idx} className="flex flex-col items-center flex-grow">
                            <div
                              style={{ height: `${val}%` }}
                              className="w-4 bg-primary-accent/80 rounded-t shadow-[0_0_10px_rgba(215,255,0,0.3)]"
                            />
                            <span className="text-[8px] font-mono text-text-secondary mt-2">D{idx+1}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[9px] font-mono text-text-secondary text-center mt-3">Monthly visitors logs metrics (unique users)</p>
                    </Card>

                    <Card hoverEffect={false} className="p-6 bg-card-bg border border-card-border">
                      <h3 className="text-xs font-mono uppercase text-text-primary tracking-widest border-b border-card-border pb-2 mb-4">
                        System Feed Notifications
                      </h3>
                      <div className="space-y-3 font-mono text-[10px] text-text-secondary overflow-y-auto max-h-[160px]">
                        <p className="text-emerald-400">[OK] Subscriber telemetry feeds synchronization OK</p>
                        <p>[INFO] Local mock database synced in localStorage</p>
                        <p>[INFO] Session 2026-27 yearbook compilation template compiled</p>
                        <p className="text-primary-accent">[SYS] Dashboard active. SSL handshake secure.</p>
                      </div>
                    </Card>
                  </div>

                </div>
              )}

              {/* TAB CONTENT: FACULTY / TICs CRUD MANAGER */}
              {activeTab === "faculty" && (
                <Card hoverEffect={false} className="p-6 text-left space-y-6">
                  <div className="flex items-center justify-between border-b border-card-border pb-4">
                    <h3 className="text-xs font-mono uppercase text-text-primary tracking-widest">
                      Faculty Teacher-In-Charge Ledger
                    </h3>
                    <Button variant="primary" size="sm" onClick={() => startCreate("tic")}>
                      <Plus className="mr-2 h-4.5 w-4.5" /> Add Faculty/TIC
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono text-text-secondary">
                      <thead>
                        <tr className="border-b border-card-border text-text-primary">
                          <th className="py-2.5 text-left">PHOTO</th>
                          <th className="py-2.5 text-left">NAME</th>
                          <th className="py-2.5 text-left">DESIGNATION</th>
                          <th className="py-2.5 text-left">TERM</th>
                          <th className="py-2.5 text-left">EMAIL</th>
                          <th className="py-2.5 text-right">OPERATIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ticRecords.map((t) => (
                          <tr key={t.id} className="border-b border-card-border hover:bg-card-bg">
                            <td className="py-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/40 border border-card-border flex items-center justify-center">
                                <img src={t.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300"} alt={t.name} className="w-full h-full object-cover" />
                              </div>
                            </td>
                            <td className="py-3 font-bold text-text-primary">{t.name}</td>
                            <td className="py-3 text-[11px]">{t.designation}</td>
                            <td className="py-3 text-[11px]">
                              {t.startYear} - {t.endYear ? t.endYear : "Present"}
                            </td>
                            <td className="py-3 text-primary-accent">{t.email}</td>
                            <td className="py-3 text-right space-x-2">
                              <button onClick={() => startEdit("tic", t)} className="p-1.5 text-primary-accent hover:text-text-primary transition-colors">
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDelete("tic", t.id)} className="p-1.5 text-rose-400 hover:text-text-primary transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {ticRecords.length === 0 && (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-text-primary/40">
                              NO FACULTY RECORDS PRESENT IN SYSTEM DATABASE.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* TAB CONTENT: PROJECTS CRUD MANAGER */}
              {activeTab === "projects" && (
                <Card hoverEffect={false} className="p-6 text-left space-y-6">
                  <div className="flex items-center justify-between border-b border-card-border pb-4">
                    <h3 className="text-xs font-mono uppercase text-text-primary tracking-widest">
                      Projects Ledger Manager
                    </h3>
                    <Button variant="primary" size="sm" onClick={() => startCreate("projects")}>
                      <Plus className="mr-2 h-4.5 w-4.5" /> Log Project
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono text-text-secondary space-y-2">
                      <thead>
                        <tr className="border-b border-card-border text-text-primary">
                          <th className="py-2.5 text-left">PROJECT NAME</th>
                          <th className="py-2.5 text-left">SECTOR</th>
                          <th className="py-2.5 text-left">STATUS</th>
                          <th className="py-2.5 text-right">OPERATIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((p) => (
                          <tr key={p.id} className="border-b border-card-border hover:bg-card-bg">
                            <td className="py-3 font-bold text-text-primary max-w-[200px] truncate">{p.name}</td>
                            <td className="py-3 uppercase text-[10px]">{p.category}</td>
                            <td className="py-3 uppercase">
                              <span className={`px-2 py-0.5 rounded text-[8px] ${
                                p.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                              }`}>{p.status}</span>
                            </td>
                            <td className="py-3 text-right space-x-2">
                              <button onClick={() => startEdit("projects", p)} className="p-1.5 text-primary-accent hover:text-text-primary transition-colors">
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDelete("projects", p.id)} className="p-1.5 text-rose-400 hover:text-text-primary transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* TAB CONTENT: EVENTS CRUD MANAGER */}
              {activeTab === "events" && (
                <Card hoverEffect={false} className="p-6 text-left space-y-6">
                  <div className="flex items-center justify-between border-b border-card-border pb-4">
                    <h3 className="text-xs font-mono uppercase text-text-primary tracking-widest">
                      Events Chronicle Manager
                    </h3>
                    <Button variant="primary" size="sm" onClick={() => startCreate("events")}>
                      <Plus className="mr-2 h-4.5 w-4.5" /> Log Event
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono text-text-secondary">
                      <thead>
                        <tr className="border-b border-card-border text-text-primary">
                          <th className="py-2.5 text-left">EVENT TITLE</th>
                          <th className="py-2.5 text-left">CATEGORY</th>
                          <th className="py-2.5 text-left">VENUE</th>
                          <th className="py-2.5 text-right">OPERATIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((e) => (
                          <tr key={e.id} className="border-b border-card-border hover:bg-card-bg">
                            <td className="py-3 font-bold text-text-primary max-w-[200px] truncate">{e.title}</td>
                            <td className="py-3 uppercase text-[10px]">{e.category}</td>
                            <td className="py-3">{e.venue}</td>
                            <td className="py-3 text-right space-x-2">
                              <button onClick={() => startEdit("events", e)} className="p-1.5 text-primary-accent hover:text-text-primary transition-colors">
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDelete("events", e.id)} className="p-1.5 text-rose-400 hover:text-text-primary transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* TAB CONTENT: STUDENT LEADERSHIP CRUD */}
              {activeTab === "leadership" && (
                <Card hoverEffect={false} className="p-6 text-left space-y-6">
                  <div className="flex items-center justify-between border-b border-card-border pb-4">
                    <h3 className="text-xs font-mono uppercase text-text-primary tracking-widest">
                      Student Leadership & Sessions Manager
                    </h3>
                    <Button variant="primary" size="sm" onClick={() => startCreate("sessions")}>
                      <Plus className="mr-2 h-4.5 w-4.5" /> Add Session
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono text-text-secondary">
                      <thead>
                        <tr className="border-b border-card-border text-text-primary">
                          <th className="py-2.5 text-left">SESSION ID</th>
                          <th className="py-2.5 text-left">TEACHER-IN-CHARGE</th>
                          <th className="py-2.5 text-left">PRESIDENT</th>
                          <th className="py-2.5 text-left">VICE PRESIDENT</th>
                          <th className="py-2.5 text-right">OPERATIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.map((s) => (
                          <tr key={s.id} className="border-b border-card-border hover:bg-card-bg">
                            <td className="py-3 font-bold text-text-primary">{s.id}</td>
                            <td className="py-3">{s.ticName}</td>
                            <td className="py-3">{s.president?.name || "N/A"}</td>
                            <td className="py-3">{s.vicePresident?.name || "N/A"}</td>
                            <td className="py-3 text-right space-x-2">
                              <button onClick={() => startEdit("sessions", s)} className="p-1.5 text-primary-accent hover:text-text-primary transition-colors">
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDelete("sessions", s.id)} className="p-1.5 text-rose-400 hover:text-text-primary transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* TAB CONTENT: GALLERY MANAGER */}
              {activeTab === "gallery" && (
                <Card hoverEffect={false} className="p-6 text-left space-y-6">
                  <div className="flex items-center justify-between border-b border-card-border pb-4">
                    <h3 className="text-xs font-mono uppercase text-text-primary tracking-widest">
                      Visual Gallery Manager
                    </h3>
                    <Button variant="primary" size="sm" onClick={() => startCreate("gallery")}>
                      <Plus className="mr-2 h-4.5 w-4.5" /> Log Photo
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {gallery.map((g) => (
                      <div key={g.id} className="rounded-xl overflow-hidden border border-card-border bg-card-bg p-2 relative group text-left">
                        <div className="h-24 rounded-lg overflow-hidden bg-black/40">
                          <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="text-[10px] font-bold text-text-primary truncate mt-2">{g.title}</h4>
                        <span className="text-[8px] font-mono text-text-secondary uppercase">{g.category}</span>
                        
                        <div className="flex justify-end pt-2 space-x-1">
                          <button onClick={() => startEdit("gallery", g)} className="p-1 text-primary-accent hover:bg-card-bg rounded">
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => handleDelete("gallery", g.id)} className="p-1 text-rose-400 hover:bg-card-bg rounded">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* TAB CONTENT: ALUMNI CRUD MANAGER */}
              {activeTab === "alumni" && (
                <Card hoverEffect={false} className="p-6 text-left space-y-6">
                  <div className="flex items-center justify-between border-b border-card-border pb-4">
                    <h3 className="text-xs font-mono uppercase text-text-primary tracking-widest">
                      Alumni Directory Manager
                    </h3>
                    <Button variant="primary" size="sm" onClick={() => startCreate("alumni")}>
                      <Plus className="mr-2 h-4.5 w-4.5" /> Log Alumnus
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono text-text-secondary">
                      <thead>
                        <tr className="border-b border-card-border text-text-primary">
                          <th className="py-2.5 text-left">ALUMNUS NAME</th>
                          <th className="py-2.5 text-left">BATCH</th>
                          <th className="py-2.5 text-left">COMPANY</th>
                          <th className="py-2.5 text-left">MODERATION</th>
                          <th className="py-2.5 text-right">OPERATIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alumni.map((al) => (
                          <tr key={al.id} className="border-b border-card-border hover:bg-card-bg">
                            <td className="py-3 font-bold text-text-primary">{al.name}</td>
                            <td className="py-3">{al.passingBatch}</td>
                            <td className="py-3 truncate max-w-[150px]">{al.currentCompany}</td>
                            <td className="py-3">
                              {al.approved !== false ? (
                                <span className="px-2 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-400">APPROVED</span>
                              ) : (
                                <button
                                  onClick={async () => {
                                    const updated = { ...al, approved: true };
                                    await saveItem("alumni", updated);
                                    loadDatabase();
                                  }}
                                  className="px-2 py-0.5 rounded text-[8px] bg-amber-500/20 text-primary-accent border border-primary-accent/40 font-bold hover:bg-primary-accent hover:text-black transition-colors"
                                >
                                  APPROVE
                                </button>
                              )}
                            </td>
                            <td className="py-3 text-right space-x-2">
                              <button onClick={() => startEdit("alumni", al)} className="p-1.5 text-primary-accent hover:text-text-primary transition-colors">
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDelete("alumni", al.id)} className="p-1.5 text-rose-400 hover:text-text-primary transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* TAB CONTENT: RESOURCES CRUD */}
              {activeTab === "resources" && (
                <Card hoverEffect={false} className="p-6 text-left space-y-6">
                  <div className="flex items-center justify-between border-b border-card-border pb-4">
                    <h3 className="text-xs font-mono uppercase text-text-primary tracking-widest">
                      Academic Syllabus Repository
                    </h3>
                    <Button variant="primary" size="sm" onClick={() => startCreate("resources")}>
                      <Plus className="mr-2 h-4.5 w-4.5" /> Log Material
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono text-text-secondary">
                      <thead>
                        <tr className="border-b border-card-border text-text-primary">
                          <th className="py-2.5 text-left">RESOURCE TITLE</th>
                          <th className="py-2.5 text-left">SEM</th>
                          <th className="py-2.5 text-left">FORMAT</th>
                          <th className="py-2.5 text-right">OPERATIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resources.map((r) => (
                          <tr key={r.id} className="border-b border-card-border hover:bg-card-bg">
                            <td className="py-3 font-bold text-text-primary max-w-[250px] truncate">{r.title}</td>
                            <td className="py-3">Sem {r.semester}</td>
                            <td className="py-3 uppercase text-[10px]">{r.category}</td>
                            <td className="py-3 text-right space-x-2">
                              <button onClick={() => startEdit("resources", r)} className="p-1.5 text-primary-accent hover:text-text-primary transition-colors">
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDelete("resources", r.id)} className="p-1.5 text-rose-400 hover:text-text-primary transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* TAB CONTENT: DIGITAL YEARBOOK COMPILER */}
              {activeTab === "yearbook" && (
                <Card hoverEffect={false} className="p-6 text-left space-y-6">
                  <h3 className="text-xs font-mono uppercase text-text-primary tracking-widest border-b border-card-border pb-3">
                    Digital Yearbook compiler system
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    
                    {/* Setup Panel */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Academic session target *</label>
                        <select
                          value={yearbookSession}
                          onChange={(e) => setYearbookSession(e.target.value)}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-primary-accent cursor-pointer"
                        >
                          <option value="2026-27" className="bg-bg-secondary text-text-primary">Session 2026-27</option>
                          <option value="2025-26" className="bg-bg-secondary text-text-primary">Session 2025-26</option>
                          <option value="2024-25" className="bg-bg-secondary text-text-primary">Session 2024-25</option>
                        </select>
                      </div>

                      <p className="text-xs text-text-secondary leading-relaxed">
                        Yearbook generation aggregates all session details: office bearers, technical hardware projects, guest lecture events, achievements, and gallery assets to compile a structured textual legacy report file.
                      </p>

                      <Button
                        variant="primary"
                        onClick={compileYearbook}
                        disabled={compiling}
                        className="w-full py-2.5"
                      >
                        {compiling ? "COMPILING SYSTEM LOGS..." : "COMPILE DIGITAL YEARBOOK (.TXT)"}
                      </Button>
                    </div>

                    {/* Console Output Panel */}
                    <div className="p-4 rounded-xl border border-card-border bg-bg-primary/70 h-64 overflow-y-auto space-y-1.5 text-left font-mono text-[9px] text-text-secondary">
                      <div className="flex items-center space-x-1.5 border-b border-card-border pb-1 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-accent animate-pulse" />
                        <span className="text-text-primary uppercase font-bold text-[8px]">COMPILER TERMINAL</span>
                      </div>
                      
                      {compileLogs.length === 0 ? (
                        <p className="italic text-text-primary/35">Compiler idle. Waiting for instructions...</p>
                      ) : (
                        compileLogs.map((log, index) => <p key={index}>{log}</p>)
                      )}

                      {yearbookSuccess && (
                        <p className="text-primary-accent font-bold mt-2">[SUCCESS] YEARBOOK GENERATED AND DOWNLOAD TRIGGERED.</p>
                      )}
                    </div>

                  </div>
                </Card>
              )}

              {/* TAB CONTENT: SYSTEM BACKUPS */}
              {activeTab === "backups" && (
                <Card hoverEffect={false} className="p-6 text-left space-y-6">
                  <h3 className="text-xs font-mono uppercase text-text-primary tracking-widest border-b border-card-border pb-3">
                    Institutional Database Exports
                  </h3>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    Download complete structured JSON backups of the society databases. These files can be easily re-imported by future committees to populate new database installations.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <Button variant="neon" size="sm" onClick={() => exportCollectionJSON("projects", projects)}>
                      Export Projects JSON
                    </Button>
                    <Button variant="neon" size="sm" onClick={() => exportCollectionJSON("events", events)}>
                      Export Events JSON
                    </Button>
                    <Button variant="neon" size="sm" onClick={() => exportCollectionJSON("sessions", sessions)}>
                      Export Leadership JSON
                    </Button>
                    <Button variant="neon" size="sm" onClick={() => exportCollectionJSON("alumni", alumni)}>
                      Export Alumni JSON
                    </Button>
                    <Button variant="neon" size="sm" onClick={() => exportCollectionJSON("resources", resources)}>
                      Export Resources JSON
                    </Button>
                    <Button variant="neon" size="sm" onClick={() => exportCollectionJSON("gallery", gallery)}>
                      Export Gallery JSON
                    </Button>
                  </div>
                </Card>
              )}

              {/* TAB CONTENT: CONTACT MESSAGES */}
              {activeTab === "contact_messages" && (
                <Card hoverEffect={false} className="p-6 text-left space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-card-border pb-4 gap-4">
                    <div>
                      <h3 className="text-xs font-mono uppercase text-text-primary tracking-widest">
                        Contact Form Messages
                      </h3>
                      <p className="text-[10px] text-text-secondary mt-1 uppercase font-mono">
                        Incoming queries and transmission requests from visitors
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={messageFilter}
                        onChange={(e) => setMessageFilter(e.target.value)}
                        className="bg-card-bg border border-card-border rounded-lg px-2.5 py-1.5 text-xs text-text-primary focus:outline-none cursor-pointer"
                      >
                        <option value="all" className="bg-bg-secondary text-text-primary">ALL MESSAGES</option>
                        <option value="unread" className="bg-bg-secondary text-text-primary">UNREAD</option>
                        <option value="read" className="bg-bg-secondary text-text-primary">READ</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Search queries..."
                        value={messageSearch}
                        onChange={(e) => setMessageSearch(e.target.value)}
                        className="bg-card-bg border border-card-border rounded-lg px-2.5 py-1.5 text-xs text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-primary-accent"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono text-text-secondary">
                      <thead>
                        <tr className="border-b border-card-border text-text-primary">
                          <th className="py-2.5 text-left">STATUS</th>
                          <th className="py-2.5 text-left">SENDER</th>
                          <th className="py-2.5 text-left">SUBJECT</th>
                          <th className="py-2.5 text-left">DATE</th>
                          <th className="py-2.5 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMessages.map((msg) => (
                          <tr 
                            key={msg.id} 
                            onClick={() => openMessageDetails(msg)}
                            className={`border-b border-card-border hover:bg-card-bg cursor-pointer transition-colors ${!msg.read ? 'bg-card-bg' : ''}`}
                          >
                            <td className="py-3">
                              {!msg.read ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-primary-accent text-black uppercase tracking-wider">
                                  New
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] bg-card-bg text-text-primary/40 uppercase tracking-wider">
                                  Read
                                </span>
                              )}
                            </td>
                            <td className="py-3">
                              <div className="font-bold text-text-primary">{msg.name}</div>
                              <div className="text-[10px] text-text-primary/50">{msg.email}</div>
                            </td>
                            <td className="py-3">
                              <div className="text-text-primary line-clamp-1 max-w-[240px] font-bold">{msg.subject}</div>
                              <div className="text-[10px] text-text-primary/40 line-clamp-1 max-w-[240px] mt-0.5">{msg.message}</div>
                            </td>
                            <td className="py-3 text-[10px] text-text-primary/60">
                              {new Date(msg.timestamp).toLocaleDateString()} {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </td>
                            <td className="py-3 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={() => openMessageDetails(msg)} 
                                className="p-1.5 text-primary-accent hover:text-text-primary transition-colors"
                                title="View Details"
                              >
                                <FileText className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => toggleMessageRead(msg)} 
                                className="p-1.5 text-text-primary/60 hover:text-text-primary transition-colors"
                                title={msg.read ? "Mark Unread" : "Mark Read"}
                              >
                                <Check className={`h-4 w-4 ${msg.read ? 'text-text-primary/40' : 'text-emerald-400'}`} />
                              </button>
                              <button 
                                onClick={() => handleDeleteMessage(msg.id)} 
                                className="p-1.5 text-rose-400 hover:text-text-primary transition-colors"
                                title="Delete message"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredMessages.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-text-primary/40">
                              NO INCOMING CONTACT TRANSMISSIONS FOUND.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

            </div>

          </div>

        </div>
      </main>

      {/* CRUD EDIT MODAL */}
      {editModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-xl max-h-[85vh] bg-bg-secondary border border-card-border rounded-2xl overflow-y-auto shadow-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => {
                setEditModalOpen(false);
                setEditingItem(null);
              }}
              className="absolute right-4 top-4 p-2 rounded-lg bg-card-bg border border-card-border text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-left space-y-5">
              <h3 className="text-sm font-mono uppercase text-text-primary tracking-widest border-b border-card-border pb-2">
                Log / Edit {editTargetCollection.toUpperCase()}
              </h3>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                
                {/* ID (Readonly) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-text-secondary">Record ID</label>
                  <input
                    type="text"
                    readOnly
                    value={editingItem.id}
                    className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary/50 focus:outline-none"
                  />
                </div>

                {/* Specific Fields for PROJECTS */}
                {editTargetCollection === "projects" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-primary-accent"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Sector *</label>
                      <select
                        value={editingItem.category}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-primary-accent"
                      >
                        <option value="robotics">Robotics</option>
                        <option value="iot">IoT</option>
                        <option value="embedded">Embedded</option>
                        <option value="ai-ml">AI & ML</option>
                        <option value="vlsi">VLSI</option>
                        <option value="communication">Communication</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Description Payload *</label>
                      <textarea
                        required
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-primary-accent h-24"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Technologies (Comma separated) *</label>
                        <input
                          type="text"
                          required
                          value={editingItem.technologies.join(", ")}
                          onChange={(e) => setEditingItem({ ...editingItem, technologies: e.target.value.split(",").map(t => t.trim()) })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Status *</label>
                        <select
                          value={editingItem.status}
                          onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        >
                          <option value="completed">Completed</option>
                          <option value="in-progress">In-Progress</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">GitHub Link</label>
                      <input
                        type="text"
                        value={editingItem.githubLink}
                        onChange={(e) => setEditingItem({ ...editingItem, githubLink: e.target.value })}
                        className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* Specific Fields for EVENTS */}
                {editTargetCollection === "events" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Event Title *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-primary-accent"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Category *</label>
                      <select
                        value={editingItem.category}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-primary-accent"
                      >
                        <option value="workshop">Workshop</option>
                        <option value="competition">Competition</option>
                        <option value="lecture">Guest Lecture</option>
                        <option value="visit">Industrial Visit</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Venue *</label>
                        <input
                          type="text"
                          required
                          value={editingItem.venue}
                          onChange={(e) => setEditingItem({ ...editingItem, venue: e.target.value })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Attendance count *</label>
                        <input
                          type="number"
                          required
                          value={editingItem.attendanceCount}
                          onChange={(e) => setEditingItem({ ...editingItem, attendanceCount: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Description Payload *</label>
                      <textarea
                        required
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-primary-accent h-24"
                      />
                    </div>
                  </>
                )}

                {/* Specific Fields for RESOURCES */}
                {editTargetCollection === "resources" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Material Title *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Semester *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="6"
                          value={editingItem.semester}
                          onChange={(e) => setEditingItem({ ...editingItem, semester: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Format *</label>
                        <select
                          value={editingItem.category}
                          onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        >
                          <option value="manuals">Lab Manual</option>
                          <option value="notes">Lecture Notes</option>
                          <option value="tutorials">Guides/Tutorials</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Description</label>
                      <textarea
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none h-20"
                      />
                    </div>
                  </>
                )}

                {/* Specific Fields for ALUMNI */}
                {editTargetCollection === "alumni" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Alumnus Name *</label>
                        <input
                          type="text"
                          required
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Passing Batch *</label>
                        <input
                          type="number"
                          required
                          value={editingItem.passingBatch}
                          onChange={(e) => setEditingItem({ ...editingItem, passingBatch: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Current Company *</label>
                        <input
                          type="text"
                          required
                          value={editingItem.currentCompany}
                          onChange={(e) => setEditingItem({ ...editingItem, currentCompany: e.target.value })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Current Role *</label>
                        <input
                          type="text"
                          required
                          value={editingItem.currentRole}
                          onChange={(e) => setEditingItem({ ...editingItem, currentRole: e.target.value })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Specific Fields for GALLERY */}
                {editTargetCollection === "gallery" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Photo Title *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Category *</label>
                        <select
                          value={editingItem.category}
                          onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        >
                          <option value="workshops">Workshops</option>
                          <option value="competitions">Competitions</option>
                          <option value="meetings">Meetings</option>
                          <option value="projects">Projects</option>
                          <option value="visits">Visits</option>
                          <option value="festivals">Festivals</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Session ID *</label>
                        <input
                          type="text"
                          required
                          value={editingItem.sessionId}
                          onChange={(e) => setEditingItem({ ...editingItem, sessionId: e.target.value })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Image URL *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.imageUrl}
                        onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* Specific Fields for TIC (FACULTY) */}
                {editTargetCollection === "tic" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Name *</label>
                        <input
                          type="text"
                          required
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Email *</label>
                        <input
                          type="email"
                          required
                          value={editingItem.email}
                          onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Designation *</label>
                        <input
                          type="text"
                          required
                          value={editingItem.designation}
                          onChange={(e) => setEditingItem({ ...editingItem, designation: e.target.value })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Qualification *</label>
                        <input
                          type="text"
                          required
                          value={editingItem.qualification}
                          onChange={(e) => setEditingItem({ ...editingItem, qualification: e.target.value })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Start Year *</label>
                        <input
                          type="number"
                          required
                          value={editingItem.startYear || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, startYear: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">End Year (Leave empty if present)</label>
                        <input
                          type="number"
                          value={editingItem.endYear || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, endYear: e.target.value ? parseInt(e.target.value) : null })}
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Photo URL *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.photoUrl}
                        onChange={(e) => setEditingItem({ ...editingItem, photoUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Biography *</label>
                      <textarea
                        required
                        value={editingItem.bio}
                        onChange={(e) => setEditingItem({ ...editingItem, bio: e.target.value })}
                        className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none h-24"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Welcome Message from TIC *</label>
                      <textarea
                        required
                        value={editingItem.message}
                        onChange={(e) => setEditingItem({ ...editingItem, message: e.target.value })}
                        className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none h-24"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Achievements (Comma separated)</label>
                      <input
                        type="text"
                        value={editingItem.achievements?.join(", ") || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, achievements: e.target.value.split(",").map(x => x.trim()).filter(Boolean) })}
                        placeholder="e.g. Winner of Researcher Award 2026, IEEE Senior Member"
                        className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Events Conducted (Comma separated)</label>
                      <input
                        type="text"
                        value={editingItem.eventsConducted?.join(", ") || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, eventsConducted: e.target.value.split(",").map(x => x.trim()).filter(Boolean) })}
                        placeholder="e.g. VLSI Boot camp, Python Hackathon"
                        className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Projects Guided (Comma separated)</label>
                      <input
                        type="text"
                        value={editingItem.projectsGuided?.join(", ") || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, projectsGuided: e.target.value.split(",").map(x => x.trim()).filter(Boolean) })}
                        placeholder="e.g. Autonomous Rover, IoT Smart Home"
                        className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* Specific Fields for SESSIONS */}
                {editTargetCollection === "sessions" && (() => {
                  const renderLeaderEditor = (label: string, leader: any, onChange: (updated: any) => void) => (
                    <div className="p-3.5 rounded-xl border border-card-border bg-card-bg space-y-2">
                      <span className="text-[10px] font-mono text-primary-accent uppercase tracking-wider block font-bold">{label}</span>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-text-secondary">Name *</label>
                          <input
                            type="text"
                            required
                            value={leader.name}
                            onChange={(e) => onChange({ ...leader, name: e.target.value })}
                            className="w-full px-3 py-1.5 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-primary-accent"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-text-secondary">Photo URL</label>
                          <input
                            type="text"
                            value={leader.photoUrl}
                            onChange={(e) => onChange({ ...leader, photoUrl: e.target.value })}
                            className="w-full px-3 py-1.5 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-text-secondary">Email</label>
                          <input
                            type="email"
                            value={leader.email}
                            onChange={(e) => onChange({ ...leader, email: e.target.value })}
                            className="w-full px-3 py-1.5 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-text-secondary">LinkedIn</label>
                          <input
                            type="text"
                            value={leader.linkedIn}
                            onChange={(e) => onChange({ ...leader, linkedIn: e.target.value })}
                            className="w-full px-3 py-1.5 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-text-secondary">Bio</label>
                        <textarea
                          value={leader.bio}
                          onChange={(e) => onChange({ ...leader, bio: e.target.value })}
                          className="w-full px-3 py-1.5 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none h-12 resize-none"
                        />
                      </div>
                    </div>
                  );

                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase text-text-secondary">Session ID (e.g. 2026-27) *</label>
                          <input
                            type="text"
                            required
                            value={editingItem.id}
                            onChange={(e) => setEditingItem({ ...editingItem, id: e.target.value })}
                            className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-primary-accent"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase text-text-secondary">TIC Name *</label>
                          <input
                            type="text"
                            required
                            value={editingItem.ticName}
                            onChange={(e) => setEditingItem({ ...editingItem, ticName: e.target.value })}
                            className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-primary-accent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase text-text-secondary">Start Year *</label>
                          <input
                            type="number"
                            required
                            value={editingItem.startYear}
                            onChange={(e) => setEditingItem({ ...editingItem, startYear: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-primary-accent"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase text-text-secondary">End Year *</label>
                          <input
                            type="number"
                            required
                            value={editingItem.endYear}
                            onChange={(e) => setEditingItem({ ...editingItem, endYear: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-primary-accent"
                          />
                        </div>
                      </div>

                      {/* Modal Sub-tabs */}
                      <div className="flex border-b border-card-border pb-2 mb-4 space-x-1 overflow-x-auto">
                        {[
                          { id: "officers", label: "Officers" },
                          { id: "robotics", label: "Robotics Team" },
                          { id: "content", label: "Content Team" },
                          { id: "execs", label: "Executives" },
                          { id: "members", label: "Members" }
                        ].map((stab) => (
                          <button
                            key={stab.id}
                            type="button"
                            onClick={() => setModalSubTab(stab.id)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-colors ${
                              modalSubTab === stab.id
                                ? "bg-primary-accent text-black font-bold"
                                : "bg-card-bg text-text-secondary hover:text-text-primary"
                            }`}
                          >
                            {stab.label}
                          </button>
                        ))}
                      </div>

                      {/* OFFICERS SUB-TAB */}
                      {modalSubTab === "officers" && (
                        <div className="space-y-4">
                          {renderLeaderEditor("President", editingItem.president, (updated) =>
                            setEditingItem({ ...editingItem, president: updated })
                          )}
                          {renderLeaderEditor("Vice President", editingItem.vicePresident, (updated) =>
                            setEditingItem({ ...editingItem, vicePresident: updated })
                          )}
                          {renderLeaderEditor("Secretary", editingItem.secretary, (updated) =>
                            setEditingItem({ ...editingItem, secretary: updated })
                          )}
                          {renderLeaderEditor("Joint Secretary", editingItem.jointSecretary, (updated) =>
                            setEditingItem({ ...editingItem, jointSecretary: updated })
                          )}
                          {renderLeaderEditor("Treasurer", editingItem.treasurer, (updated) =>
                            setEditingItem({ ...editingItem, treasurer: updated })
                          )}
                        </div>
                      )}

                      {/* ROBOTICS SUB-TAB */}
                      {modalSubTab === "robotics" && (
                        <div className="space-y-4">
                          {renderLeaderEditor("Robotics Head 1", editingItem.roboticsHeads[0], (updated) => {
                            const newHeads = [...editingItem.roboticsHeads];
                            newHeads[0] = updated;
                            setEditingItem({ ...editingItem, roboticsHeads: newHeads });
                          })}
                          {renderLeaderEditor("Robotics Head 2", editingItem.roboticsHeads[1], (updated) => {
                            const newHeads = [...editingItem.roboticsHeads];
                            newHeads[1] = updated;
                            setEditingItem({ ...editingItem, roboticsHeads: newHeads });
                          })}
                          {renderLeaderEditor("Robotics Co-Head 1", editingItem.roboticsCoHeads[0], (updated) => {
                            const newCos = [...editingItem.roboticsCoHeads];
                            newCos[0] = updated;
                            setEditingItem({ ...editingItem, roboticsCoHeads: newCos });
                          })}
                          {renderLeaderEditor("Robotics Co-Head 2", editingItem.roboticsCoHeads[1], (updated) => {
                            const newCos = [...editingItem.roboticsCoHeads];
                            newCos[1] = updated;
                            setEditingItem({ ...editingItem, roboticsCoHeads: newCos });
                          })}
                        </div>
                      )}

                      {/* CONTENT SUB-TAB */}
                      {modalSubTab === "content" && (
                        <div className="space-y-4">
                          {renderLeaderEditor("Content Head", editingItem.contentHead, (updated) =>
                            setEditingItem({ ...editingItem, contentHead: updated })
                          )}
                          {renderLeaderEditor("Content Co-Head", editingItem.contentCoHead, (updated) =>
                            setEditingItem({ ...editingItem, contentCoHead: updated })
                          )}
                        </div>
                      )}

                      {/* EXECS SUB-TAB */}
                      {modalSubTab === "execs" && (
                        <div className="space-y-4">
                          <h5 className="text-[10px] font-mono uppercase text-text-secondary tracking-wider border-b border-card-border pb-1">Senior Executives (x4)</h5>
                          {editingItem.seniorExecutives.map((exec: any, idx: number) => (
                            <div key={`sr-${idx}`}>
                              {renderLeaderEditor(`Senior Executive ${idx + 1}`, exec, (updated) => {
                                const newExecs = [...editingItem.seniorExecutives];
                                newExecs[idx] = updated;
                                setEditingItem({ ...editingItem, seniorExecutives: newExecs });
                              })}
                            </div>
                          ))}
                          <h5 className="text-[10px] font-mono uppercase text-text-secondary tracking-wider border-b border-card-border pb-1 pt-4">Junior Executives (x4)</h5>
                          {editingItem.juniorExecutives.map((exec: any, idx: number) => (
                            <div key={`jr-${idx}`}>
                              {renderLeaderEditor(`Junior Executive ${idx + 1}`, exec, (updated) => {
                                const newExecs = [...editingItem.juniorExecutives];
                                newExecs[idx] = updated;
                                setEditingItem({ ...editingItem, juniorExecutives: newExecs });
                              })}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* MEMBERS SUB-TAB */}
                      {modalSubTab === "members" && (
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono uppercase text-text-secondary">Regular Members (Comma separated) *</label>
                            <textarea
                              required
                              value={editingItem.members.join(", ")}
                              onChange={(e) => setEditingItem({
                                ...editingItem,
                                members: e.target.value.split(",").map(m => m.trim()).filter(Boolean)
                              })}
                              placeholder="e.g. Raghav Gupta, Sneha Bansal, Dhruv Taneja"
                              className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary focus:outline-none h-32"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <Button type="submit" variant="primary" className="w-full py-2.5 mt-4">
                  Commit Sync to Database
                </Button>

              </form>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT MESSAGE DETAIL MODAL */}
      {messageModalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-lg bg-bg-secondary border border-card-border rounded-2xl overflow-y-auto shadow-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => {
                setMessageModalOpen(false);
                setSelectedMessage(null);
              }}
              className="absolute right-4 top-4 p-2 rounded-lg bg-card-bg border border-card-border text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-left space-y-5">
              <h3 className="text-sm font-mono uppercase text-text-primary tracking-widest border-b border-card-border pb-2">
                Transmission Details
              </h3>

              <div className="space-y-4 text-xs font-mono text-text-secondary">
                <div>
                  <span className="text-[10px] text-text-primary/40 block uppercase">Sender Name</span>
                  <span className="text-sm font-bold text-text-primary">{selectedMessage.name}</span>
                </div>

                <div>
                  <span className="text-[10px] text-text-primary/40 block uppercase">Email Coordinates</span>
                  <a href={`mailto:${selectedMessage.email}`} className="text-primary-accent hover:underline text-sm block mt-0.5">
                    {selectedMessage.email}
                  </a>
                </div>

                <div>
                  <span className="text-[10px] text-text-primary/40 block uppercase">Timestamp</span>
                  <span className="text-text-primary block mt-0.5">
                    {new Date(selectedMessage.timestamp).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-text-primary/40 block uppercase">Subject</span>
                  <span className="text-text-primary font-bold block mt-0.5">{selectedMessage.subject}</span>
                </div>

                <div>
                  <span className="text-[10px] text-text-primary/40 block uppercase">Message Payload</span>
                  <div className="p-3 bg-card-bg border border-card-border rounded-lg text-text-primary whitespace-pre-wrap font-sans leading-relaxed text-xs max-h-48 overflow-y-auto mt-1">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-card-border">
                <Button
                  variant="primary"
                  className="flex-1 py-2 text-xs"
                  onClick={() => {
                    window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`;
                  }}
                >
                  Compose Reply
                </Button>
                <Button
                  variant="outline"
                  className="px-4 py-2 text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedMessage.email);
                    alert("Email copied to clipboard!");
                  }}
                >
                  Copy Email
                </Button>
                <Button
                  variant="outline"
                  className="px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-text-primary border border-rose-500/10"
                  onClick={() => {
                    handleDeleteMessage(selectedMessage.id);
                    setMessageModalOpen(false);
                    setSelectedMessage(null);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
