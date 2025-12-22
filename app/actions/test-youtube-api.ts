"use server";

export async function testYouTubeAPI() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    return { success: false, error: "YOUTUBE_API_KEY not found in environment variables" };
  }

  try {
    const channelId = "UCMb0O2CdPBNi-QqPk5T3gsQ";
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=3`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `API Error: ${response.status} - ${errorText}` };
    }
    
    const data = await response.json();
    
    return { 
      success: true, 
      message: "API key works!",
      latestVideos: data.items?.map((item: any) => ({
        title: item.snippet.title,
        videoId: item.id.videoId,
        publishedAt: item.snippet.publishedAt
      }))
    };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
