export const dynamic = 'force-dynamic';

import Image from "next/image";
import RecipeCard from "@/components/RecipeCard";
import DragonFruitRating from "@/components/DragonFruitRating";
import { db } from "@/lib/db";
import { recipes, userBookmarks } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth/session";
import { BASE_URL } from "@/app/sitemap";

export default async function Home() {
  // Determine logged-in user from session cookie
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value ?? null;
  const payload = token ? await verifySessionToken(token) : null;
  const userId = payload?.userId ?? null;

  const bookmarkedSlugs: Set<string> = userId
    ? new Set(
        db.select().from(userBookmarks).where(eq(userBookmarks.userId, userId)).all()
          .map(b => b.recipeSlug)
      )
    : new Set();

  const withBookmark = <T extends { slug: string }>(r: T) => ({
    ...r,
    bookmarked: bookmarkedSlugs.has(r.slug),
  });

  // Fetch recipes from database
  const newestRecipes = db
    .select()
    .from(recipes)
    .orderBy(desc(recipes.createdAt))
    .limit(10)
    .all()
    .map(withBookmark);

  const popularRecipes = db
    .select()
    .from(recipes)
    .orderBy(desc(recipes.views))
    .limit(8)
    .all()
    .map(withBookmark);

  const featuredRecipeRaw = db
    .select()
    .from(recipes)
    .where(eq(recipes.featured, true))
    .limit(1)
    .get();

  const featuredRecipe = featuredRecipeRaw ? withBookmark(featuredRecipeRaw) : undefined;

  const seen = new Set<string>();
  const allDisplayed = [...newestRecipes, ...popularRecipes].filter(r => {
    if (seen.has(r.slug)) return false;
    seen.add(r.slug);
    return true;
  });
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        url: `${BASE_URL}/`,
        name: "Elaine's Easecipes",
      },
      {
        "@type": "ItemList",
        name: "Recipes",
        itemListElement: allDisplayed.map((recipe, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${BASE_URL}/recipes/${recipe.slug}`,
          name: recipe.title,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative mb-6">
      <section className="relative h-70 w-full sm:h-90 md:h-90 lg:h-105">
        <div className="absolute inset-0 -left-0.5 overflow-hidden blur-[2px]">
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
            <div className="absolute top-6.5 left-1/2 aspect-294/149 h-[calc(100%-80px)] max-w-90 -translate-x-1/2 overflow-hidden rounded-2xl border shadow-[4px_4px_4px_rgba(0,0,0,0.25)] transition-transform hover:scale-102 hover:shadow-[4px_4px_4px_rgba(0,0,0,0.5)] sm:max-w-175">
              <Image
                src={featuredRecipe.image}
                alt={featuredRecipe.title}
                width = {0}
                height = {0}
                className="object-cover opacity-90 transition-opacity hover:opacity-100"
                sizes="(max-width: 640px) calc(100vw - 80px), (max-width: 1024px) 60vw, 700px"
                style={{ width: '100%', height: '100%' }}
              />
              <div className= "absolute top-4 left-4 -rotate-4 rounded-[30px] border border-[#711F3B] bg-[#da1d5f] px-3 pt-px pb-0.75">
                <span className = "font-abeezee text-[14px] leading-normal font-black tracking-[0.25px] text-[#ffffff] uppercase">
                  this week&apos;s obsession
                </span>
              </div>
              <div className="absolute bottom-0 left-0 h-auto w-[85%] overflow-hidden rounded-tr-[10px] rounded-bl-2xl bg-white pb-2">
                <div className="flex w-full items-start justify-between gap-2 px-2 py-1">
                  <span className="font-abeezee text-sm leading-normal font-semibold tracking-tight text-black italic sm:text-base md:text-lg lg:text-xl">
                    {featuredRecipe.title}
                  </span>
                  <button aria-label="Bookmark Recipe Button">
                    <div className="relative h-4 w-3.5 sm:mt-px sm:mr-0.5 md:mt-0.5 md:mr-0.5 md:h-4.5 md:w-4">
                      <Image
                        src={featuredRecipe.bookmarked ? "/images/bookmark-filled.svg" : "/images/bookmark.svg"}
                        alt="bookmark"
                        fill
                      />
                    </div>
                  </button>
                </div>
                <div className="flex items-center px-2">
                  <DragonFruitRating rating={featuredRecipe.rating} sizeClassName="w-3.5 h-4 sm:w-4 sm:h-4.5 md:w-5 md:h-5.5"/>
                  <div className="ml-auto flex items-center gap-1">
                    <svg className="h-4 w-3.5 sm:h-4.5 sm:w-4 md:h-5.5 md:w-5" viewBox="0 0 10 7" fill="#E0165C" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 0.5C2.73 0.5 0.8 1.91 0 4C0.8 6.09 2.73 7.5 5 7.5C7.27 7.5 9.2 6.09 10 4C9.2 1.91 7.27 0.5 5 0.5ZM5 6.17C3.8 6.17 2.83 5.2 2.83 4C2.83 2.8 3.8 1.83 5 1.83C6.2 1.83 7.17 2.8 7.17 4C7.17 5.2 6.2 6.17 5 6.17ZM5 2.9C4.39 2.9 3.9 3.39 3.9 4C3.9 4.61 4.39 5.1 5 5.1C5.61 5.1 6.1 4.61 6.1 4C6.1 3.39 5.61 2.9 5 2.9Z"/>
                    </svg>
                    <span className="text-[10px] leading-4 font-medium tracking-[0.05px] text-black/60 sm:text-[12px] md:text-[14px]">
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
      <section className="relative mt-5 px-2.5 sm:mt-10 sm:px-4 md:mt-12 md:px-6 lg:mt-14 lg:px-10">
        <div className="relative mb-3 inline-block pr-8 pl-0.5">
          <h1>
            Newest Recipes:
          </h1>
          <div className="absolute inset-0 top-full -mt-1 -ml-1 h-4.75">
            <Image
              src="/images/underline.svg"
              alt=""
              fill
              className="object-contain object-left"
            />
          </div>
        </div>

        <div className="my-4 grid grid-cols-2 gap-x-2 gap-y-5 sm:gap-x-3 md:grid-cols-3 md:gap-x-4 lg:grid-cols-4 lg:gap-x-5 xl:grid-cols-5">
          {newestRecipes.map((recipe, index) => (
            <div
              key={recipe.id}
              className={
                index >= 9
                  ? "hidden w-full xl:block"
                  : index === 8
                    ? "hidden w-full md:block lg:hidden xl:block"
                    : "w-full"
              }
            >
              <RecipeCard
                title={recipe.title}
                slug={recipe.slug}
                tags={JSON.parse(recipe.tags)}
                image={recipe.image}
                rating={recipe.rating}
                views={recipe.views}
                bookmarked={recipe.bookmarked}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Most Popular Section */}
      <section className="relative my-5 px-2.5 sm:my-10 sm:px-4 md:my-12 md:px-6 lg:my-14 lg:px-10">
        <div className="relative mb-6 inline-block pr-8 pl-0.5">
          <h1>
            Most Popular:
          </h1>
          <div className="absolute inset-0 top-full -mt-1 -ml-1 h-4.75">
            <Image
              src="/images/underline.svg"
              alt=""
              fill
              className="object-contain object-left"
            />
          </div>
        </div>

        <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2 sm:gap-4">
          {popularRecipes.map((recipe) => (
            <div key={recipe.id} className="w-50 shrink-0 sm:w-55 md:w-60">
              <RecipeCard
                title={recipe.title}
                slug={recipe.slug}
                tags={JSON.parse(recipe.tags)}
                image={recipe.image}
                rating={recipe.rating}
                views={recipe.views}
                bookmarked={recipe.bookmarked}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
    </>
  );
}
