import useForm, {FormErrors, UseFormHook} from "@/hooks/useForm";
import {CreateRideDto, Ride} from "@/core/interfaces/ride";
import {createContext, FC, PropsWithChildren, useContext} from "react";
import {useNavigation} from "expo-router";
import {NavigationProp} from "@/app/(app)/_layout";
import {RideAPI} from "@/common/services/app/rides/ride-api";
import {useApp} from "@/core/context/app-context";
import {HttpService} from "@/core/shared/http-service";
import {useShift} from "@/core/context/shift-context";

export interface NewRideCtxValues {
    form: UseFormHook<CreateRideDto | Ride>;
    rideAPI: RideAPI,
}

const defaultValues: NewRideCtxValues = {
    form: {} as UseFormHook<CreateRideDto | Ride>,
    rideAPI: new RideAPI({} as HttpService),
}
const newRideCtx = createContext<NewRideCtxValues>(defaultValues);
export const useNewRide = () => useContext(newRideCtx);
const initialValues: CreateRideDto = {
    expectedDepartureTime: new Date().getTime(),
    category: 'Remoção',
    addresses: [],
    employeeId: 0,
    expectedFinishTime: 0,
    polyline: [],
    distance: 0,
    shiftId: 0,
};

export const NewRideProvider: FC<PropsWithChildren> = ({children}) => {
    const {httpService} = useApp();
    const {shift} = useShift()
    const rideAPI = new RideAPI(httpService);
    const navigation = useNavigation<NavigationProp>();
    const validate = (values: CreateRideDto) => {
        let errors: FormErrors<CreateRideDto> = {};
        if (!values.expectedDepartureTime) {
            errors.expectedDepartureTime = "Horario de Partida é obrigatório";
        }
        if (!values.category) {
            errors.category = "Categoria é obrigatório";
        }
        if (!values.addresses || values.addresses.length < 2) {
            errors.addresses = "Ao menos 2 endereços são necessarios"
        }
        return errors
    }
    const onSubmit = async (values: CreateRideDto) => {
        delete values.employee;
        const res = await rideAPI.createRide({...values, shiftId: shift!.id});
        if (res.ok) {
            navigation.navigate('index');
            form.setValues(initialValues)
        }
    }
    const form = useForm<CreateRideDto | Ride>({
        validate,
        onSubmit,
        initialValues,
    });


    const value: NewRideCtxValues = {
        form,
        rideAPI,
    }
    return (
        <newRideCtx.Provider value={value}>
            {children}
        </newRideCtx.Provider>
    )
}