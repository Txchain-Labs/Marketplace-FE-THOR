import React from 'react';
import { createSvgIcon, useTheme } from '@mui/material';

const TractSvg = () => {
  const theme = useTheme();

  return (
    <svg
      width="19"
      height="26"
      viewBox="0 0 19 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="16"
        height="24"
        transform="translate(2.07422 2)"
        fill="white"
      />
      <path
        d="M2.57422 6.20711L6.28133 2.5H17.5742V25.5H2.57422V6.20711Z"
        stroke="black"
      />
      <path
        d="M16.1406 0H4.14062L0.140625 4V24H16.1406V0Z"
        fill={theme.palette.text.primary}
        stroke="black"
      />
      <path
        d="M7.77063 8.5C8.49063 8.5 9.12063 8.64333 9.66063 8.93C10.2073 9.21667 10.6273 9.62667 10.9206 10.16C11.2206 10.6867 11.3706 11.3 11.3706 12C11.3706 12.7 11.2206 13.3167 10.9206 13.85C10.6273 14.3767 10.2073 14.7833 9.66063 15.07C9.12063 15.3567 8.49063 15.5 7.77063 15.5H4.90063V8.5H7.77063ZM7.77063 14.07C8.35729 14.07 8.83063 13.8833 9.19062 13.51C9.55063 13.1367 9.73063 12.6333 9.73063 12C9.73063 11.58 9.64729 11.2167 9.48063 10.91C9.32063 10.5967 9.09063 10.3567 8.79063 10.19C8.49729 10.0167 8.15729 9.93 7.77063 9.93H6.54063V14.07H7.77063Z"
        fill={theme.palette.background.default}
      />
    </svg>
  );
};

const Tract2001 = createSvgIcon(<TractSvg />, 'Perks 2001');

export default Tract2001;
