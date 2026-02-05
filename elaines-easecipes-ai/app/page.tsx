import Image from "next/image";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import DragonFruitRating from "@/components/DragonFruitRating";

const newestRecipes = [
  {
    title: "Raspberry Chocolate Mousse",
    category: "Desserts",
    image: "/images/raspberry-chocolate-mousse.png",
    rating: 4,
    views: 43381,
  },
  {
    title: "Raspberry Chocolate Mousse",
    category: "Desserts",
    image: "/images/raspberry-chocolate-mousse.png",
    rating: 4,
    views: 43381,
  },
  {
    title: "Onion Pancakes",
    category: "Breakfast",
    image: "/images/onion-pancakes.png",
    rating: 4,
    views: 43381,
  },
  {
    title: "Onion Pancakes",
    category: "Breakfast",
    image: "/images/onion-pancakes.png",
    rating: 4,
    views: 43381,
  },
  {
    title: "Blueberry Muffins",
    category: "Breakfast",
    image: "/images/blueberry-muffins.png",
    rating: 4,
    views: 43381,
  },
  {
    title: "Blueberry Muffins",
    category: "Breakfast",
    image: "/images/blueberry-muffins.png",
    rating: 4,
    views: 43381,
  },
];

const popularRecipes = [
  {
    title: "Blueberry Muffins",
    category: "Breakfast",
    image: "/images/blueberry-muffins.png",
    rating: 4,
    views: 43381,
  },
  {
    title: "Onion Pancakes",
    category: "Breakfast",
    image: "/images/onion-pancakes.png",
    rating: 4,
    views: 43381,
  },
  {
    title: "Onion Pancakes",
    category: "Breakfast",
    image: "/images/onion-pancakes.png",
    rating: 4,
    views: 43381,
  },
  {
    title: "Onion Pancakes",
    category: "Breakfast",
    image: "/images/onion-pancakes.png",
    rating: 4,
    views: 43381,
  },
  {
    title: "Onion Pancakes",
    category: "Breakfast",
    image: "/images/onion-pancakes.png",
    rating: 4,
    views: 43381,
  },
  {
    title: "Onion Pancakes",
    category: "Breakfast",
    image: "/images/onion-pancakes.png",
    rating: 4,
    views: 43381,
  },
];

export default function Home() {
  return (
    <div className="bg-white min-h-screen max-w-[375px] mx-auto relative">
      <Header />

      <div
        className="relative"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(191,221,165,0.2) 0%, rgba(142,173,116,0.2) 50%, rgba(118,149,92,0.2) 75%, rgba(93,125,67,0.2) 100%)",
        }}
      >
        {/* Hero Section */}
        <section className="relative w-full h-[200px]">
          <div className="absolute inset-0 blur-[2px] overflow-hidden">
            <Image
              src="/images/hero-bg.png"
              alt="Hero background"
              fill
              className="object-cover"
              sizes="375px"
              priority
            />
          </div>
          <div className="absolute top-[26px] left-[45px] w-[294px] h-[149px] rounded-[16px] overflow-hidden shadow-[4px_4px_4px_rgba(0,0,0,0.25)]">
            <Image
              src="/images/apple-frangipane-tart.png"
              alt="Apple Frangipane Tart"
              fill
              className="object-cover"
              sizes="294px"
            />
            <div className="absolute bottom-0 left-0 w-[177px] h-[47px] bg-white rounded-bl-[16px] rounded-tr-[10px] overflow-hidden">
              <div className="absolute top-[6px] left-[6px] flex items-start gap-[20px]">
                <span className="font-abeezee text-[12px] text-black tracking-[0.25px] leading-normal whitespace-nowrap">
                  Apple Frangipane Tart
                </span>
                <button className="flex items-center h-[14px] w-[11px]">
                  <Image
                    src="/images/bookmark.svg"
                    alt="bookmark"
                    width={11}
                    height={14}
                  />
                </button>
              </div>
              <div className="absolute top-[26px] left-[6px] flex items-center">
                <DragonFruitRating rating={4} />
                <div className="flex items-center gap-[6px] ml-[51px]">
                  <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 0.5C2.73 0.5 0.8 1.91 0 4C0.8 6.09 2.73 7.5 5 7.5C7.27 7.5 9.2 6.09 10 4C9.2 1.91 7.27 0.5 5 0.5ZM5 6.17C3.8 6.17 2.83 5.2 2.83 4C2.83 2.8 3.8 1.83 5 1.83C6.2 1.83 7.17 2.8 7.17 4C7.17 5.2 6.2 6.17 5 6.17ZM5 2.9C4.39 2.9 3.9 3.39 3.9 4C3.9 4.61 4.39 5.1 5 5.1C5.61 5.1 6.1 4.61 6.1 4C6.1 3.39 5.61 2.9 5 2.9Z" fill="rgba(0,0,0,0.6)"/>
                  </svg>
                  <span className="text-[8px] font-medium text-black/60 tracking-[0.05px] leading-[16px]">
                    43,381
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newest Recipes Section */}
        <section className="relative px-[8px] py-[12px]">
          <div className="relative mb-[12px] pl-[2px]">
            <h2 className="font-semibold text-[24px] text-black tracking-[-0.48px] leading-[1.2]">
              Newest Recipes:
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

          <div className="my-4 grid grid-cols-2 gap-x-[8px] gap-y-[20px] justify-items-center">
            {newestRecipes.map((recipe, i) => (
              <RecipeCard key={i} {...recipe} />
            ))}
          </div>
        </section>

        {/* Most Popular Section */}
        <section className="relative mt-[20px] pb-[10px]">
          <div className="relative px-[8px] mb-[12px] pl-[10px]">
            <h2 className="font-semibold text-[24px] text-black tracking-[-0.48px] leading-[1.2]">
              Most Popular:
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

          <div className="flex gap-[5px] overflow-x-auto px-[5px] pb-[5px] scrollbar-hide">
            {popularRecipes.map((recipe, i) => (
              <RecipeCard key={i} {...recipe} />
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#094234] w-full py-[35px] flex items-center justify-center">
        <p className="font-bold text-[12px] text-white text-center tracking-[-0.24px]">
          &copy; Copyright 2025 Elaine&apos;s Easecipes.
        </p>
      </footer>
    </div>
  );
}
