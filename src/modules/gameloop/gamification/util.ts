import axios from 'axios';
import { GamificationItem, PerkItem, PERK_TYPES } from './types';

export type ICapsulePreloadedVideosUrl =
  | 'drift-capsule-sigma'
  | 'drift-capsule-gamma'
  | 'drift-capsule-delta'
  | 'drift-capsule-bonus'
  | 'origin-capsule-sigma'
  | 'origin-capsule-gamma'
  | 'origin-capsule-delta'
  | 'origin-capsule-bonus';

export type gameloopIllustrationType =
  | 'keycards-DRIFT-THOR'
  | 'keycards-ORIGIN-THOR'
  | 'keycards-DRIFT-ODIN'
  | 'keycards-ORIGIN-ODIN'
  | 'fuze-keycard-drift'
  | 'fuze-keycard-origin'
  | 'capsules-ORIGIN'
  | 'capsules-DRIFT'
  | 'drift-capsule-sigma'
  | 'drift-capsule-gamma'
  | 'drift-capsule-delta'
  | 'drift-capsule-bonus'
  | 'origin-capsule-sigma'
  | 'origin-capsule-gamma'
  | 'origin-capsule-delta'
  | 'origin-capsule-bonus'
  | 'perks-drift-sigma'
  | 'perks-drift-gamma'
  | 'perks-drift-delta'
  | 'perks-drift-bonus'
  | 'perks-origin-sigma'
  | 'perks-origin-gamma'
  | 'perks-origin-delta'
  | 'perks-origin-bonus';

const S3BaseUrl =
  'https://thorcollections.s3.us-west-1.amazonaws.com/lite_versions/';

export const gamificationItemIllustrationMatchings: {
  [key in gameloopIllustrationType]: string;
} = {
  'keycards-DRIFT-THOR': S3BaseUrl + 'Thor_card_normal.mp4',
  'keycards-ORIGIN-THOR': S3BaseUrl + 'Thor_card_rare.mp4',
  'keycards-DRIFT-ODIN': S3BaseUrl + 'Odin_card_normal.mp4',
  'keycards-ORIGIN-ODIN': S3BaseUrl + 'Odin_card_rare.mp4',
  'fuze-keycard-drift': S3BaseUrl + 'combine_card_to_Drift.mp4',
  'fuze-keycard-origin': S3BaseUrl + 'combine_card_to_origin.mp4',
  'capsules-ORIGIN': S3BaseUrl + 'Origin_capsule_closed.mp4',
  'capsules-DRIFT': S3BaseUrl + 'Drift_capsule_closed.mp4',
  'drift-capsule-sigma': S3BaseUrl + 'Drift_capsule_sigma.mp4',
  'drift-capsule-gamma': S3BaseUrl + 'Drift_capsule_gamma.mp4',
  'drift-capsule-delta': S3BaseUrl + 'Drift_capsule_delta.mp4',
  'drift-capsule-bonus': S3BaseUrl + 'Drift_capsule_bonus.mp4',
  'origin-capsule-sigma': S3BaseUrl + 'Origin_capsule_sigma.mp4',
  'origin-capsule-gamma': S3BaseUrl + 'Origin_capsule_gamma.mp4',
  'origin-capsule-delta': S3BaseUrl + 'Origin_capsule_delta.mp4',
  'origin-capsule-bonus': S3BaseUrl + 'Origin_Capsule_BONUS.mp4',
  'perks-drift-sigma': S3BaseUrl + 'Drift_capsule_sigma_perknft.mp4',
  'perks-drift-gamma': S3BaseUrl + 'Drift_capsule_gamma_perknft.mp4',
  'perks-drift-delta': S3BaseUrl + 'Drift_capsule_delta_perknft.v2.mp4',
  'perks-drift-bonus': S3BaseUrl + 'Drift_capsule_bonus_perknft.mp4',
  'perks-origin-sigma': S3BaseUrl + 'Origin_capsule_sigma_perknft.mp4',
  'perks-origin-gamma': S3BaseUrl + 'Origin_capsule_gamma_perknft.mp4',
  'perks-origin-delta': S3BaseUrl + 'Origin_capsule_delta_perknft.v2.mp4',
  'perks-origin-bonus': S3BaseUrl + 'Origin_capsule_bonus_perknft.mp4',
};

export function getGamificationIllustrationPoster(
  type: gameloopIllustrationType
): string {
  return `/images/thorfi/gamification/${type}.png`;
}

export function getAccurateCapsuleIllustrationType(
  perk: GamificationItem<PerkItem>
): ICapsulePreloadedVideosUrl {
  let baseType;

  const perkType = +perk.perk.perkType.toString();

  switch (perkType) {
    case PERK_TYPES.PERK_TYPE_BOOST_PERM10:
      baseType = 'capsule-sigma';
      break;
    case PERK_TYPES.PERK_TYPE_BOOST_TEMP35:
      baseType = 'capsule-gamma';
      break;
    case PERK_TYPES.PERK_TYPE_BOOST_TEMP50:
      baseType = 'capsule-delta';
      break;
    default:
      baseType = 'capsule-bonus';
  }

  return (
    perk.isDriftPerk ? 'drift-' + baseType : 'origin-' + baseType
  ) as ICapsulePreloadedVideosUrl;
}

export function getAccurateOpenCapsuleAnimation(
  perk: GamificationItem<PerkItem>
) {
  let fileName;

  const perkType = +perk.perk.perkType.toString();

  if (perk.isDriftPerk) {
    if (perkType === PERK_TYPES.PERK_TYPE_BOOST_PERM10) {
      fileName = 'Drift_capsule_sigma.mp4';
    } else if (perkType === PERK_TYPES.PERK_TYPE_BOOST_TEMP35) {
      fileName = 'Drift_capsule_gamma.mp4';
      // cannot happen?
      // } else if (perkType === PERK_TYPES.PERK_TYPE_BOOST_TEMP50) {
      //   fileName = 'Drift_capsule_delta.mp4';
    } else {
      fileName = 'Drift_capsule_bonus.mp4';
    }
  }

  if (perk.isOriginPerk) {
    if (perkType === PERK_TYPES.PERK_TYPE_BOOST_PERM10) {
      fileName = 'Origin_capsule_sigma.mp4';
    } else if (perkType === PERK_TYPES.PERK_TYPE_BOOST_TEMP35) {
      fileName = 'Origin_capsule_gamma.mp4';
    } else if (perkType === PERK_TYPES.PERK_TYPE_BOOST_TEMP50) {
      fileName = 'Origin_capsule_delta.mp4';
    } else {
      fileName = 'Origin_Capsule_BONUS.mp4';
    }
  }

  return S3BaseUrl + fileName;
}

export function preloadVideo(
  fileName: string,
  callback: (url: string) => void
) {
  axios
    .get(fileName, {
      headers: {
        Authorization: '',
      },
      responseType: 'blob',
    })
    .then((res) => {
      const videoBlob = res.data;
      const videoUrl = URL.createObjectURL(videoBlob);

      callback(videoUrl);
    });
}
