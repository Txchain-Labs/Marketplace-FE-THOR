import { palette } from '@/theme/palette';
import { Box, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import CapsuleTable from './Capsule/CapsuleTable';
import GameloopTable from './Gameloop/GameloopTable';
import Toggle from '@/components/common/Toggle';

// import { useGetCapsuleEvents, useGetGameloopEvents } from '@/hooks/firestore';

const ActivityPanel = () => {
  const smBreakPoint = useMediaQuery('(max-width:600px)');
  const [activeType, setActiveType] = useState('capsule');
  const handleActiveChange = (type: string) => {
    setActiveType(type);
  };
  const [activityActiveState, setActivityActiveState] = useState(true);
  // const capsuleData = useGetCapsuleEvents(activityActiveState);
  // const gameloopData = useGetGameloopEvents(activityActiveState);

  // console.log('capsule data', capsuleData);
  // console.log('gameloop data', gameloopData);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{ width: '34px', height: '34px' }}
              className="pulse-ring-animated light"
            ></Box>
            <Box
              sx={{ width: '34px', height: '34px' }}
              className="pulse-ring-animated"
            ></Box>
            <Image src="/images/Ellipse.svg" height={20} width={20} />
          </Box>
          <Typography
            variant="sub-h"
            sx={{
              fontWeight: '700',
              lineHeight: '36px',
              height: '32px',
              fontSize: smBreakPoint ? '20px' : '24px',
            }}
            color={palette.primary.lightParrot}
          >
            Live Activity
          </Typography>
        </Box>
        {!activityActiveState ? (
          <Box
            sx={{
              display: smBreakPoint ? 'none' : 'flex',
              gap: '5px',
              alignItems: 'center',
            }}
          >
            <Image
              src="/images/activityPanel/info_outline.svg"
              width={15}
              height={15}
            />
            <Typography
              variant="p-smd"
              color={palette.primary.semanticBlue}
              sx={{ paddingTop: '5px' }}
            >
              Activity paused on hover
            </Typography>
          </Box>
        ) : (
          ''
        )}
        <Toggle
          options={['capsule', 'gameloop']}
          value={activeType}
          onChange={handleActiveChange}
        />
      </Box>
      <Box
        sx={{
          display: smBreakPoint ? 'flex' : 'none',
          gap: '5px',
          alignItems: 'center',
        }}
      >
        <Image
          src="/images/activityPanel/info_outline.svg"
          width={15}
          height={15}
        />
        <Typography
          variant="p-smd"
          color={palette.primary.semanticBlue}
          sx={{ paddingTop: '5px' }}
        >
          Activity paused on hover
        </Typography>
      </Box>
      {activeType === 'capsule' && (
        <Box
          onMouseEnter={() => setActivityActiveState(false)}
          onMouseLeave={() => setActivityActiveState(true)}
        >
          <CapsuleTable activityActiveState={activityActiveState} />
        </Box>
      )}
      {activeType === 'gameloop' && (
        <Box
          onMouseEnter={() => setActivityActiveState(false)}
          onMouseLeave={() => setActivityActiveState(true)}
        >
          <GameloopTable activityActiveState={activityActiveState} />
        </Box>
      )}
    </Box>
  );
};
export default ActivityPanel;
