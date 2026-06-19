"use client";

import React, { useState, useEffect } from "react";
import PCBBackground from "@/components/effects/PCBBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { fetchAchievements } from "@/lib/firebase";
import { Achievement } from "@/lib/data-mock";
import { Award, Trophy, Bookmark, Globe, Layers, Sparkles } from "lucide-react";

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAchievements();
        // Sort chronologically: latest first
        const sorted = data.sort((a, b) => b.year - a.year);
        setAchievements(sorted);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter achievements by selected year
  const filteredAchievements = achievements.filter((ach) => {
    return selectedYear === "all" || ach.year.toString() === selectedYear;
  });

  // Extract unique years for the filter list
  const years = Array.from(new Set(achievements.map((a) => a.year.toString()))).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <PCBBackground />
      <Navbar />

      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Title */}
          <div className="space-y-4 text-center mb-12">
            <h1 className="text-xs font-mono uppercase tracking-widest text-primary-accent">
              TECHNICAL GLORY
            </h1>
            <h2 className="text-4xl font-extrabold tracking-tight font-display text-text-primary">
              Society Achievements
            </h2>
            <div className="w-12 h-1 bg-primary-accent mx-auto rounded-full mt-2" />
          </div>

          {/* Year Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-12">
            <button
              suppressHydrationWarning
              onClick={() => setSelectedYear("all")}
              className={`px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${
                selectedYear === "all"
                  ? "bg-primary-accent text-black font-semibold shadow-[0_0_15px_rgba(215,255,0,0.25)]"
                  : "bg-card-bg text-text-secondary hover:bg-card-bg-hover hover:text-text-primary border border-card-border"
              }`}
            >
              All Years
            </button>
            {years.map((year) => (
              <button
                suppressHydrationWarning
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${
                  selectedYear === year
                    ? "bg-primary-accent text-black font-semibold shadow-[0_0_15px_rgba(215,255,0,0.25)]"
                    : "bg-card-bg text-text-secondary hover:bg-card-bg-hover hover:text-text-primary border border-card-border"
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Grid of Achievements */}
          {loading ? (
            <div className="text-center py-20 text-xs font-mono text-text-secondary animate-pulse">
              RESOLVING GLORY LOGS...
            </div>
          ) : filteredAchievements.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-card-border rounded-2xl">
              <p className="text-xs font-mono text-text-secondary uppercase">No registered honors recorded.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredAchievements.map((ach) => (
                <Card
                  key={ach.id}
                  hoverEffect={true}
                  className="flex flex-col justify-between"
                >
                  <div className="space-y-4 text-left">
                    {/* Header: Category Badge & Date */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-primary-accent/15 text-primary-accent border border-primary-accent/25 text-[8px] font-mono uppercase tracking-wider">
                        <Award className="h-3 w-3 shrink-0" />
                        <span>{ach.category}</span>
                      </span>
                      <span className="text-[10px] font-mono text-text-secondary">
                        {new Date(ach.date).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric"
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-text-primary tracking-tight leading-normal">
                      {ach.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {ach.description}
                    </p>

                    {/* Team Members */}
                    <div className="space-y-1.5 pt-2">
                      <h4 className="text-[9px] font-mono uppercase text-text-secondary tracking-wider">Recipient / Team:</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {ach.team.map((member, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-card-bg border border-card-border text-[10px] font-mono text-text-primary"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer link to proof or yearbook */}
                  {ach.proofUrl && (
                    <div className="mt-6 pt-4 border-t border-card-border flex items-center justify-between">
                      <a
                        href={ach.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 text-[10px] font-mono text-primary-accent hover:underline"
                      >
                        <Globe className="h-3 w-3" />
                        <span>Verify Telemetric Link</span>
                      </a>
                      <span className="text-[9px] font-mono text-text-secondary uppercase">
                        Ref: DU-{ach.year}
                      </span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
