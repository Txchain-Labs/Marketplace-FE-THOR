import { BigNumber, BigNumberish, ethers } from 'ethers';

export const activityPanelFilterStatus = (filters: any, type: string) => {
  if (type === 'keycards') {
    if (filters?.isOrigin !== null || filters?.tier !== null) {
      return true;
    } else {
      return false;
    }
  } else if (type === 'capsules') {
    if (filters?.isOrigin !== null) {
      return true;
    } else {
      return false;
    }
  } else if (type === 'perks') {
    if (filters?.isOrigin !== null || filters?.perkTypeLabel !== null) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const buyAssetFilterStatus = (
  filters: any,
  type: string,
  node = 'ORIGIN'
) => {
  if (type === 'keycards' || type === 'capsules' || type === 'perks') {
    if (
      filters?.favourited !== true ||
      filters?.notFavourited !== true ||
      filters?.bids !== true ||
      filters?.noBids !== true ||
      filters?.privateBids !== true ||
      filters?.priceMin !== '' ||
      filters?.priceMax !== ''
    ) {
      return true;
    } else {
      return false;
    }
  } else if (type === 'nodes' && node === 'ORIGIN') {
    if (
      filters?.favourited !== true ||
      filters?.notFavourited !== true ||
      filters?.bids !== true ||
      filters?.noBids !== true ||
      filters?.privateBids !== true ||
      filters?.priceMin !== '' ||
      filters?.priceMax !== '' ||
      filters?.pendingRewardsMin !== '' ||
      filters?.pendingRewardsMax !== '' ||
      filters?.dueDate?.[0] !== 0 ||
      filters?.dueDate?.[1] !== 30 ||
      filters?.withPerks !== true ||
      filters?.withoutPerks !== true
    ) {
      return true;
    } else {
      return false;
    }
  } else if (type === 'nodes' && node === 'DRIFT') {
    if (
      filters?.favourited !== true ||
      filters?.notFavourited !== true ||
      filters?.bids !== true ||
      filters?.noBids !== true ||
      filters?.privateBids !== true ||
      filters?.priceMin !== '' ||
      filters?.priceMax !== '' ||
      filters?.pendingRewardsMin !== '' ||
      filters?.pendingRewardsMax !== '' ||
      filters?.dueDate?.[0] !== 0 ||
      filters?.dueDate?.[1] !== 30
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const exploreandCollectionDetailFilterStatus = (filters: any) => {
  if (
    filters?.listed !== true ||
    filters?.notListed !== true ||
    filters?.bids !== true ||
    filters?.noBids !== true ||
    filters?.privateBids !== true ||
    filters?.priceMin !== '' ||
    filters?.priceMax !== ''
  ) {
    return true;
  } else {
    return false;
  }
};

export const myNFTsFilterStatus = (filters: any) => {
  if (
    filters?.bids?.bids !== true ||
    filters?.bids?.noBids !== true ||
    filters?.bids?.privateBids !== true ||
    filters?.priceMin !== '' ||
    filters?.priceMax !== ''
  ) {
    return true;
  } else {
    return false;
  }
};

export const getDriftDueDate = (
  rewardsActivatedTime: BigNumber | string,
  vestedDays: BigNumber | string
) => {
  if (
    !rewardsActivatedTime ||
    !vestedDays ||
    (rewardsActivatedTime && BigNumber.from(rewardsActivatedTime).eq(0))
  ) {
    return '90';
  }
  const _now = Date.now() / 1000;
  const _activatedTime = rewardsActivatedTime
    ? BigNumber.from(rewardsActivatedTime as BigNumberish).toNumber()
    : 0;
  const _vestedDays =
    (vestedDays ? BigNumber.from(vestedDays as BigNumberish).toNumber() : 0) /
    (24 * 3600);
  const diff = (_now - _activatedTime) / (24 * 3600);
  // console.log('_now', _now);
  // console.log('_activatedTime', _activatedTime);
  // console.log('diff', diff);
  // console.log('_vestedDays', _vestedDays);

  return Math.round(90 - (diff + _vestedDays));
};

export const bonusApplied = (lastClaimTime: any, allPerksEndTimes: any) => {
  let countBonusPerks = 0;
  try {
    lastClaimTime = (lastClaimTime as BigNumber).toNumber();
    let i = allPerksEndTimes.length;
    while (i > 0) {
      const perkEndTime = allPerksEndTimes[--i];
      if (perkEndTime > 0 && perkEndTime <= lastClaimTime) {
        continue;
      }
      countBonusPerks++;
    }
  } catch (e) {
    console.log('bonusApplied: error calculating bonus perks', e);
  }
  return countBonusPerks > 0;
};

export function truncateText(text: string, maxLength: number) {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

export const formatPriceByDefaultCurrency = (
  priceInWei: BigNumberish,
  paymentType: string,
  defaultCurrency: string,
  avaxPrice: BigNumberish,
  thorPrice: BigNumberish
) => {
  if (defaultCurrency) {
    if (
      (defaultCurrency === 'AVAX' && paymentType === '0') ||
      (defaultCurrency === 'THOR' && paymentType === '1') ||
      (defaultCurrency === 'USDC' && paymentType === '2')
    ) {
      return Number(
        paymentType === '2'
          ? ethers.utils.formatUnits(priceInWei, 6)
          : ethers.utils.formatEther(priceInWei)
      );
    }
    if (defaultCurrency === 'AVAX' && paymentType !== '0') {
      return (
        avaxPrice &&
        thorPrice &&
        (paymentType === '1'
          ? (Number(ethers.utils.formatEther(priceInWei)) *
              Number(ethers.utils.formatEther(thorPrice as BigNumberish))) /
            Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
          : Number(ethers.utils.formatUnits(priceInWei, 6)) /
            Number(ethers.utils.formatEther(avaxPrice as BigNumberish)))
      );
    }
    if (defaultCurrency === 'THOR' && paymentType !== '1') {
      return (
        avaxPrice &&
        thorPrice &&
        (paymentType === '0'
          ? (Number(ethers.utils.formatEther(priceInWei)) *
              Number(ethers.utils.formatEther(avaxPrice as BigNumberish))) /
            Number(ethers.utils.formatEther(thorPrice as BigNumberish))
          : Number(ethers.utils.formatUnits(priceInWei, 6)) /
            Number(ethers.utils.formatEther(thorPrice as BigNumberish)))
      );
    }
    if (defaultCurrency === 'USDC' && paymentType !== '2') {
      return (
        avaxPrice &&
        thorPrice &&
        (paymentType === '0'
          ? Number(ethers.utils.formatEther(priceInWei)) *
            Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
          : Number(ethers.utils.formatEther(priceInWei)) *
            Number(ethers.utils.formatEther(thorPrice as BigNumberish)))
      );
    }
  }

  return (
    Number(ethers.utils.formatEther(priceInWei)) *
    (paymentType === '0'
      ? avaxPrice
        ? Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
        : 0
      : paymentType === '1'
      ? thorPrice
        ? Number(ethers.utils.formatEther(thorPrice as BigNumberish))
        : 0
      : 1)
  );
};

export const toAvax = (
  priceInWei: BigNumberish,
  paymentType: number | string,
  avaxFromThor: BigNumberish,
  usdFromAvax: BigNumberish
) => {
  if (paymentType.toString() === '0') {
    return priceInWei;
  } else if (paymentType.toString() === '1') {
    return BigNumber.from(avaxFromThor)
      .mul(priceInWei)
      .div(BigNumber.from('1000000000000000000'));
  } else {
    return BigNumber.from(priceInWei)
      .mul(BigNumber.from('1000000000000000000'))
      .mul(BigNumber.from('1000000000000000000'))
      .div(usdFromAvax)
      .div(BigNumber.from('1000000'));
  }
};

export const toThor = (
  priceInWei: BigNumberish,
  paymentType: number | string,
  thorFromAvax: BigNumberish,
  usdFromThor: BigNumberish
) => {
  if (paymentType.toString() === '0') {
    return BigNumber.from(thorFromAvax)
      .mul(priceInWei)
      .div(BigNumber.from('1000000000000000000'));
  } else if (paymentType.toString() === '1') {
    return priceInWei;
  } else {
    return BigNumber.from(priceInWei)
      .mul(BigNumber.from('1000000000000000000'))
      .mul(BigNumber.from('1000000000000000000'))
      .div(usdFromThor)
      .div(BigNumber.from('1000000'));
  }
};

export const toUsd = (
  priceInWei: BigNumberish,
  paymentType: number | string,
  usdFromAvax: BigNumberish,
  usdFromThor: BigNumberish
) => {
  if (paymentType.toString() === '0') {
    return BigNumber.from(usdFromAvax)
      .mul(priceInWei)
      .div(BigNumber.from('1000000000000000000'))
      .mul(BigNumber.from('1000000'))
      .div(BigNumber.from('1000000000000000000'));
  } else if (paymentType.toString() === '1') {
    return BigNumber.from(usdFromThor)
      .mul(priceInWei)
      .div(BigNumber.from('1000000000000000000'))
      .mul(BigNumber.from('1000000'))
      .div(BigNumber.from('1000000000000000000'));
  } else {
    return priceInWei;
  }
};
