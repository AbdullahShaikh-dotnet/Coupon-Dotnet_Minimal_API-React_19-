import { useContext, useEffect, useState, useCallback } from 'react';
import UserContext from '../Utility/UserContext';

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function useApiRequest<T>(
    url: string,
    method: HttpMethod,
    value: unknown = null,
    options?: {
        retryPolicy?: number;
        autoRefresh?: boolean;
        refreshInterval?: number; // in ms
        enabled?: boolean; // toggle request
    }
) {
    const { token, refreshToken } = useContext(UserContext);
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const {
        retryPolicy = 3,
        autoRefresh = false,
        refreshInterval = 10000,
        enabled = true
    } = options || {};

    const fetchData = useCallback(
        async (overrideBody?: unknown) => {
            if (!enabled) return;

            setLoading(true);
            setError(null);

            let attempts = 0;

            while (attempts < retryPolicy) {
                try {
                    const headers: Record<string, string> = {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    };

                    if (token) {
                        headers["Authorization"] = `Bearer ${token}`;
                    }

                    const res = await fetch(url, {
                        method,
                        headers,
                        body:
                            method !== HttpMethod.GET && (overrideBody ?? value) !== null
                                ? JSON.stringify(overrideBody ?? value)
                                : undefined,
                    });

                    const response = await res.json();

                    if (!response.success) {
                        throw new Error(response.errors?.join(", ") || "Unknown error");
                    }

                    setData(response.data as T);
                    setLoading(false);
                    return;
                } catch (err: any) {
                    attempts++;
                    if (attempts >= retryPolicy) {
                        setError(`API call failed after ${retryPolicy} attempts: ${err.message}`);
                        setLoading(false);
                        return;
                    }
                    await sleep(1000 * attempts);
                }
            }
        },
        [url, method, value, token, retryPolicy, enabled]
    );


    useEffect(() => {
        fetchData();

        if (autoRefresh) {
            const interval = setInterval(fetchData, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [fetchData, autoRefresh, refreshInterval]);

    return { data, error, loading, refetch: fetchData };
}
