"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Terminal, Cpu, Zap, Activity } from "lucide-react";

const WELCOME_MESSAGES = [
  "SYSTEM OK. Welcome to ELEKTRONICA.",
  "Mascot telemetry initialized.",
  "Ready to explore projects? Hover over them!",
  "Accessing Department of Electronics database...",
  "Status: 100% operational. Neon lines online.",
  "Founder log: Society established in 2018.",
  "Tip: You can verify certificates in the portal.",
  "Processing edge AI neural network vectors..."
];

export default function InteractiveMascot() {
  const [logIndex, setLogIndex] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState(WELCOME_MESSAGES[0]);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const robotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Setup spring-based motion values for smooth tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const eyeX = useSpring(mouseX, springConfig);
  const eyeY = useSpring(mouseY, springConfig);

  // Mouse Move Event tracking relative to the mascot element
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!robotRef.current) return;
      const rect = robotRef.current.getBoundingClientRect();
      const elemX = rect.left + rect.width / 2;
      const elemY = rect.top + rect.height / 2;
      
      // Calculate delta angle/offset and clamp it to max 8px pupil offset
      const dx = e.clientX - elemX;
      const dy = e.clientY - elemY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(Math.hypot(dx, dy) / 30, 8); // clamp

      mouseX.set(Math.cos(angle) * distance);
      mouseY.set(Math.sin(angle) * distance);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Periodic Eye Blink Loop
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Periodic Telemetry Logs Loop
  useEffect(() => {
    const logInterval = setInterval(() => {
      setLogIndex((prev) => {
        const nextIdx = (prev + 1) % WELCOME_MESSAGES.length;
        setCurrentPrompt(WELCOME_MESSAGES[nextIdx]);
        return nextIdx;
      });
    }, 6000);

    return () => clearInterval(logInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-sm mx-auto">
      {/* Mascot Graphic container */}
      <div 
        ref={robotRef}
        className="w-64 h-64 relative bg-gradient-to-b from-white/3 to-white/0 border border-white/5 rounded-3xl p-6 flex items-center justify-center shadow-xl backdrop-blur-md"
      >
        {/* Glow ambient background behind the head */}
        <div className="absolute w-40 h-40 bg-primary-accent/10 rounded-full blur-[45px] pointer-events-none -z-10" />

        {/* Animated robot head SVG */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_0_15px_rgba(215,255,0,0.15)]"
        >
          {/* Antennas */}
          <line x1="100" y1="40" x2="100" y2="15" stroke="#D7FF00" strokeWidth="4" strokeLinecap="round" />
          <motion.circle
            cx="100"
            cy="15"
            r="6"
            fill="#D7FF00"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />

          {/* Side Ears / Transceiver Modules */}
          <rect x="30" y="80" width="10" height="40" rx="3" fill="#151515" stroke="rgba(255,255,255,0.08)" />
          <rect x="160" y="80" width="10" height="40" rx="3" fill="#151515" stroke="rgba(255,255,255,0.08)" />
          <line x1="35" y1="85" x2="35" y2="115" stroke="#D7FF00" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="165" y1="85" x2="165" y2="115" stroke="#D7FF00" strokeWidth="2" strokeDasharray="3 3" />

          {/* Main Head Outer Shell */}
          <rect
            x="40"
            y="50"
            width="120"
            height="100"
            rx="24"
            fill="#101010"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="3"
          />

          {/* Futuristic Circuit Grid Overlay on Casing */}
          <path d="M 45 75 L 65 75 L 75 85" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" fill="none" />
          <path d="M 155 75 L 135 75 L 125 85" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" fill="none" />
          
          {/* Inner Screen Visor Panel */}
          <rect
            x="50"
            y="65"
            width="100"
            height="60"
            rx="12"
            fill="#050505"
            stroke="rgba(215, 255, 0, 0.2)"
            strokeWidth="2"
          />

          {/* Right/Left Eye Ring Guides */}
          <circle cx="78" cy="95" r="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" />
          <circle cx="122" cy="95" r="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" />

          {/* Glowing Neon Eyes with Spring Tracking */}
          {!isBlinking ? (
            <>
              {/* Left Eye */}
              <g>
                <circle cx="78" cy="95" r="10" fill="rgba(215, 255, 0, 0.1)" stroke="#D7FF00" strokeWidth="1.5" />
                <motion.circle
                  style={{ x: eyeX, y: eyeY }}
                  cx="78"
                  cy="95"
                  r="5"
                  fill="#D7FF00"
                />
              </g>

              {/* Right Eye */}
              <g>
                <circle cx="122" cy="95" r="10" fill="rgba(215, 255, 0, 0.1)" stroke="#D7FF00" strokeWidth="1.5" />
                <motion.circle
                  style={{ x: eyeX, y: eyeY }}
                  cx="122"
                  cy="95"
                  r="5"
                  fill="#D7FF00"
                />
              </g>
            </>
          ) : (
            <>
              {/* Blinking State (flat lines representing closed eyes) */}
              <line x1="68" y1="95" x2="88" y2="95" stroke="#D7FF00" strokeWidth="3" strokeLinecap="round" />
              <line x1="112" y1="95" x2="132" y2="95" stroke="#D7FF00" strokeWidth="3" strokeLinecap="round" />
            </>
          )}

          {/* Interactive mouth / signal frequency line */}
          {!isMounted ? (
            <path
              d="M 85 132 Q 100 128 115 132"
              fill="none"
              stroke="#D7FF00"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <motion.path
              d="M 85 132 Q 100 128 115 132"
              fill="none"
              stroke="#D7FF00"
              strokeWidth="2"
              strokeLinecap="round"
              animate={isBlinking ? { scaleY: 0.1 } : { scaleY: [1, -1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{ originX: 0.5, originY: 0.5 }}
            />
          )}
        </svg>

        {/* Battery / energy node in bottom corner */}
        <div className="absolute bottom-3 right-4 flex items-center space-x-1">
          <Zap className="h-3 w-3 text-primary-accent animate-pulse" />
          <span className="text-[8px] font-mono text-primary-accent uppercase tracking-wider">
            GRID LINKED
          </span>
        </div>
      </div>

      {/* Mascot Telemetry Console Log */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-white/10 shadow-lg relative overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
          <div className="flex items-center space-x-2">
            <Terminal className="h-3.5 w-3.5 text-primary-accent" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B0B0B0]">
              MASCOT TERMINAL
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-accent animate-ping" />
            <span className="text-[8px] font-mono text-[#B0B0B0]">ONLINE</span>
          </div>
        </div>

        {/* Dynamic output logs */}
        <div className="space-y-1.5">
          <div className="flex items-start space-x-2">
            <span className="text-primary-accent font-mono text-xs select-none">&gt;</span>
            <p className="text-xs font-mono text-white leading-normal">
              {currentPrompt}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-[9px] text-[#B0B0B0] font-mono">
            <Activity className="h-2.5 w-2.5 text-[#B0B0B0]" />
            <span>Telemetry buffer: 0x{logIndex}F8D</span>
            <span className="text-white/20">|</span>
            <span>V_REF: 5.01V</span>
          </div>
        </div>
      </div>
    </div>
  );
}
