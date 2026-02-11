import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { X, Trophy, RotateCcw, Flame, Heart, Crosshair } from "lucide-react";

interface FallingWord {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
  category: "ai" | "frontend" | "backend";
  size: "sm" | "md" | "lg";
}

const words = {
  ai: ["LangChain", "PyTorch", "GPT", "BERT", "RAG", "Agents", "LLM", "CrewAI"],
  frontend: ["React", "TypeScript", "Tailwind", "Framer", "Next.js", "CSS"],
  backend: ["FastAPI", "Python", "Node.js", "PostgreSQL", "MongoDB", "Docker"],
};

const categoryColors: Record<string, string> = {
  ai: "hsl(24, 80%, 55%)",
  frontend: "hsl(210, 60%, 50%)",
  backend: "hsl(150, 55%, 45%)",
};

const categoryLabels: Record<string, string> = {
  ai: "AI/ML",
  frontend: "Frontend",
  backend: "Backend",
};

const milestones = [50, 100, 150, 200, 300, 500];

export const WordMatchGame = ({ onClose }: { onClose: () => void }) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
  const [targetCategory, setTargetCategory] = useState<"ai" | "frontend" | "backend">("ai");
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("wordGameHighScore");
    return saved ? parseInt(saved) : 0;
  });
  const [showMilestone, setShowMilestone] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);
  const [lastMilestone, setLastMilestone] = useState(0);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("wordGameHighScore", score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    const nextMilestone = milestones.find(m => m > lastMilestone && score >= m);
    if (nextMilestone) {
      setShowMilestone(nextMilestone);
      setLastMilestone(nextMilestone);
      setTimeout(() => setShowMilestone(null), 2000);
    }
  }, [score, lastMilestone]);

  const getBaseSpeed = useCallback(() => {
    if (score >= 200) return 1.2;
    if (score >= 100) return 0.9;
    if (score >= 50) return 0.7;
    return 0.5;
  }, [score]);

  const spawnWord = useCallback(() => {
    const categories = Object.keys(words) as Array<"ai" | "frontend" | "backend">;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const wordList = words[category];
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    const baseSpeed = getBaseSpeed();
    const speedVariation = (Math.random() - 0.5) * 0.6;
    const sizes: Array<"sm" | "md" | "lg"> = ["sm", "md", "lg"];
    const size = sizes[Math.floor(Math.random() * sizes.length)];

    const newWord: FallingWord = {
      id: Date.now() + Math.random(),
      word,
      x: Math.random() * 60 + 10,
      y: -10,
      speed: Math.max(0.3, baseSpeed + speedVariation),
      category,
      size,
    };
    setFallingWords(prev => [...prev, newWord]);
  }, [getBaseSpeed]);

  useEffect(() => {
    if (gameOver) return;
    const spawnRate = Math.max(600, 1400 - score * 3);
    const interval = setInterval(spawnWord, spawnRate);
    return () => clearInterval(interval);
  }, [spawnWord, gameOver, score]);

  useEffect(() => {
    if (gameOver) return;
    const gameLoop = setInterval(() => {
      setFallingWords(prev => {
        const updated = prev.map(w => ({ ...w, y: w.y + w.speed }));
        const fallen = updated.filter(w => w.y > 90);
        fallen.forEach(w => {
          if (w.category === targetCategory) {
            setLives(l => {
              const newLives = l - 1;
              if (newLives <= 0) setGameOver(true);
              return newLives;
            });
            setCombo(0);
          }
        });
        return updated.filter(w => w.y <= 90);
      });
    }, 25);
    return () => clearInterval(gameLoop);
  }, [targetCategory, gameOver]);

  useEffect(() => {
    const interval = setInterval(() => {
      const categories = Object.keys(words) as Array<"ai" | "frontend" | "backend">;
      setTargetCategory(categories[Math.floor(Math.random() * categories.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleWordClick = (word: FallingWord, e: React.MouseEvent) => {
    e.stopPropagation();
    if (word.category === targetCategory) {
      const comboBonus = Math.floor(combo / 3) * 5;
      const sizeBonus = word.size === "sm" ? 5 : word.size === "lg" ? -2 : 0;
      setScore(s => s + 10 + comboBonus + sizeBonus);
      setCombo(c => c + 1);
    } else {
      setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) setGameOver(true);
        return newLives;
      });
      setCombo(0);
    }
    setFallingWords(prev => prev.filter(w => w.id !== word.id));
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setFallingWords([]);
    setGameOver(false);
    setCombo(0);
    setLastMilestone(0);
  };

  const getSizeClasses = (size: "sm" | "md" | "lg") => {
    switch (size) {
      case "sm": return "px-3 py-1.5 text-xs";
      case "lg": return "px-5 py-2.5 text-sm";
      default: return "px-4 py-2 text-xs";
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-md bg-background/80"
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-2xl h-[80vh] max-h-[700px] rounded-2xl border border-border overflow-hidden bg-card"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-card via-card/90 to-transparent pb-8">
          <div className="flex items-center gap-3">
            {/* Score */}
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border font-mono"
              animate={score > 0 ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.2 }}
            >
              <Trophy size={14} className="text-primary" />
              <span className="font-bold text-sm">{score}</span>
            </motion.div>

            {/* Combo */}
            <AnimatePresence>
              {combo >= 3 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-mono font-bold"
                >
                  <Flame size={12} />
                  x{combo}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lives */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface border border-border">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  size={14}
                  className={i < lives ? "text-red-500 fill-red-500" : "text-muted-foreground/20"}
                />
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-surface border border-border hover:border-primary/30 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Target category */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            key={targetCategory}
            className="px-4 py-2 rounded-lg text-xs font-mono font-bold text-white flex items-center gap-2"
            style={{ background: categoryColors[targetCategory] }}
            initial={{ scale: 0.8, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Crosshair size={14} />
            Catch: {categoryLabels[targetCategory]}
          </motion.div>
        </div>

        {/* Milestone */}
        <AnimatePresence>
          {showMilestone && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="px-8 py-4 rounded-xl bg-primary text-primary-foreground text-center"
              >
                <span className="text-3xl font-bold font-mono">{showMilestone}</span>
                <p className="text-sm mt-1">points!</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game area */}
        <div className="relative w-full h-full pt-28">
          <AnimatePresence>
            {fallingWords.map(word => (
              <motion.button
                key={word.id}
                className={`absolute ${getSizeClasses(word.size)} rounded-lg font-mono font-semibold text-white cursor-pointer border border-white/10`}
                style={{
                  left: `${word.x}%`,
                  top: `${word.y}%`,
                  background: categoryColors[word.category],
                }}
                onClick={(e) => handleWordClick(word, e)}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  handleWordClick(word, e as unknown as React.MouseEvent);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.85 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.3, transition: { duration: 0.15 } }}
              >
                {word.word}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{
            background: "linear-gradient(to top, hsl(var(--card)), transparent)",
          }}
        />

        {/* Game over */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md z-20 bg-card/95"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                className="text-center px-8"
              >
                <h2 className="text-3xl font-bold mb-2 font-display">
                  {score >= 200 ? "Amazing run!" : score >= 100 ? "Great job!" : "Good effort!"}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {score >= 200 ? "You're a legend." : score >= 100 ? "So close to mastery." : "One more try?"}
                </p>

                <div className="bg-surface rounded-xl p-6 mb-8 border border-border">
                  <p className="text-muted-foreground text-xs font-mono mb-1">SCORE</p>
                  <p className="text-4xl font-bold text-primary font-mono mb-3">{score}</p>
                  {highScore > 0 && (
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-mono">
                      <Trophy size={12} className="text-yellow-500" />
                      Best: {highScore}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-center">
                  <motion.button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw size={16} />
                    Play Again
                  </motion.button>
                  <motion.button
                    onClick={onClose}
                    className="px-6 py-3 rounded-lg font-medium bg-surface border border-border hover:border-primary/30 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center z-10">
          <p className="text-xs text-muted-foreground/60 font-mono px-4 py-2 rounded-lg bg-surface/50 border border-border/30">
            catch matching words · combos = bonus · speed increases at 100pts
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
