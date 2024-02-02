import React, { FC, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Button, Dialog, Typography, Zoom } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

let prevState: any;

interface GamificationAnimationModalProps {
  isOpen: boolean;
  onSkip: () => void;
  label?: string;
  videoUrls: string[];
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Zoom in={true} ref={ref} {...props} />;
});

const GamificationAnimationModal: FC<GamificationAnimationModalProps> = ({
  isOpen,
  onSkip,
  label,
  videoUrls,
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const videoRef = useRef();

  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(-1);

  const handleSkip = () => {
    onSkip();
  };

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    if (_.isEqual(prevState, { videoRef, videoUrls, currentVideoIndex })) {
      return;
    }

    (videoRef.current as HTMLVideoElement).onended = function () {
      const changedVideoIndex = currentVideoIndex + 1;

      if (changedVideoIndex === videoUrls.length) {
        onSkip();
      } else {
        setCurrentVideoIndex(changedVideoIndex);
        (videoRef.current as HTMLVideoElement).src =
          videoUrls[changedVideoIndex];
        (videoRef.current as HTMLVideoElement).load();
      }
    };

    if (
      currentVideoIndex === -1 ||
      !prevState ||
      !_.isEqual(videoUrls, prevState.videoUrls)
    ) {
      setCurrentVideoIndex(0);
      (videoRef.current as HTMLVideoElement).src = videoUrls[0];
      (videoRef.current as HTMLVideoElement).load();
    }

    prevState = { videoRef, videoUrls, currentVideoIndex };
  }, [videoRef, videoUrls, currentVideoIndex, onSkip]);

  return (
    <Dialog fullScreen open={isOpen} TransitionComponent={Transition}>
      <Box
        sx={{
          background: 'linear-gradient(180deg, #272222 -25.26%, #100E0E 76.4%)',
          width: '100vw',
          height: '100vh',
        }}
      >
        <Typography
          variant={'lbl-md'}
          sx={{
            color: '#F8F8F8',
            position: 'absolute',
            top: '20px',
            right: '100px',
            p: '6px 8px',
          }}
        >
          {label
            ? label
            : videoUrls && videoUrls.length > 1 && currentVideoIndex > -1
            ? `${currentVideoIndex + 1} of ${videoUrls.length}`
            : ''}
        </Typography>

        <Button
          onClick={handleSkip}
          sx={{ position: 'absolute', top: '20px', right: '30px' }}
        >
          <Typography variant={'lbl-md'} sx={{ color: '#F8F8F8' }}>
            Skip
          </Typography>
        </Button>
        <Box
          sx={{
            position: 'fixed',
            top: 112,
            bottom: 112,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <video
            ref={videoRef}
            muted
            autoPlay={true}
            style={{
              height: smDown ? 'auto' : '100%',
              width: smDown ? '100%' : 'auto',
            }}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default GamificationAnimationModal;
