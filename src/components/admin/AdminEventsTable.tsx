"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";

// import { LucideMoreHorizontal } from "lucide-react";
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
import { EventDeleteDialogBox } from "./Event/EventDelete";
import { EventsEditForm } from "./Event/EventEdit";
import { getBackendUrl } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
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

import TimeComponent from "./Event/EditTimeFormat";

export function AdminEventsTable() {
  // State to hold the events data
  const [eventsData, setEventsData] = useState<any[]>([]);
  // Fetch events data function
  const fetchEventsData = () => {
    const backendUrl = getBackendUrl();
    axios
      .get(`${backendUrl}/events`)
      .then((response) => {
        const sortedData = [...response.data].sort(
          (a, b) => a.day_number - b.day_number
        );
        setEventsData(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  };

  // Fetch data using Axios when the component mounts
  React.useEffect(fetchEventsData, []); // calling fetchEventsData directly in useEffect

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "event_name",
      header: ({ column }) => (
        <Button
          className="w-full text-right"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Event Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="uppercase text-center">
          {row.getValue("event_name")}
        </div>
      ),
    },
    {
      accessorKey: "society_name",
      header: "Society Name",

      cell: ({ row }) => (
        <div className=" w-full text-left">{row.getValue("society_name")}</div>
      ),
    },
    {
      accessorKey: "day_number",
      header: "Day Number",
      cell: ({ row }) => (
        <div className="text-center -mr-10  -ml-20  ">
          {row.getValue("day_number")}
        </div>
      ),
    },
    {
      accessorKey: "venue",
      header: "Venue",
      cell: ({ row }) => (
        <div className="text-center md:-ml-10 ">{row.getValue("venue")}</div>
      ),
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => (
        <div className="flex  items-center  justify-center ">
          <TimeComponent timeValue={row.getValue("time")} />
        </div>
      ),
    },

    {
      accessorKey: "event_id",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 justify-center">
          <EventsEditForm
            eventData={row.original}
            onEventUpdated={fetchEventsData}
          />
          <EventDeleteDialogBox
            onEventDelete={fetchEventsData}
            eventId={row.getValue("event_id")}
          />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: eventsData, // Use the fetched events data here instead of the hard-coded data
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
    <div className="w-full">
      {/* <EventDeleteDialogBox/>  */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Events..."
          value={
            (table.getColumn("event_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("event_name")?.setFilterValue(event.target.value)
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
                );
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
      <div className="flex items-center justify-end space-x-2 py-4"></div>
    </div>
  );
}
