import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const root = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.067)',
  backdropFilter: 'blur(50px)',
  position: 'fixed',
  zIndex: 1,
};
const textStyle = {
  fontWeight: 500,
  fontSize: { miniMobile: '8px', xs: '12px', sm: '24px' },
  lineHeight: '36px',
  textTransform: 'uppercase',
  paddingBottom: '40px',
};
const loader = {
  color: 'secondary.yellow',
  opacity: 0.9,
};
export default function ConnectingLoader(props: {
  [x: string]: any;
  height?: number | undefined;
  size: any;
}) {
  const { height, size, ...rest } = props;

  return (
    <Box sx={root} style={{ height: height || '100%' || 'auto' }}>
      <Typography sx={textStyle}>Connecting Wallet...</Typography>
      <CircularProgress sx={loader} size={size} {...rest} />
    </Box>
  );
}
