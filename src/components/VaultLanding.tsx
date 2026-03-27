import { useRef, useEffect } from "react";
import gsap from "gsap";

interface VaultLandingProps {
  onEnter: () => void;
}

const VIDEO_SRC = "public/videos/bg.mp4";

const VaultLanding = ({ onEnter }: VaultLandingProps) => {
  const containerRef   = useRef<HTMLDivElement>(null);
  const titleRef       = useRef<HTMLHeadingElement>(null);
  const subtitleRef    = useRef<HTMLParagraphElement>(null);
  const buttonRef      = useRef<HTMLButtonElement>(null);
  const doorsLeftRef   = useRef<HTMLDivElement>(null);
  const doorsRightRef  = useRef<HTMLDivElement>(null);
  const glowRef        = useRef<HTMLDivElement>(null);
  const videoRef       = useRef<HTMLVideoElement>(null);
  const canvasLeftRef  = useRef<HTMLCanvasElement>(null);
  const canvasRightRef = useRef<HTMLCanvasElement>(null);
  const canvasBgRef    = useRef<HTMLCanvasElement>(null);
  const rafRef         = useRef<number>(0);

  useEffect(() => {
    const video  = videoRef.current;
    const cLeft  = canvasLeftRef.current;
    const cRight = canvasRightRef.current;
    const cBg    = canvasBgRef.current;
    if (!video || !cLeft || !cRight || !cBg) return;

    // ── Size all canvases to the screen ───────────────────────────────────
    const resize = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;

      cBg.width    = W;
      cBg.height   = H;

      // Each door canvas is exactly half the screen wide
      cLeft.width  = Math.ceil(W / 2);
      cLeft.height = H;

      cRight.width  = Math.ceil(W / 2);
      cRight.height = H;
    };

    resize();
    window.addEventListener("resize", resize);

    // ── rAF draw loop ─────────────────────────────────────────────────────
    // One video → three canvas targets drawn in the same JS tick.
    // Zero drift is guaranteed because all three read the identical
    // decoded bitmap from the single video element.
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      if (video.readyState < 2) return;

      const vW = video.videoWidth  || window.innerWidth;
      const vH = video.videoHeight || window.innerHeight;
      const W  = window.innerWidth;
      const H  = window.innerHeight;

      // object-fit: cover math
      const scale   = Math.max(W / vW, H / vH);
      const drawW   = vW * scale;
      const drawH   = vH * scale;
      const offsetX = (W - drawW) / 2;
      const offsetY = (H - drawH) / 2;

      // Full background
      const bgCtx = cBg.getContext("2d");
      if (bgCtx) bgCtx.drawImage(video, offsetX, offsetY, drawW, drawH);

      // Left door — left half of the video
      const lCtx = cLeft.getContext("2d");
      if (lCtx) lCtx.drawImage(video, offsetX, offsetY, drawW, drawH);

      // Right door — right half: shift the draw origin left by W/2
      // so that the right portion of the video aligns with this canvas
      const rCtx = cRight.getContext("2d");
      if (rCtx) rCtx.drawImage(video, offsetX - Math.ceil(W / 2), offsetY, drawW, drawH);
    };

    video.play().then(() => {
      rafRef.current = requestAnimationFrame(draw);
    }).catch(() => {
      // Autoplay blocked — still start the loop, canvas will paint when ready
      rafRef.current = requestAnimationFrame(draw);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── Entrance animation ────────────────────────────────────────────────────
  useEffect(() => {
    // Doors start fully closed (x:0), covering left and right halves
    gsap.set(doorsLeftRef.current,  { x: 0 });
    gsap.set(doorsRightRef.current, { x: 0 });

    const tl = gsap.timeline();
    tl.fromTo(glowRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 2, ease: "power2.out" }
      )
      .fromTo(titleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, "-=1.2"
      )
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6"
      )
      .fromTo(buttonRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }, "-=0.3"
      );

    gsap.to(glowRef.current, {
      scale: 1.05, opacity: 0.8, duration: 3,
      repeat: -1, yoyo: true, ease: "sine.inOut",
    });
  }, []);

  // ── Vault open animation ──────────────────────────────────────────────────
  const handleEnter = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Stop drawing and decoding — nothing to show after this
        cancelAnimationFrame(rafRef.current);
        if (videoRef.current) videoRef.current.pause();
        onEnter();
      },
    });

    tl
      .to(buttonRef.current,   { scale: 1.1, duration: 0.15, ease: "power2.out" })
      .to(buttonRef.current,   { scale: 0, opacity: 0, duration: 0.3, ease: "power2.in" })
      .to(subtitleRef.current, { opacity: 0, y: -20, duration: 0.3 }, "-=0.1")
      .to(titleRef.current,    { opacity: 0, y: -30, duration: 0.3 }, "-=0.2")
      .to(glowRef.current,     { opacity: 0, duration: 0.3 }, "-=0.2")
      .to(doorsLeftRef.current,  { x: "-100%", duration: 1.3, ease: "power3.inOut" }, "split")
      .to(doorsRightRef.current, { x: "100%",  duration: 1.3, ease: "power3.inOut" }, "split")
      .to(canvasBgRef.current,   { opacity: 1, duration: 0.9, ease: "power2.out" }, "split+=0.2")
      .to(containerRef.current,  { opacity: 0, duration: 0.4 }, "-=0.2");
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden bg-black"
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <style>{`
        @keyframes memoryShimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .memory-title {
          background: linear-gradient(
            135deg,
            #8B6914 0%, #C9A96E 18%, #F5ECD7 40%,
            #E8D5B7 54%, #C4B8D0 70%, #D4A5A5 86%, #A0896A 100%
          );
          background-size: 200% 200%;
          animation: memoryShimmer 6s ease-in-out infinite;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          filter: drop-shadow(0 2px 24px rgba(0,0,0,0.95))
                  drop-shadow(0 0 8px rgba(0,0,0,1));
        }
        .memory-subtitle {
          color: rgba(245, 236, 215, 0.90);
          text-shadow:
            0 2px 20px rgba(0,0,0,0.98),
            0 0 40px rgba(0,0,0,0.9),
            0 1px 4px rgba(0,0,0,1);
          letter-spacing: 0.06em;
        }
        .memory-button {
          border-color: rgba(201,169,110,0.55) !important;
          color: rgba(245,236,215,0.95) !important;
          text-shadow: 0 2px 16px rgba(0,0,0,0.98), 0 0 30px rgba(0,0,0,0.9);
          letter-spacing: 0.28em;
        }
        .memory-button:hover {
          border-color: rgba(201,169,110,0.9) !important;
          background: rgba(139,105,20,0.15) !important;
        }
      `}</style>

      {/* ── HIDDEN VIDEO — single decoder ────────────────────────────────────
          Width/height 1px so the browser doesn't suspend decoding.
          Opacity 0 so it's invisible. All visuals come from the canvases.
      ──────────────────────────────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* ── BACKGROUND CANVAS — full video, shown after doors open ──────────
          z-0, starts opacity-0, fades in when vault opens.
      ──────────────────────────────────────────────────────────────────────── */}
      <canvas
        ref={canvasBgRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          zIndex: 0,
          opacity: 0,
        }}
      />

      {/* ── LEFT DOOR ──────────────────────────────────────────────────────
          z-index 20 — covers the left half of the screen.
          Contains the left-half canvas (video columns 0 → W/2).
          The dark overlay on top dims the video to match overall tone.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        ref={doorsLeftRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          zIndex: 20,
          overflow: "hidden",
          backgroundColor: "#0d0d0d",
          borderRight: "1px solid rgba(201,169,110,0.2)",
        }}
      >
        {/* Left-half video canvas */}
        <canvas
          ref={canvasLeftRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
        {/* Overlay — dims the video so it feels like a vault door */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: "rgba(0,0,0,0.58)",
        }} />
        {/* Gold seam at split edge */}
        <div style={{
          position: "absolute", right: 0, top: 0, width: 1, height: "100%", zIndex: 3,
          background: "linear-gradient(to bottom, transparent, rgba(201,169,110,0.5) 50%, transparent)",
        }} />
        {/* Vault door panel lines */}
        <div style={{
          position: "absolute", inset: 24, border: "1px solid rgba(201,169,110,0.08)",
          borderRadius: 2, zIndex: 3,
        }} />
        <div style={{
          position: "absolute", inset: 56, border: "1px solid rgba(201,169,110,0.05)",
          borderRadius: 2, zIndex: 3,
        }} />
        <div style={{
          position: "absolute", left: 24, right: 24, zIndex: 3,
          top: "33%", height: 1, background: "rgba(201,169,110,0.06)",
        }} />
        <div style={{
          position: "absolute", left: 24, right: 24, zIndex: 3,
          bottom: "33%", height: 1, background: "rgba(201,169,110,0.06)",
        }} />
      </div>

      {/* ── RIGHT DOOR ─────────────────────────────────────────────────────
          Mirror of left door. Canvas is painted with video columns W/2 → W.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        ref={doorsRightRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          zIndex: 20,
          overflow: "hidden",
          backgroundColor: "#0d0d0d",
          borderLeft: "1px solid rgba(201,169,110,0.2)",
        }}
      >
        {/* Right-half video canvas */}
        <canvas
          ref={canvasRightRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: "rgba(0,0,0,0.58)",
        }} />
        {/* Gold seam at split edge */}
        <div style={{
          position: "absolute", left: 0, top: 0, width: 1, height: "100%", zIndex: 3,
          background: "linear-gradient(to bottom, transparent, rgba(201,169,110,0.5) 50%, transparent)",
        }} />
        <div style={{
          position: "absolute", inset: 24, border: "1px solid rgba(201,169,110,0.08)",
          borderRadius: 2, zIndex: 3,
        }} />
        <div style={{
          position: "absolute", inset: 56, border: "1px solid rgba(201,169,110,0.05)",
          borderRadius: 2, zIndex: 3,
        }} />
        <div style={{
          position: "absolute", left: 24, right: 24, zIndex: 3,
          top: "33%", height: 1, background: "rgba(201,169,110,0.06)",
        }} />
        <div style={{
          position: "absolute", left: 24, right: 24, zIndex: 3,
          bottom: "33%", height: 1, background: "rgba(201,169,110,0.06)",
        }} />
      </div>

      {/* ── GLOW ─────────────────────────────────────────────────────────── */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          zIndex: 10,
          pointerEvents: "none",
          background: "radial-gradient(circle, hsl(42 70% 50% / 0.10) 0%, hsl(30 80% 40% / 0.04) 40%, transparent 70%)",
        }}
      />

      {/* ── CONTENT ──────────────────────────────────────────────────────────
          z-index 30 — above the overlay (z-1) and glow (z-10),
          but the doors (z-20) sit on top when closed. That's fine because
          the content disappears before the door animation starts.
      ──────────────────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 30, textAlign: "center", padding: "0 24px" }}>
        <h1
          ref={titleRef}
          className="memory-title font-display"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            opacity: 0,
            margin: 0,
          }}
        >
          Memory Vault
        </h1>

        {/* Decorative sepia rule */}
        <div style={{
          width: 160,
          height: 1,
          margin: "16px auto",
          background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.6), transparent)",
        }} />

        <p
          ref={subtitleRef}
          className="memory-subtitle font-body"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            fontStyle: "italic",
            marginBottom: 40,
            opacity: 0,
          }}
        >
          A collection of moments frozen in time
        </p>

        <button
          ref={buttonRef}
          onClick={handleEnter}
          className="memory-button font-display"
          style={{
            fontSize: "clamp(0.875rem, 1.5vw, 1.125rem)",
            padding: "16px 40px",
            border: "2px solid",
            background: "transparent",
            cursor: "pointer",
            textTransform: "uppercase",
            opacity: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          Enter the Vault
        </button>
      </div>

      {/* ── CORNER BRACKETS ──────────────────────────────────────────────── */}
      {([
        { top: 32, left: 32,  borderTop: "2px solid", borderLeft:  "2px solid" },
        { top: 32, right: 32, borderTop: "2px solid", borderRight: "2px solid" },
        { bottom: 32, left: 32,  borderBottom: "2px solid", borderLeft:  "2px solid" },
        { bottom: 32, right: 32, borderBottom: "2px solid", borderRight: "2px solid" },
      ] as const).map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 64,
            height: 64,
            zIndex: 30,
            borderColor: "rgba(201,169,110,0.22)",
            ...s,
          }}
        />
      ))}
    </div>
  );
};

export default VaultLanding;