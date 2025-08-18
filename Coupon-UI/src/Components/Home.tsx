import React, { useContext, useState, useEffect } from "react";
import UserContext from "../Utility/UserContext";
import useCouponsData from "../Utility/useCouponsData";
import { columns } from "@/Components/Coupons-Datatable/CouponsColumns";
import { CouponsDataTable } from "@/Components/Coupons-Datatable/CouponsDatatable";
import { toast } from "sonner";

const Home = () => {
    const { user } = useContext(UserContext);
    const { data, error, isLoading } = useCouponsData();

    useEffect(() => {
        if (error) {
            toast.error("Error", {
                duration: 5000,
                dismissible: true,
                description: error.message,
            });
        }
    }, [error]);

    return (
        <div className="pt-25 px-4 max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">
                        Coupons
                    </h1>
                    <p className="text-muted-foreground">
                        Here are your latest coupons and offers.
                    </p>
                </div>
            </div>
            <div className="bg-card rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4"></h2>
                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></span>
                        <span className="ml-3 text-muted-foreground">
                            Loading coupons...
                        </span>
                    </div>
                ) : (
                    <CouponsDataTable data={data} columns={columns} />
                )}
            </div>
        </div>
    );
};

export default Home;
