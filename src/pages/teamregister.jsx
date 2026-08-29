import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LogoWhite from "../components/Homepage/Logowhite";
import { Lock, Trophy, Calendar, MessageCircle, AlertCircle } from "lucide-react";

const Teamregister = () => {
  return (
    <div className="grid lg:max-w-none lg:mr-14 lg:grid-cols-7 p-0 min-h-[calc(100vh-60px)]">
      {/* Left Column: Logo Backdrop (Sticky viewport locked) */}
      <div className="relative hidden h-[calc(100vh-60px)] sticky top-0 flex-col p-10 lg:flex col-span-2 overflow-hidden">
        <div className="absolute inset-0 left-section overflow-hidden">
          <LogoWhite className="w-full h-full origin-center translate-x-60 scale-[1.75]" />
        </div>
      </div>

      {/* Right Column: Registrations Closed Notice */}
      <div className="p-6 md:p-10 lg:pl-16 col-span-5 flex flex-col justify-center max-w-3xl">
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-destructive/40 bg-destructive/10 text-destructive text-xs sm:text-sm font-bold tracking-wider font-raleway uppercase">
            <Lock className="h-4 w-4 shrink-0" />
            <span>Registrations Closed</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="font-extrabold font-akira tracking-tight text-3xl sm:text-4xl md:text-5xl text-foreground">
              REGISTRATIONS <br className="hidden sm:inline" />
              ARE CLOSED
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-raleway leading-relaxed">
              Online team registrations for <strong>NSUTTHON 2026</strong> are officially closed. Thank you for the overwhelming response!
            </p>
          </div>

          {/* Existing Team Roster Callout */}
          <div className="rounded-2xl border bg-card/80 backdrop-blur-sm p-5 sm:p-6 space-y-3 shadow-md">
            <div className="flex items-center gap-2.5 text-primary font-bold text-sm sm:text-base font-raleway">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>Already Registered Your Team?</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-raleway">
              You can still check your team's live standings, track festival scores, and edit your team details or roster directly from the <strong>Leaderboard</strong> tab using your team leader's phone number and team password.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/leaderboard" className="flex-1">
              <Button className="w-full py-6 font-black font-raleway tracking-wide text-sm sm:text-base shadow-lg gap-2">
                <Trophy className="h-4 w-4" />
                View Leaderboard
              </Button>
            </Link>

            <Link to="/events" className="flex-1">
              <Button variant="outline" className="w-full py-6 font-black font-raleway tracking-wide text-sm sm:text-base shadow-sm gap-2">
                <Calendar className="h-4 w-4" />
                Explore Events
              </Button>
            </Link>
          </div>

          {/* Contact POC WhatsApp */}
          <div className="pt-4 border-t">
            <a
              href="https://wa.me/916206814632?text=Hi%20Ashish,%20I%20have%20a%20query%20regarding%20NSUTTHON%20registration"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs sm:text-sm text-foreground transition-all group w-full sm:w-auto"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span>Need help or have urgent queries? WhatsApp POC: <strong className="text-emerald-500 dark:text-emerald-400 group-hover:underline">Ashish (6206814632)</strong></span>
              <MessageCircle className="h-4 w-4 text-emerald-500 ml-auto sm:ml-2 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teamregister;
