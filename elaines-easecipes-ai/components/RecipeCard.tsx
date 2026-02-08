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
    <Link href={`/recipes/${slug}`} className="w-full aspect-square min-w-[160px] max-w-[280px] rounded-[16px] overflow-hidden shadow-[4px_4px_4px_rgba(0,0,0,0.25)] relative shrink-0 block cursor-pointer transition-transform hover:scale-[1.02]">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 46vw, (max-width: 768px) 30vw, (max-width: 1024px) 23vw, 280px"
        />
      </div>
      <div className="absolute top-[5px] left-[8px] flex flex-wrap gap-1">
        {tags.map((cat, index) => (
          <div key={index} className="bg-[#ff1768] rounded-[30px] px-[12px] pt-[1px] pb-[3px]">
            <span className="font-abeezee text-[14px] text-white leading-normal tracking-[0.25px]">
              {cat}
            </span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-[85%] h-auto min-h-[50px] bg-white rounded-bl-[16px] rounded-tr-[10px] overflow-hidden p-1.5 flex flex-col justify-between">
        <div className="flex items-center justify-between w-full">
          <p className="font-abeezee text-[10px] sm:text-[11px] md:text-xs text-black tracking-[0.25px] leading-normal flex-1 min-w-0 line-clamp-2">
            {title}
          </p>
          <button className="flex items-center h-[14px] pr-[2px]">
            <Image
              src={bookmarked ? "/images/bookmark-filled.svg" : "/images/bookmark.svg"}
              alt="bookmark"
              width={13}
              height={14}
            />
          </button>
        </div>
        <div className="flex items-center justify-between w-full">
          <DragonFruitRating rating={rating} />
          <div className="flex items-center gap-[6px]">
            <svg width="10" height="8" viewBox="0 0 10 7" fill="#E0165C" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 0.5C2.73 0.5 0.8 1.91 0 4C0.8 6.09 2.73 7.5 5 7.5C7.27 7.5 9.2 6.09 10 4C9.2 1.91 7.27 0.5 5 0.5ZM5 6.17C3.8 6.17 2.83 5.2 2.83 4C2.83 2.8 3.8 1.83 5 1.83C6.2 1.83 7.17 2.8 7.17 4C7.17 5.2 6.2 6.17 5 6.17ZM5 2.9C4.39 2.9 3.9 3.39 3.9 4C3.9 4.61 4.39 5.1 5 5.1C5.61 5.1 6.1 4.61 6.1 4C6.1 3.39 5.61 2.9 5 2.9Z"/>
            </svg>
            <span className="text-[8px] font-medium text-black/60 tracking-[0.05px] leading-[16px]">
              {views.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
