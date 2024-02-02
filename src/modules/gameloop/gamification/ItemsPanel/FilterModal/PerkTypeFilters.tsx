import React, { FC } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { palette } from '@/theme/palette';
import { blockFilterStyle, blockFilterHeaderStyle } from './common/sharedStyle';

import { PerkTypeLabel } from '../../types';

interface TypeFiltersProps {
  filters: any;
  updateFilters: (filter: any, propertiesToRemove?: string[]) => void;
}

const TypeFilters: FC<TypeFiltersProps> = ({ filters, updateFilters }) => {
  const commonStyle = {
    'color': '#fff',
    'border': '1px solid transparent',
    'boxShadow': 'none',

    '&:hover': {
      color: '#fff',
    },
  };

  const style = {
    normal: {
      ...commonStyle,
      borderColor: palette.accent.bolt,
      background: 'transparent',
      color: palette.accent.bolt,
    },
    filtered: {
      ...commonStyle,
      'borderColor': palette.primary.fire,
      'backgroundColor': palette.primary.fire,

      '&:hover': {
        backgroundColor: palette.primary.fire,
        color: '#fff',
      },
    },
  };

  function getButtonStyle(type: PerkTypeLabel) {
    if (filters && filters.perkTypeLabel !== null) {
      return filters.perkTypeLabel === type ? style.filtered : style.normal;
    }

    return style.filtered;
  }

  return (
    <Grid container sx={blockFilterStyle}>
      <Box sx={blockFilterHeaderStyle}>
        <Typography variant="p-lg">Perk Types</Typography>
        <Button
          size={'small'}
          onClick={() => updateFilters(null, ['perkTypeLabel'])}
        >
          VIEW ALL
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flex: '1 1 100%',
        }}
      >
        <Grid container spacing={'16px'}>
          {(['sigma', 'gamma', 'delta', 'bonus'] as PerkTypeLabel[]).map(
            (perkLabel) => (
              <Grid item xs={6} key={perkLabel}>
                <Button
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    ...getButtonStyle(perkLabel),
                    clipPath: 'none !important',
                  }}
                  variant={'contained'}
                  fullWidth
                  onClick={() => updateFilters({ perkTypeLabel: perkLabel })}
                >
                  <span style={{ textTransform: 'uppercase' }}>
                    {perkLabel}
                  </span>
                  {filters &&
                    filters.perkTypeLabel !== null &&
                    filters.perkTypeLabel !== perkLabel && (
                      <VisibilityOffIcon
                        sx={{ position: 'relative', top: '-2px' }}
                      />
                    )}
                </Button>
              </Grid>
            )
          )}
        </Grid>
      </Box>
    </Grid>
  );
};

export default TypeFilters;
