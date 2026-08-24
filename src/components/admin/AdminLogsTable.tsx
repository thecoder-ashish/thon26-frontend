import * as React from "react";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  RefreshCw,
  Clock,
  User,
  Trophy,
  PlusCircle,
  Edit3,
  Trash2,
  Sliders,
  X,
  FileText,
  UserMinus,
} from "lucide-react";
import { getBackendUrl } from "@/lib/api";
import { useAuth } from "@/components/auth/auth";

export type AuditLog = {
  log_id: number;
  action_type: string;
  action_title: string;
  admin_username: string;
  admin_role: string;
  details: any;
  created_at: string;
};

export function AdminLogsTable() {
  const { user } = useAuth();
  const [logs, setLogs] = React.useState<AuditLog[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "created_at", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  // Modal State for Log Details
  const [selectedLog, setSelectedLog] = React.useState<AuditLog | null>(null);
  const [showModal, setShowModal] = React.useState(false);

  const fetchLogs = () => {
    setIsLoading(true);
    const backendUrl = getBackendUrl();
    const token =
      user?.token ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("accessToken");

    axios
      .get(`${backendUrl}/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLogs(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching audit logs:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    fetchLogs();
  }, [user]);

  const formatTimestamp = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const getActionBadge = (type: string) => {
    switch (type) {
      case "EVENT_SCORE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Trophy className="h-3 w-3 shrink-0" />
            EVENT SCORE
          </span>
        );
      case "POINTS_UPDATE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            <Sliders className="h-3 w-3 shrink-0" />
            POINTS EDIT
          </span>
        );
      case "TEAM_DELETE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
            <UserMinus className="h-3 w-3 shrink-0" />
            TEAM DELETE
          </span>
        );
      case "EVENT_CREATE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/30">
            <PlusCircle className="h-3 w-3 shrink-0" />
            EVENT CREATE
          </span>
        );
      case "EVENT_UPDATE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            <Edit3 className="h-3 w-3 shrink-0" />
            EVENT EDIT
          </span>
        );
      case "EVENT_DELETE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
            <Trash2 className="h-3 w-3 shrink-0" />
            EVENT DELETE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-muted text-foreground border">
            <FileText className="h-3 w-3 shrink-0" />
            {type}
          </span>
        );
    }
  };

  const handleRowClick = (log: AuditLog) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "created_at",
      header: () => <div className="font-bold font-raleway text-left">Time</div>,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground whitespace-nowrap">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {formatTimestamp(row.getValue("created_at"))}
          </div>
        );
      },
    },
    {
      accessorKey: "admin_username",
      header: () => <div className="font-bold font-raleway text-left">Admin / POC</div>,
      cell: ({ row }) => {
        const username = row.original.admin_username || "system";
        const role = row.original.admin_role || "admin";
        return (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-muted border flex items-center justify-center text-foreground font-bold shrink-0">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs font-raleway text-foreground leading-tight">
                {username}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">
                {role}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "action_type",
      header: () => <div className="font-bold font-raleway text-left">Type</div>,
      cell: ({ row }) => getActionBadge(row.getValue("action_type")),
    },
    {
      accessorKey: "action_title",
      header: () => <div className="font-bold font-raleway text-left">Action Summary</div>,
      cell: ({ row }) => {
        const log = row.original;
        return (
          <div
            onClick={() => handleRowClick(log)}
            className="font-extrabold font-raleway text-xs sm:text-sm text-foreground hover:underline hover:text-primary transition-colors cursor-pointer line-clamp-1"
          >
            {log.action_title}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right font-bold font-raleway">Details</div>,
      cell: ({ row }) => {
        const log = row.original;
        return (
          <div className="text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRowClick(log)}
              className="text-xs font-bold font-raleway h-8 px-3"
            >
              View
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: logs,
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

  // Render Log Details in Modal
  const renderLogDetails = (log: AuditLog) => {
    const details =
      typeof log.details === "string" ? JSON.parse(log.details) : log.details || {};

    switch (log.action_type) {
      case "TEAM_DELETE":
        return (
          <div className="space-y-4">
            <div className="rounded-2xl border p-4 bg-red-500/10 border-red-500/30 space-y-1.5">
              <span className="text-[10px] font-black tracking-wider text-red-600 dark:text-red-400 uppercase block">
                Deleted Team
              </span>
              <div className="flex justify-between items-center">
                <p className="font-extrabold font-raleway text-foreground text-base">
                  {details.deleted_team?.team_name || "Unknown Team"}
                </p>
                <p className="text-xs font-mono text-muted-foreground">
                  ID: #{details.deleted_team?.team_id}
                </p>
              </div>
            </div>

            {details.deleted_members && details.deleted_members.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-black tracking-wider text-muted-foreground uppercase block">
                  Deleted Roster ({details.deleted_members.length} Members)
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {details.deleted_members.map((m: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2.5 rounded-xl border bg-muted/20 text-xs"
                    >
                      <span className="font-bold font-raleway">{m.member_name}</span>
                      <span className="text-muted-foreground font-mono text-[11px]">
                        {m.roll_no || ""} {m.phone_number ? `• ${m.phone_number}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "POINTS_UPDATE":
        return (
          <div className="space-y-4">
            <div className="rounded-2xl border p-4 bg-primary/5 space-y-2">
              <span className="text-[10px] font-black tracking-wider text-primary uppercase block">
                Team Details
              </span>
              <div className="flex justify-between items-center">
                <p className="font-extrabold font-raleway text-foreground text-base">
                  {details.team_name || "Unknown Team"}
                </p>
                <p className="text-xs font-mono text-muted-foreground">
                  ID: #{details.team_id}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border p-3 bg-card text-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase block">
                  Previous
                </span>
                <span className="font-mono text-lg font-bold text-foreground">
                  {details.previous_points ?? "-"}
                </span>
              </div>
              <div className="rounded-xl border p-3 bg-card text-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase block">
                  New Total
                </span>
                <span className="font-mono text-lg font-bold text-foreground">
                  {details.new_points ?? "-"}
                </span>
              </div>
              <div className="rounded-xl border p-3 bg-card text-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase block">
                  Difference
                </span>
                <span
                  className={`font-mono text-lg font-black ${
                    (details.difference || 0) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {(details.difference || 0) > 0 ? `+${details.difference}` : details.difference}
                </span>
              </div>
            </div>
          </div>
        );

      case "EVENT_SCORE":
        return (
          <div className="space-y-4">
            {details.event_name && (
              <div className="rounded-2xl border p-4 bg-amber-500/10 border-amber-500/30 space-y-1">
                <span className="text-[10px] font-black tracking-wider text-amber-600 dark:text-amber-400 uppercase block">
                  Event Scored
                </span>
                <p className="font-extrabold font-raleway text-foreground text-base">
                  {details.event_name}
                </p>
              </div>
            )}

            {/* Podium Winners */}
            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-wider text-muted-foreground uppercase block">
                Podium Winners
              </span>
              <div className="space-y-2">
                {details.first_place && (
                  <div className="flex justify-between items-center rounded-xl border border-amber-500/40 p-3 bg-amber-500/5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🥇</span>
                      <div>
                        <p className="font-bold font-raleway text-xs sm:text-sm">
                          {details.first_place.team_name}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground">
                          ID: #{details.first_place.team_id}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black font-mono text-amber-500">
                      +45 PTS
                    </span>
                  </div>
                )}

                {details.second_place && (
                  <div className="flex justify-between items-center rounded-xl border border-slate-400/40 p-3 bg-muted/20">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🥈</span>
                      <div>
                        <p className="font-bold font-raleway text-xs sm:text-sm">
                          {details.second_place.team_name}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground">
                          ID: #{details.second_place.team_id}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black font-mono text-slate-400">
                      +30 PTS
                    </span>
                  </div>
                )}

                {details.third_place && (
                  <div className="flex justify-between items-center rounded-xl border border-amber-700/40 p-3 bg-amber-700/5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🥉</span>
                      <div>
                        <p className="font-bold font-raleway text-xs sm:text-sm">
                          {details.third_place.team_name}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground">
                          ID: #{details.third_place.team_id}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black font-mono text-amber-700">
                      +15 PTS
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Participating Teams */}
            {details.participating_teams && details.participating_teams.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-black tracking-wider text-muted-foreground uppercase block">
                  All Participants ({details.participating_teams.length} Teams • +5 pts each)
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-xl border bg-muted/20">
                  {details.participating_teams.map((t: any, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg border bg-card text-[11px] font-bold font-raleway"
                    >
                      {t.team_name} <span className="text-muted-foreground font-mono text-[9px]">#{t.team_id}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "EVENT_CREATE":
      case "EVENT_UPDATE":
      case "EVENT_DELETE":
      default:
        return (
          <div className="space-y-3">
            <div className="rounded-2xl border p-4 bg-muted/20 space-y-2">
              <span className="text-[10px] font-black tracking-wider text-muted-foreground uppercase block">
                Payload Snapshot
              </span>
              <pre className="text-xs font-mono bg-background p-3 rounded-xl border overflow-x-auto max-h-60 text-muted-foreground">
                {JSON.stringify(details, null, 2)}
              </pre>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Search and Refresh Bar */}
      <div className="flex items-center justify-between gap-4 py-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search action, title, admin..."
            value={
              (table.getColumn("action_title")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("action_title")?.setFilterValue(event.target.value)
            }
            className="pl-9 text-sm font-raleway"
          />
        </div>

        <Button
          variant="outline"
          onClick={fetchLogs}
          className="text-xs font-bold font-raleway gap-2"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Logs
        </Button>
      </div>

      {/* Audit Logs Table */}
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
                  className="h-28 text-center text-muted-foreground text-sm font-raleway"
                >
                  {isLoading ? "Fetching audit logs..." : "No logs found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Log Detail Modal */}
      {showModal && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop Blur */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal Card */}
          <div className="relative w-full max-w-lg rounded-3xl border bg-card/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full border bg-background/80 hover:bg-background transition-all active:scale-95 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1.5 pb-4 border-b">
              <div className="flex justify-center pb-1">
                {getActionBadge(selectedLog.action_type)}
              </div>
              <h2 className="text-lg sm:text-xl font-black font-raleway tracking-tight text-foreground uppercase">
                {selectedLog.action_title}
              </h2>
              <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground font-medium pt-1">
                <span>By: <b className="text-foreground font-bold">{selectedLog.admin_username}</b> ({selectedLog.admin_role || "admin"})</span>
                <span>•</span>
                <span className="font-mono">{formatTimestamp(selectedLog.created_at)}</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="py-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {renderLogDetails(selectedLog)}
            </div>

            {/* Modal Footer */}
            <div className="pt-2">
              <Button
                onClick={() => setShowModal(false)}
                className="w-full py-5 text-sm font-bold tracking-wide shadow-md font-raleway"
              >
                Close Log
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLogsTable;
