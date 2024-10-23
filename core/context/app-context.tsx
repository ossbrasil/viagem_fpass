import React, {useMemo} from 'react';
import {useStorageState} from "@/hooks/useStorageState";
import {AuthResponse} from "@/core/interfaces/auth-session";
import {AuthAPI} from "@/common/services/app/auth";
import {HttpService} from "@/core/shared/http-service";

export interface AppContextValues {
    httpService: HttpService;
    authAPI: AuthAPI;
    session: AuthResponse;
    isLoading: boolean;
}

const defaultValue: AppContextValues = {
    session: {} as AuthResponse,
    httpService: {} as HttpService,
    authAPI: {} as AuthAPI,
    isLoading: false,
};
const AuthContext = React.createContext<AppContextValues>(defaultValue);

export const useApp = () => React.useContext(AuthContext);

const AppProvider = (props: React.PropsWithChildren) => {
    const [[isLoading, session], setSession] = useStorageState('session');
    const httpService = new HttpService(setSession);
    const authAPI = new AuthAPI(httpService);
    const value = useMemo<AppContextValues>(() => ({
        session: JSON.parse(session!),
        authAPI,
        httpService,
        isLoading,
    }), [session, isLoading]);
    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    );
}
export default AppProvider;

