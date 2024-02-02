import React, { FC, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { BigNumber } from 'ethers';
import { queryTypes, useQueryState } from 'next-usequerystate';
import { Box } from '@mui/material';

import {
  useGetGamificationAssets,
  useFormattedGamificationItems,
} from './hooks';

import PageContainer from '@/layouts/PageContainer';
import ItemsPanel from './ItemsPanel';
import ApplyPanel from './ApplyPanel';

import { GamificationItem, GamificationItemType } from './types';

const Gamification: FC = () => {
  const router = useRouter();

  const type = router.query.type as GamificationItemType;

  const [selectedIds] = useQueryState(
    's',
    queryTypes.array(queryTypes.integer).withDefault([])
  );

  const { data: gamificationAssets, isLoading } = useGetGamificationAssets();

  const allItems = useFormattedGamificationItems(gamificationAssets);

  const itemCounts = useMemo<{
    keycards: number;
    capsules: number;
    perks: number;
  }>(
    () => ({
      keycards: allItems.keycards.length,
      capsules: allItems.capsules.length,
      perks: allItems.perks.length,
    }),
    [allItems]
  );

  const items = useMemo<GamificationItem[]>(() => {
    return allItems ? allItems[type] : [];
  }, [allItems, type]);

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

  const selectedItems = useMemo<GamificationItem[]>(() => {
    return selectedIds
      .filter((id) => itemsByTokenId[id])
      .map((id) => itemsByTokenId[id]);
  }, [selectedIds, itemsByTokenId]);

  const [pendingTransaction, setPendingTransaction] =
    useState<Promise<any> | null>(null);

  useEffect(() => {
    if (pendingTransaction) {
      pendingTransaction.finally(() => {
        setPendingTransaction(null);
      });
    }
  }, [pendingTransaction]);

  return (
    <PageContainer>
      {type && items && itemCounts && selectedItems && (
        <Box
          sx={(theme) => ({
            display: 'flex',
            [theme.breakpoints.down('md')]: {
              flexDirection: 'column-reverse',
            },
          })}
        >
          <ItemsPanel
            type={type}
            items={items || []}
            selectedItems={selectedItems}
            itemCounts={itemCounts}
            isLoading={isLoading || !allItems}
          />
          <ApplyPanel
            type={type}
            selectedItems={selectedItems}
            gamificationItems={allItems}
            setPendingTransaction={setPendingTransaction}
          />
        </Box>
      )}
    </PageContainer>
  );
};

export default Gamification;
