import {
  Typography,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Drawer,
  Button,
} from '@mui/material';
import {
  ArrowBackIos,
  RemoveCircle as RemoveCircleIcon,
} from '@mui/icons-material';
import React from 'react';
import { formatNumber } from '@/utils/common';
import { NAVBAR_HEIGHT } from '@/utils/constants';

const MobileDrawer = ({
  open,
  onClose,
  totalSelected,
  selectedNodes,
  deselectNode,
}: any) => {
  return (
    <div>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: {
            invisible: true,
          },
        }}
        sx={{
          '& .MuiDrawer-paper': {
            marginTop: NAVBAR_HEIGHT,
            boxSizing: 'border-box',
            width: '100%',
            height: {
              miniMobile: `calc(100vh - ${NAVBAR_HEIGHT.miniMobile})`,
              sm: `calc(100vh - ${NAVBAR_HEIGHT.sm})`,
            },
            backgroundImage: 'none',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',

            justifyContent: 'flex-start',
            padding: '15px',
          }}
        >
          <Button
            startIcon={<ArrowBackIos />}
            size={'small'}
            sx={{ color: 'text.secondary' }}
            onClick={onClose}
          >
            Selection
          </Button>
        </Box>
        {totalSelected > 0 ? (
          <TableContainer
            component={Paper}
            sx={{
              overflowY: 'auto',
              boxShadow: 'none',
              backgroundImage: 'none',
            }}
          >
            <Table aria-label="simple table">
              <TableBody>
                {selectedNodes.map((row: any) => (
                  <TableRow
                    hover
                    key={row.node.tier + row.node.tokenId}
                    sx={{
                      'height': '80px',
                      '&:hover .DeSelectIcon': {
                        display: 'block',
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Typography sx={{ fontWeight: 900, fontSize: '13px' }}>
                          {/* {row.node.name} */}
                          {row.node.name.slice(0, 10)}
                          {row.node.name.length > 10 ? '...' : ''}
                        </Typography>
                        <Typography
                          sx={{
                            color: 'text.secondary',
                            fontSize: '13px',
                          }}
                        >
                          {row.node.isThorOdin}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Typography sx={{ fontWeight: 900, fontSize: '24px' }}>
                          {formatNumber(row.node.vrr, 5)}
                        </Typography>
                        <Box>
                          <Typography
                            sx={{ fontSize: '13px', color: 'text.secondary' }}
                          >
                            VRR
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 900,
                              fontSize: '13px',
                              width: '110px',
                            }}
                          >
                            THOR PER DAY
                          </Typography>
                          <Typography
                            sx={{
                              color: 'text.secondary',
                              fontSize: '13px',
                            }}
                          >
                            {formatNumber(row.node.rewards, 4)} Pending Rewards
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell
                      sx={{
                        width: '100px',
                      }}
                    >
                      <Box sx={{ display: 'none' }} className="DeSelectIcon">
                        <IconButton
                          onClick={() =>
                            deselectNode(row.node.class, row.node.name)
                          }
                        >
                          <RemoveCircleIcon color="primary" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            sx={(theme) => ({
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '35px',
              border: `2px dashed ${theme.palette.divider}`,
              marginLeft: '15px',
              marginRight: '30px',
              marginTop: {
                md: '200px',
                xs: '220px',
              },
            })}
          >
            <Typography
              variant="lbl-md"
              sx={{
                color: 'text.secondary',
                fontFamily: 'Nexa',
                fontWeight: '300',
                fontSize: '15px',
                lineHeight: '56px',
              }}
            >
              Select NFTs to Transform
            </Typography>
          </Box>
        )}
      </Drawer>
    </div>
  );
};

export default MobileDrawer;
