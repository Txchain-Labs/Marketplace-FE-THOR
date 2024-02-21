//import { Chain, configureChains, createClient } from 'wagmi';
//import { avalanche, avalancheFuji } from 'wagmi/chains';
// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
//import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { injected, walletConnect } from 'wagmi/connectors';
// import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
//import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import { http, createConfig } from '@wagmi/core';
import { avalanche, avalancheFuji } from '@wagmi/core/chains';
import { createTestClient } from 'viem';

// Uncomment {hardhatLocalhost if you want to switch on thornet
/*const thorNetChain: Chain = {
  id: 31_337,
  name: 'ThorNet',
  network: 'thornet',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: { http: ['https://54.153.9.6:8545/ext/bc/C/rpc'] },
  },
  testnet: true,
};*/

// const hardhatLocalhost: Chain = {
//   id: 31337,
//   name: 'Hardhat Localhost',
//   network: 'hardhat',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'Avalanche',
//     symbol: 'AVAX',
//   },
//   rpcUrls: {
//     default: { http: ['http://localhost:8545'] },
//   },
//   testnet: true,
// };

// const RPCs = {
//   // '43114': 'https://rpc.ankr.com/avalanche',
//   '43114': `${process.env.NEXT_PUBLIC_BACKEND_URL}/rpcProxy/43114`,
//   // '43113': `${process.env.NEXT_PUBLIC_BACKEND_URL}/rpcProxy/43113`,
//   '43113': 'https://avalanche-fuji-c-chain.publicnode.com',
//   // '31337': 'https://54.153.9.6:8545/ext/bc/C/rpc',
//   '31337': 'http://localhost:8545',
// } as const;
// type ChainIdType = keyof typeof RPCs;

// const { chains, provider, webSocketProvider } = configureChains(
//   [avalanche, avalancheFuji, hardhatLocalhost],
//   [
//     jsonRpcProvider({
//       rpc: (chain) => ({
//         http: RPCs[chain.id.toString() as ChainIdType] || '',
//       }),
//     }),
//   ]
// );

// export const client = createClient({
//   autoConnect: true,
//   connectors: [
//     // new MetaMaskConnector({ chains }),
//     /*
//     new CoinbaseWalletConnector({
//       chains,
//       options: {
//         appName: 'ThorFi',
//       },
//     }),
//     new WalletConnectConnector({
//       chains,
//       options: {
//         qrcode: true,
//       },
//     }),
//     */
//     new InjectedConnector({
//       chains,
//       options: {
//         name: 'Injected',
//         shimDisconnect: true,
//       },
//     }),
//     new WalletConnectConnector({
//       chains,
//       options: {
//         qrcode: true,
//       },
//     }),
//   ],
//   provider,
//   webSocketProvider,
// });

export const config = createConfig({
  chains: [avalanche, avalancheFuji],
  transports: {
    [avalanche.id]: http(),
    [avalancheFuji.id]: http(),
  },
});
