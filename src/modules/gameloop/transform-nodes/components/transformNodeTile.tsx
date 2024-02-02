import React, { FC } from 'react';
import ConnectingLoader from '../../../../components/common/ConnectingLoader';
import { Box, Typography } from '@mui/material';
import { getNodeGifs } from '@/modules/manager/Helper';

interface TransformNodeTileProps {
  type: string;
  price: string;
  name: string;
  pendingReward: string;
  isSelected: boolean;
  onClick?: any;
  pageType: string;
  tier: string;
}

const TransformNodeTile: FC<TransformNodeTileProps> = (props) => {
  const {
    type,
    price,
    name,
    pendingReward,
    isSelected,
    onClick,
    pageType,
    tier,
  } = props;

  const loading = false;
  type;

  return (
    <>
      {loading ? (
        <ConnectingLoader size={undefined} />
      ) : (
        <Box
          sx={{
            'position': 'relative',
            // 'width': !isMobile ? '99.75%' :"70%",
            'height': {
              miniMobile: '12em',
              xs: '12.5em',
              sm: '12.5em',
              md: '20em',
            },
            'width': {
              miniMobile: '12em',
              xs: '12.5em',
              sm: '12.5em',
              md: '20em',
            },
            'aspectRatio': '1/1',

            'padding': '0.5em',
            'cursor': `url("/images/cursor-pointer.svg"), auto`,
            'border': isSelected ? '3px solid #F3523F' : '0',

            '&::before': {
              content: '""',
              backgroundImage: isSelected
                ? 'none'
                : `url("${getNodeGifs(pageType, type, tier)}")`,
              backgroundColor: isSelected ? 'white' : 'none',
              backgroundSize: 'cover',
              position: 'absolute',
              top: '0px',
              right: '0px',
              left: '0px',
              bottom: '0px',

              opacity: 0.3,
            },
          }}
          onClick={onClick ? onClick : null}
        >
          <Box
            sx={{
              position: 'relative',
              // background: 'red',
              height: '100vh',
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: 'Nexa-Bold',
                  fontSize: '0.85em',
                  lineHeight: '1.137em',
                  letterSpacing: '0em',
                  textAlign: 'left',
                  color: 'black',

                  marginTop: { sm: '50px', miniMobile: '0px' },
                  marginBottom: '6px',
                  marginLeft: '10px',
                }}
              >
                PRICE
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  sx={{
                    fontFamily: 'Nexa-Bold',
                    fontSize: { miniMobile: '1.8em', md: '2.5em' },
                    letterSpacing: '-0.04em',
                    textAlign: 'left',
                    color: 'black',

                    marginTop: '10px',
                    marginLeft: '10px',
                  }}
                >
                  {Number(price) ? price : '----'}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontSize: '0.85em',
                    fontWeight: '700',
                    lineHeight: '0.75em',
                    letterSpacing: '0em',
                    textAlign: 'left',
                    color: 'black',
                    pl: 1,

                    marginTop: '10px',
                    marginLeft: '10px',
                  }}
                >
                  USD
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontFamily: 'Nexa-Bold',
                  fontSize: '0.9em',
                  lineHeight: '12.3px',
                  letterSpacing: '0em',
                  textAlign: 'left',
                  color: 'black',

                  marginTop: '10px',
                  marginLeft: '10px',
                }}
              >
                {pendingReward} THOR Pending Rewards
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              left: '5px',
              bottom: '5px',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              width: '143px',

              marginTop: '20px',
              marginLeft: '10px',
            }}
          >
            {name}
          </Box>
        </Box>
      )}
    </>
  );
};

export default TransformNodeTile;
