import React, { FC, useState } from 'react';
import { Box } from '@mui/material';

import Title from './Title';
import TiersFilter from './TiersFilter';
import NodesTable from './NodesTable';
import Actions from './Actions';

import { NodeType, ThorTier } from '@/utils/types';
import { GamificationItem, PerkItem } from '../../../types';

interface NodesViewProps {
  perk: GamificationItem<PerkItem>;
}

const NodesView: FC<NodesViewProps> = ({ perk }) => {
  const [selectedTier, setSelectedTier] = useState<ThorTier>('THOR');
  const [selectedNodes, setSelectedNodes] = useState<NodeType[]>([]);

  return (
    <Box
      sx={{
        position: 'relative',
        height: 'calc(100vh - 52px)',
      }}
    >
      <Box
        sx={{
          height: 'calc(100vh - 126px)',
          overflow: 'auto',
          p: '24px',
        }}
      >
        <Title />
        <Box position={'sticky'} top={0} zIndex={3}>
          <TiersFilter
            selectedTier={selectedTier}
            onSelectedTierChange={setSelectedTier}
          />
        </Box>
        <NodesTable
          selectedTier={selectedTier}
          selectedNodesState={[selectedNodes, setSelectedNodes]}
        />
        <Box height={'20px'} />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          px: '24px',
          pb: '24px',
          bgcolor: 'background.default',
          color: 'background.default',
          boxShadow: '0px -32px 28px -10px',
        }}
      >
        <Actions perk={perk} selectedNodes={selectedNodes} />
      </Box>
    </Box>
  );
};

export default NodesView;
