import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextResponse } from "next/server";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: `You are the AI Assistant for 'DevDeploy', a premium Kubernetes Platform-as-a-Service (PaaS) created by Ojas. 
      You help users deploy their GitHub repositories, monitor metrics, and view real-time build logs. 
      Be incredibly helpful, concise, and professional. 
      If they ask about the app's architecture, explain that the Frontend is built with Next.js, Clerk, and TailwindCSS, and the Backend is a fully serverless, real-time database powered by Convex.
      If they ask about deployment pipelines, explain that DevDeploy clones their repo, builds a Docker image, pushes to a registry, and spins up Kubernetes pods with load balancing.
      Use Markdown formatting (like bolding, lists, and code blocks) where appropriate.`,
      messages,
    });

    return NextResponse.json({ success: true, message: text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate response" },
      { status: 500 }
    );
  }
}
