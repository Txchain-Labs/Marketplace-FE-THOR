import React, { FC, useEffect, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';
import { Grid, Box, Button, Typography } from '@mui/material';

import ThorPerkNFTAbi from '../../../../../../../public/abi/ThorPerkNFT.json';
import {
  useApproveGamification,
  useGamificationAllowance,
} from '../../../hooks/useGamification';
import { useApplyNodePerk } from '../../../hooks/usePerks';

import { NodeType } from '@/utils/types';
import { GamificationItem, PerkItem } from '../../../types';

interface ActionsProps {
  perk: GamificationItem<PerkItem>;
  selectedNodes: NodeType[];
}

const Actions: FC<ActionsProps> = ({ perk, selectedNodes }) => {
  const { data: isAllowed, refetch: refetchAllowances } =
    useGamificationAllowance('perks', ThorPerkNFTAbi);

  const { isLoading, approve, isSuccess } = useApproveGamification(
    'perks',
    ThorPerkNFTAbi
  );

  const {
    applyPerk,
    isLoading: isUsingPerk,
    //isSuccess: isPerkSuccessfullyUsed,
  } = useApplyNodePerk();

  const [selectedThorNode, setSelectedThorNode] = useState<NodeType | null>(
    null
  );
  const [selectedOdinNode, setSelectedOdinNode] = useState<NodeType | null>(
    null
  );

  const selectedLabelText = useMemo<string | false>(() => {
    if (selectedNodes.length === 2) {
      return '2 NFTs selected';
    } else if (selectedNodes.length === 0) {
      return false;
    }

    return `1 ${
      selectedNodes[0].tier === 'THOR' ? 'Thor' : 'Odin'
    } NFT selected`;
  }, [selectedNodes]);

  const noticeLabelText = useMemo<string | false>(() => {
    if (selectedNodes.length === 2 || selectedNodes.length === 0) {
      return false;
    }

    return `You may also select an ${
      selectedNodes[0].tier === 'THOR' ? 'Odin' : 'Thor'
    } NFT`;
  }, [selectedNodes]);

  const actionButtonText = useMemo(() => {
    if (isLoading) {
      return 'Approving ...';
    } else if (isUsingPerk) {
      return 'Applying perk ...';
    }

    return isAllowed ? 'Apply Perk' : 'Approve';
  }, [isLoading, isUsingPerk, isAllowed]);

  function onApplyPerk() {
    applyPerk([
      perk.id,
      selectedOdinNode?.tokenId ?? BigNumber.from(0),
      selectedThorNode?.tokenId ?? BigNumber.from(0),
    ]);
  }

  useEffect(() => {
    setSelectedThorNode(
      selectedNodes.filter((node) => node.tier === 'THOR')[0] ?? null
    );
    setSelectedOdinNode(
      selectedNodes.filter((node) => node.tier === 'ODIN')[0] ?? null
    );
  }, [selectedNodes]);

  useEffect(() => {
    if (isSuccess && refetchAllowances) {
      refetchAllowances();
    }
  }, [refetchAllowances, isSuccess]);

  return (
    <Grid
      container
      columnSpacing={'16px'}
      rowSpacing={0}
      color={'text.primary'}
    >
      <Grid item xs={12} md={6}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
        >
          {selectedLabelText && (
            <Typography
              variant={'lbl-lg'}
              lineHeight={'27px'}
              textAlign={'right'}
            >
              {selectedLabelText}
            </Typography>
          )}
          {noticeLabelText && (
            <Typography
              variant={'lbl-sm'}
              lineHeight={'18px'}
              textAlign={'right'}
            >
              {noticeLabelText}
            </Typography>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Button
          variant={'contained'}
          disabled={selectedNodes.length === 0}
          sx={{ maxWidth: 'unset', clipPath: 'none !important' }}
          fullWidth
          onClick={() => (isAllowed ? onApplyPerk() : approve())}
        >
          {actionButtonText}
        </Button>
      </Grid>
    </Grid>
  );
};

export default Actions;
