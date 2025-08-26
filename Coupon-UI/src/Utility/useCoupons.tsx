import { useEffect, useState, useCallback } from "react";

export type UpdateCoupon = {
    id: number,
    name: string,
    percentage: number,
    expireDate: string | Date,
    isActive: boolean
}

export type AddCoupon = {
    name: string,
    percentage: number,
    expireDate: string | Date,
    isActive: boolean
}

export function useCouponsGet() {
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const res =
                (await fetch("/api/coupon")) || (await fetch("/API/coupon"));
            const GetCouponData = await res.json();

            if (!GetCouponData.isSuccess) {
                throw new Error(GetCouponData.errorMessages.join(", "));
            }

            setData(GetCouponData.result);
            setLoading(false);
        } catch (err: any) {
            setError(err || new Error("Something went wrong !!"));
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, error, isLoading, refetch: fetchData };
}

export function useCouponsGetByID(id: number) {
    if (id === 0) return;

    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const res =
                (await fetch(`/api/coupon/${id}`)) || (await fetch(`/API/coupon/${id}`));
            const GetCouponData = await res.json();

            if (!GetCouponData.isSuccess) {
                throw new Error(GetCouponData.errorMessages.join(", "));
            }

            setData(GetCouponData.result[0]);
            setLoading(false);
        } catch (err: any) {
            setError(err || new Error("Something went wrong !!"));
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    return { data, error, isLoading };
}


export function useCouponPut() {
    const updateCoupon = async (coupon: UpdateCoupon, token: string) => {
        try {
            const res = await fetch('/api/coupon', {
                method: 'PUT',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(coupon)
            })

            const response = await res.json();

            if (!response.isSuccess) {
                throw new Error(response.errorMessages.join(", "));
            }

            return response;
        } catch (error) {
            console.log(error)
            throw error;
        }
    };

    return { updateCoupon };
}


export function useCouponDelete() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const DeleteCoupon = useCallback(async (couponID: number, token: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/coupon${couponID}`, {
                method: "DELETE",
                headers: {
                    "accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const response = await res.json();

            if (!response.isSuccess) {
                throw new Error(response.errorMessages.join(", "));
            }

            setData(response);
            return response;
        } catch (err: any) {
            setError(err.message || "Something went wrong");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { DeleteCoupon, loading, error, data };
}

