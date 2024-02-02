import React, { FC } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { palette } from '@/theme/palette';
import { blockFilterStyle, blockFilterHeaderStyle } from './common/sharedStyle';

// import { FilterGamificationItems } from '../../types';

interface NodeTypeFiltersProps {
  filters: any;
  updateFilters: (filter: any, propertiesToRemove?: string[]) => void;
}

const NodeTypeFilters: FC<NodeTypeFiltersProps> = ({
  filters,
  updateFilters,
}) => {
  const commonStyle = {
    'color': '#fff',
    'border': '1px solid transparent',
    'boxShadow': 'none',

    '&:hover': {
      color: '#fff',
    },
  };

  const style = {
    drift: {
      normal: {
        ...commonStyle,
        borderColor: palette.primary.fire,
      },
      filtered: {
        ...commonStyle,
        borderColor: palette.primary.fire,
        background: 'transparent',
        color: palette.primary.fire,
      },
    },

    origin: {
      normal: {
        ...commonStyle,
        'borderColor': palette.accent.bolt,
        'backgroundColor': palette.accent.bolt,

        '&:hover': {
          backgroundColor: palette.accent.bolt,
          color: '#fff',
        },
      },
      filtered: {
        ...commonStyle,
        'borderColor': palette.accent.bolt,
        'background': 'transparent',
        'color': palette.accent.bolt,

        '&:hover': {
          backgroundColor: palette.accent.bolt,
          color: '#fff',
        },
      },
    },
  };

  function getButtonStyle(type: 'drift' | 'origin') {
    if (filters && filters.isOrigin !== null) {
      const isOrigin = type === 'origin';
      if (filters?.isOrigin === isOrigin) {
        return style[type].normal;
      }
      return style[type].filtered;
    }

    return style[type].normal;
  }

  return (
    <Grid container sx={blockFilterStyle}>
      <Box sx={blockFilterHeaderStyle}>
        <Typography variant="p-lg">Class</Typography>
        <Button
          size={'small'}
          onClick={() => updateFilters(null, ['isOrigin'])}
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
          <Grid item xs={6}>
            <Button
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                ...getButtonStyle('drift'),
                clipPath: 'none !important',
              }}
              variant={'contained'}
              fullWidth
              onClick={() => updateFilters({ isOrigin: false })}
            >
              <span>DRIFT</span>
              {filters && 'isOrigin' in filters && filters.isOrigin && (
                <VisibilityOffIcon sx={{ position: 'relative', top: '-2px' }} />
              )}
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Button
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                ...getButtonStyle('origin'),
                clipPath: 'none !important',
              }}
              variant={'contained'}
              fullWidth
              onClick={() => updateFilters({ isOrigin: true })}
            >
              <span>ORIGIN</span>
              {filters &&
                'isOrigin' in filters &&
                filters.isOrigin === false && (
                  <VisibilityOffIcon
                    sx={{ position: 'relative', top: '-2px' }}
                  />
                )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default NodeTypeFilters;
