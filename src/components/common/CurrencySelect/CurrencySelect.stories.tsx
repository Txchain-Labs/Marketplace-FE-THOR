import type { Meta, StoryObj } from '@storybook/react';

import CurrencySelect from './CurrencySelect';

const meta = {
  title: 'Capsule/CurrencySelect',
  component: CurrencySelect,
  tags: ['autodocs'],
} satisfies Meta<typeof CurrencySelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
  args: {},
};
