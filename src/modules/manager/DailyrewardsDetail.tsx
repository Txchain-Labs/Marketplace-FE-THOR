import { formatWei } from '@/utils/web3Utils';
import { Box, Typography } from '@mui/material';

interface props {
  currentVrr: string;
  perksPct: Array<string>;
}

const DailyRewardsDetail = ({ currentVrr, perksPct }: props) => {
  const vrr = formatWei(currentVrr, 18, 5);
  const totalRewards = parseFloat(vrr);
  let rewardsFromPerkApplied = 0;
  perksPct?.map((pct: string) => {
    rewardsFromPerkApplied += (Number(pct) / 100 / 100) * parseFloat(vrr);
  });
  return (
    <Box>
      <Typography variant="lbl-md" sx={{ fontSize: '12px', fontWeight: '300' }}>
        Node Rewards: {parseFloat(vrr)?.toFixed(5)} per day
      </Typography>
      <Typography variant="lbl-md" sx={{ fontSize: '12px', fontWeight: '300' }}>
        Rewards from applied Perk: {rewardsFromPerkApplied?.toFixed(5)} per day
      </Typography>
      <br></br>
      <Typography variant="lbl-md" sx={{ fontSize: '12px', fontWeight: '600' }}>
        Total Rewards {(totalRewards + rewardsFromPerkApplied)?.toFixed(5)}
      </Typography>
    </Box>
  );
};

export default DailyRewardsDetail;
