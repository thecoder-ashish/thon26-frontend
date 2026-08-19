import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  Trophy,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const teamId = location.state?.teamId || "1001";
  const teamName = location.state?.teamName || "Your Team";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCopyTeamId = () => {
    navigator.clipboard.writeText(teamId.toString());
    setCopied(true);
    toast({
      title: "Team ID Copied! 📋",
      description: `Team ID #${teamId} copied to clipboard.`,
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Top Celebration Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 mb-2 animate-bounce">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-raleway tracking-tight text-foreground">
          REGISTRATION SUCCESSFUL!
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
          Congratulations! <span className="font-bold text-foreground">{teamName}</span> is officially registered for NSUTTHON 2026.
        </p>
      </div>

      {/* Main Team ID Highlight Card */}
      <div className="relative rounded-3xl border bg-gradient-to-b from-primary/10 via-card/80 to-card p-6 sm:p-8 backdrop-blur-xl shadow-xl text-center overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Trophy className="h-40 w-40" />
        </div>

        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-primary mb-1">
          Your Official Team Identifier
        </p>
        <div className="flex items-center justify-center gap-3 my-3">
          <span className="text-4xl sm:text-6xl font-black font-mono tracking-wider text-foreground">
            #{teamId}
          </span>
          <button
            onClick={handleCopyTeamId}
            className="p-3 rounded-2xl border bg-background/80 hover:bg-background shadow-sm hover:scale-105 active:scale-95 transition-all text-muted-foreground hover:text-foreground"
            title="Copy Team ID"
          >
            {copied ? (
              <Check className="h-6 w-6 text-green-500" />
            ) : (
              <Copy className="h-6 w-6" />
            )}
          </button>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          Please note down your <b>Team ID</b>. You will use it when participating in events and earning points on the leaderboard!
        </p>
      </div>

      {/* Official WhatsApp Community Card */}
      <div className="rounded-3xl border bg-card/60 backdrop-blur-md p-6 sm:p-8 space-y-4 text-center max-w-2xl mx-auto shadow-md">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
          <MessageCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-black font-raleway tracking-tight text-foreground">
          Join Official WhatsApp Community
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Stay updated with real-time announcements, event schedules, scoring alerts, and organizers support throughout NSUTTHON 2026.
        </p>
        <div className="pt-2">
          <a
            href="https://chat.whatsapp.com/DpN0lPgr6OREEsYObnPapY?s=sw&p=a&ilr=4"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto px-8 py-6 text-base font-bold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/20 transition-all">
              <MessageCircle className="h-5 w-5" />
              <span>Join WhatsApp Group</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/events" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto px-8 py-6 text-base font-bold font-raleway flex items-center justify-center gap-2">
            <span>Explore Events</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/leaderboard" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto px-8 py-6 text-base font-bold font-raleway border-2">
            View Leaderboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default SuccessPage;
