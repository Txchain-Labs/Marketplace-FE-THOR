import { Box } from '@mui/material';
import { ThorFinance } from '@multifarm/thor-finance';
import '@multifarm/thor-finance/dist/thor-finance.css';
import { MULTIFARM_TOKEN } from '../../utils/constants';

const Dashboard = () => {
  return (
    <Box
      sx={(theme) => ({
        '.multifarm-thor-finance': {
          '--main-bg': theme.palette.background.default,
          '--tooltip-bg': 'rgb(128, 128, 128)',
          '--tab-bg': 'rgb(114 114 114 / 40%)',
          '--card-bg': 'transparent',
          '--card-border': 'rgb(107 107 107 / 30%)',
          '--table-cell-bg': 'transparent',
          '--accent-color': theme.palette.primary.main,
          '--primary-text': theme.palette.text.primary,
          '--secondary-text': theme.palette.text.secondary,
          '--pie-chart-stroke': 'transparent',

          '.multifarm-widget-tabs-tab[data-active=true]': {
            color: theme.palette.text.primary,
          },

          '.multifarm-widget-chart .recharts-cartesian-axis-tick tspan': {
            fill: theme.palette.text.primary,
          },
        },
      })}
    >
      <ThorFinance token={MULTIFARM_TOKEN} />
    </Box>
  );
};

export default Dashboard;
