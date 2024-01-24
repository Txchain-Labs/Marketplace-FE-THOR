import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { dottedAddress } from '../../shared/utils/utils';
import { formatWei } from '../../utils/web3Utils';
import { Listing } from '../../models/Listing';

interface ThorfiNFTTileProps {
  listing: Listing;
  type: string | undefined;
  contract: string | undefined;
  selectedTile: number | null;
  setSelectedTile: any;
  chain: any;
  user: any;
}

const ThorfiNFTTile: FC<ThorfiNFTTileProps> = (props) => {
  const { listing, type, selectedTile, setSelectedTile } = props;
  // const [selected, setSelected] = useState(false);
  return (
    <Box
      sx={{
        background: 'white',
        // height: { xs: '13em', sm: '13em', md: '13em', lg: '14em', xl: '15em' },
        border:
          selectedTile && selectedTile.toString() === listing.tokenId
            ? '5px solid #F3523F'
            : '1px solid #000000',
        aspectRatio: '1/1',
        padding: '1em',
        cursor: 'pointer',
      }}
      onClick={() =>
        setSelectedTile(
          selectedTile && selectedTile.toString() === listing.tokenId
            ? null
            : listing.tokenId
        )
      }
    >
      <Typography
        sx={{
          fontFamily: 'Nexa',
          fontSize: '11px',
          fontWeight: '400',
          lineHeight: '16.68px',
          letterSpacing: '4%',
          textAlign: 'left',
          pb: 2,
        }}
      >
        LISTED 12/22/22
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Nexa',
            fontSize: '12px',
            fontWeight: '500',
            lineHeight: '24px',
            letterSpacing: '-2%',
            textAlign: 'left',
          }}
        >
          ORIGIN
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Nexa',
            fontSize: '24px',
            fontWeight: '700',
            lineHeight: '24px',
            letterSpacing: '-2%',
            textAlign: 'left',
          }}
        >
          {type === 'keys' ? 'KEYCARD' : 'CAPSULE'}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Nexa',
            fontSize: '10px',
            fontWeight: '400',
            lineHeight: '15.16px',
            letterSpacing: '0',
            textAlign: 'left',
          }}
        >
          {dottedAddress(listing.sellerAddress)}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          paddingTop: '30%',
          float: 'right',
        }}
      >
        {/* paddingTop: '40%', float: 'right'  */}
        <Typography
          sx={{
            fontFamily: 'Nexa',
            fontSize: '22px',
            fontWeight: '800',
            lineHeight: '33.35px',
            letterSpacing: '-2%',
            textAlign: 'right',
            paddingRight: 0.5,
          }}
        >
          {formatWei(listing.priceInWei)}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Nexa',
            fontSize: '12px',
            fontWeight: '400',
            lineHeight: '16px',
            letterSpacing: '4%',
            textAlign: 'right',
          }}
        >
          AVAX
        </Typography>
      </Box>
    </Box>
  );
};

export default ThorfiNFTTile;
