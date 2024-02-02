import { removeItemFromBag, setBagState } from '@/redux/slices/managerBagSlice';
import { Remove } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import ItemDynamicJsx from './ItemDynamicJsx';

interface BagItem {
  data: any;
  index: number;
  pageType: string;
  activeNode: string;
  activeType: string;
}

const BagItem = ({
  data,
  index,
  pageType,
  activeType,
  activeNode,
}: BagItem) => {
  const [isHovering, setIsHovering] = useState(false);
  const dispatch = useDispatch();
  const handleRemoveItem = (data: any) => {
    dispatch(removeItemFromBag(data));
    dispatch(setBagState({ item: data }));
  };
  return (
    <Box
      key={index}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 1,
        gap: 4,
        minHeight: '100px',
        maxHeight: '120px',
        overflow: 'hidden',
        alignItems: 'center',
        px: 2,
        py: 1,
        borderBottom: `2px solid ${theme.palette.divider}`,
      })}
    >
      <Box>
        <Typography mb={0.5} variant="p-lg">
          {data?.name.length > 12
            ? `${data?.name.slice(0, 12)}...`
            : data?.name}
        </Typography>

        <Typography variant="lbl-md">
          {' '}
          {activeType} {activeNode}
        </Typography>
      </Box>
      {/* this should hide on hover */}
      <ItemDynamicJsx
        data={data}
        pageType={pageType}
        activeType={activeType}
        activeNode={activeNode}
        isHovering={isHovering}
      />
      {/* div to appear on hover */}
      <Box
        sx={{
          display: isHovering ? 'flex' : 'none',
          justifyContent: 'flex-end',
          flexGrow: 1,
        }}
      >
        <IconButton
          onClick={() => handleRemoveItem(data)}
          sx={{ color: 'text.secondary' }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: '100%',
              width: '25px',
              height: '25px',
            }}
          >
            <Remove />
          </Box>
        </IconButton>
      </Box>
    </Box>
  );
};

export default BagItem;
