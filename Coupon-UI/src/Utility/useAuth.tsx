import { useApiRequest, HttpMethod } from '../Utility/useApi';

export function useAuth() {
    // Validate Token (disabled by default, call refetch manually)
    const validateToken = useApiRequest<boolean>(
        `/api/validatetoken`,
        HttpMethod.POST,
        null,
        { enabled: false }
    );

    // Login
    type ResponseType = {
        token: string;
        refreshToken: string;
        user: {
            id: number;
            userName: string;
            name: string;
            role: string;
        };
    };

    const login = useApiRequest<ResponseType>(
        `/api/login`,
        HttpMethod.POST,
        null,
        { enabled: false }
    );

    // Refresh Token (disabled by default too)
    const refresh = useApiRequest<{ token: string; refreshToken: string }>(
        `/api/auth/refresh`,
        HttpMethod.POST,
        {
            token: localStorage.getItem("token"),
            refreshToken: localStorage.getItem("refreshToken")
        },
        { enabled: true }
    );

    return { validateToken, login, refresh };
}
