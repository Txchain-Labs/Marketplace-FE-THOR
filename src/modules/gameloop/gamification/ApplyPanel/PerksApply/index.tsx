import React, { FC, useEffect, useState, useRef } from 'react';
import ReactResizeDetector from 'react-resize-detector';
import { Box, Button } from '@mui/material';
import { NextLinkComposed } from '@/components/common/Link';

import {
  gamificationItemIllustrationMatchings,
  getGamificationIllustrationPoster,
} from '../../util';

import SelectNodes from './SelectNodes';
import Empty from '@/modules/gameloop/gamification/ApplyPanel/components/Empty';

import { GamificationItem, PerkItem } from '../../types';

interface PerksApplyProps {
  selectedItems: GamificationItem<PerkItem>[];
}

const PerksApply: FC<PerksApplyProps> = ({ selectedItems }) => {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [selectedPerk, setSelectedPerk] =
    React.useState<GamificationItem<PerkItem> | null>(null);
  const [showSelectPerkView, setShowSelectPerkView] = useState(false);

  const videoRef = useRef();

  const handleUsePerk = () => {
    setShowSelectPerkView(true);
  };

  useEffect(() => {
    setSelectedPerk(selectedItems.length > 0 ? selectedItems[0] : null);
    setShowSelectPerkView(false);
  }, [selectedItems]);

  useEffect(() => {
    if (selectedPerk) {
      setPosterUrl(
        getGamificationIllustrationPoster(
          `perks-${selectedPerk.isDriftPerk ? 'drift' : 'origin'}-${
            selectedPerk.perkTypeLabel
          }`
        )
      );

      if (videoRef.current) {
        (videoRef.current as HTMLVideoElement).src =
          gamificationItemIllustrationMatchings[
            `perks-${selectedPerk.isDriftPerk ? 'drift' : 'origin'}-${
              selectedPerk.perkTypeLabel
            }`
          ];
        (videoRef.current as HTMLVideoElement).load();
      }
    }
  }, [selectedPerk, videoRef]);

  return (
    <>
      {showSelectPerkView ? (
        <SelectNodes perk={selectedPerk} />
      ) : (
        <Box
          sx={(theme) => ({
            height: 'calc(100vh - 48px)',
            px: showSelectPerkView ? '0' : '105px',
            py: showSelectPerkView ? '0' : '40px',
            display: 'flex',
            alignItems: 'center',
            [theme.breakpoints.down('sm')]: {
              height: 'unset',
              minHeight: '360px',
              p: 0,
            },
          })}
        >
          {selectedPerk ? (
            <ReactResizeDetector handleWidth handleHeight>
              {({ width, height }) => (
                <Box
                  sx={(theme) => ({
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    [theme.breakpoints.down('sm')]: {
                      height: 'unset',
                    },
                  })}
                >
                  <Box
                    sx={(theme) => ({
                      width: width > height ? `${height}px` : '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      position: 'relative',
                      [theme.breakpoints.down('sm')]: {
                        'width': '100%',
                        '& video': {
                          width: '100%!important',
                          height: 'auto!important',
                        },
                      },
                    })}
                  >
                    <video
                      ref={videoRef}
                      loop
                      autoPlay={true}
                      muted
                      style={{
                        width: height > width ? '100%' : 'auto',
                        height: width > height ? height : 'auto',
                      }}
                      poster={posterUrl}
                    />

                    {selectedPerk.perkTypeLabel === 'bonus' ? (
                      <Button
                        variant={'contained_cut'}
                        to={{
                          pathname: '/manager',
                        }}
                        component={NextLinkComposed}
                        sx={{
                          width: '40%',
                          minWidth: '200px',
                          position: 'absolute',
                          bottom: '15%',
                          left: '50%',
                          transform: 'translate(-50%, 50%)',
                        }}
                      >
                        Claim
                      </Button>
                    ) : (
                      <Button
                        variant={'contained_cut'}
                        onClick={handleUsePerk}
                        sx={{
                          width: '40%',
                          minWidth: '200px',
                          position: 'absolute',
                          bottom: '15%',
                          left: '50%',
                          transform: 'translate(-50%, 50%)',
                        }}
                      >
                        Use Perk
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </ReactResizeDetector>
          ) : (
            <Empty type={'perks'} />
          )}
        </Box>
      )}
    </>
  );
};

export default PerksApply;
