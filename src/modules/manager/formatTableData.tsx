import { formatNumber } from '@/utils/common';
import { Box, Checkbox, Tooltip, Typography } from '@mui/material';
import { BigNumberish } from 'ethers';
import DropdownNew from './DropDownNew';
import {
  calculateDailyRewards,
  // bestBidValue,
  convertPriceInUSD,
  dateFromTimestamp,
  daysLeftFromTimestamp,
  getTypeActiveStatus,
} from './Helper';
import { formatWei } from '@/utils/web3Utils';
import RenderPerks from './RenderPerks';
import { AllInclusive } from '@mui/icons-material';
import DailyRewardsDetail from './DailyrewardsDetail';
import { getDriftDueDate } from '@/utils/helper';
import MultiCurrency from '@/components/icons/MultiCurrency';

export const FormatRows = (
  row: any,
  handleRowSelect: any,
  selectedRows: any,
  rowActions: any,
  mdBreakPoint: boolean,
  avaxPrice: BigNumberish,
  thorPrice: BigNumberish,
  bagCurrentState: number, // 0 for all record active , 1 for listed active , 2 for Not listed active
  bagUnlistedItems: Array<any>,
  user?: any
) => {
  return {
    ...(mdBreakPoint
      ? {
          name: (
            <Box
              component="div"
              sx={{
                display: 'flex',
                // justifyContent: 'spa',
                alignItems: 'center',
              }}
            >
              <Checkbox
                sx={{ color: 'primary.main' }}
                checked={
                  selectedRows.includes(row.id)
                  // selectedRows?.filter(
                  //   (obj: any) => obj.tokenId !== row.tokenId
                  // ).length
                }
                onChange={() => handleRowSelect(row)}
                // disabled={!row?.selectionactive}
                disabled={
                  (bagCurrentState === 1 && !row?.isListed) ||
                  // (bagCurrentState === 2 && row?.isListed)
                  (row?.nodeType === 'DRIFT' && row?.condition === 'active') ||
                  // (bagCurrentState === 1 && !selectedRows.includes(row.id)) ||
                  (bagCurrentState === 2 && row?.isListed) ||
                  getTypeActiveStatus(row, bagCurrentState, bagUnlistedItems)
                }
              />

              <Typography
                sx={{
                  flexGrow: 1,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  width: '100px',
                  whiteSpace: 'nowrap',
                }}
                variant="lbl-md"
              >
                {row?.name}
              </Typography>
              <DropdownNew data={rowActions} row={row} />
            </Box>
          ),
        }
      : {
          id: (
            <Checkbox
              sx={{ color: 'primary.main' }}
              checked={selectedRows.includes(row.id)}
              onChange={() => handleRowSelect(row)}
              disabled={
                (bagCurrentState === 1 && !row?.isListed) ||
                // (bagCurrentState === 2 && row?.isListed)
                (row?.nodeType === 'DRIFT' && row?.condition === 'active') ||
                // (bagCurrentState === 1 && !selectedRows.includes(row.id)) ||
                (bagCurrentState === 2 && row?.isListed) ||
                getTypeActiveStatus(row, bagCurrentState, bagUnlistedItems)
              }
            />
          ),
          name: <Typography variant="lbl-md">{row?.name}</Typography>,
        }),
    ...(row?.tier && {
      tier: <Typography variant="lbl-md">{row?.tier}</Typography>,
    }),
    ...((Number(row?.availablePerksSlots) > 0 || row?.perks?.length) && {
      perks: (
        <RenderPerks
          perks={row?.perks}
          availableSlots={Number(row?.availablePerksSlots)}
        />
      ),
    }),
    ...(row?.condition && {
      condition:
        row?.condition === 'active' ||
        row?.condition === 'in use' ||
        row?.condition === 'claimed' ? (
          <Box
            sx={{
              bgcolor: 'text.primary',
              color: 'background.default',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: row?.rowActive ? 1 : 0.4,
              maxWidth: 'fit-content',
            }}
          >
            <Typography variant="badge">{row?.condition}</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              padding: '10px',
              border: '1px solid',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: row?.rowActive ? 1 : 0.4,
              maxWidth: 'fit-content',
            }}
          >
            <Typography variant="badge">{row?.condition}</Typography>
          </Box>
        ),
    }),
    status: (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="lbl-md">
            {row?.isListed ? 'Listed' : 'Not Listed'}
          </Typography>
          <Typography variant="lbl-sm" sx={{ marginTop: '5px' }}>
            {row?.isListed
              ? `${formatNumber(
                  convertPriceInUSD(
                    avaxPrice,
                    thorPrice,
                    row?.price,
                    row?.paymentType,
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
        {row?.isListed && (
          <MultiCurrency
            nftAddress={row?.nftAddress}
            tokenId={row?.tokenId}
            paymentType={row?.paymentType}
            priceWei={row?.price}
          />
        )}
      </Box>
    ),
    bestBid: (
      <Typography variant="lbl-md">
        {/* {bestBidValue(
          row?.hasBid,
          row?.isListed ? row?.bidPrice : row?.otcPrice,
          avaxPrice,
          thorPrice
        )} */}
        {row?.hasBid
          ? `${formatNumber(
              convertPriceInUSD(
                avaxPrice,
                thorPrice,
                row?.isListed ? row?.bidPrice : row?.otcPrice,
                row?.isListed ? row?.bidPaymentType : row?.otcPaymentType,
                user?.default_currency
              )
            )} ${
              user?.default_currency
                ? user?.default_currency.replace('USDC', 'USD')
                : 'USD'
            }`
          : '-'}
      </Typography>
    ),
    date: (
      <Typography variant="lbl-md">
        {row?.date !== '-' ? dateFromTimestamp(row?.creationTime) : '-'}
      </Typography>
    ),
    ...(row?.bost && {
      bost: <Typography variant="lbl-md">{row?.bost}</Typography>,
    }),
    ...(row?.rewards && {
      rewards: (
        <Typography variant="lbl-md">
          {row?.rewards && Number(row?.rewards) > 0
            ? `${formatWei(row?.rewards as string)}`
            : '0'}
        </Typography>
      ),
    }),
    ...(row?.currentVrr && {
      dailyRewards: (
        <Tooltip
          disableFocusListener
          title={
            <DailyRewardsDetail
              currentVrr={row?.currentVrr}
              perksPct={row?.perksPct}
            />
          }
          placement="bottom-start"
        >
          <Typography
            variant="lbl-md"
            color={row?.perks?.length > 0 ? '#47BA76' : 'text.primary'}
          >
            {row?.currentVrr && Number(row?.currentVrr) > 0
              ? `${calculateDailyRewards(row?.currentVrr, row?.perksPct)}`
              : '0'}
          </Typography>
        </Tooltip>
      ),
    }),
    ...(row?.fixedRewardPerNode && {
      vrr: (
        <Typography variant="lbl-md">
          {row?.fixedRewardPerNode && Number(row?.fixedRewardPerNode) > 0
            ? `${formatWei(row?.fixedRewardPerNode as string)}`
            : '0'}
        </Typography>
      ),
    }),
    ...(row?.multiplier && {
      multiplier: (
        <Typography variant="lbl-md">
          {`${Number(row?.multiplier) / 10}x`}
        </Typography>
      ),
    }),
    ...(row?.dueDate && {
      dueDate: (
        <Typography variant="lbl-md" sx={{ display: 'flex' }}>
          {(row?.pageType !== 'node' && row?.pageType !== 'perk') ||
          (row?.pageType === 'node' && row?.nodeType !== 'DRIFT') ? (
            daysLeftFromTimestamp(Number(row?.dueDate))
          ) : row?.pageType === 'perk' && row?.tier === 'SIGMA' ? (
            <AllInclusive sx={{ fontSize: '18px', mt: '-3px', mr: '5px' }} />
          ) : row?.pageType === 'perk' &&
            (row?.tier === 'DELTA' || row?.tier === 'GAMMA') ? (
            '30'
          ) : row?.pageType === 'node' &&
            row?.nodeType === 'DRIFT' &&
            row?.isRewardsActivated === false ? (
            '90'
          ) : (
            getDriftDueDate(row?.rewardsActivatedTime, row?.vestedDays)
            // daysLeftFromTimestamp(Number(row?.rewardsActivatedTime) + 7776000)
          )}{' '}
          days left
        </Typography>
      ),
    }),
    ...(!mdBreakPoint && {
      action: <DropdownNew data={rowActions} row={row} />,
    }),
  };
};
