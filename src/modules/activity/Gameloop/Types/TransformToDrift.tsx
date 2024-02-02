import { useGetUserByAddress } from '@/hooks/useNFTDetail';
import { dottedAddress } from '@/shared/utils/utils';
import { getIpfsPublicUrl } from '@/utils/common';
import { ArrowRight } from '@mui/icons-material';
import {
  Box,
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { ethers } from 'ethers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Countdown from '../../Countdown';
import { useGetCollectionByAddr } from '@/hooks/useCollections';
interface Props {
  data: any;
  index: number;
}
const TransformToDrift = ({ data, index }: Props) => {
  const { data: user } = useGetUserByAddress(data?.user);
  const { data: collection } = useGetCollectionByAddr(
    data?.metadata?.nftAddress
  );
  const mdBreakPoint = useMediaQuery('(max-width:900px)');
  const router = useRouter();
  const handleUserProfileRedirect = (userAddress: string | undefined) => {
    router.push(`/profile/${userAddress}`);
  };
  const getMultiplier = (attributes: any) => {
    if (attributes?.length) {
      if (attributes?.[0]?.trait_type === 'VRR Multiplier') {
        return attributes?.[0]?.value / 10;
      }
    }
    return '';
  };
  return (
    <TableRow
      sx={{
        'cursor': 'pointer',
        '&:hover .MuiTableCell-root': {
          bgcolor: 'action.hover',
        },
      }}
      key={index}
    >
      <TableCell
        key={`col-action-${index}`}
        sx={{
          position: 'sticky',
          bgcolor: 'background.paper',
          left: 0,
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            minWidth: mdBreakPoint ? '180px !important' : '',
            alignItems: 'center',
          }}
        >
          <img
            src="/images/activityPanel/gameloop/TRANSFORM.svg"
            width={25}
            height={25}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flexGrow: 1,
            }}
          >
            <Link target={'_blank'} href="/gameloop/transform2drift">
              <Typography
                variant="body1"
                sx={{
                  'fontWeight': 700,
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Transform to Drift
              </Typography>
            </Link>
            <Typography
              variant="body1"
              sx={{
                fontSize: '12px',
                fontWeight: 300,
                color: 'text.secondary',
              }}
            >
              Origin {collection?.name.split('Thorfi Drift ')[1]} Node
            </Typography>
          </Box>
          <ArrowRight
            style={{
              fontSize: '32px',
            }}
          />
        </Box>
      </TableCell>
      <TableCell key={`col-collection-${index}`}>
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <Box sx={{ position: 'relative', width: '36px', height: '36px' }}>
            <img
              src={
                getIpfsPublicUrl(data?.metadata?.image) ||
                '/images/nftImage.png'
              }
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                borderRadius: '50%',
                width: '36px',
                height: '36px',
              }}
            />
            <Box
              sx={{
                width: '15px',
                height: '15px',
                position: 'absolute',
                right: 0,
                bottom: 0,
              }}
            >
              <img
                src={
                  getIpfsPublicUrl(collection?.profile_image) ||
                  '/images/nftImage.png'
                }
                // layout="fill"
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                  width: '15px',
                  height: '15px',
                  boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
                  filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.3))',
                  border: '1px solid #ffff',
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Link
              target={'_blank'}
              href={`/nft/${data?.metadata?.nftAddress}/${data?.metadata?.tokenId}`}
            >
              <Typography
                variant="body1"
                sx={{
                  'fontWeight': 700,
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {data?.metadata?.name}
              </Typography>
            </Link>
            <Link
              target={'_blank'}
              href={`/collection/${data?.metadata?.nftAddress}`}
            >
              <Typography
                variant="body1"
                sx={{
                  'fontSize': '12px',
                  'fontWeight': 300,
                  'color': 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {collection?.name}
              </Typography>
            </Link>
          </Box>
          <Box
            sx={(theme) => ({
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: '24px',
              padding: '1px 8px',
              flexShrink: 0,
            })}
          >
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {' '}
              {getMultiplier(data?.metadata?.attributes)}X MULTIPLIER
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell key={`col-user-${index}`}>
        {data?.user !== ethers.constants.AddressZero ? (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Box sx={{ position: 'relative', width: '36px', height: '36px' }}>
              <img
                src={user?.profile_picture || '/images/profile-pic.svg'}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                onClick={() => handleUserProfileRedirect(user?.address)}
                variant="body1"
                sx={{
                  'fontWeight': 700,
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {user?.username}
              </Typography>
              <Typography
                onClick={() => handleUserProfileRedirect(user?.address)}
                variant="body1"
                sx={{
                  'fontSize': '12px',
                  'fontWeight': 300,
                  'color': 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {dottedAddress(user?.address)}
              </Typography>
            </Box>
          </Box>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell key={`col-age-${index}`}>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          <Countdown timestamp={data?.timestamp} />
        </Typography>
      </TableCell>
    </TableRow>
  );
};
export default TransformToDrift;
