import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { NextAdapter } from 'next-query-params';
import { QueryParamProvider } from 'use-query-params';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiConfig } from 'wagmi';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';

import { store } from '../src/redux/store';
import theme from '../src/theme';
import { client } from '../src/wagmi';
import { Layout } from '../src/layouts';
import { GlobalModal } from '../src/components/modals';
import Signin from '../src/components/signin';
import CommonToast from '../src/components/common/CommonToast';
const persistor = persistStore(store);

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Capsule</title>
      </Head>
      <CssBaseline />
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
      <QueryParamProvider adapter={NextAdapter}>
        <WagmiConfig client={client}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <Provider store={store}>
                <PersistGate persistor={persistor}>
                  <CommonToast />
                  <GlobalModal>
                    <Layout>
                      <Signin />
                      <Component {...pageProps} />
                    </Layout>
                  </GlobalModal>
                </PersistGate>
              </Provider>
            </ThemeProvider>
          </QueryClientProvider>
        </WagmiConfig>
      </QueryParamProvider>
    </>
  );
}

export default MyApp;
