import type { Meta, StoryObj } from '@storybook/react';

import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiConfig } from 'wagmi';
import { client } from '@/wagmi';
import { store } from '@/redux/store';

import CollectionCard from './CollectionCard';

const queryClient = new QueryClient();
const persistor = persistStore(store);

const meta = {
  title: 'Capsule/CollectionCard',
  component: CollectionCard,
  tags: ['autodocs'],
} satisfies Meta<typeof CollectionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
  decorators: [
    (story) => (
      <WagmiConfig client={client}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <PersistGate persistor={persistor}>{story()}</PersistGate>
          </Provider>
        </QueryClientProvider>
      </WagmiConfig>
    ),
  ],
  args: {
    collection: {
      address: '0x7325e3564b89968d102b3261189ea44c0f5f1a8e',
      category: null,
      chainid: 43114,
      collection_size: '384939',
      cover_image:
        'https://thorcollections.s3.us-west-1.amazonaws.com/OG_Odin.png',
      description:
        'The larger Origin Odin NFTs provide a custom RPC Endpoint and produce dynamic VRR-determined rewards for the lifetime of the NFT. By owning an Origin NFT, you unlock the full potential of decentralization in a fast-moving Web3 environment, in a rewarding fashion. ',
      discord: 'https://discord.com/invite/thorfi',
      floor_price: '699000000000000000',
      id: '07b5bae3-133a-4932-b918-ecfece13efd1',
      is_erc731: false,
      is_erc1155: false,
      is_p2e: false,
      is_show: true,
      is_thor_collection: true,
      is_verified: false,
      listed_count: '696',
      listed_time: '2023-05-01T22:24:10.784Z',
      metadata_url:
        'https://thorcollections.s3.us-west-1.amazonaws.com/OG_Odin.png',
      name: 'Thorfi Origin Odin',
      owner: 'Thorfi',
      profile_image:
        'https://thorcollections.s3.us-west-1.amazonaws.com/OG_Odin250.png',
      rank: 4,
      symbol: 'OriginOdin',
      total_volume_avax: '1402114323920411017782',
      total_volume_thor: '6410016968704461114865',
      total_volume_usd: '13816188365156234729409',
      twitter: 'https://twitter.com/ThorFiOfficial?s=20',
      update_time: '2023-05-01T22:24:10.784Z',
      volume_changed: -98.01,
      web: 'https://thorfi.io/',
    },
  },
};
