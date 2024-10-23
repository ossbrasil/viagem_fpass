import {Slot} from "expo-router";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {RootSiblingParent} from "react-native-root-siblings";
import AppProvider from "@/core/context/app-context";
import {ModalProvider} from "@/core/context/modal-context";

export default function RootLayout() {
    return (
        <RootSiblingParent>
            <SafeAreaProvider>
                <ModalProvider>
                    <AppProvider>
                        <Slot/>
                    </AppProvider>
                </ModalProvider>
            </SafeAreaProvider>
        </RootSiblingParent>

    );
}
