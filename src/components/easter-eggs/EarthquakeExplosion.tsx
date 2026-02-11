import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { Skull } from "lucide-react";

/**
 * Continuous-flow earthquake easter egg.
 * Timeline (all times from mount = 0s):
 *   0.0s        – Explosion flash + shockwave + canvas particles begin
 *   0.0s-2.0s   – Screen shake (earthquake)
 *   0.3s        – Gravity collapse begins (overlaps with explosion)
 *   2.5s        – Hero elements are mostly fallen; cross-fade starts
 *   2.5s-3.5s   – Cross-fade: fallen content fades out, villain fades in
 *   3.5s+       – Villain arc content animates in
 *
 * NO blank screens. NO pauses. One continuous flow.
 */
export const EarthquakeExplosion = ({ onClose }: { onClose: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallingElsRef = useRef<{ el: HTMLElement; vy: number; vr: number; y: number; r: number }[]>([]);
  const gravityAnimRef = useRef<number>(0);
  const startTimeRef = useRef(Date.now());

  // Progress states (not phase-gated — they overlap)
  const [showShake, setShowShake] = useState(true);
  const [showVillain, setShowVillain] = useState(false);
  const [villainContentReady, setVillainContentReady] = useState(false);
  const [heroFaded, setHeroFaded] = useState(false);

  // ── MASTER TIMELINE ──
  useEffect(() => {
    const start = Date.now();
    startTimeRef.current = start;

    // 0.3s: Start gravity collapse
    const tGravity = setTimeout(() => startGravityCollapse(), 300);

    // 2.0s: Stop shake
    const tShakeEnd = setTimeout(() => setShowShake(false), 2000);

    // 2.5s: Begin cross-fade to villain (hero fades, villain fades in simultaneously)
    const tCrossfade = setTimeout(() => {
      setShowVillain(true);
      setHeroFaded(true);
    }, 2500);

    // 3.5s: Villain content appears
    const tVillainContent = setTimeout(() => setVillainContentReady(true), 3500);

    return () => {
      clearTimeout(tGravity);
      clearTimeout(tShakeEnd);
      clearTimeout(tCrossfade);
      clearTimeout(tVillainContent);
    };
  }, []);

  // ── GRAVITY COLLAPSE ──
  const startGravityCollapse = useCallback(() => {
    const selectors = "h1, h2, h3, p, a, button, img, span, .rounded-2xl, .rounded-lg, .rounded-full";
    const els = document.querySelectorAll(selectors);
    const fallingEls: typeof fallingElsRef.current = [];

    els.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const rect = htmlEl.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      if (htmlEl.closest('[data-earthquake-overlay]')) return;

      htmlEl.style.transition = "none";
      htmlEl.style.willChange = "transform, opacity";
      fallingEls.push({
        el: htmlEl,
        vy: Math.random() * 1.5,
        vr: (Math.random() - 0.5) * 5,
        y: 0,
        r: 0,
      });
    });

    fallingElsRef.current = fallingEls;
    const gravity = 0.6;

    const animate = () => {
      for (const item of fallingEls) {
        item.vy += gravity;
        item.y += item.vy;
        item.r += item.vr;
        item.el.style.transform = `translateY(${item.y}px) rotate(${item.r}deg)`;
        item.el.style.filter = item.vy > 8 ? `blur(${Math.min(item.vy * 0.3, 4)}px)` : "";
        item.el.style.opacity = `${Math.max(0, 1 - item.y / (window.innerHeight * 0.8))}`;
      }
      gravityAnimRef.current = requestAnimationFrame(animate);
    };
    gravityAnimRef.current = requestAnimationFrame(animate);
  }, []);

  // Cleanup gravity on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(gravityAnimRef.current);
      for (const item of fallingElsRef.current) {
        item.el.style.transform = "";
        item.el.style.opacity = "";
        item.el.style.transition = "";
        item.el.style.willChange = "";
        item.el.style.filter = "";
      }
    };
  }, []);

  // ── CANVAS PARTICLES (explosion burst from center) ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }

    const particles: Particle[] = [];
    const colors = ["hsl(24, 80%, 55%)", "hsl(30, 90%, 60%)", "hsl(15, 70%, 45%)", "hsl(40, 85%, 65%)"];

    // Big slow burst from center-top
    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i) / 80;
      const speed = Math.random() * 6 + 2; // Slower for visibility
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.35,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 8 + 3,
        opacity: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        p.vy += 0.08;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.995;
        p.opacity -= 0.004; // Slow fade for longer visibility
        if (p.opacity <= 0) continue;
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      if (alive) animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Shake style (applied to body-level overlay)
  const shakeStyle = showShake ? {
    animation: "earthquake-shake 0.08s infinite linear",
  } : {};

  return (
    <div data-earthquake-overlay className="fixed inset-0 z-[100] pointer-events-none" style={shakeStyle}>
      {/* Orange flash — immediate, slow expanding shockwave */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 35%, hsl(24, 80%, 55%), transparent 70%)" }}
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: [0, 0.7, 0.3, 0], scale: [0.3, 1.5, 2, 2.5] }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      />

      {/* Gradual screen darkening */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "hsl(var(--background))" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: heroFaded ? 1 : 0.5 }}
        transition={{ duration: heroFaded ? 1 : 2, ease: "easeInOut" }}
      />

      {/* Particle canvas — runs immediately */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Villain arc — fades IN while hero fades OUT (cross-fade) */}
      {showVillain && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center p-6 pointer-events-auto cursor-pointer"
          style={{ background: "hsl(var(--background))" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          onClick={onClose}
        >
          {/* Fog effect */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(24, 80%, 55%), transparent 70%)",
                left: "50%", top: "50%", x: "-50%", y: "-50%",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.12, 0.05] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </div>

          {villainContentReady && (
            <motion.div
              className="text-center max-w-sm relative z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
            >
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <Skull className="w-14 h-14 text-primary mx-auto" />
              </motion.div>

              <motion.h2
                className="text-2xl sm:text-4xl font-bold text-foreground mb-4 font-display"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                You've awakened the{" "}
                <span className="text-gradient">villain arc</span>
              </motion.h2>

              <motion.p
                className="text-muted-foreground mb-6 text-sm sm:text-base"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Krishna's evil twin has been unleashed!
                <br />
                <span className="text-xs font-mono">
                  (Don't worry, he just writes more bugs than features)
                </span>
              </motion.p>

              <motion.div
                className="flex items-center justify-center gap-2 text-primary mb-8 text-sm font-mono"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <span>Secret discovered: 1/1</span>
              </motion.div>

              <motion.p
                className="text-xs text-muted-foreground/50 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1] }}
                transition={{ delay: 1.2, duration: 2 }}
              >
                click anywhere to restore order...
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Shake keyframes */}
      <style>{`
        @keyframes earthquake-shake {
          0% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-6px, 3px) rotate(-0.5deg); }
          20% { transform: translate(8px, -4px) rotate(0.6deg); }
          30% { transform: translate(-10px, 5px) rotate(-0.7deg); }
          40% { transform: translate(12px, -3px) rotate(0.8deg); }
          50% { transform: translate(-14px, 6px) rotate(-0.9deg); }
          60% { transform: translate(10px, -5px) rotate(0.7deg); }
          70% { transform: translate(-8px, 4px) rotate(-0.6deg); }
          80% { transform: translate(12px, -6px) rotate(0.8deg); }
          90% { transform: translate(-6px, 3px) rotate(-0.5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};
