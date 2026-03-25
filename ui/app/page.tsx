"use client";

import { useState } from "react";
import BriefForm from "@/components/BriefForm";
import PersonaCard, { PersonaCardSkeleton } from "@/components/PersonaCard";
import CouncilOutput from "@/components/CouncilOutput";
import LoadingState from "@/components/LoadingState";
import type { ResearchBrief, PersonaResponse, Archetype } from "@/lib/prompts";

type SessionState = "idle" | "running" | "complete" | "error";

interface CouncilSummary {
  councilSummary: string;
  blindSpots: string[];
  challengedAssumptions: string[];
  suggestedQuestions: string[];
  segmentsToPrioritise: string[];
}

interface StreamEvent {
  type:
    | "persona_start"
    | "persona_complete"
    | "synthesis_start"
    | "synthesis_complete"
    | "done"
    | "error";
  archetype?: Archetype;
  data?: PersonaResponse | CouncilSummary;
  message?: string;
}

export default function Home() {
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [currentArchetype, setCurrentArchetype] = useState<Archetype | null>(null);
  const [completedArchetypes, setCompletedArchetypes] = useState<Archetype[]>([]);
  const [isSynthesising, setIsSynthesising] = useState(false);
  const [personas, setPersonas] = useState<PersonaResponse[]>([]);
  const [summary, setSummary] = useState<CouncilSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(brief: ResearchBrief) {
    setSessionState("running");
    setCurrentArchetype(null);
    setCompletedArchetypes([]);
    setIsSynthesising(false);
    setPersonas([]);
    setSummary(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/council", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;

          let event: StreamEvent;
          try {
            event = JSON.parse(line) as StreamEvent;
          } catch {
            continue;
          }

          switch (event.type) {
            case "persona_start":
              if (event.archetype) {
                setCurrentArchetype(event.archetype);
              }
              break;

            case "persona_complete":
              if (event.data && event.archetype) {
                const personaData = event.data as PersonaResponse;
                setPersonas((prev) => [...prev, personaData]);
                setCompletedArchetypes((prev) => [...prev, event.archetype!]);
                setCurrentArchetype(null);
              }
              break;

            case "synthesis_start":
              setIsSynthesising(true);
              break;

            case "synthesis_complete":
              setSummary(event.data as CouncilSummary);
              setIsSynthesising(false);
              break;

            case "done":
              setSessionState("complete");
              break;

            case "error":
              setErrorMessage(event.message ?? "An unknown error occurred.");
              setSessionState("error");
              break;
          }
        }
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to connect to the council."
      );
      setSessionState("error");
    }
  }

  function handleReset() {
    setSessionState("idle");
    setCurrentArchetype(null);
    setCompletedArchetypes([]);
    setIsSynthesising(false);
    setPersonas([]);
    setSummary(null);
    setErrorMessage(null);
  }

  const isLoading = sessionState === "running";

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <header className="border-b border-border bg-canvas/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif text-xl text-ink">
              Synthetic User Council
            </h1>
            <span className="hidden sm:inline text-xs text-muted border border-border rounded-full px-2.5 py-0.5">
              Research Augmentation
            </span>
          </div>
          <a
            href="https://github.com/kgkazakos/synthetic-user-council"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted hover:text-ink transition-colors duration-150 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 items-start">

          {/* Left column — brief form + status */}
          <div className="space-y-8 lg:sticky lg:top-24">
            {/* Intro */}
            {sessionState === "idle" && (
              <div className="space-y-3">
                <p className="font-serif italic text-2xl text-ink/80 leading-snug">
                  "The most dangerous moment in user research is before you write the first question."
                </p>
                <p className="text-sm text-muted leading-relaxed">
                  Submit a research brief. Five synthetic personas will debate your framing and surface what you&apos;re not asking.
                </p>
              </div>
            )}

            {/* Form */}
            <div className="bg-white border border-border rounded-sm p-6">
              {sessionState === "idle" || sessionState === "error" ? (
                <>
                  <h2 className="font-serif text-lg text-ink mb-5">
                    Research Brief
                  </h2>
                  {sessionState === "error" && errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm">
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  )}
                  <BriefForm onSubmit={handleSubmit} isLoading={false} />
                </>
              ) : (
                <div className="space-y-6">
                  <h2 className="font-serif text-lg text-ink">
                    {sessionState === "complete" ? "Session Complete" : "In Progress"}
                  </h2>
                  <LoadingState
                    currentArchetype={currentArchetype}
                    completedArchetypes={completedArchetypes}
                    isSynthesising={isSynthesising}
                  />
                  {sessionState === "complete" && (
                    <button
                      onClick={handleReset}
                      className="
                        w-full py-2.5 px-4
                        border border-border text-ink
                        text-sm font-medium tracking-wide
                        rounded-sm
                        hover:bg-stone-50 active:scale-[0.99]
                        transition-all duration-150
                      "
                    >
                      New Brief
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Human agency note */}
            <p className="text-xs text-muted leading-relaxed">
              <span className="font-medium text-ink/60">Note:</span> The council challenges your research framing. It does not replace real user studies — it helps you design better ones.
            </p>
          </div>

          {/* Right column — persona cards + synthesis */}
          <div className="space-y-4">
            {/* Skeleton cards while loading */}
            {isLoading &&
              (["Power User", "Casual User", "Skeptic", "Edge Case User", "Lost Beginner"] as Archetype[]).map(
                (archetype) => {
                  if (completedArchetypes.includes(archetype)) return null;
                  if (currentArchetype === archetype || !completedArchetypes.includes(archetype)) {
                    const isActive = currentArchetype === archetype;
                    const isPending = !completedArchetypes.includes(archetype) && currentArchetype !== archetype;
                    if (isPending) return null;
                    return isActive ? (
                      <PersonaCardSkeleton key={archetype} archetype={archetype} />
                    ) : null;
                  }
                }
              )}

            {/* Completed persona cards */}
            {personas.map((persona, index) => (
              <PersonaCard key={persona.archetype} persona={persona} index={index} />
            ))}

            {/* Active skeleton */}
            {isLoading && currentArchetype && !completedArchetypes.includes(currentArchetype) && (
              <PersonaCardSkeleton archetype={currentArchetype} />
            )}

            {/* Synthesis */}
            {summary && <CouncilOutput summary={summary} />}

            {/* Empty state */}
            {sessionState === "idle" && (
              <div className="flex flex-col items-center justify-center py-24 space-y-4 border border-dashed border-border rounded-sm">
                <div className="flex gap-2">
                  {(["Power User", "Casual User", "Skeptic", "Edge Case User", "Lost Beginner"] as Archetype[]).map(
                    (a) => (
                      <div
                        key={a}
                        className="w-2 h-2 rounded-full bg-stone-200"
                      />
                    )
                  )}
                </div>
                <p className="text-sm text-muted text-center max-w-xs leading-relaxed">
                  Five personas are waiting to challenge your assumptions.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-muted">
            Part of the{" "}
            <span className="text-ink font-medium">
              Computational Product Research
            </span>{" "}
            portfolio — Kostas Kazakos, PhD
          </p>
          <p className="text-xs text-muted">
            P1:{" "}
            <a
              href="https://github.com/kgkazakos/causaltrack"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:underline"
            >
              CausalTrack
            </a>{" "}
            · P2: Synthetic User Council
          </p>
        </div>
      </footer>
    </div>
  );
}
