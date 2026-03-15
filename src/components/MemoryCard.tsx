import type { Memory } from "@/data/memories";

interface MemoryCardProps {
  memory: Memory;
  isReversed: boolean;
  index: number;
}

const MemoryCard = ({ memory, isReversed, index }: MemoryCardProps) => {
  return (
    <div
      className={`memory-card flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-6 md:gap-12 lg:gap-16 w-full max-w-5xl mx-auto px-4 md:px-8`}
    >
      {/* Image */}
      <div className="w-full md:w-1/2 flex-shrink-0">
        <div className="photo-frame rounded-sm overflow-hidden relative group">
          <img
            src={memory.image}
            alt={memory.title}
            className="w-full h-48 sm:h-56 md:h-72 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 right-3 font-display text-vault-gold/40 text-sm tracking-widest">
            {String(memory.id).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Text */}
      <div className={`w-full md:w-1/2 ${isReversed ? "md:text-right" : "md:text-left"} text-center`}>
        <div className="text-vault-gold/40 font-display text-sm tracking-[0.3em] uppercase mb-2">
          Memory #{String(memory.id).padStart(2, "0")}
        </div>
        <h3 className="font-display text-2xl md:text-3xl lg:text-4xl text-vault-cream font-bold mb-4 leading-tight">
          {memory.title}
        </h3>
        <div className={`w-16 h-px bg-vault-gold/30 mb-4 ${isReversed ? "md:ml-auto" : ""} mx-auto md:mx-0 ${isReversed ? "" : ""}`} />
        <p className="font-body text-muted-foreground text-sm md:text-base leading-relaxed italic">
          {memory.description}
        </p>
      </div>
    </div>
  );
};

export default MemoryCard;
