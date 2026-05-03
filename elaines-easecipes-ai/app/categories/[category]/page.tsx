export const dynamic = 'force-dynamic';

import Image from "next/image";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import { db } from "@/lib/db";
import { recipes, userBookmarks } from "@/lib/db/schema";
import { like, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { categories } from "@/lib/categories";
import { BASE_URL } from "@/app/sitemap";
import { cookies } from "next/headers";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth/session";

const validCategories: string[] = categories.map(category => category.toLowerCase()); 

const categoryDisplayNames: Record<string, string> = {
  appetizers: "Appetizers",
  mains: "Mains",
  sides: "Sides",
  desserts: "Desserts",
  drinks: "Drinks",
  easecipes: "Easecipes",
  potluck: "Potluck",
};

const categoryDisplayNamesLower: Record<string, string> = {};
categories.forEach(category => {
  categoryDisplayNamesLower[category.toLowerCase()] = category;
});

export async function generateStaticParams() {
  return validCategories.map((category) => ({
    category,
  }));
}

export async function generateMetadata({params,}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const displayName = categoryDisplayNames[category];

  if (!displayName) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${displayName}`,
    description: `Browse our collection of delicious ${displayName.toLowerCase()}.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!validCategories.includes(category)) {
    notFound();
  }

  const displayName = categoryDisplayNames[category];
  console.log("imported categories from Header:", categories[0]);

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

  // Fetch recipes that have this category in their tags
  // Tags are stored as JSON array like '["Desserts", "Quick & Easy"]'
  const categoryRecipes = db
    .select()
    .from(recipes)
    .where(like(recipes.tags, `%"${displayName}"%`))
    .all()
    .map(r => ({ ...r, bookmarked: bookmarkedSlugs.has(r.slug) }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${displayName} Recipes`,
    itemListElement: categoryRecipes.map((recipe, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/recipes/${recipe.slug}`,
      name: recipe.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="min-h-[calc(100vh-53px-80px)] sm:min-h-[calc(100vh-60px-100px)] xl:min-h-[calc(100vh-64px-116px)]]">
      {/* Category Header */}
      <div className="px-2 py-6 sm:px-4 md:px-6 lg:px-8">
        <div className="relative mb-[12px] pl-[2px] pr-8 inline-block">
          <h1 className="font-semibold text-[28px] sm:text-[32px] text-black tracking-[-0.48px] leading-[1.2]">
            {displayName}
          </h1>
          <div className="absolute top-full inset-0 h-[16px] mt-[-4px] ml-[-4px]">
            <Image
              src="/images/underline.svg"
              alt=""
              fill
              className="object-contain object-left"
            />
          </div>
        </div>

        {categoryRecipes.length > 0 ? (
          <div className="my-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-5 sm:gap-x-3 md:gap-x-4 lg:gap-x-5 justify-items-center">
            {categoryRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                title={recipe.title}
                slug={recipe.slug}
                tags={JSON.parse(recipe.tags)}
                image={recipe.image}
                rating={recipe.rating}
                views={recipe.views}
                bookmarked={recipe.bookmarked}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-500 text-lg text-center">
              No {displayName.toLowerCase()} recipes yet.
            </p>
            <p className="text-gray-400 text-sm mt-2 text-center">
              Check back soon for delicious new recipes!
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
