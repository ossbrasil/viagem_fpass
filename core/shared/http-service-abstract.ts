import {AuthResponse} from "@/core/interfaces/auth-session";

export interface FetchQueryParams {
    options?: RequestInit;
    auth?: boolean;
    customAuthToken?: { name: string, value: string };
    params?: URLSearchParams;
    subPaths?: string[];
}

// Default HTTP wrapper to HTTP services
export abstract class AbstractHttpService {
    protected abstract controller: AbortController;
    protected abstract signal: AbortSignal;

    // Fetch resource and handle the response
    protected abstract fetchResource(query: FetchQueryParams): Promise<Response>;

    // Handle the URL and URLSearchParams to build an urlencoded str
    protected abstract buildURL(params?: URLSearchParams, subPaths?: string[]): URL;

    // Break the execution when session isn't found
    protected abstract checkSessionItem(): Promise<AuthResponse | null>;

    // GET request with HTTP wrapper
    abstract get(query?: FetchQueryParams): Promise<Response>;

    // POST request with HTTP wrapper
    abstract post(query?: FetchQueryParams): Promise<Response>;

    // PATCH request with HTTP wrapper
    abstract patch(query?: FetchQueryParams): Promise<Response>;
}