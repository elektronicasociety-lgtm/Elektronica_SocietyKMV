"use client";

import React, { useState, useEffect } from "react";
import PCBBackground from "@/components/effects/PCBBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fetchAlumni, saveItem } from "@/lib/firebase";
import { Alumnus } from "@/lib/data-mock";
import { Search, Globe, Briefcase, Award, X, Sparkles, CheckCircle2 } from "lucide-react";

export default function Alumni() {
  const [alumni, setAlumni] = useState<Alumnus[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [formBatch, setFormBatch] = useState("");
  const [formPositions, setFormPositions] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formLinkedIn, setFormLinkedIn] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formAchievements, setFormAchievements] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAlumni();
        setAlumni(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredAlumni = alumni.filter((a) => {
    const query = searchQuery.toLowerCase();
    return (
      a.name.toLowerCase().includes(query) ||
      a.passingBatch.toString().includes(query) ||
      a.currentCompany.toLowerCase().includes(query) ||
      a.currentRole.toLowerCase().includes(query) ||
      a.positionsHeld.some(pos => pos.toLowerCase().includes(query))
    );
  });

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formBatch || !formLinkedIn) return;

    const newAlumnus: Alumnus = {
      id: `alum-${Date.now()}`,
      name: formName,
      passingBatch: parseInt(formBatch),
      positionsHeld: formPositions.split(",").map(p => p.trim()),
      currentCompany: formCompany || "Self-Employed",
      currentRole: formRole || "Consultant",
      linkedIn: formLinkedIn,
      email: formEmail,
      photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop", // placeholder profile
      achievements: formAchievements ? formAchievements.split(",").map(a => a.trim()) : [],
    };

    // Save with approved: false for moderation
    const success = await saveItem("alumni", { ...newAlumnus, approved: false });
    if (success) {
      setFormSuccess(true);
      setFormName("");
      setFormBatch("");
      setFormPositions("");
      setFormCompany("");
      setFormRole("");
      setFormLinkedIn("");
      setFormEmail("");
      setFormAchievements("");
      setTimeout(() => {
        setFormSuccess(false);
        setRegisterModalOpen(false);
      }, 3000);
    }
  };

  return (
    <>
      <PCBBackground />
      <Navbar />

      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Title */}
          <div className="space-y-4 text-center mb-12">
            <h1 className="text-xs font-mono uppercase tracking-widest text-primary-accent">
              LEGACY ALUMNI NETWORK
            </h1>
            <h2 className="text-4xl font-extrabold tracking-tight font-display text-text-primary">
              Alumni Directory
            </h2>
            <p className="text-xs text-text-secondary font-mono leading-relaxed max-w-md mx-auto">
              Meet our graduates who have launched careers in major technology corporations and research centers.
            </p>
            <div className="w-12 h-1 bg-primary-accent mx-auto rounded-full mt-2" />
          </div>

          {/* Action Row: Search & Register CTA */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 max-w-4xl mx-auto">
            {/* Search Input */}
            <div className="w-full md:max-w-md relative">
              <input
                suppressHydrationWarning
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alumni by name, batch, role, or company..."
                className="w-full pl-11 pr-4 py-3 bg-card-bg border border-card-border rounded-xl text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent/30 transition-all"
              />
              <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-text-secondary" />
            </div>

            {/* Registration CTA button */}
            <Button
              variant="neon"
              onClick={() => setRegisterModalOpen(true)}
              className="w-full md:w-auto"
            >
              Register in Directory
            </Button>
          </div>

          {/* Directory Grid */}
          {loading ? (
            <div className="text-center py-20 text-xs font-mono text-text-secondary animate-pulse">
              RESOLVING ALUMNI VECTOR NODES...
            </div>
          ) : filteredAlumni.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-card-border rounded-2xl">
              <p className="text-xs font-mono text-text-secondary uppercase">No alumni match the search parameters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAlumni.map((alum) => (
                <Card
                  key={alum.id}
                  hoverEffect={true}
                  className="flex flex-col justify-between"
                >
                  <div className="space-y-4 text-left">
                    {/* Upper profile header */}
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-card-border">
                        <img src={alum.photoUrl} alt={alum.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-text-primary tracking-tight">{alum.name}</h3>
                        <p className="text-[10px] font-mono text-text-secondary uppercase">Batch of {alum.passingBatch}</p>
                      </div>
                    </div>

                    {/* Positions Held */}
                    <div className="flex flex-wrap gap-1">
                      {alum.positionsHeld.map((pos, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-card-bg text-[9px] font-mono text-primary-accent">
                          {pos}
                        </span>
                      ))}
                    </div>

                    {/* Current Employment */}
                    <div className="flex items-start space-x-3 p-3 rounded-xl bg-card-bg border border-card-border text-xs text-text-secondary">
                      <Briefcase className="h-4 w-4 text-primary-accent shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-text-primary">{alum.currentRole}</span>
                        <span className="block text-[10px] font-mono text-text-secondary">{alum.currentCompany}</span>
                      </div>
                    </div>

                    {/* Achievements */}
                    {alum.achievements && alum.achievements.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-[9px] font-mono uppercase text-text-secondary tracking-wider flex items-center space-x-1.5">
                          <Award className="h-3 w-3 text-primary-accent" />
                          <span>Key Legacies</span>
                        </h4>
                        <ul className="space-y-1 list-disc pl-4 text-[11px] text-text-secondary">
                          {alum.achievements.map((ach, idx) => (
                            <li key={idx}>{ach}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* LinkedIn link */}
                  <div className="mt-6 pt-4 border-t border-card-border flex items-center justify-between">
                    <a
                      href={alum.linkedIn}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs text-text-secondary hover:text-primary-accent transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      <span className="font-mono text-[10px]">LinkedIn Connection</span>
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* ALUMNI REGISTRATION OVERLAY MODAL */}
          {registerModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div
                className="w-full max-w-lg max-h-[85vh] bg-bg-secondary border border-card-border rounded-2xl overflow-y-auto shadow-2xl p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close trigger */}
                <button
                  suppressHydrationWarning
                  onClick={() => setRegisterModalOpen(false)}
                  className="absolute right-4 top-4 p-2 rounded-lg bg-card-bg border border-card-border text-text-secondary hover:text-text-primary hover:bg-card-bg-hover transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="text-left space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-text-primary flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-primary-accent" />
                      <span>Alumni Portal Enrollment</span>
                    </h3>
                    <p className="text-[10px] text-text-secondary font-mono">
                      Submissions are stored for department admin authorization before inclusion in the directory.
                    </p>
                  </div>

                  {formSuccess ? (
                    <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                      <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                      <h4 className="text-sm font-bold text-text-primary">Enrollment Registered</h4>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Your record has been logged. Our society committee will authorize your listing shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitRegistration} className="space-y-4">
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase text-text-secondary">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="e.g. Tanmay Singhal"
                            className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-primary-accent"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase text-text-secondary">Passing Batch *</label>
                          <input
                            type="number"
                            required
                            value={formBatch}
                            onChange={(e) => setFormBatch(e.target.value)}
                            placeholder="e.g. 2025"
                            className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-primary-accent"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Positions Held in Society</label>
                        <input
                          type="text"
                          value={formPositions}
                          onChange={(e) => setFormPositions(e.target.value)}
                          placeholder="e.g. President (2024-25), Core Member (2023-24)"
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-primary-accent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase text-text-secondary">Current Company / Org</label>
                          <input
                            type="text"
                            value={formCompany}
                            onChange={(e) => setFormCompany(e.target.value)}
                            placeholder="e.g. Intel"
                            className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-primary-accent"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase text-text-secondary">Current Role</label>
                          <input
                            type="text"
                            value={formRole}
                            onChange={(e) => setFormRole(e.target.value)}
                            placeholder="e.g. Hardware Engineer"
                            className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-primary-accent"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">LinkedIn Profile URL *</label>
                        <input
                          type="url"
                          required
                          value={formLinkedIn}
                          onChange={(e) => setFormLinkedIn(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-primary-accent"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Email Address</label>
                        <input
                          type="email"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          placeholder="name@email.com"
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-primary-accent"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Achievements / Legacies (Comma separated)</label>
                        <textarea
                          value={formAchievements}
                          onChange={(e) => setFormAchievements(e.target.value)}
                          placeholder="e.g. Scored 10 CGPA, Designed optical sensor node"
                          className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-primary-accent h-20 resize-none"
                        />
                      </div>

                      <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
                        Submit Enrollment Data
                      </Button>
                    </form>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
