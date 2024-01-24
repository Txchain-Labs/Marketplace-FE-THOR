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
  closeCartModal,
  selectCarted,
  selectIsCartOpen,
  resetAll,
} from '../../redux/slices/cartSlice';
import CartItem from './CartItem';
import { useChain } from '../../utils/web3Utils';
import { useMemo, useState } from 'react';
import { BigNumberish, ethers } from 'ethers';
import { useGetUsdFromAvax, useGetUsdFromThor } from '../../hooks/useOracle';
import { formatNumber } from '../../utils/common';
import BatchBuyNFTModal from '../modals/BatchBuyNFTModal';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -15,
    top: '50%',
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 6px',
  },
}));

const CartDrawer = () => {
  const chain = useChain();
  const dispatch = useDispatch();

  const [totalPrice, setTotalPrice] = useState(Number(0));
  const [isOpen, setIsOpen] = useState(false);

  const isCartModalOpen = useSelector(selectIsCartOpen);
  const carted = useSelector(selectCarted);

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const usdPriceById = useMemo(() => {
    if (!carted) {
      return undefined;
    }

    const map = new Map();
    let totalUsdPrice = 0;
    carted.forEach((item: any) => {
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
  }, [carted, avaxPrice, thorPrice]);

  const matches = useMediaQuery('(max-width:600px)');

  const handleCloseCartModal = () => {
    dispatch(closeCartModal());
  };

  const handleResetAllCart = () => {
    dispatch(resetAll());
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleBatchBuyModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={isCartModalOpen}
        onClose={handleCloseCartModal}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          'zIndex': 10002,
          '& .MuiDrawer-paper': {
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
            badgeContent={carted?.length}
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
              Cart
            </Typography>
          </StyledBadge>
          <Box>
            {carted?.length > 0 && (
              <Button
                variant="text"
                sx={{ textTransform: 'none' }}
                onClick={handleResetAllCart}
              >
                Reset All
              </Button>
            )}
            {matches && (
              <IconButton onClick={handleCloseCartModal}>
                <ArrowRightAltIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        <Divider />
        <List sx={{ flexGrow: 1, overflow: 'auto' }} disablePadding>
          {carted?.length === 0 ? (
            <Typography
              variant="lbl-md"
              sx={{
                color: '#808080',
                padding: '20px',
                textAlign: 'center',
                lineHeight: '22px',
              }}
            >
              Add items to get started.
            </Typography>
          ) : (
            <>
              {carted?.map((item: any) => (
                <CartItem
                  data={item}
                  usdPrice={usdPriceById.get(item.id)}
                  key={item.id}
                />
              ))}
            </>
          )}
        </List>

        <Box sx={{ p: '16px', width: '100%' }}>
          {carted?.length === 0 ? (
            <></>
          ) : (
            <Box
              sx={{
                display: 'flex',
                pb: '16px',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="lbl-lg"
                sx={{ lineHeight: '28px', fontSize: '24px' }}
              >
                Total price
              </Typography>
              <Typography
                variant="lbl-lg"
                sx={{ lineHeight: '28px', fontSize: '24px' }}
              >
                {totalPrice ? formatNumber(totalPrice) : '----'} USD
              </Typography>
            </Box>
          )}
          <Button
            disabled={carted?.length === 0}
            sx={{
              display: 'flex',
              borderRadius: '0%',
              width: '100%',
              maxWidth: '100%',
            }}
            variant="contained"
            onClick={handleBatchBuyModal}
          >
            <Typography variant="lbl-md">Complete purchase</Typography>
          </Button>
        </Box>
      </Drawer>
      {isOpen && carted.length > 0 ? (
        <BatchBuyNFTModal
          open={isOpen}
          handleClose={handleClose}
          totalUsdPrice={totalPrice}
          nfts={carted.map((cartedItem: any) => ({
            ...cartedItem,
            usdPrice: usdPriceById.get(cartedItem.id),
          }))}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default CartDrawer;
