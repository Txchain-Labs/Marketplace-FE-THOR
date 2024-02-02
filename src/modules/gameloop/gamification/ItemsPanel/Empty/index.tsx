import React, { FC } from 'react';

import EmptyKeycards from './EmptyKeycards';
import EmptyCapsules from './EmptyCapsules';
import EmptyPerks from './EmptyPerks';

import { GamificationItemType } from '../../types';

interface EmptyProps {
  type: GamificationItemType;
}

const Empty: FC<EmptyProps> = ({ type }) => {
  return type === 'keycards' ? (
    <EmptyKeycards />
  ) : type === 'capsules' ? (
    <EmptyCapsules />
  ) : (
    <EmptyPerks />
  );
};

export default Empty;
