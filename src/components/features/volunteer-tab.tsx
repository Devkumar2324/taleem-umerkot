"use client";

// ============================================================
// VOLUNTEER TAB — Volunteer Teacher Connection
// ------------------------------------------------------------
// This component lets:
//  - Citizens SEE all volunteer teachers (so they can contact them)
//  - New volunteers REGISTER to help students
// ============================================================

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2, Phone, BookMarked } from "lucide-react";

// Shape of a volunteer (must match the API response)
type Volunteer = {
  id: string;
  name: string;
  subject: string;
  phone: string;
  mode: string;
  createdAt: string;
};

export function VolunteerTab() {
  // ---- State ----
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  // Form fields for a new volunteer
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState("online");
  const [submitting, setSubmitting] = useState(false);

  // ---- Functions ----

  // Load all volunteers from the API when the page loads
  async function loadVolunteers() {
    setLoading(true);
    try {
      const res = await fetch("/api/volunteers");
      const data = await res.json();
      setVolunteers(data);
    } catch {
      console.error("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  }

  // Submit a new volunteer to the API
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !subject || !phone) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, subject, phone, mode }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to register.");
        return;
      }
      // Clear the form
      setName("");
      setSubject("");
      setPhone("");
      setMode("online");
      // Reload the list to show the new volunteer
      await loadVolunteers();
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Run loadVolunteers once when the component first shows up
  useEffect(() => {
    loadVolunteers();
  }, []);

  // ---- What to show ----
  return (
    <div className="space-y-6">
      {/* Register form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Users className="size-5" />
            Become a Volunteer Teacher
          </CardTitle>
          <CardDescription>
            Share your knowledge. Help a child learn in Umerkot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="v-name">Full Name</Label>
                <Input
                  id="v-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ayesha Khan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-subject">Subject You Teach</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger id="v-subject" className="w-full">
                    <SelectValue placeholder="Choose subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Math">Math</SelectItem>
                    <SelectItem value="Urdu">Urdu</SelectItem>
                    <SelectItem value="Sindhi">Sindhi</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="v-phone">Phone Number</Label>
                <Input
                  id="v-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0300 1234567"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-mode">Teaching Mode</Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger id="v-mode" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online (phone/video call)</SelectItem>
                    <SelectItem value="in-person">In Person (face to face)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full sm:w-auto" size="lg">
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register as Volunteer"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* List of volunteers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <BookMarked className="size-5" />
            Available Volunteers
          </CardTitle>
          <CardDescription>
            Contact a volunteer to arrange lessons for a child.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              <span className="ml-2">Loading volunteers...</span>
            </div>
          ) : volunteers.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No volunteers registered yet. Be the first to help!
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 max-h-[500px] overflow-y-auto pr-1">
              {volunteers.map((v) => (
                <div
                  key={v.id}
                  className="rounded-lg border p-4 transition hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{v.name}</p>
                      <p className="text-sm text-muted-foreground">{v.subject}</p>
                    </div>
                    <Badge variant={v.mode === "online" ? "default" : "secondary"}>
                      {v.mode === "online" ? "Online" : "In Person"}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <Phone className="size-4 text-primary" />
                    <a href={`tel:${v.phone}`} className="text-primary hover:underline">
                      {v.phone}
                    </a>
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
