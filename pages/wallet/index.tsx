import * as React from 'react';
import { Stack } from '@mui/system';
import { Typography, Box, Button, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { dottedAddress, formatDecimals } from '../../src/shared/utils/utils';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { collectionsService } from '../../src/services/collection.service';
import axios from 'axios';
import { useBalance } from '../../src/hooks/useToken';
import { authAction } from '../../src/redux/slices/authSlice';
import { useDisconnect } from 'wagmi';
import {
  useGetUsdFromAvax,
  useGetUsdFromThor,
} from '../../src/hooks/useOracle';
import { useChain } from '../../src/utils/web3Utils';
import { BigNumberish, ethers } from 'ethers';

const balance_list = {
  'display': 'flex',
  'alignItems': 'center',
  'marginTop': '20px',
  'justifyContent': 'space-between',
  '& img': { marginRight: '30px' },
  '& p': { textAlign: 'right' },
};

const token_name = {
  fontWeight: 400,
  fontSize: '21px',
  lineHeight: '32px',
};

const MobileInit = () => {
  const router = useRouter();
  //Get Data from hooks

  const [, setCollections] = React.useState<any>([]);
  const [, setLoading] = React.useState<boolean>(false);

  const [, setCntFavoritedNFTs] = React.useState<number>(0);

  const user = useSelector((state: any) => state?.auth?.user);
  const avaxBalance = useBalance('AVAX');
  const thorBalance = useBalance('THOR');
  const usdceBalance = useBalance('USDCE');
  const fetch = React.useCallback(async () => {
    try {
      setLoading(true);

      let res = await collectionsService.getCollectionsByOwner(user?.address);
      setCollections(res.data.data);

      res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/liked-by/${user?.id}`
      );
      if (res.data.code === 200) {
        setCntFavoritedNFTs(res.data.data.length);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [user?.address, user?.id]);

  React.useEffect(() => {
    void fetch();
  }, [fetch]);

  const { activeCat } = useSelector((state: any) => state.uiGolobal);

  const handleClickProfile = () => {
    if (activeCat === 'art') {
      void router.push('/profile/nftArtwork');
    } else void router.push('/profile/prof#node');
  };
  const handleClickActivity = () => {
    void router.push('/activity');
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const { disconnect } = useDisconnect();

  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    dispatch(authAction.clearStates());
    void router.push('/about');
    handleClose();
    disconnect();
  };

  const chain = useChain();

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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        margin: '50px',
        marginTop: '110px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          marginTop: '-80px',
          marginBottom: '80px',
        }}
      >
        <Button
          sx={{
            textTransform: 'none',
            fontSize: '32px',
            lineHeight: '49px',
            marginBottom: '10px',
            fontWeight: 'bold',
          }}
          onClick={handleClickActivity}
        >
          Activity
        </Button>
        <Button
          sx={{
            textTransform: 'none',
            fontSize: '32px',
            lineHeight: '49px',
            fontWeight: 'bold',
          }}
          onClick={handleClickProfile}
        >
          My NFTs
        </Button>
      </Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          borderBottom: '1px solid',
          borderColor: '#eeeeee',
          paddingBottom: '12px',
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          // width="60%"
        >
          <Box display="flex">
            <img src={'/images/metaIcon.png'} alt="" />
            <Box ml={2}>
              <Typography
                sx={{
                  fontWeight: { sm: 700 },
                  typography: {
                    md: 'h4',
                    sm: 'sub-h',
                    miniMobile: 'p-lg',
                  },
                }}
              >
                {user?.username}
              </Typography>
              <Typography
                sx={{
                  typography: { sm: 'p-lg-bk', miniMobile: 'body1' },
                }}
              >
                {dottedAddress(user?.address)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <MoreVertIcon
          sx={{ cursor: `url("/images/cursor-pointer.svg"), auto` }}
          onClick={handleClick}
        />
      </Stack>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box sx={balance_list}>
          <Box display={'flex'} alignItems={'flex-start'}>
            <img src={'/images/avaxIcon.png'} alt="" />
            <Typography sx={token_name}>AVAX</Typography>
          </Box>
          <Typography>
            <Typography>{avaxBalance ? avaxBalanceValue : '---'}</Typography>
            <Typography>
              {avaxBalancePrice ? avaxBalancePrice.toFixed(2) : '0.00'}
            </Typography>
          </Typography>
        </Box>
        <Box sx={balance_list}>
          <Box display={'flex'} alignItems={'flex-start'}>
            <img src={'/images/thorIcon.png'} alt="" />
            <Typography sx={token_name}>THOR</Typography>
          </Box>
          <Typography>
            <Typography>{thorBalance ? thorBalanceValue : '---'}</Typography>
            <Typography>
              {thorBalancePrice ? thorBalancePrice.toFixed(2) : '0.00'}
            </Typography>
          </Typography>
        </Box>
        <Box sx={balance_list}>
          <Box display={'flex'} alignItems={'flex-start'}>
            <img src={'/images/usdceIcon.png'} alt="" />
            <Typography sx={token_name}>USDCe</Typography>
          </Box>
          <Typography>
            <Typography>{usdceBalance ? usdceBalanceValue : '---'}</Typography>
            <Typography>{usdceBalance ? usdceBalanceValue : '0.00'}</Typography>
          </Typography>
        </Box>
      </Box>
      <Menu
        sx={{ marginTop: '25px', marginLeft: '-25px' }}
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default MobileInit;
