import React, {Fragment, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import DraggableFlatList, {DragEndParams, RenderItemParams, ScaleDecorator} from "react-native-draggable-flatlist";
import {Address, RideAddressTypeEnum} from "@/core/interfaces/ride";
import {globalStyles} from "@/core/styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {parseAddressStr, selectIcon} from "@/common/parsers/parse-address";
import Icon from "@/components/icon";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import CustomButton, {ButtonType} from "@/components/custom-button";
import {useNewRide} from "@/pages/new-ride/new-ride-ctx";
import AddAddressModal from "@/components/modal/add-address";

const Addresses = () => {
    const {form} = useNewRide();
    const {values, setValues, errors} = form;
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [selectedIdx, setSelectedIdx] = useState<number>();
    useEffect(() => {
        if(!showAddAddress){
            setSelectedIdx(undefined);
        }
    }, [showAddAddress]);
    const renderDraggableAddressItem = ({item, getIndex, drag}: RenderItemParams<Address>) => {
        const idx = getIndex() ?? 0;
        const removeAddress = () => {
            setValues((prevState) => ({
                ...prevState,
                addresses: prevState.addresses.toSpliced(prevState.addresses.findIndex((a) => JSON.stringify(a) === JSON.stringify(item)), 1),
                polyline: !values.polyline ? [] : values.polyline.toSpliced(-1, 1)
            }));
        }
        const editAddress = () => {
            setSelectedIdx(idx);
            setShowAddAddress(true)
        }
        return (
            <ScaleDecorator activeScale={1.03}>
                <TouchableOpacity activeOpacity={1} style={styles.rowItem} onLongPress={drag}>
                    <View style={[styles.item, globalStyles.shadowProps]}>
                        <MaterialIcons style={{paddingHorizontal: 5}} name={selectIcon(idx, values.addresses.length)}
                                       size={22} color="#000"/>
                        <Text numberOfLines={1} style={{flex: 1, color: '#000', fontWeight: "500"}}>
                            {parseAddressStr(item)}
                        </Text>
                        <Icon name="refresh" color="#0769B4" onPress={editAddress}/>
                        <Icon name="close" onPress={removeAddress} color="red"/>
                    </View>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    }
    const onDragEnd = ({data}: DragEndParams<Address>) => {
        data.forEach((address, idx) => {
            if (idx === 0) {
                address.rideAddressType = RideAddressTypeEnum.START
            } else if (idx === data.length - 1) {
                address.rideAddressType = RideAddressTypeEnum.FINISH
            } else {
                address.rideAddressType = RideAddressTypeEnum.ADDITIONAL
            }
        });
        setValues(prevState => ({...prevState, addresses: data}));
    };

    return (
        <Fragment>
            <GestureHandlerRootView style={{minHeight: 50, maxHeight: 300, paddingBottom: 6}}>
                {values.addresses.length > 0 ? (
                    <DraggableFlatList
                        data={values.addresses}
                        onDragEnd={onDragEnd}
                        keyExtractor={(item) => `${item.cep!}${item.number}`}
                        renderItem={renderDraggableAddressItem}
                    />
                ) : (
                    <View style={{flexDirection: "row", justifyContent: "center"}}>
                        <Text style={{color: '#777', fontSize: 20, fontWeight: 'bold'}}>
                            Segure e arraste para alterar a ordem
                        </Text>
                    </View>
                )}
            </GestureHandlerRootView>
            <View style={{flexDirection: 'row'}}>
                <CustomButton
                    title={"Adicionar Endereço"}
                    type={ButtonType.MAIN}
                    size={'md'}
                    onPress={() => {setShowAddAddress(true)}}
                />
            </View>

            {errors.addresses && (
                <View style={{flexDirection: "row", justifyContent: "center"}}>
                    <Text>
                        {errors.addresses}
                    </Text>
                </View>
            )}
            {showAddAddress && (
                <AddAddressModal showAddress={showAddAddress} setShowAddress={setShowAddAddress}
                                 addressIdx={selectedIdx}/>

            )}
        </Fragment>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowItem: {
        height: 35,
        width: '100%',
        marginVertical: 2,
    },
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    item: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 6,
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default Addresses;