import React from 'react';
import ConnectingLoader from '../src/components/common/ConnectingLoader';

const loader = () => {
  return (
    <div>
      <ConnectingLoader size={undefined} height={800} />
    </div>
  );
};

export default loader;
