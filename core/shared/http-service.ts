import {AbstractHttpService, FetchQueryParams} from "@/core/shared/http-service-abstract";
import {AuthResponse} from "@/core/interfaces/auth-session";
import {BASE_URL} from "@/core/constants";
import * as SecureStore from "expo-secure-store";
import {ExceptionHandler} from "@/core/exceptions/exception-handler";
import {JWTException, SessionException} from "@/core/exceptions/exceptions";

export class HttpService extends AbstractHttpService {
    protected controller = new AbortController();
    protected signal = this.controller.signal;

    constructor(
        public readonly setSession: (value: (string | null)) => void,
        protected readonly customURL?: string,
    ) {super();}

    // Fetch resource and handle the response
    protected async fetchResource({
                                      options = {},
                                      auth = true,
                                      customAuthToken,
                                      params = new URLSearchParams(),
                                      subPaths = []
                                  }: FetchQueryParams): Promise<Response> {
        options.signal = this.signal;
        const headers = new Headers(options.headers ?? {'Content-Type': 'application/json'});
        const url = this.buildURL(params, subPaths);
        let session: AuthResponse | null;
        try {
            // Check if session isn't deleted and set Auth header
            if (auth) {
                session = await this.checkSessionItem();
                if (customAuthToken) headers.set(customAuthToken.name, customAuthToken.value);
                else headers.set('Authorization', 'Bearer ' + session.accessToken);
            }

            // Make FetchAPI request with 10s timeout to abort
            setTimeout(() => this.controller.abort(), 10000);
            const response = await fetch(url, {...options, headers});
            if (!response.ok) {
                switch (response.status) {
                    // handle Unauthenticated status
                    case 401:
                        console.log(url, response.status);
                        const authResponse = await this.handleJWTException(session!.refreshToken);
                        this.setSession(JSON.stringify(authResponse));
                        return await this.fetchResource({options, auth, customAuthToken, params, subPaths});

                    // Handle Internal Error status
                    case 500:
                        break;
                }
            }
            return response;
        } catch (e) {
            ExceptionHandler.handle(e);
            throw e;
        }
    }

    // Break the execution when session isn't found
    protected async checkSessionItem() {
        const session = await SecureStore.getItemAsync('session');
        if (!session) {
            this.setSession(null);
            throw new SessionException();
        }
        return JSON.parse(session) as AuthResponse;
    }

    // Normally used to Refresh JWT access token
    protected async handleJWTException(refreshToken: string): Promise<AuthResponse> {
        const response = await fetch(this.customURL ?? BASE_URL + '/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + refreshToken
            },
        });
        if (!response.ok) {
            this.setSession(null);
            throw new JWTException();
        }
        console.log(this.customURL ?? BASE_URL + '/auth/refresh', response.status);
        return await response.json() as AuthResponse;

    }

    // Handle the URL and URLSearchParams to build an urlencoded str
    protected buildURL(params: URLSearchParams, subPaths: string[]): URL {
        const url = new URL(this.customURL ?? BASE_URL);
        url.pathname = subPaths.join('/')
        url.search = params.toString();
        return url;
    }

    // GET request with HTTP wrapper
    async get(query: FetchQueryParams = {}): Promise<Response> {
        if (query.options) query.options.method = 'GET';
        else query.options = {method: 'GET'};

        return await this.fetchResource(query)
    }

    // POST request with HTTP wrapper
    async post(query: FetchQueryParams = {}): Promise<Response> {
        if (query.options) query.options.method = 'POST';
        else query.options = {method: 'POST'};
        return await this.fetchResource(query)
    }

    // PATCH request with HTTP wrapper
    async patch(query: FetchQueryParams = {}): Promise<Response> {
        if (query.options) query.options.method = 'PATCH';
        else query.options = {method: 'PATCH'};
        return await this.fetchResource(query)
    }


}