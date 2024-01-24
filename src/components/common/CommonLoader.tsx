import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const root = {
  display: 'flex',
  flexDirection: 'column',
  width: '90vw',
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(50px)',
};
const loader = {
  color: 'secondary.yellow',
};
export default function CommonLoader(props: {
  [x: string]: any;
  width?: any;
  height?: any;
  size: any;
  text: string;
}) {
  const { width, height, size, text, ...rest } = props;

  if (width) root.width = width;

  return (
    <Box
      sx={root}
      style={{ height: height || '100vh' || 'auto', width: width || '90vw' }}
    >
      <Typography variant="h4" mb={2}>
        {text}
      </Typography>
      <CircularProgress sx={loader} size={size} {...rest} />
    </Box>
  );
}
