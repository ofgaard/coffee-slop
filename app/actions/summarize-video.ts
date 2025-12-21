"use server";

import { getTranscript } from "@/lib/transcription/get-transcript";
import { summarizeTranscript } from "@/lib/openai/summarize-transcript";
import { getArticleByVideoId, saveArticle } from "@/lib/database/articles";

export async function summarizeVideo(videoId: string) {
 
  const existing = await getArticleByVideoId(videoId);
  
  if (existing) {
    return existing; 
  }


  const transcript = await getTranscript(videoId);
  const articleResult = await summarizeTranscript(transcript);
  
 
  const article = await saveArticle({
    video_id: videoId,
    title: articleResult.title,
    summary: articleResult.summary,
    article: articleResult.article,
    word_count: articleResult.wordCount,
  });
  
  return article;
}