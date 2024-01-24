import BaseService from './base.service';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

class NFTsService extends BaseService {
  private readonly prefix: string | undefined = baseURL;

  /**
   * feature List
   * @param data
   */
  getNFTs = (params?: any): Promise<any> =>
    this.get(`${this.prefix}/nfts`, params);

  /**
   * feature List
   * @param data
   */
  getNodes = (params?: any): Promise<any> =>
    this.get(`${this.prefix}/nfts/nodes`, params);
  // this.get(`${this.prefix}/nfts`);

  /**
   * feature List
   * @param data
   */
  getSearchNodes = (params?: any): Promise<any> =>
    this.get(`${this.prefix}/nfts/searchNodes`, params);
}
export const nftsService = new NFTsService();
