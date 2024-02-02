import { createSvgIcon } from '@mui/material';
import React from 'react';

export const BuyAssets = createSvgIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 20 24"
    stroke="currentColor"
    fill="none"
  >
    <path
      d="M19 17.2734L10 22.3806L1 17.2734"
      // stroke="#1A1A1A"
      stroke-width="2"
      stroke-miterlimit="10"
      stroke-linejoin="round"
    />
    <path
      d="M19 12.0552L10 17.1624L1 12.0552"
      // stroke="#1A1A1A"
      stroke-width="2"
      stroke-miterlimit="10"
      stroke-linejoin="round"
    />
    <path
      d="M19 6.94811L10 12.0553L1 6.94811L10 1.61914L19 6.94811Z"
      // stroke="#1A1A1A"
      stroke-width="2"
      stroke-miterlimit="10"
      stroke-linejoin="round"
    />
  </svg>,
  'Buy Assets'
);
