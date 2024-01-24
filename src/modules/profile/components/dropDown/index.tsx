import * as React from 'react';
import { Box, Container, Typography } from '@mui/material';

const data = [
  {
    icon: '/images/avaxIcon.png',
    title: 'AVAX',
    price: 0.0719,
    total: '$239.91',
  },
  {
    icon: '/images/thorIcon.png',
    title: 'THOR',
    price: 0.0719,
    total: '$239.91',
  },
  {
    icon: '/images/dollarIcon.png',
    title: 'USDCE',
    price: 239.91,
    total: '$239.91',
  },
];

const DropDown = () => {
  return (
    <Box sx={{ maxWidth: '300px', width: '100%' }}>
      <Container>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
            borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <Box>
              <img src="/images/metaIcon.png" />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                ml: 2,
              }}
            >
              <Typography sx={{ fontSize: '12px' }}>ETHEREUM</Typography>
              <Typography sx={{ fontSize: '14px' }}>0xf3b81...c578</Typography>
            </Box>
          </Box>

          <Box sx={{ mr: 2 }}>
            <img src="/images/3dots.png" />
          </Box>
        </Box>
        {data.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 1,
            }}
          >
            <Box sx={{ display: 'flex', ml: 1 }}>
              <Box>
                <img src={item.icon} />
              </Box>
              <Box sx={{ ml: 2 }}>
                <Typography sx={{ fontSize: '14px', ml: 1 }}>
                  {item.title}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                mr: 1,
              }}
            >
              <Typography sx={{ fontSize: '14px' }}>{item.price}</Typography>
              <Typography sx={{ fontSize: '10px' }}>{item.total}</Typography>
            </Box>
          </Box>
        ))}
      </Container>
    </Box>
  );
};
export default DropDown;
