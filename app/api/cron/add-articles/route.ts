import scanChannels from "@/lib/youtube/scan-channels";
import { getTranscript } from "@/lib/transcription/get-transcript";
import { summarizeTranscript } from "@/lib/openai/summarize-transcript";
import { saveArticle } from "@/lib/database/articles";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const channelIds = [
      "UCMb0O2CdPBNi-QqPk5T3gsQ", // Hoffmann
      "UCMpPVd0cp_vL0XbP3PeNn3g", // Lance Hedrick
    ];

    if (channelIds.length === 0) {
      return NextResponse.json(
        { error: "No channel IDs configured" },
        { status: 400 }
      );
    }

    
    const newVideos = await scanChannels(channelIds);

    const results = [];


    for (const [channelId, videos] of Object.entries(newVideos)) {
      for (const video of videos) {
        try {
   
          const transcript = await getTranscript(video.videoId);
          
        
          const articleResult = await summarizeTranscript(transcript);
          
        
          const article = await saveArticle({
            video_id: video.videoId,
            title: articleResult.title,
            summary: articleResult.summary,
            article: articleResult.article,
            word_count: articleResult.wordCount,
          });

          results.push({
            channelId,
            videoId: video.videoId,
            title: article.title,
            status: "success",
          });
        } catch (error) {
          console.error(`Failed to process video ${video.videoId}:`, error);
          results.push({
            channelId,
            videoId: video.videoId,
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    }

    return NextResponse.json({
      message: "Cron job completed",
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      {
        error: "Cron job failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}