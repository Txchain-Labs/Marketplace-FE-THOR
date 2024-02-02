import { TableRow } from '@mui/material';
import List from './Types/List';
import Sale from './Types/Sale';
import Bid from './Types/Bid';
interface TableRow {
  data: any;
  index: number;
}
const TableDynamicRow = ({ data, index }: TableRow) => {
  const type = data?.type;
  switch (true) {
    case type === 'LIST':
      return <List data={data} index={index} />;
    case type === 'SOLD':
      return <Sale data={data} index={index} />;
    case type === 'BID' || type === 'BID_OTC':
      return <Bid data={data} index={index} />;
    default:
      return <></>;
  }
};

export default TableDynamicRow;
