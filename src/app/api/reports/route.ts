// ============================================================
// SCHOOL REPORT API ROUTE
// ------------------------------------------------------------
// This file handles reports about school problems in Umerkot
// (e.g. no electricity, no water, missing teachers).
//
// GET  -> returns ALL reports (so everyone can see what needs fixing)
// POST -> adds a NEW report from a citizen
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all school reports (sorted by newest first)
export async function GET() {
  try {
    const reports = await db.schoolReport.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

// POST a new school report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation — make sure required fields are present
    if (!body.schoolName || !body.problem || !body.details) {
      return NextResponse.json(
        { error: "School name, problem type and details are required" },
        { status: 400 }
      );
    }

    const report = await db.schoolReport.create({
      data: {
        schoolName: body.schoolName,
        problem: body.problem,
        details: body.details,
        status: "pending", // every new report starts as "pending"
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
