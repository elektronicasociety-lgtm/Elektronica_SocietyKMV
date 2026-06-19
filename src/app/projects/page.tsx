"use client";

import React, { useState, useEffect } from "react";
import PCBBackground from "@/components/effects/PCBBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fetchProjects } from "@/lib/firebase";
import { Project } from "@/lib/data-mock";
import { Search, FileText, Video, Layers, X, Cpu, Code } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Sectors" },
  { id: "robotics", label: "Robotics" },
  { id: "iot", label: "IoT" },
  { id: "embedded", label: "Embedded" },
  { id: "ai-ml", label: "AI & ML" },
  { id: "vlsi", label: "VLSI" },
  { id: "communication", label: "Communication" },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter projects by both category selection and search query (name / technologies)
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory;
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <PCBBackground />
      <Navbar />

      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Title */}
          <div className="space-y-4 text-center mb-12">
            <h1 className="text-xs font-mono uppercase tracking-widest text-primary-accent">
              HARDWARE & ARCHITECTURE
            </h1>
            <h2 className="text-4xl font-extrabold tracking-tight font-display text-text-primary">
              Engineering Showcase
            </h2>
            <div className="w-12 h-1 bg-primary-accent mx-auto rounded-full mt-2" />
          </div>

          {/* Search and Category Filter Section */}
          <div className="space-y-6 mb-12">
            {/* Search input */}
            <div className="max-w-md mx-auto relative">
              <input
                suppressHydrationWarning
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by name, MCU, chip or tech stack..."
                className="w-full pl-11 pr-4 py-3 bg-card-bg border border-card-border rounded-xl text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent/30 transition-all"
              />
              <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-text-secondary" />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
              {CATEGORIES.map((cat) => (
                <button
                  suppressHydrationWarning
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? "bg-primary-accent text-black font-semibold shadow-[0_0_15px_rgba(215,255,0,0.25)]"
                      : "bg-card-bg text-text-secondary hover:bg-card-bg-hover hover:text-text-primary border border-card-border"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid display */}
          {loading ? (
            <div className="text-center py-20 text-xs font-mono text-text-secondary animate-pulse">
              RESOLVING CIRCUIT BLOCKS...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-card-border rounded-2xl">
              <p className="text-xs font-mono text-text-secondary uppercase">No projects match the telemetry coordinates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  hoverEffect={true}
                  className="flex flex-col justify-between h-full"
                >
                  <div className="space-y-4">
                    {/* Project Image Panel */}
                    <div className="relative h-44 rounded-xl overflow-hidden bg-bg-primary/40 border border-card-border">
                      <img
                        src={project.gallery[0] || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop"}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      
                      {/* Status pill */}
                      <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider ${
                        project.status === "completed" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                          : project.status === "in-progress"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/25"
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-2 text-left">
                      <span className="text-[9px] font-mono text-primary-accent uppercase tracking-widest block">
                        {project.category}
                      </span>
                      <h3 className="text-base font-bold text-text-primary tracking-tight line-clamp-1">
                        {project.name}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-card-bg text-[9px] font-mono text-text-secondary">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-0.5 rounded bg-card-bg text-[9px] font-mono text-text-secondary">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Click Action */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full py-2"
                      onClick={() => setActiveProject(project)}
                    >
                      Inspect Blueprint
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* PROJECT DETAIL BLUEPRINT OVERLAY MODAL */}
          {activeProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div 
                className="w-full max-w-3xl max-h-[85vh] bg-bg-secondary border border-card-border rounded-2xl overflow-y-auto shadow-2xl p-6 relative flex flex-col justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                
                {/* Close Button */}
                <button
                  onClick={() => setActiveProject(null)}
                  className="absolute right-4 top-4 p-2 rounded-lg bg-card-bg border border-card-border text-text-secondary hover:text-text-primary hover:bg-card-bg-hover transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="space-y-6 text-left">
                  {/* Category & Status */}
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-[10px] font-mono text-primary-accent bg-primary-accent/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {activeProject.category}
                    </span>
                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-md uppercase tracking-wider ${
                      activeProject.status === "completed" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                    }`}>
                      {activeProject.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
                    {activeProject.name}
                  </h3>

                  {/* Image Gallery Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeProject.gallery.map((imgUrl, i) => (
                      <div key={i} className="h-48 rounded-lg overflow-hidden border border-card-border bg-bg-primary/40">
                        <img src={imgUrl} alt={`gallery-${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {activeProject.gallery.length === 0 && (
                      <div className="sm:col-span-2 h-40 border border-dashed border-card-border rounded-lg flex items-center justify-center text-xs font-mono text-text-secondary">
                        NO ADDITIONAL IMAGES RECORDED
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase text-text-primary tracking-wider flex items-center space-x-1.5">
                      <Cpu className="h-3.5 w-3.5 text-primary-accent" />
                      <span>Project System Details</span>
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {activeProject.description}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase text-text-primary tracking-wider flex items-center space-x-1.5">
                      <Code className="h-3.5 w-3.5 text-primary-accent" />
                      <span>Components & Tech Stack</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.technologies.map((tech, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-card-bg border border-card-border text-[10px] font-mono text-text-secondary">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Team members */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase text-text-primary tracking-wider flex items-center space-x-1.5">
                      <Layers className="h-3.5 w-3.5 text-primary-accent" />
                      <span>Development Team</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeProject.teamMembers.map((member, i) => (
                        <div key={i} className="p-2.5 rounded bg-card-bg border border-card-border flex items-center justify-between text-xs">
                          <span className="font-bold text-text-primary">{member.name}</span>
                          <span className="text-[10px] text-text-secondary font-mono">{member.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-card-border">
                    {activeProject.githubLink && (
                      <a
                        href={activeProject.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 text-xs font-mono text-text-secondary hover:text-primary-accent transition-colors"
                      >
                        <Code className="h-4 w-4" />
                        <span>Source Code Repository</span>
                      </a>
                    )}
                    {activeProject.paperLink && (
                      <a
                        href={activeProject.paperLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 text-xs font-mono text-text-secondary hover:text-primary-accent transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Research Publication</span>
                      </a>
                    )}
                    {activeProject.demoVideoUrl && (
                      <a
                        href={activeProject.demoVideoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 text-xs font-mono text-text-secondary hover:text-primary-accent transition-colors"
                      >
                        <Video className="h-4 w-4" />
                        <span>Demo Video Capture</span>
                      </a>
                    )}
                  </div>

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
