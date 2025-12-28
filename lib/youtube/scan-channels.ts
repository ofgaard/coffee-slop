import { checkArticleExists } from "../database/articles";

type NewVideo = {
  title: string;
  videoId: string;
  publishedAt: string;
  thumbnail: string;
  channelId: string;
};

export default async function scanChannels(channelIds: string[]): Promise<NewVideo[][]> {
  const YOUTUBE_API_KEY: string = process.env.YOUTUBE_API_KEY || '';
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const publishedAfter = sevenDaysAgo.toISOString();
  
  const getVideos = channelIds.map(async (channelId:string) => {
    try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&type=video&maxResults=5&publishedAfter=${publishedAfter}`
   );

   if (!response.ok) {
    throw new Error ('Youtube API error')
   }
  
   const data = await response.json();

   const fetchedVideos = data.items || [];

   const sortedVideos = await fetchedVideos.map(async (video) => {
    if (video.snippet.channelId !== channelId) {
      console.warn(`Video ${video.id.videoId} doesn't belong to channel ${channelId}, skipping`);
      return null;
    }

    const exists = await checkArticleExists(video.id.videoId);
    if (exists) {
      console.log(`Video ${video.id.videoId} already exists, skipping`);
      return null;
    }
    
    console.log(`New video found: ${video.snippet.title} (${video.id.videoId})`);
    return {
        title: video.snippet.title,
        videoId: video.id.videoId,
        publishedAt: video.snippet.publishedAt,
        thumbnail: video.snippet.thumbnails?.maxres?.url || 
        video.snippet.thumbnails?.high?.url ||
        video.snippet.thumbnails?.default?.url,
        channelId: channelId
    }

   })


   const videoResults = await Promise.all(sortedVideos);

  const filteredVideoResults = videoResults.filter((v): v is NewVideo => v !== null)
   
  return filteredVideoResults;


    } catch (error) {
      console.error(`Error fetching videos for channel ${channelId}:`, error);
      return [];
    }




  })
  
  return await Promise.all(getVideos)
  
}