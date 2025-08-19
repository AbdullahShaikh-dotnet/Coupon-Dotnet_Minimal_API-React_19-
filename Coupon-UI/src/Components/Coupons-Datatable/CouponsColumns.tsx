import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export type TCoupon = Readonly<{
  id: number
  name: string
  couponCode: string
  percentage: number
  expireDate: Date
  createDate: Date
  isActive: boolean
}>

export const columns: ColumnDef<TCoupon>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "name",
    header: "Coupon Name",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "couponCode",
    header: "Coupon Code",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "percentage",
    header: "Percentage",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "expireDate",
    header: "Expiry Date",
    enableSorting: true,
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
  },
  {
    accessorKey: "createDate",
    header: "Create Date",
    enableSorting: true,
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
  },
  {
    accessorKey: "isActive",
    header: "IsActive?",
    enableSorting: false,
    cell: ({ getValue }) => (
      <Checkbox checked={getValue() as boolean} />
    ),
  },
]
