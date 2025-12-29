import Hero from "../components/blocks/hero"
import ArticleGrid from "../components/blocks/article-grid"

export default async function Home() {
  return (
    <main>
      <div className="flex w-full min-h-screen sm:gap-20 flex-col items-center">
        <Hero></Hero>
        <ArticleGrid></ArticleGrid>
        
        </div>
    </main>
  )
}