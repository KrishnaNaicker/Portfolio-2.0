import { motion } from "framer-motion";
import { useState } from "react";
import { Brain, Code2, Cpu, Gamepad2, Coffee, Zap, Heart, Lightbulb } from "lucide-react";

interface QATile {
  id: string;
  question: string;
  answer: string;
  icon: typeof Brain;
  color: string;
}

const tiles: QATile[] = [
  {
    id: "who",
    question: "Who is Krishna?",
    answer: "AI & backend engineer building Agent Studio at Allcognix AI. Automates everything, builds intelligent systems.",
    icon: Brain,
    color: "hsl(24, 80%, 55%)",
  },
  {
    id: "skills",
    question: "What's the tech stack?",
    answer: "Python, FastAPI, LangChain, PyTorch for AI. React, TypeScript for frontend. Docker, PostgreSQL for infra.",
    icon: Code2,
    color: "hsl(210, 60%, 50%)",
  },
  {
    id: "ai",
    question: "Why AI/ML?",
    answer: "Fascinated by how neural networks learn, the hidden layers, the processing. That satisfaction when a model works is unmatched.",
    icon: Cpu,
    color: "hsl(150, 55%, 45%)",
  },
  {
    id: "agents",
    question: "What about AI agents?",
    answer: "Agents automate things. Krishna likes automating things. Lazy person builds smart solutions, now it's his whole career.",
    icon: Zap,
    color: "hsl(45, 80%, 55%)",
  },
  {
    id: "hobby",
    question: "Life outside code?",
    answer: "Football fanatic, AI research reader, new-tool tester. Inconsistent but the thrive to learn never stops. Also: coffee.",
    icon: Gamepad2,
    color: "hsl(280, 50%, 55%)",
  },
  {
    id: "vibe",
    question: "Describe Krishna in one line",
    answer: "An engineer who turns complex AI ideas into elegant, production-ready systems.",
    icon: Lightbulb,
    color: "hsl(35, 80%, 55%)",
  },
  {
    id: "work",
    question: "Current role?",
    answer: "Leading Agent Studio at Allcognix AI, a no-code platform for AI agents. Previously at Omnineura AI, architecting enterprise AI.",
    icon: Coffee,
    color: "hsl(16, 70%, 50%)",
  },
  {
    id: "hire",
    question: "Why work with Krishna?",
    answer: "He doesn't just code, he architects solutions. AI agents, scalable backends, clean APIs. If it involves making machines think, he's building it.",
    icon: Heart,
    color: "hsl(0, 65%, 55%)",
  },
];

export const AskKrishnaFlipTiles = () => {
  const [flippedId, setFlippedId] = useState<string | null>(null);

  const handleTileClick = (id: string) => {
    setFlippedId(prev => (prev === id ? null : id));
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="section-container relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold mb-4">
            Get to Know Me
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Click a tile to flip it, learn about Krishna the fun way
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {tiles.map((tile, index) => {
            const isFlipped = flippedId === tile.id;
            const Icon = tile.icon;

            return (
              <motion.div
                key={tile.id}
                className="relative cursor-pointer"
                style={{ perspective: "1000px", height: "200px" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => handleTileClick(tile.id)}
              >
                <motion.div
                  className="relative w-full h-full"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 rounded-xl border border-border bg-card p-4 sm:p-5 flex flex-col items-center justify-center gap-3 hover:border-primary/30 transition-colors"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: `${tile.color}15` }}
                    >
                      <Icon size={20} style={{ color: tile.color }} />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-center leading-tight">
                      {tile.question}
                    </span>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 rounded-xl border border-primary/20 bg-surface-elevated p-4 flex items-center justify-center"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-center line-clamp-6">
                      {tile.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
