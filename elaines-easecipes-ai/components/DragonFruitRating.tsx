import Image from "next/image";

interface DragonFruitRatingProps {
  rating: number;
  maxRating?: number;
}

export default function DragonFruitRating({
  rating,
  maxRating = 5,
}: DragonFruitRatingProps) {
  return (
    <div className="flex gap-[2px] items-center">
      {Array.from({ length: maxRating }).map((_, i) => (
        <div key={i} className={`relative w-[12px] h-[14px] ${i >= rating ? "opacity-60" : ""}`}>
          <Image
            src={i < rating ? "/images/dragonfruit-full.png" : "/images/dragonfruit-empty.png"}
            alt={i < rating ? "filled rating" : "empty rating"}
            fill
            className="object-cover"
            sizes="12px"
          />
        </div>
      ))}
    </div>
  );
}
