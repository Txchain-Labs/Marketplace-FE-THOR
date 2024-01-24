import React, { useState, createContext, useContext } from 'react';
import { Box } from '@mui/system';
import ConnectWallet from './ConnectWallet';
import { palette } from '../../theme/palette';
// import { CreateModal, DeleteModal, UpdateModal } from "../../components";

export const MODAL_TYPES = {
  CONNECT_WALLET: 'CONNECT_WALLET',
  DELETE_MODAL: 'DELETE_MODAL',
  UPDATE_MODAL: 'UPDATE_MODAL',
};

const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.CONNECT_WALLET]: ConnectWallet,
  // [MODAL_TYPES.DELETE_MODAL]: DeleteModal,
  // [MODAL_TYPES.UPDATE_MODAL]: UpdateModal
};

type ContextType = {
  showModal: (modalType: string, modalProps?: any) => void;
  hideModal: () => void;
  store: any;
};

const initalState: ContextType = {
  showModal: () => false,
  hideModal: () => false,
  store: {},
};

const GlobalModalContext = createContext(initalState);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

export const GlobalModal = ({ children }: { children: React.ReactNode }) => {
  const [store, setStore] = useState<any>();
  const { modalType, modalProps }: any = store || {};

  const showModal = (modalType: string, modalProps: any = {}) => {
    setStore({
      ...store,
      modalType,
      modalProps,
    });
  };

  const renderComponent = () => {
    const ModalComponent = MODAL_COMPONENTS[modalType];
    if (!modalType || !ModalComponent) {
      return null;
    }
    return <ModalComponent id="global-modal" {...modalProps} />;
  };

  const hideModal = () => {
    setStore({
      ...store,
      modalType: null,
      modalProps: {},
    });
  };

  return (
    <>
      <GlobalModalContext.Provider value={{ store, showModal, hideModal }}>
        {renderComponent()}
        {children}
      </GlobalModalContext.Provider>
      <Box
        sx={{
          position: 'fixed',
          bottom: '20px',
          left: 'calc(50% - 120px)',
          color: palette.primary.storm,
          zIndex: 10000,
        }}
      >
        {/* <Typography>© 2022 Thor Financial. All rights reserved.</Typography> */}
      </Box>
    </>
  );
};
