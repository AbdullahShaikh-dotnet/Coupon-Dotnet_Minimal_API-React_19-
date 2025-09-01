import { useApiRequest, HttpMethod } from '../Utility/useApi';

export function useAuth() {
    // Validate Token
    const validateToken = useApiRequest<boolean>(
        `/api/validatetoken`,
        HttpMethod.POST,
        null,
        { enabled: false } // You can control when to trigger it
    );

    // Refresh Token
    const refreshToken = (token: string, refreshToken: string) =>
        useApiRequest<{ token: string; refreshToken: string }>(
            `/api/auth/refresh`,
            HttpMethod.POST,
            { token, refreshToken },
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

    const login = (username: string, password: string) =>
        useApiRequest<ResponseType>(
            `/api/login`,
            HttpMethod.POST,
            { username, password },
            { enabled: false }
        );

    return { validateToken, refreshToken, login };
}
