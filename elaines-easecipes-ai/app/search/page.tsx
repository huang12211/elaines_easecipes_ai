"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import { categories as cat} from "@/lib/categories";
import { useChat } from "@ai-sdk/react";

const categories = ["", ...cat]; // Add an empty string for "All Categories"

function renderMessage(text: string) {
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  return text.split('\n').map((line, i, arr) => {
    const nodes: React.ReactNode[] = [];
    let last = 0;
    let match;
    linkRegex.lastIndex = 0;
    while ((match = linkRegex.exec(line)) !== null) {
      if (match.index > last) nodes.push(line.slice(last, match.index));
      match[2] = match[2].replace(/[''\u2019]/g, ''); // Remove single quotes from URL to prevent XSS
      nodes.push(
        <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer" className="hover:underline text-emerald-700">
          {match[1]}
        </a>
      );
      last = match.index + match[0].length;
    }
    if (last < line.length) nodes.push(line.slice(last));
    return <span key={i}>{nodes.length ? nodes : line}{i < arr.length - 1 && <br />}</span>;
  });
}

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
  const [activeTab, setActiveTab] = useState<"search" | "chat">("search");
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
  const chatSubmitting = status === "submitted";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [thinkingDots, setThinkingDots] = useState(0);

  useEffect(() => {
    if (!chatSubmitting) return;
    const interval = setInterval(() => setThinkingDots((d) => (d + 1) % 4), 500);
    return () => clearInterval(interval);
  }, [chatSubmitting]);

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
      {/* Tab Bar */}
      <div className="flex shrink gap-2 px-4 pt-1 sm:px-6 md:px-8 lg:px-12 border-b border-gray-200">
        {(["search", "chat"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full font-abeezee text-[15px] sm:text-[17px] tracking-[-0.408px] leading-[22px] px-6 py-2 rounded-t-[20px] -rounded-b-[20px] transition-colors ${
              activeTab === tab
                ? "bg-[#094234] text-white"
                : "bg-white text-[#094234] border-t border-l border-r border-[#094234] hover:bg-[#094234] hover:text-white"
            }`}
          >
            {tab === "search" ? "Classic Search" : "Pitaya Pal"}
          </button>
        ))}
      </div>

      {/* Search + Results Sections */}
      {activeTab === "search" && (
        <>
        <section className="relative w-full -mt-0.25 border-t-2 border-[#094234]">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#094234] from-50% to-[#EFF5F4] to-98%" />
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
          {/* <div className="relative mb-[12px] pl-[2px] pr-8 inline-block">
            <h2 className="font-semibold text-[24px] text-black tracking-[-0.48px] leading-[1.2]">
              Classic Search Tools
            </h2>
            <div className="absolute top-full inset-0 h-[19px] mt-[-4px] ml-[-4px]">
              <Image
                src="/images/underline.svg"
                alt=""
                fill
                className="object-contain object-left"
              />
            </div>
          </div> */}
          <div className="max-w-2xl mx-auto">
            {/* Keywords */}
            <div className="flex items-center gap-3 mb-2 sm:gap-4">
              <label className="font-abeezee text-[15px] sm:text-[17px] text-white font-black leading-[22px] w-[90px] sm:w-[100px] shrink-0">
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
              <label className="font-abeezee text-[15px] sm:text-[17px] text-white font-black leading-[22px] w-[90px] sm:w-[100px] shrink-0">
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
              <label className="font-abeezee text-[15px] sm:text-[17px] text-white font-black leading-[22px] w-[90px] sm:w-[100px] shrink-0">
                Ingredients:
              </label>
              <div className="flex-1 bg-white rounded-sm shadow-sm">
                <input
                  type="text"
                  placeholder="Search by ingredients (ex: chicken, blueberries, etc.)..."
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
              <div className="relative mb-[12px] pl-4">
                <h3 className="font-semibold text-[24px] text-pink-700 tracking-[-0.48px] leading-[1.2]">
                  {results.length > 0
                    ? `Search Results (${results.length})`
                    : ""}
                </h3>
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
                Already know what you're looking for?
              </p>
              <p className="text-gray-500 text-lg text-center">
                Use the classic search tools above to find your favourite Easecipe.
              </p>
              <p className="text-gray-400 text-sm mt-2 text-center">
                Search by keywords, category or ingredients.
              </p>
            </div>
          )}
        </section>
      </>
      )}

      {/* Chat Section */}
      {activeTab === "chat" && (
      <>
        <section className="relative w-full -mt-0.25 pt-4 pb-8 border-t-2 border-[#094234] bg-[url('/images/dragonfruit_wallpaper.png')] bg-center bg-opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-[#094234] from-30% to-[#EFF5F4] to-100% opacity-80"/> {/* overlay to improve text visibility on background */}


          <div className="relative max-w-2xl mx-auto py-6 px-4 bg-[#E3F0E5] rounded-2xl shadow-sm">
            <div className="flex flex-row items-start gap-4 sm:gap-6">
              <Image
                src="/images/pitaya_pal.png"
                alt="Pitaya Pal"
                width={100}
                height={100}
              />
              <div>
                <div className="relative mb-[12px] pl-[2px] pr-8 inline-block">
                  <h2 className="font-semibold text-[24px] text-black tracking-[-0.48px] leading-[1.2]">
                    Ask Pitaya Pal
                  </h2>
                  <div className="absolute top-full inset-0 h-[19px] mt-[-4px] ml-[-4px]">
                    <Image
                      src="/images/underline.svg"
                      alt=""
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                </div>
                <h3 className="pt-3">
                  Ask about taste profiles you're craving, recipes you can make with what you have on hand, cooking tips and more. 
                </h3>
              </div>
            </div>
            

            {messages.length >= 0 && (
              <div className="my-2 h-76 overflow-y-auto flex shrink-0 flex-col gap-3 pr-1 bg-[#F9FAF5] rounded-2xl">
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
                        {renderMessage(text)}
                      </div>
                    </div>
                  );
                })}
                {chatSubmitting && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-black italic px-4 py-2.5 rounded-2xl rounded-bl-sm font-abeezee text-[15px] tracking-[-0.408px] leading-[22px]">
                      {"thinking" + ".".repeat(thinkingDots)}
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
                  aria-label="Chat with Pitaya Pal input"
                />
              </div>
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="h-full place-self-end bg-[#19604f] hover:bg-[#094234] transition-colors text-white font-abeezee text-[15px] sm:text-[17px] tracking-[-0.408px] leading-[22px] px-6 py-2 rounded-[20px] disabled:opacity-50 shrink-0"
                aria-label="Send message to Pitaya Pal"
              >
                {chatLoading ? "..." : "Send"}
              </button>
            </form>
          </div>
        </section>
      </>
      )}
    </div>
  );
}
