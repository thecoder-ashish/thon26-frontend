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
import { Search, Trash2, AlertTriangle } from "lucide-react";
import { getBackendUrl } from "@/lib/api";
import { useAuth } from "@/components/auth/auth";
import { useToast } from "@/components/ui/use-toast";

export type Team = {
  team_id: number;
  points: number;
  team_name: string;
};

export function Leaderboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user && user.role !== "poc";

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
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Sort by points descending, break ties with team_id ascending (e.g. #1001 first)
  const sortedTeams = React.useMemo(() => {
    return [...teams].sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return a.team_id - b.team_id;
    });
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
        console.error("Error fetching leaderboard data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    fetchTeamData();
  }, []);

  const handleRowClick = (team: Team) => {
    setSelectedTeam({ id: team.team_id, name: team.team_name });
    setShowModal(true);
    setShowConfirmDelete(false);
    setIsMembersLoading(true);

    const backendUrl = getBackendUrl();
    axios
      .get(`${backendUrl}/team-members/${team.team_id}`)
      .then((response) => {
        setMembersList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching team roster:", error);
        setMembersList([]);
      })
      .finally(() => {
        setIsMembersLoading(false);
      });
  };

  const handleDeleteTeam = async () => {
    if (!selectedTeam) return;

    const token =
      user?.token ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("accessToken");

    if (!token) {
      toast({
        title: "Authentication Error",
        variant: "destructive",
        description: "Please login as administrator to perform this action.",
      });
      return;
    }

    setIsDeleting(true);
    try {
      const backendUrl = getBackendUrl();
      await axios.delete(`${backendUrl}/teams/${selectedTeam.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Team Deleted",
        description: `Team "${selectedTeam.name}" (#${selectedTeam.id}) and all members were permanently deleted.`,
      });

      setShowModal(false);
      setShowConfirmDelete(false);
      fetchTeamData();
    } catch (error: any) {
      console.error("Error deleting team:", error);
      toast({
        title: "Delete Failed",
        variant: "destructive",
        description:
          error.response?.data?.message || "Server error while deleting team.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Team>[] = [
    {
      id: "index",
      enableHiding: false,
      header: () => <div className="font-bold font-raleway text-left pl-3">Rank</div>,
      cell: ({ row }) => {
        const rank =
          sortedTeams.findIndex((t) => t.team_id === row.original.team_id) + 1;
        
        let rankBadge = null;
        if (rank === 1) {
          rankBadge = <span className="text-xl">🥇</span>;
        } else if (rank === 2) {
          rankBadge = <span className="text-xl">🥈</span>;
        } else if (rank === 3) {
          rankBadge = <span className="text-xl">🥉</span>;
        }

        return (
          <div className="flex items-center gap-2 font-bold font-raleway text-base pl-3">
            {rankBadge ? (
              <span className="flex items-center gap-1.5">{rankBadge} <span className="text-xs text-muted-foreground font-mono">#{rank}</span></span>
            ) : (
              <span className="text-sm font-mono text-muted-foreground font-semibold">#{rank}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "team_name",
      enableHiding: false,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="font-bold font-raleway text-left pl-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Team Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const team = row.original;
        return (
          <div
            onClick={() => handleRowClick(team)}
            className="font-extrabold font-raleway text-sm sm:text-base text-foreground hover:underline hover:text-primary transition-colors cursor-pointer"
          >
            {row.getValue("team_name")}
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
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize font-raleway text-xs"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-2xl border w-full overflow-hidden shadow-sm">
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
              {showConfirmDelete ? (
                <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/10 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-destructive font-black text-sm sm:text-base">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <span>Delete "{selectedTeam.name}"?</span>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    This action <strong>cannot be undone</strong>. This will permanently delete Team{" "}
                    <strong>
                      #{selectedTeam.id} ({selectedTeam.name})
                    </strong>{" "}
                    and <strong>all registered team members</strong> from the database.
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowConfirmDelete(false)}
                      disabled={isDeleting}
                      className="text-xs font-raleway"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteTeam}
                      disabled={isDeleting}
                      className="text-xs font-raleway gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {isDeleting ? "Deleting..." : "Confirm Delete"}
                    </Button>
                  </div>
                </div>
              ) : isMembersLoading ? (
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
            {!showConfirmDelete && (
              <div className="pt-2 flex items-center gap-2">
                {isAdmin && (
                  <Button
                    variant="destructive"
                    onClick={() => setShowConfirmDelete(true)}
                    className="flex-1 py-5 text-xs sm:text-sm font-bold tracking-wide shadow-md font-raleway gap-1.5"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Team
                  </Button>
                )}
                <Button
                  onClick={() => setShowModal(false)}
                  className={`${
                    isAdmin ? "flex-1" : "w-full"
                  } py-5 text-xs sm:text-sm font-bold tracking-wide shadow-md font-raleway`}
                >
                  Close Roster
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
