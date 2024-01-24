import {
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
} from 'wagmi';
import marketplaceAbi from '../../public/abi/Marketplace.json';
import {
  showToast,
  toastOptions,
  ToastSeverity,
} from '../redux/slices/toastSlice';
import { setTxnStatus, STATUS } from '../redux/slices/transactionSlice';
import { useDispatch } from '../redux/store';
import { useChain } from '../utils/web3Utils';

export const useMarketplaceAddress = () => {
  const chain = useChain();
  switch (chain.id) {
    case 43113: // Fuji
      return '0x0AF17c44C50063756E232b42464487fa4Da63b3A';
    case 43114: // Main C
      return '0x82b7a9EA06E757ec7c8cDdEcbAd6071e6894e4Cd';
    case 31337: // Thor net
      return '';
    default:
      return '';
  }
};

export const usePlaceBid = (toastData?: toastOptions) => {
  const marketplaceAddress = useMarketplaceAddress();
  const dispatch = useDispatch();
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'safePlaceBid',
    onSuccess: () => {
      setTimeout(() => dispatch(setTxnStatus(STATUS.SUCCESS)), 10000);
      if (toastData) {
        dispatch(
          showToast({
            message: toastData?.message,
            severity: toastData?.severity,
            image: toastData?.image,
          })
        );
      }
    },
    onError: () => {
      setTimeout(() => dispatch(setTxnStatus(STATUS.ERROR)), 10000);
      if (toastData) {
        dispatch(
          showToast({
            message: 'Error in Placing Bid',
            severity: ToastSeverity.ERROR,
            image: toastData?.image,
          })
        );
      }
    },
  });
};

export const useOtcPlaceBid = (toastData?: toastOptions) => {
  const marketplaceAddress = useMarketplaceAddress();
  const dispatch = useDispatch();
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'newOtcBid',
    onSuccess: (e) => {
      console.log(e, 'newOtcBid success');
      setTimeout(() => dispatch(setTxnStatus(STATUS.SUCCESS)), 10000);
      if (toastData) {
        dispatch(
          showToast({
            message: toastData?.message,
            severity: toastData?.severity,
            image: toastData?.image,
          })
        );
      }
    },
    onError: (e) => {
      console.log(e, 'newOtcBid error');
      setTimeout(() => dispatch(setTxnStatus(STATUS.ERROR)), 10000);
      if (toastData) {
        dispatch(
          showToast({
            message: 'Error in Placing Bid',
            severity: ToastSeverity.ERROR,
            image: toastData?.image,
          })
        );
      }
    },
  });
};

export const useGetOtcBid = (
  collectionAddress: string | undefined,
  tokenId: number | undefined
): any => {
  const marketplaceAddress = useMarketplaceAddress();

  return useContractRead({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'otcBidBytokenId',
    args: [collectionAddress, tokenId],
    cacheTime: 60_000,
    enabled: Boolean(collectionAddress && tokenId),
    watch: true,
  });
};

export const useCancelOtcBid = (toastData?: toastOptions) => {
  const marketplaceAddress = useMarketplaceAddress();
  const dispatch = useDispatch();
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'cancelOtcBid',
    onSuccess: (e) => {
      console.log(e, 'cancelOtcBid success');
      if (toastData) {
        dispatch(
          showToast({
            message: toastData?.message,
            severity: toastData?.severity,
            image: toastData?.image,
          })
        );
      }
    },
    onError: (e) => {
      console.log(e, 'cancelOtcBid error');
      if (toastData) {
        dispatch(
          showToast({
            message: 'Error in Bid Cancelling',
            severity: ToastSeverity.ERROR,
            image: toastData?.image,
          })
        );
      }
    },
  });
};

export const useCancelBid = (toastData?: toastOptions) => {
  const marketplaceAddress = useMarketplaceAddress();
  const dispatch = useDispatch();
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'cancelBid',
    onSuccess: (e) => {
      console.log(e, 'cancelBid success');
      if (toastData) {
        dispatch(
          showToast({
            message: toastData?.message,
            severity: toastData?.severity,
            image: toastData?.image,
          })
        );
      }
    },
    onError: (e) => {
      console.log(e, 'cancelBid error');
      if (toastData) {
        dispatch(
          showToast({
            message: 'Error in Bid Cancelling',
            severity: ToastSeverity.ERROR,
            image: toastData?.image,
          })
        );
      }
    },
  });
};

export const useExecuteOrder = (toastData?: toastOptions) => {
  const marketplaceAddress = useMarketplaceAddress();
  const dispatch = useDispatch();
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'safeExecuteOrder',
    onSuccess: () => {
      dispatch(setTxnStatus(STATUS.SUCCESS));
      if (toastData) {
        dispatch(
          showToast({
            message: toastData?.message,
            severity: toastData?.severity,
            image: toastData?.image,
          })
        );
      }
    },
    onError: () => {
      setTimeout(() => dispatch(setTxnStatus(STATUS.ERROR)), 10000);
      // dispatch(setTxnStatus(STATUS.ERROR));
      if (toastData) {
        dispatch(
          showToast({
            message: 'Transaction failed',
            severity: ToastSeverity.ERROR,
            image: toastData?.image,
          })
        );
      }
    },
  });
};

export const useAcceptBid = (toastData?: toastOptions) => {
  const marketplaceAddress = useMarketplaceAddress();
  const dispatch = useDispatch();
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'acceptBid',
    onSuccess: (e) => {
      console.log(e, 'acceptBid success');
      dispatch(setTxnStatus(STATUS.SUCCESS));
      if (toastData) {
        dispatch(
          showToast({
            message: toastData?.message,
            severity: toastData?.severity,
            image: toastData?.image,
          })
        );
      }
    },
    onError: (e) => {
      console.log(e, 'acceptBid error');
      dispatch(setTxnStatus(STATUS.ERROR));
      if (toastData) {
        dispatch(
          showToast({
            message: 'Error in Accepting Bid',
            severity: ToastSeverity.ERROR,
            image: toastData?.image,
          })
        );
      }
    },
  });
};

export const useAcceptOtcBid = (toastData?: toastOptions) => {
  const marketplaceAddress = useMarketplaceAddress();
  const dispatch = useDispatch();
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'acceptOtcBid',
    onSuccess: (e) => {
      console.log(e, 'acceptOtcBid success');
      dispatch(setTxnStatus(STATUS.SUCCESS));
      if (toastData) {
        dispatch(
          showToast({
            message: toastData?.message,
            severity: toastData?.severity,
            image: toastData?.image,
          })
        );
      }
    },
    onError: (e) => {
      console.log(e, 'acceptOtcBid error');
      dispatch(setTxnStatus(STATUS.ERROR));
      if (toastData) {
        dispatch(
          showToast({
            message: 'Error in Accepting Private Bid',
            severity: ToastSeverity.ERROR,
            image: toastData?.image,
          })
        );
      }
    },
  });
};

export const useGetOrderByNft = (
  collectionAddress: string | undefined,
  tokenId: number | undefined
) => {
  const marketplaceAddress = useMarketplaceAddress();
  return useContractRead({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'orderBytokenId',
    args: [collectionAddress, tokenId],
    cacheTime: 60_000,
    enabled: Boolean(collectionAddress && tokenId),
    watch: true,
  });
};

export const useGetBidByNft = (
  collectionAddress: string | undefined,
  tokenId: number | undefined
) => {
  const marketplaceAddress = useMarketplaceAddress();
  return useContractRead({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'bidByOrderId',
    args: [collectionAddress, tokenId],
    cacheTime: 60_000,
    enabled: Boolean(collectionAddress && tokenId),
    watch: true,
  });
};

export const useGetTransaction = (txnHash: any, toastData?: toastOptions) => {
  const dispatch = useDispatch();
  return useWaitForTransaction({
    hash: txnHash,
    onSuccess: () => {
      if (toastData) {
        dispatch(
          showToast({
            message: toastData?.message,
            severity: toastData?.severity,
            link: `https://snowtrace.io/tx/${txnHash}`,
            image: toastData?.image,
            autoHideDuration: toastData?.autoHideDuration,
          })
        );
      }
    },
    onError: () => {
      if (toastData) {
        dispatch(
          showToast({
            message: 'Error in getting Transaction',
            severity: ToastSeverity.ERROR,
            image: toastData?.image,
            autoHideDuration: toastData?.autoHideDuration,
          })
        );
      }
    },
  });
};
