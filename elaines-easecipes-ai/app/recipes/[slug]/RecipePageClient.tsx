"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DragonFruitRating from "@/components/DragonFruitRating";
import ServingSizeAdjuster from "@/components/ServingSizeAdjuster";
import { parseIngredient, scaleIngredient } from "@/lib/ingredients";

interface Recipe {
  id: number;
  title: string;
  slug: string;
  tags: string;
  image: string;
  rating: number;
  views: number;
  bookmarked: boolean;
  cookTime: number;
  baseServings: number;
  minServings: number;
  servingIncrement: number;
  directions: string;
}

interface IngredientsList{
  id: number;
  recipe_id: string;
  component: string;
  amount: string;
  measUnit_id: string;
  ingredient_id: string;
  min_amount: string;
}

interface IngredientCheckboxProps {
  amount: string;
  measUnit: string;
  ingredient: string;
  checked: boolean;
  onChange: () => void;
}

// Parse styled text with <b>, <i>, <u>, <br> tags (supports nesting)
function parseStyledText(text: string, keyPrefix: string = ''): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  const tagPattern = /<(b|i|u)>([\s\S]*?)<\/\1>/;
  const brPattern = /<br\s*\/?>/;

  while (remaining) {
    const styledMatch = remaining.match(tagPattern);
    const brMatch = remaining.match(brPattern);

    // Find which match comes first
    const styledIndex = styledMatch?.index ?? Infinity;
    const brIndex = brMatch?.index ?? Infinity;

    // No more tags found
    if (styledIndex === Infinity && brIndex === Infinity) {
      if (remaining) {
        result.push(remaining);
      }
      break;
    }

    // Handle <br> tag if it comes first
    if (brIndex < styledIndex) {
      // Add text before the <br>
      if (brIndex > 0) {
        result.push(remaining.slice(0, brIndex));
      }
      result.push(<br key={`${keyPrefix}${keyIndex}`} />);
      remaining = remaining.slice(brIndex + brMatch![0].length);
      keyIndex++;
      continue;
    }

    // Handle styled tag
    const [fullMatch, tag, content] = styledMatch!;
    const matchIndex = styledMatch!.index!;

    // Add text before the match
    if (matchIndex > 0) {
      result.push(remaining.slice(0, matchIndex));
    }

    // Recursively parse content and wrap in styled element
    const parsedContent = parseStyledText(content, `${keyPrefix}${keyIndex}-`);
    const key = `${keyPrefix}${keyIndex}`;

    switch (tag) {
      case 'b':
        result.push(<strong key={key} className="font-bold">{parsedContent}</strong>);
        break;
      case 'i':
        result.push(<em key={key} className="italic">{parsedContent}</em>);
        break;
      case 'u':
        result.push(<span key={key} className="underline">{parsedContent}</span>);
        break;
    }

    remaining = remaining.slice(matchIndex + fullMatch.length);
    keyIndex++;
  }

  return result;
}

function IngredientCheckbox({ amount, measUnit, ingredient, checked, onChange }: IngredientCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-[7px] px-[5px] py-[2px]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="relative size-[14px] cursor-pointer appearance-none border border-black checked:border-[#094234] checked:bg-[#094234] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-1/2 checked:after:text-[10px] checked:after:text-white checked:after:content-['✓']"
      />
      <span className={`font-abeezee text-[14px] leading-normal tracking-[0.25px] ${checked ? 'text-gray-400 line-through' : 'text-black'}`}>
        {amount} {measUnit} {ingredient}
      </span>
    </label>
  );
}

export default function RecipePageClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredientsData, setIngredientsData] = useState<string>("[]");
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentServings, setCurrentServings] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchRecipe() {
      try {
        const response = await fetch(`/api/recipes?slug=${slug}`);
        if (response.ok) {
          const data = await response.json();
          setRecipe(data);
          setIsBookmarked(data.bookmarked);
          setCurrentServings(data.servings);
        }
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
      } finally {
        try{
          const response = await fetch(`/api/recipes/ingredients?slug=${slug}`);
            if (response.ok) {
              const data = await response.json();
              setIngredientsData(JSON.stringify(data));
              console.log("Ingredients fetched:", data);
            }
          } catch (error) {
            console.error("Failed to fetch ingredients:", error);
          } finally{
            setLoading(false);
          }
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

  const toggleBookmark = async () => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);

    try {
      const response = await fetch('/api/recipes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, bookmarked: newBookmarked }),
      });

      if (response.status === 401) {
        setIsBookmarked(!newBookmarked);
        router.push('/login');
        return;
      }

      if (!response.ok) {
        setIsBookmarked(!newBookmarked);
        console.error('Failed to update bookmark');
      }
    } catch (error) {
      setIsBookmarked(!newBookmarked);
      console.error('Failed to update bookmark:', error);
    }
  };

  if (loading) {
    return (
        <div className="flex h-100 items-center justify-center">
          <div className="size-12 animate-spin rounded-full border-b-2 border-[#094234]"></div>
        </div>
    );
  }

  if (!recipe) {
    return (
        <div className="flex h-100 flex-col items-center justify-center gap-4">
          <p className="text-xl text-gray-600">Recipe not found</p>
          <Link href="/" className="text-[#094234] underline">
            Go back home
          </Link>
        </div>
    );
  }

  // const ingredients: string[] = JSON.parse(ingredientsData);
  const ingredients: IngredientsList[] = JSON.parse(ingredientsData);
  const rowNumb: string = Math.ceil(ingredients.length / 2).toString();
  console.log(`Number of ingredient rows: ${rowNumb}`);
  // console.log(`Parsed ingredients: ${ingredients.map((ing) => ing.ingredient_id).join(", ")}`);
  const directions: string[] = JSON.parse(recipe.directions);
  // let directionsArray = recipe.directions.split("\n")

  return (
    <div className="flex flex-col">
      {/* Recipe Title Section */}
      <section className="px-[10px] pt-[30px] pb-5 sm:px-5 md:px-10 lg:px-20">
        <div className="mx-auto max-w-175">
          <div className="flex items-center gap-[30px] pb-2">
            <h1 className="leading-1.2 font-abeezee text-[24px] tracking-[-0.48px] text-black sm:text-[28px] md:text-[32px]">
              {recipe.title}
            </h1>
            <div className="flex items-center gap-[6px]">
              <button
                onClick={toggleBookmark}
                className="flex h-5 items-center pr-[2px]"
                aria-label="Bookmark Recipe Button"
              >
                <Image
                  src={isBookmarked ? "/images/bookmark-filled.svg" : "/images/bookmark.svg"}
                  alt="bookmark"
                  width={16}
                  height={18}
                />
              </button>
              <button 
              className="size-[20px]"
              aria-label="Shopping Cart Button"
              >
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
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <DragonFruitRating rating={recipe.rating} iconWidth={17} iconHeight={20} />
            <span className="text-[14px] text-black">|</span>
            <div className="flex items-center gap-[6px]">
              <svg width="14" height="11" viewBox="0 0 10 7" fill="#E0165C" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 0.5C2.73 0.5 0.8 1.91 0 4C0.8 6.09 2.73 7.5 5 7.5C7.27 7.5 9.2 6.09 10 4C9.2 1.91 7.27 0.5 5 0.5ZM5 6.17C3.8 6.17 2.83 5.2 2.83 4C2.83 2.8 3.8 1.83 5 1.83C6.2 1.83 7.17 2.8 7.17 4C7.17 5.2 6.2 6.17 5 6.17ZM5 2.9C4.39 2.9 3.9 3.39 3.9 4C3.9 4.61 4.39 5.1 5 5.1C5.61 5.1 6.1 4.61 6.1 4C6.1 3.39 5.61 2.9 5 2.9Z"/>
              </svg>
              <span className="font-abeezee text-[12px] tracking-[0.25px] text-black">
                {recipe.views.toLocaleString()} views
              </span>
            </div>
            <span className="text-[14px] text-black">|</span>
            <div className="flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="6.5" stroke="#E0165C" strokeWidth="1.5"/>
                <path d="M8 4.5V8L10.5 10.5" stroke="#E0165C" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="font-abeezee text-[12px] tracking-[0.25px] text-black">
                {recipe.cookTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Image */}
      <section className="px-[10px] sm:px-5 md:px-10 lg:px-20">
        <div className="relative mx-auto aspect-350/185 w-full max-w-175 overflow-hidden rounded-[8px]">
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
      <section className="px-[10px] py-4 sm:px-5 md:px-10 lg:px-20">
        <div className="mx-auto max-w-175">
          <div className="mb-[10px] flex flex-col gap-[5px]">
            <div className="relative inline-block">
              <h2 className="font-abeezee text-[20px] tracking-[0.25px] text-black">
                Ingredients
              </h2>
              <div className="absolute bottom-[-6px] left-[-6px] h-[11px] w-32">
                <Image
                  src="/images/underline.svg"
                  alt=""
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            <div className="mt-2 px-2">
              <ServingSizeAdjuster
                baseServings={recipe.baseServings}
                minServings={recipe.minServings}
                servingIncrement={recipe.servingIncrement}
                currentServings={currentServings ?? recipe.baseServings}
                onServingsChange={setCurrentServings}
              />
            </div>
          </div>

          <div className="columns-1 gap-x-8 px-4 sm:columns-2">
            {(() => {
              // Group ingredients by component
              const groups: { component: string; items: { ingr: IngredientsList; index: number }[] }[] = [];
              ingredients.forEach((ingr, index) => {
                const lastGroup = groups[groups.length - 1];
                if (!lastGroup || lastGroup.component !== ingr.component) {
                  groups.push({ component: ingr.component, items: [{ ingr, index }] });
                } else {
                  lastGroup.items.push({ ingr, index });
                }
              });

              return groups.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-2 break-inside-avoid">
                  {group.component && (
                    <h3 className="pt-2 pb-1 font-abeezee text-[16px] font-bold text-[#094234]">
                      {group.component}
                    </h3>
                  )}
                  <div className="flex flex-col gap-[5px]">
                    {group.items.map(({ ingr, index }) => {
                      const multiplier = (currentServings ?? recipe.baseServings) / recipe.minServings;
                      const parsed = parseIngredient((currentServings ?? ingr.amount).toString() + " " + ingr.measUnit_id + " " + ingr.ingredient_id);
                      const scaledIngredient = scaleIngredient(parsed, multiplier, ingr.min_amount);

                      return (
                        <IngredientCheckbox
                          key={index}
                          amount={scaledIngredient}
                          measUnit={ingr.measUnit_id}
                          ingredient={ingr.ingredient_id}
                          checked={checkedIngredients.has(index)}
                          onChange={() => toggleIngredient(index)}
                        />
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center py-[10px]">
        <div className="h-px w-50 bg-gray-300"></div>
      </div>

      {/* Directions Section */}
      <section className="px-[10px] py-4 sm:px-5 md:px-10 lg:px-20">
        <div className="mx-auto mb-6 max-w-175">
          <div className="relative mb-[10px] inline-block">
            <h2 className="font-abeezee text-[20px] tracking-[0.25px] text-black">
              Directions
            </h2>
            <div className="absolute bottom-[-6px] -left-2 h-[11px] w-32">
              <Image
                src="/images/underline.svg"
                alt=""
                fill
                className="object-contain object-left"
              />
            </div>
          </div>

          <ol className="list-decimal space-y-[8px] pl-0">
            {directions.map((step, index) => {
              if (step.includes("title:")){
                return(
                  <p key={index} className="pt-4 pb-1 font-abeezee text-[16px] font-bold text-[#094234]">
                    {step.replace("title:", "")}
                  </p>
                );
              }
              else{
                return (
                    <li key={index} className="ml-[30px] pl-[5px] font-abeezee text-[14px] leading-normal tracking-[0.25px] text-black">
                      {parseStyledText(step, `step-${index}-`)}
                    </li>
                );
              }
            })}
          </ol>
        </div>
      </section>
    </div>
  );
}
