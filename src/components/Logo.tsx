import { motion } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";

interface LogoProps {
  className?: string;
}

const originalLetters = ["K", "r", "i", "s", "h", "n", "a"];
const scrambleChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export const Logo = ({ className = "" }: LogoProps) => {
  const [displayLetters, setDisplayLetters] = useState(originalLetters);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAnimatingRef = useRef(false);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isAnimatingRef.current = false;
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const handleMouseEnter = useCallback(() => {
    // Always clean up previous animation first
    cleanup();
    isAnimatingRef.current = true;

    let iteration = 0;
    const maxIterations = 10;

    intervalRef.current = setInterval(() => {
      if (!isAnimatingRef.current) {
        cleanup();
        return;
      }
      
      setDisplayLetters(
        originalLetters.map((letter, index) => {
          if (iteration > index * 1.2) return letter;
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
      );

      iteration += 0.5;

      if (iteration >= maxIterations) {
        setDisplayLetters(originalLetters);
        cleanup();
      }
    }, 35);
  }, [cleanup]);

  const handleMouseLeave = useCallback(() => {
    cleanup();
    setDisplayLetters(originalLetters);
  }, [cleanup]);

  return (
    <motion.a
      href="#hero"
      className={`logo-elegant text-[hsl(var(--navbar-foreground))] hover:text-primary transition-colors duration-300 flex items-baseline select-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayLetters.map((letter, index) => (
        <span
          key={index}
          className="font-semibold inline-block"
          style={{
            color: letter !== originalLetters[index] ? "hsl(var(--primary))" : undefined,
            transition: "color 0.1s",
          }}
        >
          {letter}
        </span>
      ))}
      <span className="text-primary text-2xl leading-none ml-0.5">.</span>
    </motion.a>
  );
};
