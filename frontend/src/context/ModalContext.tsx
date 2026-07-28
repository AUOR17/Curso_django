import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
    openModal: (modalComponent: ReactNode) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    
    const [modalContent, setModalContent] = useState<ReactNode | null>(null);

    const openModal = (modalComponent: ReactNode) => {
        setModalContent(modalComponent);
    };

    const closeModal = () => {
        setModalContent(null);
    };

    return(
        <ModalContext.Provider value={{openModal, closeModal}}>
        {children}
        {/*Aqui abajo vive el modal, si hay contenido, entonces lo renderiza React*/}
        {modalContent && (
            <div className="fixed inset-0 z-100 flex items-center justify-center">

                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}/>
                <div className='relative z-10'>
                    {modalContent}
                </div>
            </div>
        )}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal debe usarse dentro de ModalProvider");
  return context;
};