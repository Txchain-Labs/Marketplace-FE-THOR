import { Box, Typography } from '@mui/material';

const root = {
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
};

export default function NoData({
  height,
}: {
  [x: string]: any;
  height?: number | undefined;
}) {
  return (
    <Box sx={root} style={{ height: height || '100%' || 'auto' }}>
      <Typography>Not Found Data</Typography>
    </Box>
  );
}
