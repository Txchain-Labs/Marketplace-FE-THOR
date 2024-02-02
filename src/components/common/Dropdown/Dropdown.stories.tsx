import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { action } from '@storybook/addon-actions';

import { Button } from '@mui/material';
import TocSharpIcon from '@mui/icons-material/TocSharp';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import DoneAllSharpIcon from '@mui/icons-material/DoneAllSharp';

import Dropdown from './Dropdown';

const meta = {
  title: 'Capsule/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const onMenuItemClickAction = action('onMenuItemClick');

export const Demo: Story = {
  args: {
    children: (
      <Button
        sx={{
          width: '130px',
          height: '48px',
          borderWidth: '0 1px 1px 0',
          borderStyle: 'solid',
          borderColor: '#808080',
          borderRadius: 0,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        Open Dropdown
      </Button>
    ),
    menuItems: [
      {
        key: 'View details',
        text: 'View details',
        icon: <TocSharpIcon />,
        onClick: () => onMenuItemClickAction('View details'),
      },
      {
        key: 'Edit price',
        text: 'Edit price',
        icon: <EditSharpIcon />,
        onClick: () => onMenuItemClickAction('Edit price'),
      },
      {
        key: 'Activate for 1 USDC.e',
        text: 'Activate for 1 USDC.e',
        icon: <DoneAllSharpIcon />,
        onClick: () => onMenuItemClickAction('Activate for 1 USDC.e'),
      },
    ],
  },
};

export const HasLink: Story = {
  args: {
    children: (
      <Button
        sx={{
          width: '130px',
          height: '48px',
          borderWidth: '0 1px 1px 0',
          borderStyle: 'solid',
          borderColor: '#808080',
          borderRadius: 0,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        Open Dropdown
      </Button>
    ),
    menuItems: [
      {
        key: 'View details',
        text: 'View details',
        icon: <TocSharpIcon />,
        link: 'https://capsule.gg',
      },
      {
        key: 'Edit price',
        text: 'Edit price',
        icon: <EditSharpIcon />,
        link: 'https://capsule.gg',
      },
      {
        key: 'Activate for 1 USDC.e',
        text: 'Activate for 1 USDC.e',
        icon: <DoneAllSharpIcon />,
        link: 'https://capsule.gg',
      },
    ],
  },
};
