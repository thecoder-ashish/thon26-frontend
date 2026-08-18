import React, { useEffect } from "react";
import EventGrid from "../components/events/eventcomponent";
import { useLocation, useNavigate } from "react-router-dom";

export const Events = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialTab = new URLSearchParams(location.search).get("day") || "1";
  const [openTab, setOpenTab] = React.useState(parseInt(initialTab, 10));

  useEffect(() => {
    navigate(`?day=${openTab}`, { replace: true });
  }, [openTab, navigate]);

  const handleTabClick = (tabNumber) => {
    setOpenTab(tabNumber);
  };

  return (
    <div className="min-h-screen pb-20 pt-6 px-4 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-raleway tracking-tight text-foreground">
          EVENTS
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
          Explore competitions, workshops, and flagship challenges across all 3 days.
        </p>
      </div>

      {/* Capsule Day Selector Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1.5 rounded-full bg-muted/80 border space-x-2 shadow-inner">
          {[1, 2, 3].map((day) => {
            const isActive = openTab === day;
            return (
              <button
                key={day}
                onClick={() => handleTabClick(day)}
                className={`px-6 sm:px-10 py-2.5 rounded-full font-raleway font-black text-sm sm:text-base transition-all duration-300 ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                }`}
              >
                DAY {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid */}
      <div className="min-h-[50vh]">
        <EventGrid openTab={openTab} />
      </div>
    </div>
  );
};

export default Events;
