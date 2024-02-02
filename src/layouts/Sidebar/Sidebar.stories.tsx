import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Sidebar from './Sidebar';

const meta = {
  title: 'Capsule/Sidebar',
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const SidebarWrapper = ({
  children,
}: {
  children: (args: {
    isExpanded: boolean;
    isSidebarHidden: boolean;

    setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSidebarHidden: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactElement;
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(smDown ? true : false);

  return children({
    isExpanded: isSidebarExpanded,
    isSidebarHidden: isSidebarHidden,
    setIsExpanded: setIsSidebarExpanded,
    setIsSidebarHidden: setIsSidebarHidden,
  });
};

export const Demo: Story = {
  render: () => (
    <SidebarWrapper>
      {({ isExpanded, isSidebarHidden, setIsExpanded, setIsSidebarHidden }) => (
        <Sidebar
          isExpanded={isExpanded}
          isSidebarHidden={isSidebarHidden}
          setIsExpanded={setIsExpanded}
          setIsSidebarHidden={setIsSidebarHidden}
        />
      )}
    </SidebarWrapper>
  ),
};
