import type { Meta, StoryObj } from '@storybook/react';

import { action } from '@storybook/addon-actions';

import { Divider, Stack, Typography } from '@mui/material';
import { Button } from './components';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    contained_cut: true;
    outlined_light: true;
  }
}

const meta = {
  title: 'Capsule/Button',
  component: Button,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
  args: {
    children: 'Disconnect wallet',
    size: 'large',
    variant: 'contained',
    onClick: action('clicked'),
  },
};

const ButtonsContainer = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <Stack>
    <Typography noWrap>{label}</Typography>
    <Divider sx={{ mt: '8px', mb: '20px' }} />
    <Stack gap={'16px'} width={'291px'}>
      {children}
    </Stack>
  </Stack>
);

export const AllVariants: Story = {
  args: {
    children: 'Disconnect wallet',
    onClick: action('clicked'),
  },
  render: ({ children, onClick }) => (
    <Stack gap={'32px'}>
      <ButtonsContainer
        label={'High emphasis (Primary actions) /Filled button'}
      >
        <Button
          onClick={onClick}
          variant={'contained'}
          fullWidth
          color={'primary'}
        >
          {children}
        </Button>
        <Button
          onClick={onClick}
          variant={'contained'}
          fullWidth
          color={'primary'}
          disabled
        >
          {children}
        </Button>
      </ButtonsContainer>

      <ButtonsContainer
        label={'Medium emphasis (Secondary actions) /Filled button'}
      >
        <Button
          onClick={onClick}
          variant={'contained'}
          fullWidth
          color={'secondary'}
        >
          {children}
        </Button>
        <Button
          onClick={onClick}
          variant={'contained'}
          fullWidth
          color={'secondary'}
          disabled
        >
          {children}
        </Button>
      </ButtonsContainer>

      <ButtonsContainer
        label={'Low emphasis (Terciary actions) /Outlined button'}
      >
        <Button onClick={onClick} variant={'outlined'} color={'secondary'}>
          {children}
        </Button>
        <Button
          onClick={onClick}
          variant={'outlined'}
          color={'secondary'}
          disabled
        >
          {children}
        </Button>
      </ButtonsContainer>

      <ButtonsContainer label={'Very Low emphasis /Text button'}>
        <Button onClick={onClick} variant={'text'} disableRipple>
          {children}
        </Button>
        <Button onClick={onClick} variant={'text'} disableRipple disabled>
          {children}
        </Button>
      </ButtonsContainer>
    </Stack>
  ),
};
