import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router';
import { Pencil, Trash } from 'lucide-react';

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
    {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
            const id = row.original.id;
            return (
                <div className="flex justify-around">
                    <Link to={`/main/edit?id=${id}`}>
                        <Pencil className="h-4 w-4 cursor-pointer" />
                    </Link>
                    <Link to={`/main/delete?id=${id}`}>
                        <Trash className="h-4 w-4 cursor-pointer text-red-600" />
                    </Link>
                </div>
            );
        },
    }

]
