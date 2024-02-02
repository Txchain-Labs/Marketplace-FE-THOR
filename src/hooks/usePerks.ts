import { SupportedChains } from '@/utils/constants';
import { useChain } from '@/utils/web3Utils';
import { useContractRead, useContractWrite } from 'wagmi';
import ThorPerkNFTAbi from '@/../public/abi/ThorPerkNFT.json';
import {
  ToastSeverity,
  showToast,
  toastOptions,
} from '@/redux/slices/toastSlice';
import { useDispatch } from '@/redux/store';
import { setDataRefetching } from '@/redux/slices/managerBagSlice';

export function useThorPerkNFTContract() {
  const chain = useChain();
  switch (chain?.id) {
    case SupportedChains.Fuji:
      return '0xD9B0e871C1b284904B0fC6Ab4BA3c479042131Ef';
    // Subject to change when fork restarted
    case SupportedChains.Avalanche:
      return '0x1eb252B7302A8B672D1bCB8c86C5194862FB17fe';
    default:
      throw new Error('Chain not supported');
  }
}

export const useSetPerkName = (toastData?: toastOptions) => {
  const dispatch = useDispatch();

  const address = useThorPerkNFTContract();
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: address,
    abi: ThorPerkNFTAbi,
    functionName: 'setPerkName',
    onSuccess: () => {
      if (toastData) {
        dispatch(
          showToast({
            message: toastData?.message,
            severity: toastData?.severity,
            image: toastData?.image,
          })
        );
      }
      dispatch(setDataRefetching());
    },
    onError: () => {
      if (toastData) {
        dispatch(
          showToast({
            message: 'Rename Error',
            severity: ToastSeverity.ERROR,
            image: toastData?.image,
          })
        );
      }
    },
  });
};

export const useGetPerk = (perkId: number) => {
  const address = useThorPerkNFTContract();
  return useContractRead({
    address: address,
    abi: ThorPerkNFTAbi,
    functionName: 'getPerk',
    args: [perkId],
    enabled: Boolean(perkId) && perkId > 0,
  });
};
