import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { MODAL_TYPES, useGlobalModalContext } from '../modals';

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AlertDialog({ open, onClose }: SimpleDialogProps) {
  const { showModal } = useGlobalModalContext();
  const onConnectWallet = () => {
    onClose();
    showModal(MODAL_TYPES.CONNECT_WALLET, {
      title: 'Create instance form',
      confirmBtn: 'Save',
    });
  };

  return (
    <div style={{ zIndex: 1000002 }}>
      <Dialog
        open={open}
        sx={{ zIndex: 10000002 }}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">
                    {"Use Google's location service?"}
                </DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please connect metamask first
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              onClose();
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              onConnectWallet();
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
