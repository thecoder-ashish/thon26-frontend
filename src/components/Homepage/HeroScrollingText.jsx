import React, { useState, useMemo } from "react";
import Marquee from "react-marquee-slider";
import times from "lodash.times";
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
            y: 0
        },
        exit: {
            scale: 3,
            opacity: 0,
            y:  40, // Keep this at 0 so the logo doesn't shift vertically.
            transition: {
                duration: 0.6
            }
        }
    };
    



    const handleRegisterClick = () => {
      // Start the animation
      setAnimateX(true);
  
      // Vibrate for 200ms if supported
      if ("vibrate" in navigator) {
          navigator.vibrate(200);
      } else {
          console.log("Vibration API is not supported by your browser");
      }
      
      // After animation is complete, redirect
      setTimeout(() => {
          window.location.href = "/register";
      }, 500); // This should match the duration in your exit transition
  };
  
    
  
  const names = [
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
    "CROSSLINKS"

    
  ];

  const { isMarqueePaused } = useMarquee();

  const fonts = ["Montserrat", "TransducerTest", "Raleway", "Exo 2"];
  
  const totalDisplayNames = names.length * 1; // Adjust this multiplier to control the repetition and ensure a continuous marquee effect

  const shuffledNames = (original) => {
    let array = [...original];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffledArray = useMemo(() => shuffledNames(names), [names]);

  const getRandomFont = () => {
    const randomIndex = Math.floor(Math.random() * fonts.length);
    return fonts[randomIndex];
  };

  // Precompute random fonts for all names once
  const precomputedRandomFonts = useMemo(() => {
    return times(totalDisplayNames, () => getRandomFont());
  }, [totalDisplayNames]);

  // This will depend on the height of your marquee (including the space-y-2 and the content inside)
  const estimatedMarqueeHeight = 95; // This value will need to be adjusted based on your design
  const estimatedMarqueeHeightMob = 70; // This value will need to be adjusted based on your design

  // Calculate how many marquees are required
  const numberOfMarquees = Math.ceil(
    window.innerHeight / estimatedMarqueeHeight
  );
  const numberOfMarqueesMob = Math.ceil(
    window.innerHeight / estimatedMarqueeHeightMob
  );

  const renderMarquees = () => {
    let marquees = [];

    for (let i = 0; i < numberOfMarquees; i++) {
      marquees.push(
        <React.Fragment key={i}>
          <Marquee velocity={30}>
            {times(totalDisplayNames, Number).map((id) => (
              <div key={`marquee-big-${id}-${i}`} className="pr-4 opacity-20">
                <span
                  style={{
                    fontFamily: precomputedRandomFonts[id % names.length],
                  }}
                  className="text-2xl"
                >
                  {shuffledNames(names)[id % names.length]}
                </span>
              </div>
            ))}
          </Marquee>

          <Marquee velocity={45}>
            {times(totalDisplayNames, Number).map((id) => (
              <div key={`marquee-small-${id}-${i}`} className="pr-4 opacity-20">
                <span
                  style={{ fontFamily: getRandomFont() }}
                  className="text-3xl"
                >
                  {shuffledNames(names)[id % names.length]}
                </span>
              </div>
            ))}
          </Marquee>
        </React.Fragment>
      );
    }

    return marquees;
  };

  const renderMarqueesMob = () => {
    let marquees = [];

    for (let i = 0; i < numberOfMarqueesMob; i++) {
      marquees.push(
        <React.Fragment key={i}>
          <Marquee velocity={7}>
            {times(totalDisplayNames, Number).map((id) => (
              <div key={`marquee-big-${id}-${i}`} className="pr-4  opacity-20">
                <span
                  style={{ fontFamily: getRandomFont() }}
                  className="text-base "
                >
                  {shuffledNames(names)[id % names.length]}
                </span>
              </div>
            ))}
          </Marquee>

          <Marquee velocity={10}>
            {times(totalDisplayNames, Number).map((id) => (
              <div key={`marquee-small-${id}-${i}`} className="pr-4 opacity-20">
                <span
                  style={{
                    fontFamily: precomputedRandomFonts[id % names.length],
                  }}
                  className="text-xl "
                >
                  {shuffledNames(names)[id % names.length]}
                </span>
              </div>
            ))}
          </Marquee>
        </React.Fragment>
      );
    }

    return marquees;
  };

  return (
    <>
      
      <div className={`space-y-1.5 relative hidden md:block`}>
        {renderMarquees()}
        <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
        {/* <div className=" z-10 flex flex-col items-center"> */}
      

              <AnimatePresence>
    { !animateX && (
        <motion.div
            initial="initial"
            exit="exit"
            variants={xVariants}
        >
            {/* <SVGlogoWhite className="opacity-95 w-80  origin-center z-30" /> */}
              <LogoWhite className=" w-80  origin-center z-30" />
        </motion.div>
    )}
</AnimatePresence>


          <Button
            onClick={handleRegisterClick} 
            className="mt-14 w-44 bg-black font-raleway font-extrabold hover:bg-stone-800 text-white dark:bg-white opacity-95 dark:text-black dark:hover:bg-stone-200 text-2xl py-6 px-4 active:scale-90 tracking-widest shadow-xl"
          >
            REGISTER
          </Button>
          {/* mt-4 adds a margin-top of 1rem. Adjust as necessary */}
        </div>
      </div>

      <div
        className={`space-y-1 relative  md:hidden ${
          isMarqueePaused ? "paused-marquee" : ""
        }`}
      >
        {renderMarqueesMob()}
        <div className="absolute top-[40%] top left-1/2 transform -translate-x-1/2 -translate-y-1/3 z-10 flex flex-col items-center ">
        
        
              <AnimatePresence>
    { !animateX && (
        <motion.div
            initial="initial"
            exit="exit"
            variants={xVariants}
        >
              <LogoWhite className=" w-64 z-30 origin-center" />
        </motion.div>
    )}
</AnimatePresence>
          <Button
            onClick={handleRegisterClick}
            className="mt-14 w-44 bg-black hover:bg-stone-800 text-white dark:bg-white dark:text-black dark:hover:bg-stone-200 text-2xl font-raleway font-extrabold py-6 px-4 active:scale-90 tracking-widest shadow-xl"
          >
            REGISTER
          </Button>
          {/* mt-4 adds a margin-top of 1rem. Adjust as necessary */}
        </div>
      </div>
    </>
  );
};

export default HeroSection;
