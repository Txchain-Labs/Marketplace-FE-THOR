import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { menuItem } from '../../styles/profile';
import { palette } from '../../theme/palette';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { useIconButtonStyles } from '@/modules/manager/Helper';

interface DropdownProps {
  iconColor?: string;
  data: { title: string; icon: JSX.Element; action: () => void }[];
}

const Dropdown = ({ data, iconColor }: DropdownProps) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleActionClick = (action: () => void) => {
    action();
    handleCloseMenu();
  };
  const classes = useIconButtonStyles();
  return (
    <>
      <IconButton onClick={handleOpenMenu} classes={{ root: classes.root }}>
        <MoreVertIcon
          sx={{
            color: iconColor || palette.primary.fire,
          }}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {data.map(({ title, icon, action }, index) => (
          <MenuItem
            key={index}
            sx={menuItem}
            onClick={() => handleActionClick(action)}
          >
            {icon}
            <Typography
              variant="lbl-md"
              sx={{ color: palette.primary.storm, alignSelf: 'center' }}
            >
              {title}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Dropdown;
