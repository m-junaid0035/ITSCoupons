"use client";

import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-800 to-purple-600 text-white relative overflow-hidden">
      
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      {/* 404 Title */}
      <h1 className="text-7xl sm:text-8xl md:text-9xl font-extrabold mb-6 animate-bounce relative z-10">
        404
      </h1>

      {/* Message */}
      <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-lg text-center relative z-10">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* Rocket Icon */}
      <Rocket className="w-12 h-12 animate-bounce mb-6 relative z-10" />

      {/* Button */}
      <Button
        className="bg-white text-purple-800 font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1"
        onClick={() => (window.location.href = "/")}
      >
        Go Back Home
      </Button>

      {/* Pulse animation dots */}
      <div className="mt-12 flex gap-4 relative z-10">
        <div className="w-4 h-4 rounded-full bg-white animate-pulse"></div>
        <div className="w-4 h-4 rounded-full bg-white animate-pulse delay-200"></div>
        <div className="w-4 h-4 rounded-full bg-white animate-pulse delay-400"></div>
      </div>
    </div>
  );
}
