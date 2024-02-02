import React, { FC, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Avatar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { formatNumber, convertPriceFromUSD } from '@/utils/common';
import { useGetUsdFromAvax, useGetUsdFromThor } from '@/hooks/useOracle';

// import { Collection } from '@/models/Collection';
import { useChain } from '@/utils/web3Utils';
import { useSelector } from 'react-redux';

import { CurrencyIcon } from '@/components/common/CurrencyIcon';
import { queryTypes, useQueryState, useQueryStates } from 'next-usequerystate';
import { useCollections } from '@/hooks/useCollections';
import { ethers } from 'ethers';
import { CommonLoader } from '@/components/common';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface CollectionsTableProps {
  isShowFullData: boolean;
}

const CollectionsTable: FC<CollectionsTableProps> = ({ isShowFullData }) => {
  const chain = useChain();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const user = useSelector((state: any) => state?.auth.user);
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const [searchText] = useQueryState('q', queryTypes.string.withDefault(''));
  const [sort] = useQueryStates({
    orderBy: queryTypes.string.withDefault('floor_price'),
    dir: queryTypes.string.withDefault('desc'),
  });

  const { ref, inView } = useInView({ rootMargin: '500px' });

  const { data, status, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useCollections(true, searchText, sort);

  const columns = useMemo<{ header: string; Cell: (row: any) => any }[]>(
    () => [
      {
        header: 'Collection',
        Cell: (row) => (
          <Link href={`/collection/${row.address}`} passHref>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <Box display={'flex'} alignItems={'center'}>
                <Avatar
                  sx={{ width: 52, height: 52, marginRight: '16px' }}
                  alt={row.name}
                  src={row.profile_image || '/images/random.png'}
                />
                <Box textAlign={'left'}>
                  <Typography
                    sx={{
                      lineHeight: '28px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '168px',
                    }}
                    variant={'lbl-lg'}
                  >
                    {row.name
                      .replace('OG Odin', 'Origin Odin')
                      .replace('OG Thor', 'Origin Thor')}
                  </Typography>
                  <Typography
                    component="span"
                    variant="lbl-sm"
                    sx={{
                      lineHeight: '18px',
                      fontWeight: 300,
                    }}
                  >
                    {row.collection_size
                      ? formatNumber(
                          +row.collection_size,
                          +row.collection_size > 999 ? 1 : 0
                        )
                      : '---'}{' '}
                    Items
                  </Typography>
                </Box>
              </Box>
            </a>
          </Link>
        ),
      },
      {
        header: 'Floor price',
        Cell: (row) => {
          const floorPrice = avaxPrice
            ? Number(ethers.utils.formatEther(row.floor_price ?? 0)) *
              Number(ethers.utils.formatEther(avaxPrice))
            : 0;
          return floorPrice > 0 ? (
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Typography
                sx={{
                  marginRight: '3px',
                }}
                variant={'lbl-md'}
              >
                {formatNumber(
                  convertPriceFromUSD(
                    floorPrice,
                    avaxPrice,
                    thorPrice,
                    user?.default_currency
                  )
                )}
              </Typography>
              <Box ml={'3px'} height={'14px'}>
                <CurrencyIcon defaultCurrency={user?.default_currency} />
              </Box>
            </Box>
          ) : null;
        },
      },
      {
        header: 'Volume',
        Cell: (row) => {
          if (!avaxPrice || !thorPrice) {
            return null;
          }

          const volume = Number(
            ethers.utils.formatEther(row.total_volume_usd ?? 0)
          );

          if (volume === 0) return null;

          return (
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Typography
                sx={{
                  marginRight: '3px',
                }}
                variant={'lbl-md'}
              >
                {formatNumber(
                  convertPriceFromUSD(
                    Number(volume),
                    avaxPrice,
                    thorPrice,
                    user?.default_currency
                  )
                )}
              </Typography>
              <Box ml={'3px'} height={'14px'}>
                <CurrencyIcon defaultCurrency={user?.default_currency} />
              </Box>
            </Box>
          );
        },
      },
      {
        header: '7 Days change',
        Cell: (row) => {
          const volumeChanged = Number(row.volume_changed);

          if (!volumeChanged) return null;

          return (
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              {volumeChanged < 0 ? (
                <ArrowDropDownIcon
                  sx={{
                    color: '#F3523F',
                  }}
                />
              ) : (
                <ArrowDropUpIcon
                  sx={{
                    color: '#32B267',
                  }}
                />
              )}
              <Typography
                sx={{
                  color: volumeChanged < 0 ? '#F3523F' : '#32B267',
                }}
                variant={'lbl-md'}
              >
                {volumeChanged < 0 ? '' : '+'}
                {volumeChanged}%
              </Typography>
            </Box>
          );
        },
      },
      {
        header: 'Owners',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Cell: (_row) => <Typography variant={'lbl-md'}></Typography>,
      },
      {
        header: 'Items listed',
        Cell: (row) => {
          const totalSupply: number = row.collection_size
            ? +row.collection_size
            : 0;
          const listedCount = Number(row.listed_count ?? 0);
          const percent =
            totalSupply === 0
              ? undefined
              : formatNumber((listedCount / totalSupply) * 100, 2);

          if (!listedCount) return null;

          return (
            <Box
              display={'flex'}
              alignItems={'baseline'}
              justifyContent={'center'}
            >
              <Typography variant={'lbl-md'} mr={'3px'}>
                {percent}%
              </Typography>
              <Typography
                variant={'lbl-sm'}
                sx={{ fontSize: '13px', color: 'text.secondary' }}
              >
                ({`${listedCount} of ${totalSupply}`})
              </Typography>
            </Box>
          );
        },
      },
    ],
    [avaxPrice, thorPrice, user?.default_currency]
  );

  const rows = useMemo(() => {
    if (!data || !data.pages) {
      return [];
    }

    const flatRows: any[] = [];

    data.pages.forEach((page: any) => {
      flatRows.push(...page.records);
    });

    return isShowFullData ? flatRows : flatRows.slice(0, 4);
  }, [data, isShowFullData]);

  useEffect(() => {
    if (inView && isShowFullData) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isShowFullData]);

  return (
    <Box sx={{ width: '100%' }}>
      {status === 'loading' || !avaxPrice || !thorPrice ? (
        <CommonLoader
          size={undefined}
          text={'Loading Collections...'}
          width={'100%'}
          height={
            !isShowFullData
              ? '366px'
              : smDown
              ? 'calc(100vh - 211px)'
              : 'calc(100vh - 181px)'
          }
        />
      ) : (
        <TableContainer
          sx={{
            'maxHeight': smDown ? 'calc(100vh - 211px)' : 'calc(100vh - 181px)',
            '& .MuiTableCell-root': {
              borderBottom: 'none',
            },
          }}
        >
          <Table stickyHeader>
            <TableHead
              sx={{
                '& .MuiTableCell-root': {
                  bgcolor: 'unset',
                  color: 'text.secondary',
                },
              }}
            >
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.header} align={'center'}>
                    {column.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row: any) => (
                <TableRow hover tabIndex={-1} key={row.address}>
                  {columns.map((column) => (
                    <TableCell key={column.header} sx={{ padding: '8px' }}>
                      {column.Cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={99}>
                  <Box
                    ref={ref}
                    width={'100%'}
                    height={'248px'}
                    sx={{ clear: 'both' }}
                    hidden={!hasNextPage || !isShowFullData}
                  >
                    {isFetchingNextPage && (
                      <CommonLoader
                        size={undefined}
                        text={'Loading more ...'}
                        width={'100%'}
                        height={'248px'}
                      />
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default CollectionsTable;
