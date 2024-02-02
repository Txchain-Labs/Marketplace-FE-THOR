import BaseService from './base.service';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

class CollectionsService extends BaseService {
  private readonly prefix: string | undefined = baseURL;

  /**
   * feature List
   * @param data
   */
  getCollections = (params?: any): Promise<any> =>
    this.get(`${this.prefix}/collections`, params);

  getSortedCollections = (params?: any): Promise<any> =>
    this.get(`${this.prefix}/collections/all`, params);

  getRecentlyAddedCollections = (params?: any): Promise<any> =>
    this.get(`${this.prefix}/collections/recently-added`, params);

  getPromotedCollections = (params?: any): Promise<any> =>
    this.get(`${this.prefix}/collections/promoted`, params);

  getDynamoDBCollections = (body?: any): Promise<any> =>
    this.post(`collections/dynamodb`, body);
  /**
   * feature List
   * @param data
   */
  getCollectionsByOwner = (address: string, params?: any): Promise<any> =>
    this.get(`${this.prefix}/collections/owner/${address}`, params);

  /**
   * feature List
   * @param data
   */

  getCollectionById = (id: string): Promise<any> =>
    this.get(`${this.prefix}/collections/${id}`);

  /**
   * feature List
   * @param data
   */

  getNextCollection = (addr: string): Promise<any> =>
    this.get(`${this.prefix}/collections/next/${addr}`);

  /**
   * collection address
   * @param addr
   */

  getCollectionByAddress = (addr: string, chainId: number): Promise<any> =>
    this.get(`${this.prefix}/collections/${chainId}/${addr}`);

  //   featureListing = (params: any): Promise<any> =>
  //     this.get(`${this.prefix}/listings/live`, params);
  /**
   * market place with filters
   * @param data
   */

  //   exploreMarketPlace = (params: any): Promise<any> =>
  //     this.get(`${this.prefix}/explore`, params);
  /**
   * market place like
   * @param data
   */
  //   likeMarketPlace = (id: any): Promise<any> =>
  //     this.put(`${this.prefix}/like/${id}`);
  /**
   * market place like
   * @body data
   */
  //   commentMarketPlace = (id: any, body: any): Promise<any> =>
  //     this.post(`${this.prefix}/add-comments/${id}`, body);
  /**
   * market place like
   * @body data
   */
  //   getNft = (id: any): Promise<any> => this.get(`${this.prefix}/get-nft/${id}`);
  /**
   * market place view
   * @param data
   */
  //   viewMarketPlace = (id: any): Promise<any> =>
  //     this.put(`${this.prefix}/view/${id}`);
  /**
   * market place view
   * @param data
   */
  //   getLikedNfts = (params?: any): Promise<any> => {
  //     return this.get(`${this.prefix}/likes-listings`, params);
  //   };

  /**
   * market place view
   * @param data
   */
  //   reportAfeed = (data: any): Promise<any> => this.post(`report/create`, data);
  /**
   * market place view
   * @param data
   */
  //   addListedContract = (data: any): Promise<any> =>
  //     this.post(`${this.prefix}/listedContract`, data);
}
export const collectionsService = new CollectionsService();
