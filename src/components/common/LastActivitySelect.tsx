import React, { FC, useState, useEffect } from 'react';
import {
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { Check, KeyboardArrowDown } from '@mui/icons-material';

export type Period = {
  text: string;
  value: number;
  disabled?: boolean;
};

export const LastActivityPeriod = {
  lastActivity24hours: 0,
  lastActivityWeek: 1,
  lastActivity30days: 2,
  lastActivityYear: 3,
};

const defaultPeriods: Period[] = [
  {
    text: 'Last 24 Hours',
    value: LastActivityPeriod.lastActivity24hours,
    disabled: false,
  },
  {
    text: 'Last week',
    value: LastActivityPeriod.lastActivityWeek,
    disabled: false,
  },
  {
    text: 'Last 30 days',
    value: LastActivityPeriod.lastActivity30days,
    disabled: false,
  },
  {
    text: 'Last year',
    value: LastActivityPeriod.lastActivityYear,
    disabled: false,
  },
];

type Props = {
  periods?: Period[];
  value?: number;
  onChange?: (value: number) => void;
};

const LastActivitySelect: FC<Props> = ({
  value,
  onChange,
  periods = defaultPeriods,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(
    LastActivityPeriod.lastActivity30days
  );

  const handleClickAnchor = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMenuItemClick = (value: number, index: number) => {
    setSelectedIndex(index);
    onChange && onChange(value);
    setAnchorEl(null);
    setOpen(false);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  useEffect(() => {
    if (value === undefined || value < 0) return;

    const index = periods.findIndex((currency) => currency.value === value);

    setSelectedIndex(index);
  }, [periods, value]);

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Button
          onClick={handleClickAnchor}
          sx={{
            width: '100%',
            height: '48px',
            borderWidth: '0 1px 1px 0',
            borderStyle: 'solid',
            borderColor: '#808080',
            borderRadius: 0,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '18px',
            }}
          >
            {periods[selectedIndex].text}
          </Typography>
          <KeyboardArrowDown />
        </Button>

        <Menu
          sx={{
            position: 'fixed',
            zIndex: 10000000,
            width: '100%',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {periods.map((currency, index) => {
            return (
              <MenuItem
                sx={{ width: '100%' }}
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
            );
          })}
        </Menu>
      </Box>
    </>
  );
};

export default LastActivitySelect;
