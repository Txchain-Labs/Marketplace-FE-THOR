import { useEffect } from 'react';
import { useAccount, useSignMessage, useConnect, useSwitchChain } from 'wagmi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import { Dialog, DialogTitle, Divider, Grid, Box } from '@mui/material';
import { useGlobalModalContext } from './GlobleModal';
import { useChain } from '../../utils/web3Utils';
import { useSetAttribute } from '../../hooks/uiHooks';
import { isMobile, isTablet } from 'react-device-detect';

const emails = ['username@gmail.com', 'user02@gmail.com'] as const;

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (succeded: boolean) => void;
}

function WalletConnect({ onClose }: SimpleDialogProps) {
  const dispatch = useDispatch();
  const { address = '' } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { token } = useSelector((state: RootState) => state.auth);
  const { chains, switchChain } = useSwitchChain();
  const chain = useChain();

  useEffect(() => {
    if (!address) {
      return;
    }
    onClose(true);
    return;
  }, [
    address,
    dispatch,
    signMessageAsync,
    token,
    onClose,
    switchChain,
    chain?.id,
  ]);

  const handleClose = () => {
    onClose(false);
  };

  const { connect, connectors } = useConnect();

  function connectMetamask() {
    const domain = window?.location?.hostname || 'capsule.gg';
    if ((isMobile || isTablet) && !window?.ethereum) {
      window.location.href = `https://metamask.app.link/dapp/${domain}`;
    } else {
      connect({ connector: connectors[0] });
    }
  }

  function connectWalletConnect() {
    connect({ connector: connectors[1] });
  }
  const connectMetaMaskWalletRef = useSetAttribute([
    { key: 'id', value: 'connect-wallet-mm' },
    { key: 'dusk', value: 'connect-wallet-mm' },
  ]);

  return (
    <Box>
      <Dialog
        onClose={handleClose}
        open={true}
        maxWidth="xs"
        fullWidth={true}
        slotProps={{
          backdrop: {
            sx: (theme) => ({
              bgcolor:
                theme.palette.mode === 'light'
                  ? 'rgba(255, 255, 255, 0.87)'
                  : 'rgba(0, 0, 0, 0.87)',
            }),
          },
        }}
        sx={{
          '& .MuiDialog-paper': {
            padding: '25px',
            marginLeft: {
              md: '80px',
            },
            clipPath:
              'polygon( 30% 0%, 92% 0, 100% 15%, 100% 100%, 70% 100%, 8% 100%, 0 85%, 0 0) !important',
            bgcolor: 'text.primary',
            position: 'relative',
            overflow: 'hidden',
            maxWidth: {
              'lg': '45%',
              'md': '50%',
              'sm': '70%',
              'xs': '100%',
              '@media (max-width: 390px)': {
                maxWidth: '100%',
              },
            },
            height: {
              'lg': '50%',
              'md': '45%',
              'sm': '40%',
              'xs': '27%',
              '@media (max-width: 390px)': {
                height: '27%',
              },
            },
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bgcolor: 'background.paper',
            width: '99.5%',
            height: '99.5%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            clipPath:
              'polygon( 30% 0%, 92% 0, 100% 15%, 100% 100%, 70% 100%, 8% 100%, 0 85%, 0 0) !important',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}
        >
          <>
            <DialogTitle
              textAlign="center"
              sx={{
                fontWeight: 400,
                fontSize: { md: '24px', sm: '16px' },
                marginTop: '10px',
              }}
            >
              CONNECT WALLET
            </DialogTitle>

            <Grid
              container
              sx={{
                justifyContent: 'space-between',
                margin: 'auto',
                width: '85%',
                display: 'flex',
              }}
            >
              <Grid item xs>
                <Box
                  ref={connectMetaMaskWalletRef}
                  textAlign="center"
                  onClick={connectMetamask}
                  sx={{ cursor: `url("/images/cursor-pointer.svg"), auto` }}
                  id="connect-wallet-mm-modal"
                >
                  <img
                    src="/images/metamask-icon.svg"
                    alt="Connect with MetaMask"
                  />
                  <p>Metamask</p>
                </Box>
              </Grid>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: '#C6C6C6' }}
              ></Divider>
              <Grid item xs>
                <Box
                  textAlign="center"
                  onClick={connectWalletConnect}
                  sx={{ cursor: `url("/images/cursor-pointer.svg"), auto` }}
                >
                  <img
                    src="/images/wallet-connect-icon.svg"
                    alt="Connect with Wallet Connect"
                  />
                  <p>Wallet Connect</p>
                </Box>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>
    </Box>
  );
}

export default function SimpleDialogDemo({
  onConnected,
}: {
  onConnected: () => void;
}) {
  const { hideModal } = useGlobalModalContext();

  const handleClose = (connected: boolean) => {
    if (connected && onConnected) {
      onConnected();
    }
    hideModal();
  };

  return (
    <WalletConnect
      selectedValue={emails[1]}
      open={true}
      onClose={handleClose}
    />
  );
}
