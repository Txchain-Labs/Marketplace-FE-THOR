import { useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { RootState } from './redux/store';
import { AuthService } from './services/auth.service';
import { authAction } from './redux/slices/authSlice';

type JWTDataType = {
  address: string;
  iat: number;
  exp: number;
};

export default function Signin(): any {
  const dispatch = useDispatch();
  const address = useAccount().address || '';
  const { signMessageAsync } = useSignMessage();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!address) {
      return;
    }

    // Check if we're already logged in with a valid token for this account.
    if (token) {
      const info: JWTDataType = jwt_decode(token as string);
      if (
        info &&
        'address' in info &&
        info.address.toLowerCase() === address.toLowerCase()
      ) {
        console.log('already logged in');
        return;
      }
    }

    async function authenticate() {
      let {
        data: { data: user },
      } = await AuthService.getUser(address);
      console.log('user found', user);

      // Create user if one doesn't exist
      if (!('address' in user)) {
        const createResponse = await AuthService.handleSignup(address);
        user = createResponse.data;
        console.log('user not found calling signup', user);
      }

      // Something went wrong, abort.
      if (!('address' in user)) {
        throw Error('ERROR SETTING UP USER');
      }

      // Prompt for creation of signature.
      const signature = await signMessageAsync({
        message: `I am signing my one-time nonce: ${user.nonce}`,
      });

      // Fetch JWT token
      const res = await AuthService.handleAuthenticate(address, signature);
      if (!('data' in res)) {
        throw Error(res.message);
      }

      // Tell the world we're logged in
      dispatch(authAction.setLoading(true));
      AuthService.setToken(res.data.token);
      dispatch(authAction.setToken(res.data.token));
      dispatch(authAction.setUser(user));
      setTimeout(() => {
        dispatch(authAction.setLoading(false));
      }, 1000);
    }

    authenticate().catch((e) => {
      dispatch(authAction.setLoading(false));
      console.log('Authentication ERROR:', e);
    });
  }, [address, dispatch, signMessageAsync, token]);

  return null;
}
