"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glowOnHover?: boolean;
  pulsingBorder?: boolean;
  children: React.ReactNode;
}

export function Card({
  hoverEffect = true,
  glowOnHover = false,
  pulsingBorder = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const baseStyles = "glass-panel rounded-2xl p-6 overflow-hidden relative";
  
  const interactionStyles = hoverEffect 
    ? "glass-panel-hover" 
    : "";

  const glowStyles = glowOnHover 
    ? "glow-accent-hover" 
    : "";

  const borderStyles = pulsingBorder 
    ? "border-pulsing" 
    : "";

  const combinedStyles = `${baseStyles} ${interactionStyles} ${glowStyles} ${borderStyles} ${className}`;

  return (
    <div className={combinedStyles} {...props}>
      {children}
    </div>
  );
}
