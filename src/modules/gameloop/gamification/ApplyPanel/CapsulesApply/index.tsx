import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box } from '@mui/material';

import {
  getGamificationIllustrationPoster,
  gameloopIllustrationType,
  gamificationItemIllustrationMatchings,
  getAccurateCapsuleIllustrationType,
  preloadVideo,
} from '../../util';

import { useOpenCapsules } from '../../hooks/useCapsules';

import ThorfiSlider, { Slide } from '@/components/common/ThorfiSlider';
import Unlocker from '../components/Unlocker';
import GamificationAnimationModal from '../components/GamificationAnimationModal';
import Empty from '../components/Empty';
// import CountBadge from '../components/CountBadge';

import { GamificationItem, CapsuleItem, PerkItem } from '../../types';

interface ICapsulePreloadedVideosUrls {
  'drift-capsule-sigma': string;
  'drift-capsule-gamma': string;
  'drift-capsule-delta': string;
  'drift-capsule-bonus': string;
  'origin-capsule-sigma': string;
  'origin-capsule-gamma': string;
  'origin-capsule-delta': string;
  'origin-capsule-bonus': string;
}

interface CapsulesApplyProps {
  selectedItems: GamificationItem<CapsuleItem>[];
  setPendingTransaction: (pendingTransaction: Promise<any> | null) => void;
  perks: GamificationItem<PerkItem>[];
}

const CapsulesApply: FC<CapsulesApplyProps> = ({
  selectedItems,
  setPendingTransaction,
  perks,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [preloadedVideoUrls, setPreloadedVideoUrls] =
    useState<ICapsulePreloadedVideosUrls>({
      'drift-capsule-sigma': '',
      'drift-capsule-gamma': '',
      'drift-capsule-delta': '',
      'drift-capsule-bonus': '',
      'origin-capsule-sigma': '',
      'origin-capsule-gamma': '',
      'origin-capsule-delta': '',
      'origin-capsule-bonus': '',
    });
  const [openVideoUrls, setOpenVideoUrls] = useState<string[]>([]);
  const [isAnimationOpen, setIsAnimationOpen] = useState<boolean>(false);
  const [slides, setSlides] = useState<Slide[]>([]);

  const [initialPerks, setInitialPerks] = useState<
    GamificationItem<PerkItem>[]
  >([]);
  const [newPerks, setNewPerks] = useState<GamificationItem<PerkItem>[]>([]);

  const {
    openCapsules,
    isLoading: isOpeningCapsules,
    isSuccess: isCapsuleSuccessfullyOpened,
  } = useOpenCapsules();

  function onOpenCapsules() {
    const tx = openCapsules(selectedItems.map((item) => item.id));
    setPendingTransaction(tx);

    return tx;
  }

  const handleAnimationSkip = () => {
    setIsAnimationOpen(false);
    router.push('/gameloop/gamification/perks');
  };

  // preload videos
  useEffect(() => {
    (
      [
        'drift-capsule-sigma',
        'drift-capsule-gamma',
        'drift-capsule-bonus',
        'origin-capsule-sigma',
        'origin-capsule-delta',
        'origin-capsule-bonus',
      ] as gameloopIllustrationType[]
    ).forEach((item) => {
      preloadVideo(
        gamificationItemIllustrationMatchings[item],
        (url: string) => {
          setPreloadedVideoUrls((prev) => ({
            ...prev,
            [item]: url,
          }));
        }
      );
    });
  }, []);

  // Get track of the initial perk (before opening the capsule) to be able to compare later and find the new perk
  useEffect(() => {
    if (perks && initialPerks.length === 0) {
      setInitialPerks(perks);
    }
  }, [initialPerks, perks]);

  useEffect(() => {
    if (!selectedItems || isOpeningCapsules) {
      return;
    }

    setSlides(
      selectedItems.map((item) => ({
        key: item.id + item.contractAddress,
        image: getGamificationIllustrationPoster(
          `capsules-${item.isOrigin ? 'ORIGIN' : 'DRIFT'}`
        ),
        video:
          gamificationItemIllustrationMatchings[
            `capsules-${
              item.isOrigin ? 'ORIGIN' : 'DRIFT'
            }` as gameloopIllustrationType
          ],
        title: item.name,
      }))
    );
  }, [selectedItems, isOpeningCapsules]);

  // Find the new perks by comparing the initial perks with the current perks
  useEffect(() => {
    if (initialPerks.length > 0 && perks) {
      const newPerks = perks.filter(
        (perk) =>
          !initialPerks
            .map((perk) => +perk.id.toString())
            .includes(+perk.id.toString())
      );

      if (newPerks.length >= selectedItems.length) {
        setNewPerks(newPerks);
      }
    }
  }, [initialPerks, perks, selectedItems]);

  // Redirect with the perk page and select the new perk after opening a capsule
  useEffect(() => {
    if (isCapsuleSuccessfullyOpened) {
      setIsAnimationOpen(true);
    }
  }, [isCapsuleSuccessfullyOpened]);

  useEffect(() => {
    if (newPerks && newPerks.length) {
      const videoUrls = [];
      for (const perk of newPerks) {
        videoUrls.push(
          preloadedVideoUrls[getAccurateCapsuleIllustrationType(perk)]
        );
      }

      setOpenVideoUrls(videoUrls);
    }
  }, [newPerks, preloadedVideoUrls]);

  return (
    <Box
      sx={(theme) => ({
        height: 'calc(100vh - 48px)',
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
          height: 'unset',
          minHeight: '360px',
        },
      })}
    >
      {(selectedItems && selectedItems.length) || isOpeningCapsules ? (
        <Box
          sx={(theme) => ({
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            [theme.breakpoints.down('sm')]: {
              height: 'unset',
            },
          })}
        >
          <ThorfiSlider
            slides={slides}
            mediaType={'video'}
            hideTitle={true}
            size={smDown ? 'small' : 'medium'}
            fullHeightOffset={49}
            action={
              <>
                <Unlocker
                  count={slides.length}
                  itemToUnlock={selectedItems}
                  isUnlocking={isOpeningCapsules}
                  onUnlock={onOpenCapsules}
                />
              </>
            }
          />
        </Box>
      ) : (
        <Empty type={'capsules'} />
      )}

      <GamificationAnimationModal
        isOpen={isAnimationOpen}
        onSkip={handleAnimationSkip}
        videoUrls={openVideoUrls}
      />
    </Box>
  );
};

export default CapsulesApply;
