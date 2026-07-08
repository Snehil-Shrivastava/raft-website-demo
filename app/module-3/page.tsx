"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import Link from "next/link";
import { Suspense, useRef, useState } from "react";
import GetBadgeForm from "@/components/GetBadgeForm";

gsap.registerPlugin(useGSAP, Flip);

const Module3 = () => {
  const cardRef = useRef([]);
  // Track selected card indices in an array
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  // Track the first render so selection does not interrupt the intro animation
  const isFirstRender = useRef(true);
  const isFirstSubRender = useRef(true);

  // 1. Intro Animation (runs once on mount, ONLY for main cards 1, 2, 3)
  useGSAP(() => {
    const mainCards = cardRef.current.slice(0, 3);
    gsap.from(mainCards, {
      bottom: -50,
      left: "50%",
      translateX: "-50%",
      opacity: 0,
      scale: 0.95,
      duration: 0.5,
      stagger: 0.15,
    });
  }, []);

  // 2. Main Card Selection Animation (ONLY for main cards 1, 2, 3)
  useGSAP(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const mainCards = cardRef.current.slice(0, 3);
    mainCards.forEach((card, index) => {
      if (!card) return;
      const isSelected = selectedCards.includes(index);

      gsap.to(card, {
        scale: isSelected ? 1.05 : 1,
        // bottom: isSelected ? 250 : 200,
        yPercent: isSelected ? -15 : 0,
        duration: 0.3,
        overwrite: "auto",
      });
    });
  }, [selectedCards]);

  // 3. Sub-cards Animation (triggers when Card 3 selection toggles)
  // 3. Sub-cards Animation (Manual FLIP - Preserves Flex Spacing)
  useGSAP(() => {
    if (isFirstSubRender.current) {
      isFirstSubRender.current = false;
      return;
    }

    const subCards = cardRef.current.slice(3); // Grab all sub-cards
    const card3 = cardRef.current[2]; // Card 3 reference
    const isCard3Selected = selectedCards.includes(2);

    if (isCard3Selected) {
      // Animate IN (burst out from Card 3)
      gsap.killTweensOf(subCards);

      subCards.forEach((subCard, i) => {
        if (!subCard || !card3) return;

        // 1. Clear previous transforms to measure original flex positions
        gsap.set(subCard, { clearProps: "x,y,scale" });

        // 2. Measure current positions in the viewport
        // @ts-expect-error method error
        const card3Rect = card3.getBoundingClientRect();
        // @ts-expect-error method error
        const subRect = subCard.getBoundingClientRect();

        // 3. Calculate exact distance to center sub-card directly on Card 3
        const xDist =
          card3Rect.left - subRect.left + (card3Rect.width - subRect.width) / 2;
        const yDist =
          card3Rect.top - subRect.top + (card3Rect.height - subRect.height) / 2;

        // 4. Instantly position on top of Card 3
        gsap.set(subCard, {
          x: xDist,
          y: yDist,
          scale: 0.1,
          opacity: 0,
          pointerEvents: "auto",
        });

        // 5. Animate back to its natural layout spot
        gsap.to(subCard, {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.2)",
          delay: i * 0.08, // Stagger effect
        });
      });
    } else {
      // Animate OUT (stagger back into Card 3)
      gsap.killTweensOf(subCards);

      subCards.forEach((subCard, i) => {
        if (!subCard || !card3) return;

        // @ts-expect-error method error
        const card3Rect = card3.getBoundingClientRect();
        // @ts-expect-error method error
        const subRect = subCard.getBoundingClientRect();

        const xDist =
          card3Rect.left - subRect.left + (card3Rect.width - subRect.width) / 2;
        const yDist =
          card3Rect.top - subRect.top + (card3Rect.height - subRect.height) / 2;

        gsap.to(subCard, {
          x: xDist,
          y: yDist,
          scale: 0.1,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          pointerEvents: "none",
          delay: (subCards.length - 1 - i) * 0.05, // Reverse stagger
        });
      });
    }
  }, [selectedCards]);

  // 3. Sub-cards Animation (using GSAP Flip.fit)
  //   useGSAP(() => {
  //     if (isFirstSubRender.current) {
  //       isFirstSubRender.current = false;
  //       return;
  //     }

  //     const subCards = cardRef.current.slice(3); // Grab all sub-cards
  //     const card3 = cardRef.current[2]; // Card 3 reference
  //     const isCard3Selected = selectedCards.includes(2);

  //     if (isCard3Selected) {
  //       // Animate IN (burst out from Card 3)
  //       gsap.killTweensOf(subCards);

  //       subCards.forEach((subCard, i) => {
  //         if (!subCard || !card3) return;

  //         // Clear any previous inline transform overrides
  //         gsap.set(subCard, { clearProps: "x,y,scale,opacity" });

  //         // Instantly position and scale the sub-card on top of Card 3
  //         Flip.fit(subCard, card3, {
  //           scale: true,
  //           absolute: true,
  //         });

  //         // Shrink and hide it at the start position
  //         gsap.set(subCard, { scale: 0.1, opacity: 0, pointerEvents: "auto" });

  //         // Animate back to its natural CSS layout position
  //         gsap.to(subCard, {
  //           x: 0,
  //           y: 50,
  //           scale: 1,
  //           opacity: 1,
  //           duration: 0.6,
  //           ease: "back.out(1.2)",
  //           delay: i * 0.08,
  //         });
  //       });
  //     } else {
  //       // Animate OUT (stagger back into Card 3)
  //       gsap.killTweensOf(subCards);

  //       subCards.forEach((subCard, i) => {
  //         if (!subCard || !card3) return;

  //         // Animate the spatial position to Card 3
  //         Flip.fit(subCard, card3, {
  //           scale: true,
  //           absolute: true,
  //           duration: 0.5,
  //           ease: "power2.in",
  //           delay: (subCards.length - 1 - i) * 0.05,
  //           onComplete: () => {
  //             gsap.set(subCard, { pointerEvents: "none" });
  //           },
  //         });

  //         // Simultaneously shrink and fade it out
  //         gsap.to(subCard, {
  //           scale: 0.1,
  //           opacity: 0,
  //           duration: 0.5,
  //           ease: "power2.in",
  //           delay: (subCards.length - 1 - i) * 0.05,
  //         });
  //       });
  //     }
  //   }, [selectedCards]);

  // Main Card Hover Handlers (only animate if not selected)
  const handleMouseEnter = (index: number) => {
    if (selectedCards.includes(index)) return;

    gsap.to(cardRef.current[index], {
      scale: 1.05,
      //   bottom: 250,
      yPercent: -15,
      duration: 0.3,
      overwrite: "auto",
    });
  };

  const handleMouseLeave = (index: number) => {
    if (selectedCards.includes(index)) return;

    gsap.to(cardRef.current[index], {
      scale: 1,
      //   bottom: 200,
      yPercent: 0,
      duration: 0.3,
      overwrite: "auto",
    });
  };

  // Sub-card Hover Handlers (only animate if Card 3 is active)
  const handleSubMouseEnter = (index: number) => {
    if (!selectedCards.includes(2)) return;

    gsap.to(cardRef.current[index], {
      scale: 1.05,
      y: -50,
      duration: 0.3,
      overwrite: "auto",
    });
  };

  const handleSubMouseLeave = (index: number) => {
    if (!selectedCards.includes(2)) return;

    gsap.to(cardRef.current[index], {
      scale: 1,
      y: 0,
      duration: 0.3,
      overwrite: "auto",
    });
  };

  const handleCardClick = (index: number) => {
    setSelectedCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="h-full w-4/5 max-sm:w-9/10 max-w-300 mx-auto relative">
        {/* Card 1 */}
        <Link
          href={"/module-3/#"}
          className="bg-white w-50 h-70 max-sm:w-25 max-sm:h-30 flex items-center justify-center rounded-md absolute bottom-50 max-sm:bottom-10 left-0 shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] cursor-pointer select-none"
          /* @ts-expect-error ref error */
          ref={(el) => (cardRef.current[0] = el)}
          onMouseEnter={() => handleMouseEnter(0)}
          onMouseLeave={() => handleMouseLeave(0)}
          onClick={() => handleCardClick(0)}
        >
          <span>Commit</span>
        </Link>

        {/* Card 2 */}
        <Link
          href={"/module-3?getBadge=true"}
          className="bg-white w-50 h-70 max-sm:w-25 max-sm:h-30 flex items-center justify-center rounded-md absolute bottom-50 max-sm:bottom-10 left-1/2 shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] cursor-pointer select-none"
          /* @ts-expect-error ref error */
          ref={(el) => (cardRef.current[1] = el)}
          style={{
            transform: "translateX(-50%)",
          }}
          scroll={false}
          onMouseEnter={() => handleMouseEnter(1)}
          onMouseLeave={() => handleMouseLeave(1)}
          onClick={() => handleCardClick(1)}
        >
          <span>Learn</span>
        </Link>

        {/* Card 3 */}
        <div
          className="bg-white w-50 h-70 max-sm:w-25 max-sm:h-30 flex items-center justify-center rounded-md absolute bottom-50 max-sm:bottom-10 right-0 shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] cursor-pointer select-none"
          /* @ts-expect-error ref error */
          ref={(el) => (cardRef.current[2] = el)}
          onMouseEnter={() => handleMouseEnter(2)}
          onMouseLeave={() => handleMouseLeave(2)}
          onClick={() => handleCardClick(2)}
        >
          <span>Act</span>
        </div>

        {/* Sub-cards Container */}
        <div className="absolute bottom-150 max-sm:bottom-100 w-400 h-100 max-sm:h-50 flex justify-between items-center max-sm:flex-wrap max-sm:w-full max-sm:gap-y-5 max-sm:gap-x-2">
          <div
            className="opacity-0 pointer-events-none bg-white w-50 h-70 max-sm:w-20 max-sm:h-30 flex items-center justify-center rounded-md shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] cursor-pointer select-none max-sm:px-1.5"
            /* @ts-expect-error ref error */
            ref={(el) => (cardRef.current[3] = el)}
            onMouseEnter={() => handleSubMouseEnter(3)}
            onMouseLeave={() => handleSubMouseLeave(3)}
          >
            <span className="text-center max-sm:text-xs">Register to vote</span>
          </div>
          <div
            className="opacity-0 pointer-events-none bg-white w-50 h-70 max-sm:w-20 max-sm:h-30 flex items-center justify-center rounded-md shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] cursor-pointer select-none max-sm:px-1.5"
            /* @ts-expect-error ref error */
            ref={(el) => (cardRef.current[4] = el)}
            onMouseEnter={() => handleSubMouseEnter(4)}
            onMouseLeave={() => handleSubMouseLeave(4)}
          >
            <span className="text-center max-sm:text-xs">Vote!</span>
          </div>
          <div
            className="opacity-0 pointer-events-none bg-white w-50 h-70 max-sm:w-20 max-sm:h-30 flex items-center justify-center rounded-md shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] cursor-pointer select-none max-sm:px-1.5"
            /* @ts-expect-error ref error */
            ref={(el) => (cardRef.current[5] = el)}
            onMouseEnter={() => handleSubMouseEnter(5)}
            onMouseLeave={() => handleSubMouseLeave(5)}
          >
            <span className="text-center max-sm:text-xs">Work at the poll</span>
          </div>
          <div
            className="opacity-0 pointer-events-none bg-white w-50 h-70 max-sm:w-20 max-sm:h-30 flex items-center justify-center rounded-md shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] cursor-pointer select-none max-sm:px-1.5"
            /* @ts-expect-error ref error */
            ref={(el) => (cardRef.current[6] = el)}
            onMouseEnter={() => handleSubMouseEnter(6)}
            onMouseLeave={() => handleSubMouseLeave(6)}
          >
            <span className="text-center max-sm:text-xs">
              Observe the election
            </span>
          </div>
          <div
            className="opacity-0 pointer-events-none bg-white w-50 h-70 max-sm:w-20 max-sm:h-30 flex items-center justify-center rounded-md shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] cursor-pointer select-none max-sm:px-1.5"
            /* @ts-expect-error ref error */
            ref={(el) => (cardRef.current[7] = el)}
            onMouseEnter={() => handleSubMouseEnter(7)}
            onMouseLeave={() => handleSubMouseLeave(7)}
          >
            <span className="text-center max-sm:text-xs">
              Check before I share
            </span>
          </div>
          <div
            className="opacity-0 pointer-events-none bg-white w-50 h-70 max-sm:w-20 max-sm:h-30 flex items-center justify-center rounded-md shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] cursor-pointer select-none max-sm:px-1.5"
            /* @ts-expect-error ref error */
            ref={(el) => (cardRef.current[8] = el)}
            onMouseEnter={() => handleSubMouseEnter(8)}
            onMouseLeave={() => handleSubMouseLeave(8)}
          >
            <span className="text-center max-sm:text-xs">
              Learn my state&apos;s rules
            </span>
          </div>
          <div
            className="opacity-0 pointer-events-none bg-white w-50 h-70 max-sm:w-20 max-sm:h-30 flex items-center justify-center rounded-md shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] cursor-pointer select-none max-sm:px-1.5"
            /* @ts-expect-error ref error */
            ref={(el) => (cardRef.current[9] = el)}
            onMouseEnter={() => handleSubMouseEnter(9)}
            onMouseLeave={() => handleSubMouseLeave(9)}
          >
            <span className="text-center max-sm:text-xs">
              Have one calm conversation
            </span>
          </div>
        </div>
      </div>
      <Suspense fallback={null}>
        <GetBadgeForm />
      </Suspense>
    </div>
  );
};

export default Module3;
