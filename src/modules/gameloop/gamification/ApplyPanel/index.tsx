import React, { FC } from 'react';
import { Box, Button } from '@mui/material';

import KeycardsApply from './KeycardsApply';
import CapsulesApply from './CapsulesApply';
import PerksApply from './PerksApply';

import {
  GamificationItemType,
  GamificationItem,
  GamificationItems,
  KeyCardItem,
  CapsuleItem,
  PerkItem,
} from '../types';
import { ArrowBackIos } from '@mui/icons-material';
import { NextLinkComposed } from '@/components/common/Link';

interface ApplyPanelProps {
  type: GamificationItemType;
  selectedItems: GamificationItem[];
  gamificationItems: GamificationItems;
  setPendingTransaction: (pendingTransaction: Promise<any> | null) => void;
}

const ApplyPanel: FC<ApplyPanelProps> = ({
  type,
  selectedItems,
  gamificationItems,
  setPendingTransaction,
}) => {
  return (
    <Box
      sx={(theme) => ({
        'flex': '1 0',
        'bgcolor': 'background.default',
        'boxShadow':
          theme.palette.mode === 'light'
            ? 'inset 0px -4.08108px 16.3243px rgba(0, 0, 0, 0.25)'
            : undefined,
        '& .back-navigation': {
          display: 'none',
        },
        [theme.breakpoints.down('sm')]: {
          'mb': type !== 'keycards' ? '56px' : undefined,
          '& .back-navigation': {
            display: 'block',
          },
        },
      })}
    >
      <Box mx={'16px'} my={'12px'} className={'back-navigation'}>
        <Button
          startIcon={<ArrowBackIos />}
          size={'small'}
          sx={{ color: 'text.secondary' }}
          to={{
            pathname: `/gameloop/`,
          }}
          component={NextLinkComposed}
        >
          Back
        </Button>
      </Box>
      {type === 'keycards' ? (
        <KeycardsApply
          selectedItems={selectedItems as GamificationItem<KeyCardItem>[]}
          capsules={
            (gamificationItems?.capsules ??
              []) as GamificationItem<CapsuleItem>[]
          }
          setPendingTransaction={setPendingTransaction}
        />
      ) : type === 'capsules' ? (
        <CapsulesApply
          selectedItems={selectedItems as GamificationItem<CapsuleItem>[]}
          setPendingTransaction={setPendingTransaction}
          perks={
            (gamificationItems?.perks ?? []) as GamificationItem<PerkItem>[]
          }
        />
      ) : (
        <PerksApply
          selectedItems={selectedItems as GamificationItem<PerkItem>[]}
        />
      )}
    </Box>
  );
};

export default ApplyPanel;
