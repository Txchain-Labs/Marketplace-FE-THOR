import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useSwitchNetwork } from 'wagmi';
import { watchNetwork } from '@wagmi/core';
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Badge,
  Typography,
  useMediaQuery,
  InputBase,
} from '@mui/material';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import { RootState, useSelector, useDispatch } from '../../redux/store';
import { dottedAddress, formatDecimals } from '../../shared/utils/utils';
import { palette } from '../../theme/palette';
import { MODAL_TYPES, useGlobalModalContext } from '../modals';
import styles from './style.module.css';
import { useBalance } from '../../hooks/useToken';
import NavMenu from '../menu/NavMenu';
import { DEFAULT_CHAIN_ID, FirebaseConfig } from '../../utils/constants';
import MenuModal from '../modals/MenuModal';
import AlertModal from '../modals/AlertModal';
import SearchModal from '../modals/SearchModal';

import { initializeApp } from '@firebase/app';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getFirestore,
} from '@firebase/firestore';
import { openCartModal, selectCarted } from '../../redux/slices/cartSlice';
import { useSetAttribute } from '../../hooks/uiHooks';

const firebaseApp = initializeApp(FirebaseConfig);
const dbFirestore = getFirestore(firebaseApp);
let unsub: any;

const Navbar = () => {
  const router = useRouter();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const { address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const [searchVal, setSearchVal] = useState('');

  console.log({ searchVal });

  const connectWalletNavbarRef = useSetAttribute([
    { key: 'id', value: 'connect-wallet-navbar' },
    { key: 'dusk', value: 'connect-wallet-navbar' },
  ]);
  const profileNavbarRef = useSetAttribute([
    { key: 'id', value: 'profile-navbar' },
    { key: 'dusk', value: 'profile-navbar' },
  ]);

  watchNetwork(() => {
    switchNetwork?.(DEFAULT_CHAIN_ID);
  });

  useConnect({
    onSuccess() {
      switchNetwork?.(DEFAULT_CHAIN_ID);
    },
  });

  const profile_picture = address
    ? 'profile_picture' in user
      ? (user?.profile_picture as string)
      : '/images/profile-avatar.svg'
    : '/images/profile-avatar.svg';

  const { showModal } = useGlobalModalContext();
  const avaxBalance = useBalance('AVAX');
  const thorBalance = useBalance('THOR');

  const dispatch = useDispatch();

  const { activeCat } = useSelector((state: any) => state.uiGolobal);
  const carted = useSelector(selectCarted);

  const matches = useMediaQuery('(max-width:600px)');

  const handleClick = () => {
    showModal(MODAL_TYPES.CONNECT_WALLET, {
      title: 'Create instance form',
      confirmBtn: 'Save',
    });
  };

  const handleClickProfile = () => {
    if (address) {
      if (matches) {
        void router.push('/wallet');
      } else if (activeCat === 'art') {
        void router.push('/profile#art');
      } else void router.push('/profile#node');
    } else {
      showModal(MODAL_TYPES.CONNECT_WALLET, {
        title: 'Create instance form',
        confirmBtn: 'Save',
      });
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorEl(null);
  };

  const [openSearch, setOpenSearch] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const onSearch = () => {
    // if (address) {
    //   setOpenSearch(true);
    // } else {
    //   setOpenAlert(true);
    // }

    // we always open search,  even if wallet is not connected (mainnet if no wallet)
    setOpenSearch(true);
  };

  const [openMenuModal, setOpenMenuModal] = useState(false);

  const [newActivityIs, setNewActivityIs] = useState(false);

  const handleCartClick = () => {
    dispatch(openCartModal());
  };

  const onChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const keyword = event.target.value;
    setSearchVal(keyword);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const keyword = (event.target as any).value;
    if (event.key === 'Enter') {
      setSearchVal(keyword);
      onSearch();
    }
  };

  useEffect(() => {
    if (address) {
      if (unsub) unsub();

      unsub = onSnapshot(
        query(
          collection(dbFirestore, 'notifications'),
          where('user', '==', address.toLowerCase()),
          orderBy('timestamp', 'desc'),
          limit(3)
        ),
        (doc) => {
          setNewActivityIs(false);

          doc.docChanges().forEach((change) => {
            console.log('Current data: ', change.doc.data());
            const data = change.doc.data();
            if (data && (!data.read || data.read === false)) {
              setNewActivityIs(true);
            }
          });
        }
      );
    }
  }, [address]);

  return (
    <Box className={styles.navbar}>
      <Box
        className={styles.balance}
        fontFamily="Nexa"
        fontStyle="normal"
        fontWeight={300}
        fontSize="14px"
        lineHeight="120%"
        alignItems="baseline"
        flex="1"
      >
        {/* {thorBalance} THOR | {avaxBalance} AVAX */}
        {thorBalance ? formatDecimals(thorBalance) : '---'}
        <Typography fontWeight={900} fontFamily={'Nexa'} marginLeft={1}>
          THOR
        </Typography>
        <Typography fontWeight={400} margin="0 20px">
          |
        </Typography>
        {avaxBalance ? formatDecimals(avaxBalance) : '---'}
        <Typography fontWeight={900} fontFamily={'Nexa'} marginLeft={1}>
          AVAX
        </Typography>
      </Box>

      <Box className={styles.logo} sx={{ width: '60px', p: '5px' }}>
        <IconButton size="large" onClick={() => setOpenMenuModal(true)}>
          <img src={'/images/mainMenue.svg'} width="40px" alt="" />
        </IconButton>
      </Box>

      <Box className={styles.nodeMenu} sx={{ marginLeft: '25%' }}>
        <IconButton
          size="large"
          sx={{ flexDirection: 'column' }}
          onClick={handleOpenNavMenu}
        >
          <img
            src={
              activeCat === 'art'
                ? open
                  ? '/images/artwork-iconRed.svg'
                  : '/images/artwork-icon.svg'
                : open
                ? '/images/node-iconRed.svg'
                : '/images/node-icon.svg'
            }
            width="28px"
            alt=""
          />
          <img
            src={open ? '/images/PolygonRed.svg' : '/images/Polygon.svg'}
            width="20%"
            alt=""
            style={{ position: 'absolute', bottom: 0 }}
          />
        </IconButton>
      </Box>

      <Box className={styles.nodeMenu} sx={{ marginLeft: '5%' }}>
        <IconButton
          size="large"
          sx={{ flexDirection: 'column' }}
          onClick={onSearch}
        >
          <img src={'/images/SearchIcon.png'} width="28px" alt="" />
        </IconButton>
      </Box>

      <Box
        className={styles.balance}
        sx={{
          width: {
            'md': '30%',
            'sm': '25%',
            'xs': '100%',
            '@media (max-width: 390px)': {
              maxWidth: '90%',
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            height: '36px',
            backgroundColor: '#F8F8F8',
            border: '1px solid #F8F8F8',
            borderRadius: { miniMobile: '60px', sm: '0px' },
            padding: '10px',
            margin: 0.2,
          }}
        >
          <InputBase
            sx={{ width: '100%' }}
            value={searchVal}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder="Search"
          />
          <img onClick={() => onSearch()} src="/images/SearchIcon.png" />
        </Box>
      </Box>
      <Box display={'flex'} alignItems={'center'} marginLeft={'2%'}>
        {/* <Box className={styles.searchBtn} sx={{ width: '50px' }}>
          <IconButton onClick={() => onSearch()} size="large">
            <SearchIcon fontSize="inherit" sx={{ color: 'black' }} />
          </IconButton>
        </Box> */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '48px',
          }}
        >
          {address ? (
            <>
              <Box className={styles.wallet} sx={{}}>
                <Typography
                  sx={{
                    whiteSpace: 'nowrap',
                    marginRight: '20px',
                  }}
                  gutterBottom={false}
                >
                  {dottedAddress(address)}
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={handleClickProfile} ref={profileNavbarRef}>
                  <div
                    className={newActivityIs ? 'pulse-ring-animated light' : ''}
                  ></div>
                  <div
                    className={newActivityIs ? 'pulse-ring-animated' : ''}
                  ></div>
                  <Avatar
                    alt="Remy Sharp"
                    src={profile_picture}
                    sx={{ cursor: 'pointer' }}
                  />
                </IconButton>
              </Box>
              <Box>
                <IconButton
                  aria-label="cart"
                  size="large"
                  onClick={handleCartClick}
                >
                  <Badge badgeContent={carted.length} color="primary">
                    <ShoppingCartSharpIcon
                      fontSize="inherit"
                      sx={{ color: 'black' }}
                    />
                  </Badge>
                </IconButton>
              </Box>
            </>
          ) : matches ? (
            <>
              <IconButton onClick={handleClick}>
                <div
                  className={newActivityIs ? 'pulse-ring-animated light' : ''}
                ></div>
                <div
                  className={newActivityIs ? 'pulse-ring-animated' : ''}
                ></div>
                <img alt="Remy Sharp" src={profile_picture} width="28px" />
              </IconButton>
            </>
          ) : (
            <Button
              className={styles.wallet}
              // disableElevation
              ref={connectWalletNavbarRef}
              onClick={handleClick}
              variant="contained"
              sx={{
                'whiteSpace': 'nowrap',
                'borderRadius': '0px',
                'textTransform': 'none',
                'background': 'rgba(255, 255, 255, 0.87)',
                'color': palette.primary.storm,
                'border': `1px solid ${palette.primary.storm}`,
                'height': '32px',
                'boxShadow': 'none',
                '&:hover': { backgroundColor: 'white' },
              }}
            >
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 700,
                  marginRight: '14px',
                }}
              >
                {loading ? 'Connecting' : 'Connect Wallet'}
              </Typography>
              <img src="/images/Vector.png" width="12px" alt="" />
            </Button>
          )}
        </Box>
      </Box>
      <MenuModal
        onClose={() => {
          setOpenMenuModal(false);
        }}
        open={openMenuModal}
      />
      <NavMenu
        anchorEl={anchorEl}
        open={open}
        handleClose={handleCloseNavMenu}
        setAnchorEl1={setAnchorEl}
      />
      <SearchModal
        onClose={() => {
          setOpenSearch(false);
          setSearchVal('');
        }}
        open={openSearch}
        searchVal={searchVal}
      />
      <AlertModal
        onClose={() => {
          setOpenAlert(false);
        }}
        open={openAlert}
      />
    </Box>
  );
};

export default Navbar;
