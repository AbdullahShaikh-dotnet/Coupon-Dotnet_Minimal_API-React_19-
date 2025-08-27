import { useContext, useEffect, useState } from "react";
import UserContext from "../Utility/UserContext";
import { useCouponsGet, useCouponDelete } from "../Utility/useCoupons";
import { toast } from "sonner";
import useLoader from "@/Utility/useLoader";
import { Progress } from "@/Components/ui/progress";
import { Card, CardHeader, CardContent, CardFooter } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Ellipsis, Pencil, Trash, CirclePlus, Copy, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

const Home = () => {
    const { user } = useContext(UserContext)
    const { data, error, isLoading, refetch } = useCouponsGet()
    const progress = useLoader(isLoading)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedCouponId, setSelectedCouponId] = useState(null)
    const [copiedCouponId, setCopiedCouponId] = useState<string | null>(null)
    const { DeleteCoupon, loading, error: deleteError, data: deleteResponse } = useCouponDelete()
    const navigate = useNavigate()

    const formatDate = (date: Date) => {
        const DATE = new Date(date)
        const formattedDate = DATE.toLocaleDateString("en-IN")
        return formattedDate
    }

    useEffect(() => {
        if (error) {
            toast.error("Error", {
                duration: 5000,
                dismissible: true,
                description: error.message,
            })
        }
    }, [error])

    const handleCopy = async (couponCode: string, couponId: string) => {
        try {
            await navigator.clipboard.writeText(couponCode)
            setCopiedCouponId(couponId)
            toast.success("Coupon code copied!", {
                duration: 2000,
                description: `${couponCode} copied to clipboard`,
            })

            // Reset copied state after 2 seconds
            setTimeout(() => setCopiedCouponId(null), 2000)
        } catch (err) {
            toast.error("Failed to copy coupon code")
        }
    }

    const handleDelete = async () => {
        const promise = DeleteCoupon(Number(selectedCouponId), user.token.toString())

        toast.promise(promise, {
            loading: "Deleting coupon...",
            success: () => "Coupon deleted successfully!",
            error: (err) => err.message || "Failed to delete coupon.",
        })

        try {
            await promise
            await refetch()
            setDeleteDialogOpen(false)
            setSelectedCouponId(null)
        } catch { }
    }

    if (isLoading) {
        return (
            <div className="pt-30 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-80 max-w-sm">
                    <Progress value={progress} className="w-full h-2" />
                </div>
                <p className="text-sm text-muted-foreground animate-pulse">Loading your coupons...</p>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="pt-30 px-4 max-w-7xl mx-auto">
                <div className="text-center py-16">
                    <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                        <CirclePlus className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">No coupons yet</h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        Get started by creating your first coupon. Offer discounts and boost your sales.
                    </p>
                    <Button onClick={() => navigate("/main/coupon/new/0")} size="lg">
                        <CirclePlus className="w-4 h-4 mr-2" />
                        Create Your First Coupon
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="pt-30 px-4 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
                    <p className="text-muted-foreground">Manage your discount codes and promotional offers</p>
                </div>
                <Button variant="outline" onClick={() => navigate("/main/coupon/new/0")} size="lg" className="w-fit">
                    <CirclePlus className="w-4 h-4 mr-2" />
                    Add New Coupon
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Card className="p-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Active Coupons</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{data.filter((d) => d.isActive).length}</p>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium">Inactive Coupons</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{data.filter((d) => !d.isActive).length}</p>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">Total Coupons</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{data.length}</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {data.map((d) => (
                    <Card
                        key={d.id}
                        className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm hover:shadow-md"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1 flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg leading-tight truncate" title={d.name}>
                                        {d.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs font-medium">
                                            {d.percentage}% OFF
                                        </Badge>
                                        <Badge variant={d.isActive ? "secondary" : "destructive"} className="text-xs">
                                            {d.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Ellipsis className="h-4 w-4" />
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuItem asChild>
                                            <Link to={`/main/coupon/edit/${d.id}`} className="flex items-center gap-2 w-full">
                                                <Pencil className="h-4 w-4" />
                                                Edit Coupon
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                                            onClick={() => {
                                                setSelectedCouponId(d.id)
                                                setDeleteDialogOpen(true)
                                            }}
                                        >
                                            <Trash className="h-4 w-4" />
                                            Delete Coupon
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Coupon Code</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={d.couponCode}
                                        readOnly
                                        className="font-mono text-sm bg-muted/50 border-0 focus-visible:ring-1"
                                    />
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleCopy(d.couponCode, d.id)}
                                        className="shrink-0"
                                    >
                                        {copiedCouponId === d.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                        <span className="sr-only">Copy coupon code</span>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="pt-0">
                            <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                                <span>Expires: {formatDate(d.createDate)}</span>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <p>Are you sure you want to delete this coupon? This action cannot be undone.</p>
                            <p className="text-sm text-muted-foreground">
                                The coupon will be permanently removed and customers will no longer be able to use it.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                                {loading ? "Deleting..." : "Delete Coupon"}
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Home
