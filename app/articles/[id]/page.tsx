import { getArticleById } from "@/lib/database/articles";
import dateTrim from "@/lib/helpers/date-trim";
import Image from "next/image";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = await getArticleById(id);
    
    return (
        <main className="flex flex-col items-center px-10">
            <div className="flex flex-col gap-2 max-w-4xl">
            <h1 className="font-extrabold text-4xl">{article.title}</h1>
            <p className="text-sm text-muted-foreground w-full flex-1">{article.word_count} words | {dateTrim(article.created_at)} | Summarized from {article.creator}s <a className="underline" href={'https://www.youtube.com/watch?v=' + article.video_id}>video</a> </p>
             <Image src={article.thumbnail} alt={article.title} width={800} height={400} className="my-5 w-full object-cover rounded-sm"/>
                             <p className="whitespace-pre-wrap">{article.article}</p>        
            </div>


        </main>
    );
}
