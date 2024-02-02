import { Box } from '@mui/material';
import { nodesWrapper } from '../../../styles/Manager';
import NodeSelectVideoTile from '../NodeSelectVideoTile';

interface Origin {
  activeType: string;
  activeNode: string;
  setActive: (node: string, type: string) => void;
}

const OriginPerks = ({ setActive, activeType, activeNode }: Origin) => {
  const handleTileClick = (node: string) => {
    setActive(node, 'ORIGIN');
  };
  return (
    <Box>
      {/* <Typography sx={nodeTitle(activeType === 'ORIGIN')}>
        {activeType === 'ORIGIN' && (
          <img src="images/origin-icon.png" width="18px" height="18px"></img>
        )}{' '}
        ORIGIN
      </Typography> */}
      <Box sx={nodesWrapper}>
        <NodeSelectVideoTile
          nodeType="SIGMA"
          currentActive={activeType === 'ORIGIN' && activeNode === 'SIGMA'}
          enable={activeType === 'ORIGIN'}
          poster="/images/manager/stills/Origin_sigma.png"
          video="/images/manager/videos/Origin_capsule_sigma_perknft.mp4"
          text="SIGMA"
          handleTileClick={handleTileClick}
        />
        <NodeSelectVideoTile
          nodeType="DELTA"
          currentActive={activeType === 'ORIGIN' && activeNode === 'DELTA'}
          enable={activeType === 'ORIGIN'}
          poster="/images/manager/stills/Origin_delta.png"
          video="/images/manager/videos/Origin_capsule_delta_perknft.v2.mp4"
          text="DELTA"
          handleTileClick={handleTileClick}
        />
        <NodeSelectVideoTile
          nodeType="GAMMA"
          currentActive={activeType === 'ORIGIN' && activeNode === 'GAMMA'}
          enable={activeType === 'ORIGIN'}
          poster="/images/manager/stills/Origin_gamma.png"
          video="/images/manager/videos/Origin_capsule_gamma_perknft.mp4"
          text="GAMMA"
          handleTileClick={handleTileClick}
        />
        <NodeSelectVideoTile
          nodeType="BONUS"
          currentActive={activeType === 'ORIGIN' && activeNode === 'BONUS'}
          enable={activeType === 'ORIGIN'}
          poster="/images/manager/stills/OriginBonus.png"
          video="/images/manager/videos/Origin_capsule_bonus_perknft.mp4"
          text="BONUS"
          handleTileClick={handleTileClick}
        />
      </Box>
    </Box>
  );
};

export default OriginPerks;
