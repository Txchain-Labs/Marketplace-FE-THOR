import { palette } from '@/theme/palette';
import { formatNumber } from '@/utils/common';
import { Box, Typography, useMediaQuery } from '@mui/material';
import {
  convertPriceInUSD,
  calculateBooster,
  calculatePerkType,
} from './Helper';
import { formatWei, useChain } from '@/utils/web3Utils';
import { useGetUsdFromAvax, useGetUsdFromThor } from '@/hooks/useOracle';
import RenderPerks from './RenderPerks';
import { useSelector } from 'react-redux';
import MultiCurrency from '@/components/icons/MultiCurrency';

interface CardJsx {
  data: any;
  pageType: string;
  tier: string;
  nodeType: string;
}

const CardDynamicJsx = ({ data, pageType, tier, nodeType }: CardJsx) => {
  const chain = useChain();
  const { user } = useSelector((state: any) => state.auth);

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  const xsToXXsBreakPoint = useMediaQuery(
    '(max-width:450px) and (min-width:380px)'
  );

  switch (true) {
    case pageType === 'node' && (nodeType === 'ORIGIN' || nodeType === 'DRIFT'):
      return (
        <Box sx={{ padding: '5px' }}>
          {data?.isListed ? (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}
                  sx={{
                    color:
                      nodeType === 'DRIFT' ? 'primary.contrastText' : undefined,
                  }}
                >
                  PRICE
                </Typography>
                <MultiCurrency
                  nftAddress={data?.nftAddress}
                  tokenId={data?.tokenId}
                  paymentType={data?.paymentType}
                  priceWei={data?.price}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginY: '10px',
                  gap: '10px',
                }}
              >
                <Typography
                  variant={xsToXXsBreakPoint ? 'p-lg' : 'h4'}
                  sx={{
                    color:
                      nodeType === 'DRIFT' ? 'primary.contrastText' : undefined,
                  }}
                >
                  {formatNumber(
                    convertPriceInUSD(
                      avaxPrice,
                      thorPrice,
                      data?.price,
                      data?.paymentType,
                      user?.default_currency
                    )
                  )}
                </Typography>
                <Typography
                  variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}
                  sx={{
                    color:
                      nodeType === 'DRIFT' ? 'primary.contrastText' : undefined,
                  }}
                >
                  {user?.default_currency
                    ? user?.default_currency.replace('USDC', 'USD')
                    : 'USD'}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Typography
                variant={xsToXXsBreakPoint ? 'p-lg' : 'h4'}
                sx={{
                  color:
                    nodeType === 'DRIFT' ? 'primary.contrastText' : undefined,
                }}
              >
                {/* {data?.fixedRewardPerNode} */}
                {data?.fixedRewardPerNode
                  ? formatWei(data?.fixedRewardPerNode as string)
                  : '0'}
                {/* {data?.currentVrr && Number(data?.currentVrr) > 0
                  ? `${formatWei(data?.currentVrr as string)}`
                  : '0'} */}
              </Typography>
              <Typography
                variant="lbl-md"
                sx={{
                  color:
                    nodeType === 'DRIFT' ? 'primary.contrastText' : undefined,
                }}
              >
                THOR PER DAY
              </Typography>
            </Box>
          )}
          <Typography
            variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}
            sx={{
              color: nodeType === 'DRIFT' ? 'primary.contrastText' : undefined,
            }}
          >
            {/* {formatedRewards} */}
            {data?.rewards ? formatWei(data?.rewards as string) : '0'} THOR
            Pending Rewards
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '10px',
            }}
          >
            <Typography
              variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}
              sx={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: xsToXXsBreakPoint ? '100px' : '150px',
                color:
                  nodeType === 'DRIFT' ? 'primary.contrastText' : undefined,
              }}
            >
              {data?.name}
            </Typography>
            {nodeType === 'ORIGIN' ? (
              <RenderPerks
                perks={data?.perks}
                availableSlots={Number(data?.availablePerksSlots)}
              />
            ) : (
              <Box>
                {data?.condition === 'active' ? (
                  <Box
                    sx={{
                      background: '#000000',
                      color: '#F8F8F8',
                      padding: xsToXXsBreakPoint ? '4px' : '7px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      maxWidth: 'fit-content',
                    }}
                  >
                    <Typography variant="badge">{data?.condition}</Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      background: 'transparent',
                      color: '#F8F8F8',

                      padding: xsToXXsBreakPoint ? '4px' : '7px',
                      border: '1px solid #000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      maxWidth: 'fit-content',
                    }}
                  >
                    <Typography variant="badge">{data?.condition}</Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      );
    case pageType === 'keycard' || pageType === 'capsule':
      return (
        <Box sx={{ padding: '10px' }}>
          {data?.isListed && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}
                  sx={{
                    paddingTop: 1,
                  }}
                >
                  PRICE
                </Typography>
                <MultiCurrency
                  nftAddress={data?.nftAddress}
                  tokenId={data?.tokenId}
                  paymentType={data?.paymentType}
                  priceWei={data?.price}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginY: '10px',
                  gap: '10px',
                }}
              >
                <Typography variant={xsToXXsBreakPoint ? 'p-lg' : 'h4'}>
                  {formatNumber(
                    convertPriceInUSD(
                      avaxPrice,
                      thorPrice,
                      data?.price,
                      data?.paymentType,
                      user?.default_currency
                    )
                  )}
                </Typography>
                <Typography variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}>
                  {user?.default_currency
                    ? user?.default_currency.replace('USDC', 'USD')
                    : 'USD'}
                </Typography>
              </Box>
            </Box>
          )}
          <Typography
            variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}
            sx={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              maxWidth: xsToXXsBreakPoint ? '100px' : '150px',
            }}
          >
            {data?.name}
          </Typography>
        </Box>
      );
    case pageType === 'perk' && nodeType === 'ORIGIN' && tier === 'SIGMA':
      return (
        <Box sx={{ padding: '10px' }}>
          {data?.isListed && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Typography variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}>
                  PRICE
                </Typography>
                <MultiCurrency
                  nftAddress={data?.nftAddress}
                  tokenId={data?.tokenId}
                  paymentType={data?.paymentType}
                  priceWei={data?.price}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginY: '10px',
                  gap: '10px',
                }}
              >
                <Typography variant={xsToXXsBreakPoint ? 'p-lg' : 'h4'}>
                  {formatNumber(
                    convertPriceInUSD(
                      avaxPrice,
                      thorPrice,
                      data?.price,
                      data?.paymentType,
                      user?.default_currency
                    )
                  )}
                </Typography>
                <Typography variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}>
                  {user?.default_currency
                    ? user?.default_currency.replace('USDC', 'USD')
                    : 'USD'}
                </Typography>
              </Box>
            </Box>
          )}
          {data?.isListed ? (
            <Typography variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}>
              {calculateBooster(Number(data?.perkType), data?.value)}{' '}
              {calculatePerkType(Number(data?.perkType))}
              {' REWARD BOOST'}
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant={xsToXXsBreakPoint ? 'p-lg' : 'h4'}>
                {calculateBooster(Number(data?.perkType), data?.value)}
              </Typography>
              <Typography variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}>
                {calculatePerkType(Number(data?.perkType))}
                {' REWARD BOOST'}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '10px',
            }}
          >
            <Typography
              variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}
              sx={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: xsToXXsBreakPoint ? '100px' : '150px',
              }}
            >
              {data?.name}
            </Typography>

            <Box
              sx={(theme) => ({
                background: 'transparent',
                padding: xsToXXsBreakPoint ? '4px' : '7px',
                border: `1px solid ${theme.palette.text.primary}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: 'fit-content',
              })}
            >
              <Typography variant="badge">NOT IN USE</Typography>
            </Box>
          </Box>
        </Box>
      );
    case pageType === 'perk' &&
      nodeType === 'ORIGIN' &&
      (tier === 'DELTA' || tier === 'GAMMA'):
      return (
        <Box sx={{ padding: '10px' }}>
          {data?.isListed && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Typography variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}>
                  PRICE
                </Typography>
                <MultiCurrency
                  nftAddress={data?.nftAddress}
                  tokenId={data?.tokenId}
                  paymentType={data?.paymentType}
                  priceWei={data?.price}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginY: '10px',
                  gap: '10px',
                }}
              >
                <Typography variant={xsToXXsBreakPoint ? 'p-lg' : 'h4'}>
                  {formatNumber(
                    convertPriceInUSD(
                      avaxPrice,
                      thorPrice,
                      data?.price,
                      data?.paymentType,
                      user?.default_currency
                    )
                  )}
                </Typography>
                <Typography variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}>
                  {user?.default_currency
                    ? user?.default_currency.replace('USDC', 'USD')
                    : 'USD'}
                </Typography>
              </Box>
            </Box>
          )}
          {data?.isListed ? (
            <Typography variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}>
              {calculateBooster(Number(data?.perkType), data?.value)}{' '}
              {calculatePerkType(Number(data?.perkType))}
              {' REWARD BOOST'}
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant={xsToXXsBreakPoint ? 'p-lg' : 'h4'}>
                {calculateBooster(Number(data?.perkType), data?.value)}
              </Typography>
              <Typography variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}>
                {tier === 'DELTA' ? 'HIGHER ' : ''}
                {calculatePerkType(Number(data?.perkType))}
                {' REWARD BOOST'}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '10px',
            }}
          >
            <Typography
              variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}
              sx={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: xsToXXsBreakPoint ? '100px' : '150px',
              }}
            >
              {data?.name}
            </Typography>

            <Box
              sx={(theme) => ({
                background: 'transparent',
                padding: xsToXXsBreakPoint ? '4px' : '7px',
                border: `1px solid ${theme.palette.text.primary}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: 'fit-content',
              })}
            >
              <Typography variant="badge">NOT IN USE</Typography>
            </Box>
          </Box>
        </Box>
      );
    case pageType === 'perk' && nodeType === 'ORIGIN' && tier === 'BONUS':
      return (
        <Box sx={{ padding: '10px' }}>
          {data?.isListed && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Typography variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}>
                  PRICE
                </Typography>
                <MultiCurrency
                  nftAddress={data?.nftAddress}
                  tokenId={data?.tokenId}
                  paymentType={data?.paymentType}
                  priceWei={data?.price}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginY: '10px',
                  gap: '10px',
                }}
              >
                <Typography variant={xsToXXsBreakPoint ? 'p-lg' : 'h4'}>
                  {formatNumber(
                    convertPriceInUSD(
                      avaxPrice,
                      thorPrice,
                      data?.price,
                      data?.paymentType,
                      user?.default_currency
                    )
                  )}
                </Typography>
                <Typography variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}>
                  {user?.default_currency
                    ? user?.default_currency.replace('USDC', 'USD')
                    : 'USD'}
                </Typography>
              </Box>
            </Box>
          )}
          {data?.isListed ? (
            <Typography variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}>
              {calculateBooster(Number(data?.perkType), data?.value)}{' '}
              {calculatePerkType(Number(data?.perkType))}
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Typography
                  variant={xsToXXsBreakPoint ? 'p-lg' : 'h4'}
                  sx={{
                    color: `${palette.primary.storm}`,
                  }}
                >
                  {
                    calculateBooster(
                      Number(data?.perkType),
                      data?.value
                    )?.split('THOR')[0]
                  }
                </Typography>
                <Typography
                  variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}
                  sx={{
                    color: `${palette.primary.storm}`,
                  }}
                >
                  THOR
                </Typography>
              </Box>
              <Typography variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}>
                {calculatePerkType(Number(data?.perkType))}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '10px',
            }}
          >
            <Typography
              variant={xsToXXsBreakPoint ? 'lbl-sm' : 'lbl-md'}
              sx={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: xsToXXsBreakPoint ? '100px' : '150px',
              }}
            >
              {data?.name}
            </Typography>

            <Box
              sx={(theme) => ({
                background: 'transparent',
                padding: xsToXXsBreakPoint ? '4px' : '7px',
                border: `1px solid ${theme.palette.text.primary}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: 'fit-content',
              })}
            >
              <Typography variant="badge">NOT IN USE</Typography>
            </Box>
          </Box>
        </Box>
      );
    default:
      return <></>;
  }
};

export default CardDynamicJsx;
