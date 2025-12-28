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
              description: "Title in simple words highlighting the main point that would interest reader who's already very interested in specialty coffee and come here to stay up to date on the two most popular channels for their hobby (e.g. 5 tips for better aeropress (if the video contains 5 tips) or ´boiling water destroys pour over coffee´ if that is a key point in the video)",
            },
            summary: {
              type: "string",
              description: "just 1, max 2 short sentences summarizing the main points of the article",
            },
            article: {
              type: "string",
              description: "A well-structured, fun summary article based on transcription provided, max 500 words.",
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
People come to the side because they love the two youtube channels covered here and want to keep up to date with their content in a quick and easy way.
Use proper paragraph breaks - separate each paragraph with double line breaks (\\n\\n) for proper formatting.
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
