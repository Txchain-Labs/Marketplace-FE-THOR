import { useEffect, useRef } from 'react';
import { activeNodeText, nodeWrapper } from '@/styles/Manager';
import { Box, Typography } from '@mui/material';
import { isMobile } from 'react-device-detect';

const NodeSelectTile = ({
  tier,
  nodeType,
  currentActive,
  enable,
  poster,
  video,
  text,
  handleTileClick,
}: any) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (!currentActive) {
      videoRef.current.pause();
    }
  }, [currentActive]);
  return (
    <Box
      sx={nodeWrapper(currentActive)}
      onMouseOver={() => {
        videoRef.current.play();
      }}
      onMouseOut={() => {
        !currentActive ? videoRef.current.pause() : '';
      }}
    >
      <Box
        onClick={() => handleTileClick(tier, nodeType)}
        sx={{
          'opacity': enable ? 1 : 0.4,
          //simple hover
          '&:hover': {
            opacity: 1,
          },
          'clipPath': currentActive
            ? 'polygon( 30% 0%, 80% 0, 100% 20%, 100% 100%, 70% 100%, 100% 100%, 0 100%, 0 0) !important'
            : '',
        }}
      >
        <video
          ref={videoRef}
          autoPlay={currentActive}
          loop
          muted
          playsInline
          poster={poster}
          style={{
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        >
          <source src={video} type="video/mp4" />
        </video>
        <Box
          sx={{
            ...activeNodeText(currentActive),
            left: 0,
            zIndex: currentActive ? 1 : -1,
          }}
        >
          <Typography
            variant="lbl-md"
            sx={{
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: isMobile ? 300 : 700,
              lineHeight: isMobile ? 'unset' : 'auto',
            }}
          >
            {text}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default NodeSelectTile;
