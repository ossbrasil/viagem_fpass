import React, {useMemo} from "react";

export interface ModalContextValues {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: () => void;
}

const defaultValue: ModalContextValues = {
    isOpen: true,
    setIsOpen: () => {},
    onSubmit: () => {},
};

const ModalContext = React.createContext<ModalContextValues>(defaultValue);

export const useModal = () => React.useContext(ModalContext);

export const ModalProvider = ({children}: React.PropsWithChildren) => {
    const [isOpen, setIsOpen] = React.useState(defaultValue.isOpen);
    const value: ModalContextValues = useMemo(() => ({
        isOpen,
        setIsOpen,
        onSubmit: () => {},
    }), [isOpen]);
    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    )
}
export const ModalConsumer: React.FC<{ children: (context: ModalContextValues) => React.ReactNode }> = ({children}) => (
    <ModalContext.Consumer>
        {context => children(context)}
    </ModalContext.Consumer>
);