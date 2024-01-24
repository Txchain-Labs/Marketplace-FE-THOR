import { useState, useMemo } from 'react';
import { Typography, Box, Grid, Paper, Snackbar, Alert } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { WindowOutlined } from '@mui/icons-material';
import { NftType } from '../../utils/types';
import ListNft from '../modals/ListNft';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useGetNodeRewards } from '../../hooks/useNodes';
import { formatWei, useChain } from '../../../src/utils/web3Utils';
import { Listing } from '../../models/Listing';
import { useGetUsdFromAvax, useGetUsdFromThor } from '../../hooks/useOracle';
import { BigNumberish, ethers } from 'ethers';
import { formatNumber } from '../../utils/common';

export const root = {
  width: '101%',
  display: 'flex',
  flexDirection: 'colum',
  alignItems: 'flex-start',
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
const moreIcon = {
  paddingX: 0.7,
  paddingTop: 0.5,
  background: 'black',
  right: 0,
  opacity: 1,
  transition: '0s ease-in-out',
  position: 'absolute',
};
const moreIcon1 = {
  opacity: 0,
  position: 'absolute',
};

const styleNFTItemInProfilePage = {
  height: 'var(--nft-item-width--profile-page)',
  minHeight: '248px',
  width: 'var(--nft-item-width--profile-page)',
  minWidth: '248px',
};

interface OwndDataType {
  data: Listing[] | NftType[];
  enableActions?: boolean;
  nftType: string;
}

const NFTCard = ({
  item,
  showModal,
  setShowModal,
  setListNFT,
  enableActions,
  nftType,
}: any) => {
  const [showOption, setShowOption] = useState(false);
  const router = useRouter();
  const { data: rewards } = useGetNodeRewards(
    nftType === 'node' ? item?.nftAddress : null,
    item?.tokenId,
    'OG'
  );
  const formatedRewards = useMemo(
    () => (rewards ? formatWei(rewards as string) : '0'),
    [rewards]
  );

  const chain = useChain();
  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const formatedPrice = useMemo(() => {
    if (item) {
      return (
        Number(ethers.utils.formatEther(item?.priceInWei || 0)) *
        (item?.paymentType === '0'
          ? avaxPrice
            ? Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
            : 0
          : thorPrice
          ? Number(ethers.utils.formatEther(thorPrice as BigNumberish))
          : 0)
      );
    } else {
      return 0;
    }
  }, [item, avaxPrice, thorPrice]);

  const [show, setShow] = useState<any>({
    id: '',
    status: true,
  });

  const [hoverTimeout] = useState(false);

  const handeShow = (i: any) => {
    setShow({
      ...show,
      id: i.id,
      status: true,
    });
  };
  function getMetaData(item: any) {
    const metadata = item?.metadata ? JSON.parse(item?.metadata) : null;

    if (metadata) {
      let img = metadata?.image;
      if (/(http(s?)):\/\//i.test(img)) {
        return img;
      }
      if (img.includes('ipfs://')) {
        img = img.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
        return img;
      }
    }
    return '/images/nft-placeholder.png';
  }
  const image = item?.image ? item.image : getMetaData(item);

  const main = {
    'position': 'relative',
    'cursor': 'pointer',
    // 'background': 'inherit',
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
    '&::before': {
      content: '""',
      backgroundImage: `url(${image})`,
      backgroundSize: 'cover',
      position: 'absolute',
      top: '0px',
      right: '0px',
      left: '0px',
      bottom: '0px',

      opacity: nftType === 'node' ? '0.3' : '1',
    },
  };
  // const main1 = {
  //   ...main,

  //   animationName: 'blurnftanimation',
  //   animationDuration: '3s', //transition: 'filter 5s'
  //   filter: 'brightness(50%)',
  // };

  function getMetaDataName(item: any) {
    const metadata = item?.metadata ? JSON.parse(item?.metadata) : null;
    if (metadata) {
      return metadata?.name;
    }
    return metadata;
  }
  // const name = getMetaDataName(item);
  const listButtonClick = (event: any) => {
    event.stopPropagation();
    setShowModal(!showModal);
    setListNFT({
      nftName: getMetaDataName(item),
      by: item?.name,
      nftImage: image,
      nftAddress: item?.token_address,
      tokenId: item?.token_id,
    });
  };
  const handleClick = (event: any) => {
    event.stopPropagation();
    setShowOption(!showOption);
  };

  return (
    <div
      key={item.id}
      style={{
        ...styleNFTItemInProfilePage,
        display: 'flex',
        position: 'relative',
      }}
    >
      <Paper
        onClick={() => {
          if (
            (item?.nftAddress && item?.tokenId) ||
            (item?.token_address && item?.token_id)
          ) {
            router.push(
              `/nft/${
                nftType === 'node' ? item?.nftAddress : item?.token_address
              }/${nftType === 'node' ? item?.tokenId : item?.token_id}`
            );
          }
        }}
        elevation={0}
        style={{
          // backgroundImage: `url(${image})`,

          ...styleNFTItemInProfilePage,
          // backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: nftType === 'node' ? '2px solid black' : 'none',
        }}
        onMouseEnter={() => {
          handeShow(item);
        }}
        onMouseLeave={() => {
          setShow({ ...show, status: false, id: '' });

          setShowOption(false);
        }}
        sx={show.id === item.id || !hoverTimeout ? main : main1}
      >
        {enableActions && show.id === item.id && (
          <Box sx={show.status ? moreIcon : moreIcon1}>
            <Box
              onClick={(event) => {
                handleClick(event);
              }}
            >
              {' '}
              <MoreVertIcon sx={{ cursor: 'pointer', color: 'white' }} />
            </Box>
          </Box>
        )}

        {showOption && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1,
              background: 'black',
              right: 0,
              marginTop: 5,
              position: 'absolute',
            }}
            onClick={(event) => {
              listButtonClick(event);
            }}
          >
            <WindowOutlined sx={{ color: 'white' }} />
            <button
              style={{
                background: 'black',
                padding: '0.7rem',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '5px',
                fontSize: '20px',
              }}
            >
              List
            </button>
          </Box>
        )}

        {/* {nftType === 'art' && (
          <Box
            width="100%"
            position="absolute"
            bottom="0px"
            p="10px 5px"
            sx={{
              backgroundColor: '#fff',
              backgroundSize: 'cover',
              opacity: show.id === item.id ? '1' : '0.6',
            }}
          >
            <Box
              display="flex"
              padding="0 20px"
              justifyContent="space-between"
              sx={{
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
                    color: '#000000',
                    marginLeft: '2px',
                  }}
                >
                  {name || 'ThorFi'}
                </Typography>
              </Box>
            </Box>
          </Box>
        )} */}
        {nftType === 'node' && (
          <Box sx={{ position: 'relative', height: '100%' }}>
            <Box
              display="flex"
              flexDirection="column"
              // justifyContent="center"
              height="inherit"
              padding="0.5rem"
            >
              <Typography
                sx={{
                  fontFamily: 'Nexa',
                  fontSize: '1.1em',
                  fontWeight: '700',
                  lineHeight: '1.137em',
                  letterSpacing: '0em',
                  textAlign: 'left',
                  color: 'black',

                  paddingTop: 1,
                }}
              >
                PRICE
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  sx={{
                    fontFamily: 'Nexa',
                    fontSize: '3.0em',
                    fontWeight: '700',
                    //   lineHeight: '5.306em',
                    letterSpacing: '-0.04em',
                    textAlign: 'left',
                    color: 'black',
                    //   paddingTop: 1
                  }}
                >
                  {formatNumber(formatedPrice)}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontSize: '0.900em',
                    fontWeight: '700',
                    lineHeight: '0.75em',
                    letterSpacing: '0em',
                    textAlign: 'left',
                    color: 'black',
                    pl: 1,
                  }}
                >
                  USD
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: 'Nexa',
                  fontSize: '0.900em',
                  fontWeight: '700',
                  lineHeight: '12.3px',
                  letterSpacing: '0em',
                  textAlign: 'left',
                  color: 'black',
                }}
              >
                {formatedRewards} THOR Pending Rewards
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                left: '5px',
                bottom: '5px',
              }}
            >
              {/* Placeholder for name */}
            </Box>
          </Box>
        )}
      </Paper>
    </div>
  );
};

type SnackbarProps = {
  isSuccess?: boolean;
  isError?: boolean;
  message?: string;
  timeout?: number;
  link?: string;
};

const FavouritedNfts = ({
  data,
  enableActions = false,
  nftType,
}: OwndDataType) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [listNFT, setListNFT] = useState(null);
  const handleModalClick = () => {
    setShowModal(!showModal);
  };
  const [openSnack, setOpenSnack] = useState(false);
  const [snackStatus, setSnackStatus] = useState(-1); // 0 for error and 1 for success
  const [timeout, setTimeout] = useState(2000);
  const [snackMessage, setSnackMessage] = useState('');
  const [nftLink, setNftLink] = useState('');
  const openToast = ({
    isSuccess,
    isError,
    message,
    timeout,
    link,
  }: SnackbarProps) => {
    if (isSuccess) {
      setSnackStatus(1);
    } else if (isError) {
      setSnackStatus(0);
    }
    setTimeout(timeout);
    setSnackMessage(message);
    setNftLink(link || '');
    setOpenSnack(true);
  };
  const closeSnackbar = () => {
    setOpenSnack(false);
  };
  return (
    <Box sx={root}>
      <Grid container>
        {data.map((item: Listing | NftType, index) => (
          <NFTCard
            key={index}
            setListNFT={setListNFT}
            showModal={showModal}
            setShowModal={setShowModal}
            item={item}
            enableActions={enableActions}
            nftType={nftType}
          />
        ))}
      </Grid>
      <ListNft
        open={showModal}
        listNFT={listNFT}
        handleClose={handleModalClick}
        openToast={openToast}
      />
      <Snackbar
        sx={{ zIndex: 10003, cursor: 'pointer' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openSnack}
        autoHideDuration={timeout}
        onClose={closeSnackbar}
        onClick={() => {
          router.push(nftLink);
        }}
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
          {/* <img src="/images/nftImage.png" width="50px" /> */}

          <Alert
            icon={<Image width={40} height={40} src="/images/nftImage.png" />}
            severity="success"
            sx={{
              'width': '100%',
              'padding': '0px 32px 0px 0px',
              'background':
                snackStatus === 1
                  ? 'green'
                  : snackStatus === 0
                  ? 'red'
                  : 'black',
              '& .MuiAlert-icon': { padding: '0px !important', mr: 4 },
              '& .MuiButtonBase-root-MuiIconButton-root': {
                display: 'none',
              },
            }}
          >
            <Typography variant="p-md" sx={{ color: 'white' }}>
              {snackMessage}
              {/* {openType === 'bid'
                ? 'PLACING A BID...'
                : 'PROCESSING PURCHASE...'} */}
            </Typography>
          </Alert>
        </Box>
      </Snackbar>
    </Box>
  );
};

export default FavouritedNfts;
