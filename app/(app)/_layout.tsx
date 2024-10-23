import {useApp} from "@/core/context/app-context";
import {Redirect, Tabs} from "expo-router";
import React, {useState} from "react";
import {ActivityIndicator, Image, Pressable, StyleSheet, View} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {AccessLevel} from "@/core/enums/access-level";
import Dropdown from "@/components/dropdown";
import MenuItem from "@/components/menu-item";
import Icon from "@/components/icon";
import {RideProvider} from "@/components/ride/ride-ctx";
import {BottomTabNavigationProp} from "@react-navigation/bottom-tabs";
import {SocketIoProvider} from "@/core/context/socketio-context";

export type RootStackParamList = {
    'new-ride': { id?: number };
    'index': undefined;
    'current-ride': undefined;
    'hist-ride': undefined;
};
export type NavigationProp = BottomTabNavigationProp<RootStackParamList>;

export const AppLayout = () => {
    const {top} = useSafeAreaInsets();
    const {session, isLoading, authAPI} = useApp();
    const [dropDownMenu, setDropDownMenu] = useState(false);
    const menuItems = [
        <MenuItem
            key="logout-menu-item"
            title="Logout"
            prefixIcon={<Icon name="exit"/>}
            onClick={async () => {await authAPI.logout()}}
        />,
    ];
    const setTabIcon = (color: string, icon: keyof typeof MaterialIcons.glyphMap) => (
        <MaterialIcons size={32} name={icon} color={color}/>
    );
    if (isLoading)
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                marginHorizontal: 10,
                alignItems: "center",
            }}>
                <ActivityIndicator size={"large"} color="#972620"/>
            </View>
        );
    if (!session) return <Redirect href={'/sign-in'}/>;
    return (
        <View style={{flex: 1, paddingTop: top}}>
            <View style={{
                height: 80,
                backgroundColor: "#000",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
            }}>
                <Image source={require('@/assets/images/logo_branco.png')}
                       resizeMode="contain"
                       style={styles.image}/>
                <Pressable
                    style={{
                        position: 'absolute',
                        right: 10
                    }}
                    onPress={() => {setDropDownMenu(!dropDownMenu)}}
                >
                    <MaterialIcons size={42} name="menu" color={'#FAFAFA'}/>
                </Pressable>
            </View>
            {dropDownMenu && (
                <Dropdown items={menuItems}/>
            )}
            <SocketIoProvider>
                <RideProvider>
                    <Tabs
                        screenOptions={{
                            headerShown: false,
                            tabBarActiveTintColor: '#000',
                            tabBarHideOnKeyboard: true
                        }}>
                        <Tabs.Screen
                            name="index"
                            options={{
                                tabBarShowLabel: false,
                                tabBarIcon: ({color}) => setTabIcon(color, 'calendar-today')
                            }}

                        />
                        <Tabs.Screen
                            name="new-ride"
                            initialParams={{id: null}}
                            options={{
                                tabBarShowLabel: false,
                                tabBarIcon: ({color}) => setTabIcon(color, 'add')
                            }}
                        />
                        <Tabs.Screen
                            name="current-ride"
                            options={{
                                href: null,
                                tabBarShowLabel: false,
                                tabBarIcon: ({color}) => setTabIcon(color, 'navigation')
                            }}
                        />
                        <Tabs.Screen
                            name="hist-ride"
                            options={{
                                tabBarShowLabel: false,
                                tabBarIcon: ({color}) => setTabIcon(color, 'history')

                            }}
                        />
                    </Tabs>
                </RideProvider>
            </SocketIoProvider>
        </View>
    );
}
const styles = StyleSheet.create({
    image: {
        width: 100,
        left:0,
    },
});

export default AppLayout;