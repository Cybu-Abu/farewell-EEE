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
    if (!section) return;

    const ctx = gsap.context(() => {

      const cards = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll(".memory-card-wrapper")
      );

      if (cards.length === 0) return;

      // Initial state
      gsap.set(cards, {
        yPercent: 100,
        opacity: 0
      });

      // First card visible
      gsap.set(cards[0], {
        yPercent: 0,
        opacity: 1
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${cards.length * 100}%`,
          scrub: true,
          pin: true,
          anticipatePin: 1
        }
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
      cards.forEach((card, i) => {
        if (i === 0) return;

        // Hide previous
        tl.to(cards[i - 1], {
          opacity: 0,
          yPercent: -40,
          duration: 0.6,
          ease: "power2.out"
        });

        // Show next
        tl.to(
          card,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
          },
          "<"
        );
      });

    }, section);

    return () => ctx.revert();

  }, [memories]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-background overflow-hidden"
    >

      {/* Chapter Indicator */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
        <span className="font-display text-vault-gold/40 text-sm tracking-[0.5em] uppercase">
          Chapter {pageIndex + 1}
        </span>
      </div>

      {/* Decorative vertical line */}
      <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-vault-gold/10 to-transparent hidden md:block" />

      {/* Cards container */}
      <div className="relative w-full h-screen flex items-center justify-center">

        {memories.map((memory, i) => (
          <div
            key={memory.id}
            className="memory-card-wrapper absolute inset-0 flex items-center justify-center"
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