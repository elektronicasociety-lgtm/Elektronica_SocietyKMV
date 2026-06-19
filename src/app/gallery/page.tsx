"use client";

import React, { useState, useEffect } from "react";
import PCBBackground from "@/components/effects/PCBBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { fetchGalleryImages } from "@/lib/firebase";
import { GalleryImage } from "@/lib/data-mock";
import { Search, X, Maximize2, Layers } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Photos" },
  { id: "workshops", label: "Workshops" },
  { id: "competitions", label: "Competitions" },
  { id: "meetings", label: "Meetings" },
  { id: "projects", label: "Projects" },
  { id: "visits", label: "Visits" },
  { id: "festivals", label: "Festivals" },
  { id: "achievements", label: "Achievements" },
];

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchGalleryImages();
        setImages(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredImages = images.filter((img) => {
    return selectedCategory === "all" || img.category === selectedCategory;
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
              VISUAL CHRONOLOGY
            </h1>
            <h2 className="text-4xl font-extrabold tracking-tight font-display text-text-primary">
              Society Photo Gallery
            </h2>
            <div className="w-12 h-1 bg-primary-accent mx-auto rounded-full mt-2" />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-12">
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

          {/* Pinterest-style Masonry Gallery Grid */}
          {loading ? (
            <div className="text-center py-20 text-xs font-mono text-text-secondary animate-pulse">
              RESOLVING IMAGE BLOCKS...
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-card-border rounded-2xl">
              <p className="text-xs font-mono text-text-secondary uppercase">No gallery items in this sector.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
              
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setLightboxImage(img)}
                  className="break-inside-avoid relative rounded-2xl overflow-hidden border border-card-border bg-card-bg hover:border-primary-accent/40 cursor-pointer group shadow-lg transition-all duration-300"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-auto object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  
                  {/* Hover Info Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                    <span className="text-[8px] font-mono text-primary-accent uppercase tracking-widest mb-1.5 flex items-center space-x-1">
                      <Layers className="h-3 w-3 shrink-0" />
                      <span>{img.category}</span>
                    </span>
                    <h3 className="text-xs font-bold text-white tracking-tight line-clamp-1 mb-0.5">
                      {img.title}
                    </h3>
                    <p className="text-[9px] text-[#B0B0B0] font-mono uppercase">
                      Session: {img.sessionId}
                    </p>
                    <Maximize2 className="absolute right-4 bottom-4 h-4 w-4 text-[#B0B0B0] group-hover:text-primary-accent" />
                  </div>
                </div>
              ))}

            </div>
          )}

          {/* FULLSCREEN LIGHTBOX PREVIEW */}
          {lightboxImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
              onClick={() => setLightboxImage(null)}
            >
              {/* Close Button */}
              <button
                suppressHydrationWarning
                onClick={() => setLightboxImage(null)}
                className="absolute right-4 top-4 p-2 rounded-lg bg-card-bg border border-card-border text-text-secondary hover:text-text-primary hover:bg-card-bg-hover transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div
                className="w-full max-w-4xl max-h-[80vh] flex flex-col items-center justify-center text-center cursor-default space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative border border-white/15 rounded-xl overflow-hidden max-h-[70vh] bg-black">
                  <img
                    src={lightboxImage.imageUrl}
                    alt={lightboxImage.title}
                    className="w-auto h-auto max-w-full max-h-[70vh] object-contain"
                  />
                </div>
                
                {/* Details Footer */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-primary-accent uppercase tracking-widest px-2.5 py-0.5 rounded bg-primary-accent/15 border border-primary-accent/25">
                    {lightboxImage.category}
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {lightboxImage.title}
                  </h3>
                  <p className="text-[10px] text-[#B0B0B0] font-mono">
                    Academic Session: {lightboxImage.sessionId}
                  </p>
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
