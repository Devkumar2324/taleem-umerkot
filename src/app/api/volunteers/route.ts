// ============================================================
// VOLUNTEER API ROUTE
// ------------------------------------------------------------
// This file handles volunteer teachers who register to help
// students in Umerkot.
//
// GET  -> returns ALL volunteers (so students can see who can help)
// POST -> adds a NEW volunteer to the database
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all volunteers (sorted by newest first)
export async function GET() {
  try {
    const volunteers = await db.volunteer.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return NextResponse.json(
      { error: "Failed to fetch volunteers" },
      { status: 500 }
    );
  }
}

// POST a new volunteer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation — make sure required fields are present
    if (!body.name || !body.subject || !body.phone) {
      return NextResponse.json(
        { error: "Name, subject and phone are required" },
        { status: 400 }
      );
    }

    const volunteer = await db.volunteer.create({
      data: {
        name: body.name,
        subject: body.subject,
        phone: body.phone,
        mode: body.mode || "online",
      },
    });

    return NextResponse.json(volunteer, { status: 201 });
  } catch (error) {
    console.error("Error creating volunteer:", error);
    return NextResponse.json(
      { error: "Failed to create volunteer" },
      { status: 500 }
    );
  }
}
