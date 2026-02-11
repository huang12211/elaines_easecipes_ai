import Image from "next/image";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import DragonFruitRating from "@/components/DragonFruitRating";
import { db } from "@/lib/db";
import { recipes } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";

export default async function Home() {
  // Fetch recipes from database
  const newestRecipes = db
    .select()
    .from(recipes)
    .orderBy(desc(recipes.createdAt))
    .limit(6)
    .all();

  const popularRecipes = db
    .select()
    .from(recipes)
    .orderBy(desc(recipes.views))
    .limit(6)
    .all();

  const featuredRecipe = db
    .select()
    .from(recipes)
    .where(eq(recipes.featured, true))
    .limit(1)
    .get();

  return (
    <div className="bg-white min-h-screen w-full max-w-[1440px] mx-auto relative">
      <Header />

      <div
        className="relative"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(191,221,165,0.2) 0%, rgba(142,173,116,0.2) 50%, rgba(118,149,92,0.2) 75%, rgba(93,125,67,0.2) 100%)",
        }}
      >
        {/* Hero Section */}
        <section className="relative w-full h-[280px] sm:h-[360px] md:h-[360px] lg:h-[420px]">
          <div className="absolute inset-0 blur-[2px] overflow-hidden">
            <Image
              src="/images/hero-bg.png"
              alt="Hero background"
              width = {0}
              height = {0}
              className="object-cover"
              sizes="100vw"
              style={{ width: '100%', height: '100%' }}
              priority
            />
          </div>
          {featuredRecipe && (
            <Link href={`/recipes/${featuredRecipe.slug}`}>
              <div className="absolute top-[26px] left-1/2 -translate-x-1/2 h-[calc(100%-80px)] max-w-[700px] aspect-[294/149] rounded-[16px] overflow-hidden shadow-[4px_4px_4px_rgba(0,0,0,0.25)] transition-transform hover:scale-[1.02]">
                <Image
                  src={featuredRecipe.image}
                  alt={featuredRecipe.title}
                  width = {0}
                  height = {0}
                  className="object-cover"
                  sizes="(max-width: 640px) calc(100vw - 80px), (max-width: 1024px) 60vw, 700px"
                  style={{ width: '100%', height: '100%' }}
                />
                <div className="absolute bottom-0 left-0 w-[230px] h-[54px] sm:w-[360px] sm:h-[56px] md:w-[420px] md:h-[64px] bg-white rounded-bl-[16px] rounded-tr-[10px] overflow-hidden">
                  <div className="py-1 px-2 w-full flex justify-between items-center">
                    <span className="font-abeezee text-sm sm:text-sm md:text-base text-black tracking-[0.25px] leading-normal whitespace-nowrap">
                      {featuredRecipe.title}
                    </span>
                    <button>
                      <Image
                        src="/images/bookmark.svg"
                        alt="bookmark"
                        width={13}
                        height={16}
                      />
                    </button>
                  </div>
                  <div className="px-2 flex items-center">
                    <DragonFruitRating rating={featuredRecipe.rating} iconWidth={16} iconHeight={18}/>
                    <div className="flex items-center gap-1 ml-auto">
                      <svg width="14" height="11" viewBox="0 0 10 7" fill="#E0165C" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 0.5C2.73 0.5 0.8 1.91 0 4C0.8 6.09 2.73 7.5 5 7.5C7.27 7.5 9.2 6.09 10 4C9.2 1.91 7.27 0.5 5 0.5ZM5 6.17C3.8 6.17 2.83 5.2 2.83 4C2.83 2.8 3.8 1.83 5 1.83C6.2 1.83 7.17 2.8 7.17 4C7.17 5.2 6.2 6.17 5 6.17ZM5 2.9C4.39 2.9 3.9 3.39 3.9 4C3.9 4.61 4.39 5.1 5 5.1C5.61 5.1 6.1 4.61 6.1 4C6.1 3.39 5.61 2.9 5 2.9Z"/>
                      </svg>
                      <span className="text-[10px] font-medium text-black/60 tracking-[0.05px] leading-[16px]">
                        {featuredRecipe.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </section>

        {/* Newest Recipes Section */}
        <section className="relative px-2 py-3 sm:px-4 md:px-6 lg:px-8">
          <div className="relative mb-[12px] pl-[2px]">
            <h2 className="font-semibold text-[24px] text-black tracking-[-0.48px] leading-[1.2]">
              Newest Recipes:
            </h2>
            <div className="relative h-[19px] w-[180px] mt-[-6px] ml-[-4px]">
              <Image
                src="/images/underline.svg"
                alt=""
                fill
                className="object-contain object-left"
              />
            </div>
          </div>

          <div className="my-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-5 sm:gap-x-3 md:gap-x-4 lg:gap-x-5 justify-items-center">
            {newestRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                title={recipe.title}
                slug={recipe.slug}
                tags={JSON.parse(recipe.tags)}
                image={recipe.image}
                rating={recipe.rating}
                views={recipe.views}
                bookmarked={recipe.bookmarked ?? false}
              />
            ))}
          </div>
        </section>

        {/* Most Popular Section */}
        <section className="relative mt-5 pb-2.5 sm:mt-6 md:mt-8">
          <div className="relative px-2 mb-3 pl-2.5 sm:px-4 md:px-6 lg:px-8">
            <h2 className="font-semibold text-[24px] text-black tracking-[-0.48px] leading-[1.2]">
              Most Popular:
            </h2>
            <div className="relative h-[19px] w-[180px] mt-[-6px] ml-[-4px]">
              <Image
                src="/images/underline.svg"
                alt=""
                fill
                className="object-contain object-left"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto px-2 pb-2 sm:gap-3 sm:px-4 md:gap-4 md:px-6 lg:px-8 scrollbar-hide">
            {popularRecipes.map((recipe) => (
              <div key={recipe.id} className="w-[175px] sm:w-[200px] md:w-[220px] shrink-0">
                <RecipeCard
                  title={recipe.title}
                  slug={recipe.slug}
                  tags={JSON.parse(recipe.tags)}
                  image={recipe.image}
                  rating={recipe.rating}
                  views={recipe.views}
                  bookmarked={recipe.bookmarked ?? false}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#094234] w-full py-8 sm:py-10 md:py-12 flex items-center justify-center">
        <p className="font-bold text-xs sm:text-sm text-white text-center tracking-[-0.24px]">
          &copy; Copyright 2025 Elaine&apos;s Easecipes.
        </p>
      </footer>
    </div>
  );
}
