import { Chain, configureChains, createClient } from 'wagmi';
import { avalanche, avalancheFuji } from 'wagmi/chains';
// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const thorNetChain: Chain = {
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
};

const RPCs = {
  '43114': 'https://rpc.ankr.com/avalanche',
  '43113': 'https://rpc.ankr.com/avalanche_fuji',
  '31337': 'https://54.153.9.6:8545/ext/bc/C/rpc',
} as const;
type ChainIdType = keyof typeof RPCs;

const { chains, provider, webSocketProvider } = configureChains(
  [avalanche, avalancheFuji, thorNetChain],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: RPCs[chain.id.toString() as ChainIdType] || '',
      }),
    }),
  ]
);

export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    /*
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'ThorFi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    */
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});
