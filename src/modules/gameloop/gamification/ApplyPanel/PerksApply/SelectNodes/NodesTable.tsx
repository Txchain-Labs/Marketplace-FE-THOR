import React, {
  Dispatch,
  FC,
  SetStateAction,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { BigNumber, ethers } from 'ethers';
import moment from 'moment';
import {
  Box,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { useGetNodesV2 } from '@/hooks/useNodes';

import { NodeType, ThorTier } from '@/utils/types';

import PerkTrack from '@/components/common/PerkTrack';

interface NodesTableProps {
  selectedTier: ThorTier;
  selectedNodesState: [NodeType[], Dispatch<SetStateAction<NodeType[]>>];
}

const NodesTable: FC<NodesTableProps> = ({
  selectedTier,
  selectedNodesState,
}) => {
  const { data: userNodes } = useGetNodesV2();
  const [selectedNodes, setSelectedNodes] = selectedNodesState;
  const [selectedThorNode, setSelectedThorNode] = useState<NodeType | null>(
    null
  );
  const [selectedOdinNode, setSelectedOdinNode] = useState<NodeType | null>(
    null
  );

  const filteredNodes = useMemo<NodeType[]>(() => {
    if (!userNodes) {
      return [];
    }

    return userNodes.filter(
      (node) =>
        node.tier === selectedTier &&
        node.nodeType === 'ORIGIN' &&
        moment().isSameOrBefore(moment(node.dueDate * 1000))
    );
  }, [selectedTier, userNodes]);

  const renderPerks = (perks: number[]) => {
    perks = [0, 1].map((index) => perks[index] || -1);

    return (
      <Box
        sx={{
          display: 'flex',
        }}
      >
        {perks.map((id, index) => (
          <PerkTrack id={id} key={index} />
        ))}
      </Box>
    );
  };

  const renderVRR = (vrr: BigNumber) => {
    return Number(ethers.utils.formatEther(vrr)).toFixed(4);
  };

  const renderDueDate = (date: BigNumber) => {
    const dueDateInDay = Math.floor(
      moment
        .duration(moment(moment(date.toNumber() * 1000)).diff(moment()))
        .asDays()
    );

    if (dueDateInDay > 0) {
      return dueDateInDay;
    } else {
      return 0;
    }
  };

  const isActive = (node: NodeType) => {
    if (node.perks.length === 2) {
      return false;
    }

    if (node.tier === 'THOR' && selectedThorNode) {
      return selectedThorNode.tokenId.eq(node.tokenId);
    } else if (node.tier === 'ODIN' && selectedOdinNode) {
      return selectedOdinNode.tokenId.eq(node.tokenId);
    } else {
      return true;
    }
  };

  const isSelected = (node: NodeType) => {
    if (node.tier === 'THOR' && selectedThorNode) {
      return selectedThorNode.tokenId.eq(node.tokenId);
    } else if (node.tier === 'ODIN' && selectedOdinNode) {
      return selectedOdinNode.tokenId.eq(node.tokenId);
    } else {
      return false;
    }
  };

  function handleSelectNode(node: NodeType) {
    const isNodeSelected = selectedNodes.find((n) =>
      n.tokenId.eq(node.tokenId)
    );

    if (isNodeSelected) {
      setSelectedNodes(
        selectedNodes.filter((n) => !n.tokenId.eq(node.tokenId))
      );
    } else {
      if (selectedNodes.length < 2) {
        setSelectedNodes([...selectedNodes, node]);
      }
    }
  }

  useEffect(() => {
    setSelectedThorNode(
      selectedNodes.filter((node) => node.tier === 'THOR')[0] ?? null
    );
    setSelectedOdinNode(
      selectedNodes.filter((node) => node.tier === 'ODIN')[0] ?? null
    );
  }, [selectedNodes]);

  return (
    <TableContainer>
      <Table aria-label={'Nodes table'}>
        <TableBody>
          {filteredNodes.map((node) => (
            <TableRow
              key={node.tokenId + node.tier + node.nodeType}
              sx={{
                '& td': {
                  borderBottom: '1px solid #D9D9D9',
                  p: '8px 16px',
                },
                '&:last-child td': {
                  border: 0,
                },
              }}
            >
              <TableCell>
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
                  <Box>
                    <Typography
                      variant={'lbl-lg'}
                      lineHeight={'27px'}
                      sx={{
                        maxWidth: '100px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {node.name}
                    </Typography>
                    <Typography variant={'lbl-md'} lineHeight={'21px'}>
                      {node.tier}
                    </Typography>
                  </Box>
                  {renderPerks(node.perks)}
                </Box>
              </TableCell>
              <TableCell>
                <Box display={'flex'} alignItems={'center'}>
                  <Box sx={{ position: 'relative', height: '73px' }}>
                    <Typography
                      variant={'p-sm'}
                      fontWeight={300}
                      lineHeight={'18px'}
                      position={'absolute'}
                      top={0}
                      left={0}
                    >
                      VRR
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '48px',
                        lineHeight: '73px',
                        letterSpacing: '-0.04em',
                        mr: '8px',
                      }}
                    >
                      {renderVRR((node as any).currentVrr as BigNumber)}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 300,
                      fontSize: '12px',
                      lineHeight: '18px',
                      width: '53px',
                    }}
                  >
                    THOR PER DAY
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box display={'flex'} alignItems={'center'}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '48px',
                      lineHeight: '73px',
                      letterSpacing: '-0.04em',
                      mr: '8px',
                    }}
                  >
                    {renderDueDate(node.dueDate as unknown as BigNumber)}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 300,
                      fontSize: '12px',
                      lineHeight: '18px',
                      width: '61px',
                    }}
                  >
                    DAYS DUE DATE
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align={'right'}>
                <Button
                  variant={'contained'}
                  startIcon={isSelected(node) ? <RemoveIcon /> : <AddIcon />}
                  disabled={!isActive(node)}
                  onClick={() => handleSelectNode(node)}
                  sx={{
                    'width': '193px',
                    'height': '45px',
                    '&.Mui-disabled': {
                      backgroundColor: '#B3B3B3',
                      color: '#808080',
                    },
                    'clipPath': 'none !important',
                  }}
                >
                  {isSelected(node) ? 'Unselect' : 'Select'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NodesTable;
