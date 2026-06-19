"use client";

import React from "react";
import PCBBackground from "@/components/effects/PCBBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Eye, Shield, Target, Award, Rocket, CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <>
      <PCBBackground />
      <Navbar />

      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Title */}
          <div className="space-y-4 text-center mb-16">
            <h1 className="text-xs font-mono uppercase tracking-widest text-primary-accent">
              ABOUT OUR SOCIETY
            </h1>
            <h2 className="text-4xl font-extrabold tracking-tight font-display text-text-primary">
              History & Purpose
            </h2>
            <div className="w-12 h-1 bg-primary-accent mx-auto rounded-full mt-2" />
          </div>

          {/* Section 1: Intro & History */}
          <div className="space-y-8 mb-16">
            <Card hoverEffect={false} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-card-border pb-4">
                <h3 className="text-xl font-bold tracking-tight text-text-primary font-display">
                  Welcome to ELEKTRONICA
                </h3>
                <div className="flex items-center space-x-3 shrink-0">
                  <div className="w-32 h-32 flex items-center justify-center">
                    <img src="/college-logo.png" alt="Keshav Mahavidyalaya Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="w-24 h-24 flex items-center justify-center">
                    <img src="/society-logo.png" alt="ELEKTRONICA Logo" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                ELEKTRONICA, the Electronics Society of Keshav Mahavidyalaya (University of Delhi), was founded in 2018 under the Department of Electronics. It acts as an active catalyst for building hands-on technological competence. By bridging the gap between collegiate curricula and industrial development paradigms, the society guides students to translate theoretical blueprints into working systems.
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Since our inception, we have hosted national-level technical symposiums, hands-on micro-controller bootcamps, and industrial excursions to manufacturing hubs. The society operates as a permanent repository of student innovation, storing project files and hardware logs to enable future student cohorts to easily build upon legacy designs.
              </p>
            </Card>
          </div>

          {/* Section 2: Vision & Mission (Split Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card hoverEffect={true} className="space-y-4 border-l-4 border-l-primary-accent">
              <div className="flex items-center space-x-3 text-primary-accent">
                <Eye className="h-6 w-6" />
                <h3 className="text-lg font-bold tracking-tight text-text-primary font-display">
                  Our Vision
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                To establish a state-of-the-art academic ecosystem that inspires students to engineer electronics, AI, and robotics solutions for real-world socio-economic and industrial problems.
              </p>
            </Card>
 
            <Card hoverEffect={true} className="space-y-4 border-l-4 border-l-text-secondary/20">
              <div className="flex items-center space-x-3 text-text-primary">
                <Target className="h-6 w-6 text-primary-accent" />
                <h3 className="text-lg font-bold tracking-tight text-text-primary font-display">
                  Our Mission
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                To run hands-on technical labs, sponsor inter-disciplinary projects, partner with hardware industries, and foster collaborative environments where students learn by prototyping, fabricating, and debugging systems.
              </p>
            </Card>
          </div>

          {/* Section 3: Objectives Checklist */}
          <div className="space-y-8 mb-16">
            <h3 className="text-xl font-bold text-center tracking-tight text-text-primary font-display">
              Core Objectives
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Deliver practical exposure to modern CAD tools like Altium Designer, Vivado, and ROS 2.",
                "Build collaborative engineering projects across Robotics, IoT, and Edge Intelligence.",
                "Organize technical seminars and industry SMT factory excursions.",
                "Host regional engineering fests and hackathons to showcase talent.",
                "Encourage original research publications and intellectual property filings.",
                "Preserve institutional history, maintaining permanent alumni and leadership archives."
              ].map((obj, i) => (
                <div key={i} className="flex items-start space-x-3 p-4 rounded-xl bg-card-bg border border-card-border">
                  <CheckCircle2 className="h-5 w-5 text-primary-accent shrink-0 mt-0.5" />
                  <span className="text-xs text-text-secondary leading-relaxed">
                    {obj}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Future Goals & Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card hoverEffect={true} className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-primary-accent" />
                <h3 className="text-lg font-bold tracking-tight text-text-primary font-display">
                  Our Values
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-text-secondary list-disc pl-4 leading-relaxed">
                <li>Integrity in engineering code and fabrication standards.</li>
                <li>Inclusive peer-to-peer mentoring models.</li>
                <li>Relentless technical curiosity and hands-on experimentation.</li>
              </ul>
            </Card>
 
            <Card hoverEffect={true} className="space-y-4">
              <div className="flex items-center space-x-3">
                <Rocket className="h-5 w-5 text-primary-accent" />
                <h3 className="text-lg font-bold tracking-tight text-text-primary font-display">
                  Future Goals
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-text-secondary list-disc pl-4 leading-relaxed">
                <li>Setup a dedicated Edge AI and TinyML testing laboratory.</li>
                <li>Design custom microcontroller training boards for first-year labs.</li>
                <li>Expand the regional network to co-host international hardware hackathons.</li>
              </ul>
            </Card>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
