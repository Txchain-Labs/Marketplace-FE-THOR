import { Box, Button, Dialog, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
type Props = {
  open: boolean;
  handleClose: any;
  data: any;
};

import { isMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';
import { InfoOutlined } from '@mui/icons-material';
import { useSetKeycardName } from '@/hooks/useKeycards';
import { ToastSeverity } from '@/redux/slices/toastSlice';
import { useGetTransaction } from '@/hooks/Marketplace';
import { useSetCapsuleName } from '@/hooks/useCapsules';
import { useSetPerkName } from '@/hooks/usePerks';

const AssetRenameModal = ({ open, handleClose, data }: Props) => {
  const listNFTToast = {
    message: 'Renaming...',
    severity: ToastSeverity.INFO,
    image: data?.image,
  };
  const txnToast = {
    message: 'Renamed',
    severity: ToastSeverity.SUCCESS,
    image: data?.image,
    autoHideDuration: 5000,
  };
  const { write: renameWriteKeycard, data: dataKeycard } =
    useSetKeycardName(listNFTToast);
  const { write: renameWriteCapsule, data: dataCapsule } =
    useSetCapsuleName(listNFTToast);
  const { write: renameWritePerk, data: dataPerk } =
    useSetPerkName(listNFTToast);
  useGetTransaction(
    data?.type === 'keycard'
      ? dataKeycard?.hash
      : data?.type === 'capsule'
      ? dataCapsule?.hash
      : dataPerk?.hash,
    txnToast
  );
  const [name, setName] = useState('');
  const [enableSave, setEnableSave] = useState(false);
  const handleChangeName = (value: string) => {
    if (value === '' || value === data?.name) {
      setEnableSave(false);
    } else {
      setEnableSave(true);
    }
    if (value.length <= 20) {
      setName(value);
    }
  };
  const handleSubmit = () => {
    const utf8Encode = new TextEncoder();
    if (data?.type === 'keycard') {
      renameWriteKeycard({
        recklesslySetUnpreparedArgs: [data?.tokenId, utf8Encode.encode(name)],
      });
    } else if (data?.type === 'capsule') {
      renameWriteCapsule({
        recklesslySetUnpreparedArgs: [data?.tokenId, utf8Encode.encode(name)],
      });
    } else if (data?.type === 'perk') {
      renameWritePerk({
        recklesslySetUnpreparedArgs: [data?.tokenId, utf8Encode.encode(name)],
      });
    }
    setEnableSave(false);
    setName('');
    handleClose();
  };
  useEffect(() => {
    setName(data?.name);
    const html = document.querySelector('html');
    if (html) {
      html.style.overflow = open ? 'hidden' : 'auto';
    }
  }, [open, data?.name]);
  return (
    <>
      <Box>
        <Dialog
          onClose={handleClose}
          open={open}
          maxWidth="xs"
          fullWidth={true}
          BackdropProps={{
            style: {
              background: 'rgba(255, 255, 255, 0.87)',
            },
          }}
          sx={{
            '& .MuiDialog-paper': {
              padding: '25px',
              marginLeft: {
                md: '80px',
              },

              clipPath: isMobile
                ? 'polygon( 30% 0%, 92% 0, 100% 15%, 100% 100%, 0% 100%, 0% 100%, 0 85%, 0 0) !important'
                : 'polygon( 30% 0%, 92% 0, 100% 15%, 100% 100%, 70% 100%, 8% 100%, 0 85%, 0 0) !important',

              background: '#000',
              position: 'relative',
              overflow: 'hidden',
              maxWidth: {
                'lg': '35%',
                'md': '50%',
                'sm': '70%',
                'xs': '100%',
                '@media (max-width: 390px)': {
                  maxWidth: '100%',
                },
              },
              height: {
                'lg': '25%',
                'md': '40%',
                'sm': '25%',
                'xs': '30%',
                '@media (max-width: 390px)': {
                  height: '35%',
                },
              },
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              background: '#fff',
              width: '99.5%',
              height: '99.5%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              clipPath: isMobile
                ? 'polygon( 30% 0%, 92% 0, 100% 15%, 100% 100%, 0% 100%, 0% 100%, 0 85%, 0 0) !important'
                : 'polygon( 30% 0%, 92% 0, 100% 15%, 100% 100%, 70% 100%, 8% 100%, 0 85%, 0 0) !important',

              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
            }}
          >
            <Box sx={{ padding: '0px 20px' }}>
              <CloseIcon
                sx={{
                  alignSelf: 'end',
                  cursor: `url("/images/cursor-pointer.svg"), auto`,
                  zIndex: 2,
                  float: 'right',
                }}
                onClick={handleClose}
              />
              <Typography variant="sub-h" sx={{ color: '#000000' }}>
                Edit Name
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                <InfoOutlined
                  color="info"
                  sx={{ width: '12px', height: '12px' }}
                />
                <Typography variant="caption" sx={{ color: '#296EB4' }}>
                  This operation has transaction fees
                </Typography>
              </Box>
              <Box sx={{ marginBottom: '20px', marginTop: '20px' }}>
                <TextField
                  inputProps={{
                    sx: {
                      fontSize: '18px',
                      // color: 'rgba(0, 0, 0, 0.24)',
                      with: '100%',
                      zIndex: 3,
                      position: 'relative',
                    },
                  }}
                  fullWidth
                  name="Name"
                  value={name}
                  type="text"
                  onChange={(event) => handleChangeName(event.target.value)}
                  id="name"
                  label={
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontFamily: 'Nexa-Bold',
                        color: '#000000',
                      }}
                      variant="p-md"
                    >
                      Name
                    </Typography>
                  }
                  variant="standard"
                />

                <Button
                  onClick={handleSubmit}
                  sx={{
                    marginTop: '20px',
                    maxWidth: { sm: '290px', miniMobile: '150px' },
                    float: 'right',
                  }}
                  variant="contained"
                  fullWidth
                  disabled={!enableSave}
                >
                  Edit
                </Button>
              </Box>
            </Box>
          </Box>
        </Dialog>
      </Box>
    </>
  );
};

export default AssetRenameModal;
