import { ThorFinance } from '@multifarm/thor-finance';
import '@multifarm/thor-finance/dist/thor-finance.css';
import { MULTIFARM_TOKEN } from '../../utils/constants';

const Dashboard = () => {
  return <ThorFinance token={MULTIFARM_TOKEN} />;
};

export default Dashboard;
