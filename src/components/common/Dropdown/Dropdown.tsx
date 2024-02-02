import React, { ReactNode, MouseEvent, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  MenuProps,
  PopoverOrigin,
} from '@mui/material';

interface MenuItem {
  key: string | number;
  text: string;
  icon?: ReactNode;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  link?: string;
}

type DropdownType = 'normal' | 'right-icon' | 'right-icon-spread';

export interface DropdownProps {
  type?: DropdownType;
  /**
   * The props for Menu.
   */
  menuProps?: MenuProps;
  /**
   * The anchor of the dropdown.
   */
  children: ReactNode;
  /**
   * The menu items to be rendered.
   */
  menuItems: MenuItem[];
  /**
   * This is the point on the popover which
   * will attach to the anchor's origin.
   *
   * Options:
   * vertical: [top, center, bottom, x(px)];
   * horizontal: [left, center, right, x(px)].
   * @default {
   *   vertical: 'top',
   *   horizontal: 'left',
   * }
   */
  transformOrigin?: PopoverOrigin;
  /**
   * This is the point on the anchor where the popover's
   * `anchorEl` will attach to. This is not used when the
   * anchorReference is 'anchorPosition'.
   *
   * Options:
   * vertical: [top, center, bottom];
   * horizontal: [left, center, right].
   * @default {
   *   vertical: 'top',
   *   horizontal: 'left',
   * }
   */
  anchorOrigin?: PopoverOrigin;
}

const Dropdown = ({
  children,
  menuItems,
  menuProps,
  transformOrigin = {
    horizontal: 'left',
    vertical: 'top',
  },
  anchorOrigin = { horizontal: 'left', vertical: 'bottom' },
}: DropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickAnchor = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    e: React.MouseEvent<HTMLElement>,
    menuItem: MenuItem
  ) => {
    setAnchorEl(null);
    menuItem.onClick && menuItem.onClick(e);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Box onClick={handleClickAnchor}>{children}</Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        transformOrigin={transformOrigin}
        anchorOrigin={anchorOrigin}
        {...menuProps}
      >
        {menuItems.map((menuItem) =>
          menuItem.link ? (
            <Link key={menuItem.key} href={menuItem.link}>
              <a href={menuItem.link}>
                <MenuItem
                  onClick={(e: React.MouseEvent<HTMLElement>) =>
                    handleMenuItemClick(e, menuItem)
                  }
                  divider={true}
                >
                  {menuItem.icon && (
                    <ListItemIcon>{menuItem.icon}</ListItemIcon>
                  )}
                  <ListItemText>
                    <Typography variant={'lbl-md'}>{menuItem.text}</Typography>
                  </ListItemText>
                </MenuItem>
              </a>
            </Link>
          ) : (
            <MenuItem
              key={menuItem.key}
              onClick={(e: React.MouseEvent<HTMLElement>) =>
                handleMenuItemClick(e, menuItem)
              }
              divider={true}
            >
              {menuItem.icon && <ListItemIcon>{menuItem.icon}</ListItemIcon>}
              <ListItemText>
                <Typography variant={'lbl-md'}>{menuItem.text}</Typography>
              </ListItemText>
            </MenuItem>
          )
        )}
      </Menu>
    </Box>
  );
};

export default Dropdown;
