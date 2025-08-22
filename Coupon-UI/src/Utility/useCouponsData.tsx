import { useEffect, useState } from "react";

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
