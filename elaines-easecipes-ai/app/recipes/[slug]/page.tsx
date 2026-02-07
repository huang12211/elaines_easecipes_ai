"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import DragonFruitRating from "@/components/DragonFruitRating";

interface Recipe {
  id: number;
  title: string;
  slug: string;
  categories: string;
  image: string;
  rating: number;
  views: number;
  bookmarked: boolean;
  cookTime: number;
  servings: number;
  ingredients: string;
  directions: string;
}

interface IngredientCheckboxProps {
  ingredient: string;
  checked: boolean;
  onChange: () => void;
}

function IngredientCheckbox({ ingredient, checked, onChange }: IngredientCheckboxProps) {
  return (
    <label className="flex gap-[7px] items-center px-[5px] py-[2px] cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-[14px] h-[14px] border border-black appearance-none cursor-pointer checked:bg-[#094234] checked:border-[#094234] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-[10px] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
      />
      <span className={`font-abeezee text-[14px] tracking-[0.25px] leading-normal ${checked ? 'line-through text-gray-400' : 'text-black'}`}>
        {ingredient}
      </span>
    </label>
  );
}

export default function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    async function fetchRecipe() {
      try {
        const response = await fetch(`/api/recipes?slug=${slug}`);
        if (response.ok) {
          const data = await response.json();
          setRecipe(data);
          setIsBookmarked(data.bookmarked);
        }
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [slug]);

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen w-full max-w-[1440px] mx-auto relative">
        <Header />
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#094234]"></div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="bg-white min-h-screen w-full max-w-[1440px] mx-auto relative">
        <Header />
        <div className="flex flex-col items-center justify-center h-[400px] gap-4">
          <p className="text-xl text-gray-600">Recipe not found</p>
          <Link href="/" className="text-[#094234] underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const ingredients: string[] = JSON.parse(recipe.ingredients);
  const directions: string[] = JSON.parse(recipe.directions);

  return (
    <div className="bg-white min-h-screen w-full max-w-[1440px] mx-auto relative">
      <Header />

      <main className="flex flex-col">
        {/* Recipe Title Section */}
        <section className="flex flex-col gap-[5px] pt-[16px] pb-[10px] px-[10px] sm:px-[20px] md:px-[40px] lg:px-[80px]">
          <div className="flex items-center justify-between gap-[20px]">
            <h1 className="font-abeezee text-[24px] sm:text-[28px] md:text-[32px] text-black tracking-[-0.48px] leading-[1.2]">
              {recipe.title}
            </h1>
            <div className="flex gap-[6px] items-center">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="flex items-center h-[20px] pr-[2px]"
              >
                <Image
                  src={isBookmarked ? "/images/bookmark-filled.svg" : "/images/bookmark.svg"}
                  alt="bookmark"
                  width={16}
                  height={18}
                />
              </button>
              <button className="w-[20px] h-[20px]">
                <Image
                  src="/images/cart.svg"
                  alt="Add to basket"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>

          {/* Rating, Views, Time */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <DragonFruitRating rating={recipe.rating} iconWidth={17} iconHeight={20} />
            <span className="text-black text-[14px]">|</span>
            <div className="flex items-center gap-[6px]">
              <svg width="14" height="11" viewBox="0 0 10 7" fill="#E0165C" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 0.5C2.73 0.5 0.8 1.91 0 4C0.8 6.09 2.73 7.5 5 7.5C7.27 7.5 9.2 6.09 10 4C9.2 1.91 7.27 0.5 5 0.5ZM5 6.17C3.8 6.17 2.83 5.2 2.83 4C2.83 2.8 3.8 1.83 5 1.83C6.2 1.83 7.17 2.8 7.17 4C7.17 5.2 6.2 6.17 5 6.17ZM5 2.9C4.39 2.9 3.9 3.39 3.9 4C3.9 4.61 4.39 5.1 5 5.1C5.61 5.1 6.1 4.61 6.1 4C6.1 3.39 5.61 2.9 5 2.9Z"/>
              </svg>
              <span className="font-abeezee text-[12px] text-black tracking-[0.25px]">
                {recipe.views.toLocaleString()} views
              </span>
            </div>
            <span className="text-black text-[14px]">|</span>
            <div className="flex items-center gap-[4px]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="6.5" stroke="#E0165C" strokeWidth="1.5"/>
                <path d="M8 4.5V8L10.5 10.5" stroke="#E0165C" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="font-abeezee text-[12px] text-black tracking-[0.25px]">
                {recipe.cookTime} min
              </span>
            </div>
          </div>
        </section>

        {/* Recipe Image */}
        <section className="px-[10px] sm:px-[20px] md:px-[40px] lg:px-[80px]">
          <div className="relative w-full max-w-[700px] mx-auto aspect-[350/185] rounded-[8px] overflow-hidden">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 700px"
              priority
            />
          </div>
        </section>

        {/* Ingredients Section */}
        <section className="px-[10px] sm:px-[20px] md:px-[40px] lg:px-[80px] py-[16px]">
          <div className="max-w-[700px] mx-auto">
            <div className="flex flex-col gap-[5px] mb-[10px]">
              <div className="relative inline-block">
                <h2 className="font-abeezee text-[20px] text-black tracking-[0.25px]">
                  Ingredients
                </h2>
                <div className="absolute -bottom-[2px] -left-[6px] w-[128px] h-[11px]">
                  <Image
                    src="/images/underline.svg"
                    alt=""
                    fill
                    className="object-contain object-left"
                  />
                </div>
              </div>
              <div className="flex items-center gap-[10px] pl-[10px] mt-[8px]">
                <span className="font-abeezee text-[16px] text-black tracking-[0.25px]">
                  for {recipe.servings} servings
                </span>
                <button className="w-[21px] h-[21px] rounded-full border border-gray-300 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.5 1.5L10.5 3.5M1 11L1.5 8.5L9.5 0.5L11.5 2.5L3.5 10.5L1 11Z" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[20px] gap-y-[5px] px-[10px]">
              {ingredients.map((ingredient, index) => (
                <IngredientCheckbox
                  key={index}
                  ingredient={ingredient}
                  checked={checkedIngredients.has(index)}
                  onChange={() => toggleIngredient(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="flex justify-center py-[10px]">
          <div className="w-[200px] h-[1px] bg-gray-300"></div>
        </div>

        {/* Directions Section */}
        <section className="px-[10px] sm:px-[20px] md:px-[40px] lg:px-[80px] py-[16px]">
          <div className="max-w-[700px] mx-auto">
            <div className="relative inline-block mb-[10px]">
              <h2 className="font-abeezee text-[20px] text-black tracking-[0.25px]">
                Directions
              </h2>
              <div className="absolute -bottom-[2px] -left-[8px] w-[128px] h-[11px]">
                <Image
                  src="/images/underline.svg"
                  alt=""
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>

            <ol className="list-decimal pl-[30px] space-y-[8px]">
              {directions.map((step, index) => (
                <li key={index} className="font-abeezee text-[14px] text-black tracking-[0.25px] leading-normal pl-[5px]">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#094234] w-full py-8 sm:py-10 md:py-12 flex items-center justify-center mt-[40px]">
        <p className="font-bold text-xs sm:text-sm text-white text-center tracking-[-0.24px]">
          &copy; Copyright 2025 Elaine&apos;s Easecipes.
        </p>
      </footer>
    </div>
  );
}
