import React, { FC } from 'react';
import { queryTypes, useQueryStates } from 'next-usequerystate';
import { Dialog, Box, Typography, IconButton, Button } from '@mui/material';
import { Close, Replay } from '@mui/icons-material';
import { blockFilterHeaderStyle, blockFilterStyle } from './common/sharedStyle';

import NodeTypeFilters from './NodeTypeFilters';
import PerkTypeFilters from './PerkTypeFilters';
import TierFilters from './TierFilters';

import { GamificationItemType } from '../../types';

interface FilterModalProps {
  type: GamificationItemType;
  open: boolean;
  onClose: () => void;
}

const FilterModal: FC<FilterModalProps> = ({ type, open, onClose }) => {
  // const [filters, setFilters] = useState<FilterGamificationItems | null>(null);
  const [filters, setFilters] = useQueryStates({
    isOrigin: queryTypes.boolean,
    tier: queryTypes.string,
    perkTypeLabel: queryTypes.string,
  });

  const updateFilters = (filter: any, propertiesToRemove?: string[]) => {
    const newFilters: any = Object.assign({}, filters);

    if (propertiesToRemove) {
      for (const property of propertiesToRemove) {
        newFilters[property as 'isOrigin' | 'tier' | 'perkTypeLabel'] = null;
      }

      setFilters(newFilters);
    } else if (!filter) {
      setFilters({
        isOrigin: null,
        tier: null,
        perkTypeLabel: null,
      });
    } else {
      setFilters({ ...filters, ...filter });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={true}
      maxWidth={'sm'}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 0,
          maxWidth: '500px',
          backgroundImage: 'none',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e4e1dc',
          p: '8px 24px',
        }}
      >
        <Typography variant={'sub-h'} lineHeight={'36px'}>
          Filter by
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {type === 'keycards' && (
        <TierFilters filters={filters} updateFilters={updateFilters} />
      )}

      <NodeTypeFilters filters={filters} updateFilters={updateFilters} />

      {type === 'perks' && (
        <PerkTypeFilters filters={filters} updateFilters={updateFilters} />
      )}

      <Box sx={blockFilterStyle}>
        <Box
          sx={{
            ...blockFilterHeaderStyle,
            marginBottom: 0,
          }}
        >
          <Button
            variant={'outlined'}
            color={'secondary'}
            onClick={() => updateFilters(null)}
            sx={{
              cursor: `url("/images/cursor-pointer.svg"), auto`,
              width: '100px',
            }}
          >
            <Replay sx={{ marginRight: '5px' }} />
            RESET
          </Button>

          <Button variant={'contained'} color={'secondary'} onClick={onClose}>
            DONE
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default FilterModal;
