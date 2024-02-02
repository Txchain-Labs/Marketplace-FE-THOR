import type { Meta, StoryObj } from '@storybook/react';

import Toggle from './Toggle';

const meta = {
  title: 'Capsule/Toggle',
  component: Toggle,
  tags: ['autodocs'],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
  args: {
    options: ['capsule', 'gameloop'],
    value: 'capsule',
  },
};
