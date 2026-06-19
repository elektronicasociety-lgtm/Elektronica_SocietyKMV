"use client";

import React, { useState } from "react";
import PCBBackground from "@/components/effects/PCBBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mail, MapPin, Globe, Send, MessageSquare, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { saveItem } from "@/lib/firebase";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Who is eligible to join ELEKTRONICA?",
    answer: "All students enrolled in B.Sc. (Hons) Electronics at Keshav Mahavidyalaya are automatically members. Students from other departments (like Computer Science or Physics) who are passionate about robotics, hardware prototyping, and AI/IoT are also welcome to collaborate on our open-source projects."
  },
  {
    question: "How can I get my engineering project showcased on the website?",
    answer: "Submit your project repository link, bill of materials, circuit schematic, and a brief demo video through the Admin panel or get in touch with the student PR / Technical Head. Once verified by the Teacher-In-Charge, your project blueprint will go live."
  },
  {
    question: "Where are the society meetings and lab sessions conducted?",
    answer: "Regular meetings are held in the Department of Electronics Labs (Lab 1 or Lab 2) on the first floor of the science wing. Special hackathons and regional competitions are held in the college auditorium."
  },
  {
    question: "Are industrial excursions open to students from all semesters?",
    answer: "Yes, industrial visits (such as excursions to SMT fabrication facilities) are open to students from all semesters, though priority is given to second and third-year students conducting core microcontroller and communication labs."
  }
];

export default function Contact() {
  // Contact form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // FAQ state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    try {
      const newMessage = {
        id: `msg-${Date.now()}`,
        name,
        email,
        subject: subject || "No Subject",
        message,
        timestamp: new Date().toISOString(),
        read: false
      };
      await saveItem("contact_messages", newMessage);
      setSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Failed to save contact payload", error);
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <>
      <PCBBackground />
      <Navbar />

      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Title */}
          <div className="space-y-4 text-center mb-16">
            <h1 className="text-xs font-mono uppercase tracking-widest text-primary-accent">
              COMMUNICATION CHANNELS
            </h1>
            <h2 className="text-4xl font-extrabold tracking-tight font-display text-text-primary">
              Connect With Us
            </h2>
            <div className="w-12 h-1 bg-primary-accent mx-auto rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
            
            {/* Left side: Information coordinates & Map mockup */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <h3 className="text-lg font-bold text-text-primary font-display">Society Coordinates</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3.5 p-4 rounded-xl bg-card-bg border border-card-border">
                  <MapPin className="h-5 w-5 text-primary-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-text-primary font-mono uppercase">Location</h4>
                    <p className="text-xs text-text-secondary leading-relaxed mt-1">
                      Department of Electronics, Keshav Mahavidyalaya, H-4-5 Zone, Pitampura, Delhi-110034
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-4 rounded-xl bg-card-bg border border-card-border">
                  <Mail className="h-5 w-5 text-primary-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-text-primary font-mono uppercase">Email Address</h4>
                    <a href="mailto:elektronicasociety@gmail.com" className="text-xs text-text-secondary hover:text-text-primary leading-relaxed mt-1 block transition-colors">
                      elektronicasociety@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-4 rounded-xl bg-card-bg border border-card-border">
                  <Globe className="h-5 w-5 text-primary-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-text-primary font-mono uppercase">University Portal</h4>
                    <a href="https://keshav.du.ac.in" target="_blank" rel="noreferrer" className="text-xs text-text-secondary hover:text-text-primary leading-relaxed mt-1 block transition-colors">
                      keshav.du.ac.in
                    </a>
                  </div>
                </div>
              </div>

              {/* Fully functional dark-filtered Google Maps Embed */}
              <div className="h-48 rounded-xl border border-card-border bg-card-bg overflow-hidden relative">
                <iframe
                  src="https://maps.google.com/maps?q=Keshav%20Mahavidyalaya%20Delhi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full opacity-80 hover:opacity-100 transition-opacity duration-300 map-iframe"
                />
              </div>
            </div>

            {/* Right side: Contact submission form */}
            <div className="lg:col-span-7">
              <Card hoverEffect={false} className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center space-x-2 text-left">
                  <MessageSquare className="h-5 w-5 text-primary-accent" />
                  <span>Transmit Message</span>
                </h3>

                {submitted ? (
                  <div className="p-8 text-center space-y-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto" />
                    <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono">Transmission Complete</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Your query has been logged in our department databases. We will respond back on your coordinate channels shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Your Name *</label>
                        <input
                          suppressHydrationWarning
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Siddharth Sharma"
                          className="w-full px-4 py-2.5 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-primary-accent"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-text-secondary">Email Coordinates *</label>
                        <input
                          suppressHydrationWarning
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@domain.com"
                          className="w-full px-4 py-2.5 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-primary-accent"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Transmission Subject</label>
                      <input
                        suppressHydrationWarning
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Collaboration on Robotics Project"
                        className="w-full px-4 py-2.5 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-primary-accent"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-text-secondary">Message Payload *</label>
                      <textarea
                        suppressHydrationWarning
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Detail your request or queries..."
                        className="w-full px-4 py-2.5 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-primary-accent h-32 resize-none"
                      />
                    </div>

                    <Button type="submit" variant="primary" className="w-full py-3">
                      Send Transmission <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                )}
              </Card>
            </div>

          </div>

          {/* Bottom section: Interactive accordion FAQ */}
          <div className="space-y-8 max-w-4xl mx-auto text-left">
            <h3 className="text-xl font-bold text-center text-text-primary tracking-tight font-display mb-10">
              Frequently Queried Telemetries (FAQs)
            </h3>
            
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-card-border bg-card-bg overflow-hidden transition-all duration-300"
                  >
                    <div
                      onClick={() => toggleFaq(idx)}
                      className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-card-bg-hover transition-colors select-none"
                    >
                      <h4 className="text-xs font-bold text-text-primary font-mono uppercase tracking-wider">
                        {item.question}
                      </h4>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-primary-accent" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-text-secondary" />
                      )}
                    </div>
                    {isOpen && (
                      <div className="px-6 pb-4 pt-1 border-t border-card-border bg-bg-primary/40 text-xs text-text-secondary leading-relaxed animate-fade-in">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
