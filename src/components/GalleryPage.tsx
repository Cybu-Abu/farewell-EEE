import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MemoryCard from "./MemoryCard";
import type { Memory } from "@/data/memories";

gsap.registerPlugin(ScrollTrigger);

interface GalleryPageProps {
  memories: Memory[];
  pageIndex: number;
  isReversed: boolean;
}

const GalleryPage = ({ memories, pageIndex, isReversed }: GalleryPageProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    // Pin the section
    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${memories.length * 100}%`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
    });

    // Animate each card sequentially
    const cards = content.querySelectorAll(".memory-card");
    cards.forEach((card, i) => {
      const img = card.querySelector("img")?.parentElement?.parentElement;
      const text = card.querySelector("h3")?.parentElement;

      // Initially hide all except first
      if (i > 0) {
        gsap.set(card, { opacity: 0, y: 60 });
      }

      // Show cards one by one as user scrolls
      if (i > 0) {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: `${(i / memories.length) * 100}% top`,
            end: `${((i + 0.5) / memories.length) * 100}% top`,
            scrub: 1,
          },
        });
      }

      // Hide previous card
      if (i > 0) {
        gsap.to(cards[i - 1], {
          opacity: 0,
          y: -40,
          duration: 0.5,
          ease: "power2.in",
          scrollTrigger: {
            trigger: section,
            start: `${((i - 0.3) / memories.length) * 100}% top`,
            end: `${(i / memories.length) * 100}% top`,
            scrub: 1,
          },
        });
      }
    });

    // Animate first card on enter
    const firstCard = cards[0];
    if (firstCard) {
      gsap.fromTo(
        firstCard,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          },
        }
      );
    }

    return () => {
      pinTrigger.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
    };
  }, [memories.length]);

  return (
    <div ref={sectionRef} className="relative min-h-screen bg-background noise-overlay vignette overflow-hidden">
      {/* Page indicator */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
        <span className="font-display text-vault-gold/30 text-sm tracking-[0.5em] uppercase">
          Chapter {pageIndex + 1}
        </span>
      </div>

      {/* Decorative line */}
      <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-vault-gold/10 to-transparent hidden md:block" />

      <div ref={contentRef} className="relative z-10 flex items-center justify-center min-h-screen py-16">
        {/* Stack cards absolutely so they animate in/out of same position */}
        <div className="relative w-full">
          {memories.map((memory, i) => (
            <div
              key={memory.id}
              className="memory-card-wrapper absolute inset-0 flex items-center justify-center"
              style={{ position: i === 0 ? "relative" : "absolute", top: 0 }}
            >
              <MemoryCard
                memory={memory}
                isReversed={isReversed}
                index={i}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
