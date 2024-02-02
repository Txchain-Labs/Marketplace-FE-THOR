import React from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';

export interface ToggleProps {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}

const Toggle = ({ options, value, onChange }: ToggleProps) => {
  const handleClick = (value: string) => {
    onChange && onChange(value);
  };

  return (
    <Box display={'flex'} justifyContent={'center'}>
      <ButtonGroup
        sx={(theme) => ({
          'border': '1px solid',
          'borderColor': theme.palette.secondary.main,
          'padding': '2px',
          'border-radius': '4px',
        })}
      >
        {options.map((option) => (
          <Button
            key={option}
            variant={'text'}
            sx={(theme) => ({
              'height': '19px !important',
              'fontSize': '10px',
              'fontWeight': 700,
              'lineHeight': 'normal',
              'textTransform': 'uppercase',
              'color':
                value === option
                  ? theme.palette.secondary.contrastText
                  : theme.palette.secondary.main,
              'bgcolor': value === option ? 'secondary.main' : 'transparent',
              '&:hover': {
                color:
                  value === option
                    ? theme.palette.secondary.contrastText
                    : theme.palette.secondary.main,
                bgcolor: value === option ? 'secondary.main' : 'transparent',
              },
              '&:focus': {
                bgcolor: value === option ? 'secondary.main' : 'transparent',
              },
            })}
            onClick={() => handleClick(option)}
          >
            {option}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default Toggle;
