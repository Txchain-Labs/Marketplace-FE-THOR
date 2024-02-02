export const typography = {
  'fontFamily': 'Nexa',

  'h1': {
    fontFamily: 'Nexa-Bold',
    fontSize: '56px',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: '100%',

    align: 'left',
    transform: 'capatalize',
  },
  'h2': {
    fontFamily: 'Nexa-Bold',
    fontSize: '48px',
    lineHeight: '100%',
  },

  'h3': {
    fontFamily: 'Nexa-Bold',
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
    fontFamily: 'Nexa-Bold',
    fontSize: '14px',
    fontWeight: 400,
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
    fontWeight: 700,
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
    fontFamily: 'Nexa-Bold',

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
    fontFamily: 'Nexa-Bold',

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
    fontFamily: 'Nexa-Bold',

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
  'p-smd': {
    fontFamily: 'Nexa-Bold',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '100%',
    display: 'block',
  },

  'lbl-lg': {
    fontFamily: 'Nexa-Bold',

    fontSize: '18px',
    lineHeight: '100%',
    display: 'block',
  },
  'lbl-md': {
    fontFamily: 'Nexa-Bold',
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
    fontFamily: 'Nexa-Bold',

    fontSize: '140px',
    lineHeight: '108%',
    display: 'block',
  },
  'sm-dsp': {
    fontFamily: 'Nexa-Bold',

    fontSize: '56px',
    lineHeight: '132%',
    display: 'block',
  },
  'badge': {
    fontFamily: 'Nexa-Bold',
    fontSize: '10px',
    lineHeight: '15px',
    textTransform: 'uppercase',
  },
};

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    'p-sm': true;
    'p-smd': true;
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
