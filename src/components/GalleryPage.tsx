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

    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${memories.length * 100}%`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
    });

    const cards = content.querySelectorAll(".memory-card-wrapper");

    cards.forEach((card, i) => {
      const imgContainer = card.querySelector(".memory-image");

      // Hide all cards except first
      if (i > 0) {
        gsap.set(card, { opacity: 0 });
      }

      // Set initial image position off-screen
      if (imgContainer) {
        const slideFrom = isReversed ? "100%" : "-100%";
        gsap.set(imgContainer, { x: slideFrom });

        // Slide image in
        gsap.to(imgContainer, {
          x: "0%",
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

      // Show card (fade in text only, image slides)
      if (i > 0) {
        gsap.to(card, {
          opacity: 1,
          duration: 0.3,
          scrollTrigger: {
            trigger: section,
            start: `${(i / memories.length) * 100}% top`,
            end: `${((i + 0.3) / memories.length) * 100}% top`,
            scrub: 1,
          },
        });
      }

      // Hide previous card
      if (i > 0) {
        gsap.to(cards[i - 1], {
          opacity: 0,
          duration: 0.3,
          scrollTrigger: {
            trigger: section,
            start: `${((i - 0.3) / memories.length) * 100}% top`,
            end: `${(i / memories.length) * 100}% top`,
            scrub: 1,
          },
        });
      }
    });

    // First card: slide image in on enter
    const firstImg = cards[0]?.querySelector(".memory-image");
    if (firstImg) {
      gsap.fromTo(
        firstImg,
        { x: isReversed ? "100%" : "-100%" },
        {
          x: "0%",
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

    // First card text fade in
    const firstCard = cards[0];
    if (firstCard) {
      gsap.fromTo(
        firstCard,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 40%",
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
  }, [memories.length, isReversed]);

  return (
    <div ref={sectionRef} className="relative min-h-screen bg-background noise-overlay vignette overflow-hidden">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
        <span className="font-display text-vault-gold/30 text-sm tracking-[0.5em] uppercase">
          Chapter {pageIndex + 1}
        </span>
      </div>

      <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-vault-gold/10 to-transparent hidden md:block" />

      <div ref={contentRef} className="relative z-10 flex items-center justify-center min-h-screen py-16">
        <div className="relative w-full">
          {memories.map((memory, i) => (
            <div
              key={memory.id}
              className="memory-card-wrapper absolute inset-0 flex items-center justify-center"
              style={{ position: i === 0 ? "relative" : "absolute", top: 0 }}
            >
              <MemoryCard memory={memory} isReversed={isReversed} index={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
