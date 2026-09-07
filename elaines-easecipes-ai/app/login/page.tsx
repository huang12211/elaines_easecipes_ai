"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="relative min-h-[calc(100vh-53px-80px)] sm:min-h-[calc(100vh-60px-100px)] xl:min-h-[calc(100vh-64px-116px)]">
      {/* Background image overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[rgba(24,183,145,0.3)]" />
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
      </div>

      {/* Form card */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-100 rounded-[16px] bg-white p-8 shadow-md">
          {/* Title */}
          <div className="relative mb-6 inline-block pr-6">
            <h1 className="leading-1.2 text-[24px] font-semibold tracking-[-0.48px] text-black">
              Login
            </h1>
            <div className="absolute inset-0 top-full mt-[-2px] -ml-1 h-[14px]">
              <Image
                src="/images/underline.svg"
                alt=""
                fill
                className="object-contain object-left"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="mb-1 block font-abeezee text-[15px] leading-[22px] tracking-[-0.408px] text-black">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="you@example.com"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 font-abeezee text-[15px] leading-[22px] tracking-[-0.408px] text-black outline-none placeholder:text-[rgba(60,60,67,0.6)] focus:border-[#094234]"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="mb-1 block font-abeezee text-[15px] leading-[22px] tracking-[-0.408px] text-black">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Your password"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 font-abeezee text-[15px] leading-[22px] tracking-[-0.408px] text-black outline-none placeholder:text-[rgba(60,60,67,0.6)] focus:border-[#094234]"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="mb-3 font-abeezee text-[14px] tracking-[-0.408px] text-red-600">
              {error}
            </p>
          )}

          {/* Submit button */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="rounded-[20px] bg-[#19604f] px-6 py-2 font-abeezee text-[15px] leading-[22px] tracking-[-0.408px] text-white transition-colors hover:bg-[#094234] disabled:opacity-50"
              aria-label="Search button"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>

          {/* Link to register */}
          <p className="text-center font-abeezee text-[14px] tracking-[-0.408px] text-black">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-extrabold text-[#094234] underline transition-colors hover:text-[#19604f]"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
