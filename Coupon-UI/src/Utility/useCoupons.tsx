import { useEffect, useState } from "react";

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

export function useCouponsData() {
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
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
        };

        fetchData();
    }, []);

    return { data, error, isLoading };
}

export function useCouponsDataByID(id: number) {
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
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
        };

        fetchData();
    }, []);

    return { data, error, isLoading };
}


export function useCouponPut() {
    const updateCoupon = async (coupon: UpdateCoupon, token: string) => {
        console.log(coupon)
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
