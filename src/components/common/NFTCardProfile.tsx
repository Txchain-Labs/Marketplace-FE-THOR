import { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowForwardIos } from '@mui/icons-material';

import { palette } from '../../theme/palette';
import { useGlobalModalContext, MODAL_TYPES } from '../modals';
import BuyNft from '../modals/BuyNft';
import PlaceBid from '../modals/PlaceBid';
import LikeButton from '../../components/common/LikeButton';

import { useAddLike, useFavorites } from '../../hooks/useNFTDetail';
import { HoverEffectTimerInSecs } from '../../utils/constants';

export const root = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  background: '#fff',
};

const main = {
  'position': 'relative',
  'cursor': 'pointer',
  'background': 'inherit',
  'borderRadius': '0px',
  'padding': 0,
  'transition': 'transform .2s',
  '&:hover': {
    'transform': 'scale(1.05)',
    'transition': 'transform .2s',
    'boxShadow': '0px 0px 44px 0px rgba(0, 0, 0, 0.55)',
    'zIndex': 10001,
    '&$btnWrapper': {
      opacity: 1,
    },
  },
};
const main1 = {
  ...main,

  animationName: 'blurnftanimation',
  animationDuration: '3s', //transition: 'filter 5s'
  filter: 'brightness(50%)',
};

const btn = {
  'width': '170px',
  'height': 39,
  'alignItems': 'center',
  'fontSize': '12px',
  '&:hover': {
    ///// transform: 'scale(1.1)',
    ///// boxShadow: '0px 0px 44px 0px rgba(0, 0, 0, 0.55)',
    'clipPath':
      'polygon(0 0, 92.5% 0, 100% 30%, 100% 100%, 7.5% 100%, 0% 70%, 0 0)',
    'transition': ' clip-path 1s',
    'zIndex': 10001,
    '&$btnWrapper': {
      opacity: 1,
    },
  },
  '&:active': {
    boxShadow: 'inset rgba(0, 0, 0, 0.25) 0px 3px 0px',
  },
};
const btn1 = {
  'width': '170px',
  'height': 39,
  'alignItems': 'center',
  'fontSize': '12px',
  'background': palette.primary.storm,
  'color': '#fff',
  'boxShadow': 'inset rgba(85, 85, 85, 0.25) 0px -1px 0px',
  '&:hover': {
    ///// transform: 'scale(1.1)',
    ///// boxShadow: '0px 0px 44px 0px rgba(0, 0, 0, 0.55)',
    'clipPath':
      'polygon(0 0, 92.5% 0, 100% 30%, 100% 100%, 7.5% 100%, 0% 70%, 0 0)',
    'transition': ' clip-path 1s',
    'background': palette.primary.storm,
    'zIndex': 10001,
    '&$btnWrapper': {
      opacity: 1,
    },
  },
  '&:active': {
    boxShadow: 'inset rgba(85, 85, 85, 0.25) 0px 3px 0px',
  },
};

const nftItemsData = [
  {
    img: '/images/nfts/nftOrang.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8e5',
  },
  {
    img: '/images/nfts/nftImage.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8e6',
  },
  {
    img: '/images/nfts/nftOrang.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8e7',
  },
  {
    img: '/images/nfts/nftImage.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8e8',
  },
  {
    img: '/images/nfts/nftImage.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8e9',
  },
  {
    img: '/images/nfts/nftOrang.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8f0',
  },
  {
    img: '/images/nfts/nftImage.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8f1',
  },
  {
    img: '/images/nfts/nftOrang.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8f2',
  },
  {
    img: '/images/nfts/nftOrang.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8f3',
  },
  {
    img: '/images/nfts/nftOrang.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8f4',
  },
  {
    img: '/images/nfts/nftImage.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8f5',
  },
  {
    img: '/images/nfts/nftImage.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8f6',
  },
  {
    img: '/images/nfts/nftImage.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8f7',
  },
  {
    img: '/images/nfts/nftOrang.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8f8',
  },
  {
    img: '/images/nfts/nftOrang.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8f9',
  },
  {
    img: '/images/nfts/nftImage.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8fa',
  },
  {
    img: '/images/nfts/nftOrang.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8fb',
  },
  {
    img: '/images/nfts/nftImage.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8fc',
  },
  {
    img: '/images/nfts/nftOrang.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8fd',
  },
  {
    img: '/images/nfts/nftImage.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8fe',
  },
  {
    img: '/images/nfts/nftOrang.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb8ff',
  },
  {
    img: '/images/nfts/nftImage.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb900',
  },
  {
    img: '/images/nfts/nftOrang.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb901',
  },
  {
    img: '/images/nfts/nftImage.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb902',
  },
  {
    img: '/images/nfts/nftOrang.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb903',
  },
  {
    img: '/images/nfts/nftImage.png',
    id: '05e00938-438a-42c5-a2d8-00e9741fb904',
  },
];

//NFT styles
const btnWrapper = {
  display: 'flex',
  // justifyContent: 'center',
  opacity: 1,
  mb: 0.5,
  transition: '1s ease-in-out',
};
const btnWrapper1 = {
  display: 'flex',
  // justifyContent: 'center',
  opacity: 0,
};

const styleNFTItemInProfilePage = {
  height: 'var(--nft-item-width--profile-page)',
  minHeight: '248px',
  width: 'var(--nft-item-width--profile-page)',
  minWidth: '248px',
};

const NFTCardProfile = () => {
  const [show, setShow] = useState<any>({
    id: '',
    status: true,
  });

  const [hoverTimeout, setHoverTimeout] = useState(false);
  let hoverTimer: ReturnType<typeof setTimeout> | null = null;

  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openType, setOpenType] = useState('');
  const [openSnack, setOpenSnack] = useState(false);
  const [openSnackSuccess, setOpenSnackSuccess] = useState(false);
  const user = useSelector((state: any) => state.auth.user);

  const { showModal } = useGlobalModalContext();

  const openToast = () => {
    setOpenSnack(true);
    setTimeout(() => {
      setOpenSnackSuccess(true);
    }, 2000);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const closeSnackbar = () => {
    setOpenSnack(false);
  };

  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
  };
  const closeSnackbarSuccess = () => {
    setOpenSnackSuccess(false);
  };

  const handeShow = (i: any) => {
    setShow({
      ...show,
      id: i.id,
      status: true,
    });
  };

  function funcSetHoverTimeout() {
    setHoverTimeout(true);
  }

  const { data: favorites } = useFavorites(user?.id);
  const { mutate: addLike } = useAddLike();

  const likedNFTs = nftItemsData.filter((item) => favorites.includes(item.id));

  return (
    <Box sx={root}>
      <Grid container>
        {likedNFTs.map((item) => (
          <div
            key={item.id}
            style={{ ...styleNFTItemInProfilePage, display: 'flex' }}
          >
            <Link href={`/nft/${item.id}`}>
              <Paper
                elevation={0}
                style={{
                  backgroundImage: `url(${item.img})`,
                  ...styleNFTItemInProfilePage,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                onMouseEnter={() => {
                  handeShow(item);
                  hoverTimer = setTimeout(
                    funcSetHoverTimeout,
                    HoverEffectTimerInSecs
                  );
                }}
                onMouseLeave={() => {
                  setShow({ ...show, status: false });
                  if (hoverTimer !== null) clearTimeout(hoverTimer);
                  setHoverTimeout(false);
                }}
                sx={show.id === item.id || !hoverTimeout ? main : main1}
              >
                <Box position="absolute" top="18.7px" right="18.7px">
                  <LikeButton
                    isChecked={true}
                    id={item.id}
                    key={item.id}
                    likeNFTHandler={() =>
                      addLike({
                        user_id: user.id,
                        nft_id: item.id,
                        collection_address: 'xx',
                        token_id: 1,
                        chainid: 43114,
                      })
                    }
                  />
                </Box>

                <Box
                  width="100%"
                  position="absolute"
                  bottom="10px"
                  p="0px 5px"
                  sx={{
                    // backgroundImage: `url${item.img}`,
                    backgroundSize: 'cover',
                  }}
                >
                  <Box
                    display="flex"
                    padding="0 20px"
                    justifyContent="space-between"
                    sx={{
                      // backgroundImage: `url${item.img}`,
                      marginBottom: '5px',
                    }}
                  >
                    <Box display="flex" alignItems={'center'}>
                      <img
                        width={'18.77px'}
                        height={'18.77px'}
                        src="/images/logo.svg"
                      />
                      <Typography
                        variant="lbl-sm"
                        sx={{
                          color: '#fff',
                          marginLeft: '2px',
                        }}
                      >
                        ThorFi
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        color: '#fff',
                        lineHeight: '26px',
                        textAlign: 'center',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      <Typography variant="lbl-md">0.5</Typography>
                      <Typography
                        variant="p-lg-bk"
                        sx={{
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          fontSize: '12px',
                        }}
                      >
                        AVAX
                      </Typography>
                    </Box>
                  </Box>

                  {show.id === item.id && (
                    <Box sx={show.status ? btnWrapper : btnWrapper1}>
                      {false && (
                        <Button
                          variant="nft_common"
                          sx={btn}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!user?.address) {
                              showModal(MODAL_TYPES.CONNECT_WALLET, {
                                title: 'Create instance form',
                                confirmBtn: 'Save',
                              });
                            } else {
                              setOpenType('purchase');
                              handleClickOpen();
                            }
                          }}
                        >
                          <Typography
                            variant="overline"
                            fontWeight={'700'}
                            lineHeight={'18px'}
                          >
                            Buy for 0.5 AVAX
                          </Typography>
                        </Button>
                      )}
                      <Box margin="4px" />
                      {false && (
                        <Button
                          variant="nft_common"
                          sx={btn1}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!user?.address) {
                              showModal(MODAL_TYPES.CONNECT_WALLET, {
                                title: 'Create instance form',
                                confirmBtn: 'Save',
                              });
                            } else {
                              setOpenType('bid');
                              setIsOpen(true);
                            }
                          }}
                        >
                          <Typography variant="overline" fontWeight={'700'}>
                            {' '}
                            Bid
                          </Typography>
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>
              </Paper>
            </Link>
          </div>
        ))}
      </Grid>
      <BuyNft open={open} handleClose={handleClose} openToast={openToast} />
      <PlaceBid open={isOpen} handleClose={handleClose} openToast={openToast} />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openSnack}
        autoHideDuration={1800}
        onClose={closeSnackbar}
      >
        <Box
          sx={{
            'display': 'flex',
            'alignItems': 'center',
            '& .MuiAlert-root': {
              display: 'flex',
              alignItems: 'center',
              marginTop: '20px',
            },
          }}
        >
          <Alert
            icon={<Image width={40} height={40} src="/images/nftImage.png" />}
            severity="success"
            sx={{
              'width': '100%',
              'padding': '0px 32px 0px 0px',
              'background': 'black',
              '& .MuiAlert-icon': { padding: '0px !important', mr: 4 },
              '& .MuiButtonBase-root-MuiIconButton-root': {
                display: 'none',
              },
            }}
          >
            <Typography variant="p-md" sx={{ color: 'white' }}>
              {openType === 'bid'
                ? 'PLACING A BID...'
                : 'PROCESSING PURCHASE...'}
            </Typography>
          </Alert>
        </Box>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openSnackSuccess}
        autoHideDuration={5000}
        onClose={closeSnackbarSuccess}
      >
        <Box
          sx={{
            'display': 'flex',
            'alignItems': 'center',
            '& .MuiAlert-root': {
              display: 'flex',
              alignItems: 'center',
              marginTop: '20px',
            },
          }}
        >
          <Alert
            icon={<Image width={40} height={40} src="/images/nftImage.png" />}
            severity="success"
            sx={{
              'width': '100%',
              'padding': '0px 10px 0px 0px',
              'background': '#30B82D',

              '& .MuiAlert-icon': { padding: '0px !important', mr: 4 },
              '& .css-1e0d89p-MuiButtonBase-root-MuiIconButton-root': {
                display: 'none',
              },
            }}
          >
            <Box
              style={{
                display: 'flex',
                justifyItems: 'center',
                paddingRight: '10px',
              }}
            >
              <Typography
                variant="p-md"
                sx={{ color: 'white', marginTop: '4px' }}
              >
                {openType === 'bid' ? 'VIEW RECENT BID' : 'VIEW MY NEW NFT'}
              </Typography>
              <ArrowForwardIos
                fontSize="small"
                style={{ color: 'white', marginLeft: '16px' }}
              />
            </Box>
          </Alert>
        </Box>
      </Snackbar>
    </Box>
  );
};

export default NFTCardProfile;
