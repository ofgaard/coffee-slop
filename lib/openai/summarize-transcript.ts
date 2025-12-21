import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});


type ArticleResult = {
  title: string;
  summary: string;
  article: string;
  wordCount: number;
};

export async function summarizeTranscript(transcript: string): Promise<ArticleResult> {
  if (!transcript.trim()) {
    throw new Error("Transcript is empty");
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "article",
        schema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Concise, informative article title",
            },
            summary: {
              type: "string",
              description: "Short paragraph summarizing the article",
            },
            article: {
              type: "string",
              description: "The full article content, max 500 words",
            },
            wordCount: {
              type: "number",
              description: "Total word count of the article field",
            },
          },
          required: ["title", "summary", "article", "wordCount"],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: "system",
        content: `
You are a professional writer.
Turn video transcripts into clear, well-structured short articles that highlight the main points of the original material.
Your writing style should be neutral and informative, not AI-slop.
`,
      },
      {
        role: "user",
        content: `
Write an article (max 500 words) based on the following transcript.
It should get to the core of the creator's points and present them clearly and concisely.

Transcript:
"""
${transcript}
"""
`,
      },
    ],
  });

  const message = response.choices[0].message;

  if (!message?.content) {
    throw new Error("No content returned from OpenAI");
  }

  return JSON.parse(message.content) as ArticleResult;
}
