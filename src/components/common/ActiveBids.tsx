import { useEffect, useState } from 'react';
import { Typography, Box, Paper, Grid } from '@mui/material';
import { ActiveBidsDataType, NftType } from '../../utils/types';
import { useGetNFTDetail } from '../../hooks/useNFTDetail';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import {
  activeBidsRoot,
  cardWrapper,
  cardHover,
  cardstyle,
} from '../../styles/ActiveBids';
import { getMetaData, getMetaDataName, formatNumber } from '../../utils/common';
import { Delete } from '@mui/icons-material';
import {
  useCancelBid,
  useCancelOtcBid,
  useGetTransaction,
} from '../../hooks/Marketplace';
import { ToastSeverity } from '../../redux/slices/toastSlice';
import Dropdown from './Dropdown';
import { menuItemIcon } from '../../styles/profile';

const NFTCard = ({ item, enableActions, removeBidData }: any) => {
  const [showOption, setShowOption] = useState(false);
  const router = useRouter();

  const [show, setShow] = useState<any>({
    id: '',
    status: true,
  });
  const { data: nftData } = useGetNFTDetail(item?.nftAddress, item?.tokenId);

  const [hoverTimeout] = useState(false);
  const image = getMetaData(nftData);
  const cardStyle = cardstyle(image);
  const cardHoverStyle = { ...cardStyle, ...cardHover };
  const mouseEnter = (i: any) => {
    setShow({
      ...show,
      id: i.id,
      status: true,
    });
  };
  const mouseLeave = () => {
    setShow({ ...show, status: false, id: '' });
    setShowOption(false);
  };

  const handleClick = (event: any) => {
    event.stopPropagation();
    setShowOption(!showOption);
  };

  const handleCardClick = () => {
    if (item?.nftAddress && item?.tokenId) {
      router.push(`/nft/${item?.nftAddress}/${item?.tokenId}`);
    }
  };
  const removeButtonClick = (event: any) => {
    event.stopPropagation();
    removeBidData({
      bidType: item?.bidType,
      nftImage: image,
      collectionAddress: item?.nftAddress,
      tokenId: item?.tokenId,
    });
  };
  const dropDownData = [
    {
      title: 'Remove Bid',
      icon: <Delete sx={menuItemIcon} />,
      action: removeButtonClick,
    },
  ];
  return (
    <div
      key={item.id}
      style={{
        ...cardWrapper,
        display: 'flex',
        position: 'relative',
      }}
    >
      <Paper
        onClick={handleCardClick}
        elevation={0}
        style={{
          ...cardWrapper,
          border: '2px solid black',
          backgroundPosition: 'center',
        }}
        onMouseEnter={() => {
          mouseEnter(item);
        }}
        onMouseLeave={() => {
          mouseLeave();
        }}
        sx={show.id === item.id || !hoverTimeout ? cardStyle : cardHoverStyle}
      >
        {enableActions && show.id === item.id && (
          <Dropdown
            handleShow={handleClick}
            show={showOption}
            data={dropDownData}
          />
        )}

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
            Bid Price
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
              {formatNumber(
                Number(ethers.utils.formatEther(item?.priceInWei || '0'))
              )}
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
              {item?.paymentType ? 'THOR' : 'AVAX'}
            </Typography>
          </Box>

          <Box
            width="100%"
            position="absolute"
            bottom="0px"
            p="10px 5px"
            sx={{
              backgroundColor: '#fff',
              backgroundSize: 'cover',
              marginLeft: '-8px',
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
                  }}
                >
                  {getMetaDataName(nftData) || 'ThorFi'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </div>
  );
};

const ActiveBids = ({
  data,
  enableActions = false,
  nftType,
  refetches,
}: ActiveBidsDataType) => {
  const [removeBid, setRemoveBid] = useState({
    bidType: '',
    collectionAddress: '',
    tokenId: '',
    nftImage: '',
  });

  const cancelBidToast = {
    message: 'Bid Cancelling...',
    severity: ToastSeverity.INFO,
    image: removeBid?.nftImage,
    autoHideDuration: 5000,
  };
  const txnToast = {
    message: 'Bid Cancelled',
    severity: ToastSeverity.SUCCESS,
    image: removeBid?.nftImage,
    autoHideDuration: 5000,
  };

  const { data: cancelOtcBidData, write: writeCancelOtcBid } =
    useCancelOtcBid(cancelBidToast);
  const { data: cancelSimpleBidData, write: writeCancelSimpleBid } =
    useCancelBid(cancelBidToast);
  useGetTransaction(
    cancelOtcBidData?.hash || cancelSimpleBidData?.hash,
    txnToast
  );
  useEffect(() => {
    if (removeBid?.bidType === 'OTC') {
      writeCancelOtcBid({
        recklesslySetUnpreparedArgs: [
          removeBid?.collectionAddress,
          removeBid?.tokenId,
        ],
      });
      setRemoveBid({ ...removeBid, bidType: '' });
    } else if (removeBid?.bidType === 'ORDER') {
      writeCancelSimpleBid({
        recklesslySetUnpreparedArgs: [
          removeBid?.collectionAddress,
          removeBid?.tokenId,
        ],
      });
      setRemoveBid({ ...removeBid, bidType: '' });
    }
    refetches();
  }, [removeBid, refetches, writeCancelOtcBid, writeCancelSimpleBid]);

  return (
    <Box sx={activeBidsRoot}>
      <Grid container>
        {data.map((item: NftType, index) => (
          <NFTCard
            key={index}
            item={item}
            enableActions={enableActions}
            nftType={nftType}
            removeBidData={setRemoveBid}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default ActiveBids;
