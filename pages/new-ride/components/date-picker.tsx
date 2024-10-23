import React, {FC, Fragment, useState} from 'react';
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {useNewRide} from "@/pages/new-ride/new-ride-ctx";
import CustomInputField from "@/components/custom-input-field";
import Icon from "@/components/icon";
import {Alert, Pressable} from "react-native";

export interface DatePickerProps {
    date: Date;
}

const DatePicker: FC<DatePickerProps> = ({date}) => {
    const {form, rideAPI} = useNewRide();
    const {values, errors, handleChange} = form;
    const [mode, setMode] = useState<"date" | "time">('date');
    const [showDatetimePicker, setShowDatetimePicker] = useState(false);
    const setLimitHour = (hour: number, date: Date) => {
        date.setHours(hour);
        date.setMinutes(0);
        setShowDatetimePicker(false);
        Alert.alert('Horario limite', `Horario foi configurado como ${hour}h pois é o horario limite`);
        return date;
    }
    const formatDateTime = () => {
        if (form.values.expectedFinishTime) {
            return `${new Date(form.values.expectedDepartureTime).toLocaleString('pt-BR', {hourCycle: 'h24'}).slice(0, -3)} até ${new Date(form.values.expectedFinishTime).toLocaleString('pt-BR', {hourCycle: 'h24'}).split(' ')[1].slice(0, -3)}`
        } else if (form.values.expectedDepartureTime) {
            return new Date(form.values.expectedDepartureTime).toLocaleString('pt-BR', {hourCycle: 'h24'}).slice(0, -3)
        } else {
            return '';
        }
    }
    const changeDate = async (event: DateTimePickerEvent, date?: Date) => {
        if (event.type === "dismissed") {
            setShowDatetimePicker(false);
            if (mode !== 'date') {
                setMode('date');
            }
        } else if (event.type === "set" && date) {
            if (mode === "date") {
                setShowDatetimePicker(false);
                handleChange('expectedDepartureTime', date.getTime());
                setTimeout(() => {
                    setMode('time');
                    setShowDatetimePicker(true);
                }, 25);
            } else if (mode === "time") {
                const selectedHour = date.getHours();
                if (selectedHour > 22 || selectedHour < 7) {
                    date = setLimitHour(selectedHour > 22 ? 22 : 7, date)
                }
                setShowDatetimePicker(false);
                setMode('date');
                if (Object(values).hasOwnProperty('id')) {
                    const route = await rideAPI.getRoute(date.getTime(), values.addresses)
                    route!.addresses = route!.addresses.map((a, i) => ({...values.addresses[i], ...a}))
                    form.setValues(prevState => ({
                        ...prevState,
                        ...route
                    }));
                } else {
                    handleChange('expectedDepartureTime', date.getTime());
                }
            }
        }
    }

    return (
        <Fragment>
            <Pressable onPress={() => {setShowDatetimePicker(true);}}>
                <CustomInputField
                    name={"expectedDepartureTime"}
                    value={formatDateTime()}
                    placeholder={"Selecione um horario"}
                    readOnly
                    errors={errors.expectedDepartureTime}
                    prefixIcon={<Icon name={'calendar'}/>}
                />
            </Pressable>
            {showDatetimePicker &&
                <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date(values.expectedDepartureTime)}
                    mode={mode}
                    is24Hour={true}
                    onChange={changeDate}
                />
            }
        </Fragment>
    );
};

export default DatePicker;