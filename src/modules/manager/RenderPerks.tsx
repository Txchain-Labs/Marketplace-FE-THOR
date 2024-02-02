import { Box } from '@mui/material';
import GetPerk from './GetPerk';
import EmptyTract from '@/components/common/EmptyTract';

interface perk {
  perks: Array<any>;
  availableSlots: number;
}
const RenderPerks = ({ perks, availableSlots }: perk) => {
  const emptyPerks = [];
  for (let i = 0; i < availableSlots; i++) {
    emptyPerks.push(i);
  }
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        // gap: '3px',
        // opacity: row?.rowActive ? 1 : 0.4,
      }}
    >
      {perks?.map((id, index) => (
        <GetPerk key={index} perkId={id} />
      ))}
      {emptyPerks?.map((id) => (
        <EmptyTract key={id} />
      ))}
      {/* {emptyPerks.map((item) => item)} */}
    </Box>
  );
};

export default RenderPerks;
