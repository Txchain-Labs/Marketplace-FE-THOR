import React, { FC, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box } from '@mui/material';

import { Nft } from '@/models/Nft';
import { ActiveBid } from '@/models/Listing';

import { useChain } from '@/utils/web3Utils';
import { useGetUsdFromAvax, useGetUsdFromThor } from '@/hooks/useOracle';

import { CommonLoader } from '@/components/common';
import ActiveBidCard from '@/components/common/thumbnails/ActiveBidCard';
import ReceivedBidCard from '@/components/common/thumbnails/ReceivedBidCard';
import AcceptBid from '@/components/modals/AcceptBid';
import { bidType } from '@/utils/constants';

interface BidsListProps {
  isLoading: boolean;
  nfts: (Nft & ActiveBid)[];
  type: 'activeBid' | 'receivedBid';
  refresh: () => void;
}

const BidsList: FC<BidsListProps> = ({ isLoading, nfts, type, refresh }) => {
  const chain = useChain();

  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const [showAcceptModel, setShowAcceptModal] = useState(false);
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

  const handleAcceptModalClose = () => {
    setShowAcceptModal(!showAcceptModel);
  };

  const acceptBidResponse = (response: any) => {
    if (response?.isSuccess) {
      refresh();
    }
  };

  return (
    <Box mt={'16px'}>
      {isLoading ? (
        <CommonLoader
          size={undefined}
          text={'Loading NFTs...'}
          width={'100%'}
          height={'500px'}
        />
      ) : (
        <Box
          sx={(theme) => ({
            ml: '-16px',
            [theme.breakpoints.down('sm')]: { ml: 0 },
          })}
        >
          {nfts?.map((nft) => (
            <Box
              key={nft.collection_address + nft.token_id}
              sx={(theme) => ({
                float: 'left',
                width: '209px',
                ml: '16px',
                mb: '16px',
                [theme.breakpoints.down('sm')]: {
                  width: 'calc(50vw - 16px)',
                  ml: 0,
                  mb: '8px',
                },
              })}
            >
              {type === 'activeBid' ? (
                <ActiveBidCard
                  nft={nft}
                  avaxPrice={avaxPrice}
                  thorPrice={thorPrice}
                  width={smDown ? 'calc(50vw - 16px)' : undefined}
                />
              ) : (
                <ReceivedBidCard
                  nft={nft}
                  avaxPrice={avaxPrice}
                  thorPrice={thorPrice}
                  width={smDown ? 'calc(50vw - 16px)' : undefined}
                  setAcceptBid={setAcceptBid}
                  setAcceptBidType={setAcceptBidType}
                  setNFTData={setNFTData}
                  handleAcceptModalClose={handleAcceptModalClose}
                  refresh={refresh}
                />
              )}
            </Box>
          ))}
        </Box>
      )}
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

export default BidsList;
