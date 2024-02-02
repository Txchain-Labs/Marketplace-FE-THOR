import { FC, useMemo } from 'react';
import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useDispatch, useSelector } from '@/redux/store';
import { removeFromCart } from '@/redux/slices/cartSlice';
import { useGetNodeRewards, useGetVrrLog } from '@/hooks/useNodes';
import { formatWei, useChain } from '@/utils/web3Utils';
import { formatNumber } from '@/utils/common';
import { Listing } from '@/models/Listing';
import { useGetUsdFromAvax, useGetUsdFromThor } from '@/hooks/useOracle';
import { BigNumberish, ethers } from 'ethers';
import { formatPriceByDefaultCurrency } from '@/utils/helper';

interface CartItemProps {
  data: Listing;
  key: any;
}

const CartItem: FC<CartItemProps> = (props) => {
  const { data, key } = props;
  const dispatch = useDispatch();

  const chain = useChain();

  const user = useSelector((state: any) => state?.auth.user);

  const { data: rewards } = useGetNodeRewards(
    data.assetsType === '1' && data.nodeType === '0' && data.nftAddress,
    data.assetsType === '1' && data.nodeType === '0' && data.tokenId,
    'ORIGIN'
  );

  const { data: vrrLog } = useGetVrrLog(
    data.assetsType === '1' && data.nodeType === '0' && data.nftAddress,
    data.assetsType === '1' && data.nodeType === '0' && data.tokenId
  );

  const formatedRewards = useMemo(
    () => (rewards ? formatWei(rewards as string, 18, 3) : '0'),
    [rewards]
  );

  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);

  const listingUSD = useMemo(() => {
    if (data && (data as any).priceInWei) {
      return formatPriceByDefaultCurrency(
        (data as any)?.priceInWei,
        (data as any)?.paymentType,
        user?.default_currency,
        avaxPrice,
        thorPrice
      );
    } else {
      return 0;
    }
  }, [thorPrice, avaxPrice, data, user?.default_currency]);

  const handleRemoveCart = (id: string) => {
    dispatch(removeFromCart(id));
  };

  return (
    <ListItem
      key={key}
      divider
      sx={{
        'alignItems': 'flex-start',
        '&:hover .CartRemoveIcon': {
          display: 'block',
        },
      }}
    >
      <ListItemText
        primary={
          <Typography
            sx={{
              lineHeight: '28px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginRight: '8px',
              maxWidth: '120px',
            }}
            variant={'lbl-lg'}
          >
            {data?.metadata.name}
          </Typography>
        }
        secondary={
          <Typography
            sx={{
              lineHeight: '22px',
            }}
            component="span"
            variant="lbl-md"
          >
            {data.metadata?.description}
          </Typography>
        }
      />
      <ListItemText
        sx={{ flexGrow: '0', textAlign: 'right' }}
        primary={
          <Typography sx={{ lineHeight: '28px' }} variant="lbl-lg">
            {listingUSD ? formatNumber(listingUSD) : '----'}{' '}
            {user?.default_currency
              ? user?.default_currency.replace('USDC', 'USD')
              : 'USD'}
          </Typography>
        }
        secondary={
          data.assetsType === '1' &&
          data.nodeType === '0' && (
            <>
              <Typography
                component="span"
                variant="p-sm"
                sx={{
                  lineHeight: '18px',
                  whiteSpace: 'nowrap',
                }}
              >
                {vrrLog
                  ? Number(
                      ethers.utils.formatEther(
                        (vrrLog as any).vrr as BigNumberish
                      )
                    ).toFixed(5)
                  : ''}{' '}
                THOR PER DAY
              </Typography>
              <Typography
                component="span"
                variant="p-sm"
                sx={{
                  lineHeight: '18px',
                  whiteSpace: 'nowrap',
                }}
              >
                {formatedRewards} THOR PENDING REWARDS
              </Typography>
            </>
          )
        }
      />
      <Box sx={{ pt: '18px', display: 'none' }} className="CartRemoveIcon">
        <IconButton
          onClick={() => handleRemoveCart(data.nftAddress + data.tokenId)}
        >
          <RemoveCircleIcon color="primary" />
        </IconButton>
      </Box>
    </ListItem>
  );
};

export default CartItem;
