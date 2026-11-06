"use client";

// ============================================================
// REPORT TAB — School Problem Reporting
// ------------------------------------------------------------
// This component lets:
//  - Citizens REPORT problems at schools (no electricity, water,
//    washrooms, teachers, etc.)
//  - Everyone SEE all reports and their status
// ============================================================

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Flag, Loader2, MapPin, Clock } from "lucide-react";

// Shape of a report (must match the API response)
type SchoolReport = {
  id: string;
  schoolName: string;
  problem: string;
  details: string;
  status: string;
  createdAt: string;
};

// Helper to make a date readable (e.g. "Nov 4, 2026")
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Color for each status so people can see progress at a glance
function statusVariant(status: string): "default" | "secondary" | "outline" {
  if (status === "resolved") return "default";
  if (status === "in-progress") return "secondary";
  return "outline";
}

export function ReportTab() {
  // ---- State ----
  const [reports, setReports] = useState<SchoolReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Form fields for a new report
  const [schoolName, setSchoolName] = useState("");
  const [problem, setProblem] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ---- Functions ----

  // Load all reports from the API
  async function loadReports() {
    setLoading(true);
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();
      setReports(data);
    } catch {
      console.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }

  // Submit a new report
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!schoolName || !problem || !details) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolName, problem, details }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to submit report.");
        return;
      }
      // Clear the form
      setSchoolName("");
      setProblem("");
      setDetails("");
      // Reload the list to show the new report
      await loadReports();
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Load reports when the component first shows up
  useEffect(() => {
    loadReports();
  }, []);

  // ---- What to show ----
  return (
    <div className="space-y-6">
      {/* Report form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Flag className="size-5" />
            Report a School Problem
          </CardTitle>
          <CardDescription>
            Help improve schools in Umerkot. Report missing facilities or other problems.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="r-school">School Name</Label>
              <Input
                id="r-school"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g. Government Girls Primary School, Umerkot"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="r-problem">Type of Problem</Label>
              <Select value={problem} onValueChange={setProblem}>
                <SelectTrigger id="r-problem" className="w-full">
                  <SelectValue placeholder="Choose problem type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricity">No Electricity</SelectItem>
                  <SelectItem value="water">No Clean Water</SelectItem>
                  <SelectItem value="washroom">No Washrooms</SelectItem>
                  <SelectItem value="teachers">Shortage of Teachers</SelectItem>
                  <SelectItem value="building">Building Needs Repair</SelectItem>
                  <SelectItem value="furniture">No Furniture</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="r-details">Details</Label>
              <Textarea
                id="r-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe the problem. When did you notice it? How bad is it?"
                rows={4}
                required
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full sm:w-auto" size="lg">
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* List of reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <MapPin className="size-5" />
            Reported Problems
          </CardTitle>
          <CardDescription>
            See problems reported by the community and their status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              <span className="ml-2">Loading reports...</span>
            </div>
          ) : reports.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No problems reported yet. Be the first to help improve a school.
            </p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {reports.map((r) => (
                <div key={r.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{r.schoolName}</p>
                      <p className="text-sm capitalize text-muted-foreground">
                        {r.problem.replace("-", " ")}
                      </p>
                    </div>
                    <Badge variant={statusVariant(r.status)} className="capitalize shrink-0">
                      {r.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm">{r.details}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {formatDate(r.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
