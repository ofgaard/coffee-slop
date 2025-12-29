import { getAllArticles } from "@/lib/database/articles";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import dateTrim from "@/lib/helpers/date-trim";
import Link from "next/link";

export default async function ArticleGrid() {
const articles = await getAllArticles()

return (
    <section className="w-full flex justify-center">
        <div className="grid grid-cols-1 px-0 sm:px-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {articles.length === 0 ? <p>No articles found</p> : articles.map((article) => (
                <Link href={`/articles/${article.id}`} className="flex flex-col text-center gap-2" key={article.id}><Card  className="overflow-hidden rounded-none sm:rounded-md p-0">
                    <Image
                        alt={article.title}
                        src={article.thumbnail}
                        width={1000}
                        height={1000}
                        className="w-full h-full object-cover" />
                </Card><h1 className="font-bold">{article.title}</h1> <p className="text-xs">{article.word_count} words • {dateTrim(article.created_at)}</p> </Link>
            ))  }
        </div>

    </section>
)
}