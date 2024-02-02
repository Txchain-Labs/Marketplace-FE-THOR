import { TableRow } from '@mui/material';
import TransformToKeycard from './Types/TransformToKeycard';
import TransformToDrift from './Types/TransformToDrift';
import Fuse from './Types/Fuse';
import Open from './Types/Open';
import Claim from './Types/Claim';
import Apply from './Types/Apply';
interface TableRow {
  data: any;
  index: number;
}
const TableDynamicRow = ({ data, index }: TableRow) => {
  const type = data?.type;
  switch (true) {
    case type === 'TRANSFORM_TO_KEYCARD':
      return <TransformToKeycard data={data} index={index} />;
    case type === 'TRANSFORM_TO_DRIFT':
      return <TransformToDrift data={data} index={index} />;
    case type === 'FUSE':
      return <Fuse data={data} index={index} />;
    case type === 'OPEN':
      return <Open data={data} index={index} />;
    case type === 'CLAIM':
      return <Claim data={data} index={index} />;
    case type === 'APPLY':
      return <Apply data={data} index={index} />;
    default:
      return <></>;
  }
};

export default TableDynamicRow;
