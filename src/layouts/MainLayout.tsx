import { ReactNode, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Button, Typography } from '@mui/material';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import ChatModal from '@/components/chat/ChatModal';
import AlertModal from '@/components/modals/AlertModal';
import { useAccount } from 'wagmi';
import { getChannelListOptions } from '@/components/chat/channelListOptions';
import { CartDrawer, BagListDrawer } from '../components/common';

import { DRAWER_WIDTH } from '@/utils/constants';

const MainLayout = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const { address } = useAccount();

  const [openChat, setOpenChat] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [unreadTotalCount, setUnreadTotalCount] = useState(0);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(smDown ? true : false);
  const [isChatIconHidden, setIsChatIconHidden] = useState(true); ///// hide chat icon by default

  const onChat = () => {
    if (address) {
      setOpenChat(true);
    } else {
      setOpenAlert(true);
    }
  };

  const channelListOptions = getChannelListOptions(true, address);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        isSidebarHidden={isSidebarHidden}
        setIsSidebarHidden={setIsSidebarHidden}
      />
      <Box
        sx={{
          width: '100%',
          paddingLeft: {
            sm: `${DRAWER_WIDTH.collapsed}px`,
            xs: 0,
          },
        }}
        onClick={() => {
          setIsSidebarExpanded(false);
        }}
      >
        <Navbar
          expandSidebar={setIsSidebarExpanded}
          hideSidebar={setIsSidebarHidden}
          setIsChatIconHidden={setIsChatIconHidden}
        />
        <Box
          sx={{
            height: { miniMobile: '80px', sm: '52px' },
          }}
        />
        {children}
        <Button
          onClick={onChat}
          sx={{
            'display': isChatIconHidden ? 'none' : '',
            'position': 'fixed',
            'right': '10px',
            'zIndex': 50,
            '@media (min-width: 767px)': {
              bottom: '10px',
            },
            '@media (max-width: 767px)': {
              top: '80px',
            },
          }}
        >
          <img src="/images/chat_icon.png" width="82px" />
          {unreadTotalCount > 0 && (
            <Typography
              sx={{
                color: 'white',
                position: 'fixed',
                paddingBottom: '7px',
              }}
            >
              {unreadTotalCount}
            </Typography>
          )}
        </Button>
        <CartDrawer />
        <BagListDrawer />
        <ChatModal
          onClose={() => {
            setOpenChat(false);
          }}
          open={openChat}
          channelListOptions={channelListOptions}
          // unreadTotalCount={unreadTotalCount}
          setUnreadTotalCount={setUnreadTotalCount}
        />
        <AlertModal
          onClose={() => {
            setOpenAlert(false);
          }}
          open={openAlert}
        />
      </Box>
      {/* <Footer /> */}
    </Box>
  );
};

export default MainLayout;
