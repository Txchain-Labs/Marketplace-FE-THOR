import type { Meta, StoryObj } from '@storybook/react';

import SortMenu, { SortOption } from './SortMenu';

const meta = {
  title: 'Capsule/SortMenu',
  component: SortMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof SortMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const sortOptions: SortOption[] = [
  {
    label: 'Price',
    directionLabels: { desc: 'High to low', asc: 'Low to high' },
    directions: ['desc', 'asc'],
    field: 'avax_price',
  },
  {
    label: 'Sold',
    directionLabels: {
      desc: 'Most Recent to Oldest',
      asc: 'Oldest to Most Recent',
    },
    directions: ['desc', 'asc'],
    field: 'sold_at',
  },
  {
    label: 'Last sale',
    directionLabels: {
      desc: 'High to Low',
      asc: 'Low to High',
    },
    directions: ['desc', 'asc'],
    field: 'last_sale_avax_price',
  },
  {
    label: 'Listed',
    directionLabels: {
      desc: 'Most Recent to Oldest',
      asc: 'Oldest to Most Recent',
    },
    directions: ['desc', 'asc'],
    field: 'listed_at',
  },
  {
    label: 'Minted',
    directionLabels: {
      desc: 'Most Recent to Oldest',
      asc: 'Oldest to Most Recent',
    },
    directions: ['desc', 'asc'],
    field: 'minted_at',
  },
];

export const Demo: Story = {
  args: {
    sortOptions,
    selectedField: 'avax_price',
    direction: 'desc',
  },
};
