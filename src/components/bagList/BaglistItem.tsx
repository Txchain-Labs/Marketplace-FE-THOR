import { FC } from 'react';
import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useDispatch } from '../../redux/store';
import {
  removeFromBagList,
  removeOnSaleItem,
  selectTabState,
} from '../../redux/slices/bagListSlice';
import { useSelector } from 'react-redux';
// import { formatNumber } from '../../utils/common';

interface BagListItemProps {
  data: any;
  usdPrice: any;
  key: any;
}

const BagListItem: FC<BagListItemProps> = (props) => {
  const { data, key } = props;
  const dispatch = useDispatch();
  const tabState = useSelector(selectTabState);
  const curTabVal = tabState?.tabState;

  const handleRemoveBagList = (
    token_address: string,
    token_id: number | string
  ) => {
    dispatch(removeFromBagList(token_address + token_id));
    if (curTabVal === 1) {
      dispatch(
        removeOnSaleItem({ tokenAddress: token_address, tokenId: token_id })
      );
    }
  };

  return (
    <ListItem
      key={key}
      divider
      sx={{
        'alignItems': 'flex-start',
        '&:hover .bagListRemoveIcon': {
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
            {data.name}
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
            {/* {usdPrice ? formatNumber(usdPrice) : '----'} USD */}
          </Typography>
        }
      />
      <Box sx={{ display: 'none' }} className="bagListRemoveIcon">
        <IconButton
          onClick={() => handleRemoveBagList(data.token_address, data.token_id)}
        >
          <RemoveCircleIcon color="primary" />
        </IconButton>
      </Box>
    </ListItem>
  );
};

export default BagListItem;
