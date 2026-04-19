import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Moon, Sun, Link2 } from "lucide-react";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard?.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const location = useLocation();
  const getContextLabel = () => {
    const p = location.pathname;
    if (p === "/") return "Nova Systems · PI 24.2 · Week 7 of 10";
    if (p === "/programs") return "Nova Systems · Programs · 8 active";
    if (p === "/risks") return "Nova Systems · Risks & Blockers · 15 open";
    if (p === "/roadmap") return "Nova Systems · Portfolio Roadmap";
    if (p === "/executive-briefing") return "Nova Systems · Executive Briefing · PI 24.2";
    if (p === "/my-approach") return "Nova Systems · My Approach";
    if (p.startsWith("/program/")) return "Nova Systems · Program Detail";
    if (p.startsWith("/risk/")) return "Nova Systems · Risk Detail";
    return "Nova Systems · PI 24.2 · Week 7 of 10";
  };
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("programiq-theme") === "dark"; } catch { return false; }
  });
  const [welcomeDismissed, setWelcomeDismissed] = useState(() => {
    try {
      const t = localStorage.getItem("programiq-welcome-ts");
      if (!t) return false;
      return (Date.now() - parseInt(t)) < 24 * 60 * 60 * 1000;
    } catch { return false; }
  });
  // Apply dark class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("programiq-theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

  // Keyboard shortcuts — use window.location so no Router dependency needed
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      switch (e.key.toLowerCase()) {
        case "d": window.location.href = "/"; break;
        case "p": window.location.href = "/programs"; break;
        case "r": window.location.href = "/risks"; break;
        case "e": window.location.href = "/executive-briefing"; break;
        case "m": window.location.href = "/my-approach"; break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const dismissWelcome = () => {
    setWelcomeDismissed(true);
    try { localStorage.setItem("programiq-welcome-ts", Date.now().toString()); } catch {}
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">

          {/* Header */}
          <header className="h-12 flex items-center justify-between border-b border-border/60 bg-card px-4 gap-3">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <span className="text-xs text-muted-foreground hidden sm:block">{getContextLabel()}</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Keyboard shortcut hint */}
              <span className="text-[10px] text-muted-foreground/50 hidden lg:block">
                Press <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">D</kbd> Dashboard &nbsp;
                <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">P</kbd> Programs &nbsp;
                <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">R</kbd> Risks &nbsp;
                <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">E</kbd> Exec Briefing &nbsp;
                <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">M</kbd> My Approach
              </span>
              {/* Share link */}
              <button
                onClick={copyLink}
                className="h-7 flex items-center gap-1.5 px-2 rounded-md hover:bg-muted transition-colors text-[10px] text-muted-foreground"
                title="Copy link to this page"
              >
                <Link2 className="h-3.5 w-3.5" />
                {copied ? "Copied!" : "Share"}
              </button>
              {/* Dark mode toggle */}
              <button
                onClick={() => setDark(d => !d)}
                className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                title="Toggle dark mode"
              >
                {dark
                  ? <Sun className="h-3.5 w-3.5 text-muted-foreground" />
                  : <Moon className="h-3.5 w-3.5 text-muted-foreground" />
                }
              </button>
            </div>
          </header>

          {/* Welcome banner — first visit only */}
          {!welcomeDismissed && (
            <div className="bg-[#2d5fa8] text-white px-4 py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-bold uppercase tracking-widest shrink-0 opacity-80">Portfolio Demo</span>
                <p className="text-xs leading-relaxed">
                  <strong>Nova Systems</strong> is a fictional Series C AI/SaaS company. This portfolio simulates a real program management scenario — ML Platform deployment blocked by SOC 2 compliance, with $3.2M Q2 ARR at risk.
                  Built by Jessica Manzo to demonstrate SAFe &amp; PMI methodology. Best viewed on desktop.
                </p>
              </div>
              <button
                onClick={dismissWelcome}
                className="shrink-0 text-white/70 hover:text-white text-xs underline"
              >
                Got it
              </button>
            </div>
          )}

          <main className="flex-1 overflow-x-hidden overflow-y-auto dot-grid">
            {children}
          </main>



        </div>
      </div>
    </SidebarProvider>
  );
}
