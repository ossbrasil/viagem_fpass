import React from 'react';
import {Modal, View} from "react-native";

export interface ModalProps {
    isOpen:boolean;
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
}
const CustomModal = (props: React.PropsWithChildren<ModalProps>) => {
    return (
        <Modal
            animationType="none"
            transparent={true}
            presentationStyle="overFullScreen"
            visible={props.isOpen}
            onRequestClose={() => {
                props.setIsOpen(false);
            }}
        >
            <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
                {props.children}
            </View>
        </Modal>
    );
};

export default CustomModal;