import { summarizeVideo } from "../actions/summarize-video";

export default async function Home() {
  const article = await summarizeVideo("xrKsjy7nh8Y");
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <article className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <p className="text-lg text-gray-600 mb-6">{article.summary}</p>
        <div className="prose prose-lg">
          {article.article}
        </div>
        <p className="text-sm text-gray-500 mt-4">
          {article.word_count} words • {new Date(article.created_at).toLocaleDateString()}
        </p>
      </article>
    </main>
  );
}