import { Box, Typography } from '@mui/material';
import { nodesWrapper, nodeTitle } from '../../../styles/Manager';
import NodeSelectVideoTile from '../NodeSelectVideoTile';

interface Origin {
  activeType: string;
  activeNode: string;
  setActive: (node: string, type: string) => void;
}

const OriginNodes = ({ setActive, activeType, activeNode }: Origin) => {
  const handleTileClick = (node: string) => {
    setActive(node, 'ORIGIN');
  };
  return (
    <Box>
      <Typography sx={nodeTitle(activeType === 'ORIGIN')}>
        {activeType === 'ORIGIN' && (
          <img src="/images/origin-icon.png" width="18px" height="18px"></img>
        )}{' '}
        ORIGIN
      </Typography>
      <Box sx={nodesWrapper}>
        <NodeSelectVideoTile
          nodeType="ODIN"
          currentActive={activeType === 'ORIGIN' && activeNode === 'ODIN'}
          enable={activeType === 'ORIGIN'}
          poster="/images/manager/stills/odincard_rare.png"
          video="/images/manager/videos/Odin_card_rare.mp4"
          text="ODIN"
          handleTileClick={handleTileClick}
        />
        <NodeSelectVideoTile
          nodeType="THOR"
          currentActive={activeType === 'ORIGIN' && activeNode === 'THOR'}
          enable={activeType === 'ORIGIN'}
          poster="/images/manager/stills/thorcard_rare.png"
          video="/images/manager/videos/Thor_card_rare.mp4"
          text="THOR"
          handleTileClick={handleTileClick}
        />
      </Box>
    </Box>
  );
};

export default OriginNodes;
