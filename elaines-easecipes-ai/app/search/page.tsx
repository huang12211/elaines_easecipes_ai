"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import { categories as cat} from "@/lib/categories";
import { useChat } from "@ai-sdk/react";

const categories = ["", ...cat]; // Add an empty string for "All Categories"

interface Recipe {
  id: number;
  title: string;
  slug: string;
  tags: string;
  image: string;
  rating: number;
  views: number;
  bookmarked: boolean;
}

export default function SearchPage() {
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState("");
  const [recipeNumber, setRecipeNumber] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [results, setResults] = useState<Recipe[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { messages, sendMessage, status } = useChat();
  const [chatInput, setChatInput] = useState("");
  const chatLoading = status === "submitted" || status === "streaming";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);

    const params = new URLSearchParams();
    if (keywords) params.append("keywords", keywords);
    if (category) params.append("category", category);
    if (recipeNumber) params.append("recipeNumber", recipeNumber);
    if (ingredients) params.append("ingredients", ingredients);

    try {
      const response = await fetch(`/api/recipes/search?${params.toString()}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-53px-80px)] sm:min-h-[calc(100vh-60px-100px)] xl:min-h-[calc(100vh-64px-116px)]">
      {/* Search Form Section */}
      <section className="relative w-full">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[rgba(24,183,145,0.3)]" />
          <Image
            src="/images/hero-bg.png"
            alt=""
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>

        {/* Search Form */}
        <div className="relative px-4 py-6 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-2xl mx-auto">
            {/* Keywords */}
            <div className="flex items-center gap-3 mb-2 sm:gap-4">
              <label className="font-abeezee text-[15px] sm:text-[17px] text-black tracking-[-0.408px] leading-[22px] w-[90px] sm:w-[100px] shrink-0">
                Keywords:
              </label>
              <div className="flex-1 bg-white rounded-sm shadow-sm">
                <input
                  type="text"
                  placeholder="Search by recipe name or keywords (ex: muffin, pasta)"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-2.5 font-abeezee text-[15px] sm:text-[17px] text-black placeholder:text-[rgba(60,60,67,0.6)] tracking-[-0.408px] leading-[22px] outline-none"
                />
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center gap-3 mb-2 sm:gap-4">
              <label className="font-abeezee text-[15px] sm:text-[17px] text-black tracking-[-0.408px] leading-[22px] w-[90px] sm:w-[100px] shrink-0">
                Category:
              </label>
              <div className="flex-1 bg-white rounded-sm shadow-sm">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 font-abeezee text-[15px] sm:text-[17px] text-black tracking-[-0.408px] leading-[22px] outline-none appearance-none bg-transparent cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='9' cy='9' r='8.5' stroke='%23094234'/%3E%3Cpath d='M5.5 7.5L9 11L12.5 7.5' stroke='%23094234' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    paddingRight: "40px",
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ingredients */}
            <div className="flex items-center gap-3 mb-4 sm:gap-4">
              <label className="font-abeezee text-[15px] sm:text-[17px] text-black tracking-[-0.408px] leading-[22px] w-[90px] sm:w-[100px] shrink-0">
                Ingredients:
              </label>
              <div className="flex-1 bg-white rounded-sm shadow-sm">
                <input
                  type="text"
                  placeholder="Search by ingredient..."
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-2.5 font-abeezee text-[15px] sm:text-[17px] text-black placeholder:text-[rgba(60,60,67,0.6)] tracking-[-0.408px] leading-[22px] outline-none"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-[#19604f] hover:bg-[#094234] transition-colors text-white font-abeezee text-[15px] sm:text-[17px] tracking-[-0.408px] leading-[22px] px-6 py-2 rounded-[20px] disabled:opacity-50"
                aria-label="Search Button"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      <section className="relative px-2 py-6 sm:px-4 md:px-6 lg:px-8 min-h-[calc(51vh)] sm:min-h-[calc(48vh)] md:min-h-[calc(45vh)]">
        {hasSearched && (
          <>
            <div className="relative mb-[12px] pl-[2px]">
              <h2 className="font-semibold text-[24px] text-black tracking-[-0.48px] leading-[1.2]">
                {results.length > 0
                  ? `Search Results (${results.length})`
                  : "No Results Found"}
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

            {results.length > 0 ? (
              <div className="my-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-5 sm:gap-x-3 md:gap-x-4 lg:gap-x-5 justify-items-center">
                {results.map((recipe) => (
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
                  No recipes match your search criteria.
                </p>
                <p className="text-gray-400 text-sm mt-2 text-center">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            )}
          </>
        )}

        {!hasSearched && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-500 text-lg text-center">
              Use the search form above to find recipes.
            </p>
            <p className="text-gray-400 text-sm mt-2 text-center">
              Search by keywords, category or ingredients.
            </p>
          </div>
        )}
      </section>

      {/* Chat Section */}
      <section className="px-4 py-6 sm:px-6 md:px-8 lg:px-12 border-t border-gray-200">
        <div className="max-w-2xl mx-auto">
          <div className="relative mb-[12px] pl-[2px]">
            <h2 className="font-semibold text-[24px] text-black tracking-[-0.48px] leading-[1.2]">
              Ask Pitaya Pal
            </h2>
            <div className="relative h-[19px] w-[120px] mt-[-6px] ml-[-4px]">
              <Image
                src="/images/underline.svg"
                alt=""
                fill
                className="object-contain object-left"
              />
            </div>
          </div>

          {messages.length > 0 && (
            <div className="mb-4 max-h-80 overflow-y-auto flex flex-col gap-3 pr-1">
              {messages.map((m) => {
                const text = m.parts
                  .filter((p) => p.type === "text")
                  .map((p) => (p as { type: "text"; text: string }).text)
                  .join("");
                return (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl font-abeezee text-[15px] sm:text-[17px] tracking-[-0.408px] leading-[22px] ${
                        m.role === "user"
                          ? "bg-[#19604f] text-white rounded-br-sm"
                          : "bg-gray-100 text-black rounded-bl-sm"
                      }`}
                    >
                      {text}
                    </div>
                  </div>
                );
              })}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-black px-4 py-2.5 rounded-2xl rounded-bl-sm font-abeezee text-[15px] tracking-[-0.408px] leading-[22px]">
                    ...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!chatInput.trim() || chatLoading) return;
              sendMessage({ text: chatInput });
              setChatInput("");
            }}
            className="flex gap-2"
          >
            <div className="flex-1 bg-white rounded-sm shadow-sm border border-gray-200">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about recipes, ingredients, cooking tips..."
                className="w-full px-4 py-2.5 font-abeezee text-[15px] sm:text-[17px] text-black placeholder:text-[rgba(60,60,67,0.6)] tracking-[-0.408px] leading-[22px] outline-none bg-transparent"
                aria-label="Chat with Claude"
              />
            </div>
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="bg-[#19604f] hover:bg-[#094234] transition-colors text-white font-abeezee text-[15px] sm:text-[17px] tracking-[-0.408px] leading-[22px] px-6 py-2 rounded-[20px] disabled:opacity-50 shrink-0"
              aria-label="Send message to Claude"
            >
              {chatLoading ? "..." : "Send"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
