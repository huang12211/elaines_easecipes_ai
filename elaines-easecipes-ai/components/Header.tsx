"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { categories } from "@/lib/categories";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [authState, setAuthState] = useState<{ email: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => { setAuthState(data); setAuthLoading(false); })
      .catch(() => setAuthLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthState(null);
    router.refresh();
    window.location.href = window.location.href; // Force full page reload to clear any client-side state
  };

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
    <header className="bg-[#094234] h-[53px] sm:h-[60px] md:h-[64px] w-full shadow-[0px_2px_4px_rgba(0,0,0,0.79)] flex items-center justify-between px-2.5 sm:px-4 md:px-6 lg:px-10 sticky top-0 z-50">
      {/* Logo - left on desktop, center on mobile */}
      <Link 
        href="/" className="relative w-[120px] h-[55px] sm:w-[140px] sm:h-[60px] md:w-[160px] md:h-[68px] order-2 md:hidden"
        aria-label = "Return to Homepage button"
      >
        <Image
          src="/images/Elaine'sEasecipes_TopBar_whiteoutline.png"
          alt="Elaine's Easecipes"
          className="object-contain"
          fill
          sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, 160px"
        />
      </Link>

      {/* Mobile hamburger menu - visible only on mobile */}
      <div ref={menuRef} className="relative md:hidden order-1">
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            if (isMenuOpen) setIsCategoriesOpen(false);
          }}
          className="flex flex-col gap-[5px] items-center justify-center w-[30px] h-[30px] sm:w-[36px] sm:h-[36px] p-1"
          aria-label="Menu Button"
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
              aria-label="Go to Search Recipes Page Button"
            >
              Search Recipes
            </Link>

            <div className="relative">
              <button
                onMouseEnter={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center justify-between w-full p-[15px] text-white font-abeezee text-[17px] leading-[22px] tracking-[-0.408px] hover:bg-white/10"
                aria-label="Recipe Categories Drop-down Button"
              >
                <span>Categories</span>
                <span>{`>`}</span>
              </button>

              {isCategoriesOpen && (
                <div
                onMouseLeave={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="absolute -top-0.5 left-[152px] w-[125px] bg-[#094234] rounded-[10px]"
                >
                  {categories.map((category, index) => {
                    if (index === 0) {
                      return (
                        <Link
                          key={index}
                          href={`/categories/${category.toLowerCase()}`}
                          onClick={closeMenu}
                          className="block w-full p-[15px] text-white font-abeezee text-[17px] leading-[22px] tracking-[-0.408px] hover:bg-white/10 hover:rounded-t-[10px]"
                          aria-label={`Go to page of recipes of only ${category}`}
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
                          aria-label={`Go to page of recipes of only ${category}`}
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
                          aria-label={`Go to page of recipes of only ${category}`}
                        >
                          {category}
                        </Link>
                      );
                    }
                  })}
                </div>
              )}
            </div>

            {/* <Link
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
            </Link> */}

            {!authLoading && (
              authState ? (
                <button
                  onClick={() => { handleLogout(); closeMenu(); }}
                  className="block w-full p-[15px] text-white font-abeezee text-[17px] leading-[22px] tracking-[-0.408px] hover:bg-white/10 hover:rounded-b-[10px] text-left"
                  aria-label="Logout Button"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="block w-full p-[15px] text-white font-abeezee text-[17px] leading-[22px] tracking-[-0.408px] hover:bg-white/10 hover:rounded-b-[10px]"
                  aria-label="Go to Login Page"
                >
                  Login
                </Link>
              )
            )}
          </div>
        )}
      </div>

      {/* Desktop navigation - visible only on desktop */}
      <nav className="hidden md:flex flex-row flex-nowrap items-end gap-6 order-1 lg:gap-8 order-1">
        <Link 
          href="/" 
          className="relative w-[120px] h-[55px] sm:w-[140px] sm:h-[60px] md:w-[160px] md:h-[68px]"
          aria-label="Go to Home Page"
        >
          <Image
            src="/images/Elaine'sEasecipes_TopBar_whiteoutline.png"
            alt="Elaine's Easecipes"
            className="object-contain"
            fill
            sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, 160px"
          />
        </Link>
        <Link
          href="/search"
          className="text-white font-abeezee text-[15px] md:pb-4.5 lg:text-[17px] leading-[22px] tracking-[-0.408px] hover:text-white/80 transition-colors"
          aria-label="Go to Search Recipes"
        >
          Search Recipes
        </Link>

        <div className="relative group">
          <button
            onMouseEnter={() => setIsCategoriesOpen(true)}
            className="flex flex-row items-center px-2 gap-3 text-white font-abeezee text-[15px] md:pb-4.5 lg:text-[17px] leading-[22px] tracking-[-0.408px] hover:text-white/80 transition-colors"
            aria-label="Recipe Categories Drop-down Button"
          >
            <span>Categories</span>
            <span className="text-xs">▼</span>
          </button>

          {isCategoriesOpen && (
            <div
              onMouseLeave={() => setIsCategoriesOpen(false)}
              className="absolute top-full left-0 bg-[#094234] rounded-[10px] shadow-lg"
            >
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={`/categories/${category.toLowerCase()}`}
                  onClick={() => setIsCategoriesOpen(false)}
                  className={`block w-full p-[15px] text-white font-abeezee text-[17px] tracking-[-0.408px] hover:bg-white/10 ${
                    index === 0 ? 'hover:rounded-t-[10px]' : ''
                  } ${index === categories.length - 1 ? 'hover:rounded-b-[10px]' : ''}`}
                  aria-label={`Go to page of recipes of only ${category}`}
                >
                  {category}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* <Link
          href="/blog"
          className="text-white font-abeezee text-[15px] md:pb-4.5 lg:text-[17px] leading-[22px] tracking-[-0.408px] hover:text-white/80 transition-colors"
        >
          Blog
        </Link>

        <Link
          href="/store"
          className="text-white font-abeezee text-[15px] md:pb-2 lg:text-[17px] leading-[22px] tracking-[-0.408px] hover:text-white/80 transition-colors"
        >
          Store
        </Link>

        <Link
          href="/contact"
          className="text-white font-abeezee text-[15px] md:pb-2 lg:text-[17px] leading-[22px] tracking-[-0.408px] hover:text-white/80 transition-colors"
        >
          Contact
        </Link> */}
      </nav>
      
      {/* <div className="hidden text-[#094234] md:flex flex-row flex-nowrap items-end gap-6 order-3 lg:gap-8 w-1/5 order-3 ">
        <p>hidden</p>
      </div> */}

      {/* Icons - right side on both mobile and desktop */}
      <div className="flex items-center gap-[2px] order-3 md:order-4">
        {/* <button className="w-[30px] h-[30px] sm:w-[36px] sm:h-[36px]">
          <Image
            src="/images/bookmark-book.svg"
            alt="Saved Recipes"
            width={21}
            height={21}
          />
        </button> */}
        {/* <button 
          className="w-[30px] h-[30px] sm:w-[36px] sm:h-[36px]"
          aria-label="Shopping Cart Button"
        >
          <Image
            src="/images/cart.svg"
            alt="Cart"
            width={23}
            height={19}
          /> 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#094234" className="size-6 sm:size-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        </button> */}

        {!authLoading && (
          authState ? (
            <button
              onClick={handleLogout}
              className="hidden md:block text-white font-abeezee text-[15px] lg:text-[17px] leading-[22px] tracking-[-0.408px] hover:text-white/80 transition-colors"
              aria-label="Logout Button"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden md:block text-white font-abeezee text-[15px] lg:text-[17px] leading-[22px] tracking-[-0.408px] hover:text-white/80 transition-colors"
              aria-label="Go to Login Page"
            >
              Login
            </Link>
          )
        )}
      </div>
    </header>
  );
}
