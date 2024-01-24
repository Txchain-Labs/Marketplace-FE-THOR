import { ReactNode, useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import AlertModal from '../components/modals/AlertModal';
import { CartDrawer } from '../components/common';

const MainLayout = ({ children }: { children: ReactNode }) => {
  const [openAlert, setOpenAlert] = useState(false);

  const matches = useMediaQuery('(max-width:600px)');

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ width: '100%' }}>
        <Navbar />
        {matches ? <Box height="72px" /> : <Box height="48px" />}
        {children}

        <CartDrawer />

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
