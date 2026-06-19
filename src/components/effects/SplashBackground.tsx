"use client";

import React, { useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
}

interface CyberNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
}

export default function SplashBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Cybernetic nodes floating in background
    const nodes: CyberNode[] = [];
    const numNodes = 35;
    
    // Laser scanline y coordinate
    let scanlineY = 0;
    const scanlineSpeed = 2.5;

    // Spark particles that fly towards the center
    const sparks: Spark[] = [];

    // Initialize nodes
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        baseAlpha: 0.15 + Math.random() * 0.3,
      });
    }

    // Helper to add sparks converging to the center
    const spawnSpark = () => {
      const centerX = width / 2;
      const centerY = height / 2;
      // Spawn on a large circle radius
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.max(width, height) * 0.6;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      // Calculate velocity vector pointing to center
      const speed = 2 + Math.random() * 3;
      const vx = -Math.cos(angle) * speed;
      const vy = -Math.sin(angle) * speed;

      sparks.push({
        x,
        y,
        vx,
        vy,
        size: Math.random() * 2 + 1,
        alpha: 1,
        decay: 0.005 + Math.random() * 0.01,
      });
    };

    // Handle Window Resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    const animate = () => {
      const bgColor = "#050505";
      const primaryColorRGB = "215, 255, 0";
      const primaryHex = "#D7FF00";

      // Solid backdrop
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Draw glowing background grid
      ctx.strokeStyle = `rgba(${primaryColorRGB}, 0.02)`;
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw cyber nodes and lines
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Move nodes slowly
        node.x += node.vx;
        node.y += node.vy;

        // Boundaries check
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw node
        ctx.fillStyle = `rgba(${primaryColorRGB}, ${node.baseAlpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.08;
            ctx.strokeStyle = `rgba(${primaryColorRGB}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }

      // 3. Spawns and animate converging sparks
      if (Math.random() < 0.15) {
        spawnSpark();
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.x += spark.vx;
        spark.y += spark.vy;
        
        // Fade out as it approaches the center
        const distToCenter = Math.hypot(spark.x - centerX, spark.y - centerY);
        
        // If close to center or decay ends, remove it
        if (distToCenter < 60 || spark.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        // Draw spark with glow
        ctx.fillStyle = `rgba(${primaryColorRGB}, ${spark.alpha})`;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.shadowColor = primaryHex;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }

      // 4. Sweep laser scanline
      scanlineY += scanlineSpeed;
      if (scanlineY > height) {
        scanlineY = 0;
      }
      
      // Draw scanline
      const scanGradient = ctx.createLinearGradient(0, scanlineY - 40, 0, scanlineY + 40);
      scanGradient.addColorStop(0, `rgba(${primaryColorRGB}, 0)`);
      scanGradient.addColorStop(0.5, `rgba(${primaryColorRGB}, 0.05)`);
      scanGradient.addColorStop(1, `rgba(${primaryColorRGB}, 0)`);
      
      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanlineY - 40, width, 80);

      // Fine bright sweep line
      ctx.strokeStyle = `rgba(${primaryColorRGB}, 0.12)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanlineY);
      ctx.lineTo(width, scanlineY);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-none z-0"
    />
  );
}
