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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || memories.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".memory-card-wrapper");

      // 1. Initial Setup: Stack cards and hide them
      gsap.set(cards, {
        opacity: 0,
        yPercent: 100,
      });

      // Show the very first card immediately
      gsap.set(cards[0], {
        opacity: 1,
        yPercent: 0,
      });

      // 2. Main Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // Duration based on card count
          end: `+=${cards.length * 100}%`, 
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 3. Animation Sequence
      cards.forEach((card, i) => {
        if (i === 0) return; // Skip the first card as it's already visible

        const prevCard = cards[i - 1];
        const imgContainer = card.querySelector(".memory-image");
        const slideFrom = isReversed ? "100%" : "-100%";

        // Slide the image in from the side while the card moves up
        if (imgContainer) {
            gsap.set(imgContainer, { x: slideFrom });
        }

        tl.to(prevCard, {
          opacity: 0,
          yPercent: -50,
          duration: 1,
          ease: "power2.inOut",
        })
        .to(card, {
          opacity: 1,
          yPercent: 0,
          duration: 1,
          ease: "power2.inOut",
        }, "<") // Start at the same time as the prevCard exit
        
        if (imgContainer) {
            tl.to(imgContainer, {
                x: "0%",
                duration: 1,
                ease: "power2.out"
            }, "<");
        }
      });
    }, section);

    return () => ctx.revert();
  }, [memories, isReversed]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-background overflow-hidden"
    >
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
        <span className="font-display text-vault-gold/40 text-sm tracking-[0.5em] uppercase">
          Chapter {pageIndex + 1}
        </span>
      </div>

      <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-vault-gold/10 to-transparent hidden md:block" />

      <div className="relative w-full h-screen flex items-center justify-center">
        {memories.map((memory, i) => (
          <div
            key={memory.id}
            className="memory-card-wrapper absolute inset-0 flex items-center justify-center px-4"
          >
            <MemoryCard
              memory={memory}
              isReversed={isReversed}
              index={i}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GalleryPage;