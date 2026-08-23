import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AdminTeamTable } from "../components/admin/AdminTeamTable";
import { EventsInputForm } from "../components/admin/EventForm";
import { AdminEventsTable } from "../components/admin/AdminEventsTable";
import { EventScoringPanel } from "../components/admin/EventScoringPanel";
import { AdminLogsTable } from "../components/admin/AdminLogsTable";
import { useAuth } from "../components/auth/auth";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const isPoc = user?.role === "poc";

  // If user is POC, default to tab 4 (Scoring); otherwise default to tab 1
  const defaultTab = isPoc ? 4 : 1;
  const rawTab = Number(searchParams.get("tab"));
  const openTab = isPoc && rawTab !== 4 && rawTab !== 5 ? 4 : (rawTab || defaultTab);

  const handleTabChange = (tabNumber) => {
    if (isPoc && tabNumber !== 4 && tabNumber !== 5) return; // Restrict POC from tabs 1, 2, 3
    setSearchParams({ tab: tabNumber });
    navigate({ search: `?tab=${tabNumber}` });
  };

  return (
    <div className="p-4 sm:p-8 md:p-12 lg:px-24 xl:px-48">
      {/* Role Badge Indicator */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-black font-raleway px-3.5 py-1.5 rounded-full uppercase tracking-wider bg-muted text-foreground border shadow-sm">
            {isPoc ? "POC Admin" : "Full Administrator"}
          </span>
        </div>
        {user?.username && (
          <span className="text-xs text-muted-foreground font-raleway">
            Logged in as <b className="text-foreground font-black">{user.username}</b>
          </span>
        )}
      </div>

      <ul className="flex w-full list-none flex-wrap border-b-4 border-black dark:border-slate-100 m-0 p-0 text-end space-x-0 items-end">
        {/* Tab 1: TEAMS (Admin Only) */}
        {!isPoc && (
          <li
            className={`${
              openTab === 1
                ? "md:border-b-4 text-3xl"
                : "text-slate-500 text-2xl"
            } border-black dark:border-slate-100 m-0 p-0 cursor-pointer`}
          >
            <div
              onClick={(e) => {
                e.preventDefault();
                handleTabChange(1);
              }}
            >
              <h1
                className={`${
                  openTab === 1
                    ? "md:text-2xl transition-all text-xl"
                    : "md:text-xl transition-all hover:text-2xl text-lg"
                } md:pb-4 pb-2 font-black font-raleway tracking-tight px-3 sm:px-4`}
              >
                TEAMS
              </h1>
            </div>
          </li>
        )}

        {/* Tab 2: ADD EVENTS (Admin Only) */}
        {!isPoc && (
          <li
            className={`${
              openTab === 2
                ? "md:border-b-4 text-3xl"
                : "text-slate-500 text-2xl"
            } border-black dark:border-slate-100 m-0 p-0 cursor-pointer`}
          >
            <div
              onClick={(e) => {
                e.preventDefault();
                handleTabChange(2);
              }}
            >
              <h1
                className={`${
                  openTab === 2
                    ? "md:text-2xl transition-all text-xl"
                    : "md:text-xl transition-all hover:text-2xl text-lg"
                } md:pb-4 pb-2 font-black font-raleway tracking-tight px-3 sm:px-4`}
              >
                ADD EVENTS
              </h1>
            </div>
          </li>
        )}

        {/* Tab 3: MANAGE EVENTS (Admin Only) */}
        {!isPoc && (
          <li
            className={`${
              openTab === 3
                ? "md:border-b-4 text-3xl"
                : "text-slate-500 text-2xl"
            } border-black dark:border-slate-100 m-0 p-0 cursor-pointer`}
          >
            <div
              onClick={(e) => {
                e.preventDefault();
                handleTabChange(3);
              }}
            >
              <h1
                className={`${
                  openTab === 3
                    ? "md:text-2xl transition-all text-xl"
                    : "md:text-xl transition-all hover:text-2xl text-lg"
                } md:pb-4 pb-2 text-left font-black font-raleway tracking-tight px-3 sm:px-4`}
              >
                MANAGE EVENTS
              </h1>
            </div>
          </li>
        )}

        {/* Tab 4: EVENT SCORING (Available to Both Admin and POC) */}
        <li
          className={`${
            openTab === 4
              ? "md:border-b-4 text-3xl"
              : "text-slate-500 text-2xl"
          } border-black dark:border-slate-100 m-0 p-0 cursor-pointer`}
        >
          <div
            onClick={(e) => {
              e.preventDefault();
              handleTabChange(4);
            }}
          >
            <h1
              className={`${
                openTab === 4
                  ? "md:text-2xl transition-all text-xl"
                  : "md:text-xl transition-all hover:text-2xl text-lg"
              } md:pb-4 pb-2 font-black font-raleway tracking-tight px-3 sm:px-4`}
            >
              EVENT SCORING
            </h1>
          </div>
        </li>

        {/* Tab 5: AUDIT LOGS */}
        <li
          className={`${
            openTab === 5
              ? "md:border-b-4 text-3xl"
              : "text-slate-500 text-2xl"
          } border-black dark:border-slate-100 m-0 p-0 cursor-pointer`}
        >
          <div
            onClick={(e) => {
              e.preventDefault();
              handleTabChange(5);
            }}
          >
            <h1
              className={`${
                openTab === 5
                  ? "md:text-2xl transition-all text-xl"
                  : "md:text-xl transition-all hover:text-2xl text-lg"
              } md:pb-4 pb-2 font-black font-raleway tracking-tight px-3 sm:px-4`}
            >
              LOGS
            </h1>
          </div>
        </li>
      </ul>

      <div className="pt-4 md:pt-8">
        {!isPoc && openTab === 1 && (
          <div className="flex items-center justify-center">
            <AdminTeamTable />
          </div>
        )}
        {!isPoc && openTab === 2 && (
          <div className="flex items-center justify-center">
            <EventsInputForm />
          </div>
        )}
        {!isPoc && openTab === 3 && (
          <div className="flex items-center justify-center">
            <AdminEventsTable />
          </div>
        )}
        {openTab === 4 && (
          <div className="flex items-center justify-center">
            <EventScoringPanel />
          </div>
        )}
        {openTab === 5 && (
          <div className="flex items-center justify-center">
            <AdminLogsTable />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
