import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import RegisterForm from "@/components/team/RegisterModal";
import LogoWhite from "../components/Homepage/Logowhite";
import { MessageCircle } from "lucide-react";

const Teamregister = () => {
  // Retrieve values from localStorage or set default values
  const getInitialTeamSize = () => {
    const savedTeamSize = localStorage.getItem("teamSize");
    return savedTeamSize ? JSON.parse(savedTeamSize) : 3; // Default to 3
  };

  const getInitialTeamName = () => {
    const savedTeamName = localStorage.getItem("teamName");
    return savedTeamName ? savedTeamName : ""; // Default to empty string
  };

  const [teamSize, setTeamSize] = useState(getInitialTeamSize());
  const [teamName, setTeamName] = useState(getInitialTeamName());

  // Save teamSize to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("teamSize", JSON.stringify(teamSize));
  }, [teamSize]);

  // Save teamName to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("teamName", teamName);
  }, [teamName]);

  return (
    <div className="grid lg:max-w-none lg:mr-14 lg:grid-cols-7 p-0 min-h-[calc(100vh-60px)]">
      {/* Left Column: Logo Backdrop (Sticky viewport locked) */}
      <div className="relative hidden h-[calc(100vh-60px)] sticky top-0 flex-col p-10 lg:flex col-span-2 overflow-hidden">
        <div className="absolute inset-0 left-section overflow-hidden">
          <LogoWhite className="w-full h-full origin-center translate-x-60 scale-[1.75]" />
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="p-6 md:p-8 lg:pl-20 col-span-5 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-extrabold font-raleway tracking-tight text-3xl md:text-4xl">
            TEAM SIZE
          </h1>

          {/* Minimalist POC link */}
          <a
            href="https://wa.me/916206814632?text=Hi%20Ashish,%20I%20have%20a%20query%20regarding%20NSUTTHON%20registration"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span>Registration Query? WhatsApp POC: <span className="font-bold text-foreground group-hover:underline">Ashish</span></span>
            <MessageCircle className="h-3.5 w-3.5 text-green-500" />
          </a>
        </div>

        <div className="py-4 md:py-7 font-extrabold text-white dark:text-black">
          <Button
            onClick={() => setTeamSize(3)}
            className={`transition-all rounded-full text-xl h-14 w-14 md:h-14 md:w-14 mr-3 md:mr-4 ${
              teamSize === 3 ? "" : "dark:bg-white bg-black dark:text-black"
            }`}
          >
            <span
              style={{ transform: "scaleX(1.9) scaleY(1)" }}
              className="md:text-2xl font-bold font-akira"
            >
              3
            </span>
          </Button>
          <Button
            onClick={() => setTeamSize(4)}
            className={`transition-all rounded-full text-xl h-14 w-14 md:h-14 md:w-14 mr-3 md:mr-4 ${
              teamSize === 4 ? "" : "dark:bg-white bg-black dark:text-black"
            }`}
          >
            <span
              style={{ transform: "scaleX(1.9) scaleY(1)" }}
              className="md:text-2xl font-bold font-akira"
            >
              4
            </span>
          </Button>
          <Button
            onClick={() => setTeamSize(5)}
            className={`transition-all rounded-full text-xl h-14 w-14 md:h-14 md:w-14 mr-3 md:mr-4 ${
              teamSize === 5 ? "" : "dark:bg-white bg-black dark:text-black"
            }`}
          >
            <span
              style={{ transform: "scaleX(1.9) scaleY(1)" }}
              className="md:text-2xl font-bold font-akira"
            >
              5
            </span>
          </Button>
        </div>

        <input
          required
          placeholder="TEAM NAME"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value.toUpperCase())}
          className="bg-transparent overflow-hidden cursor-text w-full text-5xl my-2 md:mb-4 outline-none md:text-7xl font-extrabold"
        />
        <RegisterForm numberOfMembers={teamSize} teamName={teamName} />
      </div>
    </div>
  );
};

export default Teamregister;
