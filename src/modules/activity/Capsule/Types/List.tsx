import { useGetUserByAddress } from '@/hooks/useNFTDetail';
import { dottedAddress } from '@/shared/utils/utils';
import { getIpfsPublicUrl } from '@/utils/common';
import { useChain } from '@/utils/web3Utils';
import {
  Box,
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { ethers } from 'ethers';
import Link from 'next/link';
import React, { useState } from 'react';
import Countdown from '../../Countdown';
import BuyAction from '../BuyAction';
import { useRouter } from 'next/router';
import { useFormatedPrice } from '@/hooks/common';
import { useSelector } from 'react-redux';
import { useGetUsdFromAvax, useGetUsdFromThor } from '@/hooks/useOracle';
import { CurrencyIcon } from '@/components/common/CurrencyIcon';
interface Props {
  data: any;
  index: number;
}
const List = ({ data, index }: Props) => {
  const { data: fromUser } = useGetUserByAddress(data?.from);
  const { data: toUser } = useGetUserByAddress(data?.to);
  const user = useSelector((state: any) => state?.auth?.user);
  const chain = useChain();
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  const formatPrice = useFormatedPrice(
    data?.priceInWei,
    data?.paymentType,
    user,
    avaxPrice,
    thorPrice
  );
  const router = useRouter();

  const mdBreakPoint = useMediaQuery('(max-width:900px)');

  const [rowHover, setRowHover] = useState(false);
  const handleRowHover = (mouseState: string) => {
    if (mouseState === 'in') {
      setRowHover(true);
    } else {
      setRowHover(false);
    }
  };
  const handleUserProfileRedirect = (userAddress: string | undefined) => {
    router.push(`/profile/${userAddress}`);
  };
  return (
    <TableRow
      hover
      sx={{
        'cursor': 'pointer',
        '&:hover .MuiTableCell-root': {
          bgcolor: 'action.hover',
        },
      }}
      key={index}
      onMouseEnter={() => handleRowHover('in')}
      onMouseLeave={() => handleRowHover('out')}
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
            // width: '100%',
            minWidth: mdBreakPoint ? '120px !important' : '',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <img
            src="/images/activityPanel/capsule/LIST.svg"
            width={25}
            height={25}
          />{' '}
          <Typography
            variant="body1"
            sx={{ fontWeight: 700, alignSelf: 'flex-end' }}
          >
            List
          </Typography>
        </Box>
      </TableCell>
      <TableCell key={`col-asset-${index}`}>
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
                src={data?.collection?.profile_image || '/images/nftImage.png'}
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
              href={`/collection/${data?.collection?.address}`}
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
                {data?.collection?.name}
              </Typography>
            </Link>
          </Box>
        </Box>
      </TableCell>
      <TableCell key={`col-price-${index}`}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            minWidth: '200px',
            minHeight: '50px',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            {formatPrice()}{' '}
          </Typography>
          <Box pl={'3px'} height={'16px'}>
            <CurrencyIcon defaultCurrency={user?.default_currency} />
          </Box>
          {(rowHover || mdBreakPoint) && (
            <Box pl={'10px'}>
              <BuyAction data={data} index={index} />
            </Box>
          )}
        </Box>
      </TableCell>
      <TableCell key={`col-from-${index}`}>
        {data?.from !== ethers.constants.AddressZero ? (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Box sx={{ position: 'relative', width: '36px', height: '36px' }}>
              <img
                src={fromUser?.profile_picture || '/images/profile-pic.svg'}
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
                onClick={() => handleUserProfileRedirect(fromUser?.address)}
                variant="body1"
                sx={{
                  'fontWeight': 700,
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {fromUser?.username}
              </Typography>
              <Typography
                onClick={() => handleUserProfileRedirect(fromUser?.address)}
                variant="body1"
                sx={{
                  'fontSize': '12px',
                  'fontWeight': 300,
                  'color': 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {dottedAddress(fromUser?.address)}
              </Typography>
            </Box>
          </Box>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell key={`col-to-${index}`}>
        {data?.to !== ethers.constants.AddressZero ? (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Box sx={{ position: 'relative', width: '36px', height: '36px' }}>
              <img
                src={toUser?.profile_picture || '/images/profile-pic.svg'}
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
                onClick={() => handleUserProfileRedirect(toUser?.address)}
                variant="body1"
                sx={{
                  'fontWeight': 700,
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {toUser?.username}
              </Typography>
              <Typography
                onClick={() => handleUserProfileRedirect(toUser?.address)}
                variant="body1"
                sx={{
                  'fontSize': '12px',
                  'fontWeight': 300,
                  'color': 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {dottedAddress(toUser?.address)}
              </Typography>
            </Box>
          </Box>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell key={`col-age-${index}`}>
        <Countdown timestamp={data?.timestamp} />
      </TableCell>
    </TableRow>
  );
};

export default List;
