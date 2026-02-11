import { motion, useInView, AnimatePresence, LayoutGroup } from "framer-motion";
import { useRef, useState } from "react";

interface Skill {
  name: string;
  category: "ai" | "frontend" | "backend" | "tools";
}

const skills: Skill[] = [
  { name: "PyTorch", category: "ai" },
  { name: "TensorFlow", category: "ai" },
  { name: "LangChain", category: "ai" },
  { name: "LangGraph", category: "ai" },
  { name: "CrewAI", category: "ai" },
  { name: "BERT", category: "ai" },
  { name: "RAG", category: "ai" },
  { name: "React", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "Next.js", category: "frontend" },
  { name: "Tailwind", category: "frontend" },
  { name: "Vite", category: "frontend" },
  { name: "Zustand", category: "frontend" },
  { name: "Python", category: "backend" },
  { name: "FastAPI", category: "backend" },
  { name: "Node.js", category: "backend" },
  { name: "PostgreSQL", category: "backend" },
  { name: "MongoDB", category: "backend" },
  { name: "Haystack", category: "backend" },
  { name: "DBOS", category: "backend" },
  { name: "Redis", category: "backend" },
  { name: "Celery", category: "backend" },
  { name: "Taskiq", category: "backend" },
  { name: "Docker", category: "tools" },
  { name: "Git", category: "tools" },
  { name: "Pinecone", category: "tools" },
  { name: "Composio", category: "tools" },
];

const categoryConfig = {
  ai: { label: "AI & ML", color: "hsl(24, 80%, 55%)" },
  backend: { label: "Backend", color: "hsl(150, 55%, 45%)" },
  frontend: { label: "Frontend", color: "hsl(210, 60%, 50%)" },
  tools: { label: "Tools", color: "hsl(280, 50%, 55%)" },
};

export const SkillsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredSkills = activeCategory
    ? skills.filter(s => s.category === activeCategory)
    : skills;

  return (
    <section ref={containerRef} id="skills" className="relative py-24 overflow-hidden">
      <div className="section-container relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold mb-4">
            Skills & Tech
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Filter by category
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          <LayoutGroup>
            {Object.entries(categoryConfig).map(([key, { label, color }]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(prev => prev === key ? null : key)}
                className={`relative px-4 py-2 rounded-full text-sm font-mono font-medium border transition-colors duration-200 ${
                  activeCategory === key
                    ? "border-transparent text-white"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30"
                }`}
                style={
                  activeCategory === key
                    ? { background: color }
                    : {}
                }
              >
                {label}
              </button>
            ))}
          </LayoutGroup>
        </motion.div>

        {/* Skills grid - compact inline badges */}
        <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => {
              const config = categoryConfig[skill.category];
              return (
                <motion.span
                  key={skill.name}
                  layout
                  className="inline-flex px-3 py-1.5 rounded-md text-sm font-mono font-medium border"
                  style={{
                    borderColor: config.color + "40",
                    color: config.color,
                    backgroundColor: config.color + "0a",
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15, layout: { duration: 0.2 } }}
                >
                  {skill.name}
                </motion.span>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
