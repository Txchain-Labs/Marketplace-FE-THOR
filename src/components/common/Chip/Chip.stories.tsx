import type { Meta, StoryObj } from '@storybook/react';

import Chip from './Chip';

const meta = {
  title: 'Capsule/Chip',
  component: Chip,
  tags: ['autodocs'],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {
  args: {
    label: 'Favourited',
  },
};

export const Selected: Story = {
  args: {
    label: 'Favourited',
    selected: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Favourited',
    disabled: true,
  },
};
