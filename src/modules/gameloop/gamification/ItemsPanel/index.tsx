import React, { FC, useMemo, useEffect, useState } from 'react';
import _ from 'lodash';
import { BigNumber } from 'ethers';
import { queryTypes, useQueryState, useQueryStates } from 'next-usequerystate';
import { Box, Grid, Button, CircularProgress, Tooltip } from '@mui/material';
import { ArrowBackIos, InfoOutlined } from '@mui/icons-material';

import Header from './Header';
import Empty from './Empty';
import GamificationItemCard from './GamificationItemCard';
import SvgGameloop from '@/components/svgs/Gameloop';

import { GamificationItem, GamificationItemType } from '../types';
import { useRouter } from 'next/router';

let prevFilter: any;

interface ItemsPanelProps {
  type: GamificationItemType;
  items: GamificationItem[];
  selectedItems: GamificationItem[];
  itemCounts: {
    keycards: number;
    capsules: number;
    perks: number;
  };
  isLoading: boolean;
}

const ItemsPanel: FC<ItemsPanelProps> = ({
  type,
  items,
  selectedItems,
  itemCounts,
  isLoading,
}) => {
  const [selected, setSelected] = useQueryState(
    's',
    queryTypes.array(queryTypes.integer).withDefault([])
  );
  const [filters] = useQueryStates({
    isOrigin: queryTypes.boolean,
    tier: queryTypes.string,
    perkTypeLabel: queryTypes.string,
  });

  const [filteredItems, setFilteredItems] = useState<GamificationItem[]>([]);

  const itemsByTokenId = useMemo<{ [key in number]: GamificationItem }>(() => {
    if (!items) {
      return [];
    }

    const newItemsByTokenId: { [key in number]: GamificationItem } = {};
    items.forEach((item) => {
      const tokenId = (item.id as BigNumber).toNumber();
      newItemsByTokenId[tokenId] = item;
    });

    return newItemsByTokenId;
  }, [items]);

  const activeIsOrigin = useMemo<boolean | undefined>(() => {
    if (
      type === 'perks' ||
      !items ||
      !selectedItems ||
      selectedItems.length === 0
    ) {
      return undefined;
    }

    return selectedItems[0].isOrigin;
  }, [type, items, selectedItems]);

  const toggleSelect = (item: GamificationItem) => {
    const tokenId = (item.id as BigNumber).toNumber();

    let newSelected = [].concat(selected);
    if (selected.includes(tokenId)) {
      newSelected = selected.filter((id) => id !== tokenId);
    } else {
      const limitCount =
        type === 'keycards' ? 20 : type === 'capsules' ? 10 : 1;

      if (limitCount === 1) {
        newSelected = [tokenId];
      } else if (selected.length < limitCount) {
        newSelected.push(tokenId);
      }
    }

    setSelected(newSelected.length === 0 ? null : newSelected, {
      scroll: false,
      shallow: true,
    });
  };

  useEffect(() => {
    if (!_.isEqual({ items, filters }, prevFilter)) {
      prevFilter = { items, filters };

      const refinedFilters = Object.assign({}, filters);

      if (refinedFilters.isOrigin === null) {
        delete refinedFilters.isOrigin;
      }
      if (refinedFilters.tier === null) {
        delete refinedFilters.tier;
      }
      if (refinedFilters.perkTypeLabel === null) {
        delete refinedFilters.perkTypeLabel;
      }

      setFilteredItems(
        items.filter((item) => {
          return _.isMatch(item, refinedFilters);
        })
      );
    }

    return () => {
      prevFilter = null;
    };
  }, [items, filters]);
  const router = useRouter();

  return (
    <Box
      sx={(theme) => ({
        flex: '1 0',
        maxWidth: '632px',
        height: 'calc(100vh - 48px)',
        overflow: 'auto',
        [theme.breakpoints.down('sm')]: {
          'height': 'unset',
          'overflow': 'hidden',
          '& .back-navigation': {
            display: 'none',
          },
        },
      })}
    >
      <Box mx={'16px'} my={'12px'} className={'back-navigation'}>
        <Button
          startIcon={<ArrowBackIos />}
          size={'small'}
          sx={{ color: 'text.secondary' }}
          onClick={() => router.back()}
        >
          Back
        </Button>
      </Box>
      <Box my={'11px'} mx={'16px'} display={'flex'} alignItems={'center'}>
        <Box sx={{ width: '197px', height: '24.5px' }}>
          <SvgGameloop />
        </Box>
        <Tooltip
          title={'Only unlisted NFTs can participate in GameLoop features'}
          placement={'right'}
        >
          <InfoOutlined sx={{ ml: '8px' }} />
        </Tooltip>
      </Box>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 3,
          py: '24px',
          px: '16px',
          bgcolor: 'background.default',
        }}
      >
        <Header type={type} itemCounts={itemCounts} />
      </Box>
      {isLoading || !itemsByTokenId || !filteredItems ? (
        <Box
          sx={{
            display: 'flex',
            height: '50vh',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      ) : filteredItems?.length > 0 ? (
        <Grid container spacing={0}>
          {filteredItems.map((item) => (
            <Grid
              key={item.contractAddress + item.id}
              item
              miniMobile={6}
              xs={6}
              sm={4}
              md={6}
              lg={4}
            >
              <GamificationItemCard
                item={item}
                isSelected={selected.includes(
                  (item.id as BigNumber).toNumber()
                )}
                disabled={
                  type === 'keycards' && activeIsOrigin !== undefined
                    ? item.isOrigin !== activeIsOrigin
                    : false
                }
                onClick={toggleSelect}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Empty type={type} />
      )}
    </Box>
  );
};

export default ItemsPanel;
