"use client";

import * as React from "react";
import { CaretSortIcon, ChevronDownIcon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Lock, MessageCircle } from "lucide-react";
import { getBackendUrl } from "@/lib/api";
import { useAuth } from "@/components/auth/auth";

export type Team = {
  team_id: number;
  points: number;
  team_name: string;
  isLockedPlaceholder?: boolean;
};

export function Leaderboard() {
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  // Modal State for Roster Details
  const [selectedTeam, setSelectedTeam] = React.useState<{ id: number; name: string } | null>(null);
  const [membersList, setMembersList] = React.useState<any[]>([]);
  const [isMembersLoading, setIsMembersLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  // Auth & Countdown States
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  React.useEffect(() => {
    const target = new Date("2026-08-31T10:00:00+05:30").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const isAdmin = user && (user.role === 'admin' || user.role === 'poc');
  const isUnlocked = isAdmin || timeLeft.isExpired;

  const sortedTeams = React.useMemo(() => {
    return [...teams].sort((a, b) => b.points - a.points);
  }, [teams]);

  const visibleTeams = React.useMemo(() => {
    if (isUnlocked) return sortedTeams;

    const topTeams = sortedTeams.slice(0, 3);
    const placeholders: Team[] = [
      { team_id: 0, points: 0, team_name: "Locked Team 4", isLockedPlaceholder: true },
      { team_id: 0, points: 0, team_name: "Locked Team 5", isLockedPlaceholder: true },
      { team_id: 0, points: 0, team_name: "Locked Team 6", isLockedPlaceholder: true },
      { team_id: 0, points: 0, team_name: "Locked Team 7", isLockedPlaceholder: true },
    ];
    return [...topTeams, ...placeholders];
  }, [sortedTeams, isUnlocked]);

  const fetchTeamData = () => {
    setIsLoading(true);
    const backendUrl = getBackendUrl();
    axios
      .get(`${backendUrl}/teams`)
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        console.error("Error fetching team data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  React.useEffect(fetchTeamData, []);

  const handleTeamClick = (teamId: number, teamName: string) => {
    setSelectedTeam({ id: teamId, name: teamName });
    setIsMembersLoading(true);
    setShowModal(true);
    const backendUrl = getBackendUrl();
    axios
      .get(`${backendUrl}/team-members/${teamId}`)
      .then((response) => {
        setMembersList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching team members:", error);
      })
      .finally(() => {
        setIsMembersLoading(false);
      });
  };

  const columns: ColumnDef<Team>[] = [
    {
      id: "rank",
      header: () => <div className="text-center font-bold pl-2 font-raleway">#</div>,
      cell: ({ row }) => {
        const index = visibleTeams.findIndex((t) => t === row.original);
        const rank = index !== -1 ? index + 1 : row.index + 1;
        return (
          <div className={`text-center font-extrabold text-sm pl-2 font-raleway ${row.original.isLockedPlaceholder ? "text-muted-foreground/30 select-none blur-[1px]" : ""}`}>
            {rank}
          </div>
        );
      },
    },
    {
      accessorKey: "team_id",
      enableHiding: false,
      header: () => <div className="text-center font-bold font-raleway">Team ID</div>,
      cell: ({ row }) => (
        <div className="text-center font-mono font-medium text-sm text-muted-foreground">
          {row.original.isLockedPlaceholder ? (
            <span className="text-muted-foreground/30 select-none blur-[1px]">••••</span>
          ) : (
            `#${row.getValue("team_id")}`
          )}
        </div>
      ),
    },
    {
      accessorKey: "team_name",
      enableHiding: true,
      header: ({ column }) => {
        return (
          <Button
            className="-ml-4 text-left font-bold font-raleway"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Team Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        if (row.original.isLockedPlaceholder) {
          return (
            <div className="font-extrabold tracking-wider text-sm sm:text-base text-muted-foreground/30 select-none blur-[2px] font-raleway uppercase">
              ••••••••••••••••••••
            </div>
          );
        }
        const teamName = row.getValue("team_name") as string;
        const teamId = row.original.team_id;
        return (
          <div
            className="font-extrabold font-raleway uppercase tracking-wide text-sm sm:text-base cursor-pointer hover:underline hover:text-primary transition-colors inline-block"
            onClick={() => handleTeamClick(teamId, teamName)}
          >
            {teamName}
          </div>
        );
      },
    },
    {
      accessorKey: "points",
      enableHiding: false,
      header: ({ column }) => {
        return (
          <div className="flex justify-end pr-2">
            <Button
              variant="ghost"
              className="font-bold font-raleway"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Points
              <CaretSortIcon className="ml-1 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        if (row.original.isLockedPlaceholder) {
          return (
            <div className="text-right font-extrabold text-base pr-4 font-mono text-muted-foreground/30 select-none blur-[1px]">
              •••
            </div>
          );
        }
        const points = parseFloat(row.getValue("points"));
        return (
          <div className="text-right font-extrabold text-base pr-4 font-mono">
            {points}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: visibleTeams,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full space-y-4">
      {/* Search and Column Controls */}
      <div className="flex items-center justify-between gap-4 py-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter teams..."
            value={
              (table.getColumn("team_name")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("team_name")?.setFilterValue(event.target.value)
            }
            className="pl-9 text-sm"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto text-sm font-raleway font-bold">
              <MixerHorizontalIcon className="mr-2 h-4 w-4" />
              View <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-xs font-raleway font-bold">Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const mapIdToDisplayText = (id: string): string => {
                  switch (id) {
                    case "team_name":
                      return "Team Name";
                    case "team_id":
                      return "Team ID";
                    case "points":
                      return "Points";
                    default:
                      return id;
                  }
                };

                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-xs font-raleway"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {mapIdToDisplayText(column.id)}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Leaderboard Table Container with Integrated Paywall */}
      <div className="relative rounded-2xl border w-full overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground text-sm font-raleway"
                >
                  {isLoading ? "Fetching standings..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Integrated Paywall Overlay (Aligned with registration page style) */}
        {!isUnlocked && !isLoading && (
          <div className="absolute inset-x-0 bottom-0 top-[120px] flex flex-col items-center justify-center bg-gradient-to-t from-background via-background/95 to-background/30 backdrop-blur-[3px] p-6 text-center z-10 animate-in fade-in duration-300">
            <div className="flex flex-col items-center space-y-4 max-w-lg mx-auto">
              
              {/* Circular High-Contrast Icon Badge (similar to registration circle buttons) */}
              <div className="flex h-14 w-14 items-center justify-center rounded-full dark:bg-white bg-black dark:text-black text-white shadow-xl">
                <Lock className="h-6 w-6" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-extrabold font-raleway tracking-tight text-foreground uppercase">
                  COMPLETE STANDINGS LOCKED
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-md">
                  Complete leaderboard will be unlocked after registrations close.
                </p>
              </div>

              {/* Countdown Grid with clean rounded-2xl chips */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-sm pt-2">
                {[
                  { label: "DAYS", value: timeLeft.days },
                  { label: "HOURS", value: timeLeft.hours },
                  { label: "MINS", value: timeLeft.minutes },
                  { label: "SECS", value: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card/90 py-3 px-2 shadow-sm backdrop-blur-md"
                  >
                    <span className="text-xl sm:text-3xl font-extrabold font-raleway tracking-tight text-foreground">
                      {String(item.value).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-muted-foreground uppercase mt-0.5">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* WhatsApp POC Link styled identically to registration page */}
              <a
                href="https://wa.me/916206814632?text=Hi%20Ashish,%20I%20have%20a%20query%20regarding%20NSUTTHON%20leaderboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors pt-2 group"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span>Queries? WhatsApp POC: <span className="font-bold text-foreground group-hover:underline">Ashish</span></span>
                <MessageCircle className="h-3.5 w-3.5 text-green-500" />
              </a>

            </div>
          </div>
        )}
      </div>

      {/* Team Roster Popup Modal */}
      {showModal && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop Blur */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal Card */}
          <div className="relative w-full max-w-md rounded-3xl border bg-card/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full border bg-background/80 hover:bg-background transition-all active:scale-95 text-muted-foreground hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1.5 pb-4 border-b">
              <span className="text-[10px] font-black tracking-widest text-primary uppercase">
                Team Standings Roster
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-raleway tracking-tight text-foreground uppercase truncate">
                {selectedTeam.name}
              </h2>
              <p className="text-xs font-mono text-muted-foreground">
                Team ID: #{selectedTeam.id}
              </p>
            </div>

            {/* Modal Body */}
            <div className="py-6 space-y-4">
              {isMembersLoading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Loading team roster...
                  </p>
                </div>
              ) : membersList.length > 0 ? (
                <div className="space-y-4">
                  {/* Team Leader */}
                  <div className="rounded-2xl border p-4 bg-primary/5 space-y-1">
                    <span className="text-[10px] font-black tracking-wider text-primary uppercase block">
                      Team Leader
                    </span>
                    <div className="flex justify-between items-center">
                      <p className="font-extrabold font-raleway text-foreground text-sm sm:text-base">
                        {membersList[0]?.member_name}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {membersList[0]?.roll_no}
                      </p>
                    </div>
                  </div>

                  {/* Teammates */}
                  {membersList.slice(1).length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black tracking-wider text-muted-foreground uppercase block pl-1">
                        Teammates
                      </span>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {membersList.slice(1).map((member, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center rounded-xl border p-3.5 bg-card"
                          >
                            <p className="font-bold font-raleway text-foreground text-sm">
                              {member.member_name}
                            </p>
                            <p className="text-xs font-mono text-muted-foreground">
                              {member.roll_no}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No roster details found.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2">
              <Button
                onClick={() => setShowModal(false)}
                className="w-full py-5 text-sm font-bold tracking-wide shadow-md font-raleway"
              >
                Close Roster
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
