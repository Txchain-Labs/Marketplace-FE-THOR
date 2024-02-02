import axios from 'axios';
import BaseService from './base.service';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL + '/recent-search';

export class RecentSearchService extends BaseService {
  static getRecentSearchesByUser = (
    chainId: number,
    userId: string,
    params: any
  ): Promise<any> => {
    return axios.get(`${baseURL}/${chainId}/${userId}`, { params });
  };

  static addRecentSearchByUser = (
    chainId: number,
    userId: string,
    item_type: string,
    item: {
      collection_address?: string;
      token_id?: string;
      user_address?: string;
    }
  ): Promise<any> => {
    return axios.post(`${baseURL}/${chainId}/${userId}`, {
      item_type,
      ...item,
    });
  };
}
