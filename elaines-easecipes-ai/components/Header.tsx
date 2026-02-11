"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const categories = [
  "Appetizers",
  "Mains",
  "Sides",
  "Desserts",
  "Drinks",
  "Breakfast",
  "Celebrations",
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsCategoriesOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsCategoriesOpen(false);
  };

  return (
    <header className="bg-[#094234] h-[53px] sm:h-[60px] md:h-[64px] w-full shadow-[0px_2px_4px_rgba(0,0,0,0.79)] grid grid-cols-3 items-center justify-between px-2.5 sm:px-4 md:px-6 lg:px-10 sticky top-0 z-50">
      <div ref={menuRef} className="relative">
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            if (isMenuOpen) setIsCategoriesOpen(false);
          }}
          className="flex flex-col gap-[5px] items-center justify-center w-[30px] h-[30px] sm:w-[36px] sm:h-[36px] p-1"
        >
          <div className="w-[25px] h-[3px] bg-[#d9d9d9] rounded-[50px]" />
          <div className="w-[25px] h-[3px] bg-[#d9d9d9] rounded-[50px]" />
          <div className="w-[25px] h-[3px] bg-[#d9d9d9] rounded-[50px]" />
        </button>

        {isMenuOpen && (
          <div className="absolute top-[42px] sm:top-[50px] -left-2 w-[150px] rounded-[10px] z-50 bg-[#094234]">
            <Link
              href="/search"
              onClick={closeMenu}
              className="block w-full p-[15px] text-white font-abeezee text-[17px] leading-[22px] tracking-[-0.408px] hover:bg-white/10 hover:rounded-t-[10px]"
            >
              Search Recipes
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center justify-between w-full p-[15px] text-white font-abeezee text-[17px] leading-[22px] tracking-[-0.408px] hover:bg-white/10"
              >
                <span>Categories</span>
                <span>{`>`}</span>
              </button>

              {isCategoriesOpen && (
                <div className="absolute -top-0.5 left-[152px] w-[150px] bg-[#094234] rounded-[10px]">
                  {categories.map((category, index) => {
                    if (index === 0) {
                      return (
                        <Link
                          key={index}
                          href={`/categories/${category.toLowerCase()}`}
                          onClick={closeMenu}
                          className="block w-full p-[15px] text-white font-abeezee text-[17px] leading-[22px] tracking-[-0.408px] hover:bg-white/10 hover:rounded-t-[10px]"
                        >
                          {category}
                        </Link>
                      );
                    }
                    else if (index === categories.length - 1) {
                      return (
                        <Link
                          key={index}
                          href={`/categories/${category.toLowerCase()}`}
                          onClick={closeMenu}
                          className="block w-full p-[15px] text-white font-abeezee text-[17px] leading-[22px] tracking-[-0.408px] hover:bg-white/10 hover:rounded-b-[10px]"
                        >
                          {category}
                        </Link>
                      );
                    }
                    else{
                      return (
                        <Link
                          key={index}
                          href={`/categories/${category.toLowerCase()}`}
                          onClick={closeMenu}
                          className="block w-full p-[15px] text-white font-abeezee text-[17px] leading-[22px] tracking-[-0.408px] hover:bg-white/10"
                        >
                          {category}
                        </Link>
                      );
                    }
                  })}
                </div>
              )}
            </div>

            <Link
              href="/blog"
              onClick={closeMenu}
              className="block w-full p-[15px] text-white font-abeezee text-[17px] leading-[22px] tracking-[-0.408px]  hover:bg-white/10"
            >
              Blog
            </Link>

            <Link
              href="/store"
              onClick={closeMenu}
              className="block w-full p-[15px] text-white font-abeezee text-[17px] leading-[22px] tracking-[-0.408px]  hover:bg-white/10"
            >
              Store
            </Link>

            <Link
              href="/contact"
              onClick={closeMenu}
              className="block w-full p-[15px] text-white font-abeezee text-[17px] leading-[22px] tracking-[-0.408px] hover:bg-white/10 hover:rounded-b-[10px]"
            >
              Contact
            </Link>
          </div>
        )}
      </div>

      <Link href="/" className="relative justify-self-center w-[120px] h-[55px] sm:w-[140px] sm:h-[60px] md:w-[160px] md:h-[68px]">
        <Image
          // src="/images/logo-topbar.png"
          src="/images/Elaine'sEasecipes_TopBar_whiteoutline.png"
          alt="Elaine's Easecipes"
          className="object-contain"
          fill
          sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, 160px"
        />
      </Link>

      <div className="flex justify-self-end justify-items-center items-end gap-[2px]">
        <button className="w-[30px] h-[30px] sm:w-[36px] sm:h-[36px]">
          <Image
            src="/images/bookmark-book.svg"
            alt="Saved Recipes"
            width={21}
            height={21}
          />
        </button>
        <button className="w-[30px] h-[30px] sm:w-[36px] sm:h-[36px]">
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
