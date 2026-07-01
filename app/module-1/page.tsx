"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

const OPTIONS_DATA = [
  {
    id: "opt1",
    text: "Certify it — the winner was declared and the loser has conceded",
    isCorrect: false,
    explanation:
      "No. The press can choose a winner and candidates can concede, but they do not control the result. The process belongs to the law. Certification is the legal act that makes a result official — and officials have to be able to certify with confidence.",
  },
  {
    id: "opt2",
    text: "The Board of Elections should choose the winner based on party affiliation",
    isCorrect: false,
    explanation:
      "No. The Board of Elections is legally bound to choose the winner based on who received the most votes.  Selecting a winner based on partisan preference is illegal and would be overthrown in court.",
  },
  {
    id: "opt3",
    text: "Use the legal process to investigate before certifying",
    isCorrect: true,
    explanation:
      "Right. When credible concerns arise, the answer is evidence, authority, and procedure — not rumors, pressure, or guesswork.",
  },
];

const Module1 = () => {
  const containerRef = useRef(null);
  const router = useRouter();

  // Track all clicked card IDs in an array
  const [clickedIds, setClickedIds] = useState([]);

  // Initial Entrance Animation Timeline
  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".animate-question",
        { opacity: 0, yPercent: 50 },
        { opacity: 1, yPercent: 0, duration: 0.6, ease: "power2.out" },
      );

      tl.fromTo(
        ".animate-option",
        { opacity: 0, yPercent: 50 },
        {
          opacity: 1,
          yPercent: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=0.2",
      );
    },
    { scope: containerRef },
  );

  const handleSelect = (id) => {
    // If the card is already clicked, do nothing
    if (clickedIds.includes(id)) return;

    // Add the newly clicked ID to the list of clicked cards
    setClickedIds((prev) => [...prev, id]);

    setTimeout(() => {
      router.push("/module-2");
    }, 5000);
  };

  return (
    <div ref={containerRef} className="h-screen pt-50">
      <div className="w-4/5 mx-auto max-w-400 h-full">
        <div>
          <p className="animate-question bg-white shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] rounded-md px-8 py-7 text-xl font-bold text-center max-w-4/5 mx-auto opacity-0">
            The result is close, and serious questions have been raised. What
            should happen next?
          </p>

          <div className="grid grid-cols-3 gap-x-10 my-15">
            {OPTIONS_DATA.map((option) => {
              // Check if THIS specific option has been clicked
              const isClicked = clickedIds.includes(option.id);

              // Apply default styles or selection styles based on whether this card is clicked
              let conditionalClasses =
                "bg-white text-gray-800 hover:scale-105 cursor-pointer";

              if (isClicked) {
                conditionalClasses = option.isCorrect
                  ? "bg-green-700/50 text-white cursor-default" // Green if correct
                  : "bg-red-600/50 text-white cursor-default"; // Red if incorrect
              }

              return (
                <div key={option.id} className="animate-option opacity-0">
                  <div
                    onClick={() => handleSelect(option.id)}
                    className={`h-full shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] rounded-md px-8 py-7 text-xl font-bold text-center select-none transition-all duration-300 ${conditionalClasses}`}
                  >
                    <span className="transition-opacity duration-300 block">
                      {/* Show explanation only for clicked cards */}
                      {isClicked ? option.explanation : option.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module1;
