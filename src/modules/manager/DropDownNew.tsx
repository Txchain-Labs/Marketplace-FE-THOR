import { useState } from 'react';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { menuItem } from '@/styles/profile';
import { palette } from '@/theme/palette';

interface DropdownProps {
  data: { title: string; icon: string; action: () => void }[];
  row: any;
}
const DropdownNew = ({ data, row }: DropdownProps) => {
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
  return (
    <>
      <IconButton disabled={!row?.rowActive} onClick={handleOpenMenu}>
        <MoreVertIcon sx={{ color: 'text.primary' }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {data?.map(({ title, icon, action }, index) => (
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
export default DropdownNew;
