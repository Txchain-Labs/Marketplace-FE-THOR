import {
  ButtonProps,
  Palette,
  PaletteColor,
  Theme,
  TypeText,
} from '@mui/material';
import { palette } from '@/theme/palette';
import { presetColors } from '@/themes/palette';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    contained_cut: true;
    outlined_light: true;
  }
}

const getBorderColor = (ownerState: any, theme: Theme) => {
  switch (ownerState.color) {
    case 'primary':
      return '#B63D2f';
    case 'secondary':
      return theme.palette.mode === 'light'
        ? presetColors.storm[90]
        : presetColors.storm[30];
    default:
      return 'black';
  }
};

const clipPathBase =
  'polygon(0 0, calc(100% - var(--s)) 0, 100% var(--s), 100% 100%, var(--s) 100%, 0% calc(100% - var(--s)), 0 0)';

const containedBase = ({
  ownerState,
  theme,
}: {
  ownerState: ButtonProps;
  theme: Theme;
}) => ({
  'backgroundColor': (
    theme.palette[ownerState.color as keyof Palette] as PaletteColor
  ).main,
  'color': (theme.palette[ownerState.color as keyof Palette] as PaletteColor)
    .contrastText,
  'borderBottom': 'var(--b) solid',
  'borderColor': getBorderColor(ownerState, theme),
  'boxShadow': theme.shadows[1],
  '&:hover': {
    backgroundColor: (
      theme.palette[ownerState.color as keyof Palette] as PaletteColor
    ).main,
    boxShadow: theme.shadows[2],
    clipPath: clipPathBase,
  },
  '&:focus': {
    boxShadow: theme.shadows[0],
  },
  '&:disabled': {
    border: 'none',
    backgroundColor: theme.palette.action.disabledBackground,
  },
});

export const MuiButton = {
  styleOverrides: {
    root: {
      '--s': '18px',
      '--b': '2px',
      'cursor': `url('/images/cursor-pointer.svg'), auto`,
      'textTransform': 'none' as const,
      'borderRadius': 0,
      '&.MuiButton-sizeSmall': {
        height: '37px',
      },
      '&.MuiButton-sizeMedium': {
        height: '45px',
        padding: '10.1px',
      },
      '&.MuiButton-sizeLarge': {
        height: '53px',
      },
    },
    contained: containedBase,
    contained_cut: ({
      ownerState,
      theme,
    }: {
      ownerState: ButtonProps;
      theme: Theme;
    }) => ({
      ...containedBase({ ownerState, theme }),
      clipPath: clipPathBase,
    }),
    outlined: ({
      ownerState,
      theme,
    }: {
      ownerState: ButtonProps;
      theme: Theme;
    }) => ({
      'borderWidth': 'var(--b) !important',
      'borderColor': (
        theme.palette[ownerState.color as keyof Palette] as PaletteColor
      ).main,
      'position': 'relative' as const,
      '&:hover': {
        'backgroundColor': 'transparent',
        'border': 'none',
        'clipPath': clipPathBase,
        '&:before': {
          'content': '""',
          'position': 'absolute',
          'inset': 0,
          'background': (
            theme.palette[ownerState.color as keyof Palette] as PaletteColor
          ).main,
          '--g1': '#000 var(--b), #0000 0 100%',
          '--g2':
            '#0000 calc(0.707 * var(--s)), #000 0 calc(0.707 * var(--s) + var(--b)),' +
            '#0000 0 calc(100% - 0.707 * var(--s) - var(--b)),' +
            '#000 0 calc(100% - 0.707 * var(--s)), #0000 0',
          'mask':
            'linear-gradient(45deg, var(--g2)),' +
            'linear-gradient(90deg, var(--g1)) 100% calc(100% - 1 * var(--s)) no-repeat,' +
            'linear-gradient(270deg, var(--g1)) 100% calc(100% + 1 * var(--s)) no-repeat,' +
            'linear-gradient(180deg, var(--g1)) calc(100% - 1 * var(--s)) 100% no-repeat,' +
            'linear-gradient(0deg, var(--g1)) calc(100% + 1 * var(--s)) 100% no-repeat',
        },
      },
    }),
    text: ({ theme }: { ownerState: ButtonProps; theme: Theme }) => ({
      'color': (theme.palette['text'] as TypeText).primary,
      '&:hover': {
        color: (theme.palette['primary'] as PaletteColor).main,
        backgroundColor: 'transparent',
      },
      '&:focus': {
        backgroundColor: 'transparent',
      },
    }),
    outlined_light: {
      '--s': '18px',
      '--b': '2px',
      'justifyContent': 'center',
      'alignItems': 'center',
      // 'maxWidth': '220px',
      'width': '100%',
      'minHeight': '45px',
      'background': 'none',
      'borderRadius': '0px',
      'textTransform': 'initial',
      'outline': `var(--b) solid ${palette.primary.ash}`,
      'outline-offset': 'calc(-1 * var(--b))',
      'color': palette.primary.ash,
      'position': 'relative',
      '&:hover': {
        outline: 0,
        clipPath: clipPathBase,
        transition: 'clip-path 1s',
        cursor: `url('/images/cursor-pointer.svg'), auto`,
      },
      '&:hover:before': {
        'content': '""',
        'position': 'absolute',
        'inset': 0,
        'background': palette.primary.ash,
        '--g1': '#000 var(--b), #0000 0 100%',
        '--g2':
          '#0000 calc(0.707 * var(--s)), #000 0 calc(0.707 * var(--s) + var(--b)),' +
          '#0000 0 calc(100% - 0.707 * var(--s) - var(--b)),' +
          '#000 0 calc(100% - 0.707 * var(--s)), #0000 0',
        'mask':
          'linear-gradient(45deg, var(--g2)),' +
          'linear-gradient(90deg, var(--g1)) 100% calc(100% - 1 * var(--s)) no-repeat,' +
          'linear-gradient(270deg, var(--g1)) 100% calc(100% + 1 * var(--s)) no-repeat,' +
          'linear-gradient(180deg, var(--g1)) calc(100% - 1 * var(--s)) 100% no-repeat,' +
          'linear-gradient(0deg, var(--g1)) calc(100% + 1 * var(--s)) 100% no-repeat',
      },
      '&:focus': {
        boxShadow: 'inset 0px -2px 0px rgba(0, 0, 0, 0.25)',
      },
      '&:disabled': {
        'background': 'none',
        'color': palette.secondary.storm[50],
        'outline': `2px solid ${palette.secondary.storm[50]}`,
        'outline-offset': '-2px',
      },
    },
  },
};
