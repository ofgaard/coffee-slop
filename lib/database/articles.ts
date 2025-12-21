import { createClient } from "@/lib/supabase/server";

type ArticleData = {
  video_id: string;
  title: string;
  summary: string;
  article: string;
  word_count: number;
};

export async function getArticleByVideoId(videoId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('articles')
    .select()
    .eq('video_id', videoId)
    .single();
  
  return data;
}

export async function saveArticle(articleData: ArticleData) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .insert(articleData)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
