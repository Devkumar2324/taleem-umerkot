"use client";

// ============================================================
// LEARN TAB — AI-Powered Quiz
// ------------------------------------------------------------
// This component lets a student:
//  1. Pick a subject (Urdu, Sindhi, or Math)
//  2. Pick a level (Beginner or Intermediate)
//  3. Get 3 quiz questions from the AI
//  4. Answer the questions
//  5. See their score
// ============================================================

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Loader2, RefreshCw, Trophy } from "lucide-react";

// Shape of a single quiz question (must match the API response)
type QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
};

export function LearnTab() {
  // ---- State (what the component remembers) ----
  const [subject, setSubject] = useState<string>("");     // e.g. "Math"
  const [level, setLevel] = useState<string>("");          // e.g. "Beginner"
  const [loading, setLoading] = useState(false);           // true while AI thinks
  const [questions, setQuestions] = useState<QuizQuestion[]>([]); // the quiz
  const [answers, setAnswers] = useState<(number | null)[]>([]); // student's answers
  const [submitted, setSubmitted] = useState(false);       // true after they finish

  // ---- Functions ----

  // Call our /api/quiz route to get questions from the AI
  async function startQuiz() {
    if (!subject || !level) return;
    setLoading(true);
    setSubmitted(false);
    setQuestions([]);
    setAnswers([]);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, level }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Something went wrong. Please try again.");
        return;
      }
      setQuestions(data.questions);
      // Start with no answers picked
      setAnswers(new Array(data.questions.length).fill(null));
    } catch {
      alert("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  // Calculate the student's score
  function calculateScore(): number {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answerIndex) correct++;
    });
    return correct;
  }

  // Reset everything so they can take another quiz
  function resetQuiz() {
    setQuestions([]);
    setAnswers([]);
    setSubmitted(false);
  }

  // ---- What to show ----

  // STEP 1: Choose subject and level
  if (questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <BookOpen className="size-5" />
            Start Learning
          </CardTitle>
          <CardDescription>
            Pick a subject and level. The AI teacher will create 3 questions just for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="subject" className="w-full">
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Math">Math</SelectItem>
                <SelectItem value="Urdu">Urdu</SelectItem>
                <SelectItem value="Sindhi">Sindhi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger id="level" className="w-full">
                <SelectValue placeholder="Choose your level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={startQuiz}
            disabled={!subject || !level || loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                AI is preparing your quiz...
              </>
            ) : (
              "Start Quiz"
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // STEP 2: Take the quiz OR see results
  const score = submitted ? calculateScore() : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-primary">
          <span className="flex items-center gap-2">
            <BookOpen className="size-5" />
            {subject} Quiz — {level}
          </span>
          {!submitted && (
            <span className="text-sm font-normal text-muted-foreground">
              {questions.length} questions
            </span>
          )}
        </CardTitle>
        {submitted && (
          <CardDescription className="flex items-center gap-2 text-base font-medium text-foreground">
            <Trophy className="size-5 text-amber-600" />
            You scored {score} out of {questions.length}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((q, qi) => (
          <div key={qi} className="space-y-3 rounded-lg border p-4">
            <p className="font-medium">
              {qi + 1}. {q.question}
            </p>
            <RadioGroup
              value={answers[qi]?.toString() ?? ""}
              onValueChange={(val) => {
                // Save the chosen answer for this question
                const newAnswers = [...answers];
                newAnswers[qi] = parseInt(val);
                setAnswers(newAnswers);
              }}
              disabled={submitted}
            >
              {q.options.map((opt, oi) => {
                const isCorrect = oi === q.answerIndex;
                const isPicked = answers[qi] === oi;
                // Show colors only after submitting
                let colorClass = "";
                if (submitted && isCorrect) colorClass = "text-green-700 font-medium";
                if (submitted && isPicked && !isCorrect) colorClass = "text-red-700";

                return (
                  <div key={oi} className={`flex items-center gap-2 ${colorClass}`}>
                    <RadioGroupItem value={oi.toString()} id={`q${qi}-o${oi}`} />
                    <Label htmlFor={`q${qi}-o${oi}`} className="cursor-pointer">
                      {opt}
                      {submitted && isCorrect && " ✓"}
                      {submitted && isPicked && !isCorrect && " ✗"}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        ))}

        <div className="flex gap-3">
          {!submitted ? (
            <Button
              onClick={() => setSubmitted(true)}
              disabled={answers.some((a) => a === null)}
              className="flex-1"
              size="lg"
            >
              Submit Answers
            </Button>
          ) : (
            <Button onClick={resetQuiz} variant="outline" className="flex-1" size="lg">
              <RefreshCw className="size-4" />
              Take Another Quiz
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
