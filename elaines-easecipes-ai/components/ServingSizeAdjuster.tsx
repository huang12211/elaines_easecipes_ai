interface ServingSizeAdjusterProps {
  baseServings: number;
  minServings: number;
  currentServings: number;
  onServingsChange: (newServings: number) => void;
  maxMultiplier?: number;
}

export default function ServingSizeAdjuster({
  baseServings,
  minServings,
  currentServings,
  onServingsChange,
  maxMultiplier = 4,
}: ServingSizeAdjusterProps) {
  const maxServings = baseServings * maxMultiplier;
  const canDecrement = currentServings > minServings;
  const canIncrement = currentServings < maxServings;

  const handleDecrement = () => {
    if (canDecrement) {
      onServingsChange(currentServings - minServings);
    }
  };

  const handleIncrement = () => {
    if (canIncrement) {
      onServingsChange(currentServings + minServings);
    }
  };

  return (
    <div className="flex items-center gap-[10px]">
      <span className="font-abeezee text-[16px] text-black tracking-[0.25px]">
        for
      </span>
      <div className="flex items-center gap-[6px]">
        <button
          onClick={handleDecrement}
          disabled={!canDecrement}
          className={`w-[24px] h-[24px] rounded-full border flex items-center justify-center transition-colors ${
            canDecrement
              ? 'border-[#094234] text-[#094234] hover:bg-[#094234] hover:text-white cursor-pointer'
              : 'border-gray-300 text-gray-300 cursor-not-allowed'
          }`}
          aria-label="Decrease servings"
        >
          <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <span className="font-abeezee text-[16px] text-black tracking-[0.25px] min-w-[24px] text-center">
          {currentServings}
        </span>
        <button
          onClick={handleIncrement}
          disabled={!canIncrement}
          className={`w-[24px] h-[24px] rounded-full border flex items-center justify-center transition-colors ${
            canIncrement
              ? 'border-[#094234] text-[#094234] hover:bg-[#094234] hover:text-white cursor-pointer'
              : 'border-gray-300 text-gray-300 cursor-not-allowed'
          }`}
          aria-label="Increase servings"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <span className="font-abeezee text-[16px] text-black tracking-[0.25px]">
        servings
      </span>
    </div>
  );
}
