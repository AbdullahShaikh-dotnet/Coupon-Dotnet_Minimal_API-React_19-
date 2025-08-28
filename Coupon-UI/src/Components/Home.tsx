import { useContext, useEffect, useState } from "react"
import UserContext from "../Utility/UserContext"
import { useCouponsGet, useCouponDelete } from "../Utility/useCoupons"
import { toast } from "sonner"
import useLoader from "@/Utility/useLoader"
import { Progress } from "@/Components/ui/progress"
import { Card, CardHeader, CardContent, CardFooter } from "@/Components/ui/card"
import { Label } from "@/Components/ui/label"
import { Input } from "@/Components/ui/input"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import {
    Ellipsis,
    Pencil,
    Trash,
    CirclePlus,
    Copy,
    Check,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu"
import { Link, useNavigate } from "react-router"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"

const ITEMS_PER_PAGE = 8

const Home = () => {
    const { user } = useContext(UserContext)
    const { data, error, isLoading, refetch } = useCouponsGet()
    const progress = useLoader(isLoading)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedCouponId, setSelectedCouponId] = useState(null)
    const [copiedCouponId, setCopiedCouponId] = useState<string | null>(null)
    const { DeleteCoupon, loading, error: deleteError, data: deleteResponse } = useCouponDelete()
    const navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const formatDate = (date: Date) => {
        const DATE = new Date(date)
        const formattedDate = DATE.toLocaleDateString("en-IN")
        return formattedDate
    }

    const filteredData =
        data?.filter((coupon) => {
            const matchesSearch =
                coupon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                coupon.couponCode.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && coupon.isActive) ||
                (statusFilter === "inactive" && !coupon.isActive)
            return matchesSearch && matchesStatus
        }) || []

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, statusFilter])

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
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-80 max-w-sm">
                    <Progress value={progress} className="w-full h-2" />
                </div>
                <p className="text-sm text-muted-foreground animate-pulse">Loading your coupons...</p>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="px-4 max-w-7xl mx-auto pt-15">
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
        <div className="min-h-screen px-4 max-w-7xl mx-auto space-y-6 pt-15">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
                    <p className="text-muted-foreground">Manage your discount codes and promotional offers</p>
                </div>
                <Button onClick={() => navigate("/main/coupon/new/0")} size="lg">
                    <CirclePlus className="w-4 h-4 mr-2" />
                    Create Coupon
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                            <span className="text-sm font-medium text-muted-foreground">Active Coupons</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">{data.filter((d) => d.isActive).length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                            <span className="text-sm font-medium text-muted-foreground">Inactive Coupons</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">{data.filter((d) => !d.isActive).length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                            <span className="text-sm font-medium text-muted-foreground">Total Coupons</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">{data.length}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search coupons..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[140px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="text-sm text-muted-foreground">
                    {filteredData.length} of {data.length} coupons
                </div>
            </div>

            {filteredData.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No coupons found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedData.map((d) => (
                            <Card key={d.id} className="group hover:shadow-lg transition-all duration-200 hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2 flex-1 min-w-0">
                                            <h3 className="font-semibold text-lg leading-tight truncate" title={d.name}>
                                                {d.name}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="text-xs font-medium">
                                                    {d.percentage}% OFF
                                                </Badge>
                                                <Badge variant={d.isActive ? "default" : "outline"} className="text-xs">
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
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/main/coupon/edit/${d.id}`} className="flex items-center gap-2 w-full">
                                                        <Pencil className="h-4 w-4" />
                                                        Edit
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
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Coupon Code
                                        </Label>
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

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between py-6">
                            <div className="text-sm text-muted-foreground">
                                Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} of{" "}
                                {filteredData.length} results
                            </div>

                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>

                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter((page) => {
                                            const distance = Math.abs(page - currentPage)
                                            return distance === 0 || distance === 1 || page === 1 || page === totalPages
                                        })
                                        .map((page, index, array) => {
                                            const showEllipsis = index > 0 && array[index - 1] !== page - 1
                                            return (
                                                <div key={page} className="flex items-center">
                                                    {showEllipsis && <span className="px-2 text-muted-foreground">...</span>}
                                                    <Button
                                                        variant={currentPage === page ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setCurrentPage(page)}
                                                        className="w-8 h-8 p-0"
                                                    >
                                                        {page}
                                                    </Button>
                                                </div>
                                            )
                                        })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

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
