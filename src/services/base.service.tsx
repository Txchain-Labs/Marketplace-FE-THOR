import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

class BaseService {
  /**
   * Set Token On Header
   * @param token
   */
  static setToken(token: any): void {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Fetch data from server
   * @param url Endpoint link
   * @return Promise
   */
  protected get = (url: string, params?: any): Promise<any> =>
    axios.get(`${url}`, {
      params,
    });

  /**
   * Write data over server
   * @param url Endpoint link
   * @param body Data to send over server
   * @return Promise
   */
  protected post = (url: string, body: any, options = {}): Promise<any> =>
    axios.post(`${baseURL}/${url}`, body, options);

  /**
   * Delete Data From Server
   * @param url Endpoint link
   * @param params Embed as query params
   * @return Promise
   */
  protected delete = (url: string, params?: any, data?: any): Promise<any> =>
    axios.delete(`${baseURL}/${url}`, { params, data });

  /**
   * Update data on server
   * @param url Endpoint link
   * @param body Data to send over server
   * @param parameters Embed as query params
   * @return Promise
   */

  protected put = (url: string, body?: any, parameters?: any): Promise<any> => {
    return axios.put(`${baseURL}/${url}`, body, {
      ...parameters,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  };
}

export default BaseService;
