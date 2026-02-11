import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ContactSection } from "@/components/ContactSection";
import { BackgroundEffect } from "@/components/BackgroundEffect";
import { Footer } from "@/components/Footer";
import { AskKrishnaFlipTiles } from "@/components/easter-eggs/AskKrishnaFlipTiles";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <BackgroundEffect />
      <Navigation />
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <AskKrishnaFlipTiles />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
