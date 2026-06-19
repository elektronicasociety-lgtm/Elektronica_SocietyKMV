"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PCBBackground from "@/components/effects/PCBBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Shield, Eye, EyeOff, Terminal, KeyRound } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Check if already authenticated on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAdmin = localStorage.getItem("elektronica_is_admin") === "true";
      if (isAdmin) {
        router.push("/admin/dashboard");
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    // Hardcoded credentials for local simulation fallback (as per setup guideline)
    const mockAdminEmail = "admin@elektronica.com";
    const mockAdminPass = "admin2026_password";

    setTimeout(() => {
      if (email === mockAdminEmail && password === mockAdminPass) {
        localStorage.setItem("elektronica_is_admin", "true");
        localStorage.setItem("elektronica_admin_email", email);
        router.push("/admin/dashboard");
      } else {
        setErrorMsg("CREDENTIALS MISMATCH. ACCESS REJECTED.");
      }
      setSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <PCBBackground />
      <Navbar />

      <main className="flex-grow pt-28 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          
          <Card hoverEffect={false} className="p-8 space-y-6">
            
            {/* Header Logos & Lock */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-32 h-32 flex items-center justify-center">
                  <img src="/college-logo.png" alt="Keshav Mahavidyalaya Logo" className="w-full h-full object-contain" />
                </div>
                <div className="w-24 h-24 flex items-center justify-center">
                  <img src="/society-logo.png" alt="ELEKTRONICA Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight text-text-primary font-display uppercase">
                  Admin Authentication
                </h2>
                <p className="text-[10px] font-mono text-text-secondary flex items-center justify-center space-x-1.5">
                  <Shield className="h-3 w-3 text-primary-accent animate-pulse" />
                  <span>ENTER ACCESS PHRASE FOR GATEWAY AUTHORIZATION</span>
                </p>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-mono text-center flex items-center justify-center space-x-2">
                <Terminal className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-text-secondary">SysAdmin Identity (Email)</label>
                <div className="relative">
                  <input
                    suppressHydrationWarning
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@elektronica.com"
                    className="w-full px-4 py-2.5 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-primary-accent"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-text-secondary">Access Phrase (Password)</label>
                <div className="relative">
                  <input
                    suppressHydrationWarning
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-4 pr-10 py-2.5 bg-card-bg border border-card-border rounded-lg text-xs text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-primary-accent"
                  />
                  <button
                    suppressHydrationWarning
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-text-secondary hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full py-3 mt-4"
                variant="primary"
              >
                {submitting ? "VERIFYING TELEMETRY..." : "ACCESS GATEWAY"}
              </Button>
            </form>

            <div className="text-[9px] font-mono text-text-secondary pt-2 border-t border-card-border text-center flex items-center justify-center space-x-1.5">
              <KeyRound className="h-3.5 w-3.5" />
              <span>Identity mapping restricted to committee members.</span>
            </div>

          </Card>

        </div>
      </main>

      <Footer />
    </>
  );
}
