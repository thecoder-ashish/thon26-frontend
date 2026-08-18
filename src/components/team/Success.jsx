import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Trophy,
  ArrowRight,
  ShieldCheck,
  FileText,
  Smartphone,
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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Top Celebration Banner */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 mb-2 animate-bounce">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-raleway tracking-tight text-foreground">
          REGISTRATION INITIATED!
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
          Congratulations, Team Leader! <span className="font-bold text-foreground">{teamName}</span> is now recorded in NSUTTHON 2026.
        </p>
      </div>

      {/* Main Team ID Highlight Card */}
      <div className="relative rounded-3xl border bg-gradient-to-b from-primary/10 via-card/80 to-card p-6 sm:p-8 backdrop-blur-xl shadow-xl text-center mb-10 overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Trophy className="h-40 w-40" />
        </div>

        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-primary mb-1">
          Your Official Identifier
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
          Save your <b>Team ID</b>. You will need it to participate in events and earn leaderboard points!
        </p>
      </div>

      {/* Verification Steps Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b pb-3">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold font-raleway tracking-tight">
            Complete Verification Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1: StockGro Profile */}
          <div className="rounded-2xl border bg-card/60 p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <span className="text-[11px] font-semibold uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  All Members
                </span>
              </div>
              <h3 className="font-bold text-base font-raleway">
                StockGro App Registration
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every team member must register on StockGro with their personal email ID and take a screenshot of their profile.
              </p>
            </div>
            <a
              href="https://community.stockgro.club/form/10312eef-5387-439b-a6fa-d382a1fef702"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" className="w-full text-xs font-bold flex items-center justify-center gap-1.5 py-5">
                <span>StockGro Portal</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          </div>

          {/* Step 2: Survey */}
          <div className="rounded-2xl border bg-card/60 p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <span className="text-[11px] font-semibold uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  Team Leader
                </span>
              </div>
              <h3 className="font-bold text-base font-raleway">
                School-Going Child Survey
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Fill out the short verification survey entering details of a school-going sibling, relative, or neighbour.
              </p>
            </div>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSftK9XFBIP7KF4kQriCuNqciEta4iw4sjr3CA5mmiAaclFrRA/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" className="w-full text-xs font-bold flex items-center justify-center gap-1.5 py-5">
                <span>Fill Survey</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          </div>

          {/* Step 3: Google Form */}
          <div className="rounded-2xl border bg-card/60 p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <span className="text-[11px] font-semibold uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  Final Submission
                </span>
              </div>
              <h3 className="font-bold text-base font-raleway">
                Submit Screenshots Google Form
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Upload the verification screenshots for all members on the official verification form to complete team verification.
              </p>
            </div>
            <a
              href="https://forms.gle/BSJfaaLhv1jt378Y9"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full text-xs font-bold flex items-center justify-center gap-1.5 py-5">
                <span>Open Verification Form</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          </div>

          {/* Step 4: WhatsApp Group */}
          <div className="rounded-2xl border bg-card/60 p-5 flex flex-col justify-between space-y-4 hover:border-green-500/40 transition-all shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="h-7 w-7 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <span className="text-[11px] font-semibold uppercase text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
                  Community
                </span>
              </div>
              <h3 className="font-bold text-base font-raleway">
                Join Official WhatsApp Group
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect with organizers, receive event schedule alerts, and ask any questions during the festival.
              </p>
            </div>
            <a
              href="https://chat.whatsapp.com/IOKnp0w5GhV7wopGc8StZs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full text-xs font-bold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-1.5 py-5">
                <MessageCircle className="h-4 w-4" />
                <span>Join WhatsApp Group</span>
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
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
