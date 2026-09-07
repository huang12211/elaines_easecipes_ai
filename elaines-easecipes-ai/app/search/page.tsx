"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import RecipeCard from "@/components/RecipeCard";
import { categories as cat} from "@/lib/categories";
import { useChat } from "@ai-sdk/react";

const categories = ["", ...cat]; // Add an empty string for "All Categories"

function renderMessage(text: string) {
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  return text.split('\n').map((line, i, arr) => {
    line = line.replace(/^\* /, '- ');
    const nodes: React.ReactNode[] = [];
    let last = 0;
    let match;
    linkRegex.lastIndex = 0;
    while ((match = linkRegex.exec(line)) !== null) {
      if (match.index > last) nodes.push(line.slice(last, match.index));
      match[2] = match[2].replace(/[''\u2019]/g, ''); // Remove single quotes from URL to prevent XSS
      nodes.push(
        <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-pink-700 hover:underline">
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
  // TODO: search-by-recipe-number is unfinished (no input wired up to setRecipeNumber).
  // const [recipeNumber, setRecipeNumber] = useState("");
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
    // if (recipeNumber) params.append("recipeNumber", recipeNumber);
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
    <div className="relative flex min-h-[calc(100vh-53px-80px)] flex-col sm:min-h-[calc(100vh-60px-100px)] xl:min-h-[calc(100vh-64px-116px)]">
      {/* Tab Bar */}
      <div className="flex shrink gap-2 border-b border-gray-200 px-4 pt-1 sm:px-6 md:hidden">
        {(["search", "chat"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`-rounded-b-[20px] w-full rounded-t-[20px] px-6 py-2 font-abeezee text-[15px] leading-5.5 tracking-[-0.408px] transition-colors sm:text-[17px] ${
              activeTab === tab
                ? "bg-[#094234] text-white"
                : "border-x border-t border-[#094234] bg-white text-[#094234] hover:bg-[#094234] hover:text-white"
            }`}
          >
            {tab === "search" ? "Classic Search" : "Pitaya Pal"}
          </button>
        ))}
      </div>
      
      <div className="flex grow flex-col md:flex md:flex-1 md:flex-row">
        {/* Search + Results Sections */}
        <div className={`flex w-full flex-col md:w-1/2 md:border-r md:border-[#094234] ${activeTab !== "search" ? "hidden md:flex" : ""}`}>
          <section className="relative -mt-px w-full border-t-2 border-[#094234]">
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-b from-[#094234] from-50% to-[#EFF5F4] to-98%" />
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
              <div className="mx-auto max-w-2xl">
                {/* Keywords */}
                <div className="mb-2 flex items-center gap-3 sm:gap-4">
                  <label className="w-22.5 shrink-0 font-abeezee text-[15px] leading-5.5 font-black text-white sm:w-25 sm:text-[17px]">
                    Keywords:
                  </label>
                  <div className="flex-1 rounded-sm bg-white shadow-sm">
                    <input
                      type="text"
                      placeholder="Search by recipe name or keywords (ex: muffin, pasta)"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full px-4 py-2.5 font-abeezee text-[15px] leading-5.5 tracking-[-0.408px] text-black outline-none placeholder:text-[rgba(60,60,67,0.6)] sm:text-[17px]"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="mb-2 flex items-center gap-3 sm:gap-4">
                  <label className="w-22.5 shrink-0 font-abeezee text-[15px] leading-5.5 font-black text-white sm:w-25 sm:text-[17px]">
                    Category:
                  </label>
                  <div className="flex-1 rounded-sm bg-white shadow-sm">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full cursor-pointer appearance-none bg-transparent px-4 py-2.5 font-abeezee text-[15px] leading-5.5 tracking-[-0.408px] text-black outline-none sm:text-[17px]"
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
                <div className="mb-4 flex items-center gap-3 sm:gap-4">
                  <label className="w-22.5 shrink-0 font-abeezee text-[15px] leading-5.5 font-black text-white sm:w-25 sm:text-[17px]">
                    Ingredients:
                  </label>
                  <div className="flex-1 rounded-sm bg-white shadow-sm">
                    <input
                      type="text"
                      placeholder="Search by ingredients (ex: chicken, blueberries, etc.)..."
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full px-4 py-2.5 font-abeezee text-[15px] leading-5.5 tracking-[-0.408px] text-black outline-none placeholder:text-[rgba(60,60,67,0.6)] sm:text-[17px]"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="rounded-[20px] bg-[#19604f] px-6 py-2 font-abeezee text-[15px] leading-5.5 tracking-[-0.408px] text-white transition-colors hover:bg-[#094234] disabled:opacity-50 sm:text-[17px]"
                    aria-label="Search Button"
                  >
                    {isLoading ? "Searching..." : "Search"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Search Results Section */}
          <section className="relative h-[calc(51vh)] overflow-y-scroll px-2 py-6 sm:px-4 md:h-[calc(58vh)] md:px-6 lg:px-8">
            {hasSearched && (
              <>
                <div className="relative mb-3 pl-4">
                  <h3 className="leading-1.2 text-[24px] font-semibold tracking-[-0.48px] text-gray-500">
                    {results.length > 0
                      ? `Search Results (${results.length})`
                      : ""}
                  </h3>
                </div>

                {results.length > 0 ? (
                  <div className="my-4 grid grid-cols-2 justify-items-center gap-x-2 gap-y-5 sm:gap-x-3 md:gap-x-5 lg:grid-cols-3 lg:gap-x-5">
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
                    <p className="text-center text-lg text-gray-500">
                      No recipes match your search criteria.
                    </p>
                    <p className="mt-2 text-center text-sm text-gray-400">
                      Try adjusting your search terms or filters.
                    </p>
                  </div>
                )}
              </>
            )}

            {!hasSearched && (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-center text-lg text-gray-500">
                  Already know what you&apos;re looking for?
                </p>
                <p className="text-center text-lg text-gray-500">
                  Use the classic search tools above to find your favourite Easecipe.
                </p>
                <p className="mt-2 text-center text-sm text-gray-400">
                  Search by keywords, category or ingredients.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Chat Section */}
        <div className={`flex w-full grow flex-col md:w-1/2 ${activeTab !== "chat" ? "hidden md:flex" : ""}`}>
          <section className="relative -mt-px flex size-full grow flex-col border-t-2 border-[#094234] pt-4 pb-8">
            <div className="bg-opacity-30 absolute top-0 right-0 size-full bg-[url('/images/dragonfruit_wallpaper.png')] bg-cover"> 
              <div className="size-full bg-linear-to-b from-[#094234] from-30% to-[#EFF5F4] to-100% opacity-80"/> {/* overlay to improve text visibility on background */}
            </div>

            <div className="relative mx-auto flex max-h-168 max-w-[calc(100%-2rem)] grow flex-col rounded-2xl bg-[#E3F0E5] px-4 py-6 shadow-sm">
              <div className="flex flex-row items-start gap-4 sm:gap-6">
                <Image
                  src="/images/pitaya_pal.png"
                  alt="Pitaya Pal"
                  width={100}
                  height={100}
                />
                <div>
                  <div className="relative mb-3 inline-block pr-8 pl-0.5">
                    <h2 className="leading-1.2 text-[24px] font-semibold tracking-[-0.48px] text-black">
                      Ask Pitaya Pal
                    </h2>
                    <div className="absolute inset-0 top-full -mt-1 -ml-1 h-4.75">
                      <Image
                        src="/images/underline.svg"
                        alt=""
                        fill
                        className="object-contain object-left"
                      />
                    </div>
                  </div>
                  <h3 className="pt-3">
                    Ask about taste profiles you&apos;re craving, recipes you can make with what you have on hand, cooking tips and more.
                  </h3>
                </div>
              </div>
              

              {messages.length >= 0 && (
                <div className="my-2 flex grow flex-col gap-3 overflow-y-auto rounded-2xl bg-[#F9FAF5]  px-4 py-2">
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
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 font-abeezee text-[15px] leading-5.5 tracking-[-0.408px] sm:text-[17px] ${
                            m.role === "user"
                              ? "rounded-br-sm bg-[#19604f] text-white"
                              : "rounded-bl-sm bg-gray-100 text-black"
                          }`}
                        >
                          {renderMessage(text)}
                        </div>
                      </div>
                    );
                  })}
                  {chatSubmitting && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-2.5 font-abeezee text-[15px] leading-5.5 tracking-[-0.408px] text-black italic">
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
                <div className="flex-1 rounded-sm border border-gray-200 bg-white shadow-sm">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about recipes, ingredients, cooking tips..."
                    className="w-full bg-transparent px-4 py-2.5 font-abeezee text-[15px] leading-5.5 tracking-[-0.408px] text-black outline-none placeholder:text-[rgba(60,60,67,0.6)] sm:text-[17px]"
                    aria-label="Chat with Pitaya Pal input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="h-full shrink-0 place-self-end rounded-[20px] bg-[#19604f] px-6 py-2 font-abeezee text-[15px] leading-5.5 tracking-[-0.408px] text-white transition-colors hover:bg-[#094234] disabled:opacity-50 sm:text-[17px]"
                  aria-label="Send message to Pitaya Pal"
                >
                  {chatLoading ? "..." : "Send"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
