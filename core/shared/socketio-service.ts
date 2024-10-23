import {io, Socket} from "socket.io-client"
import {BASE_URL} from "@/core/constants";

export class SocketIoService {
    private static instance: SocketIoService; // Static instance property
    server: Socket | null = null;

    constructor() {
        this.server = io(BASE_URL, {
            transports: ["websocket"],
            autoConnect: false
        });
    }

    // Static method to get the single instance
    public static getInstance(): SocketIoService {
        if (!SocketIoService.instance) {
            SocketIoService.instance = new SocketIoService();
        }
        return SocketIoService.instance;
    }

    updateAuth(auth: string) {
        this.server!.auth = {token: `Bearer ${auth}`};
    }

    connect(auth: string, setIsConnected: (connected: boolean) => void) {
        this.updateAuth(auth);
        try {
            this.server!.connect();
            this.server!.on("connect", () => {
                setIsConnected(true);
                console.log("Socket connected");
            });
            this.server!.on("connect_error", async (err) => {
                console.log(`Socket error connecting due to ${err.message}`);
            });

            // Listen for disconnection
            this.server!.on("disconnect", (reason) => {
                setIsConnected(false);
                console.log("Socket disconnected:", reason);
            });
        } catch (e) {
            console.log('WS ERR:', e)
        }
    }
}

const instance = new SocketIoService();
export default instance;