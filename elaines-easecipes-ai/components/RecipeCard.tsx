import Image from "next/image";
import Link from "next/link";
import DragonFruitRating from "./DragonFruitRating";

interface RecipeCardProps {
  title: string;
  slug: string;
  tags: string[];
  image: string;
  rating: number;
  views: number;
  bookmarked?: boolean;
}

export default function RecipeCard({
  title,
  slug,
  tags,
  image,
  rating,
  views,
  bookmarked = false,
}: RecipeCardProps) {
  return (
    <Link 
    href={`/recipes/${slug}`} 
    className="relative block aspect-square w-full max-w-70 min-w-40 shrink-0 cursor-pointer justify-self-center overflow-hidden rounded-2xl shadow-[4px_4px_4px_rgba(0,0,0,0.25)] transition-transform hover:scale-102 hover:shadow-[4px_4px_4px_rgba(0,0,0,0.5)]"
    >
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover opacity-90 transition-opacity hover:opacity-100"
          sizes="(max-width: 640px) 46vw, (max-width: 768px) 30vw, (max-width: 1024px) 23vw, 280px"
        />
      </div>
      <div className="absolute top-1.25 left-2 flex flex-wrap gap-1">
        {tags.map((cat, index) => (
          <div key={index} className="rounded-[30px] border border-[#711F3B] bg-[#db1c5f] px-3 pt-px pb-0.75">
            <span className="font-abeezee text-[14px] leading-normal font-black tracking-[0.25px] text-[#ffffff] uppercase">
              {cat}
            </span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 flex h-auto min-h-12.5 w-full flex-col justify-between overflow-hidden rounded-bl-2xl bg-white p-1.5">
        <div className="flex w-full items-start justify-between gap-2">
          <p className="line-clamp-2 min-w-0 flex-1 font-abeezee text-xs leading-normal font-semibold tracking-tight text-black italic sm:text-sm md:text-base">
            {title}
          </p>
          <button aria-label="Bookmark Recipe Button">
            <div className="relative h-3.5 w-3 sm:mt-px sm:mr-0.5 md:mt-0.5 md:mr-0.5 md:h-4 md:w-3.5">
              <Image
                src={bookmarked ? "/images/bookmark-filled.svg" : "/images/bookmark.svg"}
                alt="bookmark"
                fill
              />
            </div>
          </button>
        </div>
        <div className="flex w-full items-center justify-between">
          <DragonFruitRating rating={rating} sizeClassName="w-3 h-3.5 sm:w-3.5 sm:h-4 md:w-4 md:h-[18px]" />
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3 sm:h-4 sm:w-3.5 md:h-4.5 md:w-4" viewBox="0 0 10 7" fill="#E0165C" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 0.5C2.73 0.5 0.8 1.91 0 4C0.8 6.09 2.73 7.5 5 7.5C7.27 7.5 9.2 6.09 10 4C9.2 1.91 7.27 0.5 5 0.5ZM5 6.17C3.8 6.17 2.83 5.2 2.83 4C2.83 2.8 3.8 1.83 5 1.83C6.2 1.83 7.17 2.8 7.17 4C7.17 5.2 6.2 6.17 5 6.17ZM5 2.9C4.39 2.9 3.9 3.39 3.9 4C3.9 4.61 4.39 5.1 5 5.1C5.61 5.1 6.1 4.61 6.1 4C6.1 3.39 5.61 2.9 5 2.9Z"/>
            </svg>
            <span className="text-[8px] leading-4 font-medium tracking-[0.05px] text-black/60 sm:text-[10px] md:text-[11px]">
              {views.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
