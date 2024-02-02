import { TableCell, TableRow, Typography } from '@mui/material';

const TableHeadColumns = () => (
  <TableRow>
    <TableCell
      key="gameloop-action"
      sx={{
        position: 'sticky',
        bgcolor: 'background.paper',
        left: 0,
        zIndex: 3,
      }}
    >
      <Typography variant="lbl-md">Action</Typography>
    </TableCell>
    <TableCell key="gameloop-type">
      <Typography variant="lbl-md"></Typography>
    </TableCell>
    <TableCell key="gameloop-user">
      <Typography variant="lbl-md">User</Typography>
    </TableCell>
    <TableCell key="gameloop-age">
      <Typography variant="lbl-md">Age</Typography>
    </TableCell>
  </TableRow>
);

export default TableHeadColumns;
