"use client";
// framer-motion's useReducedMotion, made hydration-safe.
//
// The server cannot know the visitor's motion preference, so it always renders
// the animated markup. If the browser's first render used the real preference
// instead, every component that renders differently under reduced motion would
// mismatch, and React would throw the server HTML away and re-render the whole
// page — losing the attributes the <head> script set on <html> on the way. So
// the first render always says "no preference", matching the server, and the
// real answer arrives one commit later.
import { useEffect, useState } from "react";
import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

export function useReducedMotion() {
  const prefers = useFramerReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? Boolean(prefers) : false;
}
