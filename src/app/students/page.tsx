"use client";

import React, { useState, useEffect } from "react";
import PCBBackground from "@/components/effects/PCBBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fetchSessions } from "@/lib/firebase";
import { SessionRecord, StudentLeader } from "@/lib/data-mock";
import { Mail, Globe, Calendar, Trophy, Cpu, ChevronDown, ChevronUp, FileCode, Users, BookOpen } from "lucide-react";

export default function StudentLeadership() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchSessions();
        setSessions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sort sessions: Current one (e.g., 2026-27) is the highest year
  const sortedSessions = [...sessions].sort((a, b) => b.startYear - a.startYear);
  const currentSession = sortedSessions[0];
  const legacySessions = sortedSessions.slice(1);

  const toggleSession = (id: string) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  // Helper component to render a Student Leader Card
  const LeaderCard = ({ leader, size = "md" }: { leader: StudentLeader; size?: "lg" | "md" | "sm" }) => (
    <Card hoverEffect={true} className="flex flex-col h-full">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className={`relative rounded-xl overflow-hidden border border-card-border ${
          size === "lg" ? "w-32 h-32" : size === "md" ? "w-24 h-24" : "w-16 h-16"
        }`}>
          <img src={leader.photoUrl} alt={leader.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-text-primary tracking-tight">{leader.name}</h4>
          <p className="text-[10px] text-primary-accent font-mono uppercase tracking-wider mt-0.5">{leader.role}</p>
        </div>
        <p className="text-[11px] text-text-secondary leading-relaxed max-w-xs px-2 line-clamp-3">
          {leader.bio}
        </p>
        <div className="flex space-x-2 pt-2 border-t border-card-border w-full justify-center">
          <a href={leader.linkedIn} target="_blank" rel="noreferrer" className="p-1.5 rounded bg-card-bg text-text-secondary hover:text-primary-accent hover:bg-card-bg-hover transition-colors">
            <Globe className="h-3.5 w-3.5" />
          </a>
          <a href={`mailto:${leader.email}`} className="p-1.5 rounded bg-card-bg text-text-secondary hover:text-primary-accent hover:bg-card-bg-hover transition-colors">
            <Mail className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </Card>
  );

  return (
    <>
      <PCBBackground />
      <Navbar />

      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Title */}
          <div className="space-y-4 text-center mb-16">
            <h1 className="text-xs font-mono uppercase tracking-widest text-primary-accent">
              STUDENT EXECUTIVE COUNCIL
            </h1>
            <h2 className="text-4xl font-extrabold tracking-tight font-display text-text-primary">
              Society Leadership
            </h2>
            <div className="w-12 h-1 bg-primary-accent mx-auto rounded-full mt-2" />
          </div>

          {loading ? (
            <div className="text-center py-20 text-xs font-mono text-text-secondary animate-pulse">
              LOADING COUNCIL REGISTERS...
            </div>
          ) : (
            <div className="space-y-20">
              
              {/* CURRENT EXECUTIVE TEAM */}
              {currentSession && (
                <div className="space-y-12">
                  <div className="text-center">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-primary-accent">
                      Session {currentSession.id}
                    </h3>
                    <p className="text-xl font-bold tracking-tight text-text-primary mt-1">
                      Current Office Bearers
                    </p>
                  </div>

                  {/* Top Tier: President & Vice President */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {currentSession.president && <LeaderCard leader={currentSession.president} size="lg" />}
                    {currentSession.vicePresident && <LeaderCard leader={currentSession.vicePresident} size="lg" />}
                  </div>

                  {/* Mid Tier: Secretary, Joint Secretary & Treasurer */}
                  <div className={`grid grid-cols-1 ${currentSession.jointSecretary ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 max-w-4xl mx-auto`}>
                    {currentSession.secretary && <LeaderCard leader={currentSession.secretary} size="md" />}
                    {currentSession.jointSecretary && <LeaderCard leader={currentSession.jointSecretary} size="md" />}
                    {currentSession.treasurer && <LeaderCard leader={currentSession.treasurer} size="md" />}
                  </div>

                  {/* Robotics Heads & Content Head */}
                  {(currentSession.roboticsHeads || currentSession.contentHead) && (
                    <div className="space-y-6">
                      <h4 className="text-xs font-mono text-text-secondary uppercase tracking-widest text-center">
                        Heads
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentSession.roboticsHeads?.map((leader, idx) => (
                          <LeaderCard key={`rob-head-${idx}`} leader={leader} size="sm" />
                        ))}
                        {currentSession.contentHead && (
                          <LeaderCard leader={currentSession.contentHead} size="sm" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Robotics Co-Heads & Content Co-Head */}
                  {(currentSession.roboticsCoHeads || currentSession.contentCoHead) && (
                    <div className="space-y-6">
                      <h4 className="text-xs font-mono text-text-secondary uppercase tracking-widest text-center">
                        Co-Heads
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentSession.roboticsCoHeads?.map((leader, idx) => (
                          <LeaderCard key={`rob-co-${idx}`} leader={leader} size="sm" />
                        ))}
                        {currentSession.contentCoHead && (
                          <LeaderCard leader={currentSession.contentCoHead} size="sm" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Senior Executives */}
                  {currentSession.seniorExecutives && currentSession.seniorExecutives.length > 0 && (
                    <div className="space-y-6">
                      <h4 className="text-xs font-mono text-text-secondary uppercase tracking-widest text-center">
                        Senior Executives
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {currentSession.seniorExecutives.map((leader, idx) => (
                          <LeaderCard key={`sr-exec-${idx}`} leader={leader} size="sm" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Junior Executives */}
                  {currentSession.juniorExecutives && currentSession.juniorExecutives.length > 0 && (
                    <div className="space-y-6">
                      <h4 className="text-xs font-mono text-text-secondary uppercase tracking-widest text-center">
                        Junior Executives
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {currentSession.juniorExecutives.map((leader, idx) => (
                          <LeaderCard key={`jr-exec-${idx}`} leader={leader} size="sm" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fallback to old coreTeam if present (for legacy sessions structure) */}
                  {(!currentSession.roboticsHeads && currentSession.coreTeam && currentSession.coreTeam.length > 0) && (
                    <div className="space-y-6">
                      <h4 className="text-xs font-mono text-text-secondary uppercase tracking-widest text-center">
                        Core Committee Heads
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {currentSession.coreTeam.map((leader, idx) => (
                          <LeaderCard key={idx} leader={leader} size="sm" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Regular Members */}
                  <div className="pt-6 border-t border-card-border">
                    <Card hoverEffect={false} className="text-center p-6 space-y-4">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-text-primary">
                        Society Members
                      </h4>
                      <div className="flex flex-wrap gap-2.5 justify-center">
                        {currentSession.members.map((member, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-lg bg-card-bg border border-card-border text-xs text-text-secondary font-mono hover:border-primary-accent/30 hover:text-text-primary transition-colors"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* LEADERSHIP LEGACY ARCHIVE */}
              <div id="legacy" className="space-y-10 scroll-mt-24">
                <div className="text-center space-y-2">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-primary-accent">
                    CHRONOLOGICAL LEDGER
                  </h3>
                  <p className="text-2xl font-bold tracking-tight text-text-primary">
                    Leadership Legacy Archive
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed max-w-md mx-auto">
                    Permanent record of past executive councils, academic reports, and events conducted.
                  </p>
                </div>

                {/* Vertical Timeline Accordion */}
                <div className="space-y-4 max-w-4xl mx-auto">
                  {legacySessions.map((session) => {
                    const isExpanded = expandedSessionId === session.id;
                    return (
                      <div
                        key={session.id}
                        className="rounded-2xl border border-card-border bg-card-bg overflow-hidden transition-all duration-300"
                      >
                        {/* Accordion Trigger */}
                        <div
                          onClick={() => toggleSession(session.id)}
                          className="px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-card-bg-hover transition-colors select-none"
                        >
                          <div className="flex items-center space-x-4">
                            <Calendar className="h-5 w-5 text-primary-accent shrink-0" />
                            <div className="text-left">
                              <h4 className="text-sm font-bold text-text-primary font-mono uppercase tracking-widest">
                                Session {session.id}
                              </h4>
                              <p className="text-[10px] text-text-secondary font-mono mt-0.5">
                                Teacher-in-Charge: {session.ticName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-card-bg text-text-secondary hidden sm:inline-block">
                              EXPAND ARCHIVE
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-primary-accent" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-text-secondary" />
                            )}
                          </div>
                        </div>

                        {/* Expandable Body */}
                        {isExpanded && (
                          <div className="px-6 pb-6 pt-2 border-t border-card-border bg-bg-primary/50 space-y-8 animate-fade-in">
                            
                            {/* Key Officers */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                              {[
                                { role: "President", name: session.president.name },
                                { role: "Vice President", name: session.vicePresident.name },
                                { role: "Secretary", name: session.secretary.name },
                                { role: "Treasurer", name: session.treasurer.name }
                              ].map((item, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-card-bg border border-card-border flex flex-col justify-center text-center">
                                  <span className="text-[9px] font-mono uppercase tracking-widest text-text-secondary mb-1">
                                    {item.role}
                                  </span>
                                  <span className="text-xs font-bold text-text-primary">
                                    {item.name}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Summary Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Achievements in session */}
                              <div className="p-4 rounded-xl bg-card-bg border border-card-border space-y-3 text-left">
                                <h5 className="text-[10px] font-mono uppercase tracking-widest text-primary-accent flex items-center space-x-1.5">
                                  <Trophy className="h-3.5 w-3.5" />
                                  <span>Session Achievements</span>
                                </h5>
                                <div className="text-xs font-bold text-text-primary text-3xl font-display">
                                  {session.achievements.length}
                                </div>
                                <p className="text-[10px] text-text-secondary leading-relaxed">
                                  Competitions won and publications achieved during the session.
                                </p>
                              </div>

                              {/* Events in session */}
                              <div className="p-4 rounded-xl bg-card-bg border border-card-border space-y-3 text-left">
                                <h5 className="text-[10px] font-mono uppercase tracking-widest text-primary-accent flex items-center space-x-1.5">
                                  <Users className="h-3.5 w-3.5" />
                                  <span>Events Organised</span>
                                </h5>
                                <div className="text-xs font-bold text-text-primary text-3xl font-display">
                                  {session.events.length}
                                </div>
                                <p className="text-[10px] text-text-secondary leading-relaxed">
                                  Workshops, industrial visits, guest lectures conducted.
                                </p>
                              </div>

                              {/* Projects in session */}
                              <div className="p-4 rounded-xl bg-card-bg border border-card-border space-y-3 text-left">
                                <h5 className="text-[10px] font-mono uppercase tracking-widest text-primary-accent flex items-center space-x-1.5">
                                  <Cpu className="h-3.5 w-3.5" />
                                  <span>Hardware Projects</span>
                                </h5>
                                <div className="text-xs font-bold text-text-primary text-3xl font-display">
                                  {session.projects.length}
                                </div>
                                <p className="text-[10px] text-text-secondary leading-relaxed">
                                  Firmware, IoT nodes, and bionics prototypes developed.
                                </p>
                              </div>
                            </div>

                            {/* Yearbook Download link */}
                            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-card-bg border border-card-border gap-4">
                              <div className="flex items-center space-x-3 text-left">
                                <BookOpen className="h-5 w-5 text-primary-accent shrink-0" />
                                <div>
                                  <h5 className="text-xs font-bold text-text-primary">Digital Yearbook & Annual Report</h5>
                                  <p className="text-[10px] text-text-secondary font-mono">Aggregated PDF archiving this session&apos;s complete legacy records.</p>
                                </div>
                              </div>
                              <Button variant="neon" size="sm" href="#">
                                Download PDF
                              </Button>
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}
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
