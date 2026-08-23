import axios from "axios";
import React, { useEffect, useState } from "react";
import TimeComponent from "../admin/Event/EditTimeFormat2";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { getBackendUrl } from "@/lib/api";

const EventGrid = ({ openTab }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  const fetchEvents = async (forceUpdate = false) => {
    try {
      if (!forceUpdate) {
        // Check for cached data
        const cachedEvents = localStorage.getItem("eventsData");
        if (cachedEvents) {
          const parsed = JSON.parse(cachedEvents);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }

      const backendUrl = getBackendUrl();
      const response = await axios.get(`${backendUrl}/events`);

      if (Array.isArray(response.data) && response.data.length > 0) {
        localStorage.setItem("eventsData", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching the events:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data from cache
      const data = await fetchEvents();
      setEvents(data);

      // Fetch updated data from server in the background
      const updatedData = await fetchEvents(true);
      setEvents(updatedData);
    };

    fetchData();
  }, []);

  const filteredEvents = React.useMemo(() => {
    const list = events.filter((event) => event.day_number === openTab);
    // Pin featured event (Boards & Bonds) to the very top (#1)
    return list.sort((a, b) => {
      const isASponsored = a.event_name?.toLowerCase().includes("boards & bonds");
      const isBSponsored = b.event_name?.toLowerCase().includes("boards & bonds");

      if (isASponsored && !isBSponsored) return -1;
      if (!isASponsored && isBSponsored) return 1;
      return 0;
    });
  }, [events, openTab]);

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-base font-raleway font-semibold">
          No events scheduled for Day {openTab} yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      {filteredEvents.map((event) => {
        const isSponsored = event.event_name?.toLowerCase().includes("boards & bonds");

        return (
          <div
            key={event.event_id}
            className={`group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${
              isSponsored
                ? "bg-card/90 border-amber-500/80 ring-1 ring-amber-500/50 shadow-amber-500/10 hover:border-amber-400"
                : "bg-card/60 hover:border-foreground/20"
            }`}
            onClick={() =>
              navigate(`/events/${event.event_id}`, { state: { event } })
            }
          >
            {/* Card Banner Image (1:1 Ratio) */}
            <div
              className="relative w-full aspect-square overflow-hidden bg-muted"
              style={{ aspectRatio: "1 / 1" }}
            >
              <img
                src={
                  (event.banner_url_1_compressed &&
                  event.banner_url_1_compressed.startsWith("posters/")
                    ? "/" + event.banner_url_1_compressed
                    : event.banner_url_1_compressed) ||
                  (event.banner_url_1 &&
                  event.banner_url_1.startsWith("posters/")
                    ? "/" + event.banner_url_1
                    : event.banner_url_1) ||
                  "/posters/default.png"
                }
                alt={event.event_name}
                className="w-full h-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ aspectRatio: "1 / 1" }}
                loading="lazy"
                data-tried-original="false"
                onError={(e) => {
                  const originalUrl =
                    event.banner_url_1 &&
                    event.banner_url_1.startsWith("posters/")
                      ? "/" + event.banner_url_1
                      : event.banner_url_1;
                  const compressedUrl =
                    event.banner_url_1_compressed &&
                    event.banner_url_1_compressed.startsWith("posters/")
                      ? "/" + event.banner_url_1_compressed
                      : event.banner_url_1_compressed;

                  if (
                    e.currentTarget.getAttribute("data-tried-original") ===
                      "false" &&
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

              {/* Sponsored / 2X Points Badge (Positioned at bottom-left to prevent collision with top-right time pill) */}
              {isSponsored && (
                <div className="absolute bottom-2.5 left-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[9px] sm:text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider z-10 animate-pulse">
                  <span>⭐</span>
                  <span>2X POINTS*</span>
                </div>
              )}

              {/* Time Pill Badge (Top-Right) */}
              <div className="absolute top-2.5 right-2.5 bg-black/75 dark:bg-black/85 text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full border border-white/15 shadow-sm backdrop-blur-sm">
                {isSponsored ? (
                  <span className="text-[10px] sm:text-xs font-raleway font-bold">
                    10 AM - 4 PM
                  </span>
                ) : (
                  <TimeComponent timeValue={event.time} />
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-1">
              {event.society_name && (
                <p
                  className={`text-[11px] font-black uppercase tracking-wider line-clamp-1 ${
                    isSponsored
                      ? "text-amber-500 dark:text-amber-400 flex items-center gap-1"
                      : "text-muted-foreground"
                  }`}
                >
                  {isSponsored
                    ? `⭐ Presented by ${event.society_name || "Crosslinks"}`
                    : event.society_name}
                </p>
              )}

              <h3 className="font-extrabold font-raleway text-sm sm:text-base text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                {event.event_name}
              </h3>

              {event.venue && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 pt-0.5 line-clamp-1">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventGrid;
