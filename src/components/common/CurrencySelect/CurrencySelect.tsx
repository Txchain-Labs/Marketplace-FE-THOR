import React, { FC, useState, useEffect } from 'react';
import {
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  SxProps,
} from '@mui/material';
import { Check, KeyboardArrowDown } from '@mui/icons-material';
import UsdceIcon from '@/components/icons/currencies/Usdce';
import AvaxIcon from '@/components/icons/currencies/Avax';
import ThorIcon from '@/components/icons/currencies/Thor';

export type Currency = {
  text: string;
  icon: React.ReactNode;
  value: number;
  disabled?: boolean;
};

const defaultCurrencies: Currency[] = [
  {
    text: 'AVAX',
    icon: <AvaxIcon viewBox={'0 0 18 15'} />,
    value: 0,
  },
  {
    text: 'THOR',
    icon: <ThorIcon viewBox={'0 0 25 20'} />,
    value: 1,
  },
  {
    text: 'USDC.e',
    icon: <UsdceIcon viewBox={'0 0 15 14'} />,
    value: 2,
  },
];

type Props = {
  currencies?: Currency[];
  value?: number;
  onChange?: (value: number) => void;
  sx?: SxProps;
};

const CurrencySelect: FC<Props> = ({
  value,
  onChange,
  currencies = defaultCurrencies,
  sx,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleClickAnchor = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (value: number, index: number) => {
    setSelectedIndex(index);
    onChange && onChange(value);
    setAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (value === undefined || value < 0) return;

    const index = currencies.findIndex((currency) => currency.value === value);

    setSelectedIndex(index);
  }, [currencies, value]);

  return (
    <Box>
      <Button
        onClick={handleClickAnchor}
        sx={{
          width: '130px',
          height: '48px !important',
          borderWidth: '0 1px 1px 0',
          borderStyle: 'solid',
          borderColor: '#808080',
          borderRadius: 0,
          display: 'flex',
          justifyContent: 'space-between',
          ...sx,
        }}
      >
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          {currencies[selectedIndex].icon}
        </Box>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: '18px',
            marginTop: '2px',
            flexGrow: 1,
            textAlign: 'left',
            ml: '8px',
          }}
        >
          {currencies[selectedIndex].text}
        </Typography>
        <KeyboardArrowDown />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        MenuListProps={{
          sx: {
            'width': '104px',
            '& .MuiListItemIcon-root': {
              minWidth: 0,
            },
          },
        }}
      >
        {currencies.map((currency, index) => (
          <MenuItem
            key={currency.value}
            selected={index === selectedIndex}
            disabled={currency.disabled}
            onClick={() => handleMenuItemClick(currency.value, index)}
            divider={true}
          >
            <ListItemText>
              <Typography variant={'lbl-md'}>{currency.text}</Typography>
            </ListItemText>
            <ListItemIcon sx={{ width: 24, height: 24 }}>
              {index === selectedIndex && <Check />}
            </ListItemIcon>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default CurrencySelect;
