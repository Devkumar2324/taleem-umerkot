// ============================================================
// AI QUIZ API ROUTE
// ------------------------------------------------------------
// This route uses the AI (z-ai-web-dev-sdk) to generate a
// short quiz for students in Umerkot.
//
// The student picks a SUBJECT (Urdu, Sindhi, or Math) and a
// LEVEL (Beginner, Intermediate). The AI returns 3 simple
// multiple-choice questions in JSON format.
//
// POST body: { subject: string, level: string }
// Response:  { questions: [{ question, options[], answerIndex }] }
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

// A quiz question returned by the AI
type QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number; // 0-based index of the correct option
};

export async function POST(request: NextRequest) {
  try {
    const { subject, level } = await request.json();

    // Make sure the student picked a subject and level
    if (!subject || !level) {
      return NextResponse.json(
        { error: "Please choose both subject and level" },
        { status: 400 }
      );
    }

    // Create the AI client
    const zai = await ZAI.create();

    // Tell the AI exactly what to make and how to format it
    const prompt = `You are a kind teacher helping students in Umerkot, Sindh.
Create 3 simple multiple-choice questions for a ${level} level ${subject} student.

Rules:
- Keep questions short and easy to understand.
- Use simple words.
- Each question must have exactly 4 options.
- Only ONE option should be correct.

Return ONLY valid JSON in this exact format (no extra text, no markdown):
{
  "questions": [
    {
      "question": "The question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 0
    }
  ]
}

The "answerIndex" is the position of the correct answer (0, 1, 2, or 3).
For Urdu and Sindhi subjects, write the questions and options in that language.
For Math, use English with numbers.`;

    // Ask the AI to generate the quiz
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content:
            "You are a helpful teacher who creates simple quizzes for children. Always return ONLY valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      thinking: { type: "disabled" },
    });

    const aiText = completion.choices[0]?.message?.content || "";

    // The AI sometimes wraps JSON in markdown code blocks — clean that up
    const cleaned = aiText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let parsed: { questions: QuizQuestion[] };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // If JSON parsing fails, return a friendly error
      return NextResponse.json(
        { error: "The AI returned an invalid quiz format. Please try again." },
        { status: 500 }
      );
    }

    // Make sure we got at least one question
    if (!parsed.questions || parsed.questions.length === 0) {
      return NextResponse.json(
        { error: "No questions were generated. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz. Please try again." },
      { status: 500 }
    );
  }
}
