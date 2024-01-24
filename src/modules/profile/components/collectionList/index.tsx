import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

import { root } from './style';

type Props = {
  collections: any[];
  loading: boolean;
};

const CollectionList = (props: Props) => {
  const { collections } = props;
  return (
    <Box style={{ overflow: 'auto' }}>
      {collections.map((item) => (
        <Box sx={root} key={Math.random()}>
          <Avatar src={item.image} sx={{ height: 60, width: 60 }} />
          <Box>
            <Typography variant="p-lg">{item.name}</Typography>
            <Typography variant="p-lg" color="secondary.yellow">
              @ZmBM
            </Typography>
          </Box>
          <Box>
            <Typography variant="sub-h">10</Typography>
            <Typography variant="p-md-bk">items</Typography>
          </Box>
          <Box>
            <Typography variant="sub-h">5{/* {item.owner} */}</Typography>
            <Typography variant="p-md-bk">owners</Typography>
          </Box>
          <Box>
            <Typography variant="sub-h">10</Typography>
            <Typography variant="p-md-bk">total volume</Typography>
          </Box>
          <Box>
            <Typography variant="sub-h">10</Typography>
            <Typography variant="p-md-bk">floor price</Typography>
          </Box>
          <Box>
            <Typography variant="sub-h">10</Typography>
            <Typography variant="p-md-bk">best Offer</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CollectionList;
