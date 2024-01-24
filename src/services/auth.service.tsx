import axios from 'axios';
import BaseService from './base.service';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export type AccountNotExistsType = {
  account: false;
};

export type AccountType = {
  id: string;
  display_name: string;
  username: string;
  bio: string;
  discord: string;
  twitter: string;
  profile_picture: string;
  joined_date: string;
  address: string;
  nonce: number;
  chainId: number;
  profile_link: string | null;
  is_verified: boolean;
  is_disabled: boolean;
  is_deleted: boolean;
};

export type GetUserResultType = {
  data: { data: AccountType | AccountNotExistsType };
};

export type GetUsersResultType = {
  data: {
    code: number;
    data: { count: number; rows: AccountType[] };
  };
};

export type HandleAuthenticateType =
  | {
      code: number;
      message: string;
    }
  | {
      code: 200;
      message: string;
      data: {
        token: string;
        name: string;
        address: string;
        id: string;
      };
    };

export class AuthService extends BaseService {
  static handleSignup = (address: string) =>
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/signup`, {
      body: JSON.stringify({ address, chainId: 43114 }), ///// 43113: Fuji testnet
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }).then((response) => response.json());

  static handleAuthenticate = (
    address: string,
    signature: string
  ): Promise<HandleAuthenticateType> =>
    fetch(`${baseURL}/users/login`, {
      body: JSON.stringify({ address: address.toLowerCase(), signature }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }).then((response) => response.json());

  static getUsers = (): Promise<GetUsersResultType> => {
    return axios.get(`${baseURL}/users/`);
  };

  static getUser = (address: string): Promise<GetUserResultType> => {
    return axios.get(`${baseURL}/users/${address}`);
  };

  static editUser = (id: string, data: any): Promise<any> => {
    return axios.put(`${baseURL}/users/${id}`, data);
  };

  static uploadFile = (data: any): Promise<any> => {
    return axios.post(`${baseURL}/uploads`, data);
  };

  static getChat = (address: string): Promise<any> => {
    return axios.get(`${baseURL}/chat/join/${address}`);
  };

  static getDM = (users: string[]): Promise<any> => {
    return axios.post(`${baseURL}/chat/create-dm`, { users });
  };
}
