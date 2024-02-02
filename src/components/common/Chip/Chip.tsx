import React from 'react';
import { Box, Typography, Chip as MuiChip } from '@mui/material';
import { Close } from '@mui/icons-material';

export interface ChipProps {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const Chip = ({
  label,
  selected = false,
  disabled = false,
  onClick,
}: ChipProps) => {
  return (
    <MuiChip
      label={
        <Box display={'flex'} alignItems={'center'}>
          <Typography variant={'p-md'}>{label}</Typography>
          <Box display={selected ? 'flex' : 'none'} ml={'8px'}>
            <Close />
          </Box>
        </Box>
      }
      color={selected ? 'primary' : 'secondary'}
      variant={selected ? 'filled' : 'outlined'}
      sx={(theme) => ({
        height: '32px',
        mr: '8px',
        mb: '8px',
        borderColor: theme.palette.text.primary,
      })}
      disabled={disabled}
      onClick={onClick}
    />
  );
};

export default Chip;
