import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VaultLanding from "@/components/VaultLanding";
import GalleryPage from "@/components/GalleryPage";
import type { Memory } from "@/data/memories";

gsap.registerPlugin(ScrollTrigger);

const PHOTOS_PER_PAGE = 5;

const Index = () => {
  const [entered, setEntered] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    fetch("/images.json")
      .then((res) => res.json())
      .then((data: Memory[]) => setMemories(data));
  }, []);

  // Split memories into pages of 5
  const pages: Memory[][] = [];
  for (let i = 0; i < memories.length; i += PHOTOS_PER_PAGE) {
    pages.push(memories.slice(i, i + PHOTOS_PER_PAGE));
  }

  useEffect(() => {
    if (entered && memories.length > 0) {
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }
  }, [entered, memories]);

  return (
    <div className="bg-background min-h-screen">
      {!entered && <VaultLanding onEnter={() => setEntered(true)} />}

      {entered && memories.length > 0 && (
        <>
          {/* Header */}
          <div className="h-screen flex items-center justify-center relative noise-overlay vignette">
            <div className="text-center px-6 relative z-10">
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-vault-cream font-bold tracking-tight mb-4">
                Memory Vault
              </h1>
              <p className="font-body text-muted-foreground text-lg md:text-xl italic">
                Scroll to journey through time
              </p>
              <div className="mt-12 flex flex-col items-center gap-2 animate-bounce">
                <div className="w-px h-8 bg-vault-gold/30" />
                <div className="w-2 h-2 rounded-full bg-vault-gold/50" />
              </div>
            </div>
          </div>

          {/* Gallery pages */}
          {pages.map((pageMemories, i) => (
            <GalleryPage
              key={i}
              memories={pageMemories}
              pageIndex={i}
              isReversed={i % 2 !== 0}
            />
          ))}

          {/* Footer */}
          <div className="h-screen flex items-center justify-center relative noise-overlay vignette">
            <div className="text-center px-6 relative z-10">
              <div className="w-16 h-px bg-vault-gold/30 mx-auto mb-8" />
              <p className="font-display text-3xl md:text-5xl text-vault-cream/60 italic">
                fin.
              </p>
              <p className="font-body text-muted-foreground mt-4 text-sm tracking-widest uppercase">
                The memories live on
              </p>
              <div className="w-16 h-px bg-vault-gold/30 mx-auto mt-8" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
