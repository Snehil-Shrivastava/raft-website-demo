"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

const TIMELINE_POINTS = [
  {
    title: "The machine",
    description:
      "Voters cast their ballots using electronic voting machines. These devices record choices locally and securely.",
  },
  {
    title: "The drop box",
    description:
      "Secure, monitored physical drop boxes are provided for voters to safely submit their mail-in or absentee ballots.",
  },
  {
    title: "The transfer",
    description:
      "Ballots are securely collected and transported under strict chain-of-custody protocols to central processing facilities.",
  },
  {
    title: "The Mail-in-ballot",
    description:
      "Paper mail-in ballots are verified via signature matching and prepared for mechanical counting.",
  },
  {
    title: "The internet",
    description:
      "While voting is not conducted over the open internet, secure networks are used to transmit encrypted administrative data.",
  },
  {
    title: "The count",
    description:
      "The final tabulation begins. Ballots are scanned, tallied, and checked against poll books for precise accuracy.",
  },
];

const Module2 = () => {
  const containerRef = useRef(null);

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

  return (
    <div ref={containerRef} className="min-h-screen pt-60 pb-60">
      <div className="max-w-400 mx-auto">
        <div className="relative flex flex-col items-center">
          {TIMELINE_POINTS.map((point, index) => {
            const isLast = index === TIMELINE_POINTS.length - 1;

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

                {/* 3. Content Card */}
                <div
                  className={`card-${index} bg-white p-6 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 max-w-lg opacity-0 absolute left-[25%] top-[-25%] z-99 w-1/2 mx-auto h-40 flex items-center justify-center`}
                >
                  {/* <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Step {index + 1}
                  </span> */}
                  <h3 className="text-xl font-bold text-slate-800 text-center">
                    {point.title}
                  </h3>
                  {/* <p className="text-slate-600 mt-2 leading-relaxed">
                    {point.description}
                  </p> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Module2;
