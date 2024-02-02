import type { Meta, StoryObj } from '@storybook/react';

import { BigNumber } from 'ethers';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiConfig } from 'wagmi';
import { client } from '@/wagmi';
import { store } from '@/redux/store';

const queryClient = new QueryClient();
const persistor = persistStore(store);

import ArtworkCard from './ArtworkCard';

const meta = {
  title: 'Capsule/Thumbnails/ArtworkCard',
  component: ArtworkCard,
  tags: ['autodocs'],
} satisfies Meta<typeof ArtworkCard>;

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
    nft: {
      id: 'bffb08e9-acbe-4048-bb77-541ff5c695dd',
      collection_address: '0x76348a4fc5e8f58c7c7733b41768df7d0aded241',
      token_id: '2491',
      chainid: 43114,
      name: 'Capsule NFT 2491',
      description: 'Capsule NFT for ThorFi Gameloop',
      thumbnail_medium:
        'https://d3nzng6t9rclwr.cloudfront.net/collections/chain_43114/collection_0x76348a4fc5e8f58c7c7733b41768df7d0aded241/thumbnails/medium/2491.jpg',
      thumbnail_small:
        'https://d3nzng6t9rclwr.cloudfront.net/collections/chain_43114/collection_0x76348a4fc5e8f58c7c7733b41768df7d0aded241/thumbnails/small/2491.jpg',
      asset: 'CAPSULE NFT',
      likes: 0,
      is_synced: false,
      img: 'https://d3nzng6t9rclwr.cloudfront.net/collections/chain_43114/collection_0x76348a4fc5e8f58c7c7733b41768df7d0aded241/images/2491.jpg',
      total_trades: '1',
      minted_at: '2023-10-02T12:13:05.000Z',
      is_listed: false,
      payment_type: null,
      price: null,
      avax_price: '0',
      listed_at: '1970-01-01T00:00:00.000Z',
      otc_bid: '0',
      simple_bid: '0',
      sale_type: 0,
      last_sale_avax_price: '0',
      sold_at: '1970-01-01T00:00:00.000Z',
      createdAt: '2023-10-02T12:22:09.666Z',
      updatedAt: '2023-10-02T19:22:21.787Z',
    },
    avaxPrice: BigNumber.from('9298206000000000000'),
    thorPrice: BigNumber.from('108734000000000000'),
  },
};
