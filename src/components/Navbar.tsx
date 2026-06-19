"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, Menu, X, Shield, Search } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Faculty", path: "/faculty" },
  { name: "Students", path: "/students" },
  { name: "Projects", path: "/projects" },
  { name: "Events", path: "/events" },
  { name: "Gallery", path: "/gallery" },
  { name: "Achievements", path: "/achievements" },
  { name: "Alumni", path: "/alumni" },
  { name: "Resources", path: "/resources" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "py-3 bg-bg-primary/80 backdrop-blur-md border-b border-card-border shadow-lg shadow-black/5" 
            : "py-5 bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Brand */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-18 h-18 flex items-center justify-center">
                <img src="/society-logo.png" alt="ELEKTRONICA Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-wider font-display text-text-primary group-hover:text-primary-accent transition-colors">
                  ELEKTRONICA
                </span>
                <span className="text-[10px] uppercase tracking-widest text-text-secondary font-mono -mt-0.5">
                  KMV DU
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`px-3 py-2 rounded-md text-xs font-mono font-medium tracking-wider uppercase transition-all duration-300 ${
                      isActive
                        ? "text-primary-accent bg-white/5 border-b-2 border-primary-accent/80"
                        : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Section: Theme Toggle, Admin & Mobile Menu Trigger */}
            <div className="flex items-center space-x-2">

              <Link
                href="/admin"
                className={`p-2 rounded-lg bg-white/5 border border-white/10 hover:border-primary-accent/40 text-text-secondary hover:text-text-primary transition-colors`}
                title="Admin Portal"
              >
                <Shield className="h-4 w-4" />
              </Link>

              {/* Mobile menu button */}
              <button
                suppressHydrationWarning
                onClick={() => setIsOpen(!isOpen)}
                className="xl:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors focus:outline-none"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer menu */}
        <div
          className={`xl:hidden fixed inset-y-0 right-0 z-40 w-72 bg-bg-primary/95 backdrop-blur-xl border-l border-card-border transform transition-transform duration-300 ease-in-out shadow-2xl pt-20 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="px-4 space-y-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-mono tracking-widest uppercase transition-all ${
                    isActive
                      ? "text-primary-accent bg-white/5 border-l-4 border-primary-accent"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Backdrop overlay for mobile drawer */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="xl:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          />
        )}
      </nav>
    </div>
  );
}
