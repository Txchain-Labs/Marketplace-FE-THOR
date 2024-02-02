import React, { FC, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { BigNumber } from 'ethers';
import { Box, Button, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

import ThorKeyNFTAbi from '../../../../../../public/abi/ThorKeyNFT.json';
import { useCreateCapsules } from '../../hooks/useCapsules';
import {
  useApproveGamification,
  useGamificationAllowance,
} from '../../hooks/useGamification';

import {
  gameloopIllustrationType,
  gamificationItemIllustrationMatchings,
  preloadVideo,
} from '../../util';

import { ThorTier } from '@/utils/types';
import { GamificationItem, CapsuleItem, KeyCardItem } from '../../types';

import PlaceholderCard from '../components/PlaceholderCard';
import FusingKeycardsLoader from '../components/FusingKeycardsLoader';
import GamificationAnimationModal from '../components/GamificationAnimationModal';
import CountBadge from '../components/CountBadge';

interface IKeycardPreloadedVideosUrl {
  origin: string;
  drift: string;
}

interface KeycardsApplyProps {
  selectedItems: GamificationItem<KeyCardItem>[];
  capsules: GamificationItem<CapsuleItem>[];
  setPendingTransaction: (pendingTransaction: Promise<any> | null) => void;
}

const KeycardsApply: FC<KeycardsApplyProps> = ({
  selectedItems,
  capsules,
  setPendingTransaction,
}) => {
  const [selectedOdinVideoUrl, setSelectedOdinVideoUrl] = useState<
    string | null
  >(null);
  const [selectedThorVideoUrl, setSelectedThorVideoUrl] = useState<
    string | null
  >(null);
  const [keycardType, setKeycardType] = useState<'origin' | 'drift'>();
  const [selectedOdinCount, setSelectedOdinCount] = useState<number>(0);
  const [selectedThorCount, setSelectedThorCount] = useState<number>(0);

  const [preloadedVideoUrls, setPreloadedVideoUrls] =
    useState<IKeycardPreloadedVideosUrl>({
      origin: '',
      drift: '',
    });

  const [isAnimationOpen, setIsAnimationOpen] = useState<boolean>(false);
  const [initialCapsules, setInitialCapsules] = useState<
    GamificationItem<CapsuleItem>[]
  >([]);

  const [newCapsuleIds, setNewCapsuleIds] = useState<string[]>([]);

  const odinVideoRef = useRef();
  const thorVideoRef = useRef();

  const {
    createCapsules,
    isLoading: isCreatingCapsule,
    isSuccess: isCapsuleSuccessfullyCreated,
  } = useCreateCapsules();

  const { data: isAllowed, refetch: refetchAllowances } =
    useGamificationAllowance('keycards', ThorKeyNFTAbi);

  const { isLoading, approve, isSuccess } = useApproveGamification(
    'keycards',
    ThorKeyNFTAbi
  );
  const router = useRouter();

  const cardContainerStyle = {
    flex: '1 0',
    m: '8px',
    position: 'relative',
    maxWidth: '388px',
  };

  const placeHolderCardStyle = {
    width: '100%',
    boxShadow: '4px 4px 34px rgba(0, 0, 0, .25)',
    margin: 'auto',
    aspectRatio: '1/1',
  };

  function getSelectedKeys(
    tier: ThorTier
  ): GamificationItem<KeyCardItem>[] | undefined {
    return (selectedItems as GamificationItem<KeyCardItem>[]).filter((item) => {
      return item.tier === tier;
    });
  }

  function getActionButtonLabel() {
    if (isLoading) {
      return 'Approving ...';
    }

    return isAllowed
      ? selectedOdinCount > 1 && selectedThorCount > 1
        ? 'Create Capsules'
        : 'Create Capsule'
      : 'Approve';
  }

  function triggerApprove() {
    setPendingTransaction(approve());
  }

  async function triggerCreateCapsule() {
    const odinKeys = getSelectedKeys('ODIN');
    const thorKeys = getSelectedKeys('THOR');

    if (odinKeys.length && thorKeys.length) {
      await createCapsules([
        odinKeys.map((key) => key.id),
        thorKeys.map((key) => key.id),
      ]);
    }
  }

  const handleAnimationSkip = () => {
    setIsAnimationOpen(false);
    if (isCapsuleSuccessfullyCreated) {
      let redirectUrl = '/gameloop/gamification/capsules';
      if (newCapsuleIds.length) {
        redirectUrl = `/gameloop/gamification/capsules?s=${newCapsuleIds.join(
          '%2C'
        )}`;
      }
      router.push(redirectUrl);
    }
  };

  // preload videos
  useEffect(() => {
    preloadVideo(
      gamificationItemIllustrationMatchings['fuze-keycard-drift'],
      (url: string) => {
        setPreloadedVideoUrls((prev) => ({
          ...prev,
          drift: url,
        }));
      }
    );

    preloadVideo(
      gamificationItemIllustrationMatchings['fuze-keycard-origin'],
      (url: string) => {
        setPreloadedVideoUrls((prev) => ({
          ...prev,
          origin: url,
        }));
      }
    );
  }, []);

  useEffect(() => {
    if (capsules && initialCapsules.length === 0) {
      setInitialCapsules(capsules);
    }
  }, [initialCapsules, capsules]);

  useEffect(() => {
    if (isSuccess && refetchAllowances) {
      refetchAllowances();
    }
  }, [refetchAllowances, isSuccess]);

  useEffect(() => {
    if (isCapsuleSuccessfullyCreated) {
      setIsAnimationOpen(true);
    }
  }, [isCapsuleSuccessfullyCreated]);

  useEffect(() => {
    if (isCreatingCapsule || isCapsuleSuccessfullyCreated) {
      return;
    }

    if (selectedItems) {
      const odinKeys = selectedItems.filter((item) => item.tier === 'ODIN');
      const thorKeys = selectedItems.filter((item) => item.tier === 'THOR');

      setSelectedOdinCount(odinKeys.length);
      setSelectedThorCount(thorKeys.length);

      if (odinKeys.length > 0) {
        setSelectedOdinVideoUrl(
          gamificationItemIllustrationMatchings[
            `${odinKeys[0].type}-${odinKeys[0].isOrigin ? 'ORIGIN' : 'DRIFT'}-${
              odinKeys[0].tier
            }` as gameloopIllustrationType
          ]
        );

        if (odinVideoRef.current) {
          (odinVideoRef.current as HTMLVideoElement).load();
        }
      } else {
        setSelectedOdinVideoUrl(null);
      }

      if (thorKeys.length > 0) {
        setSelectedThorVideoUrl(
          gamificationItemIllustrationMatchings[
            `${thorKeys[0].type}-${thorKeys[0].isOrigin ? 'ORIGIN' : 'DRIFT'}-${
              thorKeys[0].tier
            }` as gameloopIllustrationType
          ]
        );

        if (thorVideoRef.current) {
          (thorVideoRef.current as HTMLVideoElement).load();
        }
      } else {
        setSelectedThorVideoUrl(null);
      }

      if (odinKeys.length > 0 && thorKeys.length > 0) {
        setKeycardType(odinKeys[0].isOrigin ? 'origin' : 'drift');
      }
    }
  }, [
    selectedItems,
    isCreatingCapsule,
    isCapsuleSuccessfullyCreated,
    odinVideoRef,
    thorVideoRef,
  ]);

  useEffect(() => {
    if (initialCapsules.length === 0 || !capsules) return;

    const newCapsules = capsules.filter(
      (capsule) =>
        !initialCapsules
          .map((item) => (item.id as BigNumber).toNumber())
          .includes((capsule.id as BigNumber).toNumber())
    );

    if (newCapsules.length > 0) {
      setNewCapsuleIds(newCapsules.map((capsule) => capsule.id.toString()));
    }
  }, [initialCapsules, capsules]);

  return (
    <Box
      sx={(theme) => ({
        height: 'calc(100vh - 48px)',
        background: isCreatingCapsule
          ? 'linear-gradient(180deg, #1F1B1B 6.58%, #100E0E 54.52%)'
          : undefined,
        backgroundImage: !isCreatingCapsule
          ? 'url(/images/thorfi/gamification/keycards-background.png)'
          : undefined,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        px: '23px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
          height: '376px',
          p: '0 16px',
          backgroundImage: 'unset',
          background: isCreatingCapsule
            ? 'linear-gradient(180deg, #1F1B1B 6.58%, #100E0E 54.52%)'
            : undefined,
        },
      })}
    >
      <Box width={'100%'}>
        {!isCreatingCapsule && (
          <Box mb={'56px'}>
            <Typography
              variant={'h2'}
              sx={(theme) => ({
                width: '350px',
                lineHeight: '56px',
                color: 'primary.main',
                mb: '8px',
                [theme.breakpoints.down('sm')]: {
                  lineHeight: '27px',
                  fontSize: '18px',
                  width: 'unset',
                },
              })}
            >
              Generate Your ThorFi Capsule
            </Typography>
            <Typography
              sx={(theme) => ({
                fontSize: '22px',
                fontWeight: 400,
                lineHeight: '28px',
                color:
                  theme.palette.mode === 'dark' ? 'text.secondary' : undefined,
                opacity: theme.palette.mode === 'light' ? 0.48 : undefined,
                width: '394px',
                [theme.breakpoints.down('sm')]: {
                  width: 'unset',
                  fontSize: '12px',
                  fontWeight: 300,
                  lineHeight: '18px',
                },
              })}
            >
              Fuse your Odin and Thor keycards to create a capsule. Chose to
              unlock it for a chance at winning 1 of 4 perks
            </Typography>
          </Box>
        )}
        <Box position={'relative'}>
          <Box display={'flex'} justifyContent={'center'}>
            <Box sx={cardContainerStyle} textAlign={'right'}>
              {selectedOdinCount > 0 && (
                <CountBadge count={selectedOdinCount} />
              )}
              {getSelectedKeys('ODIN').length > 0 || isCreatingCapsule ? (
                <video
                  ref={odinVideoRef}
                  style={placeHolderCardStyle}
                  key={selectedOdinVideoUrl}
                  loop
                  autoPlay={true}
                  muted
                >
                  <source src={selectedOdinVideoUrl} type="video/mp4" />
                </video>
              ) : (
                <PlaceholderCard sx={placeHolderCardStyle} label="Odin Key" />
              )}
            </Box>

            <Box sx={cardContainerStyle}>
              {selectedThorCount > 0 && (
                <CountBadge count={selectedThorCount} />
              )}
              {getSelectedKeys('THOR').length > 0 || isCreatingCapsule ? (
                <video
                  ref={thorVideoRef}
                  style={placeHolderCardStyle}
                  key={selectedThorVideoUrl}
                  loop
                  autoPlay={true}
                  muted
                >
                  <source src={selectedThorVideoUrl} type="video/mp4" />
                </video>
              ) : (
                <PlaceholderCard sx={placeHolderCardStyle} label="Thor Key" />
              )}
            </Box>
          </Box>

          {selectedItems.length > 0 && !isCreatingCapsule && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                transform: 'translateY(-50%)',
                textAlign: 'center',
              }}
            >
              <Button
                sx={{
                  boxShadow: '4px 4px 34px rgba(0, 0, 0, .25)',
                  width: '180px',
                }}
                variant={'contained_cut'}
                disabled={
                  selectedOdinCount === 0 ||
                  selectedOdinCount !== selectedThorCount
                }
                onClick={() =>
                  isAllowed ? triggerCreateCapsule() : triggerApprove()
                }
              >
                {getActionButtonLabel()}
              </Button>
            </Box>
          )}

          {isCreatingCapsule && (
            <Box mt={'48px'} display={'flex'} justifyContent={'center'}>
              <FusingKeycardsLoader />
            </Box>
          )}

          <Box
            mt={'36px'}
            height={'18px'}
            marginBottom={'10px'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            color={'#296EB4'}
            visibility={
              selectedOdinCount !== selectedThorCount ? 'visible' : 'hidden'
            }
          >
            <InfoOutlined sx={{ mr: '4px', mb: '4px', fontSize: '14px' }} />
            <Typography variant={'lbl-sm'} fontWeight={300} lineHeight={'18px'}>
              Select the same number of Thor and Odin Nodes.
            </Typography>
          </Box>
        </Box>
      </Box>

      <GamificationAnimationModal
        isOpen={isAnimationOpen}
        onSkip={handleAnimationSkip}
        label={
          selectedOdinCount > 1 ? `${selectedOdinCount} Capsules created` : ` `
        }
        videoUrls={[preloadedVideoUrls[keycardType]]}
      />
    </Box>
  );
};

export default KeycardsApply;
