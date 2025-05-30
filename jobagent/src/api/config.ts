import { getTokenFromProvider } from './tokenProvider';

export const API_BASE_URL = import.meta.env.VITE_API_URL;

interface FetchOptions extends RequestInit {
    public?: boolean;
}

export class ErrorResponse extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { public: isPublic, ...fetchOptions } = options;

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    if (!isPublic) {
        const token = await getTokenFromProvider();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ErrorResponse(
            errorData.message || `Error ${response.status}: ${response.statusText}`,
            response.status
        );
    }

    return response.json();
}

export async function fetchApiWithFile<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { public: isPublic, ...fetchOptions } = options;

    const headers = new Headers(options.headers);

    if (!isPublic) {
        const token = await getTokenFromProvider();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    }


    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
}
