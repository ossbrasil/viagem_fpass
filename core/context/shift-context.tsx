import {IShiftApi, ShiftApi} from "@/common/services/app/shifts/shift-api";
import {Shift} from "@/common/services/app/shifts/dto/shift.object";
import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import {useApp} from "@/core/context/app-context";

export interface ShiftContextValues {
    shiftAPI: IShiftApi;
    shift: Shift | null;
    setShift: Dispatch<SetStateAction<Shift | null>>
}

const defaultValue: ShiftContextValues = {
    shiftAPI: {} as ShiftApi,
    shift: null,
    setShift: () => {}
}

const ShiftContext = createContext<ShiftContextValues>(defaultValue);
export const useShift = () => useContext(ShiftContext);

export const ShiftProvider: FC<PropsWithChildren> = ({children}) => {
    const {session, httpService} = useApp();
    const shiftAPI = new ShiftApi(httpService);
    const [shift, setShift] = useState<Shift | null>(null);
    useEffect(() => {
        shiftAPI.getActiveShift({limit: 1})
            .then((shift) => {
                console.log(shift);
                if (shift && !shift.endTime) {
                    setShift(shift)
                }
            })
    }, []);
    const value: ShiftContextValues = useMemo(() => ({
        shift,
        shiftAPI,
        setShift
    }), [shift])
    return (
        <ShiftContext.Provider value={value}>
            {children}
        </ShiftContext.Provider>
    );
}