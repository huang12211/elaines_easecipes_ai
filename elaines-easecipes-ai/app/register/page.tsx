"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
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
    <div className="relative min-h-[calc(100vh-53px-80px)] sm:min-h-[calc(100vh-60px-100px)] xl:min-h-[calc(100vh-64px-116px)] bg-[radial-gradient(ellipse_at_center,rgba(191,221,165,0.2)_0%,rgba(142,173,116,0.2)_50%,rgba(118,149,92,0.2)_75%,rgba(93,125,67,0.2)_100%)]">
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
      <div className="relative flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-[16px] shadow-md w-full max-w-[400px] p-8">
          {/* Title */}
          <div className="mb-6">
            <h1 className="font-semibold text-[24px] text-black tracking-[-0.48px] leading-[1.2]">
              Create Account
            </h1>
            <div className="relative h-[19px] w-[180px] mt-[-4px] ml-[-4px]">
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
            <label className="block font-abeezee text-[15px] text-black tracking-[-0.408px] leading-[22px] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 font-abeezee text-[15px] text-black placeholder:text-[rgba(60,60,67,0.6)] tracking-[-0.408px] leading-[22px] outline-none border border-gray-200 focus:border-[#094234] rounded-sm"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="block font-abeezee text-[15px] text-black tracking-[-0.408px] leading-[22px] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="At least 8 characters"
              className="w-full px-4 py-2.5 font-abeezee text-[15px] text-black placeholder:text-[rgba(60,60,67,0.6)] tracking-[-0.408px] leading-[22px] outline-none border border-gray-200 focus:border-[#094234] rounded-sm"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block font-abeezee text-[15px] text-black tracking-[-0.408px] leading-[22px] mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Re-enter your password"
              className="w-full px-4 py-2.5 font-abeezee text-[15px] text-black placeholder:text-[rgba(60,60,67,0.6)] tracking-[-0.408px] leading-[22px] outline-none border border-gray-200 focus:border-[#094234] rounded-sm"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="font-abeezee text-[14px] text-red-600 tracking-[-0.408px] mb-3">
              {error}
            </p>
          )}

          {/* Submit button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-[#19604f] hover:bg-[#094234] transition-colors text-white font-abeezee text-[15px] tracking-[-0.408px] leading-[22px] px-6 py-2 rounded-[20px] disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          {/* Link to login */}
          <p className="font-abeezee text-[14px] text-center text-black tracking-[-0.408px]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#094234] underline hover:text-[#19604f] transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
