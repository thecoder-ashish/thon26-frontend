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
      cell: ({ row }) => (
        <div className="font-bold uppercase tracking-wide text-sm sm:text-base">
          {row.getValue("team_name")}
        </div>
      ),
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
    </div>
  );
}

export default Leaderboard;
