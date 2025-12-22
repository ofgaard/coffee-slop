import scanChannels from "@/lib/youtube/scan-channels";
import { getTranscript } from "@/lib/transcription/get-transcript";
import { summarizeTranscript } from "@/lib/openai/summarize-transcript";
import { saveArticle } from "@/lib/database/articles";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Define your YouTube channel IDs to scan
    const channelIds = [
      // Add your channel IDs here
      // "UCxxxxxx",
      // "UCyyyyyy",
    ];

    if (channelIds.length === 0) {
      return NextResponse.json(
        { error: "No channel IDs configured" },
        { status: 400 }
      );
    }

    // Scan all channels for new videos
    const newVideos = await scanChannels(channelIds);

    const results = [];

    // Process each channel's new videos
    for (const [channelId, videos] of Object.entries(newVideos)) {
      for (const video of videos) {
        try {
          // Get transcript
          const transcript = await getTranscript(video.videoId);
          
          // Summarize transcript
          const articleResult = await summarizeTranscript(transcript);
          
          // Save article to database
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