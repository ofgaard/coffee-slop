import { createClient } from "@/lib/supabase/server";

type ArticleData = {
  video_id: string;
  title: string;
  summary: string;
  article: string;
  word_count: number;
  thumbnail?: string;
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

export async function checkArticleExists(videoId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select('id')
    .eq('video_id', videoId)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error; 
  return !!data;
}


export async function getAllArticles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select()
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function getLatestArticle() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select()
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  if (error) throw error;
  return data;  
}

export async function getArticleById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select()
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data;
}
