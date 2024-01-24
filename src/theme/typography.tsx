export const typography = {
  'fontFamily': 'Nexa',

  'h1': {
    fontFamily: 'Nexa',
    fontWeight: 700,
    fontSize: '56px',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: '100%',

    align: 'left',
    transform: 'capatalize',
  },
  'h2': {
    fontFamily: 'Nexa',
    fontWeight: 700,
    fontSize: '48px',
    lineHeight: '100%',
  },

  'h3': {
    fontFamily: 'Nexa',
    fontWeight: 700,
    fontSize: '40px',
    lineHeight: '100%',
  },
  'h3-bk': {
    fontFamily: 'Nexa',
    fontWeight: 400,
    fontSize: '40px',
    lineHeight: '100%',
  },
  'h4': {
    fontFamily: 'Nexa',
    fontWeight: 400,
    fontSize: '32px',
    lineHeight: '100%',
  },
  'h5': {
    fontFamily: 'Nexa',
    fontWeight: 400,
    fontSize: '24px',
    lineHeight: '100%',
  },
  'h6': {
    fontFamily: 'Nexa',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '100%',
  },
  'subtitle1': {
    fontFamily: 'Nexa',
    fontSize: '16px',
    fontWeight: 400,
    fontStretch: 'normal',
    fontStyle: 'normal',
    letterSpacing: '0.05em',
  },
  'subtitle2': {
    fontFamily: 'Nexa',
    fontWeight: 'normal',
    fontSize: '15px',
    letterSpacing: '0.05em',
    lineHeight: 1.62,
  },
  'body1': {
    fontFamily: 'Nexa',
    fontSize: '14px',
    fontWeight: 500,
  },
  'body2': {
    fontFamily: 'Nexa',

    fontSize: '12px',
    letterSpacing: '-0.04px',
    lineHeight: '18px',
  },
  'button': {
    fontFamily: 'Nexa',

    fontSize: '14px',
  },
  'caption': {
    fontFamily: 'Nexa',

    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '14.52px',
  },
  'overline': {
    fontFamily: 'Nexa',

    fontSize: '11px',
    fontWeight: 400,
    letterSpacing: '0.05em',
  },
  'sub-h': {
    fontFamily: 'Nexa',

    fontWeight: 700,
    fontSize: '24px',
    lineHeight: '132%',
    display: 'block',
  },
  'sub-h-bk': {
    fontFamily: 'Nexa',
    fontWeight: 400,
    fontSize: '24px',
    lineHeight: '132%',
    display: 'block',
  },
  'p-lg': {
    fontFamily: 'Nexa',

    fontWeight: 700,
    fontSize: '18px',
    lineHeight: '100%',
    display: 'block',
  },

  'p-lg-bk': {
    fontFamily: 'Nexa',

    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '100%',
    display: 'block',
  },
  'p-md': {
    fontFamily: 'Nexa',

    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '100%',
    display: 'block',
  },
  'p-md-bk': {
    fontFamily: 'Nexa',

    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '100%',
    display: 'block',
  },
  'p-sm': {
    fontFamily: 'Nexa',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '100%',
    display: 'block',
  },

  'lbl-lg': {
    fontFamily: 'Nexa',

    fontWeight: 700,
    fontSize: '18px',
    lineHeight: '100%',
    display: 'block',
  },
  'lbl-md': {
    fontFamily: 'Nexa',
    fontWeight: 700,
    fontSize: '14px',
    lineHeight: '100%',
    display: 'block',
  },
  'lbl-sm': {
    fontFamily: 'Nexa',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '100%',
    display: 'block',
  },

  'lg-dsp': {
    fontFamily: 'Nexa',

    fontWeight: 700,
    fontSize: '140px',
    lineHeight: '108%',
    display: 'block',
  },
  'sm-dsp': {
    fontFamily: 'Nexa',

    fontWeight: 700,
    fontSize: '56px',
    lineHeight: '132%',
    display: 'block',
  },
  'badge': {
    fontFamily: 'Nexa',
    fontWeight: 700,
    fontSize: '10px',
    lineHeight: '15px',
    textTransform: 'uppercase',
  },
};
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    'p-sm': true;
    'p-md': true;
    'p-lg': true;
    'lbl-sm': true;
    'lbl-md': true;
    'lbl-lg': true;
    'lg-dsp': true;
    'sm-dsp': true;
    'sub-h': true;
    'p-lg-bk': true;
    'p-md-bk': true;
    'sub-h-bk': true;
    'h3-bk': true;
    'badge': true;
  }
}

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    miniMobile: true;
  }
}
