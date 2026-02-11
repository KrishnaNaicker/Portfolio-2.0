import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, Cpu, Code2, Zap } from "lucide-react";

export const AboutSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const traits = [
    { icon: Brain, label: "AI/ML", color: "hsl(var(--primary))" },
    { icon: Cpu, label: "Backend", color: "hsl(152, 55%, 45%)" },
    { icon: Code2, label: "Full Stack", color: "hsl(210, 60%, 50%)" },
    { icon: Zap, label: "Automation", color: "hsl(45, 80%, 55%)" },
  ];

  return (
    <section ref={containerRef} id="about" className="relative py-20 sm:py-24 overflow-hidden">
      <div className="section-container relative z-10">
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold mb-4">
            About Me
          </h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
            {traits.map(({ icon: Icon, label, color }, i) => (
              <motion.div
                key={label}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-border bg-surface/50 text-xs font-mono"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Icon size={12} style={{ color }} />
                <span style={{ color }}>{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative p-6 sm:p-8 md:p-12 rounded-2xl bg-card border border-border overflow-hidden">
            {/* Subtle gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse 80% 60% at 0% 0%, hsl(24, 80%, 55%, 0.06), transparent 50%),
                  radial-gradient(ellipse 60% 40% at 100% 100%, hsl(24, 80%, 55%, 0.04), transparent 50%)
                `,
              }}
            />

            {/* Terminal-style header */}
            <motion.div
              className="flex items-center gap-2 mb-6 sm:mb-8 text-xs font-mono text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="ml-2">~/krishna/about.md</span>
            </motion.div>

            <div className="relative space-y-5 sm:space-y-6">
              <motion.p
                className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                I got hooked on AI the moment I saw how{" "}
                <span className="text-primary font-medium">neural networks actually learn</span> — 
                the hidden layers, the processing, how machines figure things out on their own. 
                That stuff genuinely fascinates me.
              </motion.p>

              <motion.p
                className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                I'm the kind of person who'd rather build a script to automate something 
                than do it manually — call it lazy, I call it{" "}
                <span className="text-foreground font-medium">efficient</span>. That's what got me 
                into AI agents. They automate the boring stuff so we can focus on what actually matters.
              </motion.p>

              <motion.p
                className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                Outside of code, you'll find me watching football, reading up on the latest AI research, 
                or testing out some new tool that just dropped. I'm inconsistent at a lot of things, 
                but the <span className="text-primary font-medium">thrive to learn never stops</span> — 
                and that's what keeps me going.
              </motion.p>
            </div>

            {/* Bottom line */}
            <motion.div
              className="mt-6 sm:mt-8 mx-auto h-px rounded-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"
              initial={{ width: 0 }}
              animate={isInView ? { width: "60%" } : {}}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
