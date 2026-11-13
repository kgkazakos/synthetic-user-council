import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import {
  ARCHETYPES,
  buildPersonaPrompt,
  buildSynthesisPrompt,
  type ResearchBrief,
  type PersonaResponse,
  type Archetype,
} from "@/lib/prompts";

console.log("Route module loaded, GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);

const GEMINI_MODEL = "gemini-4-argon";

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  return new GoogleGenerativeAI(apiKey);
}

function encodeEvent(data: object): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(data) + "\n");
}

function safeParseJSON<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    try {
      const cleaned = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      return JSON.parse(cleaned) as T;
    } catch {
      try {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]) as T;
        return null;
      } catch {
        console.error("JSON parse failed for text:", text.slice(0, 200));
        return null;
      }
    }
  }
}

async function callGemini(
  client: GoogleGenerativeAI,
  prompt: string,
  maxTokens = 1024
): Promise<string> {
  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: maxTokens,
    },
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
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

  if (
    !brief.researchQuestion ||
    !brief.productContext ||
    !brief.targetAudience
  ) {
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
          const rawText = await callGemini(client, prompt, 4096);

          const parsed = safeParseJSON<{
            reaction: string;
            keyConcern: string;
            challengeToResearcher: string;
          }>(rawText);


          const personaResponse: PersonaResponse = {
            archetype: archetype as Archetype,
            reaction: parsed?.reaction ?? "Unable to generate response.",
            keyConcern: parsed?.keyConcern ?? (parsed as any)?.key_concern ?? "",
            challengeToResearcher:
              parsed?.challengeToResearcher ??
              (parsed as any)?.challenge_to_researcher ??
              (parsed as any)?.challenge ??
              "",
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
        const synthRaw = await callGemini(client, synthesisPrompt, 4096);

        const synthesis = safeParseJSON<{
          councilSummary: string;
          blindSpots: string[];
          challengedAssumptions: string[];
          suggestedQuestions: string[];
          segmentsToPrioritise: string[];
        }>(synthRaw);

  
        controller.enqueue(
          encodeEvent({ type: "synthesis_complete", data: synthesis })
        );

        controller.enqueue(encodeEvent({ type: "done" }));
      } catch (error) {
        console.error("Council route error:", error);
        controller.enqueue(
          encodeEvent({
            type: "error",
            message:
              error instanceof Error
                ? error.message
                : "Unknown error occurred",
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