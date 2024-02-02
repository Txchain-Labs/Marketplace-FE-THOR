import type { Meta, StoryObj } from '@storybook/react';

import SearchField from './SearchField';

const meta = {
  title: 'Capsule/SearchField',
  component: SearchField,
  tags: ['autodocs'],
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
  args: {
    placeholder: 'Search NFTs',
    fullWidth: true,
  },
};
