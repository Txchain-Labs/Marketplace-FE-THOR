import {
  Typography,
  Box,
  Drawer,
  Badge,
  useMediaQuery,
  IconButton,
  Button,
  List,
  Divider,
} from '@mui/material';
import { useSelector, useDispatch } from '../../redux/store';
import { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import {
  closeBagListModal,
  selectBagListed,
  selectIsBagListOpen,
  selectTabState,
  resetAll,
  setNFTsRefetching,
} from '../../redux/slices/bagListSlice';
import BagListItem from './BaglistItem';
import { useChain } from '../../utils/web3Utils';
import { useMemo, useState, useEffect } from 'react';
import { BigNumberish, ethers } from 'ethers';
import { useGetUsdFromAvax, useGetUsdFromThor } from '../../hooks/useOracle';
// import { formatNumber } from '../../utils/common';
import BatchListNFTModal from '../modals/BatchListNFTModal';
import { useUnListNFT } from '@/hooks/useNFTDetail';
import { useGetTransaction } from '@/hooks/Marketplace';
import { ToastSeverity } from '@/redux/slices/toastSlice';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -15,
    top: '50%',
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 6px',
  },
}));

const BagListDrawer = () => {
  const chain = useChain();
  const dispatch = useDispatch();

  const [, setTotalPrice] = useState(Number(0));
  const [isOpen, setIsOpen] = useState(false);
  // const [displayBagList, setDisplayBagList] = useState([]);

  const isBagListModalOpen = useSelector(selectIsBagListOpen);
  const bagListed = useSelector(selectBagListed);
  const tabState = useSelector(selectTabState);
  const curTabVal = tabState?.tabState;
  const ownedBagList = tabState?.ownedBagListed;
  const onsaleBagList = tabState?.onsaleBagListed;
  const unListNFTToast = {
    message: 'NFTs Unlisting...',
    severity: ToastSeverity.INFO,
    image: bagListed?.length
      ? bagListed[0]?.image
      : '/images/nft-placeholder.png',
    autoHideDuration: 5000,
    itemCount: bagListed ? bagListed?.length : 0,
  };
  const txnToast = {
    message: 'NFTs Unlisted',
    severity: ToastSeverity.SUCCESS,
    image: bagListed?.length
      ? bagListed[0]?.image
      : '/images/nft-placeholder.png',
    autoHideDuration: 5000,
    itemCount: bagListed ? bagListed?.length : 0,
  };
  const { data: unlistTransactionData, write: unListNFTWrite } =
    useUnListNFT(unListNFTToast);

  const { isSuccess: transactionSuccess } = useGetTransaction(
    unlistTransactionData?.hash,
    txnToast
  );
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  const [nftsToList, setNFTsToList] = useState([]);
  useEffect(() => {
    if (transactionSuccess) {
      dispatch(resetAll());
      dispatch(setNFTsRefetching());
    }
  }, [transactionSuccess, dispatch]);
  // useEffect(() => {
  //   // const display = bagListed.filter(()=>);
  //   const cur_nfts = curTabVal === 0 ? ownedBagList : onsaleBagList;

  //   const _displayBagList = bagListed?.filter((bag_item) =>
  //     cur_nfts?.find((cur_item) => bag_item.token_id === cur_item.token_id)
  //   );

  //   console.log(123333, curTabVal, cur_nfts, _displayBagList);
  //   if (JSON.stringify(_displayBagList) !== JSON.stringify(displayBagList)) {
  //     setDisplayBagList(_displayBagList);
  //   }
  // }, [bagListed, curTabVal, displayBagList, onsaleBagList, ownedBagList]);

  const usdPriceById = useMemo(() => {
    if (!bagListed) {
      return undefined;
    }

    const map = new Map();
    let totalUsdPrice = 0;
    bagListed.forEach((item: any) => {
      let usdPrice;
      if (item && item?.priceInWei) {
        usdPrice =
          Number(ethers.utils.formatEther(item?.priceInWei)) *
          (item?.paymentType === '0'
            ? avaxPrice
              ? Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
              : 0
            : thorPrice
            ? Number(ethers.utils.formatEther(thorPrice as BigNumberish))
            : 0);
      } else {
        usdPrice = 0;
      }
      totalUsdPrice += usdPrice;
      map.set(item?.id, usdPrice);
    });

    setTotalPrice(totalUsdPrice);

    return map;
  }, [bagListed, avaxPrice, thorPrice]);

  const matches = useMediaQuery('(max-width:600px)');

  const handleCloseBagListModal = () => {
    dispatch(closeBagListModal());
  };

  const handleResetAllBagList = () => {
    dispatch(resetAll());
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleBatchListModal = () => {
    const result = ownedBagList?.map((item: any) => ({
      token_id: item?.token_id,
      // image: getIpfsPublicUrl(item?.image),
      image: item?.image,
      name: item?.name,
      token_address: item?.token_address,
    }));
    setNFTsToList(result ? result : []);
    dispatch(closeBagListModal());
    setIsOpen(true);
  };

  const handleBatchUnListModal = () => {
    if (onsaleBagList.length) {
      const token_address: any[] = [];
      const token_id: any[] = [];
      onsaleBagList?.map((item: any) => {
        token_id.push(item.token_id);
        token_address.push(item.token_address);
      });
      dispatch(closeBagListModal());
      unListNFTWrite({
        recklesslySetUnpreparedArgs: [token_address, token_id],
      });
    }
  };
  return (
    <>
      <Drawer
        anchor="right"
        open={isBagListModalOpen}
        onClose={handleCloseBagListModal}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundImage: 'none',
            boxSizing: 'border-box',
            width: matches ? '100%' : 375,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            padding: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <StyledBadge
            badgeContent={
              curTabVal === 0 ? ownedBagList?.length : onsaleBagList?.length
            }
            color="primary"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                lineHeight: '60px',
              }}
            >
              Bag {curTabVal === 0 ? 'List' : 'Unlist'}
            </Typography>
          </StyledBadge>
          <Box>
            {((curTabVal === 0 && ownedBagList?.length > 0) ||
              (curTabVal === 1 && onsaleBagList?.length > 0)) && (
              <Button
                variant="text"
                sx={{ textTransform: 'none' }}
                onClick={handleResetAllBagList}
              >
                Reset All
              </Button>
            )}
            {matches && (
              <IconButton onClick={handleCloseBagListModal}>
                <ArrowRightAltIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        <Divider />
        <List sx={{ flexGrow: 1, overflow: 'auto' }} disablePadding>
          {ownedBagList?.length === 0 && onsaleBagList?.length === 0 && (
            <Typography
              variant="lbl-md"
              sx={{
                color: 'text.secondary',
                padding: '20px',
                textAlign: 'center',
                lineHeight: '22px',
              }}
            >
              Add items to get started.
            </Typography>
          )}

          {curTabVal === 0 &&
            ownedBagList?.map((item: any) => (
              <BagListItem
                data={item}
                usdPrice={usdPriceById.get(item.id)}
                key={item.id}
              />
            ))}
          {curTabVal === 1 &&
            onsaleBagList?.map((item: any) => (
              <BagListItem
                data={item}
                usdPrice={usdPriceById.get(item.id)}
                key={item.id}
              />
            ))}
        </List>

        <Box sx={{ p: '16px', width: '100%' }}>
          {curTabVal === 0 && (
            <Button
              disabled={ownedBagList?.length === 0}
              sx={{
                display: 'flex',
                borderRadius: '0%',
              }}
              variant="contained"
              fullWidth
              onClick={handleBatchListModal}
            >
              List Nft
            </Button>
          )}
          {curTabVal === 1 && (
            <Button
              disabled={onsaleBagList?.length === 0}
              sx={{
                display: 'flex',
                borderRadius: '0%',
              }}
              variant={'outlined'}
              color={'secondary'}
              fullWidth
              onClick={handleBatchUnListModal}
            >
              Unlist Nft
            </Button>
          )}
        </Box>
      </Drawer>
      <BatchListNFTModal
        open={isOpen}
        handleClose={handleClose}
        nfts={nftsToList}
      />
    </>
  );
};

export default BagListDrawer;
