import { getArticleById } from "@/lib/database/articles";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = await getArticleById(id);
    
    return (
        <main>
            <h1>{article.title}</h1>
            <p>{article.word_count} words</p>
            <p>{article.summary}</p>
            <p>{article.article}</p>
        </main>
    );
}
