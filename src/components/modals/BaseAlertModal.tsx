import { Box, Dialog, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { palette } from '../../theme/palette';
type Props = {
  open: boolean;
  handleClose: any;
  title: string;
  message: any;
};

import { isMobile } from 'react-device-detect';
import { useEffect } from 'react';

const card = {
  'width': '100%',
  'maxWidth': { md: '632px', xs: '100%' },
  'height': '100%',
  'maxHeight': '650px',
  'padding': '80px 32px',
  'position': 'relative',
  'overflow': 'hidden',
  'display': 'flex',
  'flexDirection': 'column',
  'p': 2,
  '&::before': {
    height: '12%',
    top: '0px',
    right: '-1px',
    border: `1px solid ${palette.primary.storm}`,
    borderWidth: '2px 3px 0px 0px',
    transform: 'skew(45deg)',
    transformOrigin: 'right bottom',
    position: 'absolute',
    content: '""',
    width: '100%',
    zIndex: 1,
  },
  '&::after': {
    height: '12%',
    bottom: '0px',
    left: '-1px',
    border: `1px solid ${palette.primary.storm}`,
    borderWidth: '0px 0px 2px 3px',
    transform: isMobile ? '' : 'skew(45deg)',
    transformOrigin: 'left top',
    position: 'absolute',
    content: '""',
    width: '100%',
    zIndex: 1,
  },
};
const borderLeft = {
  width: '100%',
  height: '88%',
  position: 'absolute',
  top: '0',
  left: '0',
  borderLeft: `2px solid ${palette.primary.storm}`,
  zIndex: 1,
  background: 'none',
};

const borderRight = {
  width: '100%',
  position: 'absolute',
  top: '12%',
  height: '88%',
  borderRight: `2px solid ${palette.primary.storm}`,
  zIndex: 1,
  right: 0,
};

const BaseAlertModal = ({ open, handleClose, title, message }: Props) => {
  useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.style.overflow = open ? 'hidden' : 'auto';
      console.log('buyyy view is not working');
    }
  }, [open]);
  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        // keepMounted
        sx={{ zIndex: 10006, overflow: { miniMobile: 'scroll', md: 'hidden' } }}
        PaperProps={{
          sx: {
            '&.MuiPaper-root': {
              maxWidth: { md: '632px', xs: '100%' },
              background: '#FAFAFA',
              clipPath: isMobile
                ? 'polygon(50% 0, 90.5% 0, 100% 12%, 100% 100%, 4.5% 99.7%, 0 100%, 0 0)'
                : 'polygon(50% 0, 96.1% 0, 100% 12%, 100% 100%, 3.8% 99.7%, 0 88.6%, 0 0)', //big view
            },
          },
        }}
      >
        <Box sx={card}>
          <Box sx={borderLeft}></Box>
          <Box sx={borderRight}></Box>
          <CloseIcon
            sx={{
              alignSelf: 'end',
              cursor: `url("/images/cursor-pointer.svg"), auto`,
              zIndex: 2,
            }}
            onClick={handleClose}
          />
          <Typography
            variant="h3"
            sx={{ lineHeight: '61px', color: '#D90368' }}
          >
            Alert!
          </Typography>
          <Typography
            variant="p-md"
            sx={{ lineHeight: '24px', color: 'rgba(0, 0, 0, 0.5)' }}
          >
            {title}
          </Typography>
          <Typography
            variant="p-md"
            sx={{
              lineHeight: '24px',
              color: palette.primary.storm,
              mt: 2,
              mb: 4,
            }}
          >
            {message}
          </Typography>
        </Box>
      </Dialog>
    </Box>
  );
};

export default BaseAlertModal;
