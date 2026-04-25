import { db } from "@/lib/db";
import { recipes, recipe_ingredient_measUnit } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import RecipePageClient from "./RecipePageClient";
import { date } from "drizzle-orm/mysql-core";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const recipe = db.select().from(recipes).where(eq(recipes.slug, slug)).get();
  return {
    title: recipe?.title ?? slug,
    description: recipe?.metaDescription,
  };
}

function toCookTimeISO(raw: string): string {
  const hours = raw.match(/(\d+)\s*h/i)?.[1];
  const mins  = raw.match(/(\d+)\s*m/i)?.[1];
  if (!hours && !mins) return "PT0M";
  return `PT${hours ? hours + "H" : ""}${mins ? mins + "M" : ""}`;
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const recipe = db.select().from(recipes).where(eq(recipes.slug, slug)).get();
  const ingredients = recipe
    ? db.select().from(recipe_ingredient_measUnit).where(eq(recipe_ingredient_measUnit.recipe_id, slug)).all()
    : [];

  const jsonLd = recipe
    ? {
        "@context": "https://schema.org",
        "@type": "Recipe",
        name: recipe.title,
        image: recipe.image,
        author: {"@type": "Person", "name": "Elaine"},
        datePublished: recipe.createdAt.toISOString().split('T')[0],
        recipeCategory: (JSON.parse(recipe.tags) as string[]).join(", "),
        totalTime: toCookTimeISO(recipe.cookTime),
        recipeYield: `${recipe.baseServings} servings`,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: recipe.rating,
          bestRating: 5,
          worstRating: 1,
          ratingCount: recipe.views,
        },
        recipeIngredient: ingredients.map(
          (ing) => `${ing.amount ?? ""} ${ing.measUnit_id ?? ""} ${ing.ingredient_id ?? ""}`.trim()
        ),
        recipeInstructions: (JSON.parse(recipe.directions) as string[])
          .filter((s) => !s.startsWith("title:"))
          .map((s) => ({
            "@type": "HowToStep",
            text: s.replace(/<[^>]+>/g, ""),
          })),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <RecipePageClient slug={slug} />
    </>
  );
}
