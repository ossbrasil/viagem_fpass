import React, {createContext, ReactNode, useContext, useState} from "react";
import {KeyboardAvoidingView, Modal, Platform} from "react-native";

interface ModalData {
    id: string;
    content: ReactNode;
}

interface ModalContextValues {
    openModal: (id: string, content: ReactNode) => void;
    closeModal: (id: string) => void;
    closeTopModal: () => void;
}

const ModalContext = createContext<ModalContextValues | undefined>(undefined);


export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}
export const ModalProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [modals, setModals] = useState<ModalData[]>([]);

    const openModal = (id: string, content: ReactNode) => {
        setModals(prev => [...prev, {id, content}]);
    };

    const closeModal = (id: string) => {
        setModals(prev => prev.filter(modal => modal.id !== id));
    };

    const closeTopModal = () => {
        setModals(prev => prev.slice(0, -1)); // Removes the last modal
    };

    return (
        <ModalContext.Provider value={{openModal, closeModal, closeTopModal}}>
            {children}
            {modals.map((modal, index) => (
                <Modal
                    key={modal.id}
                    transparent
                    presentationStyle="overFullScreen"
                    visible={true} // Always true for active modals
                    animationType="none" // Optional animation type
                    onRequestClose={() => closeTopModal()} // Handle back button on Android
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
                        {modal.content}
                    </KeyboardAvoidingView>
                </Modal>
            ))}
        </ModalContext.Provider>
    );
};