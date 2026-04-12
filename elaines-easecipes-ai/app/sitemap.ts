import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { recipes } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const CATEGORIES = ['appetizers', 'mains', 'sides', 'desserts', 'drinks', 'easecipes', 'potluck']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/search`, changeFrequency: 'weekly', priority: 0.5 },
    ...CATEGORIES.map(cat => ({
      url: `${BASE_URL}/categories/${cat}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]

  const allRecipes = await db
    .select({ slug: recipes.slug, updatedAt: recipes.updatedAt })
    .from(recipes)

  const recipePages: MetadataRoute.Sitemap = allRecipes.map(recipe => ({
    url: `${BASE_URL}/recipes/${recipe.slug}`,
    lastModified: recipe.updatedAt ? new Date(recipe.updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...recipePages]
}
