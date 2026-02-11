import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { TypewriterText } from "./AnimatedText";
import { WordMatchGame } from "./games/WordMatchGame";
import { EarthquakeExplosion } from "./easter-eggs/EarthquakeExplosion";
import { ArrowDown, Sparkles, FileText, Terminal } from "lucide-react";

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showGame, setShowGame] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [typedBuffer, setTypedBuffer] = useState("");

  // Secret typed command: typing "play" anywhere triggers the game
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setTypedBuffer(prev => {
      const next = (prev + e.key).slice(-4);
      if (next.toLowerCase() === "play") {
        setTimeout(() => setShowGame(true), 100);
        return "";
      }
      return next;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Secret easter egg - click the sparkle icon 5 times rapidly
  const handleSecretClick = () => {
    const now = Date.now();
    if (now - lastClickTime > 2000) {
      setSecretClicks(1);
    } else {
      const newCount = secretClicks + 1;
      setSecretClicks(newCount);
      if (newCount >= 5) {
        setShowExplosion(true);
        setSecretClicks(0);
      }
    }
    setLastClickTime(now);
  };

  // Sparkle animation intensity based on click count
  const sparkleScale = 1 + secretClicks * 0.15;
  const sparkleRotation = secretClicks * 180;
  const glowIntensity = secretClicks * 0.25;

  return (
    <>
      <section
        ref={containerRef}
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        <motion.div
          className="relative z-10 section-container flex flex-col items-center justify-center text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Terminal-style greeting */}
          <motion.div
            className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div
              className={`cursor-pointer relative group ${showExplosion ? 'invisible' : ''}`}
              onClick={handleSecretClick}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: sparkleScale,
                rotate: sparkleRotation,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              title=""
            >
              {/* Hidden clue - only visible on hover */}
              <motion.span
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-mono text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-all duration-700 whitespace-nowrap pointer-events-none select-none"
              >
                click 5× for magic
              </motion.span>
              {/* Glow effect behind sparkle */}
              {secretClicks > 0 && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, hsl(24, 80%, 55% / ${glowIntensity}), transparent 70%)`,
                    transform: "scale(3)",
                  }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                />
              )}
              <Sparkles
                className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-300 ${
                  secretClicks > 0 ? "text-primary" : "text-muted-foreground"
                }`}
              />
              {/* Particles on clicks */}
              {secretClicks > 0 && Array.from({ length: secretClicks * 2 }).map((_, i) => (
                <motion.div
                  key={`${secretClicks}-${i}`}
                  className="absolute w-1.5 h-1.5 rounded-full bg-primary"
                  style={{ left: "50%", top: "50%" }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 60,
                    y: (Math.random() - 0.5) * 60,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              ))}
            </motion.div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-border bg-surface/50 backdrop-blur-sm">
              <Terminal size={14} className="text-primary" />
              <span className="text-xs sm:text-sm font-mono text-muted-foreground">Hello, I'm</span>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-semibold tracking-tight leading-none text-foreground mb-4 sm:mb-6"
            style={{ letterSpacing: "-0.03em" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-gradient">Krishna</span>{" "}
            <span>Naicker</span>
          </motion.h1>

          {/* Role */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-base sm:text-xl lg:text-2xl font-mono font-medium text-muted-foreground">
              <TypewriterText text="Full Stack AI Engineer" delay={1.2} speed={60} />
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg mx-auto mb-8 sm:mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            Building intelligent agentic systems &amp; scalable backends at{" "}
            <span className="text-primary font-medium">Allcognix AI</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 0.6 }}
          >
            <motion.a
              href="#projects"
              className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/20 text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View my work
            </motion.a>

            <motion.a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-surface-elevated text-foreground rounded-full font-medium border border-border hover:border-primary/40 transition-all duration-300 flex items-center gap-2 justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileText size={16} />
              Resume
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={20} className="text-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* Easter Eggs */}
      <AnimatePresence>
        {showGame && <WordMatchGame onClose={() => setShowGame(false)} />}
        {showExplosion && <EarthquakeExplosion onClose={() => setShowExplosion(false)} />}
      </AnimatePresence>
    </>
  );
};
