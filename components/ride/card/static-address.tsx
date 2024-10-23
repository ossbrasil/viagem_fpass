import React from 'react';
import {Text, View} from "react-native";
import {globalStyles} from "@/core/styles";
import {Address} from "@/core/interfaces/ride";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {parseAddressStr, selectIcon} from "@/common/parsers/parse-address";

interface StaticAddressProps {
    addresses: Address[];
}
const StaticAddress: React.FC<StaticAddressProps> = ({addresses}) => {
    const renderStaticAddressItem = (addresses: Address[]) => addresses.map((address, idx, arr) => {
        return (
            <View key={`${address.stopOrder}${address.cep}`}
                  style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', overflow:'hidden'}}>
                <MaterialIcons name={selectIcon(idx, arr.length)} size={22} color="#666"/>
                <Text numberOfLines={1} style={{fontWeight:'500', fontSize:15}}>{parseAddressStr(address)}</Text>
            </View>
        )
    });

    return (
        <View style={[
            {
                padding: 5,
                backgroundColor: '#FFF',
                borderRadius: 6,
            },
            globalStyles.shadowProps
        ]}>
            {renderStaticAddressItem(addresses)}
        </View>
    );
};

export default StaticAddress;