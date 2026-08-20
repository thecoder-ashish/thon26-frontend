import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import TimeComponent from "../admin/Event/EditTimeFormat";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Calendar,
  User,
  Phone,
  ArrowLeft,
  MessageCircle,
  Share2,
  Check,
} from "lucide-react";
import LogoWhite from "../Homepage/Logowhite";
import DOMPurify from "dompurify";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { getBackendUrl } from "@/lib/api";

const EventDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId: event_id } = useParams();
  const { toast } = useToast();
  const [eventDetails, setEventDetails] = useState(location.state?.event || {});
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(!eventDetails.event_id);

  const fetchedRef = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!eventDetails.event_id && !fetchedRef.current) {
      const fetchEventDetails = async () => {
        fetchedRef.current = true;
        setIsLoading(true);
        try {
          const backendUrl = getBackendUrl();
          const response = await axios.get(
            `${backendUrl}/events/${event_id}`
          );
          setEventDetails(response.data);
        } catch (error) {
          console.error("Error fetching the event details:", error);
          toast({
            variant: "destructive",
            title: "Failed to load event",
            description: "Could not retrieve event information.",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchEventDetails();
    }
  }, [event_id]);

  const sanitizedDescription = eventDetails.description
    ? DOMPurify.sanitize(eventDetails.description)
    : "";

  const sanitizedRules = eventDetails.rules
    ? DOMPurify.sanitize(eventDetails.rules)
    : "";

  const pocs = [
    { name: eventDetails.name_poc_1, phone: eventDetails.phone_poc_1 },
    { name: eventDetails.name_poc_2, phone: eventDetails.phone_poc_2 },
    { name: eventDetails.name_poc_3, phone: eventDetails.phone_poc_3 },
  ].filter((poc) => poc.name && poc.phone);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${eventDetails.event_name} | NSUTTHON 2026`,
        text: `Check out ${eventDetails.event_name} at NSUTTHON 2026!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Event link copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const compressedUrl = eventDetails.banner_url_1_compressed && eventDetails.banner_url_1_compressed.startsWith("posters/")
    ? "/" + eventDetails.banner_url_1_compressed
    : eventDetails.banner_url_1_compressed;

  const originalUrl = eventDetails.banner_url_1 && eventDetails.banner_url_1.startsWith("posters/")
    ? "/" + eventDetails.banner_url_1
    : eventDetails.banner_url_1;

  const bannerImage = compressedUrl || originalUrl || "/posters/default.png";

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground font-raleway animate-pulse text-lg">
          Loading event details...
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid lg:max-w-none lg:mr-14 lg:grid-cols-7 p-0"
      style={{ minHeight: "calc(100vh - 60px)" }}
    >
      {/* Left Column: Register-inspired logo backdrop + 1:1 image banner */}
      <div className="relative hidden h-full flex-col p-8 lg:flex col-span-2 justify-between border-r">
        <div className="absolute inset-0 left-section overflow-hidden pointer-events-none">
          <LogoWhite className="w-full h-full origin-center translate-x-60 scale-[1.75] opacity-50" />
        </div>

        <div className="relative z-10 space-y-6">
          <button
            onClick={() => navigate("/events")}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors bg-background/80 hover:bg-background px-3.5 py-1.5 rounded-full border shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Events
          </button>

          {/* 1:1 Event Banner Image */}
          <div
            className="w-full aspect-square rounded-2xl overflow-hidden shadow-xl border bg-card relative"
            style={{ aspectRatio: "1 / 1" }}
          >
            <img
              src={bannerImage}
              alt={eventDetails.event_name || "Event Poster"}
              className="w-full h-full aspect-square object-cover"
              style={{ aspectRatio: "1 / 1" }}
              data-tried-original="false"
              onError={(e) => {
                if (
                  e.currentTarget.getAttribute("data-tried-original") === "false" &&
                  compressedUrl &&
                  originalUrl &&
                  originalUrl !== compressedUrl
                ) {
                  e.currentTarget.setAttribute("data-tried-original", "true");
                  e.currentTarget.src = originalUrl;
                } else {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/posters/default.png";
                }
              }}
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {eventDetails.society_name || "Official Society"}
            </p>
            <p className="font-extrabold font-raleway text-lg leading-tight">
              Day {eventDetails.day_number || 1} • NSUTTHON 2026
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-6">
          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-2 w-full text-xs font-bold text-muted-foreground hover:text-foreground bg-background/80 hover:bg-background py-2 rounded-full border shadow-sm transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-500" /> Link Copied
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" /> Share Event
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Main Content Details */}
      <div
        style={{ minHeight: "calc(100vh - 60px)" }}
        className="p-6 md:p-8 lg:pl-16 col-span-5 space-y-8 overflow-y-auto"
      >
        {/* Mobile top bar with Back & Share */}
        <div className="flex items-center justify-between lg:hidden pb-2 border-b">
          <button
            onClick={() => navigate("/events")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Events
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-500" /> Copied
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" /> Share
              </>
            )}
          </button>
        </div>

        {/* Mobile Image (1:1 aspect ratio) */}
        <div
          className="lg:hidden w-full max-w-sm mx-auto aspect-square rounded-2xl overflow-hidden shadow-lg border"
          style={{ aspectRatio: "1 / 1" }}
        >
          <img
            src={bannerImage}
            alt={eventDetails.event_name || "Event Poster"}
            className="w-full h-full aspect-square object-cover"
            style={{ aspectRatio: "1 / 1" }}
            data-tried-original="false"
            onError={(e) => {
              if (
                e.currentTarget.getAttribute("data-tried-original") === "false" &&
                compressedUrl &&
                originalUrl &&
                originalUrl !== compressedUrl
              ) {
                e.currentTarget.setAttribute("data-tried-original", "true");
                e.currentTarget.src = originalUrl;
              } else {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/posters/default.png";
              }
            }}
          />
        </div>

        {/* Header Information */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black font-raleway px-3 py-1 rounded-full uppercase tracking-wider bg-muted text-foreground border shadow-sm">
              Day {eventDetails.day_number || 1}
            </span>
            {eventDetails.society_name && (
              <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                {eventDetails.society_name}
              </span>
            )}
          </div>

          <h1 className="font-black font-raleway tracking-tight text-3xl sm:text-5xl md:text-6xl text-foreground uppercase leading-none">
            {eventDetails.event_name}
          </h1>

          {/* Quick Details (Time & Venue) */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-2 text-sm sm:text-base font-bold font-raleway text-muted-foreground">
            <div className="flex items-center gap-1.5 text-foreground">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <TimeComponent timeValue={eventDetails.time} />
            </div>

            {eventDetails.venue && (
              <div className="flex items-center gap-1.5 text-foreground uppercase">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>{eventDetails.venue}</span>
              </div>
            )}
          </div>
        </div>

        {/* Registration CTA Button */}
        {eventDetails.registration_link && (
          <div className="pt-2">
            <a
              href={eventDetails.registration_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto px-8 py-6 text-base sm:text-lg font-black font-raleway tracking-wide shadow-md">
                REGISTER FOR THIS EVENT
              </Button>
            </a>
          </div>
        )}

        {/* Description Section */}
        {sanitizedDescription && (
          <div className="space-y-3 pt-4 border-t">
            <h2 className="font-extrabold font-raleway tracking-tight text-xl md:text-2xl uppercase">
              About The Event
            </h2>
            <div
              className="prose dark:prose-invert max-w-none text-muted-foreground text-sm sm:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            />
          </div>
        )}

        {/* Rules Section */}
        {sanitizedRules && (
          <div className="space-y-3 pt-4 border-t">
            <h2 className="font-extrabold font-raleway tracking-tight text-xl md:text-2xl uppercase">
              Event Rules & Guidelines
            </h2>
            <div
              className="prose dark:prose-invert max-w-none text-muted-foreground text-sm sm:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizedRules }}
            />
          </div>
        )}

        {/* Points of Contact & Need Help Side-by-Side Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 border-t items-start">
          {/* Left Column: Points of Contact */}
          <div className="lg:col-span-7 space-y-3">
            <h2 className="font-extrabold font-raleway tracking-tight text-xl md:text-2xl uppercase">
              Points of Contact
            </h2>
            {pocs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pocs.map((poc, idx) => (
                  <a
                    key={idx}
                    href={`tel:${poc.phone}`}
                    className="flex items-center gap-3 p-3.5 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors shadow-sm"
                  >
                    <div className="h-9 w-9 rounded-full bg-background border flex items-center justify-center text-foreground font-bold shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{poc.name}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {poc.phone}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                POC contact information will be updated soon.
              </p>
            )}
          </div>

          {/* Right Column: WhatsApp Support Box */}
          <div className="lg:col-span-5 rounded-2xl border bg-muted/30 p-5 text-center space-y-3">
            <p className="font-bold text-sm font-raleway">
              Need help with registration?
            </p>
            <p className="text-xs text-muted-foreground">
              Join the official NSUTTHON 2026 WhatsApp group for instant announcements & support.
            </p>
            <a
              href="https://chat.whatsapp.com/DpN0lPgr6OREEsYObnPapY?s=sw&p=a&ilr=4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              Join WhatsApp Community
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
