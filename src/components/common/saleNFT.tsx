import { useState, useMemo, useEffect } from 'react';
import { Typography, Box, Paper, Grid, Snackbar, Alert } from '@mui/material';
import { DriveFileRenameOutline, DeleteOutline } from '@mui/icons-material';
import { NftType } from '../../utils/types';
import { useUnListNFT } from '../../hooks/useNFTDetail';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useGetNodeRewards } from '../../hooks/useNodes';
import { formatWei, useChain } from '../../utils/web3Utils';
import { useGetListingByNft } from '../../hooks/useListings';
import { BigNumberish, ethers } from 'ethers';
import { useGetUsdFromAvax, useGetUsdFromThor } from '../../hooks/useOracle';
import { formatNumber, getMetaData } from '../../utils/common';

import UpdateListNft from '../modals/UpdateListNft';
import { useSelector } from 'react-redux';
import { MODAL_TYPES, useGlobalModalContext } from '../modals';
import { ToastSeverity } from '../../redux/slices/toastSlice';
import { useGetTransaction } from '../../hooks/Marketplace';
import Dropdown from './Dropdown';
import { menuItemIcon } from '../../styles/profile';

export const root = {
  width: '101%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  background: '#fff',
};

const styleNFTItemInProfilePage = {
  height: 'var(--nft-item-width--profile-page)',
  minHeight: '248px',
  width: 'var(--nft-item-width--profile-page)',
  minWidth: '248px',
};

interface OwndDataType {
  data: NftType[];
  enableActions?: boolean;
  nftType: string;
  refetches?: any[];
}

const NFTCard = ({
  item,
  showEditModal,
  setShowEditModal,
  setListNFT,
  enableActions,
  nftType,
  refetches,
}: any) => {
  const [showOption, setShowOption] = useState(false);
  const router = useRouter();
  const { data: rewards } = useGetNodeRewards(
    nftType === 'node' ? item?.token_address : null,
    item?.token_id,
    'OG'
  );

  const [show, setShow] = useState<any>({
    id: '',
    status: true,
  });

  const { data: listingNFT } = useGetListingByNft(
    item?.token_address,
    item?.token_id
  );
  const chain = useChain();

  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const formatedPrice = useMemo(() => {
    if (!listingNFT) {
      return 0;
    }
    const lst = listingNFT.data?.data?.listings[0];
    if (lst) {
      return (
        Number(ethers.utils.formatEther(lst?.priceInWei || 0)) *
        (lst?.paymentType === '0'
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
  }, [listingNFT, avaxPrice, thorPrice]);

  const formatedRewards = useMemo(
    () => (rewards ? formatWei(rewards as string) : '0'),
    [rewards]
  );
  const image = getMetaData(item);
  const unListNFTToast = {
    message: 'NFT Unlisting...',
    severity: ToastSeverity.INFO,
    image: image,
    autoHideDuration: 5000,
  };
  const txnToast = {
    message: 'NFT Unlisted',
    severity: ToastSeverity.SUCCESS,
    image: image,
    autoHideDuration: 5000,
  };

  const {
    data: unlistTransactionData,
    write: unListNFTWrite,
    // isLoading: unListNFTLoading,
  } = useUnListNFT(unListNFTToast);

  const {
    data: writeTransactionResult,
    isError: writeTransactionError,
    isLoading: writeTransactionLoading,
  } = useGetTransaction(unlistTransactionData?.hash, txnToast);

  useEffect(() => {
    if (
      refetches &&
      !writeTransactionLoading &&
      !writeTransactionError &&
      writeTransactionResult
    ) {
      refetches.map((refetch: any) => {
        refetch();
      });
    }
  }, [
    writeTransactionResult,
    writeTransactionError,
    writeTransactionLoading,
    refetches,
  ]);

  const [hoverTimeout] = useState(false);

  const handeShow = (i: any) => {
    setShow({
      ...show,
      id: i.id,
      status: true,
    });
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

  const main1 = {
    ...main,

    animationName: 'blurnftanimation',
    animationDuration: '3s', //transition: 'filter 5s'
    filter: 'brightness(50%)',
  };
  function getMetaDataName(item: any) {
    const metadata = item?.metadata ? JSON.parse(item?.metadata) : null;
    if (metadata) {
      return metadata?.name;
    }
    return metadata;
  }
  const name = getMetaDataName(item);
  const handleEdit = (event: any) => {
    event.stopPropagation();
    setShowEditModal(!showEditModal);

    setListNFT({
      nftName: getMetaDataName(item),
      by: item?.name,
      nftImage: image,
      nftAddress: item?.token_address,
      tokenId: item?.token_id,
      status: 'edit',
    });
  };
  const handleClick = (event: any) => {
    event.stopPropagation();
    setShowOption(!showOption);
  };

  const { showModal } = useGlobalModalContext();

  const user = useSelector((state: any) => state.auth.user);

  const { refetch: refetchListing } = useGetListingByNft(
    item?.token_address,
    item?.token_id
  );

  const handleUnlistNFT = async (event: any) => {
    event.stopPropagation();
    if (!user?.address) {
      showModal(MODAL_TYPES.CONNECT_WALLET, {
        title: 'Create instance form',
        confirmBtn: 'Save',
      });
    } else {
      await unListNFTWrite({
        recklesslySetUnpreparedArgs: [item?.token_address, item?.token_id],
      });
      refetchListing();
    }
  };

  const dropDownData = [
    {
      title: 'Edit List',
      icon: <DriveFileRenameOutline sx={menuItemIcon} />,
      action: handleEdit,
    },
    {
      title: 'Remove',
      icon: <DeleteOutline sx={menuItemIcon} />,
      action: handleUnlistNFT,
    },
  ];

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
          router.push(`/nft/${item?.token_address}/${item?.token_id}`);
        }}
        elevation={0}
        style={{
          ...styleNFTItemInProfilePage,
          border: nftType === 'node' ? '2px solid black' : 'none',

          backgroundPosition: 'center',
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
          <Dropdown
            handleShow={handleClick}
            show={showOption}
            data={dropDownData}
          />
        )}

        {nftType === 'art' && (
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
                color: '#000000',
                lineHeight: '26px',
                textAlign: 'center',
                letterSpacing: '-0.02em',
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
          </Box>
        )}
        {nftType === 'node' && (
          <Box
            display="flex"
            flexDirection="column"
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
                  letterSpacing: '-0.04em',
                  textAlign: 'left',
                  color: 'black',
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
            <Box
              sx={{
                marginTop: 'auto',
              }}
            >
              {name}
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

const SaleNft = ({
  data,
  enableActions = false,
  nftType,
  refetches,
}: OwndDataType) => {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [listNFT, setListNFT] = useState(null);

  const [snackStatus, setSnackStatus] = useState(-1); // 0 for error and 1 for success
  const [snackMessage, setSnackMessage] = useState('');
  const [timeout, setTimeout] = useState(2000);
  const [nftLink, setNftLink] = useState('');
  const [openSnack, setOpenSnack] = useState(false);

  const handleModalClick = () => {
    setShowEditModal(!showEditModal);
  };

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
        {data.map((item: NftType, index) => (
          <NFTCard
            key={index}
            setListNFT={setListNFT}
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            item={item}
            enableActions={enableActions}
            nftType={nftType}
          />
        ))}
      </Grid>
      <UpdateListNft
        open={showEditModal}
        listNFT={listNFT}
        handleClose={handleModalClick}
        openToast={openToast}
        refetches={refetches}
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

export default SaleNft;
