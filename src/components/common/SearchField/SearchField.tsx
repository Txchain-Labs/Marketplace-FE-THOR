import React, { FC, useImperativeHandle, useRef } from 'react';
import { IconButton, TextField } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField';
import { Close, SearchSharp, ArrowBackSharp } from '@mui/icons-material';

type SearchFieldProps = {
  onBack?: () => void;
  onClear: () => void;
  showBackButton?: boolean;
  width?: string | object;
  readOnly?: boolean;
  disableFocus?: boolean;
} & TextFieldProps;

const SearchField: FC<SearchFieldProps> = React.forwardRef(function SearchField(
  {
    onBack,
    onClear,
    showBackButton = false,
    width,
    readOnly = false,
    disableFocus = false,
    ...props
  },
  ref
) {
  const inputRef = useRef(null);

  const handleBack = () => {
    onBack && onBack();
  };
  const handleClear = () => {
    inputRef.current && inputRef.current.focus();
    props.value && onClear && onClear();
  };

  useImperativeHandle(ref, () => {
    return inputRef.current;
  });

  return (
    <TextField
      inputRef={inputRef}
      sx={{
        '& .MuiInputBase-root': {
          'borderRadius': 0,
          'bgcolor': 'background.paper',
          'color': 'text.primary',
          'px': '4px',
          '& fieldset': {
            borderWidth: 0,
          },
          '&.Mui-focused fieldset': {
            borderWidth: disableFocus ? '0' : '2px',
          },
          'fontSize': '14px',
          'fontFamily': 'Nexa-Bold',
          'fontWeight': 500,
          '& .MuiInputBase-input': {
            py: '12px',
          },
          'width': width,
          'height': '44px',
        },
      }}
      InputProps={{
        startAdornment: showBackButton && (
          <IconButton onClick={handleBack}>
            <ArrowBackSharp fontSize={'small'} />
          </IconButton>
        ),
        endAdornment: (
          <IconButton onClick={handleClear}>
            {props.value ? (
              <Close fontSize={'small'} />
            ) : (
              <SearchSharp fontSize={'small'} />
            )}
          </IconButton>
        ),
        readOnly,
      }}
      hiddenLabel
      variant={'outlined'}
      color={'primary'}
      placeholder={'Search'}
      {...props}
    />
  );
});

export default SearchField;
