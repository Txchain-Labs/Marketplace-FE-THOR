import { fetchActivitiesBidderSeller } from '../utils/graphqlQueries';
import { getSubgraphUrl } from '../utils/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useChain } from '../utils/web3Utils';

export const funcGetActivities = async function (
  activitiesQuery: string,
  subgraphUrl: string
) {
  return axios({
    url: subgraphUrl,
    method: 'post',
    headers: { 'content-type': 'application/json' },
    data: {
      query: activitiesQuery,
    },
  });
};

export const useGetActivities = (userAddress: any, cnt: number) => {
  const activitiesQuery: string = fetchActivitiesBidderSeller(userAddress, cnt);

  const chain = useChain();
  const subgraphUrl = getSubgraphUrl(chain?.id);

  async function getActivities() {
    return funcGetActivities(activitiesQuery, subgraphUrl);
  }

  return useQuery(['getActivities_' + cnt, userAddress, cnt], getActivities, {
    refetchInterval: 5 * 60 * 1000,
    enabled: Boolean(userAddress),
  });
};
