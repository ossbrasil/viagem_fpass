import React, {Fragment, useState} from 'react';
import CustomButton, {ButtonType} from "@/components/custom-button";
import {View} from "react-native";
import {useNewRide} from "@/pages/new-ride/new-ride-ctx";
import FreeDriverModal from "@/components/ride/modals/free-driver";
import {FreeDriver} from "@/core/interfaces/ride";

const SelectDriver = () => {
    const {userAPI, form} = useNewRide();
    const {values} = form;
    const [showFreeDriverModal, setShowFreeDriverModal] = useState(false);
    const [freeDrivers, setFreeDrivers] = useState<FreeDriver[]>([]);
    return (
        <Fragment>
            <View style={{flexDirection: 'row', marginVertical: 10}}>
                <CustomButton
                    title={"Selecionar motorista"}
                    type={ButtonType.MAIN}
                    size={"md"}
                    onPress={async () => {
                        const res = await userAPI.getDriversAvailable(values);
                        setFreeDrivers(res)
                    }}
                    disabled={values.addresses !== undefined ? values.addresses.length < 2 : false}
                />
                {showFreeDriverModal && (
                    <FreeDriverModal showFreeDriver={showFreeDriverModal} setShowFreeDriver={setShowFreeDriverModal}
                                     freeDrivers={freeDrivers}/>

                )}
            </View>
        </Fragment>
    );
};

export default SelectDriver;