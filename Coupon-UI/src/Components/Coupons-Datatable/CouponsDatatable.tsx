import React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getGroupedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { ChevronUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// ---------- Export helpers ----------
function downloadFile({ data, fileName, fileType }: { data: string | Blob; fileName: string; fileType: string }) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: fileType })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(url)
}

function exportToPDF<T extends object>(data: T[], fileName: string) {
  if (!data.length) return
  const doc = new jsPDF()
  const headers: string[] = Object.keys(data[0]) as string[]
  const rows: any[][] = data.map(row => Object.values(row))
  autoTable(doc, { head: [headers], body: rows })
  doc.save(fileName)
}

function exportToCSV<T extends object>(data: T[], fileName: string) {
  if (!data.length) return
  const headers = Object.keys(data[0]).join(",")
  const rows = data.map(row => Object.values(row).join(","))
  const csv = [headers, ...rows].join("\n")
  downloadFile({ data: csv, fileName, fileType: "text/csv" })
}

function exportToJSON<T extends object>(data: T[], fileName: string) {
  const json = JSON.stringify(data, null, 2)
  downloadFile({ data: json, fileName, fileType: "application/json" })
}

function exportToExcel<T extends object>(data: T[], fileName: string) {
  if (!data.length) return
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
  XLSX.writeFile(workbook, fileName)
}

// ---------- Main Table ----------
type DataTableProps<TData extends object, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function CouponsDataTable<TData extends object, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [grouping, setGrouping] = React.useState<string[]>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      grouping,
    },
    onGlobalFilterChange: setGlobalFilter,
    onGroupingChange: setGrouping,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
  })

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center py-2 justify-between">
        {/* Global search */}
        <Input
          placeholder="Search all columns..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        {/* Export + Group dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2 flex items-center gap-2">
              <MoreHorizontal className="h-4 w-4" />
              Options
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Grouping options */}
            <DropdownMenuItem onClick={() => table.setGrouping(["isActive"])}>
              Group by Active Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => table.setGrouping([])}>
              Clear Grouping
            </DropdownMenuItem>

            <div className="border-t my-1" />

            {/* Export options */}
            <DropdownMenuItem onClick={() => {
              const visibleData = table.getFilteredRowModel().rows.map(r => r.original)
              exportToCSV(visibleData, "coupons.csv")
            }}>
              Export as CSV
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => {
              const visibleData = table.getFilteredRowModel().rows.map(r => r.original)
              exportToJSON(visibleData, "coupons.json")
            }}>
              Export as JSON
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => {
              const visibleData = table.getFilteredRowModel().rows.map(r => r.original)
              exportToExcel(visibleData, "coupons.xlsx")
            }}>
              Export as Excel
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => {
              const visibleData = table.getFilteredRowModel().rows.map(r => r.original)
              exportToPDF(visibleData, "coupons.pdf")
            }}>
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Data table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder ? null : (
                      <Button
                        variant="ghost"
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center justify-center gap-2 mx-auto"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === "asc" ? (
                            <ChevronUp className="h-4 w-4 rotate-180" />
                          ) : (
                            <ChevronUp className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronUp className="h-4 w-4 opacity-30" />
                        )}
                      </Button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {cell.getIsGrouped() ? (
                        <>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}{" "}
                          ({row.subRows.length})
                        </>
                      ) : cell.getIsAggregated() ? (
                        flexRender(
                          cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end space-x-2 py-4">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default CouponsDataTable
export type { TCoupon } from "./CouponsColumns"
