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
import { Search } from "lucide-react";
import { getBackendUrl } from "@/lib/api";

export type Team = {
  team_id: number;
  points: number;
  team_name: string;
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

  const sortedTeams = React.useMemo(() => {
    return [...teams].sort((a, b) => b.points - a.points);
  }, [teams]);

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
      header: () => <div className="text-center font-bold pl-2">#</div>,
      cell: ({ row }) => {
        const rank = sortedTeams.findIndex((t) => t.team_id === row.original.team_id) + 1;
        return (
          <div className="text-center font-bold text-sm pl-2">
            {rank}
          </div>
        );
      },
    },
    {
      accessorKey: "team_id",
      enableHiding: false,
      header: () => <div className="text-center font-bold">Team ID</div>,
      cell: ({ row }) => (
        <div className="text-center font-mono font-medium text-sm text-muted-foreground">
          {row.getValue("team_id")}
        </div>
      ),
    },
    {
      accessorKey: "team_name",
      enableHiding: true,
      header: ({ column }) => {
        return (
          <Button
            className="-ml-4 text-left font-bold"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Team Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const teamName = row.getValue("team_name") as string;
        const teamId = row.original.team_id;
        return (
          <div
            className="font-bold uppercase tracking-wide text-sm sm:text-base cursor-pointer hover:underline hover:text-primary transition-colors inline-block"
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
              className="font-bold"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Points
              <CaretSortIcon className="ml-1 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
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
    data: sortedTeams,
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
            <Button variant="outline" className="ml-auto text-sm">
              <MixerHorizontalIcon className="mr-2 h-4 w-4" />
              View <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-xs">Toggle columns</DropdownMenuLabel>
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
                    className="capitalize text-xs"
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

      {/* Leaderboard Table */}
      <div className="rounded-md border w-full">
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
                    <TableCell key={cell.id} className="py-3">
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
                  className="h-24 text-center text-muted-foreground text-sm"
                >
                  {isLoading ? "Fetching standings..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
                className="w-full py-5 text-sm font-bold tracking-wide shadow-md"
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
