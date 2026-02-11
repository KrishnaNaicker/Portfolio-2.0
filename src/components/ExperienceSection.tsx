import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Building2, MapPin, Rocket } from "lucide-react";

interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  type: "current" | "past";
  description: string;
}

const experiences: Experience[] = [
  {
    company: "Allcognix AI",
    role: "AI Engineer - Leading Agent Studio",
    period: "Jan 2026 – Present",
    location: "Remote",
    type: "current",
    description: "Leading the development of Agent Studio, a no-code platform for building AI agents with multi-agent orchestration.",
  },
  {
    company: "Omnineura AI",
    role: "Full Stack AI Engineer",
    period: "Nov 2024 – Jan 2026",
    location: "Bengaluru, India (Remote)",
    type: "past",
    description: "Architected enterprise AI solutions with LLMs and designed autonomous AI agents for healthcare automation.",
  },
];

export const ExperienceSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "start 0.3"],
  });

  // Rocket flies from bottom of timeline to top
  const rocketY = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);
  const rocketOpacity = useTransform(scrollYProgress, [0, 0.15, 0.9, 1], [0, 1, 1, 1]);

  return (
    <section ref={containerRef} id="experience" className="relative py-24 overflow-hidden">
      <div className="section-container relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold mb-4">
            The Journey
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            From learning to leading, one milestone at a time
          </p>
        </motion.div>

        <div ref={timelineRef} className="relative max-w-2xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/30 to-transparent" />

          {/* Rocket icon - scroll-driven, flies up the timeline */}
          <motion.div
            className="absolute left-6 sm:left-8 z-20"
            style={{ top: rocketY, opacity: rocketOpacity }}
          >
            <div className="relative -translate-x-1/2">
              {/* Background to hide the timeline line behind the rocket */}
              <div className="absolute inset-[-6px] bg-background rounded-full z-0" />
              {/* Glow trail */}
              <motion.div
                className="absolute inset-0 rounded-full z-0"
                style={{
                  background: "radial-gradient(circle, hsl(24, 80%, 55% / 0.4), transparent 70%)",
                  transform: "scale(3)",
                }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="relative z-10"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Rocket size={24} className="text-primary" style={{ transform: "rotate(-45deg)" }} />
              </motion.div>
            </div>
          </motion.div>

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              className="relative pl-16 sm:pl-20 pb-12 last:pb-0"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
            >
              {/* Timeline node */}
              <div className="absolute left-6 sm:left-8 top-2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-background z-10 bg-primary">
                {exp.type === "current" && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-primary"
                    animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>

              <motion.div
                className="p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500"
                whileHover={{ x: 4 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Building2 size={16} className="text-primary" />
                      <h3 className="text-base sm:text-lg font-semibold">{exp.company}</h3>
                      {exp.type === "current" && (
                        <span className="px-2 py-0.5 text-xs font-mono font-medium bg-primary/10 text-primary rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">{exp.role}</p>
                  </div>
                  <div className="text-left sm:text-right text-sm text-muted-foreground">
                    <p>{exp.period}</p>
                    <p className="flex items-center gap-1 sm:justify-end">
                      <MapPin size={12} />
                      {exp.location}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{exp.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
