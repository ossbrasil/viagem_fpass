import React from 'react';
import {Modal, StyleSheet, Text, View} from "react-native";
import CustomButton, {ButtonType} from "@/components/custom-button";
import {useModal} from "@/components/modal/ctx";
import {globalStyles} from "@/core/styles";

export interface ConfirmationModalProps {
    title: string;
    content: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({title, content}) => {
    const {isOpen, setIsOpen} = useModal();
    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={isOpen}
            onRequestClose={() => {setIsOpen(false);}}
        >
            <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
                <View style={[styles.container, globalStyles.shadowProps]}>
                    <View>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text>{content}</Text>
                    </View>
                    <View style={styles.buttonRow}>
                        <CustomButton title={'Cancelar'} type={ButtonType.WARNING} size={'md'}
                                      onPress={() => {
                                          setIsOpen(false)
                                      }}/>
                        <CustomButton title={'Confirmar'} type={ButtonType.SUCCESS} size={'md'} onPress={() => {
                            setIsOpen(false);
                        }}/>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: '10%',
        padding: 10,
        backgroundColor: '#DDD',
        maxHeight: '25%',
        borderRadius: 8,
        top: '37.5%',
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
    }
});
export default ConfirmationModal;