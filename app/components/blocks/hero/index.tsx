import { getLatestArticle } from "@/lib/database/articles";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Hero() {
    const article = await getLatestArticle();
    return (
        <section className="w-full pb-10 lg:px-10 md:pb-20">
          <article className=" flex flex-col items-center lg:items-start h-full justify-center lg:flex-row gap-8">
            <Image className="w-full lg:max-w-md rounded-none lg:rounded-md" src={article?.thumbnail || ""} alt={article?.title || "Article image"} width={200} height={200}></Image>
            <div className="flex flex-col justify-between w-full max-w-2xl text-center gap-4 lg:text-left">
              <h1 className="text-3xl font-extrabold">{article?.title}</h1>
              <p className=" text-xs text-muted-foreground">{article?.word_count} words</p>
              <p>{article?.summary}</p>
              
                <Button className="lg:mr-auto mx-auto lg:mx-0 mt-5 max-w-[30%] lg:max-w-[20%]" variant="default" ><Link href={`/articles/${article?.id}`}>Read More</Link></Button>
              
            </div>

          </article>
            </section>
    );
}