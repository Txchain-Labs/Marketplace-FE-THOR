import { TableCell, TableRow, Typography } from '@mui/material';

const TableHeadColumns = () => (
  <TableRow>
    <TableCell
      key="capsule-action"
      sx={{
        position: 'sticky',
        bgcolor: 'background.paper',
        left: 0,
        zIndex: 3,
      }}
    >
      <Typography variant="lbl-md">Action</Typography>
    </TableCell>
    <TableCell key="capsule-asset">
      <Typography variant="lbl-md">Asset</Typography>
    </TableCell>
    <TableCell key="capsule-price">
      <Typography variant="lbl-md">Price</Typography>
    </TableCell>
    <TableCell key="capsule-from">
      <Typography variant="lbl-md">From</Typography>
    </TableCell>
    <TableCell key="capsule-to">
      <Typography variant="lbl-md">To</Typography>
    </TableCell>
    <TableCell key="capsule-age">
      <Typography variant="lbl-md">Age</Typography>
    </TableCell>
  </TableRow>
);

export default TableHeadColumns;
