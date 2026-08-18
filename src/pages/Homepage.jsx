import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { NsutthonGrid } from "../components/Homepage/Grid";
import { Faq } from "@/components/Homepage/Faq";
import HeroSection from "@/components/Homepage/HeroScrollingText";
import { Events } from "./events";

export function HomePage() {
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  // const navbarHeight = 56; // Height of your navbar in pixels
  //  const [vh, setVh] = useState(window.innerHeight - navbarHeight);

  //  useEffect(() => {
  //    const handleResize = () => setVh(window.innerHeight - navbarHeight);
  //  window.addEventListener("resize", handleResize);
  //    return () => {
  //     window.removeEventListener("resize", handleResize);
  // };
  // }, []);


  const styles = {
    // snapContainer: {
    //   height: `${vh}px`,
    //   overflowY: "scroll",
    //   scrollSnapType: "y mandatory",
    // },
    // section: {
    //   scrollSnapAlign: "start",
    // },
  };

  return (
    <div >
      <section

        className="pt-1 h-screen  overflow-hidden"
      >
        <HeroSection />
      </section>

      <section

        className="md:px-16  lg:px-[10vw] xl:px-[12vw] px-[6vw]   |  py-6    w-full  flex  gap-14 justify-center items-center flex-col "
      >
        <h1 className="font-extrabold  font-raleway text-center tracking-tight text-2xl md:text-4xl">
          NSUTTHON: Last Event's Highlights
        </h1>
        <div className=" w-full">
          <NsutthonGrid />
        </div>
      </section>
      <section className="w-full">
        <Events />
      </section>
      <section className="md:px-16 lg:px-[10vw] xl:px-[12vw] px-[6vw] pb-6 md:pb-16 w-full">
        <h1 className="font-extrabold font-raleway text-center pt-4 p-4 tracking-tight text-2xl md:text-4xl lower">
          FAQs
        </h1>
        <div className="w-full">
          <Faq showAll={showAllFaqs} />
        </div>
        <div className="text-center -mt-7 relative">
          <button
            className={`transform transition-transform duration-300 p-2 rounded-full ${showAllFaqs ? "rotate-180" : ""
              } dark:bg-[hsl(0,0%,14.9%)] bg-[hsl(0,0%,89.9%)] shadow-md`}
            onClick={() => setShowAllFaqs(!showAllFaqs)}
          >
            <ChevronDown className="h-8 w-8 stroke-2" />
          </button>
        </div>
      </section>
    </div>
  );
}
