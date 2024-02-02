import React, { FC, useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { dottedAddress } from '@/shared/utils/utils';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import { useAccount } from 'wagmi';
import { useSetAttribute } from '@/hooks/uiHooks';
import { MODAL_TYPES, useGlobalModalContext } from '@/components/modals';
import { RootState, useDispatch, useSelector } from '@/redux/store';
import { openCartModal, selectCarted } from '@/redux/slices/cartSlice';
import ProfileMenu from '@/components/menu/ProfileMenu';
import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from '@firebase/firestore';
import { initializeApp } from '@firebase/app';
import { FirebaseConfig } from '@/utils/constants';

let unsub: any;

const firebaseApp = initializeApp(FirebaseConfig);
const dbFirestore = getFirestore(firebaseApp);

interface UserMenuProps {
  setIsChatIconHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserMenu: FC<UserMenuProps> = ({ setIsChatIconHidden }) => {
  const { showModal } = useGlobalModalContext();

  const { address } = useAccount();

  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const carted = useSelector(selectCarted);

  const connectWalletNavbarRef = useSetAttribute([
    { key: 'id', value: 'connect-wallet-navbar' },
    { key: 'dusk', value: 'connect-wallet-navbar' },
  ]);
  const profileNavbarRef = useSetAttribute([
    { key: 'id', value: 'profile-navbar' },
    { key: 'dusk', value: 'profile-navbar' },
  ]);

  const [anchorEl_ProfileMenu, setAnchorEl_ProfileMenu] =
    useState<null | HTMLElement>(null);
  const [newActivityIs, setNewActivityIs] = useState(false);

  const profile_picture =
    address && (user as any)?.profile_picture
      ? (user as any).profile_picture
      : '/images/profile-pic.svg';

  const handleClick = () => {
    showModal(MODAL_TYPES.CONNECT_WALLET, {
      title: 'Create instance form',
      confirmBtn: 'Save',
    });
  };

  const handleClickProfile = (event: React.MouseEvent<HTMLElement>) => {
    if (address) {
      setAnchorEl_ProfileMenu(event.currentTarget);
      setIsChatIconHidden(true); ///// hide chat icon when profile menu opens up
    } else {
      showModal(MODAL_TYPES.CONNECT_WALLET, {
        title: 'Create instance form',
        confirmBtn: 'Save',
      });
    }
  };

  const open_ProfileMenu = Boolean(anchorEl_ProfileMenu);

  const handleCloseProfileMenu = () => {
    setAnchorEl_ProfileMenu(null);
  };

  const handleCartClick = () => {
    dispatch(openCartModal());
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
    <Stack
      direction={'row'}
      gap={{ miniMobile: '16px', sm: '24px' }}
      alignItems={'center'}
    >
      {address ? (
        <>
          <Stack direction={'row'} gap={'16px'} alignItems={'center'}>
            <Typography
              sx={{
                whiteSpace: 'nowrap',
                display: { miniMobile: 'none', md: 'block' },
              }}
            >
              {dottedAddress(address)}
            </Typography>

            <IconButton
              sx={{ p: 0 }}
              onClick={handleClickProfile}
              ref={profileNavbarRef}
            >
              <div
                className={newActivityIs ? 'pulse-ring-animated light' : ''}
              ></div>
              <div className={newActivityIs ? 'pulse-ring-animated' : ''}></div>
              <Avatar
                alt="Remy Sharp"
                src={profile_picture}
                sx={{
                  cursor: `url("/images/cursor-pointer.svg"), auto`,
                  width: 36,
                  height: 36,
                }}
              />
            </IconButton>
          </Stack>

          <IconButton
            aria-label="cart"
            sx={{ p: '6px' }}
            onClick={handleCartClick}
            color={'inherit'}
          >
            <Badge badgeContent={carted.length} color="primary">
              <ShoppingCartSharpIcon />
            </Badge>
          </IconButton>
        </>
      ) : (
        <Button
          ref={connectWalletNavbarRef}
          onClick={handleClick}
          variant={'outlined'}
          color={'secondary'}
          sx={{ width: '130px', height: '40px', minHeight: '40px' }}
        >
          <Typography variant={'lbl-md'}>
            {loading ? 'Connecting' : 'Connect Wallet'}
          </Typography>
        </Button>
      )}

      <ProfileMenu
        anchorEl={anchorEl_ProfileMenu}
        open={open_ProfileMenu}
        handleClose={handleCloseProfileMenu}
        setAnchorEl={setAnchorEl_ProfileMenu}
        newActivityIs={newActivityIs}
        setIsChatIconHidden={setIsChatIconHidden}
      />
    </Stack>
  );
};

export default UserMenu;
