import { SupportedChains } from '@/utils/constants';
import { useChain } from '@/utils/web3Utils';
import { useContractWrite } from 'wagmi';
import ThorKeyNFTAbi from '@/../public/abi/ThorKeyNFT.json';
import {
  ToastSeverity,
  showToast,
  toastOptions,
} from '@/redux/slices/toastSlice';
import { useDispatch } from '@/redux/store';
import { setDataRefetching } from '@/redux/slices/managerBagSlice';

export function useThorKeyNFTContract() {
  const chain = useChain();
  switch (chain?.id) {
    case SupportedChains.Fuji:
      return '0xc4D437413ef5E8bA11ff38BdCa79DB60e0492376';
    // Subject to change when fork restarted
    case SupportedChains.Avalanche:
      return '0x6FBc108e4aD4324e199A2Ac98C136B38a25A1C6a';
    default:
      throw new Error('Chain not supported');
  }
}

export const useSetKeycardName = (toastData?: toastOptions) => {
  const dispatch = useDispatch();

  const address = useThorKeyNFTContract();
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: address,
    abi: ThorKeyNFTAbi,
    functionName: 'setKeyName',
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
