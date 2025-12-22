import { checkArticleExists } from "../database/articles";

type NewVideo = {
  title: string;
  videoId: string;
  publishedAt: string;
};

export default async function scanChannels(channelIds: string[]) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY not found in environment variables");
  }

  const fetchVideos = channelIds.map(async (channelId) => {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=5`
    );

    if (!response.ok) {
      throw new Error(`YouTube API Error: ${response.status}`);
    }

    const data = await response.json();
    const videos = data.items ?? [];

    const checkedVideos = await Promise.all(
      videos.map(async (video: any) => {
        const videoId = video?.id?.videoId;
        if (!videoId) return null;

        const exists = await checkArticleExists(videoId);
        if (exists) return null;

        return {
          title: video.snippet.title,
          videoId,
          publishedAt: video.snippet.publishedAt
        } as NewVideo;
      })
    );

    const newVideos = checkedVideos.filter(
      (v): v is NewVideo => v !== null
    );

    if (newVideos.length === 0) {
      return null;
    }

    return {
      channelId,
      videos: newVideos
    };
  });

  const results = await Promise.all(fetchVideos);

  const validResults = results.filter(
    (r): r is { channelId: string; videos: NewVideo[] } => r !== null
  );

  if (validResults.length === 0) {
    throw new Error("No new videos from channel scans");
  }

  const allVideos: Record<string, NewVideo[]> = {};

  for (const result of validResults) {
    allVideos[result.channelId] = result.videos;
  }

  return allVideos;
}
