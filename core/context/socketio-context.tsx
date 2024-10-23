import {Socket} from "socket.io-client";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {SocketIoService} from "@/core/shared/socketio-service";
import {AppState} from 'react-native';
import {useApp} from "@/core/context/app-context";

export interface SocketIoContextValues {
    server: Socket;
}

const initialValues: SocketIoContextValues = {
    server: {} as Socket
}

const SocketIoContext = React.createContext<SocketIoContextValues>(initialValues);
export const useSocket = () => React.useContext(SocketIoContext);
export const SocketIoProvider: React.FC<React.PropsWithChildren> = ({children}) => {
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const {session} = useApp();
    const [isConnected, setIsConnected] = useState(false);
    const socketIoServer = SocketIoService.getInstance();
    const value = useMemo(() => ({server: socketIoServer.server!}), [socketIoServer.server])
    // useEffect(() => {
    //     if (!isConnected && session) {
    //         socketIoServer.connect(session.accessToken, setIsConnected);
    //         socketIoServer.server?.on('ping', (callback) => {callback('PONG');});
    //
    //     }
    // }, [session]);
    return (
        <SocketIoContext.Provider value={value}>
            {children}
        </SocketIoContext.Provider>
    )
}