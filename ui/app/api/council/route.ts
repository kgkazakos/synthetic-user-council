import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";
import {
  ARCHETYPES,
  buildPersonaPrompt,
  buildSynthesisPrompt,
  type ResearchBrief,
  type PersonaResponse,
  type Archetype,
} from "@/lib/prompts";

// Gemini model — matches the Python CLI
const GEMINI_MODEL = "models/gemini-3.1-pro-preview";

// API key never touches the client — server route only
function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenAI({ apiKey });
}

function encodeEvent(data: object): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(data) + "\n");
}

function safeParseJSON<T>(text: string): T | null {
  try {
    const cleaned = text
      .replace(/^```json\n?/, "")
      .replace(/^```\n?/, "")
      .replace(/\n?```$/, "")
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

async function callGemini(client: GoogleGenAI, prompt: string): Promise<string> {
  const response = await client.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  });
  return response.text ?? "";
}

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "GEMINI_API_KEY is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let brief: ResearchBrief;
  try {
    brief = (await req.json()) as ResearchBrief;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!brief.researchQuestion || !brief.productContext || !brief.targetAudience) {
    return new Response(
      JSON.stringify({ error: "Missing required brief fields" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const personaResponses: PersonaResponse[] = [];

      try {
        const client = getClient();

        for (const archetype of ARCHETYPES) {
          controller.enqueue(
            encodeEvent({ type: "persona_start", archetype })
          );

          const prompt = buildPersonaPrompt(archetype, brief);
          const rawText = await callGemini(client, prompt);

          const parsed = safeParseJSON<{
            reaction: string;
            keyConcern: string;
            challengeToResearcher: string;
          }>(rawText);

          const personaResponse: PersonaResponse = {
            archetype: archetype as Archetype,
            reaction: parsed?.reaction ?? "Unable to generate response.",
            keyConcern: parsed?.keyConcern ?? "",
            challengeToResearcher: parsed?.challengeToResearcher ?? "",
          };

          personaResponses.push(personaResponse);

          controller.enqueue(
            encodeEvent({
              type: "persona_complete",
              archetype,
              data: personaResponse,
            })
          );
        }

        // Synthesis
        controller.enqueue(encodeEvent({ type: "synthesis_start" }));

        const synthesisPrompt = buildSynthesisPrompt(brief, personaResponses);

        // Synthesis needs more tokens
        const synthResponse = await client.models.generateContent({
          model: GEMINI_MODEL,
          contents: synthesisPrompt,
          config: {
            temperature: 0.5,
            maxOutputTokens: 2048,
          },
        });

        const synthRaw = synthResponse.text ?? "";
        const synthesis = safeParseJSON<{
          councilSummary: string;
          blindSpots: string[];
          challengedAssumptions: string[];
          suggestedQuestions: string[];
          segmentsToPrioritise: string[];
        }>(synthRaw);

        controller.enqueue(
          encodeEvent({
            type: "synthesis_complete",
            data: synthesis,
          })
        );

        controller.enqueue(encodeEvent({ type: "done" }));
      } catch (error) {
        controller.enqueue(
          encodeEvent({
            type: "error",
            message:
              error instanceof Error ? error.message : "Unknown error occurred",
          })
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
