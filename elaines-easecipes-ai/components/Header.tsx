import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-[#094234] h-[53px] w-full shadow-[0px_2px_4px_rgba(0,0,0,0.79)] grid grid-cols-3 items-center justify-between px-[10px] sticky top-0 z-50">
      <button className="flex flex-col gap-[5px] items-center justify-center w-[30px] h-[30px] p-[4px]">
        <div className="w-[25px] h-[3px] bg-[#d9d9d9] rounded-[50px]" />
        <div className="w-[25px] h-[3px] bg-[#d9d9d9] rounded-[50px]" />
        <div className="w-[25px] h-[3px] bg-[#d9d9d9] rounded-[50px]" />
      </button>

      <div className="relative justify-center w-[120px] h-[55px]">
        <Image
          src="/images/logo-topbar.png"
          alt="Elaine's Easecipes"
          className="object-contain"
          width={110}
          height={46}
        />
      </div>

      <div className="flex justify-self-end justify-items-center items-end gap-[2px]">
        {/* <button className="w-[30px] h-[30px] flex items-center justify-center">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="6" r="5" stroke="#d9d9d9" strokeWidth="1.5" fill="none" />
            <line x1="10" y1="10" x2="14" y2="14" stroke="#d9d9d9" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button> */}
        <button className="w-[30px] h-[30px]">
          <Image
            src="/images/bookmark-filled.svg"
            alt="Saved Recipes"
            width={21}
            height={21}
          />
        </button>
        <button className="w-[30px] h-[30px]">
          <Image
            src="/images/cart.svg"
            alt="Cart"
            width={23}
            height={19}
          />
        </button>
      </div>
    </header>
  );
}
