"use client";

import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "neon";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  target,
  rel,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-mono text-xs uppercase tracking-widest rounded-lg font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-primary-accent text-black hover:bg-black hover:text-primary-accent hover:shadow-[0_0_20px_rgba(215,255,0,0.4)] border border-primary-accent",
    secondary:
      "bg-card-bg text-text-primary hover:bg-card-bg-hover border border-card-border",
    outline:
      "bg-transparent text-text-primary border border-card-border hover:border-primary-accent hover:text-primary-accent",
    neon:
      "bg-transparent text-primary-accent border border-primary-accent/40 hover:border-primary-accent hover:shadow-[0_0_15px_rgba(215,255,0,0.35)] hover:bg-primary-accent/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-sm",
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedStyles} target={target} rel={rel}>
        {children}
      </Link>
    );
  }

  return (
    <button suppressHydrationWarning className={combinedStyles} {...props}>
      {children}
    </button>
  );
}
