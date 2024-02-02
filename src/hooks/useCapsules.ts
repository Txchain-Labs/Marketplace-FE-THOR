import { SupportedChains } from '@/utils/constants';
import { useChain } from '@/utils/web3Utils';
import { useContractWrite } from 'wagmi';
import ThorCapsuleNFTAbi from '@/../public/abi/ThorCapsuleNFT.json';
import {
  ToastSeverity,
  showToast,
  toastOptions,
} from '@/redux/slices/toastSlice';
import { useDispatch } from '@/redux/store';
import { setDataRefetching } from '@/redux/slices/managerBagSlice';

export function useThorCapsuleNFTContract() {
  const chain = useChain();
  switch (chain?.id) {
    case SupportedChains.Fuji:
      return '0xb6bE5520239C89bb28b8D66E17e5C153F83a4475';
    // Subject to change when fork restarted
    case SupportedChains.Avalanche:
      return '0x76348A4fC5e8F58C7C7733b41768df7d0ADEd241';
    default:
      throw new Error('Chain not supported');
  }
}

export const useSetCapsuleName = (toastData?: toastOptions) => {
  const dispatch = useDispatch();

  const address = useThorCapsuleNFTContract();
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: address,
    abi: ThorCapsuleNFTAbi,
    functionName: 'setCapsuleName',
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
