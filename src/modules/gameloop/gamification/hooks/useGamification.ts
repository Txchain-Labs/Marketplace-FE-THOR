import {
  useAccount,
  useContractRead,
  useContractWrite,
  useAccount,
  usePrepareContractWrite,
} from 'wagmi';
import {
  getGamificationContractByChain,
  thorfiNfts,
  ThorfiNFTType,
  tokensMainnet,
} from '@/utils/constants';
import { useState } from 'react';
import { useDispatch } from '@/redux/store';
import { setTxnStatus, STATUS } from '@/redux/slices/transactionSlice';
import { showToast, ToastSeverity } from '@/redux/slices/toastSlice';

export function useGamificationAllowance(
  typeNFT: ThorfiNFTType,
  NFTContractAbi: any[]
) {
  const { chain } = useAccount();
  const gamificationContractAddress = getGamificationContractByChain(chain);
  const { address } = useAccount();

  return useContractRead({
    address: thorfiNfts(typeNFT, chain)[0].contract,
    abi: NFTContractAbi,
    functionName: 'isApprovedForAll',
    args: [address, gamificationContractAddress],
  });
}

export function useApproveGamification(
  typeNFT: ThorfiNFTType,
  NFTContractAbi: any[]
) {
  // For some reason, wagmi useContractWrite hook doesn't wait for the tx to be completed and the following
  // properties (isLoading, isError, isSuccess) are immediately mutated, so we can't rely on it
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const dispatch = useDispatch();
  const { chain } = useAccount();
  const gamificationContractAddress = getGamificationContractByChain(chain);

  const args = [gamificationContractAddress, true];

  const writeBaseConfig = {
    abi: NFTContractAbi,
    functionName: 'setApprovalForAll',
    args,
  };

  const { config } = usePrepareContractWrite({
    ...writeBaseConfig,
    address: thorfiNfts(typeNFT, chain)[0].contract,
  });

  const approve = useContractWrite(config);

  const handleApproveKeys = async () => {
    setIsLoading(true);
    try {
      dispatch(setTxnStatus(STATUS.PENDING));
      const tx = await approve.writeAsync();
      await tx.wait();
      setIsSuccess(true);
      dispatch(setTxnStatus(STATUS.SUCCESS));
      dispatch(
        showToast({
          message: 'Approved',
          severity: ToastSeverity.SUCCESS,
        })
      );
    } catch (e) {
      setIsError(true);
      dispatch(setTxnStatus(STATUS.ERROR));
      dispatch(
        showToast({
          message: 'An error occured while approving',
          severity: ToastSeverity.ERROR,
        })
      );
    }

    setIsLoading(false);

    // reset state
    setTimeout(() => {
      setIsSuccess(false);
      setIsError(false);
      setIsLoading(false);
    }, 3000);
  };

  return {
    approve: handleApproveKeys,
    isLoading,
    isSuccess,
    isError,
  };
}

export function useApproveGamificationToSpendThor(NFTContractAbi: any[]) {
  // For some reason, wagmi useContractWrite hook doesn't wait for the tx to be completed and the following
  // properties (isLoading, isError, isSuccess) are immediately mutated, so we can't rely on it
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const dispatch = useDispatch();
  const { chain } = useAccount();
  const gamificationContractAddress = getGamificationContractByChain(chain);

  const args = [gamificationContractAddress, true];

  const writeBaseConfig = {
    abi: NFTContractAbi,
    functionName: 'setApprovalForAll',
    args,
  };

  const { config } = usePrepareContractWrite({
    ...writeBaseConfig,
    address: tokensMainnet.THOR,
  });

  const approve = useContractWrite(config);

  const handleApproveKeys = async () => {
    setIsLoading(true);
    try {
      dispatch(setTxnStatus(STATUS.PENDING));
      const tx = await approve.writeAsync();
      await tx.wait();
      setIsSuccess(true);
      dispatch(setTxnStatus(STATUS.SUCCESS));
      dispatch(
        showToast({
          message: 'Approved !',
          severity: ToastSeverity.SUCCESS,
        })
      );
    } catch (e) {
      setIsError(true);
      dispatch(setTxnStatus(STATUS.ERROR));
      dispatch(
        showToast({
          message: 'An error occured while approving',
          severity: ToastSeverity.ERROR,
        })
      );
    }

    setIsLoading(false);

    // reset state
    setTimeout(() => {
      setIsSuccess(false);
      setIsError(false);
      setIsLoading(false);
    }, 3000);
  };

  return {
    approve: handleApproveKeys,
    isLoading,
    isSuccess,
    isError,
  };
}
