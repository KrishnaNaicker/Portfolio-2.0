import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Github, Linkedin, Twitter, ArrowUpRight } from "lucide-react";

const contactLinks = [
  { label: "Email", href: "mailto:krishnanaicker2005@gmail.com", icon: Mail },
  { label: "GitHub", href: "https://github.com/KrishnaNaicker", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/krishnanaicker29", icon: Linkedin },
  { label: "Twitter", href: "https://x.com/NaickerKum48061", icon: Twitter },
];

export const ContactSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section ref={containerRef} id="contact" className="relative py-24 overflow-hidden">
      <div className="section-container relative z-10">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold mb-4">
            Let's build something
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mb-8 sm:mb-10">
            Have an idea? Let's make it happen.
          </p>

          <motion.a
            href="mailto:krishnanaicker2005@gmail.com"
            className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-full text-base sm:text-lg font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/20"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <Mail size={20} />
            Reach out
            <ArrowUpRight size={18} />
          </motion.a>

          <motion.p
            className="mt-4 text-sm text-muted-foreground/70 font-mono"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            krishnanaicker2005@gmail.com
          </motion.p>
        </motion.div>

        <motion.div
          className="flex justify-center gap-4 mt-10 sm:mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          {contactLinks.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 sm:p-4 rounded-full bg-surface-elevated border border-border hover:border-primary/40 transition-all duration-300 group"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + index * 0.1 }}
              aria-label={link.label}
            >
              <link.icon size={20} className="text-muted-foreground group-hover:text-primary transition-colors sm:[&]:w-[22px] sm:[&]:h-[22px]" />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
