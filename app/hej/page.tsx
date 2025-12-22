import { getAllArticles } from "@/lib/database/articles";

export default async function HomePage() {
  const articles = await getAllArticles();
  
  
  return (
   <div>
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-8">Articles</h1>
        {articles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          articles.map((article) => (
            <article key={article.id} className="mb-12">
              <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
              <p className="text-lg text-gray-600 mb-4">{article.summary}</p>
      
              <div className="prose prose-lg">
                {article.article}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                {article.word_count} words • {new Date(article.created_at).toLocaleDateString()}
              </p>
            </article>
          ))
        )}
      </div>
    </main> 
   </div>
  );
}