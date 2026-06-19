"use client";

import React, { useState, useEffect } from "react";
import PCBBackground from "@/components/effects/PCBBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fetchResources, saveItem } from "@/lib/firebase";
import { Resource } from "@/lib/data-mock";
import { Search, Download, BookOpen, FileSpreadsheet, HardDrive, Terminal } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Formats" },
  { id: "manuals", label: "Lab Manuals" },
  { id: "notes", label: "Lecture Notes" },
  { id: "tutorials", label: "VHDL/FPGA Guides" },
  { id: "papers", label: "Research Papers" },
];

const SEMESTERS = ["All Semesters", "Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6"];

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState(0); // 0 corresponds to All
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchResources();
        setResources(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDownload = async (resourceId: string) => {
    // Find target resource
    const res = resources.find(r => r.id === resourceId);
    if (!res) return;

    // Increment count
    const updatedRes = { ...res, downloadCount: (res.downloadCount || 0) + 1 };
    
    // Save to local database state
    const success = await saveItem("resources", updatedRes);
    if (success) {
      setResources(prev => prev.map(r => r.id === resourceId ? updatedRes : r));
    }
  };

  const filteredResources = resources.filter((res) => {
    const matchesCategory = selectedCategory === "all" || res.category === selectedCategory;
    const matchesSemester = selectedSemester === 0 || res.semester === selectedSemester;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.subjectCode && res.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSemester && matchesSearch;
  });

  return (
    <>
      <PCBBackground />
      <Navbar />

      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Title */}
          <div className="space-y-4 text-center mb-12">
            <h1 className="text-xs font-mono uppercase tracking-widest text-primary-accent">
              ACADEMIC REPOSITORY
            </h1>
            <h2 className="text-4xl font-extrabold tracking-tight font-display text-text-primary">
              Student Resources
            </h2>
            <div className="w-12 h-1 bg-primary-accent mx-auto rounded-full mt-2" />
          </div>

          {/* Filters & Inputs Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-12">
            
            {/* Left: Search input */}
            <div className="lg:col-span-5 relative w-full">
              <input
                suppressHydrationWarning
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject codes, syllabus titles..."
                className="w-full pl-11 pr-4 py-3 bg-card-bg border border-card-border rounded-xl text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent transition-all"
              />
              <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-text-secondary" />
            </div>

            {/* Center: Semester selector */}
            <div className="lg:col-span-3 w-full">
              <select
                suppressHydrationWarning
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-card-bg border border-card-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary-accent cursor-pointer"
              >
                {SEMESTERS.map((sem, idx) => (
                  <option key={idx} value={idx} className="bg-bg-secondary text-text-primary">
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Right: Category filters */}
            <div className="lg:col-span-4 flex flex-wrap gap-2 justify-center lg:justify-end">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[9px] uppercase tracking-wider transition-all ${
                    selectedCategory === cat.id
                      ? "bg-primary-accent text-black font-semibold"
                      : "bg-card-bg text-text-secondary border border-card-border hover:bg-card-bg-hover"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>

          {/* Academic Resource Table / List view */}
          {loading ? (
            <div className="text-center py-20 text-xs font-mono text-text-secondary animate-pulse">
              RESOLVING SYLLABUS DIRECTORY...
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-card-border rounded-2xl">
              <p className="text-xs font-mono text-text-secondary uppercase">No files logged under this search index.</p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {filteredResources.map((res) => (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl border border-card-border bg-card-bg hover:border-primary-accent/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left"
                >
                  {/* Left Column: Icons & Titles */}
                  <div className="flex items-start space-x-4 max-w-2xl">
                    <div className="p-3 rounded-xl bg-card-bg border border-card-border text-primary-accent shrink-0">
                      {res.category === "manuals" ? (
                        <FileSpreadsheet className="h-5 w-5" />
                      ) : res.category === "notes" ? (
                        <BookOpen className="h-5 w-5" />
                      ) : res.category === "tutorials" ? (
                        <Terminal className="h-5 w-5" />
                      ) : (
                        <HardDrive className="h-5 w-5" />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] font-mono text-primary-accent uppercase tracking-wider">
                          {res.category}
                        </span>
                        <span className="text-text-secondary/25 text-[10px]">|</span>
                        <span className="text-[9px] font-mono text-text-secondary uppercase tracking-wider">
                          Sem {res.semester}
                        </span>
                        {res.subjectCode && (
                          <>
                            <span className="text-text-secondary/25 text-[10px]">|</span>
                            <span className="px-1.5 py-0.5 rounded bg-card-bg border border-card-border text-[9px] font-mono text-text-primary">
                              {res.subjectCode}
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-text-primary tracking-tight leading-normal">
                        {res.title}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {res.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Download parameters */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 gap-4 pt-4 md:pt-0 border-t border-card-border md:border-t-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-mono text-text-secondary">Downloads:</span>
                      <span className="block text-xs font-bold text-text-primary font-mono">{res.downloadCount || 0}</span>
                    </div>

                    <a
                      href={res.fileUrl}
                      onClick={() => handleDownload(res.id)}
                      className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-card-bg border border-card-border text-xs font-mono font-medium tracking-wider uppercase text-text-primary hover:border-primary-accent hover:text-primary-accent hover:bg-card-bg-hover hover:shadow-[0_0_15px_rgba(215,255,0,0.25)] transition-all"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </a>
                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
