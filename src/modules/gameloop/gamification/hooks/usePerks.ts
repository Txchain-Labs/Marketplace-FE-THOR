import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useNetwork,
} from 'wagmi';
import { getGamificationContractByChain, thorfiNfts } from '@/utils/constants';
import ThorPerkNFTAbi from '@/../public/abi/ThorPerkNFT.json';
import ThorGamificationAbi from '@/../public/abi/ThorGamification.json';
import { BigNumber, BigNumberish } from 'ethers';
import {
  GamificationItem,
  PerkDetails,
  PerkItem,
  PERK_TYPE_LABELS,
  PERK_TYPES,
} from '../types';
import { useState } from 'react';
import { useDispatch } from '@/redux/store';
import { setTxnStatus, STATUS } from '@/redux/slices/transactionSlice';
import { showToast, ToastSeverity } from '@/redux/slices/toastSlice';

export function useGetPerk(perkTokenId: BigNumber) {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const baseContractRead = {
    address: thorfiNfts('perks', chain)[0].contract,
    abi: ThorPerkNFTAbi,
  };

  return useContractReads({
    contracts: [
      {
        ...baseContractRead,
        functionName: 'getPerk',
        args: [perkTokenId],
      },
      {
        ...baseContractRead,
        functionName: 'isOriginPerk',
        args: [perkTokenId],
      },
    ],
    select: ([perkDetails, isOriginPerk]): GamificationItem<PerkItem> => {
      const perkDetail = perkDetails as unknown as PerkDetails;
      return {
        contractAddress: thorfiNfts('perks', chain)[0].contract,
        id: perkTokenId,
        type: 'perks',
        perk: {
          perkType: perkDetail.perkType,
          duration: perkDetail.duration,
          value: perkDetail.value,
        },
        isOriginPerk: isOriginPerk as boolean,
        isDriftPerk: !isOriginPerk as boolean,
        get isOrigin() {
          return [
            PERK_TYPES.PERK_TYPE_BOOST_PERM10,
            PERK_TYPES.PERK_TYPE_BOOST_TEMP50,
          ].includes(this.perk.perkType);
        },
        get perkTypeLabel() {
          return PERK_TYPE_LABELS[this.perk.perkType];
        },
      };
    },
    enabled: !!address && perkTokenId.gt(0),
  });
}

export function useGetPerks() {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const baseContractRead = {
    address: thorfiNfts('perks', chain)[0].contract,
    abi: ThorPerkNFTAbi,
    args: [address],
    enabled: !!address,
    watch: true,
  };

  const { data: userBalance }: { data: BigNumber[] } = useContractRead({
    ...baseContractRead,
    functionName: 'balanceOf',
  });

  const { data: userTokenIds }: { data: BigNumber[] } = useContractReads({
    contracts: Array.from({ length: +userBalance || 0 }).map((_, i) => ({
      ...baseContractRead,
      functionName: 'tokenOfOwnerByIndex',
      args: [address, i],
    })),
  });

  const { data: areDriftPerks }: { data: boolean[] } = useContractReads({
    contracts: userTokenIds?.map((tokenId) => ({
      ...baseContractRead,
      functionName: 'isOriginPerk',
      args: [tokenId],
    })),
    select: (data): boolean[] => {
      return data.map((isOriginPerk) => !isOriginPerk);
    },
    enabled: !!userTokenIds,
  });

  return useContractReads({
    contracts: userTokenIds?.map((tokenId) => ({
      ...baseContractRead,
      functionName: 'getPerk',
      args: [tokenId],
    })),
    select: (data): GamificationItem<PerkItem>[] => {
      return data.map((perkTypePerkDetails, i) => {
        const perkDetail = perkTypePerkDetails as unknown as PerkDetails;
        return {
          contractAddress: thorfiNfts('perks', chain)[0].contract,
          id: userTokenIds[i],
          type: 'perks',
          perk: {
            perkType: perkDetail.perkType,
            duration: perkDetail.duration,
            value: perkDetail.value,
          },
          isOrigin: !areDriftPerks[i],
          isOriginPerk: !areDriftPerks[i],
          isDriftPerk: areDriftPerks[i],
          get perkTypeLabel() {
            return PERK_TYPE_LABELS[this.perk.perkType];
          },
        };
      });
    },
    enabled: !!userTokenIds && !!areDriftPerks,
  });
}

export function useApplyNodePerk() {
  // For some reason, wagmi useContractWrite hook doesn't wait for the tx to be completed and the following
  // properties (isLoading, isError, isSuccess) are immediately mutated, so we can't rely on it
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { chain } = useNetwork();
  const dispatch = useDispatch();
  const contractAddress = getGamificationContractByChain(chain);

  const useNodePerk = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: contractAddress,
    abi: ThorGamificationAbi,
    functionName: 'useNodePerk',
  });

  const handleUseNodePerk = async (
    args: [BigNumberish, BigNumberish, BigNumberish]
  ) => {
    setIsLoading(true);
    try {
      dispatch(setTxnStatus(STATUS.PENDING));
      const tx = await useNodePerk.writeAsync({
        recklesslySetUnpreparedArgs: args,
      });
      await tx.wait();
      setIsSuccess(true);
      dispatch(setTxnStatus(STATUS.SUCCESS));

      dispatch(
        showToast({
          message: 'Perk applied successfully !',
          severity: ToastSeverity.SUCCESS,
        })
      );
    } catch (e) {
      setIsError(true);
      dispatch(setTxnStatus(STATUS.ERROR));

      dispatch(
        showToast({
          message: 'An error occurred while applying the perk',
          severity: ToastSeverity.ERROR,
        })
      );
    }

    setIsLoading(false);
  };

  return {
    applyPerk: handleUseNodePerk,
    isLoading,
    isSuccess,
    isError,
  };
}
