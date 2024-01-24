import { Box, Typography } from '@mui/material';
import { menu, menuButton, menuItem } from '../../styles/profile';
import { palette } from '../../theme/palette';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface item {
  title: string;
  icon?: JSX.Element;
  action(event: any): void;
}

interface dropdown {
  handleShow(event: any): void;
  show: boolean;
  data: item[];
}

const Dropdown = ({ handleShow, show, data }: dropdown) => {
  return (
    <>
      <Box
        onClick={(event) => {
          handleShow(event);
        }}
        sx={menuButton}
      >
        <Box>
          {' '}
          <MoreVertIcon sx={{ cursor: 'pointer' }} />
        </Box>
      </Box>

      {show && (
        <Box sx={menu}>
          {data?.map((item) => (
            <Box
              key={item?.title}
              sx={menuItem}
              onClick={(event) => {
                item?.action(event);
              }}
            >
              {item?.icon}
              <Typography
                variant="lbl-md"
                sx={{ color: palette.primary.storm, alignSelf: 'flex-end' }}
              >
                {item?.title}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </>
  );
};

export default Dropdown;
