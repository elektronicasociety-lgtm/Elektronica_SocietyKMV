"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Cpu, Mail, Globe, MapPin, Send, Code, Calendar } from "lucide-react";
import { addSubscriber } from "@/lib/firebase";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await addSubscriber(email);
      setSuccess(true);
      setEmail("");
      setTimeout(() => setSuccess(false), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="w-full bg-bg-secondary border-t border-card-border pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-20 h-20 flex items-center justify-center">
                <img src="/society-logo.png" alt="ELEKTRONICA Logo" className="w-full h-full object-contain" />
              </div>
              <div className="w-28 h-28 flex items-center justify-center">
                <img src="/college-logo.png" alt="College Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold font-display tracking-widest text-text-primary">
                ELEKTRONICA
              </span>
            </Link>
            <p className="text-xs text-text-secondary leading-relaxed max-w-xs">
              The Electronics Society of Keshav Mahavidyalaya, University of Delhi. Fostering technical excellence in Robotics, IoT, VLSI, and Embedded Systems since 2018.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-card-bg border border-card-border text-text-secondary hover:text-primary-accent hover:border-primary-accent/40 transition-colors">
                <Code className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-card-bg border border-card-border text-text-secondary hover:text-primary-accent hover:border-primary-accent/40 transition-colors">
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-text-primary mb-6">
              SOCIETY ARCHIVE
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-xs text-text-secondary hover:text-primary-accent transition-colors">
                  Legacy & History
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-xs text-text-secondary hover:text-primary-accent transition-colors">
                  Engineering Projects
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-xs text-text-secondary hover:text-primary-accent transition-colors">
                  Workshops & Events
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-xs text-text-secondary hover:text-primary-accent transition-colors">
                  Masonry Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-text-primary mb-6">
              HEADQUARTERS
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary-accent mt-0.5 shrink-0" />
                <span className="text-xs text-text-secondary leading-relaxed">
                  Department of Electronics, Keshav Mahavidyalaya, H-4-5 Zone, Pitampura, Near Rani Bagh, Delhi-110034
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-accent shrink-0" />
                <a href="mailto:elektronicasociety@gmail.com" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
                  elektronicasociety@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-primary-accent shrink-0" />
                <a href="https://keshav.du.ac.in" target="_blank" rel="noreferrer" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
                  keshav.du.ac.in
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-text-primary mb-6">
              TELEMETRY FEED
            </h3>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              Subscribe to our newsletter for upcoming workshop alerts, project updates, and achievements.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  suppressHydrationWarning
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  className="w-full px-4 py-2.5 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent transition-colors"
                />
                <button
                  suppressHydrationWarning
                  type="submit"
                  disabled={submitting}
                  className="absolute right-2 top-2 p-1 text-text-secondary hover:text-primary-accent transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              {success && (
                <p className="text-[10px] text-primary-accent font-mono animate-fade-in">
                  Subscribed successfully!
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[10px] text-text-secondary font-mono">
            &copy; {new Date().getFullYear()} ELEKTRONICA. All rights reserved.
          </p>
          <p className="text-[10px] text-text-secondary font-mono">
            Designed & Developed for the Department of Electronics, Keshav Mahavidyalaya.
          </p>
        </div>

      </div>
    </footer>
  );
}
