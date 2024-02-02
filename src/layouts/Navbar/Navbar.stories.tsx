import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { WagmiConfig } from 'wagmi';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Navbar from './Navbar';
import { client } from '@/wagmi';
import { store } from '@/redux/store';

import ThemeCustomization from '@/themes/ThemeCustomization';

const queryClient = new QueryClient();
const persistor = persistStore(store);

const meta = {
  title: 'Capsule/Navbar',
  tags: ['autodocs'],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const NavbarWrapper = ({
  children,
}: {
  children: (args: {
    expandSidebar: React.Dispatch<React.SetStateAction<boolean>>;
    hideSidebar: React.Dispatch<React.SetStateAction<boolean>>;
    setIsChatIconHidden: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactElement;
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [, setIsSidebarExpanded] = useState(false);
  const [, setIsSidebarHidden] = useState(smDown ? true : false);
  const [, setIsChatIconHidden] = useState(true);

  return children({
    expandSidebar: setIsSidebarExpanded,
    hideSidebar: setIsSidebarHidden,
    setIsChatIconHidden: setIsChatIconHidden,
  });
};

export const Demo: Story = {
  render: () => (
    <WagmiConfig client={client}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <ThemeCustomization>
              <NavbarWrapper>
                {({ expandSidebar, hideSidebar, setIsChatIconHidden }) => (
                  <Navbar
                    expandSidebar={expandSidebar}
                    hideSidebar={hideSidebar}
                    setIsChatIconHidden={setIsChatIconHidden}
                  />
                )}
              </NavbarWrapper>
            </ThemeCustomization>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </WagmiConfig>
  ),
};
