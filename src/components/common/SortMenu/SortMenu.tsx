import React, { FC, useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { Check } from '@mui/icons-material';
import SortLabel from './SortLabel';

export type SortDirection = 'asc' | 'desc';

export type SortOption = {
  label: string;
  directionLabels: any;
  directions: SortDirection[];
  field: string;
  disabled?: boolean;
};

type Props = {
  sortOptions: SortOption[];
  selectedField?: string | null;
  direction?: SortDirection;
  onChange?: (field: string, direction: SortDirection) => void;
};

const SortMenu: FC<Props> = ({
  sortOptions,
  selectedField,
  direction,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [_selectedField, set_selectedField] = useState<string | null>(null);
  const [_selectedDirection, set_selectedDirection] = useState<SortDirection>();
  const open = Boolean(anchorEl);

  const sortLabel = useMemo(() => {
    if (!_selectedField) return '';

    const option = sortOptions.find(({ field }) => field === _selectedField);
    if (!option) return '';

    return `${option.label} (${option.directionLabels[_selectedDirection]})`;
  }, [sortOptions, _selectedField, _selectedDirection]);

  const handleClickAnchor = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (field: string, direction: SortDirection) => {
    set_selectedField(field);
    set_selectedDirection(direction);
    onChange && onChange(field, direction);
    setAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    set_selectedField(selectedField);
    set_selectedDirection(direction);
  }, [selectedField, direction]);

  return (
    <Box display={'flex'}>
      <Button
        onClick={handleClickAnchor}
        sx={{
          borderRadius: 0,
          textTransform: 'none',
          padding: '2px',
        }}
        id="node_sort_selector"
      >
        <SortLabel text={sortLabel} direction={_selectedDirection} />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          '& .MuiMenuItem-root': {
            '& .MuiListItemIcon-root': {
              minWidth: 0,
            },
          },
        }}
      >
        {sortOptions.map((sortOption) =>
          sortOption.directions.map((direction) => (
            <MenuItem
              key={sortOption.field + direction}
              selected={
                _selectedField === sortOption.field &&
                _selectedDirection === direction
              }
              disabled={sortOption.disabled || false}
              onClick={() => handleMenuItemClick(sortOption.field, direction)}
              divider={true}
              id={sortOption.field + direction + '_sort_option'}
            >
              <ListItemText>
                <Typography variant={'lbl-md'}>
                  {`${sortOption.label} (${sortOption.directionLabels[direction]})`}
                </Typography>
              </ListItemText>
              <ListItemIcon sx={{ width: 24, height: 24 }}>
                {_selectedField === sortOption.field &&
                  _selectedDirection === direction && <Check />}
              </ListItemIcon>
            </MenuItem>
          ))
        )}
      </Menu>
    </Box>
  );
};

export default SortMenu;
