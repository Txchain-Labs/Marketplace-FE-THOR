import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { Box, Slider } from '@mui/material';

const meta = {
  title: 'Capsule/Slider',
  component: Slider,
  tags: ['autodocs'],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
  decorators: [
    (Story) => (
      <Box p={'32px'}>
        <Story />
      </Box>
    ),
  ],
  args: {
    name: 'dueDate',
    valueLabelDisplay: 'auto',
    valueLabelFormat: (value) => `${value} days`,
    min: 0,
    max: 366,
    marks: [
      {
        value: 0,
        label: '',
      },
      {
        value: 7,
        label: '7',
      },
      {
        value: 30,
        label: '30',
      },
      {
        value: 90,
        label: '90',
      },
      {
        value: 366,
        label: '+365',
      },
    ],
  },
};
