import { useContext, useEffect, useState } from "react";
import UserContext from "../Utility/UserContext";
import { useCouponsGet, useCouponDelete } from "../Utility/useCoupons";
import { toast } from "sonner";
import useLoader from "@/Utility/useLoader";
import { Progress } from "@/Components/ui/progress";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
    CardDescription
} from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from '@/Components/ui/input';
import { Badge } from "@/Components/ui/badge"
import { Button } from '@/Components/ui/button';
import { Ellipsis, Pencil, Trash, LayoutGrid, TableProperties } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/Components/ui/dropdown-menu"
import { Link } from 'react-router';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
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
    const { user } = useContext(UserContext);
    const { data, error, isLoading, refetch } = useCouponsGet();
    const progress = useLoader(isLoading);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCouponId, setSelectedCouponId] = useState(null);
    const { DeleteCoupon, loading, error: deleteError, data: deleteResponse } = useCouponDelete();

    const formatDate = (date: Date) => {
        const DATE = new Date(date);
        const formattedDate = DATE.toLocaleDateString('en-IN')
        return formattedDate;
    }

    useEffect(() => {
        if (error) {
            toast.error("Error", {
                duration: 5000,
                dismissible: true,
                description: error.message,
            });
        }
    }, [error]);


    const handleDelete = async () => {
        const promise = DeleteCoupon(Number(selectedCouponId), user.token.toString());

        toast.promise(promise, {
            loading: 'Deleting coupon...',
            success: () => 'Coupon deleted successfully!',
            error: (err) => err.message || 'Failed to delete coupon.',
        });

        try {
            await promise;
            await refetch();
            setDeleteDialogOpen(false);
            setSelectedCouponId(null);
        } catch { }
    };



    return isLoading ?
        (<div className="flex items-center justify-center w-screen h-screen bg-white">
            <div className="w-64">
                <Progress value={progress} className="w-full" />
            </div>
        </div>) :
        (
            <div className="pt-30 px-4 max-w-7xl mx-auto">
                <Card>
                    <CardHeader>
                        <Label className="text-3xl font-bold mb-1">
                            Coupons
                        </Label>
                        <Label className="text-sm text-muted-foreground">
                            Here are your latest coupons and offers.
                        </Label>
                    </CardHeader>

                    <CardContent>
                        <div id="cardLayout" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {data.map((d) => (
                                <Card key={d.id} className="shadow-sm hover:shadow-md transition-all">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex justify-between items-start">
                                            <div>
                                                <Label htmlFor={d.id} className="text-base font-semibold">
                                                    {d.name}
                                                </Label>
                                                <CardDescription className="text-xs">
                                                    {d.percentage}% OFF
                                                </CardDescription>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        className="p-0 w-8 h-8 border-none shadow-none hover:bg-muted"
                                                        variant="outline"
                                                        size="icon"
                                                    >
                                                        <Ellipsis />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="center">
                                                    <DropdownMenuItem>
                                                        <Link to={`/main/coupon/edit/${d.id}`} className="flex gap-6">
                                                            <Pencil className="h-4 w-4 cursor-pointer" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem variant="destructive"
                                                        className="flex gap-6 cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedCouponId(d.id);
                                                            setDeleteDialogOpen(true);
                                                        }}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id={d.id}
                                                value={d.couponCode}
                                                readOnly
                                                className="font-mono text-sm"
                                            />
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(d.couponCode);
                                                    toast("Copied", { closeButton: false, duration: 1000 });
                                                }}
                                            >
                                                Copy
                                            </Button>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-2">
                                        <div className="flex justify-between w-full items-center text-xs">
                                            <Label className="text-muted-foreground">
                                                Expiry: {formatDate(d.createDate)}
                                            </Label>
                                            <Badge variant={d.isActive ? "secondary" : "destructive"}>
                                                {d.isActive ? "Active" : "In-Active"}
                                            </Badge>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>


                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                coupon and remove it from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button
                                    variant="destructive"
                                    className="bg-red-600 text-white hover:bg-red-700"
                                    onClick={handleDelete}
                                >
                                    Yes, Delete
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        );
};

export default Home;
