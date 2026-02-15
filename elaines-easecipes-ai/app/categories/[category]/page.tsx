import Image from "next/image";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import { db } from "@/lib/db";
import { recipes } from "@/lib/db/schema";
import { like } from "drizzle-orm";
import { notFound } from "next/navigation";
import { categories } from "@/lib/categories";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const displayName = categoryDisplayNames[category];

  if (!displayName) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${displayName} Recipes | Elaine's Easecipes`,
    description: `Browse our collection of delicious ${displayName.toLowerCase()} recipes.`,
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

  // Fetch recipes that have this category in their tags
  // Tags are stored as JSON array like '["Desserts", "Quick & Easy"]'
  const categoryRecipes = db
    .select()
    .from(recipes)
    .where(like(recipes.tags, `%"${displayName}"%`))
    .all();

  return (
    <div className="bg-white min-h-screen w-full max-w-[1440px] mx-auto relative">
      <Header />

      <div
        className="relative min-h-[calc(82vh)] sm:min-h-[calc(79vh)] md:min-h-[calc(76vh)]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(191,221,165,0.2) 0%, rgba(142,173,116,0.2) 50%, rgba(118,149,92,0.2) 75%, rgba(93,125,67,0.2) 100%)",
        }}
      >
        {/* Category Header */}
        <section className="relative px-2 py-6 sm:px-4 md:px-6 lg:px-8">
          <div className="relative mb-[12px] pl-[2px]">
            <h1 className="font-semibold text-[28px] sm:text-[32px] text-black tracking-[-0.48px] leading-[1.2]">
              {displayName}
            </h1>
            <div className="relative h-[19px] w-[180px] mt-[-6px] ml-[-4px]">
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
                  bookmarked={recipe.bookmarked ?? false}
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
