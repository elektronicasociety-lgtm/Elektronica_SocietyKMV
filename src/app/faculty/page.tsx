"use client";

import React, { useState, useEffect } from "react";
import PCBBackground from "@/components/effects/PCBBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { fetchTICRecords } from "@/lib/firebase";
import { TICRecord } from "@/lib/data-mock";
import { Mail, GraduationCap, Award, Calendar, BookOpen, ChevronRight, FileText } from "lucide-react";

export default function FacultyLeadership() {
  const [tics, setTics] = useState<TICRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePastId, setActivePastId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const records = await fetchTICRecords();
        setTics(records);
        // Set first archived TIC as default open for past archive details
        const past = records.filter(r => r.endYear !== null);
        if (past.length > 0) {
          setActivePastId(past[0].id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const currentTIC = tics.find(t => t.endYear === null);
  const pastTICs = tics.filter(t => t.endYear !== null);
  const activePastTIC = pastTICs.find(t => t.id === activePastId);

  return (
    <>
      <PCBBackground />
      <Navbar />

      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Title */}
          <div className="space-y-4 text-center mb-16">
            <h1 className="text-xs font-mono uppercase tracking-widest text-primary-accent">
              FACULTY COGNIZANCE
            </h1>
            <h2 className="text-4xl font-extrabold tracking-tight font-display text-text-primary">
              Teacher-In-Charge Records
            </h2>
            <p className="text-xs text-text-secondary font-mono">
              Honoring the leaders who guide the technical paths of our society.
            </p>
            <div className="w-12 h-1 bg-primary-accent mx-auto rounded-full mt-2" />
          </div>

          {loading ? (
            <div className="text-center py-20 text-xs font-mono text-text-secondary animate-pulse">
              LOADING FACULTY MATRIX...
            </div>
          ) : (
            <div className="space-y-20">
              
              {/* CURRENT TEACHER IN CHARGE */}
              {currentTIC && (
                <div className="space-y-8">
                  <h3 className="text-lg font-mono uppercase tracking-wider text-primary-accent flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-primary-accent animate-ping" />
                    <span>Current Teacher-In-Charge</span>
                  </h3>
                  
                  <Card hoverEffect={false} className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left side Image & Contact */}
                      <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
                        <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-primary-accent/40 shadow-lg shadow-primary-accent/5">
                          <img
                            src={currentTIC.photoUrl}
                            alt={currentTIC.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-text-primary tracking-tight">{currentTIC.name}</h4>
                          <p className="text-xs text-primary-accent font-mono mt-1">{currentTIC.designation}</p>
                        </div>
                        
                        {/* Meta tags */}
                        <div className="w-full space-y-2.5 pt-4 text-left border-t border-card-border">
                          <div className="flex items-center space-x-3 text-xs text-text-secondary">
                            <GraduationCap className="h-4 w-4 text-primary-accent shrink-0" />
                            <span>{currentTIC.qualification}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-text-secondary">
                            <Mail className="h-4 w-4 text-primary-accent shrink-0" />
                            <a href={`mailto:${currentTIC.email}`} className="hover:text-text-primary transition-colors">{currentTIC.email}</a>
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-text-secondary">
                            <Calendar className="h-4 w-4 text-primary-accent shrink-0" />
                            <span>Active since {currentTIC.startYear}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right side Profile details */}
                      <div className="lg:col-span-8 space-y-6">
                        {/* Welcome Message */}
                        <div className="p-5 rounded-xl bg-card-bg border border-card-border relative">
                          <div className="absolute top-3 left-4 text-3xl text-primary-accent/20 font-serif leading-none">“</div>
                          <p className="text-sm italic text-text-secondary pl-4 leading-relaxed relative z-10">
                            {currentTIC.message}
                          </p>
                          <div className="absolute bottom-1 right-4 text-3xl text-primary-accent/20 font-serif leading-none">”</div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                          <h5 className="text-xs font-mono uppercase tracking-wider text-text-primary">Profile Bio</h5>
                          <p className="text-xs text-text-secondary leading-relaxed">{currentTIC.bio}</p>
                        </div>

                        {/* Achievements / Conducting */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          <div className="space-y-3">
                            <h5 className="text-xs font-mono uppercase tracking-wider text-text-primary flex items-center space-x-2">
                              <Award className="h-4 w-4 text-primary-accent" />
                              <span>Key Focus Areas</span>
                            </h5>
                            <ul className="space-y-2">
                              {currentTIC.achievements.map((item, index) => (
                                <li key={index} className="text-xs text-text-secondary flex items-start space-x-2">
                                  <span className="text-primary-accent mt-0.5">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-3">
                            <h5 className="text-xs font-mono uppercase tracking-wider text-text-primary flex items-center space-x-2">
                              <BookOpen className="h-4 w-4 text-primary-accent" />
                              <span>Guided Projects</span>
                            </h5>
                            <ul className="space-y-2">
                              {currentTIC.projectsGuided.map((item, index) => (
                                <li key={index} className="text-xs text-text-secondary flex items-start space-x-2">
                                  <span className="text-primary-accent mt-0.5">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                      </div>

                    </div>
                  </Card>
                </div>
              )}
                        {/* PAST LEADERSHIP ARCHIVE */}
              {pastTICs.length > 0 && (
                <div className="space-y-8">
                  <h3 className="text-lg font-mono uppercase tracking-wider text-text-primary flex items-center space-x-2 border-b border-card-border pb-4">
                    <span>Faculty Leadership Timeline</span>
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Timeline Rows */}
                    <div className="lg:col-span-5 space-y-3">
                      {pastTICs.map((past) => {
                        const isActive = past.id === activePastId;
                        return (
                          <div
                            key={past.id}
                            onClick={() => setActivePastId(past.id)}
                            className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                              isActive
                                ? "bg-primary-accent/5 border-primary-accent shadow-md shadow-primary-accent/5"
                                : "bg-card-bg border-card-border hover:border-text-secondary/30"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                <img src={past.photoUrl} alt={past.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="text-left">
                                <h4 className="text-xs font-bold text-text-primary">{past.name}</h4>
                                <p className="text-[10px] text-text-secondary font-mono mt-0.5">
                                  Session: {past.startYear} - {past.endYear}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className={`h-4 w-4 transition-transform ${
                              isActive ? "text-primary-accent translate-x-1" : "text-text-secondary"
                            }`} />
                          </div>
                        );
                      })}
                    </div>                      {/* Right Timeline Detail Panel */}
                    <div className="lg:col-span-7">
                      {activePastTIC ? (
                        <Card hoverEffect={false} className="p-6 space-y-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-card-border">
                              <img src={activePastTIC.photoUrl} alt={activePastTIC.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left">
                              <h4 className="text-lg font-bold text-text-primary">{activePastTIC.name}</h4>
                              <p className="text-xs text-primary-accent font-mono">{activePastTIC.qualification}</p>
                              <p className="text-[10px] text-text-secondary font-mono mt-0.5">
                                Term: {activePastTIC.startYear} - {activePastTIC.endYear} (Teacher-In-Charge)
                              </p>
                            </div>
                          </div>
 
                          <div className="space-y-2">
                            <h5 className="text-xs font-mono uppercase tracking-wider text-text-primary">Historical Bio</h5>
                            <p className="text-xs text-text-secondary leading-relaxed">{activePastTIC.bio}</p>
                          </div>
 
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-card-border">
                            <div className="space-y-2">
                              <h5 className="text-xs font-mono uppercase tracking-wider text-text-primary flex items-center space-x-1">
                                <Award className="h-3.5 w-3.5 text-primary-accent" />
                                <span>Achievements</span>
                              </h5>
                              <ul className="space-y-1.5">
                                {activePastTIC.achievements.map((item, idx) => (
                                  <li key={idx} className="text-xs text-text-secondary flex items-start space-x-1.5">
                                    <span className="text-primary-accent mt-1 text-[8px]">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
 
                            <div className="space-y-2">
                              <h5 className="text-xs font-mono uppercase tracking-wider text-text-primary flex items-center space-x-1">
                                <FileText className="h-3.5 w-3.5 text-primary-accent" />
                                <span>Conducted Events</span>
                              </h5>
                              <ul className="space-y-1.5">
                                {activePastTIC.eventsConducted.map((item, idx) => (
                                  <li key={idx} className="text-xs text-text-secondary flex items-start space-x-1.5">
                                    <span className="text-primary-accent mt-1 text-[8px]">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </Card>
                      ) : (
                        <div className="p-10 border border-dashed border-card-border rounded-2xl text-center text-xs font-mono text-text-secondary">
                          SELECT A HISTORICAL RECORD FROM THE TIMELINE
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
