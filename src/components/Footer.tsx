import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import signatureImg from "@/assets/krishna-signature.svg";

export const Footer = () => {
  return (
    <footer className="relative py-8 border-t border-border/30 navbar-glass">
      <div className="section-container">
        <div className="flex flex-col items-center gap-4">
          {/* Signature - transparent, larger */}
          <motion.img
            src={signatureImg}
            alt="Krishna's signature"
            className="h-14 sm:h-16 w-auto opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.5 }}
          />

          <div className="text-sm text-muted-foreground text-center">
            Designed & Built by Krishna Kumar Naicker
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <p className="text-xs text-muted-foreground/60">
              © {new Date().getFullYear()} • From{" "}
              <motion.span
                className="text-primary font-medium"
                style={{ display: "inline-block" }}
                animate={{ 
                  textShadow: [
                    "0 0 0px rgba(217, 119, 42, 0)",
                    "0 0 10px rgba(217, 119, 42, 0.7)",
                    "0 0 0px rgba(217, 119, 42, 0)",
                  ]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                Concept
              </motion.span>
              {" "}to{" "}
              <motion.span
                className="text-primary font-medium"
                style={{ display: "inline-block" }}
                animate={{ 
                  textShadow: [
                    "0 0 0px rgba(217, 119, 42, 0)",
                    "0 0 10px rgba(217, 119, 42, 0.7)",
                    "0 0 0px rgba(217, 119, 42, 0)",
                  ]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                Deployment
              </motion.span>
            </p>
            <motion.div 
              className="flex items-center gap-2 text-xs text-muted-foreground/40 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Terminal size={12} className="text-primary/40" />
              <span>type "play" anywhere for a surprise...</span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};
