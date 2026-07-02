"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";

import placeholder from "@/public/images/intro-placeholder.png";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

const IntroModuleQuestion = () => {
  const mainContainerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      mainContainerRef.current,
      {
        yPercent: 100,
        opacity: 0,
      },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
      },
    );
  }, []);

  return (
    <div className="w-4/5 mx-auto max-w-400 h-full">
      <div
        ref={mainContainerRef}
        className="max-w-150 bg-white font-bold tracking-wider mx-auto shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] rounded-md px-8 py-7 text-xl text-center opacity-0"
      >
        <span>Did you see this?? 👀</span>
        <div className="relative h-100 max-sm:h-60">
          <Image
            src={placeholder}
            alt=""
            className="pt-5 pb-10 blur-xs object-cover"
            fill
          />
        </div>
        <div className="flex items-center justify-between max-sm:text-xs">
          <Link href={"/module-1"} className="underline font-light">
            Ignore it
          </Link>
          <Link href={"/module-1"} className="underline font-light">
            Open it
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IntroModuleQuestion;
