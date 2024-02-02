import { Box, Typography } from '@mui/material';

interface State {
  type?: string;
}
const EmptyState = ({ type }: State) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        p: '5%',
        marginTop: 2,
      }}
    >
      <img src="/images/manager/perk/perkEmpty.png" alt="Empty" />
      <Typography variant="p-lg" color={'#4C4C4C'} mt={2}>
        No result found
      </Typography>
      <Typography variant="caption" color={'#4C4C4C'} mt={1}>
        Try adjusting your {type}
      </Typography>
    </Box>
  );
};

export default EmptyState;
