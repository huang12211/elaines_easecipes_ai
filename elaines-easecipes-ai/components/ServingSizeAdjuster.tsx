interface ServingSizeAdjusterProps {
  baseServings: number;
  minServings: number;
  servingIncrement: number;
  currentServings: number;
  onServingsChange: (newServings: number) => void;
  maxMultiplier?: number;
}

export default function ServingSizeAdjuster({
  baseServings,
  minServings,
  servingIncrement,
  currentServings,
  onServingsChange,
  maxMultiplier = 4,
}: ServingSizeAdjusterProps) {
  const maxServings = baseServings * maxMultiplier;
  const canDecrement = currentServings > minServings;
  const canIncrement = currentServings < maxServings;

  const handleDecrement = () => {
    if (canDecrement) {
      onServingsChange(currentServings - servingIncrement);
    }
  };

  const handleIncrement = () => {
    if (canIncrement) {
      onServingsChange(currentServings + servingIncrement);
    }
  };

  return (
    <div className="flex items-center gap-2.5"> 
      <span className="font-abeezee text-[16px] tracking-[0.25px] text-black">
        for
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleDecrement}
          disabled={!canDecrement}
          className={`flex size-6 items-center justify-center rounded-full border transition-colors ${
            canDecrement
              ? 'cursor-pointer border-[#094234] text-[#094234] hover:bg-[#094234] hover:text-white'
              : 'cursor-not-allowed border-gray-300 text-gray-300'
          }`}
          aria-label="Decrease servings button"
        >
          <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <span className="min-w-6 text-center font-abeezee text-[16px] tracking-[0.25px] text-black">
          {currentServings}
        </span>
        <button
          onClick={handleIncrement}
          disabled={!canIncrement}
          className={`flex size-6 items-center justify-center rounded-full border transition-colors ${
            canIncrement
              ? 'cursor-pointer border-[#094234] text-[#094234] hover:bg-[#094234] hover:text-white'
              : 'cursor-not-allowed border-gray-300 text-gray-300'
          }`}
          aria-label="Increase servings button"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <span className="font-abeezee text-[16px] tracking-[0.25px] text-black">
        servings
      </span>
    </div>
  );
}
