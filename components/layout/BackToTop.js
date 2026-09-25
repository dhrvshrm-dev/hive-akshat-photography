"use client";
import { scrollToTarget } from "@/lib/scroll";

export default function BackToTop() {
  return (
    <button onClick={() => scrollToTarget(0, { offset: 0, duration: 2 })} className="link-sweep uppercase hover:text-bone">
      Back to top ↑
    </button>
  );
}
