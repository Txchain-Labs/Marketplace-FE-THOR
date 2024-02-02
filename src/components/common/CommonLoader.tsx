import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export default function CommonLoader(props: {
  [x: string]: any;
  width?: any;
  height?: any;
  mb?: any;
  size: any;
  text?: string;
  bgcolor?: string;
}) {
  const { width, height, bgcolor, size, text, mb, ...rest } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: width ?? '90vw',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        bgcolor,
        backdropFilter: 'blur(50px)',
      }}
      style={{ height: height || '100vh' || 'auto', width: width || '90vw' }}
    >
      <Typography variant="h4" mb={mb || 2}>
        {text}
      </Typography>
      <CircularProgress size={size} {...rest} />
    </Box>
  );
}
