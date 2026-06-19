"use client";

import React, { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  connections: number[];
  pulseProgress: number[];
  pulseSpeed: number[];
}

export default function PCBBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Grid nodes representing terminal junctions on a PCB
    const nodes: Node[] = [];
    const numNodes = 40;

    // Generate randomly positioned nodes aligned to a loose grid
    const cols = Math.floor(width / 150);
    const rows = Math.floor(height / 150);
    
    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r <= rows; r++) {
        if (Math.random() > 0.6) {
          nodes.push({
            x: c * 150 + (Math.random() - 0.5) * 80,
            y: r * 150 + (Math.random() - 0.5) * 80,
            connections: [],
            pulseProgress: [],
            pulseSpeed: []
          });
        }
      }
    }

    // Connect close nodes orthogonally or diagonally (representing PCB traces)
    for (let i = 0; i < nodes.length; i++) {
      const nodeA = nodes[i];
      const maxConnections = Math.floor(Math.random() * 2) + 1; // 1 to 2 connections per node
      let connectionsCount = 0;

      // Find closest nodes
      const distances = nodes
        .map((nodeB, idx) => ({ idx, dist: Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y) }))
        .filter(item => item.idx !== i && item.dist < 220)
        .sort((a, b) => a.dist - b.dist);

      for (const d of distances) {
        if (connectionsCount >= maxConnections) break;
        if (!nodes[d.idx].connections.includes(i)) {
          nodeA.connections.push(d.idx);
          nodeA.pulseProgress.push(Math.random());
          nodeA.pulseSpeed.push(0.002 + Math.random() * 0.004);
          connectionsCount++;
        }
      }
    }

    // Handle Resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    const animate = () => {
      const bgColor = "#050505";
      const gridColor = "rgba(255, 255, 255, 0.012)";
      const traceColor = "rgba(255, 255, 255, 0.035)";
      const pulseColor = "#D7FF00";
      const padColor = "rgba(255, 255, 255, 0.07)";
      const padBorderColor = "rgba(215, 255, 0, 0.25)";

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Draw faint background grid
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      const gridSize = 50;
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

      // Draw PCB copper traces
      ctx.lineWidth = 1.5;
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = 0; j < nodeA.connections.length; j++) {
          const nodeB = nodes[nodeA.connections[j]];
          
          // Outer sheath trace
          ctx.strokeStyle = traceColor;
          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          // Draw orthogonal trace (corner joint) instead of straight line to mimic PCB layouts
          const midX = (nodeA.x + nodeB.x) / 2;
          ctx.lineTo(midX, nodeA.y);
          ctx.lineTo(midX, nodeB.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          ctx.stroke();

          // Draw the neon glowing pulse flowing along the trace
          let progress = nodeA.pulseProgress[j];
          progress += nodeA.pulseSpeed[j];
          if (progress > 1) progress = 0;
          nodeA.pulseProgress[j] = progress;

          // Calculate current coordinate of the pulse
          let px = 0;
          let py = 0;
          if (progress < 0.5) {
            // Flowing on first segment (horizontal)
            const subProg = progress / 0.5;
            px = nodeA.x + (midX - nodeA.x) * subProg;
            py = nodeA.y;
          } else {
            // Flowing on second segment (vertical to destination)
            const subProg = (progress - 0.5) / 0.5;
            px = midX + (nodeB.x - midX) * subProg;
            py = nodeA.y + (nodeB.y - nodeA.y) * subProg;
          }

          // Render glowing pulse node
          ctx.fillStyle = pulseColor;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.shadowColor = pulseColor;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      }

      // Draw copper pads (junctions)
      for (const node of nodes) {
        ctx.fillStyle = padColor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = padBorderColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 7, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-50 w-full h-full block pointer-events-none"
      />
    </div>
  );
}
