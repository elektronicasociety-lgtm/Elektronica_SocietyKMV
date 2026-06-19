"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PCBBackground from "@/components/effects/PCBBackground";
import SplashBackground from "@/components/effects/SplashBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InteractiveMascot from "@/components/mascot/InteractiveMascot";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowUpRight, Cpu, HardDrive, ShieldCheck, Award, Users, Settings } from "lucide-react";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [diagnostics, setDiagnostics] = useState("INITIALIZING COMPONENT MATRIX...");

  useEffect(() => {
    // Check if splash has already run in this session
    if (typeof window !== "undefined") {
      const shown = sessionStorage.getItem("elektronica_splash_shown");
      if (shown === "true") {
        setShowSplash(false);
      } else {
        const timer = setTimeout(() => {
          setShowSplash(false);
          sessionStorage.setItem("elektronica_splash_shown", "true");
        }, 1400); // 1.4s play duration
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Update diagnostics telemetry text as boot progress progresses
  useEffect(() => {
    if (!showSplash) return;
    const timer1 = setTimeout(() => setDiagnostics("CONNECTING SENSOR TELEMETRY..."), 300);
    const timer2 = setTimeout(() => setDiagnostics("LOADING EMBEDDED SCRIPTS..."), 600);
    const timer3 = setTimeout(() => setDiagnostics("LOADING DYNAMIC PCB LINES..."), 900);
    const timer4 = setTimeout(() => setDiagnostics("SYSTEM CORE: ONLINE"), 1200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [showSplash]);

  // Support skipping splash with keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        setShowSplash(false);
        sessionStorage.setItem("elektronica_splash_shown", "true");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Stagger variants for name text letters
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.6,
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 120, damping: 11 }
    }
  };

  const nameText = "ELEKTRONICA";

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.15,
              filter: "blur(12px)",
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
            }}
            className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center overflow-hidden font-mono"
          >
            {/* Custom Interactive Cyber Matrix background canvas */}
            <SplashBackground />

            {/* Ambient background glow */}
            <div className="absolute w-[600px] h-[600px] rounded-full bg-primary-accent/5 blur-[130px] pointer-events-none z-0" />

            <div className="flex flex-col items-center space-y-8 max-w-md px-6 relative z-10">
              {/* Society Logo animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotate: 0,
                  transition: { duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }
                }}
                className="w-48 h-48 flex items-center justify-center relative p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl"
              >
                {/* HUD Locking Brackets */}
                <motion.div 
                  initial={{ scale: 1.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.6 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary-accent" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary-accent" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary-accent" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary-accent" />
                </motion.div>

                {/* Primary Pulsating ring behind the logo */}
                <motion.div 
                  className="absolute inset-0 rounded-2xl border border-primary-accent/25 shadow-[0_0_40px_rgba(215,255,0,0.15)]"
                  animate={{ 
                    scale: [0.97, 1.03, 0.97],
                    opacity: [0.4, 0.8, 0.4] 
                  }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                />

                {/* Concentric Energy shockwave rings */}
                <motion.div 
                  className="absolute inset-[-12px] rounded-2xl border border-primary-accent/15"
                  animate={{ 
                    scale: [0.94, 1.08, 0.94],
                    opacity: [0.2, 0.5, 0.2] 
                  }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                />

                <motion.div 
                  className="absolute inset-[-24px] rounded-2xl border border-primary-accent/5"
                  animate={{ 
                    scale: [0.9, 1.15, 0.9],
                    opacity: [0.1, 0.3, 0.1] 
                  }}
                  transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
                />

                <img 
                  src="/society-logo.png" 
                  alt="ELEKTRONICA Logo" 
                  className="w-36 h-36 object-contain drop-shadow-[0_0_25px_rgba(215,255,0,0.35)]" 
                />
              </motion.div>

              {/* Society Name typing/reveal */}
              <div className="space-y-2.5 text-center">
                <motion.h1
                  variants={textContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-4xl sm:text-5xl font-extrabold tracking-[0.28em] text-white font-display uppercase mr-[-0.28em] flex items-center justify-center"
                >
                  {nameText.split("").map((letter, idx) => (
                    <motion.span key={idx} variants={letterVariants}>
                      {letter}
                    </motion.span>
                  ))}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1,
                    y: 0,
                    transition: { delay: 1.5, duration: 0.8 }
                  }}
                  className="text-[10px] uppercase tracking-[0.35em] text-primary-accent font-semibold font-mono"
                >
                  Department of Electronics
                </motion.p>
              </div>

              {/* Progress/Terminal Loader simulation */}
              <div className="w-64 space-y-2 pt-6 text-[9px] text-[#B0B0B0] text-left border-t border-white/5">
                <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary-accent shadow-[0_0_15px_#D7FF00]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                  />
                </div>
                <div className="flex justify-between items-center text-[8px] font-mono text-[#888]">
                  <motion.span className="text-primary-accent/80 font-bold uppercase tracking-wider">
                    {diagnostics}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className="text-primary-accent font-bold"
                  >
                    READY
                  </motion.span>
                </div>
              </div>
            </div>

            {/* Quick Skip button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              onClick={() => {
                setShowSplash(false);
                sessionStorage.setItem("elektronica_splash_shown", "true");
              }}
              className="absolute bottom-10 px-5 py-2 rounded-full border border-white/10 text-[10px] uppercase tracking-wider text-white bg-white/5 transition-all hover:border-primary-accent/30 cursor-pointer"
            >
              Skip Intro [Space / Enter]
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <PCBBackground />
      <Navbar />

      <motion.div
        initial={{ opacity: showSplash ? 0 : 1, scale: showSplash ? 0.96 : 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: showSplash ? 0.25 : 0 }}
        className="flex flex-col min-h-screen"
      >
        <main className="flex-grow pt-28 pb-16">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* 1. HERO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[70vh] mb-20">
              {/* Left side text */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-accent/10 border border-primary-accent/30 text-primary-accent text-[10px] font-mono uppercase tracking-widest animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent" />
                  <span>Department of Electronics</span>
                </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display text-text-primary">
                ELEKTRONICA
              </h1>
              
              <p className="text-lg md:text-xl text-primary-accent font-mono font-medium tracking-wide">
                Innovating Through Electronics, Robotics, AI & Embedded Systems
              </p>
              
              <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-xl">
                The premier technical society of Keshav Mahavidyalaya, University of Delhi. Fostering a research-driven environment for students to design, develop, and deploy state-of-the-art technological solutions.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Button variant="primary" size="md" href="/projects">
                  Explore Projects <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="md" href="/contact">
                  Join Us
                </Button>
                <Button variant="neon" size="md" href="/students#legacy">
                  View Legacy
                </Button>
              </div>
            </div>

            {/* Right side mascot widget */}
            <div className="lg:col-span-5 flex justify-center">
              <InteractiveMascot />
            </div>
          </div>

          {/* 2. STATS OVERVIEW PANEL (Tesla styled) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
            {[
              { label: "Active Members", value: "60+", icon: Users },
              { label: "Total Projects", value: "45+", icon: Cpu },
              { label: "Technical Events", value: "30+", icon: Settings },
              { label: "Alumni Network", value: "200+", icon: HardDrive },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} hoverEffect={true} className="flex flex-col items-center justify-center text-center p-6">
                  <Icon className="h-5 w-5 text-primary-accent mb-3 opacity-80" />
                  <span className="text-3xl md:text-4xl font-bold font-display text-text-primary tracking-tight mb-1">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">
                    {stat.label}
                  </span>
                </Card>
              );
            })}
          </div>

          {/* 3. CORE DOMAINS OF ENGINEERING */}
          <div className="space-y-12 mb-20">
            <div className="text-center space-y-2">
              <h2 className="text-xs font-mono uppercase tracking-widest text-primary-accent">
                TECHNICAL SPECTRUM
              </h2>
              <p className="text-3xl font-bold font-display text-text-primary tracking-tight">
                Our Fields of Engineering & Innovation
              </p>
              <div className="w-12 h-1 bg-primary-accent mx-auto rounded-full mt-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Embedded Systems",
                  desc: "Firmware coding, microcontroller registers, and real-time operating systems (RTOS) on ARM & ESP nodes.",
                  tech: "STM32, ESP32, FreeRTOS"
                },
                {
                  title: "Robotics & Automation",
                  desc: "Robot kinematics, feedback control systems, servo actuation, and ROS 2 mapping interfaces.",
                  tech: "ROS 2, Arduino, LiDAR"
                },
                {
                  title: "IoT & Smart Telemetry",
                  desc: "Mesh networking protocols, energy harvesting, InfluxDB time-series analysis, and sensor telemetry.",
                  tech: "ESP-NOW, LoRa, Grafana"
                },
                {
                  title: "AI & TinyML",
                  desc: "Running edge machine learning and lightweight neural network inference directly on hardware nodes.",
                  tech: "TensorFlow Lite, Jetson"
                },
                {
                  title: "VLSI & Digital Systems",
                  desc: "Verilog hardware description languages, logic synthesis, registers, and FPGA design validations.",
                  tech: "Verilog, Vivado, FPGA"
                },
                {
                  title: "Communication Systems",
                  desc: "Wireless RF transmission, analog circuit amplifiers, optoelectronics, and laser LiFi modules.",
                  tech: "RF, Op-amps, Laser LiFi"
                }
              ].map((domain, index) => (
                <Card key={index} hoverEffect={true} glowOnHover={true} className="flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-primary-accent bg-primary-accent/15 px-2.5 py-1 rounded-md">
                        0{index + 1}
                      </span>
                      <h3 className="text-lg font-semibold tracking-tight text-text-primary">
                        {domain.title}
                      </h3>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {domain.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-card-border text-[9px] font-mono text-text-secondary uppercase tracking-wider">
                    Stack: {domain.tech}
                  </div>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
      </motion.div>
    </>
  );
}
