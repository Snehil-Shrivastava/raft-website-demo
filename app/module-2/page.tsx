"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

const TIMELINE_POINTS = [
  {
    title: "The machine",
    description: "public logic-and-accuracy testing, before every election.",
  },
  {
    title: "The drop box",
    description: "cameras, seals, and scheduled bipartisan pickup teams.",
  },
  {
    title: "The transfer",
    description: " two-person teams, signed custody logs, sealed containers.",
  },
  {
    title: "The Mail-in-ballot",
    description:
      "ballot signatures are checked by multiple people; verified against registration record; voters are notified to fix if needed",
  },
  {
    title: "The internet",
    description: "voting systems not connected. No remote access to hack.",
  },
  {
    title: "The count",
    description: "audits that check machine totals against the paper.",
  },
];

const TRICK_MESSAGE =
  "Trick question. Every point has a lock on it. That's the design — no single point of failure.";

const Module2 = () => {
  const containerRef = useRef(null);
  const trickCardRef = useRef(null);
  const clickCountRef = useRef(0);

  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [trickVisible, setTrickVisible] = useState(false);

  const router = useRouter();

  useGSAP(
    () => {
      // Create a timeline with smooth transitions
      const tl = gsap.timeline({ defaults: { ease: "power1.inOut" } });

      TIMELINE_POINTS.forEach((_, index) => {
        // 1. Draw the line segment from the previous item to the current one
        if (index > 0) {
          tl.to(`.line-segment-${index - 1}`, {
            scaleY: 1,
            duration: 0.6,
          });
        }

        // 2. Animate the current dot popping in
        tl.to(
          `.dot-${index}`,
          {
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.7)",
          },
          "-=0.1",
        ); // Slight overlap for natural timing

        // 3. Animate the corresponding card sliding and fading in
        tl.to(
          `.card-${index}`,
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.1",
        );
      });
    },
    { scope: containerRef },
  );

  // Slide the trick-question banner up into view, hold it, then slide it back out
  useGSAP(
    () => {
      if (!trickVisible || !trickCardRef.current) return;

      gsap.fromTo(
        trickCardRef.current,
        { y: "120%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          onComplete: () => {
            gsap.to(trickCardRef.current, {
              y: "120%",
              opacity: 0,
              duration: 0.5,
              ease: "power2.in",
              delay: 2.6,
              onComplete: () => setTrickVisible(false),
            });
          },
        },
      );
    },
    { dependencies: [trickVisible], scope: containerRef },
  );

  const handleCardClick = (index: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });

    clickCountRef.current += 1;
    if (clickCountRef.current % 2 === 0) {
      setTrickVisible(true);
      setTimeout(() => {
        router.push("/module-3");
      }, 3500);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen pt-60 pb-60">
      <div className="max-w-400 mx-auto">
        <div className="relative flex flex-col items-center">
          {TIMELINE_POINTS.map((point, index) => {
            const isLast = index === TIMELINE_POINTS.length - 1;
            const isFlipped = flippedCards.has(index);

            return (
              <div
                key={index}
                className="relative flex items-start justify-center pb-65 last:pb-0 w-3/5"
              >
                {/* 1. Vertical Line Segment (between dots) */}
                {!isLast && (
                  <div className="absolute left-1/2 top-8 bottom-0 w-0.5 bg-slate-200">
                    <div
                      className={`line-segment-${index} absolute top-0 left-0 w-full h-full bg-indigo-600 origin-top scale-y-0`}
                    />
                  </div>
                )}

                {/* 2. Interactive Dot Indicator */}
                <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 border-slate-300 bg-white shadow-sm shrink-0">
                  <div
                    className={`dot-${index} w-3.5 h-3.5 bg-indigo-600 rounded-full scale-0`}
                  />
                </div>

                {/* 3. Content Card (flips on click) */}
                <div
                  className={`card-${index} absolute left-[25%] max-sm:left-[10%] top-[-25%] z-99 w-1/2 mx-auto h-40 max-sm:h-60 max-sm:w-50 opacity-0`}
                  style={{ perspective: "1000px" }}
                >
                  <button
                    type="button"
                    onClick={() => handleCardClick(index)}
                    aria-label={`Toggle details for ${point.title}`}
                    className="relative w-full h-full text-left cursor-pointer"
                    style={{
                      transformStyle: "preserve-3d",
                      transition:
                        "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)",
                      transform: isFlipped
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                    }}
                  >
                    {/* Front face */}
                    <div
                      className="absolute inset-0 bg-white p-6 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <h3 className="text-xl max-sm:text-base font-bold text-slate-800 text-center">
                        {point.title}
                      </h3>
                    </div>

                    {/* Back face */}
                    <div
                      className="absolute inset-0 bg-indigo-600 p-6 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-indigo-500 flex items-center justify-center"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <p className="text-sm max-sm:text-xs text-white text-center leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trick-question banner, slides up from the bottom every 2 clicks */}
      {trickVisible && (
        <div className="fixed inset-0 z-99 bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div
            ref={trickCardRef}
            className="w-11/12 max-w-md bg-slate-900 text-white px-6 py-4 rounded-lg shadow-lg text-center text-sm max-sm:text-xs"
          >
            {TRICK_MESSAGE}
          </div>
        </div>
      )}
    </div>
  );
};

export default Module2;
