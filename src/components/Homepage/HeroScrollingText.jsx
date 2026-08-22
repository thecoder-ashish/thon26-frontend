import React, { useState, useMemo } from "react";
import Marquee from "react-marquee-slider";
import LogoWhite from "./Logowhite";
import { Button } from "../ui/button";
import { useMarquee } from "@/components/auth/MarqueeContext";
import { motion, AnimatePresence } from "framer-motion";

const HeroSection = () => {
  const [animateX, setAnimateX] = useState(false);

  const xVariants = {
    initial: {
      scale: 1,
      opacity: 1,
      y: 0,
    },
    exit: {
      scale: 3,
      opacity: 0,
      y: 40,
      transition: {
        duration: 0.6,
      },
    },
  };

  const handleRegisterClick = () => {
    setAnimateX(true);

    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }

    setTimeout(() => {
      window.location.href = "/register";
    }, 500);
  };

  const names = useMemo(
    () => [
      "Ashwamedh",
      "CAPELLA",
      "Mirage",
      "IEEE NSUT",
      "Tatsam",
      "180 DC",
      "AAGAAZ",
      "Team Kalpana",
      "BHR",
      "ASN",
      "TDS",
      "JUNOON",
      "DEBSOC",
      "PRAYAAS",
      "ALLIANCE",
      "AXIOM",
      "ARES",
      "DEVCOMM",
      "SUBHASHA",
      "FES",
      "IGTS",
      "CANVAS",
      "INTAGLIOS",
      "ROTARACT",
      "SHAKESJEER",
      "VENATUS",
      "NSS NSUT",
      "Crosslinks",
      "Shatranj",
      "QUIZ CLUB",
      "Crosslinks",
      "CROSSLINKS",
      "YUVA",
    ],
    []
  );

  const { isMarqueePaused } = useMarquee();
  const fonts = useMemo(() => ["Montserrat", "TransducerTest", "Raleway", "Exo 2"], []);

  // Precompute rows once to prevent CPU throttling and frame drops on mobile
  const memoizedDesktopRows = useMemo(() => {
    const rows = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      const rowNames = [...names, ...names].sort(() => Math.random() - 0.5);
      rows.push({
        names: rowNames,
        font: fonts[i % fonts.length],
        velocity: i % 2 === 0 ? 25 : 35,
        fontSize: i % 2 === 0 ? "text-2xl" : "text-3xl",
      });
    }
    return rows;
  }, [names, fonts]);

  const memoizedMobileRows = useMemo(() => {
    const rows = [];
    const count = 6;
    for (let i = 0; i < count; i++) {
      const rowNames = [...names, ...names].sort(() => Math.random() - 0.5);
      rows.push({
        names: rowNames,
        font: fonts[i % fonts.length],
        velocity: i % 2 === 0 ? 8 : 12,
        fontSize: i % 2 === 0 ? "text-sm" : "text-base",
      });
    }
    return rows;
  }, [names, fonts]);

  return (
    <>
      {/* Desktop Marquee Background */}
      <div className="space-y-2 relative hidden md:block select-none overflow-hidden h-full">
        {memoizedDesktopRows.map((row, idx) => (
          <Marquee key={idx} velocity={row.velocity}>
            {row.names.map((name, id) => (
              <div key={id} className="pr-6 opacity-20">
                <span style={{ fontFamily: row.font }} className={row.fontSize}>
                  {name}
                </span>
              </div>
            ))}
          </Marquee>
        ))}

        {/* Center CTA */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <AnimatePresence>
            {!animateX && (
              <motion.div initial="initial" exit="exit" variants={xVariants}>
                <LogoWhite className="w-80 origin-center z-30" />
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={handleRegisterClick}
            className="mt-14 w-44 bg-black font-raleway font-extrabold hover:bg-stone-800 text-white dark:bg-white opacity-95 dark:text-black dark:hover:bg-stone-200 text-2xl py-6 px-4 active:scale-90 tracking-widest shadow-xl"
          >
            REGISTER
          </Button>
        </div>
      </div>

      {/* Mobile Marquee Background */}
      <div
        className={`space-y-2 relative md:hidden select-none overflow-hidden h-full ${
          isMarqueePaused ? "paused-marquee" : ""
        }`}
      >
        {memoizedMobileRows.map((row, idx) => (
          <Marquee key={idx} velocity={row.velocity}>
            {row.names.map((name, id) => (
              <div key={id} className="pr-4 opacity-20">
                <span style={{ fontFamily: row.font }} className={row.fontSize}>
                  {name}
                </span>
              </div>
            ))}
          </Marquee>
        ))}

        {/* Center CTA */}
        <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/3 z-10 flex flex-col items-center">
          <AnimatePresence>
            {!animateX && (
              <motion.div initial="initial" exit="exit" variants={xVariants}>
                <LogoWhite className="w-64 z-30 origin-center" />
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            onClick={handleRegisterClick}
            className="mt-14 w-44 bg-black hover:bg-stone-800 text-white dark:bg-white dark:text-black dark:hover:bg-stone-200 text-2xl font-raleway font-extrabold py-6 px-4 active:scale-90 tracking-widest shadow-xl"
          >
            REGISTER
          </Button>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
