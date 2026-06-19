"use client";

import React, { useState, useEffect } from "react";
import PCBBackground from "@/components/effects/PCBBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fetchEvents, saveItem } from "@/lib/firebase";
import { Event } from "@/lib/data-mock";
import { Calendar, MapPin, Users, User, Star, CheckCircle, Award } from "lucide-react";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Feedback states mapped by event id
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [successLogs, setSuccessLogs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchEvents();
        // Sort events chronologically: latest first
        const sorted = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEvents(sorted);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleFeedbackSubmit = async (eventId: string) => {
    const rating = ratings[eventId] || 5;
    const comment = comments[eventId] || "";
    const email = emails[eventId] || "";

    if (!email) return;

    // Retrieve target event
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    // Initialize feedback array
    const feedbackList = event.feedback || [];
    feedbackList.push({ rating, comment, email });
    const updatedEvent = { ...event, feedback: feedbackList };

    // Update in simulated DB
    const success = await saveItem("events", updatedEvent);
    if (success) {
      setSuccessLogs(prev => ({ ...prev, [eventId]: true }));
      // Clear inputs
      setComments(prev => ({ ...prev, [eventId]: "" }));
      setEmails(prev => ({ ...prev, [eventId]: "" }));
      // Update local state event object
      setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
    }
  };

  return (
    <>
      <PCBBackground />
      <Navbar />

      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Title */}
          <div className="space-y-4 text-center mb-16">
            <h1 className="text-xs font-mono uppercase tracking-widest text-primary-accent">
              TECHNICAL CHRONOLOGY
            </h1>
            <h2 className="text-4xl font-extrabold tracking-tight font-display text-text-primary">
              Society Events Timeline
            </h2>
            <div className="w-12 h-1 bg-primary-accent mx-auto rounded-full mt-2" />
          </div>

          {loading ? (
            <div className="text-center py-20 text-xs font-mono text-text-secondary animate-pulse">
              READING TIMELINE REGISTERS...
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-card-border rounded-2xl">
              <p className="text-xs font-mono text-text-secondary uppercase">No chronological events registered.</p>
            </div>
          ) : (
            <div className="relative border-l border-card-border pl-6 sm:pl-10 space-y-16">
              
              {events.map((event) => (
                <div key={event.id} className="relative text-left">
                  
                  {/* Timeline bullet dot */}
                  <span className="absolute -left-[31px] sm:-left-[47px] top-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-bg-primary border-2 border-primary-accent">
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary-accent" />
                  </span>

                  {/* Event Node */}
                  <div className="space-y-6">
                    
                    {/* Time & Title Row */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-mono text-text-secondary">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric"
                          })}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider bg-primary-accent/15 text-primary-accent border border-primary-accent/25">
                          {event.category}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight font-display">
                        {event.title}
                      </h3>
                    </div>

                    {/* Banner Image */}
                    {event.bannerUrl && (
                      <div className="h-48 rounded-xl overflow-hidden bg-bg-primary/40 border border-card-border shadow-md">
                        <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Event Description Card */}
                    <Card hoverEffect={false} className="p-6 space-y-6">
                      
                      <div className="space-y-3">
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      {/* Info parameters (Date, Venue, Attendance) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-y border-card-border">
                        <div className="flex items-center space-x-2 text-xs text-text-secondary">
                          <Calendar className="h-4 w-4 text-primary-accent shrink-0" />
                          <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-text-secondary">
                          <MapPin className="h-4 w-4 text-primary-accent shrink-0" />
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-text-secondary">
                          <Users className="h-4 w-4 text-primary-accent shrink-0" />
                          <span>{event.attendanceCount || 0} Registered Attendees</span>
                        </div>
                      </div>

                      {/* Speakers profiles */}
                      {event.speakers && event.speakers.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-mono uppercase text-text-primary tracking-wider">Guest Speakers / Facilitators</h4>
                          <div className="flex flex-wrap gap-4">
                            {event.speakers.map((speaker, index) => (
                              <div key={index} className="flex items-center space-x-3 p-2.5 rounded-lg bg-card-bg border border-card-border">
                                {speaker.photoUrl ? (
                                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                                    <img src={speaker.photoUrl} alt={speaker.name} className="w-full h-full object-cover" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-card-bg flex items-center justify-center shrink-0">
                                    <User className="h-4 w-4 text-text-secondary" />
                                  </div>
                                )}
                                <div className="text-left">
                                  <h5 className="text-[11px] font-bold text-text-primary leading-none">{speaker.name}</h5>
                                  <p className="text-[9px] text-text-secondary font-mono mt-0.5">{speaker.designation}, {speaker.organization}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Inline Event Feedback Form */}
                      <div className="pt-4 border-t border-card-border space-y-4">
                        <h4 className="text-[10px] font-mono uppercase text-text-primary tracking-wider">Submit Event Review</h4>
                        
                        {successLogs[event.id] ? (
                          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center space-x-3 text-xs text-emerald-400">
                            <CheckCircle className="h-4 w-4 shrink-0" />
                            <span>Review received. Thank you for helping us optimize our events!</span>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              {/* Star Ratings */}
                              <div className="flex items-center space-x-1.5">
                                <span className="text-[10px] font-mono text-text-secondary mr-2">Score:</span>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    suppressHydrationWarning
                                    key={star}
                                    type="button"
                                    onClick={() => setRatings(prev => ({ ...prev, [event.id]: star }))}
                                    className="p-1"
                                  >
                                    <Star className={`h-4.5 w-4.5 ${
                                      star <= (ratings[event.id] || 5)
                                        ? "text-primary-accent fill-primary-accent"
                                        : "text-text-secondary/20"
                                    }`} />
                                  </button>
                                ))}
                              </div>

                              {/* Email Input */}
                              <input
                                suppressHydrationWarning
                                type="email"
                                placeholder="Student/Attendee email"
                                required
                                value={emails[event.id] || ""}
                                onChange={(e) => setEmails(prev => ({ ...prev, [event.id]: e.target.value }))}
                                className="px-3 py-1.5 rounded bg-card-bg border border-card-border text-xs text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent w-full sm:max-w-xs"
                              />
                            </div>

                            {/* Comment & Submit */}
                            <div className="flex gap-2">
                              <input
                                suppressHydrationWarning
                                type="text"
                                placeholder="Write a brief feedback or comment..."
                                value={comments[event.id] || ""}
                                onChange={(e) => setComments(prev => ({ ...prev, [event.id]: e.target.value }))}
                                className="flex-grow px-3 py-1.5 rounded bg-card-bg border border-card-border text-xs text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent"
                              />
                              <Button
                                variant="neon"
                                size="sm"
                                className="py-1.5 px-4"
                                onClick={() => handleFeedbackSubmit(event.id)}
                              >
                                Submit
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                    </Card>

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
