import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { AnimatePresence, motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiConfig } from 'wagmi';
import { ToastContainer } from 'react-toastify';
import { Box, Typography } from '@mui/material';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';

import { store } from '@/redux/store';
import { client } from '@/wagmi';
import { useFontLoading } from '@/utils/common';

import ThemeCustomization from '@/themes/ThemeCustomization';
import { Layout } from '@/layouts';
import { GlobalModal } from '@/components/modals';
import Signin from '@/components/signin';
import CommonToast from '@/components/common/CommonToast';

const persistor = persistStore(store);
const queryClient = new QueryClient();

function MyApp({ Component, pageProps, router }: AppProps) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const fontLoading = useFontLoading([
    'Nexa-Bold',
    'Nexa-Regular',
    'Nexa-Light',
  ]);
  useEffect(() => {
    if (!fontLoading) {
      setTimeout(() => {
        setFontLoaded(true);
      }, 1000);
    }
  }, [fontLoading]);
  return (
    <>
      <Head>
        <title>Capsule</title>
      </Head>
      <WagmiConfig client={client}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <ThemeCustomization>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={true}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  draggable
                  pauseOnHover
                  className="toast-container"
                />
                <CommonToast />
                <GlobalModal>
                  {!fontLoaded ? (
                    <Box className={`splash ${!fontLoading ? 'fade-out' : ''}`}>
                      <img
                        src="/images/splash-logo.svg"
                        className="zoom-in-out"
                      />
                      <Typography variant={'lbl-lg'} mt={'8px'}>
                        Loading...
                      </Typography>
                    </Box>
                  ) : (
                    <Layout>
                      <Signin />
                      <AnimatePresence>
                        <motion.div
                          key={router.route}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: 1.1,
                            },
                          }}
                          exit={{
                            opacity: 0,

                            transition: {
                              duration: 0.7, // Adjust the duration as needed
                            },
                          }}
                        >
                          <Component {...pageProps} />
                        </motion.div>
                      </AnimatePresence>
                    </Layout>
                  )}
                </GlobalModal>
              </ThemeCustomization>
            </PersistGate>
          </Provider>
        </QueryClientProvider>
      </WagmiConfig>
    </>
  );
}
export default MyApp;
