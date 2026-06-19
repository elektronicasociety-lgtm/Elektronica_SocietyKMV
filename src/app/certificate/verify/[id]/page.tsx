"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PCBBackground from "@/components/effects/PCBBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { verifyCertificate } from "@/lib/firebase";
import { ShieldCheck, ShieldAlert, Award, Calendar, User, CornerUpLeft } from "lucide-react";

interface CertificateData {
  id: string;
  recipientName: string;
  eventName: string;
  issueDate: string;
  role: string;
}

export default function CertificateVerify() {
  const params = useParams();
  const certId = params.id as string;
  
  const [certData, setCertData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      if (!certId) return;
      try {
        const result = await verifyCertificate(certId);
        setCertData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, [certId]);

  return (
    <>
      <PCBBackground />
      <Navbar />

      <main className="flex-grow pt-28 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full px-4 text-center">
          
          {loading ? (
            <div className="text-xs font-mono text-[#B0B0B0] animate-pulse">
              DECRYPTING CREDENTIAL SIGNATURES...
            </div>
          ) : certData ? (
            // VALID CERTIFICATE SCREEN
            <Card hoverEffect={false} className="border border-emerald-500/30 bg-emerald-500/[0.02] p-8 space-y-6">
              <div className="space-y-2">
                <ShieldCheck className="h-14 w-14 text-emerald-400 mx-auto animate-pulse" />
                <h2 className="text-lg font-bold text-text-primary uppercase tracking-wider font-mono">
                  Credential Authentic
                </h2>
                <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[9px] font-mono uppercase">
                  Verified Signature OK
                </span>
              </div>

              {/* Data matrix */}
              <div className="space-y-4 text-left border-y border-card-border py-5 text-xs text-text-secondary">
                
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px]">VERIFICATION ID:</span>
                  <span className="font-mono font-bold text-text-primary uppercase">{certData.id}</span>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <User className="h-4 w-4 text-primary-accent shrink-0" />
                  <div>
                    <span className="block text-[9px] font-mono text-text-secondary uppercase">RECIPIENT NAME</span>
                    <span className="font-bold text-text-primary text-sm">{certData.recipientName}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <Award className="h-4 w-4 text-primary-accent shrink-0" />
                  <div>
                    <span className="block text-[9px] font-mono text-text-secondary uppercase">EVENT & ROLE</span>
                    <span className="font-bold text-text-primary text-sm">{certData.eventName} - {certData.role}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <Calendar className="h-4 w-4 text-primary-accent shrink-0" />
                  <div>
                    <span className="block text-[9px] font-mono text-text-secondary uppercase">DATE OF ISSUANCE</span>
                    <span className="font-bold text-text-primary text-sm">
                      {new Date(certData.issueDate).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric"
                      })}
                    </span>
                  </div>
                </div>

              </div>

              <div className="pt-2 flex flex-col gap-2">
                <p className="text-[10px] text-text-secondary font-mono">
                  This document serves as verification of participation / completion of academic activities conducted by the Electronics Society.
                </p>
                <Button variant="outline" size="sm" href="/" className="mt-4">
                  <CornerUpLeft className="mr-2 h-3.5 w-3.5" /> Return to Terminal
                </Button>
              </div>

            </Card>
          ) : (
            // INVALID CERTIFICATE SCREEN
            <Card hoverEffect={false} className="border border-rose-500/30 bg-rose-500/[0.02] p-8 space-y-6">
              <div className="space-y-2">
                <ShieldAlert className="h-14 w-14 text-rose-500 mx-auto" />
                <h2 className="text-lg font-bold text-text-primary uppercase tracking-wider font-mono">
                  Verification Failed
                </h2>
                <span className="inline-block px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/25 text-[9px] font-mono uppercase">
                  Signature Verification Error
                </span>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                The verification token <span className="text-text-primary font-mono font-bold">&quot;{certId}&quot;</span> does not match any certificate recorded in the ELEKTRONICA data registers.
              </p>

              <div className="pt-4 border-t border-card-border">
                <Button variant="neon" size="sm" href="/">
                  Return Home
                </Button>
              </div>
            </Card>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
