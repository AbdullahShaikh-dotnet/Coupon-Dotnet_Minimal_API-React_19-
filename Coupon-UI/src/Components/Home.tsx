import { useContext, useEffect, useState } from "react";
import UserContext from "../Utility/UserContext";
import { useCouponsData } from "../Utility/useCouponsData";
import { columns } from "@/Components/Coupons-Datatable/CouponsColumns";
import { CouponsDataTable } from "@/Components/Coupons-Datatable/CouponsDatatable";
import { toast } from "sonner";
import useLoader from "@/Utility/useLoader";
import { Progress } from "@/components/ui/progress";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
    CardDescription
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { Badge } from "@/Components/ui/badge"
import { Button } from '@/components/ui/button';
import { Ellipsis, Pencil, Trash, LayoutGrid, TableProperties } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/Components/ui/dropdown-menu"
import { Link } from 'react-router';


const Home = () => {
    const { user } = useContext(UserContext);
    const { data, error, isLoading } = useCouponsData();
    const progress = useLoader(isLoading);
    const [isCardViewVisible, setCardViewVisible] = useState(true);

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
                        <div className="flex justify-between">
                            <div>
                                <Label className="text-3xl font-bold mb-1">
                                    Coupons
                                </Label>
                                <Label className="text-sm text-muted-foreground">
                                    Here are your latest coupons and offers.
                                </Label>
                            </div>
                            <div className="gap-2 flex">
                                <Button variant="outline" title={!isCardViewVisible ? "Card View" : "Grid View"} onClick={() => { setCardViewVisible(!isCardViewVisible) }}>
                                    {
                                        !isCardViewVisible ? <LayoutGrid /> : <TableProperties />
                                    }
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div id="cardLayout" className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${!isCardViewVisible ? "hidden" : ""}`}>
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
                                                <DropdownMenuContent align="start">
                                                    <DropdownMenuItem>
                                                        <Link to={`/main/coupon/edit/${d.id}`} className="flex gap-6">
                                                            <Pencil className="h-4 w-4 cursor-pointer" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Link to={`/main/delete/${d.id}`} className="flex gap-6">
                                                            <Trash className="h-4 w-4 cursor-pointer text-red-600" />
                                                            Delete
                                                        </Link>
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
                        <div className={`mt-6 ${isCardViewVisible ? "hidden" : ""}`} id="gridLayout">
                            <CouponsDataTable data={data} columns={columns} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
};

export default Home;
