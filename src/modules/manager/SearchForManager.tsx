import { Close } from '@mui/icons-material';
import { Box, IconButton, TextField } from '@mui/material';
import { GridSearchIcon } from '@mui/x-data-grid';
import React from 'react';

const SearchForManager = (props: any) => {
  return (
    <Box>
      <TextField
        sx={{
          'marginTop': 4,
          '& label.Mui-focused': {
            border: '2px solid #F3523F',
          },

          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              border: 'none',
            },
            '&.Mui-focused fieldset': {
              border: '2px solid #F3523F',
            },
            'color': '#4C4C4C',
            'fontSize': '14px',
            'fontFamily': 'Nexa-Bold',
            'border': 'none',
            'backgroundColor': '#F8F8F8',
            // 'width': { sm: '342px', xs: '90%', miniMobile: '' },
          },
        }}
        onChange={props.onChange}
        fullWidth
        value={props.value}
        placeholder={props.placeHolder}
        InputProps={{
          endAdornment: (
            <IconButton>
              {props.value ? (
                <Close sx={{ color: '#1A1A1A' }} onClick={props.clear} />
              ) : (
                <GridSearchIcon sx={{ color: '#1A1A1A' }} />
              )}
            </IconButton>
          ),
        }}
      />
    </Box>
  );
};
export default SearchForManager;
