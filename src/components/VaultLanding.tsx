import { useRef, useEffect } from "react";
import gsap from "gsap";

interface VaultLandingProps {
  onEnter: () => void;
}

const VaultLanding = ({ onEnter }: VaultLandingProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphRef>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const doorsLeftRef = useRef<HTMLDivElement>(null);
  const doorsRightRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(glowRef.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 2, ease: "power2.out" })
      .fromTo(titleRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, "-=1.2")
      .fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
      .fromTo(buttonRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }, "-=0.3");

    // Floating particles
    gsap.to(glowRef.current, {
      scale: 1.05,
      opacity: 0.8,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  const handleEnter = () => {
    const tl = gsap.timeline({
      onComplete: onEnter,
    });

    tl.to(buttonRef.current, { scale: 1.1, duration: 0.15, ease: "power2.out" })
      .to(buttonRef.current, { scale: 0, opacity: 0, duration: 0.4, ease: "power2.in" })
      .to(subtitleRef.current, { opacity: 0, y: -20, duration: 0.3 }, "-=0.2")
      .to(titleRef.current, { opacity: 0, y: -30, duration: 0.3 }, "-=0.2")
      .to(doorsLeftRef.current, { x: "-100%", duration: 1.2, ease: "power3.inOut" }, "-=0.1")
      .to(doorsRightRef.current, { x: "100%", duration: 1.2, ease: "power3.inOut" }, "-=1.2")
      .to(glowRef.current, { scale: 3, opacity: 0, duration: 1 }, "-=0.8")
      .to(containerRef.current, { opacity: 0, duration: 0.5 }, "-=0.3");
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center bg-vault-dark overflow-hidden">
      {/* Vault doors */}
      <div ref={doorsLeftRef} className="absolute left-0 top-0 w-1/2 h-full bg-secondary border-r border-vault-gold/20 z-20">
        <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-vault-gold/30 to-transparent" />
        {/* Door detail lines */}
        <div className="absolute inset-8 border border-vault-gold/10 rounded-sm" />
        <div className="absolute inset-16 border border-vault-gold/5 rounded-sm" />
      </div>
      <div ref={doorsRightRef} className="absolute right-0 top-0 w-1/2 h-full bg-secondary border-l border-vault-gold/20 z-20">
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-vault-gold/30 to-transparent" />
        <div className="absolute inset-8 border border-vault-gold/10 rounded-sm" />
        <div className="absolute inset-16 border border-vault-gold/5 rounded-sm" />
      </div>

      {/* Center glow */}
      <div ref={glowRef} className="absolute w-[500px] h-[500px] rounded-full bg-gradient-radial from-vault-gold/10 via-vault-amber/5 to-transparent z-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(42 70% 50% / 0.12) 0%, hsl(30 80% 40% / 0.05) 40%, transparent 70%)" }}
      />

      {/* Content */}
      <div className="relative z-30 text-center px-6">
        <h1 ref={titleRef} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-vault-cream tracking-tight opacity-0">
          Memory Vault
        </h1>
        <p ref={subtitleRef} className="font-body text-muted-foreground text-lg md:text-xl mt-4 mb-10 italic opacity-0">
          A collection of moments frozen in time
        </p>
        <button
          ref={buttonRef}
          onClick={handleEnter}
          className="font-display text-lg md:text-xl px-10 py-4 border-2 border-vault-gold/50 text-vault-cream bg-transparent
            hover:bg-vault-gold/10 hover:border-vault-gold transition-all duration-500 tracking-[0.25em] uppercase opacity-0
            relative overflow-hidden group"
        >
          <span className="relative z-10">Enter the Vault</span>
          <div className="absolute inset-0 bg-gradient-to-r from-vault-gold/0 via-vault-gold/10 to-vault-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </button>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-vault-gold/20 z-30" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-vault-gold/20 z-30" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-vault-gold/20 z-30" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-vault-gold/20 z-30" />
    </div>
  );
};

// Fix type
type HTMLParagraphRef = HTMLParagraphElement;

export default VaultLanding;
