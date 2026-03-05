"use client";

import { createContext, useContext, useState } from "react";

type ModalProContextType = {
  modalPro: boolean;
  openModalPro: () => void;
  closeModalPro: () => void;
};

const ModalProContext = createContext<ModalProContextType | null>(null);

export const ModalProProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalPro, setModalPro] = useState(false);

  const openModalPro = () => {
    setModalPro(true);
  };

  const closeModalPro = () => {
    setModalPro(false);
  };

  return (
    <ModalProContext.Provider value={{ modalPro, openModalPro, closeModalPro }}>
      {children}
    </ModalProContext.Provider>
  );
};

export const useModalPro = () => useContext(ModalProContext);
