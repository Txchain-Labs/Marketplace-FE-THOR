import { CapsuleType, KeycardType, PerkType } from '@/utils/types';
import { formatWei } from '@/utils/web3Utils';
import { makeStyles } from '@mui/styles';
import { BigNumber, BigNumberish, ethers } from 'ethers';

export const searchRecords = (data: Array<any>, searchText: string) => {
  if (searchText?.length) {
    return data?.filter((row: any) =>
      row?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
    );
  } else {
    return data;
  }
};

export const filterRecords = (
  data: Array<any>,
  state: any,
  usd2avax: any,
  thor2avax: any
) => {
  // console.log(state, 'state', data, 'data');
  const filterFavs = data?.filter((row: any) => {
    if (state?.favs?.favourited && !state?.favs?.notFavourited) {
      return row?.isFavorite === true;
    } else if (state?.favs?.notFavourited && !state?.favs?.favourited) {
      return row?.isFavorite === false;
    } else {
      return row;
    }
  });
  // console.log(filterFavs, 'after favs');
  const filterStatus = filterFavs?.filter((row: any) => {
    if (state?.status?.listed && !state?.status?.notListed) {
      if (Number(state?.price?.min) < Number(state?.price?.max)) {
        const avaxPriceMinInWei = ethers.utils.parseEther(
          Number(state.price.min).toLocaleString('fullwide', {
            useGrouping: false,
            maximumFractionDigits: 18,
          })
        );
        const avaxPriceMaxInWei = ethers.utils.parseEther(
          Number(state.price.max).toLocaleString('fullwide', {
            useGrouping: false,
            maximumFractionDigits: 18,
          })
        );

        if (state.price.currency === 0) {
          return (
            row?.isListed &&
            row?.price >= avaxPriceMinInWei.toString() &&
            row?.price <= avaxPriceMaxInWei.toString()
          );
        } else if (state.price.currency === 1) {
          return (
            row?.isListed &&
            row?.price >=
              avaxPriceMinInWei
                .mul(BigNumber.from(thor2avax))
                .div(BigNumber.from('1000000000000000000'))
                .toString() &&
            row?.price <=
              avaxPriceMaxInWei
                .mul(BigNumber.from(thor2avax))
                .div(BigNumber.from('1000000000000000000'))
                .toString()
          );
        } else if (state.price.currency === 2) {
          return (
            row?.isListed &&
            row?.price >=
              avaxPriceMinInWei
                .mul(BigNumber.from(usd2avax))
                .div(BigNumber.from('1000000000000000000'))
                .toString() &&
            row?.price <=
              avaxPriceMaxInWei
                .mul(BigNumber.from(usd2avax))
                .div(BigNumber.from('1000000000000000000'))
                .toString()
          );
        }
      } else {
        return row?.isListed === true;
      }
    } else if (state?.status?.notListed && !state?.status?.listed) {
      return row?.isListed === false;
    } else {
      return row;
    }
  });
  // console.log(filterStatus, 'after status');
  const filterBids = filterStatus.filter((row: any) => {
    if (
      state?.bids?.bids &&
      !state?.bids?.privateBids &&
      !state?.bids?.noBids
    ) {
      return row?.hasBid === true && row?.isListed === true;
    } else if (
      !state?.bids?.bids &&
      state?.bids?.privateBids &&
      !state?.bids?.noBids
    ) {
      return row?.hasBid === true && row?.isListed === false;
    } else if (
      !state?.bids?.bids &&
      !state?.bids?.privateBids &&
      state?.bids?.noBids
    ) {
      return row?.hasBid === false;
    } else if (
      state?.bids?.bids &&
      state?.bids?.privateBids &&
      !state?.bids?.noBids
    ) {
      return (
        row?.hasBid === true &&
        (row?.isListed === false || row?.isListed === true)
      );
    } else if (
      !state?.bids?.bids &&
      state?.bids?.privateBids &&
      state?.bids?.noBids
    ) {
      return (
        row?.hasBid === false ||
        (row?.hasBid === true && row?.isListed === false)
      );
    } else if (
      state?.bids?.bids &&
      !state?.bids?.privateBids &&
      state?.bids?.noBids
    ) {
      return (
        (row?.hasBid === true && row?.isListed === true) ||
        row?.hasBid === false
      );
    } else {
      return row;
    }
  });
  // console.log(filterBids, 'after bids');

  const filterPerks = filterBids.filter((row: any) => {
    if (state?.perks?.withPerks && !state?.perks?.withoutPerks) {
      // return row?.perks?.perkS === true || row?.perks?.perkG === true;
      return row?.perks?.length > 0;
    } else if (state?.perks?.withoutPerks && !state?.perks?.withPerks) {
      // return row?.perks?.perkS !== true && row?.perks?.perkG !== true;
      return row?.perks?.length <= 0;
    } else {
      return row;
    }
  });
  // console.log(filterPerks, 'after perks');

  // const filterTier = filterPerks.filter((row: any) => {
  //   if (state?.tier?.thor && !state?.tier?.odin) {
  //     return row?.isOdinCard === false;
  //   } else if (state?.tier?.odin && !state?.tier?.thor) {
  //     return row?.isOdinCard === true;
  //   } else {
  //     return row;
  //   }
  // });
  // console.log(filterTier, 'after tier');

  // const filterCondition = filterTier.filter((row: any) => {
  //   //single comparison
  //   if (
  //     state?.condition?.inactive &&
  //     !state?.condition?.inuse &&
  //     !state?.condition?.unclaimed &&
  //     !state?.condition?.claimed
  //   ) {
  //     return row?.condition === 'inactive';
  //   } else if (
  //     !state?.condition?.inactive &&
  //     state?.condition?.inuse &&
  //     !state?.condition?.unclaimed &&
  //     !state?.condition?.claimed
  //   ) {
  //     return row?.condition === 'inuse';
  //   } else if (
  //     !state?.condition?.inactive &&
  //     !state?.condition?.inuse &&
  //     state?.condition?.unclaimed &&
  //     !state?.condition?.claimed
  //   ) {
  //     return row?.condition === 'unclaimed';
  //   } else if (
  //     !state?.condition?.inactive &&
  //     !state?.condition?.inuse &&
  //     !state?.condition?.unclaimed &&
  //     state?.condition?.claimed
  //   ) {
  //     return row?.condition === 'claimed';
  //   }
  //   // dual comparison
  //   else if (
  //     state?.condition?.inactive &&
  //     state?.condition?.inuse &&
  //     !state?.condition?.unclaimed &&
  //     !state?.condition?.claimed
  //   ) {
  //     return row?.condition === 'inactive' || row?.condition === 'inuse';
  //   } else if (
  //     !state?.condition?.inactive &&
  //     state?.condition?.inuse &&
  //     state?.condition?.unclaimed &&
  //     !state?.condition?.claimed
  //   ) {
  //     return row?.condition === 'inuse' || row?.condition === 'unclaimed';
  //   } else if (
  //     !state?.condition?.inactive &&
  //     !state?.condition?.inuse &&
  //     state?.condition?.unclaimed &&
  //     state?.condition?.claimed
  //   ) {
  //     return row?.condition === 'unclaimed' || row?.condition === 'claimed';
  //   } else if (
  //     state?.condition?.inactive &&
  //     !state?.condition?.inuse &&
  //     state?.condition?.unclaimed &&
  //     !state?.condition?.claimed
  //   ) {
  //     return row?.condition === 'inactive' || row?.condition === 'unclaimed';
  //   } else if (
  //     state?.condition?.inactive &&
  //     !state?.condition?.inuse &&
  //     !state?.condition?.unclaimed &&
  //     state?.condition?.claimed
  //   ) {
  //     return row?.condition === 'inactive' || row?.condition === 'claimed';
  //   } else if (
  //     !state?.condition?.inactive &&
  //     state?.condition?.inuse &&
  //     !state?.condition?.unclaimed &&
  //     state?.condition?.claimed
  //   ) {
  //     return row?.condition === 'inuse' || row?.condition === 'claimed';
  //   }
  //   // triple comparison
  //   else if (
  //     state?.condition?.inactive &&
  //     state?.condition?.inuse &&
  //     state?.condition?.unclaimed &&
  //     !state?.condition?.claimed
  //   ) {
  //     return (
  //       row?.condition === 'inactive' ||
  //       row?.condition === 'unclaimed' ||
  //       row?.condition === 'inuse'
  //     );
  //   } else if (
  //     !state?.condition?.inactive &&
  //     state?.condition?.inuse &&
  //     state?.condition?.unclaimed &&
  //     state?.condition?.claimed
  //   ) {
  //     return (
  //       row?.condition === 'inuse' ||
  //       row?.condition === 'unclaimed' ||
  //       row?.condition === 'claimed'
  //     );
  //   } else if (
  //     state?.condition?.inactive &&
  //     state?.condition?.inuse &&
  //     !state?.condition?.unclaimed &&
  //     state?.condition?.claimed
  //   ) {
  //     return (
  //       row?.condition === 'inactive' ||
  //       row?.condition === 'inuse' ||
  //       row?.condition === 'claimed'
  //     );
  //   } else if (
  //     state?.condition?.inactive &&
  //     !state?.condition?.inuse &&
  //     state?.condition?.unclaimed &&
  //     state?.condition?.claimed
  //   ) {
  //     return (
  //       row?.condition === 'inactive' ||
  //       row?.condition === 'unclaimed' ||
  //       row?.condition === 'claimed'
  //     );
  //   }
  //   // all
  //   else {
  //     return row;
  //   }
  // });
  // console.log(filterCondition, 'after condition');

  const filterRewards = filterPerks.filter((row: any) => {
    if (
      Number(state?.pendingRewards?.min) < Number(state?.pendingRewards?.max)
    ) {
      return (
        Number(formatWei(row?.rewards)) >= Number(state?.pendingRewards?.min) &&
        Number(formatWei(row?.rewards)) <= Number(state?.pendingRewards?.max)
      );
    } else {
      return row;
    }
  });
  // console.log(filterRewards, 'after rewards');

  const filterDueDate = filterRewards.filter((row: any) => {
    if (row?.dueDate && Number(state?.dueDate[0]) < Number(state?.dueDate[1])) {
      return (
        daysLeftFromTimestamp(Number(row?.dueDate)) >=
          Number(state?.dueDate[0]) &&
        (Number(state?.dueDate[1]) === 366
          ? true
          : daysLeftFromTimestamp(Number(row?.dueDate)) <=
            Number(state?.dueDate[1]))
      );
    } else {
      return row;
    }
  });
  // console.log(filterDueDate, 'after dueDate');

  return filterDueDate;
};
const formatNode = (
  node: any,
  favrt: Array<any>,
  chainId = 43113,
  nftAddress: any,
  gameloopAddress: string
) => {
  return {
    id: `${node?.nodeType}${node?.tier}${node?.tokenId?.toString()}`,
    hasBid: node?.hasBid,
    bidExpiresAt: node?.bidExpiresAt?.toString(),
    bidPaymentType: node?.bidPaymentType,
    bidPrice: node?.bidPrice?.toString(),
    bidder: node?.bidder,
    otcExpiresAt: node?.otcExpiresAt?.toString(),
    otcPaymentType: node?.otcPaymentType,
    otcPrice: node?.otcPrice?.toString(),
    otcBidder: node?.otcBidder,
    isListed: node?.isListed,
    orderId: node?.orderId?.toString(),
    paymentType: node?.paymentType,
    price: node?.price?.toString(),
    saleType: node?.saleType?.toString(),
    availablePerksSlots: node?.availablePerksSlots?.toString(),
    creationTime: node?.creationTime?.toString(),
    currentOwner: node?.currentOwner?.toString(),
    currentVrr: node?.currentVrr?.toString(),
    dueDate: node?.dueDate?.toString(),
    fixedRewardPerNode: node?.fixedRewardPerNode?.toString(),
    image: node?.image,
    lastClaimTime: node?.lastClaimTime?.toString(),
    multiplier: node?.multiplier?.toString(),
    name: node?.name,
    nodeType: node?.nodeType,
    perks: node?.perks?.map((item: any) => item?.toString()),
    perksEndTime: node?.perksEndTime?.map((item: any) => item?.toString()),
    perksPct: node?.perksPct?.map((item: any) => item?.toString()),
    rewards: node?.rewards?.toString(),
    rewardsActivatedTime: node?.rewardsActivatedTime?.toString(),
    tier: node?.tier,
    tokenId: node?.tokenId?.toString(),
    nftAddress: nftAddress,
    condition:
      // daysLeftFromTimestamp(Number(node?.dueDate?.toString())) > 0
      gameloopAddress?.toLowerCase() === node?.currentOwner?.toLowerCase()
        ? 'active'
        : 'inactive',
    pageType: 'node',
    rowActive: true,
    selectionactive: true,
    isFavorite:
      favrt?.filter(
        (fav: any) =>
          fav.collection_address ===
            getNodeTokenAddress(node?.nodeType, node?.tier, chainId) &&
          fav.token_id === Number(node?.tokenId?.toString())
      ).length > 0,
    isSecondHand:
      node?.minter?.toLowerCase() !== node?.currentOwner?.toLowerCase()
        ? true
        : false,
    daysLeftToClaim: daysLeftFromTimestamp(Number(node?.dueDate?.toString())),
    isRewardsActivated: node?.isRewardsActivated,
    vestedDays: node?.vestedDays?.toString(),
  };
};
export const formatNodes = (
  nodes: any,
  favrt: any,
  chainId = 43113,
  gameloopAddress: string
) => {
  const result = nodes?.map((node: any) => {
    const nftAddress = getNodeTokenAddress(node?.nodeType, node?.tier, chainId);
    return formatNode(node, favrt, chainId, nftAddress, gameloopAddress);
  });
  return result && result?.length ? result : [];
};

export const formatGameloopAssets = (
  assetType: string,
  assetData: Array<any>,
  marketplaceData: Array<any>,
  favrt: any,
  chainId = 43113
) => {
  const result = assetData?.map((asset: any, index: number) => {
    const nftAddress =
      assetType === 'keycard'
        ? getKeycardTokenAddress(chainId)
        : assetType === 'capsule'
        ? getCapsuleTokenAddress(chainId)
        : getPerkTokenAddress(chainId);

    return {
      hasBid: marketplaceData[index]?.hasBid,
      bidExpiresAt: marketplaceData[index]?.bidExpiresAt?.toString(),
      bidPaymentType: marketplaceData[index]?.bidPaymentType,
      bidPrice: marketplaceData[index]?.bidPrice?.toString(),
      bidder: marketplaceData[index]?.bidder,
      otcExpiresAt: marketplaceData[index]?.otcExpiresAt?.toString(),
      otcPaymentType: marketplaceData[index]?.otcPaymentType,
      otcPrice: marketplaceData[index]?.otcPrice?.toString(),
      otcBidder: marketplaceData[index]?.otcBidder,
      isListed: marketplaceData[index]?.isListed,
      orderId: marketplaceData[index]?.orderId?.toString(),
      paymentType: marketplaceData[index]?.paymentType,
      price: marketplaceData[index]?.price?.toString(),
      saleType: marketplaceData[index]?.saleType?.toString(),
      tokenId: asset?.tokenId?.toString(),
      nftAddress: nftAddress,
      image: asset?.image ? asset.image : '',
      name: asset?.name || '-',
      date: '-',
      rowActive: true,
      selectionactive: marketplaceData[index]?.isListed ? false : true,
      ...(assetType === 'keycard' && {
        id: `${asset?.isDirectBurnCard ? 'ORIGIN' : 'DRIFT'}${
          asset?.isOdinCard ? 'ODIN' : 'THOR'
        }${asset?.tokenId?.toString()}`,
        nodeType: asset?.isDirectBurnCard ? 'ORIGIN' : 'DRIFT',
        tier: asset?.isOdinCard ? 'ODIN' : 'THOR',
        isOdinCard: asset?.isOdinCard,
        isDirectBurnCard: asset?.isDirectBurnCard,
        pageType: 'keycard',
        isFavorite:
          favrt?.filter(
            (fav: any) =>
              fav.collection_address === getKeycardTokenAddress(chainId) &&
              fav.token_id === Number(asset?.tokenId?.toString())
          ).length > 0,
      }),
      ...(assetType === 'capsule' && {
        id: `${
          asset?.isOriginCapsule ? 'ORIGIN' : 'DRIFT'
        }${'CAPSULE'}${asset?.tokenId?.toString()}`,
        isOriginCapsule: asset?.isOriginCapsule,
        nodeType: asset?.isOriginCapsule ? 'ORIGIN' : 'DRIFT',
        tier: 'CAPSULE',
        pageType: 'capsule',
        isFavorite:
          favrt?.filter(
            (fav: any) =>
              fav.collection_address === getCapsuleTokenAddress(chainId) &&
              fav.token_id === Number(asset?.tokenId?.toString())
          ).length > 0,
      }),
      ...(assetType === 'perk' && {
        id: `${'ORIGIN'}${getPerkTier(
          Number(asset?.perkType?.toString()),
          Number(asset?.value?.toString())
        )}${asset?.tokenId?.toString()}`,
        pageType: 'perk',
        dueDate: '-',
        nodeType: 'ORIGIN',
        tier: getPerkTier(
          Number(asset?.perkType?.toString()),
          Number(asset?.value?.toString())
        ),
        duration: asset?.duration?.toString(),
        perkType: asset?.perkType?.toString(),
        value: asset?.value?.toString(),
        bost: `${calculateBooster(
          Number(asset?.perkType?.toString()),
          asset?.value?.toString()
        )} ${calculatePerkType(Number(asset?.perkType?.toString()))}`,
        condition: 'not in use',
        isFavorite:
          favrt?.filter(
            (fav: any) =>
              fav.collection_address === getPerkTokenAddress(chainId) &&
              fav.token_id === Number(asset?.tokenId?.toString())
          ).length > 0,
      }),
    };
  });
  return result;
};

export const filterNodes = (nodes: any, nodeType: string, nodeTier: string) => {
  return (
    nodes?.filter(
      (node: any) => node?.nodeType === nodeType && node?.tier === nodeTier
    ) || []
  );
};
// isDirectBurnkey => isOGKey
export const filterKeycards = (
  keycards: KeycardType[],
  nodeType: string,
  tier: string
) => {
  return (
    keycards?.filter(
      (keycard: any) => keycard?.nodeType === nodeType && keycard?.tier === tier
    ) || []
  );
};

export const filterCapsules = (capsules: CapsuleType[], nodeType: string) => {
  return (
    capsules?.filter((capsule: any) => capsule?.nodeType === nodeType) || []
  );
};

// Perks renaming
// Sigma= Permanent
// Gamma= Regular Temporary (Drift Capsule)
// Delta= Higher Temporary (Origin Capsule)
// Bonus= Thor voucher

// Permanent boosters in range 1001 - 1999
// Temporary boosters in range 2001 - 2999
// Vouchers in range 3001 - 3999
export const filterPerks = (
  perks: PerkType[],
  tier: string,
  nodeType: string
) => {
  return (
    perks?.filter(
      (perk: any) => perk?.nodeType === nodeType && perk?.tier === tier
    ) || []
  );
};

export const getPerkTier = (perkType: number, perkValue: number) => {
  if (perkType >= 1001 && perkType <= 1999) {
    return 'SIGMA';
  } else if (perkType >= 2001 && perkType <= 2999) {
    const booster = perkValue / 100;
    if (booster === 35) {
      return 'GAMMA';
    } else {
      return 'DELTA';
    }
  } else if (perkType >= 3001 && perkType <= 3999) {
    return 'BONUS';
  } else {
    return '';
  }
};

export const convertPriceInUSD = (
  avaxPrice: BigNumberish,
  thorPrice: BigNumberish,
  priceInWei: string,
  paymentType: number,
  defaultCurrency?: string
) => {
  if (defaultCurrency) {
    if (
      (defaultCurrency === 'AVAX' && paymentType === 0) ||
      (defaultCurrency === 'THOR' && paymentType === 1) ||
      (defaultCurrency === 'USDC' && paymentType === 2)
    ) {
      return Number(
        paymentType === 2
          ? ethers.utils.formatUnits(priceInWei, 6)
          : ethers.utils.formatEther(priceInWei)
      );
    }
    if (defaultCurrency === 'AVAX' && paymentType !== 0) {
      if (paymentType === 1) {
        return avaxPrice && thorPrice
          ? (Number(ethers.utils.formatEther(priceInWei)) *
              Number(ethers.utils.formatEther(thorPrice as BigNumberish))) /
              Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
          : 0;
      } else if (paymentType === 2) {
        return avaxPrice
          ? Number(ethers.utils.formatUnits(priceInWei, 6)) /
              Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
          : 0;
      }
    } else if (defaultCurrency === 'THOR' && paymentType !== 1) {
      if (paymentType === 0) {
        return avaxPrice && thorPrice
          ? (Number(ethers.utils.formatEther(priceInWei)) *
              Number(ethers.utils.formatEther(avaxPrice as BigNumberish))) /
              Number(ethers.utils.formatEther(thorPrice as BigNumberish))
          : 0;
      } else if (paymentType === 2) {
        return thorPrice
          ? Number(ethers.utils.formatUnits(priceInWei, 6)) /
              Number(ethers.utils.formatEther(thorPrice as BigNumberish))
          : 0;
      }
    } else if (defaultCurrency === 'USDC' && paymentType !== 2) {
      if (paymentType === 0) {
        return avaxPrice
          ? Number(ethers.utils.formatEther(priceInWei)) *
              Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
          : 0;
      } else if (paymentType === 1) {
        return thorPrice
          ? Number(ethers.utils.formatEther(priceInWei)) *
              Number(ethers.utils.formatEther(thorPrice as BigNumberish))
          : 0;
      }
    }
  }

  return (
    Number(ethers.utils.formatEther(priceInWei)) *
    (paymentType === 0
      ? avaxPrice
        ? Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
        : 0
      : paymentType === 1
      ? thorPrice
        ? Number(ethers.utils.formatEther(thorPrice as BigNumberish))
        : 0
      : 1)
  );
};

export const daysLeftFromTimestamp = (dueTimestamp: number) => {
  const oneDay = 24 * 60 * 60; // number of milliseconds in a day
  const nowTimestamp = Math.ceil(Date.now() / 1000);
  const timeDiff = dueTimestamp - nowTimestamp;
  const daysLeft = Math.ceil(timeDiff / oneDay);
  if (daysLeft > 0) {
    return daysLeft;
  } else {
    return 0;
  }
};

export const dateFromTimestamp = (timestamp: number) => {
  const datetime = new Date(timestamp * 1000);
  return datetime.toLocaleDateString();
};

export const calculateBooster = (perkType: number, perkValue: string) => {
  if (perkType > 1000 && perkType < 3000) {
    const booster = Number(perkValue) / 100;
    return `${booster}%`;
  }
  return `${ethers.utils.formatEther(perkValue as string)} THOR`;
};

export const calculatePerkType = (perkType: number) => {
  if (perkType > 1000 && perkType < 3000) {
    if (perkType >= 1001 && perkType <= 1999) {
      return 'Permanent';
    } else if (perkType >= 2001 && perkType <= 2999) {
      return 'Temporary';
    } else {
      return '';
    }
  } else {
    return 'Voucher';
  }
};

export const getKeycardTokenAddress = (chainId: number) => {
  return chainId === 43113
    ? '0xc4D437413ef5E8bA11ff38BdCa79DB60e0492376'
    : '0x6FBc108e4aD4324e199A2Ac98C136B38a25A1C6a';
};

export const getCapsuleTokenAddress = (chainId: number) => {
  return chainId === 43113
    ? '0xb6bE5520239C89bb28b8D66E17e5C153F83a4475'
    : '0x76348A4fC5e8F58C7C7733b41768df7d0ADEd241';
};

export const getPerkTokenAddress = (chainId: number) => {
  return chainId === 43113
    ? '0xD9B0e871C1b284904B0fC6Ab4BA3c479042131Ef'
    : '0x1eb252B7302A8B672D1bCB8c86C5194862FB17fe';
};

export const getNodeTokenAddress = (
  assetType: string,
  assetNode: string,
  chainId: number
) => {
  switch (true) {
    case assetType === 'ORIGIN' && assetNode === 'ODIN':
      return chainId === 43113
        ? '0x1De3ebd258f7603888c83A339049501AeaFc6581'
        : '0x7325e3564b89968d102b3261189ea44c0f5f1a8e';
    case assetType === 'ORIGIN' && assetNode === 'THOR':
      return chainId === 43113
        ? '0x0Be69fbD4955eB19E4F6D2f58338592be75476A8'
        : '0x825189515d0a7756436f0efb6e4be5a5af87e21d';
    case assetType === 'DRIFT' && assetNode === 'ODIN':
      return chainId === 43113
        ? '0x5Af672a8CB0fc468c170f0c094ED01B8f974F714'
        : '0xa91552398449864ea97694AFde6932dB5233698C';
    case assetType === 'DRIFT' && assetNode === 'THOR':
      return chainId === 43113
        ? '0x2Aa1Ae3Bbcc5cc66E26D81b0bEC47aB6BD6ceB8f'
        : '0x5aed0d3Ec43d3ec54F2c546657037877f495380D';
    default:
      return '';
  }
};

export const getNodeTumbnail = (
  pageType: string,
  nodeType: string,
  tier?: string
) => {
  if (pageType === 'node' && nodeType === 'ORIGIN' && tier === 'ODIN') {
    return '/images/odinOrigin.png';
  } else if (pageType === 'node' && nodeType === 'ORIGIN' && tier === 'THOR') {
    return '/images/thorOrigin.png';
  } else if (pageType === 'node' && nodeType === 'DRIFT' && tier === 'ODIN') {
    return '/images/odinDrift.png';
  } else if (pageType === 'node' && nodeType === 'DRIFT' && tier === 'THOR') {
    return '/images/thorDrift.png';
  } else if (
    pageType === 'keycard' &&
    (nodeType === 'ORIGIN' || nodeType === 'DRIFT') &&
    tier === 'ODIN'
  ) {
    return '/images/manager/stills/odincard_rare.png';
  } else if (
    pageType === 'keycard' &&
    (nodeType === 'ORIGIN' || nodeType === 'DRIFT') &&
    tier === 'THOR'
  ) {
    return '/images/manager/stills/thorcard_rare.png';
  } else if (pageType === 'capsule' && nodeType === 'ORIGIN') {
    return '/images/manager/stills/OriginCapsule.jpg';
  } else if (pageType === 'capsule' && nodeType === 'DRIFT') {
    return '/images/manager/stills/DriftCapsule.jpg';
  } else if (pageType === 'perk' && nodeType === 'ORIGIN' && tier === 'SIGMA') {
    return '/images/manager/stills/Origin_sigma.png';
  } else if (pageType === 'perk' && nodeType === 'ORIGIN' && tier === 'DELTA') {
    return '/images/manager/stills/Origin_delta.png';
  } else if (pageType === 'perk' && nodeType === 'ORIGIN' && tier === 'GAMMA') {
    return '/images/manager/stills/Origin_gamma.png';
  } else if (pageType === 'perk' && nodeType === 'ORIGIN' && tier === 'BONUS') {
    return '/images/manager/stills/OriginBonus.png';
  } else {
    return '';
  }
};

export const getNodeGifs = (
  pageType: string,
  nodeType: string,
  tier?: string
) => {
  if (pageType === 'node' && nodeType === 'ORIGIN' && tier === 'ODIN') {
    return '/images/odinOrigin.gif';
  } else if (pageType === 'node' && nodeType === 'ORIGIN' && tier === 'THOR') {
    return '/images/thorOrigin.gif';
  } else if (pageType === 'node' && nodeType === 'DRIFT' && tier === 'ODIN') {
    return '/images/odinDrift.gif';
  } else if (pageType === 'node' && nodeType === 'DRIFT' && tier === 'THOR') {
    return '/images/thorDrift.gif';
  } else if (
    pageType === 'keycard' &&
    (nodeType === 'ORIGIN' || nodeType === 'DRIFT') &&
    tier === 'ODIN'
  ) {
    return '/images/odincard_origin.gif';
  } else if (
    pageType === 'keycard' &&
    (nodeType === 'ORIGIN' || nodeType === 'DRIFT') &&
    tier === 'THOR'
  ) {
    return '/images/thorcard_origin.gif';
  } else if (pageType === 'capsule' && nodeType === 'ORIGIN') {
    return '/images/OriginCapsule.gif';
  } else if (pageType === 'capsule' && nodeType === 'DRIFT') {
    return '/images/DriftCapsule.gif';
  } else if (pageType === 'perk' && nodeType === 'ORIGIN' && tier === 'SIGMA') {
    return '/images/manager/perk/origin/Origin_capsule_sigma_perknft.gif';
  } else if (pageType === 'perk' && nodeType === 'ORIGIN' && tier === 'DELTA') {
    return '/images/manager/perk/origin/Origin_capsule_delta_perknft.v2.gif';
  } else if (pageType === 'perk' && nodeType === 'ORIGIN' && tier === 'GAMMA') {
    return '/images/manager/perk/origin/Origin_capsule_gamma_perknft.gif';
  } else if (pageType === 'perk' && nodeType === 'ORIGIN' && tier === 'BONUS') {
    return '/images/manager/perk/origin/Origin_capsule_bonus_perknft.gif';
  } else {
    return '';
  }
};

export const getFilterStatus = (
  filters: any,
  pageType: string,
  nodeType: string,
  tier: string
) => {
  switch (true) {
    case pageType === 'node' &&
      nodeType === 'ORIGIN' &&
      (tier === 'ODIN' || tier === 'THOR'):
      if (
        filters?.favs?.favourited === true &&
        filters?.favs?.notFavourited === true &&
        filters?.status?.listed === true &&
        filters?.status?.notListed === true &&
        filters?.bids?.bids === true &&
        filters?.bids?.privateBids === true &&
        filters?.bids?.noBids === true &&
        filters?.perks?.withPerks === true &&
        filters?.perks?.withoutPerks === true &&
        filters?.price?.min === '' &&
        filters?.price?.max === '' &&
        filters?.pendingRewards?.min === '' &&
        filters?.pendingRewards?.max === '' &&
        filters?.dueDate[0] === 0 &&
        filters?.dueDate[1] === 366
      ) {
        return false;
      } else {
        return true;
      }
    case pageType === 'node' &&
      nodeType === 'DRIFT' &&
      (tier === 'ODIN' || tier === 'THOR'):
      if (
        filters?.favs?.favourited === true &&
        filters?.favs?.notFavourited === true &&
        filters?.status?.listed === true &&
        filters?.status?.notListed === true &&
        filters?.bids?.bids === true &&
        filters?.bids?.privateBids === true &&
        filters?.bids?.noBids === true &&
        filters?.price?.min === '' &&
        filters?.price?.max === '' &&
        filters?.pendingRewards?.min === '' &&
        filters?.pendingRewards?.max === '' &&
        filters?.dueDate[0] === 0 &&
        filters?.dueDate[1] === 366
      ) {
        return false;
      } else {
        return true;
      }
    case pageType === 'keycard' &&
      (nodeType === 'ORIGIN' || nodeType === 'DRIFT'):
      if (
        filters?.favs?.favourited === true &&
        filters?.favs?.notFavourited === true &&
        filters?.status?.listed === true &&
        filters?.status?.notListed === true &&
        filters?.bids?.bids === true &&
        filters?.bids?.privateBids === true &&
        filters?.bids?.noBids === true &&
        filters?.price?.min === '' &&
        filters?.price?.max === '' &&
        filters?.tier?.odin === true &&
        filters?.tier?.thor === true
      ) {
        return false;
      } else {
        return true;
      }
    case pageType === 'capsule' &&
      (nodeType === 'ORIGIN' || nodeType === 'DRIFT'):
      if (
        filters?.favs?.favourited === true &&
        filters?.favs?.notFavourited === true &&
        filters?.status?.listed === true &&
        filters?.status?.notListed === true &&
        filters?.bids?.bids === true &&
        filters?.bids?.privateBids === true &&
        filters?.bids?.noBids === true &&
        filters?.price?.min === '' &&
        filters?.price?.max === ''
      ) {
        return false;
      } else {
        return true;
      }
    case pageType === 'perk' && nodeType === 'ORIGIN':
      if (
        filters?.favs?.favourited === true &&
        filters?.favs?.notFavourited === true &&
        filters?.status?.listed === true &&
        filters?.status?.notListed === true &&
        filters?.bids?.bids === true &&
        filters?.bids?.privateBids === true &&
        filters?.bids?.noBids === true &&
        filters?.price?.min === '' &&
        filters?.price?.max === ''
      ) {
        return false;
      } else {
        return true;
      }
    default:
      return false;
  }
};

export const sortRecords = (data: any, sort: any) => {
  switch (sort?.orderBy) {
    case 'price':
      if (data?.length) {
        return [...data].sort((item1: any, item2: any) =>
          sort?.orderDirection === 'asc'
            ? Number(item1?.price) - Number(item2?.price)
            : Number(item2?.price) - Number(item1?.price)
        );
      } else {
        return [];
      }
    case 'dueDate':
      if (data?.length) {
        return [...data].sort((item1: any, item2: any) =>
          sort?.orderDirection === 'asc'
            ? Number(item1?.daysLeftToClaim) - Number(item2?.daysLeftToClaim)
            : Number(item2?.daysLeftToClaim) - Number(item1?.daysLeftToClaim)
        );
      } else {
        return [];
      }
    case 'pendingRewards':
      if (data?.length) {
        return [...data].sort((item1: any, item2: any) =>
          sort?.orderDirection === 'asc'
            ? Number(item2?.rewards) - Number(item1?.rewards)
            : Number(item1?.rewards) - Number(item2?.rewards)
        );
      } else {
        return [];
      }
    default:
      if (data) {
        return data;
      } else {
        return [];
      }
  }
};

export const getTypeActiveStatus = (
  data: any,
  bagState: number,
  selectedItems: Array<any>
) => {
  if (bagState === 2 && selectedItems?.length > 0) {
    if (
      data?.pageType === 'node' &&
      selectedItems[0]?.pageType === 'node' &&
      data?.nodeType === selectedItems[0]?.nodeType &&
      data?.tier === selectedItems[0]?.tier
    ) {
      return false;
    } else if (
      data?.pageType === 'keycard' &&
      selectedItems[0]?.pageType === 'keycard'
    ) {
      return false;
    } else if (
      data?.pageType === 'capsule' &&
      selectedItems[0]?.pageType === 'capsule'
    ) {
      return false;
    } else if (
      data?.pageType === 'perk' &&
      selectedItems[0]?.pageType === 'perk'
    ) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

export const useIconButtonStyles = makeStyles({
  root: {
    'backgroundColor': 'rgba(248, 248, 248, .6) !important',
    '&:hover': {
      backgroundColor: 'rgba(248, 248, 248, .6)', // Replace with your desired hover color
    },
  },
});

export const calculateDailyRewards = (
  currentVrr: string,
  perksPct: Array<string>
) => {
  const vrr = formatWei(currentVrr, 18, 5);
  let nodeRewards = parseFloat(vrr);
  perksPct?.map((pct: string) => {
    nodeRewards += (Number(pct) / 100 / 100) * parseFloat(vrr);
  });
  return nodeRewards?.toFixed(5);
};
