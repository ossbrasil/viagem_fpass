import {AccessLevel} from "@/core/enums/access-level";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: SessionUser;

}
export interface SessionUser {
    id: number;
    name: string;
    email: string;
    accessLevel: AccessLevel,
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}