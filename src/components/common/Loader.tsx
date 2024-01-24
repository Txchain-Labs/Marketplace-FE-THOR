import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const root = {
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
};
const loader = {
  color: 'secondary.yellow',
};
export default function Loader(props: {
  [x: string]: any;
  height?: number | undefined;
  size: any;
}) {
  const { height, size, ...rest } = props;

  return (
    <Box sx={root} style={{ height: height || '100%' || 'auto' }}>
      <CircularProgress sx={loader} size={size} {...rest} />
    </Box>
  );
}
