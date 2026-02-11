import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import projectCareflow from "@/assets/project-careflow.jpg";
import projectHealbert from "@/assets/project-healbert.jpg";
import projectRapidoc from "@/assets/project-rapidoc.jpg";
import projectHealthease from "@/assets/project-healthease.jpg";

interface Project {
  title: string;
  description: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  image: string;
}

const projects: Project[] = [
  {
    title: "CareFlow",
    description: "Multi-agent healthcare AI system with LangGraph for autonomous task orchestration",
    tech: ["LangGraph", "CrewAI", "Python", "FastAPI"],
    githubUrl: "https://github.com/KrishnaNaicker/healthcare-ai-agents",
    image: projectCareflow,
  },
  {
    title: "HealBERT",
    description: "Self-healing emotion classifier with sarcasm detection and LoRA fine-tuning",
    tech: ["BERT", "LoRA", "PyTorch", "HuggingFace"],
    githubUrl: "https://github.com/KrishnaNaicker/self-healing-dag",
    image: projectHealbert,
  },
  {
    title: "Rapidoc",
    description: "RAG 2.0 pipeline for dynamic medical record intelligence",
    tech: ["RAG", "FastAPI", "Vector DB", "LangChain"],
    liveUrl: "https://krishnanaicker.github.io/Rapidoc",
    githubUrl: "https://github.com/KrishnaNaicker/Rapidoc",
    image: projectRapidoc,
  },
  {
    title: "HealthEase",
    description: "AI healthcare platform with symptom analysis and patient history tracking",
    tech: ["LangChain", "MongoDB", "Streamlit", "React"],
    liveUrl: "https://healthease.streamlit.app",
    githubUrl: "https://github.com/KrishnaNaicker/HealthEase",
    image: projectHealthease,
  },
];

export const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <section ref={containerRef} id="projects" className="relative py-24 overflow-hidden">
      <div className="section-container relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold mb-4">
            Selected Work
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            AI-powered solutions solving real problems
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              onMouseEnter={() => setHoveredProject(project.title)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <motion.div
                className={`relative rounded-2xl bg-card border border-border overflow-hidden transition-all duration-500 h-full ${
                  hoveredProject === project.title ? "border-primary/40" : ""
                }`}
                whileHover={{ y: -4 }}
                style={{
                  boxShadow: hoveredProject === project.title
                    ? "0 8px 40px hsl(24, 80%, 55%, 0.1)"
                    : "none",
                }}
              >
                {/* Project image */}
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                </div>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 50% 0%, hsl(24, 80%, 55%, 0.08), transparent 60%)",
                  }}
                />

                <div className="relative z-10 p-5">
                  <h3 className="text-lg font-semibold mb-1.5">{project.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs font-mono font-medium bg-surface text-muted-foreground rounded-md border border-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink size={14} />
                        Demo
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
                      >
                        <Github size={14} />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
