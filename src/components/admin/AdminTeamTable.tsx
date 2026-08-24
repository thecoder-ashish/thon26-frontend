"use client"

import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons"
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
} from "@tanstack/react-table"
import axios from "axios"
import FileSaver from 'file-saver';
import { TeamDetailsDialog } from "./Team/TeamViewDetail"
import { TeamDeleteDialog } from "./Team/TeamDeleteDialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PointsUpdateDialog } from "./PointsUpdate"
import { useAuth } from "../auth/auth"
import { getBackendUrl } from "@/lib/api"

export type Team = {
  team_id: number
  points: number
  team_name: string
}

export function AdminTeamTable() {
  const { user } = useAuth();
  const isPoc = user?.role === "poc";

  const [teams, setTeams] = React.useState<Team[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  
  // Sort by points descending, break ties with team_id ascending (#1001 first)
  const sortedTeams = React.useMemo(() => {
    return [...teams].sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return a.team_id - b.team_id;
    });
  }, [teams]);

  // fetch team data function
  const fetchTeamData = () => {
    const backendUrl = getBackendUrl();
    axios.get(`${backendUrl}/teams`)
        .then(response => {
            setTeams(response.data);
        })
        .catch(error => {
            console.error('Error fetching team data:', error);
        });
  };
  
  const downloadExcelFile = () => {
    setIsDownloading(true);

    const backendUrl = getBackendUrl();
    axios.get(`${backendUrl}/teams/export`, {
        responseType: 'blob'
    })
    .then(response => {
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, 'users-details.xlsx');
        setIsDownloading(false);
    })
    .catch(error => {
        console.error('Error downloading the file:', error);
        setIsDownloading(false);
    });
  };

  // Fetch data using Axios when the component mounts
  React.useEffect(fetchTeamData, []);

  // Define the columns for the table
 const columns: ColumnDef<Team>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => {
      return sortedTeams.findIndex(team => team.team_id === row.original.team_id) + 1;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "team_name",
    header: ({ column }) => {
      return (
        <Button  
          className="w-full text-right"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Team Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase text-center font-bold">{row.original.team_name}</div>,
  },
  {
    accessorKey: "team_id",
    header: "Team ID",
    cell: ({ row }) => <div className="font-mono text-center">#{row.original.team_id}</div>,
  },
  {
    accessorKey: "points",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full -mr-20"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Points
          <CaretSortIcon className="ml-2 h-4 w-4" /> 
        </Button>
      )
    },
    cell: ({ row }) => {
      const points = parseFloat(String(row.original.points));
      return (
        <div className="flex items-center justify-center">
          <div className="uppercase flex w-2 justify-end text-right items-center font-mono font-bold">{points}</div>
          <PointsUpdateDialog 
            points={row.original.points} 
            team_id={row.original.team_id} 
            team_name={row.original.team_name}
            onPointsUpdated={fetchTeamData} 
          />
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => {
      return (
        <div className="flex justify-center font-bold text-center">
          Actions
        </div>
      )
    },
    enableHiding: false,
    cell: ({ row }) => {
      const teamId = row.original.team_id;
      const teamName = row.original.team_name;
      return (
        <div className="flex items-center justify-center text-center gap-1.5">
          <TeamDetailsDialog
            team_id={String(teamId)}
            team_name={teamName}
            onTeamDeleted={fetchTeamData}
          />
          {!isPoc && (
            <TeamDeleteDialog
              team_id={teamId}
              team_name={teamName}
              onTeamDeleted={fetchTeamData}
            />
          )}
        </div> 
      )
    },
  },
]

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
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Teams..."
          value={(table.getColumn("team_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("team_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm uppercase mr-4"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <button className="mt-2 opacity-90 font-bold" onClick={downloadExcelFile} disabled={isDownloading}>
                {isDownloading ? 'Downloading...' : 'Export to Excel'}
      </button>
      <div className="flex items-center justify-end space-x-2 py-4">
      </div>
    </div>
  )
}
