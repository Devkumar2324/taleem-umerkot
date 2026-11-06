"use client";

// ============================================================
// TALEEM UMERKOT — MAIN PAGE
// ------------------------------------------------------------
// This is the homepage of our hackathon project.
// It has 3 main sections shown as TABS:
//   1. Learn    — AI quiz for students
//   2. Volunteer — Volunteer teachers can register
//   3. Report   — Citizens can report school problems
// ============================================================

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Flag, Heart, Sparkles, GraduationCap } from "lucide-react";
import { LearnTab } from "@/components/features/learn-tab";
import { VolunteerTab } from "@/components/features/volunteer-tab";
import { ReportTab } from "@/components/features/report-tab";

export default function Home() {
  return (
    // min-h-screen + flex flex-col so the footer sticks to the bottom
    <div className="min-h-screen flex flex-col bg-background">
      {/* ==================== HEADER ==================== */}
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Taleem Umerkot</h1>
              <p className="text-xs text-muted-foreground leading-tight">
                تعلیم اُميرکوٹ
              </p>
            </div>
          </div>
          <a
            href="#about"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition"
          >
            About
          </a>
        </div>
      </header>

      {/* ==================== HERO ==================== */}
      <section className="border-b bg-gradient-to-b from-accent/50 to-background">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <Sparkles className="size-3" />
            AI for Education in Sindh
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Every child deserves an
            <span className="text-primary"> opportunity to learn.</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
            An AI-powered education platform for the children of Umerkot, Sindh.
            Learn with AI, connect with volunteer teachers, and help fix schools.
          </p>

          {/* Three quick stat cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            <Card className="border-0 shadow-sm bg-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="size-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">AI Learning</p>
                  <p className="text-xs text-muted-foreground">Urdu, Sindhi, Math</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="size-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Volunteers</p>
                  <p className="text-xs text-muted-foreground">Free teaching help</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Flag className="size-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">School Reports</p>
                  <p className="text-xs text-muted-foreground">Track problems</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ==================== MAIN TABS ==================== */}
      <main className="mx-auto max-w-3xl w-full px-4 py-8 flex-1">
        <Tabs defaultValue="learn" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="learn" className="py-2.5">
              <BookOpen className="size-4" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
            <TabsTrigger value="volunteer" className="py-2.5">
              <Users className="size-4" />
              <span className="hidden sm:inline">Volunteer</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="py-2.5">
              <Flag className="size-4" />
              <span className="hidden sm:inline">Report</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: AI Learning */}
          <TabsContent value="learn" className="mt-6">
            <LearnTab />
          </TabsContent>

          {/* Tab 2: Volunteer Teachers */}
          <TabsContent value="volunteer" className="mt-6">
            <VolunteerTab />
          </TabsContent>

          {/* Tab 3: School Problem Reporting */}
          <TabsContent value="report" className="mt-6">
            <ReportTab />
          </TabsContent>
        </Tabs>

        {/* ==================== ABOUT SECTION ==================== */}
        <section id="about" className="mt-12 scroll-mt-20">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <Heart className="size-5" />
                About this project
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Taleem Umerkot</strong> is an
                AI-powered education platform built for the children of Umerkot,
                Sindh. Children in this region face limited access to quality
                education, a shortage of qualified teachers, and poor school
                facilities. This MVP focuses on three things: helping students
                learn with AI, connecting them with volunteer teachers, and
                letting citizens report school problems so they can be fixed.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { label: "Languages", value: "Urdu, Sindhi, English" },
                  { label: "Built for", value: "Low-end phones" },
                  { label: "Tech", value: "Next.js + AI" },
                  { label: "Status", value: "MVP Demo" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t bg-card mt-auto">
        <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            Built with <Heart className="inline size-3 text-primary" /> for the children of Umerkot, Sindh.
          </p>
          <p className="mt-1 text-xs">
            Hackathon Project • Taleem Umerkot • تعلیم اُميرکوٹ
          </p>
        </div>
      </footer>
    </div>
  );
}
