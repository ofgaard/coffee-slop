import scanChannels from "@/lib/youtube/scan-channels";
import { getTranscript } from "@/lib/transcription/get-transcript";
import { summarizeTranscript } from "@/lib/openai/summarize-transcript";
import { saveArticle } from "@/lib/database/articles";
import { NextResponse } from "next/server";

type ArticleData = {
  video_id: string;
  title: string;
  summary: string;
  article: string;
  word_count: number;
  thumbnail?: string;
  creator: string;
};

const CHANNEL_NAMES: Record<string, string> = {
  "UCR2_8uHyWcTSV6iIw6BN4rg": "Lance Hedrick",
  "UCMb0O2CdPBNi-QqPk5T3gsQ": "James Hoffmann"
};

export async function GET() {
  try {
    const channelIds = [
      "UCR2_8uHyWcTSV6iIw6BN4rg", // Lance Hedrick
      "UCMb0O2CdPBNi-QqPk5T3gsQ" // James Hoffmann
    ];

    const newVideos = await scanChannels(channelIds);
    const newVideosFlattened = newVideos.flat();

    const articlePromises = newVideosFlattened.map(async (video) => {
      const transcript = await getTranscript(video.videoId);
      if (transcript === null) {
        throw new Error('transcription failed');
      }
      const article = await summarizeTranscript(transcript);
      if (article === null) {
        throw new Error('summarization failed');
      }

      const articleData: ArticleData = {
        video_id: video.videoId,
        title: article.title,
        summary: article.summary,
        article: article.article,
        word_count: article.wordCount,
        thumbnail: video.thumbnail,
        creator: CHANNEL_NAMES[video.channelId] || "Unknown"
      };
      
      await saveArticle(articleData);

      return {
        videoId: video.videoId,
        title: article.title,
        success: true
      };
    });
   
    const results = await Promise.allSettled(articlePromises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      message: `Processed ${newVideosFlattened.length} videos`,
      stats: {
        total: newVideosFlattened.length,
        successful,
        failed
      },
      details: results.map(r => r.status === 'fulfilled' ? r.value : r.reason)
    });
  } catch (error) {
    console.error("Error in video processing:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}