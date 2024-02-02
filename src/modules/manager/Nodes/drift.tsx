import { Box /*, Typography */ } from '@mui/material';
import { nodesWrapper /*, nodeTitle */ } from '../../../styles/Manager';
import NodeSelectVideoTile from '../NodeSelectVideoTile';

interface Origin {
  activeType: string;
  activeNode: string;
  setActive: (node: string, type: string) => void;
}

const DriftNodes = ({ setActive, activeType, activeNode }: Origin) => {
  const handleTileClick = (node: string) => {
    setActive(node, 'DRIFT');
  };
  return (
    <Box>
      {/* <Typography sx={nodeTitle(activeType === 'DRIFT')}>
        {activeType === 'DRIFT' && (
          <img src="/images/drift-icon.png" width="18px" height="18px"></img>
        )}{' '}
        DRIFT
      </Typography> */}
      <Box sx={nodesWrapper}>
        <NodeSelectVideoTile
          nodeType="ODIN"
          currentActive={activeType === 'DRIFT' && activeNode === 'ODIN'}
          enable={activeType === 'DRIFT'}
          poster="/images/odinDrift.png"
          video="/images/manager/videos/Odin Drift NFT Node (Light) .mp4"
          text="ODIN"
          handleTileClick={handleTileClick}
        />
        <NodeSelectVideoTile
          nodeType="THOR"
          currentActive={activeType === 'DRIFT' && activeNode === 'THOR'}
          enable={activeType === 'DRIFT'}
          poster="/images/thorDrift.png"
          video="/images/manager/videos/Thor Drift NFT Node (Light).mp4"
          text="THOR"
          handleTileClick={handleTileClick}
        />
      </Box>
    </Box>
  );
};

export default DriftNodes;
