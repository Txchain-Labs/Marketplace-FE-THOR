import { FC, useMemo } from 'react';
import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useDispatch } from '../../redux/store';
import { removeFromCart } from '../../redux/slices/cartSlice';
import { useGetNodeRewards, useGetVrrLog } from '../../hooks/useNodes';
import { formatWei } from '../../utils/web3Utils';
import { formatNumber } from '../../utils/common';
import { BigNumberish, ethers } from 'ethers';

interface CartItemProps {
  data: any;
  usdPrice: any;
}

const CartItem: FC<CartItemProps> = (props) => {
  const { data, usdPrice } = props;
  const dispatch = useDispatch();

  const { data: rewards } = useGetNodeRewards(
    data.type !== 'ARTWORK' && data.nftAddress,
    data.type !== 'ARTWORK' && data.tokenId,
    data.type
  );

  const { data: vrrLog } = useGetVrrLog(
    data.type !== 'ARTWORK' && data.nftAddress,
    data.type !== 'ARTWORK' && data.tokenId,
    data.type
  );

  console.log('--- vrrLog: ---' + JSON.stringify(vrrLog));

  const formatedRewards = useMemo(
    () => (rewards ? formatWei(rewards as string, 18, 3) : '0'),
    [rewards]
  );

  const handleRemoveCart = (id: string) => {
    dispatch(removeFromCart(id));
  };

  return (
    <ListItem
      divider
      sx={{
        'alignItems': 'center',
        '&:hover': {
          backgroundColor: '#F8F8F8',
          pr: 0,
        },
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
            {data.metadata?.name}
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
            {usdPrice ? formatNumber(usdPrice) : '----'} USD
          </Typography>
        }
        secondary={
          data.type !== 'ARTWORK' && (
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
                    )
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
      <Box sx={{ display: 'none' }} className="CartRemoveIcon">
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
