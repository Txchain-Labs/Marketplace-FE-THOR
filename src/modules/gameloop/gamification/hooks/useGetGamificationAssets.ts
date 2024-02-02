import { useAccount, useContractRead } from 'wagmi';
import { UseQueryResult } from '@tanstack/react-query';
import ThorNodeDappQueryV2Abi from '../../../../../public/abi/ThorNodeDappQueryV2.json';

import { GameloopAssetsType } from '@/utils/types';
import { useDappQueryContract } from '@/hooks/useNodes';

const useGetGamificationAssets = () => {
  const { address } = useAccount();
  const DAPP_QUERY_V2 = useDappQueryContract();

  return useContractRead({
    address: DAPP_QUERY_V2,
    abi: ThorNodeDappQueryV2Abi,
    functionName: 'getGameloopAssets',
    args: [address],
    enabled: !!address,
    watch: true,
    cacheTime: 60_000,
  }) as unknown as UseQueryResult<GameloopAssetsType, Error>;
};

export default useGetGamificationAssets;
