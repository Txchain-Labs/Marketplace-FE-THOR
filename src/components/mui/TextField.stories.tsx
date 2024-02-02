import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Box, TextField } from '@mui/material';

const meta = {
  title: 'Capsule/TextField',
  component: TextField,
  tags: ['autodocs'],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Box>
      <TextField variant={'standard'} placeholder={'Label text(empty)'} />
    </Box>
  ),
};

export const Filled: Story = {
  render: () => (
    <Box>
      <TextField
        variant={'standard'}
        placeholder={'Label text(empty)'}
        value={'0.696'}
      />
    </Box>
  ),
};
