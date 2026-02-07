import Image from "next/image";

interface DragonFruitRatingProps {
  rating: number;
  maxRating?: number;
  iconWidth?: number;
  iconHeight?: number;
}

export default function DragonFruitRating({
  rating,
  maxRating = 5,
  iconWidth = 12,
  iconHeight = 14,
}: DragonFruitRatingProps) {
  return (
    <div className="flex gap-[2px] items-center">
      {Array.from({ length: maxRating }).map((_, i) => (
        <div key={i} className={`relative ${i >= rating ? "opacity-60" : ""}`} style={{ width: iconWidth, height: iconHeight }}>
          <Image
            src={i < rating ? "/images/dragonfruit-full.png" : "/images/dragonfruit-empty.png"}
            alt={i < rating ? "filled rating" : "empty rating"}
            fill
            className="object-cover"
            sizes={`${iconWidth}px`}
          />
        </div>
      ))}
    </div>
  );
}
