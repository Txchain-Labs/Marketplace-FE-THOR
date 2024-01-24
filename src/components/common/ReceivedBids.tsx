import { useEffect, useMemo, useState } from 'react';
import { Typography, Box, Paper, Grid } from '@mui/material';
import { ReceivedBidsDataType, NftType } from '../../utils/types';
import { useGetNFTDetail, useUnListNFT } from '../../hooks/useNFTDetail';
import { useRouter } from 'next/router';
import { BigNumberish, ethers } from 'ethers';
import {
  activeBidsRoot,
  cardWrapper,
  cardHover,
  cardstyle,
} from '../../styles/ActiveBids';
import { getMetaData, getMetaDataName, formatNumber } from '../../utils/common';
import { GridView, OfflinePin } from '@mui/icons-material';
import { palette } from '../../../src/theme/palette';
import { badgeStyle } from '../../styles/ReceivedBids';
import { useGetUsdFromAvax, useGetUsdFromThor } from '../../hooks/useOracle';
import { useChain } from '../../utils/web3Utils';
import AcceptBid from '../modals/AcceptBid';
import { bidType } from '../../utils/constants';
import { formatDecimals } from '../../shared/utils/utils';
import { ToastSeverity } from '../../redux/slices/toastSlice';
import { useGetTransaction } from '../../hooks/Marketplace';
import Dropdown from './Dropdown';
import { menuItemIcon } from '../../styles/profile';

const NFTCard = ({
  item,
  enableActions,
  avaxPrice,
  thorPrice,
  acceptBidData,
  acceptBidType,
  nftDetail,
  handleAcceptModalClose,
  refetchRecords,
}: any) => {
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
  const name = getMetaDataName(nftData);
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
  const higherPriceUSD = useMemo(() => {
    if (item && (item as any).priceInWei) {
      return (
        Number(ethers.utils.formatEther((item as any)?.priceInWei)) *
        ((item as any)?.paymentType === '0'
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
  }, [thorPrice, avaxPrice, item]);
  const listPriceUSD = useMemo(() => {
    if (item && (item as any).listingPrice) {
      return (
        Number(ethers.utils.formatEther((item as any)?.listingPrice)) *
        ((item as any)?.listingPricePaymentType === '1'
          ? thorPrice
            ? Number(ethers.utils.formatEther(thorPrice as BigNumberish))
            : 0
          : avaxPrice
          ? Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
          : 0)
      );
    } else {
      return 0;
    }
  }, [thorPrice, avaxPrice, item]);
  const acceptBidButton = (event: any) => {
    event.stopPropagation();
    acceptBidData({
      bidPrice: formatDecimals(item?.priceInWei, 18, true),
      bidExpiresAt: item?.expiresAt.toString(),
      paymentType: item?.paymentType ? item?.paymentType : 0,
    });
    acceptBidType(item?.bidType === 'OTC' ? bidType.OTC : bidType.DEFAULT);
    nftDetail({
      nftName: name,
      by: 'Thorfi',
      nftImage: image,
      nftAddress: item?.nftAddress,
      tokenId: item?.tokenId,
    });
    handleAcceptModalClose();
  };
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

  const { isSuccess: unlistTransactionSuccess } = useGetTransaction(
    unlistTransactionData?.hash,
    txnToast
  );
  const handleUnlistNFT = async (event: any) => {
    event.stopPropagation();
    await unListNFTWrite({
      recklesslySetUnpreparedArgs: [item?.nftAddress, item?.tokenId],
    });
  };
  useEffect(() => {
    refetchRecords();
  }, [unlistTransactionSuccess, refetchRecords]);
  const dropDownData = [
    {
      title: 'Accept Higher Bids',
      icon: <OfflinePin sx={menuItemIcon} />,
      action: acceptBidButton,
    },
  ];
  if (item?.bidType === 'ORDER') {
    dropDownData.push({
      title: 'Unlist',
      icon: <GridView sx={menuItemIcon} />,
      action: handleUnlistNFT,
    });
  }
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
          justifyContent="center"
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
            List Price
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
              {item?.listingPrice ? formatNumber(listPriceUSD) : '---'}
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
              fontSize: '1.1em',
              fontWeight: '700',
              lineHeight: '1.137em',
              letterSpacing: '0em',
              textAlign: 'left',
              color: 'black',

              paddingTop: 1,
            }}
          >
            Higher bid
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
              {formatNumber(higherPriceUSD)}
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
          <Box
            width="100%"
            position="absolute"
            bottom="0px"
            p="10px 5px"
            sx={{
              // backgroundColor: '#fff',
              backgroundSize: 'cover',
              marginLeft: '-8px',
              opacity: show.id === item.id ? '1' : '0.6',
            }}
          >
            <Box
              display="flex"
              padding="0 20px"
              justifyContent="space-between"
              alignItems="baseline"
              sx={{
                marginBottom: '5px',
              }}
            >
              <Box display="flex" alignItems={'center'}>
                {/* <img
                  width={'18.77px'}
                  height={'18.77px'}
                  src="/images/logo.svg"
                /> */}
                <Typography
                  variant="lbl-md"
                  sx={{
                    color: palette.primary.storm,
                  }}
                >
                  {name || 'ThorFi'}
                </Typography>
              </Box>
              <Box sx={badgeStyle}>
                <Typography variant="badge" sx={{ color: palette.primary.ash }}>
                  {item?.bidType === 'OTC' ? 'Private' : 'Simple'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </div>
  );
};
const ReceivedBids = ({
  data,
  enableActions = false,
  nftType,
  refetches,
}: ReceivedBidsDataType) => {
  const chain = useChain();
  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const [showAcceptModel, setShowAcceptModal] = useState(false);
  const handleAcceptModalClose = () => {
    setShowAcceptModal(!showAcceptModel);
  };
  const [acceptBid, setAcceptBid] = useState({
    bidPrice: '0',
    bidExpiresAt: null,
    paymentType: null,
  });
  const [acceptBidType, setAcceptBidType] = useState(bidType.DEFAULT);
  const [nftData, setNFTData] = useState({
    nftName: '',
    by: '',
    nftImage: '',
    nftAddress: '',
    tokenId: '',
  });

  const acceptBidResponse = (response: any) => {
    if (response?.isSuccess) {
      refetches();
    }
  };

  return (
    <Box sx={activeBidsRoot}>
      <Grid container>
        {data.map((item: NftType, index) => (
          <NFTCard
            key={index}
            item={item}
            enableActions={enableActions}
            nftType={nftType}
            thorPrice={thorPrice}
            avaxPrice={avaxPrice}
            acceptBidData={setAcceptBid}
            acceptBidType={setAcceptBidType}
            nftDetail={setNFTData}
            handleAcceptModalClose={handleAcceptModalClose}
            refetchRecords={refetches}
          />
        ))}
      </Grid>
      <AcceptBid
        open={showAcceptModel}
        handleClose={handleAcceptModalClose}
        bidData={acceptBid}
        acceptBidType={acceptBidType}
        nftData={nftData}
        acceptBidResponse={acceptBidResponse}
      />
    </Box>
  );
};
export default ReceivedBids;
