import * as React from 'react';
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import FiberManualRecordSharpIcon from '@mui/icons-material/FiberManualRecordSharp';
import ContentCopySharpIcon from '@mui/icons-material/ContentCopySharp';
import { useDispatch } from 'react-redux';
import { authAction } from '../../redux/slices/authSlice';
import { RootState, useSelector } from '../../redux/store';
import { useAccount, useDisconnect } from 'wagmi';
import {
  useGetUsdFromAvax,
  useGetUsdFromThor,
} from '../../../src/hooks/useOracle';
import { useChain } from '../../../src/utils/web3Utils';
import { useBalance } from '../../hooks/useToken';
import { dottedAddress, formatDecimals } from '../../shared/utils/utils';
import { BigNumberish, ethers } from 'ethers';
import { NextLinkComposed } from '@/components/common/Link';
import { NAVBAR_HEIGHT } from '@/utils/constants';
import AvaxIcon from '@/components/icons/currencies/Avax';
import ThorIcon from '@/components/icons/currencies/Thor';
import UsdceIcon from '@/components/icons/currencies/Usdce';

const sxBalances = {
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: 'normal',
};
const ProfileMenu = (props: any) => {
  const {
    open,
    anchorEl,
    handleClose,
    newActivityIs,
    ///// setIsChatIconHidden,
  } = props;

  const { user } = useSelector((state: RootState) => state.auth);
  const { address } = useAccount();
  const chain = useChain();

  const dispatch = useDispatch();
  const { disconnect } = useDisconnect();

  const avaxBalance = useBalance('AVAX');
  const thorBalance = useBalance('THOR');
  const usdceBalance = useBalance('USDCE');

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const thorBalanceValue =
    thorBalance && parseFloat(formatDecimals(thorBalance));
  const avaxBalanceValue =
    avaxBalance && parseFloat(formatDecimals(avaxBalance));
  const usdceBalanceValue =
    usdceBalance && parseFloat(formatDecimals(usdceBalance, 6));

  const thorBalancePrice = React.useMemo(() => {
    if (thorPrice && thorBalanceValue) {
      return (
        thorBalanceValue *
        Number(ethers.utils.formatEther(thorPrice as BigNumberish))
      );
    } else {
      return 0;
    }
  }, [thorPrice, thorBalanceValue]);

  const avaxBalancePrice = React.useMemo(() => {
    if (avaxPrice && avaxBalanceValue) {
      return (
        avaxBalanceValue *
        Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
      );
    } else {
      return 0;
    }
  }, [avaxPrice, avaxBalanceValue]);

  const profile_picture =
    'profile_picture' in user
      ? (user?.profile_picture as string)
      : '/images/profile-pic.svg';
  const user_name = 'username' in user ? (user?.username as string) : 'Unknown';

  const [copied, setCopied] = React.useState(false);

  const logoutHandler = () => {
    dispatch(authAction.clearStates());
    // void router.push('/');
    handleClose();
    ///// setIsChatIconHidden(false);
    disconnect();
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(address);

    setTimeout(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }, 200);
  };

  return (
    <Menu
      aria-labelledby="profile menu"
      anchorEl={anchorEl}
      open={open}
      onClose={() => {
        handleClose();
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          mt: {
            miniMobile: `calc(${NAVBAR_HEIGHT.miniMobile} - 18px)`,
            sm: `calc(${NAVBAR_HEIGHT.sm} - 12px)`,
          },
          backgroundImage: 'none',
          minWidth: '250px',
          pb: '8px',
        },
      }}
    >
      <MenuItem
        to={{
          pathname: '/activity',
        }}
        component={NextLinkComposed}
        divider
        onClick={handleClose}
      >
        <ListItemText>
          <Typography variant={'lbl-md'} lineHeight={'23px'}>
            Activity
          </Typography>
        </ListItemText>
        {newActivityIs && (
          <ListItemIcon sx={{ minWidth: '0 !important' }}>
            <FiberManualRecordSharpIcon
              fontSize={'small'}
              sx={{ color: 'success.main' }}
            />
          </ListItemIcon>
        )}
      </MenuItem>

      <MenuItem
        to={{
          pathname: '/profile/edit',
        }}
        component={NextLinkComposed}
        divider
        onClick={handleClose}
      >
        <ListItemText>
          <Typography variant={'lbl-md'} lineHeight={'23px'}>
            Edit profile
          </Typography>
        </ListItemText>
      </MenuItem>

      <MenuItem
        to={{
          pathname: '/profile/preferences',
        }}
        component={NextLinkComposed}
        divider
        onClick={handleClose}
      >
        <ListItemText>
          <Typography variant={'lbl-md'} lineHeight={'23px'}>
            Preferences
          </Typography>
        </ListItemText>
        {!localStorage.getItem('color-mode') && (
          <ListItemIcon sx={{ minWidth: '0 !important' }}>
            <Box
              sx={{
                bgcolor: 'success.main',
                color: 'success.contrastText',
                p: '2px 6px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 300,
              }}
            >
              NEW
            </Box>
          </ListItemIcon>
        )}
      </MenuItem>

      <MenuItem divider onClick={logoutHandler}>
        <ListItemText>
          <Typography variant={'lbl-md'} lineHeight={'23px'}>
            Log out
          </Typography>
        </ListItemText>
      </MenuItem>

      <MenuItem
        disableRipple
        sx={{ '&:hover': { bgcolor: 'unset', cursor: 'unset' } }}
      >
        <Avatar alt={user_name} src={profile_picture} />
        <Box sx={{ ml: '8px', lineHeight: '50px', flexGrow: 1 }}>
          <Typography>{user_name}</Typography>
          <Typography>{dottedAddress(address)}</Typography>
        </Box>

        {copied ? (
          <Typography
            sx={{
              color: 'success.main',
            }}
          >
            Copied
          </Typography>
        ) : (
          <IconButton
            sx={(theme) => ({
              color:
                theme.palette.mode === 'light'
                  ? 'text.primary'
                  : 'primary.main',
            })}
            onClick={copyWalletAddress}
          >
            <ContentCopySharpIcon />
          </IconButton>
        )}
      </MenuItem>

      <MenuItem
        disableRipple
        sx={{
          'py': '2px !important',
          '&:hover': { bgcolor: 'unset', cursor: 'unset' },
        }}
      >
        <AvaxIcon viewBox={'0 0 18 15'} />

        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: '700',
            lineHeight: 'normal',
            pt: '2px',
            pl: '8px',
            flexGrow: 1,
          }}
        >
          AVAX
        </Typography>

        <Box textAlign={'right'}>
          <Typography sx={sxBalances}>
            {avaxBalance && (user as any)?.address
              ? formatDecimals(avaxBalance)
              : '---'}
          </Typography>
          <Typography
            color={'text.secondary'}
            fontWeight={300}
            fontSize={'12px'}
          >
            {avaxBalancePrice && (user as any)?.address
              ? avaxBalancePrice.toFixed(2)
              : '0.00'}{' '}
            USD
          </Typography>
        </Box>
      </MenuItem>

      <MenuItem
        disableRipple
        sx={{
          'py': '2px !important',
          '&:hover': { bgcolor: 'unset', cursor: 'unset' },
        }}
      >
        <ThorIcon viewBox={'0 0 25 20'} />

        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: '700',
            lineHeight: 'normal',
            pt: '2px',
            pl: '8px',
            flexGrow: 1,
          }}
        >
          THOR
        </Typography>

        <Box textAlign={'right'}>
          <Typography sx={sxBalances}>
            {thorBalance && (user as any)?.address
              ? formatDecimals(thorBalance)
              : '---'}
          </Typography>
          <Typography
            color={'text.secondary'}
            fontWeight={300}
            fontSize={'12px'}
          >
            {thorBalancePrice && (user as any)?.address
              ? thorBalancePrice.toFixed(2)
              : '0.00'}{' '}
            USD
          </Typography>
        </Box>
      </MenuItem>

      <MenuItem
        disableRipple
        sx={{
          'py': '2px !important',
          '&:hover': { bgcolor: 'unset', cursor: 'unset' },
        }}
      >
        <UsdceIcon viewBox={'0 0 15 14'} />

        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: '700',
            lineHeight: 'normal',
            pt: '2px',
            pl: '8px',
            flexGrow: 1,
          }}
        >
          USDCe
        </Typography>

        <Box textAlign={'right'}>
          <Typography sx={sxBalances}>
            {usdceBalance && (user as any)?.address
              ? formatDecimals(usdceBalance, 6)
              : '---'}
          </Typography>
          <Typography
            color={'text.secondary'}
            fontWeight={300}
            fontSize={'12px'}
          >
            {usdceBalanceValue && (user as any)?.address
              ? usdceBalanceValue.toFixed(2)
              : '0.00'}{' '}
            USD
          </Typography>
        </Box>
      </MenuItem>
    </Menu>
  );
};
export default ProfileMenu;
