import React from 'react';
import ActivateDriftNodes from '../../src/modules/gameloop/transform-nodes/ActivateDriftNodes';

const activateDriftNodesIndirect = () => {
  return (
    <div>
      <ActivateDriftNodes indirect={true} />
    </div>
  );
};

export default activateDriftNodesIndirect;
