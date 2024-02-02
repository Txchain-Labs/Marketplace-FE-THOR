import { palette } from '../theme/palette';
export const profile_0000 = {
  'flexGrow': 1,
  'bgcolor': 'background.paper',
  'display': 'block',
  'flexWrap': { sm: 'inherit', miniMobile: 'wrap' },
  'p': 2,
  '& .MuiTabs-flexContainer': {
    alignItems: 'flex-start',
  },
  'minHeight': '100vh',
};
export const profile_nfts_artwork = {
  fontSize: { sm: '56px', miniMobile: '40px' },
  fontWeight: '700',
  color: '#1A1A1A',
  lineHeight: { sm: '85px', miniMobile: '61px' },
};
export const profile_mynfts_label = {
  fontSize: { sm: '18px', miniMobile: '18px' },
  fontWeight: { sm: '700' },
  color: '#000000',
  lineHeight: { sm: '27px', miniMobile: '27px' },
};
export const profile_mynfts_description = {
  fontSize: { sm: '18px', miniMobile: '12px' },
  fontWeight: { sm: '400', miniMobile: '300' },
  color: '#4C4C4C',
  width: { sm: '551px', miniMobile: '100%' },
  lineHeight: { sm: '27px', miniMobile: '18px' },
};
export const tabSectionStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
};

export const tabsStyle = {
  '& .MuiTabs-indicator': {
    backgroundColor: palette.primary.fire,
    height: 7,
  },
  'maxWidth': '100%',
  'width': '100%',
  '& .MuiTabs-scroller': {
    overflow: 'auto !important',
  },
};

export const tabStyle = {
  '& .MuiTab-root': {
    padding: '0px !important',
  },
};

export const profile_0001 = {
  mt: '15px',
  flexWrap: 'wrap',
  position: 'relative',
};

export const profile_0002 = {
  borderBottom: 1,
  borderColor: 'divider',
  width: '100%',
};
export const profile_003 = {
  display: 'flex',
  float: 'right',
  marginTop: '10px',
  // position: 'absolute',
  // right: 66,
  // bottom: 50,
};
export const menuButton = {
  paddingX: 0.7,
  paddingTop: 0.5,
  background: palette.primary.ash,
  right: 0,
  transition: '0s ease-in-out',
  position: 'absolute',
  color: 'black',
  opacity: 1,
};
export const menuButtonHide = {
  opacity: 0,
  position: 'absolute',
};

export const menu = {
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  right: 0,
  top: 37,
  boxShadow: '0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
  filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.3))',
};
export const menuItem = {
  'display': 'flex',
  'alignItems': 'center',
  'padding': '10px 12px',
  'background': palette.primary.ash,
  'gap': '16px',
  'borderBottom': `1px solid ${palette.secondary.storm[15]}`,
  '&:hover': {
    background: palette.accent.sky,
  },
};
export const menuItemIcon = {
  color: palette.primary.storm,
  // width: '18.41px',
  // height: '18.41px',
};
