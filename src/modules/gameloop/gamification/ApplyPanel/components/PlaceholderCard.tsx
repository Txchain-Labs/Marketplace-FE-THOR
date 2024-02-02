import React, { FC } from 'react';
import { Grid, Paper, SxProps } from '@mui/material';

interface PlaceholderCardProps {
  label: string;
  sx?: SxProps;
}

const PlaceholderCard: FC<PlaceholderCardProps> = ({ label, sx }) => (
  <Paper
    square
    sx={{
      border: '1.24px solid rgba(0, 0, 0, 0.24)',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '14px',
      fontWeight: 600,
      ...sx,
    }}
  >
    <Grid container textAlign="center">
      <Grid
        item
        xs={12}
        sx={(theme) => ({
          fontSize: '14px',
          lineHeight: '17px',
          color: theme.palette.mode === 'dark' ? 'text.secondary' : undefined,
          opacity: theme.palette.mode === 'light' ? 0.24 : undefined,
        })}
      >
        SELECT
      </Grid>
      <Grid
        item
        xs={12}
        sx={(theme) => ({
          fontSize: '24px',
          lineHeight: '29px',
          color: theme.palette.mode === 'dark' ? 'text.secondary' : undefined,
          opacity: theme.palette.mode === 'light' ? 0.24 : undefined,
        })}
      >
        {label}
      </Grid>
    </Grid>
  </Paper>
);

export default PlaceholderCard;
