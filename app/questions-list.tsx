"use client";
import { useState, useEffect } from "react";

type Question = { id: string; body: string; author: string | null };

export default function QuestionsList({
  initialQuestions,
}: {
  initialQuestions: Question[];
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [draft, setDraft] = useState("");

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  async function submit() {
    if (!draft.trim()) return;

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: draft }),
    });
    const created = await res.json();

    setQuestions((qs) => [created, ...qs]); // show it at the top, no reload
    setDraft("");
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {hydrated ? "Interactive ✓" : "Loading interactivity…"}
      </p>

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask a question…"
          className="flex-1 rounded-md border px-3 py-2"
        />
        <button onClick={submit} className="rounded-md border px-4 py-2">
          Ask
        </button>
      </div>

      <ul className="space-y-3">
        {questions.map((q) => (
          <li key={q.id} className="rounded-lg border p-3">
            {q.body}
          </li>
        ))}
      </ul>
    </div>
  );
}
