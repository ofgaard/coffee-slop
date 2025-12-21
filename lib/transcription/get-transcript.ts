
export async function getTranscript(videoId: string): Promise<string> {
    const response = await fetch("https://www.youtube-transcript.io/api/transcripts", {
  method: "POST",
  headers: {
    "Authorization": `Basic ${process.env.TRANSCRIPTION_API_TOKEN}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ 
    ids: [videoId], 
  })
});
if (!response.ok) {
  throw new Error(`Transcription API error: ${response.statusText}`);
}
const data = await response.json();

const transcriptText = data?.[0]?.text;

if (typeof transcriptText !== "string" || !transcriptText.trim()) {
  throw new Error("Transcript not found or empty");
}


return transcriptText.trim();

} 