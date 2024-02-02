import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material';

interface Table {
  rows: any;
  columns: any;
}

const DataTable = ({ rows, columns }: Table) => {
  const mdBreakPoint = useMediaQuery('(max-width:900px)');

  return (
    <>
      {mdBreakPoint ? (
        <TableContainer
          sx={{
            backgroundImage: 'none',
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow hover>
                {columns?.map((col: any, index: number) => (
                  <TableCell
                    key={col?.name}
                    sx={{
                      bgcolor: 'background.default',
                      position: index === 0 ? 'sticky' : undefined,
                      left: 0,
                      zIndex: index === 0 ? 2 : 1,
                    }}
                  >
                    <Typography variant="lbl-md" color={'text.secondary'}>
                      {col?.label}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row: any, rowIndex: number) => (
                <TableRow key={rowIndex} hover>
                  {columns?.map((col: any, colIndex: number) => (
                    <TableCell
                      key={colIndex}
                      sx={{
                        bgcolor: 'background.default',
                        position: colIndex === 0 ? 'sticky' : undefined,
                        left: 0,
                        zIndex: colIndex === 0 ? 2 : 1,
                      }}
                    >
                      {col?.name ? row[col?.name] : ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer
          sx={{
            backgroundImage: 'none',
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow hover>
                {columns?.map((col: any) => (
                  <TableCell key={col?.name}>
                    <Typography variant="lbl-md" color={'text.secondary'}>
                      {col?.label}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row: any, rowIndex: number) => (
                <TableRow key={rowIndex} hover>
                  {columns?.map((col: any, colIndex: number) => (
                    <TableCell key={colIndex}>
                      {col?.name ? row[col?.name] : ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default DataTable;
