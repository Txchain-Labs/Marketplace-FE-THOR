import { useGetUsdFromAvax, useGetUsdFromThor } from '@/hooks/useOracle';
import { formatNumber } from '@/utils/common';
import { formatWei, useChain } from '@/utils/web3Utils';
import { Box, Typography } from '@mui/material';
import {
  calculateBooster,
  calculatePerkType,
  convertPriceInUSD,
  daysLeftFromTimestamp,
} from '../Helper';

import { useSelector } from 'react-redux';

interface ItemJsx {
  data: any;
  pageType: string;
  activeNode: string;
  activeType: string;
  isHovering: boolean;
}

const ItemDynamicJsx = ({
  data,
  activeNode,
  activeType,
  pageType,
  isHovering,
}: ItemJsx) => {
  const chain = useChain();
  const { user } = useSelector((state: any) => state.auth);

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  switch (true) {
    case pageType === 'node' &&
      activeType === 'ORIGIN' &&
      (activeNode === 'ODIN' || activeNode === 'THOR'):
      return data.isListed ? (
        <Box
          sx={{
            display: isHovering ? 'none' : 'block',
            flexGrow: 1,
            textAlign: 'right',
          }}
        >
          <Typography mb={0.5} variant="p-lg">
            {formatNumber(
              convertPriceInUSD(
                avaxPrice,
                thorPrice,
                data?.price,
                data?.paymentType,
                user?.default_currency
              )
            )}
            {'' +
              (user?.default_currency
                ? user?.default_currency.replace('USDC', 'USD')
                : 'USD')}
          </Typography>
          <Typography
            mb={0.5}
            variant="p-sm"
            fontWeight={300}
            sx={{ color: 'text.secondary' }}
          >
            {data?.currentVrr && Number(data?.currentVrr) > 0
              ? `${formatWei(data?.currentVrr as string)}`
              : '0'}{' '}
            THOR PER DAY
          </Typography>

          <Typography
            mb={0.5}
            variant="p-sm"
            fontWeight={300}
            sx={{ color: 'text.secondary' }}
          >
            {data?.rewards ? formatWei(data?.rewards as string) : '0'} THOR
            Pending Rewards
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: isHovering ? 'none' : 'block',
            flexGrow: 1,
            textAlign: 'right',
          }}
        >
          <Typography mb={0.5} variant="p-lg">
            {data?.currentVrr && Number(data?.currentVrr) > 0
              ? `${formatWei(data?.currentVrr as string)}`
              : '0'}{' '}
            THOR PER DAY
          </Typography>
          <Typography
            mb={0.5}
            variant="p-sm"
            fontWeight={300}
            sx={{ color: 'text.secondary' }}
          >
            {data?.rewards ? formatWei(data?.rewards as string) : '0'} THOR
            Pending Rewards
          </Typography>
          <Typography
            variant="p-sm"
            fontWeight={300}
            sx={{ color: 'text.secondary' }}
          >
            {daysLeftFromTimestamp(Number(data?.dueDate))} (DAYS) DUE DATE
          </Typography>
        </Box>
      );
    case pageType === 'node' &&
      activeType === 'DRIFT' &&
      (activeNode === 'ODIN' || activeNode === 'THOR'):
      return (
        <Box
          sx={{
            display: isHovering ? 'none' : 'block',
            flexGrow: 1,
            textAlign: 'right',
          }}
        >
          <Typography
            mb={0.5}
            variant="lbl-md"
            align="right"
            sx={{
              color: 'text.secondary',
              textTransform: 'uppercase',
            }}
          >
            {data?.condition}
          </Typography>
          <Typography mb={0.5} variant="p-lg">
            {data?.isListed
              ? `${formatNumber(
                  convertPriceInUSD(
                    avaxPrice,
                    thorPrice,
                    data?.price,
                    data?.paymentType,
                    user?.default_currency
                  )
                )} ${
                  user?.default_currency
                    ? user?.default_currency.replace('USDC', 'USD')
                    : 'USD'
                }`
              : data?.fixedRewardPerNode && Number(data?.fixedRewardPerNode) > 0
              ? `${formatWei(data?.fixedRewardPerNode as string)} THOR PER DAY`
              : '0 THOR PER DAY'}
          </Typography>

          <Typography
            mb={0.5}
            variant="p-sm"
            fontWeight={300}
            sx={{ color: 'text.secondary' }}
          >
            {data?.rewards ? formatWei(data?.rewards as string) : '0'} THOR
            Pending Rewards
          </Typography>
          <Typography
            variant="p-sm"
            fontWeight={300}
            sx={{ color: 'text.secondary' }}
          >
            {data?.isRewardsActivated === false
              ? '90'
              : daysLeftFromTimestamp(
                  Number(data?.rewardsActivatedTime) + 7776000
                )}
            {/* {daysLeftFromTimestamp(Number(data?.dueDate))} */}
            (DAYS) DUE DATE
          </Typography>
        </Box>
      );
    case pageType === 'keycard' &&
      (activeType === 'ORIGIN' || activeType === 'DRIFT') &&
      (activeNode === 'ODIN' || activeNode === 'THOR'):
      return (
        <Box
          sx={{
            display: isHovering ? 'none' : 'block',
            flexGrow: 1,
            textAlign: 'right',
          }}
        >
          <Typography mb={0.5} variant="p-lg">
            {data?.isListed
              ? `${formatNumber(
                  convertPriceInUSD(
                    avaxPrice,
                    thorPrice,
                    data?.price,
                    data?.paymentType,
                    user?.default_currency
                  )
                )} ${
                  user?.default_currency
                    ? user?.default_currency.replace('USDC', 'USD')
                    : 'USD'
                }`
              : ''}
          </Typography>
        </Box>
      );
    case pageType === 'capsule' &&
      (activeType === 'ORIGIN' || activeType === 'DRIFT'):
      return (
        <Box
          sx={{
            display: isHovering ? 'none' : 'block',
            flexGrow: 1,
            textAlign: 'right',
          }}
        >
          <Typography mb={0.5} variant="p-lg">
            {data?.isListed
              ? `${formatNumber(
                  convertPriceInUSD(
                    avaxPrice,
                    thorPrice,
                    data?.price,
                    data?.paymentType,
                    user?.default_currency
                  )
                )} ${
                  user?.default_currency
                    ? user?.default_currency.replace('USDC', 'USD')
                    : 'USD'
                }`
              : ''}
          </Typography>
        </Box>
      );
    case pageType === 'perk' &&
      (activeType === 'ORIGIN' || 'DRIFT') &&
      (activeNode === 'SIGMA' ||
        activeNode === 'DELTA' ||
        activeNode === 'GAMMA'):
      return data.isListed ? (
        <Box
          sx={{
            display: isHovering ? 'none' : 'block',
            flexGrow: 1,
            textAlign: 'right',
          }}
        >
          <Typography
            mb={0.5}
            variant="lbl-md"
            align="right"
            sx={{
              color: 'text.secondary',
              textTransform: 'uppercase',
            }}
          >
            {data?.condition}
          </Typography>
          <Typography mb={0.5} align="right" variant="p-lg">
            {formatNumber(
              convertPriceInUSD(
                avaxPrice,
                thorPrice,
                data?.price,
                data?.paymentType,
                user?.default_currency
              )
            )}
            {user?.default_currency
              ? user?.default_currency.replace('USDC', 'USD')
              : 'USD'}
          </Typography>
          <Typography
            mb={0.5}
            align="right"
            variant="p-sm"
            fontWeight={300}
            sx={{ color: 'text.secondary' }}
          >
            {calculatePerkType(Number(data?.perkType))}
            {calculateBooster(Number(data?.perkType), data?.value)}{' '}
            {data?.perkType > 1000 || data?.perkType < 3000
              ? 'REWARD BOOST'
              : ''}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: isHovering ? 'none' : 'block',
            flexGrow: 1,
            textAlign: 'right',
          }}
        >
          <Typography
            mb={0.5}
            variant="lbl-md"
            align="right"
            sx={{
              color: 'text.secondary',
              textTransform: 'uppercase',
            }}
          >
            {data?.condition}
          </Typography>
          <Typography align="right" mb={0.5} variant="p-lg">
            {calculateBooster(Number(data?.perkType), data?.value)}
            {data?.perkType > 1000 && data?.perkType < 3000
              ? ' REWARD BOOST'
              : ''}
          </Typography>
          <Typography
            mb={0.5}
            variant="p-sm"
            fontWeight={300}
            align="right"
            sx={{ color: 'text.secondary' }}
          >
            {calculatePerkType(Number(data?.perkType))}
          </Typography>
        </Box>
      );
    case pageType === 'perk' &&
      (activeType === 'ORIGIN' || 'DRIFT') &&
      activeNode === 'BONUS':
      return data.isListed ? (
        <Box
          sx={{
            display: isHovering ? 'none' : 'block',
            flexGrow: 1,
            textAlign: 'right',
          }}
        >
          <Typography mb={0.5} align="right" variant="p-lg">
            {formatNumber(
              convertPriceInUSD(
                avaxPrice,
                thorPrice,
                data?.price,
                data?.paymentType,
                user?.default_currency
              )
            )}
            {user?.default_currency
              ? user?.default_currency.replace('USDC', 'USD')
              : 'USD'}
          </Typography>
          <Typography
            mb={0.5}
            align="right"
            variant="p-sm"
            fontWeight={300}
            sx={{ color: 'text.secondary' }}
          >
            {calculatePerkType(Number(data?.perkType))}
            {calculateBooster(Number(data?.perkType), data?.value)}{' '}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: isHovering ? 'none' : 'block',
            flexGrow: 1,
            textAlign: 'right',
          }}
        >
          <Typography align="right" mb={0.5} variant="p-lg">
            {calculateBooster(Number(data?.perkType), data?.value)}
          </Typography>
          <Typography
            mb={0.5}
            variant="p-sm"
            fontWeight={300}
            align="right"
            sx={{ color: 'text.secondary' }}
          >
            {calculatePerkType(Number(data?.perkType))}
          </Typography>
        </Box>
      );
    default:
      return <>No Data</>;
  }
};

export default ItemDynamicJsx;
