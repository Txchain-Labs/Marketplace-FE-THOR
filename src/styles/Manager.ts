export const nodesTypesWrapper = {
  display: 'flex',
  flexWrap: 'no-wrap',
  gap: { sm: '20px', miniMobile: '10px' },
  width: '100%',
  overflowX: { sm: 'auto', miniMobile: 'scroll' },
};
export const nodesWrapper = {
  display: 'flex',
  flexWrap: 'no-wrap',
  gap: { sm: '20px', miniMobile: '10px' },
};

export const nodeWrapper = (currentActive: boolean) => {
  return {
    width: { md: '122px', miniMobile: '75px' },
    height: { md: '122px', miniMobile: '75px' },
    padding: currentActive ? '4px' : '0px',
    clipPath: currentActive
      ? 'polygon( 30% 0%, 80% 0, 100% 20%, 100% 100%, 70% 100%, 100% 100%, 0 100%, 0 0) !important'
      : '',
    bgcolor: currentActive ? 'primary.main' : 'auto',
    overflow: 'hidden',
    position: 'relative',
    cursor: `url("/images/cursor-pointer.svg"), auto`,
  };
};

export const nodeTitle = (typeActive: boolean) => {
  return {
    fontSize: '16px',
    lineHeight: '26px',
    fontWeight: 600,
    letterSpacing: '0.16em',
    fontFamily: 'Nexa-Bold',
    color: typeActive ? 'text.primary' : 'action.disabled',
    opacity: typeActive ? 1 : 0.7,
    height: '30px',
  };
};

export const node = (
  // typeActive: boolean,
  currentActive: boolean,
  enable: boolean,
  bgImage: string,
  hoverBgImage: string
) => {
  return {
    // simple style
    'width': '100%',
    'height': '100%',
    'backgroundImage': currentActive
      ? `url(${hoverBgImage})`
      : `url(${bgImage})`,
    'opacity': enable ? 1 : 0.4,
    'backgroundSize': 'cover',

    //simple hover
    '&:hover': {
      backgroundImage: `url(${hoverBgImage})`,
      opacity: 1,
    },

    // active style
    'top': currentActive ? '50%' : 'auto',
    'left': currentActive ? '50%' : 'auto',
    'clipPath': currentActive
      ? 'polygon( 30% 0%, 80% 0, 100% 20%, 100% 100%, 70% 100%, 100% 100%, 0 100%, 0 0) !important'
      : '',
    // transform: 'translate(-50%, -50%)',
  };
};

export const activeNodeText = (currentActive: boolean) => {
  return {
    position: 'absolute',
    bottom: -1,
    left: 4,
    right: 0,
    bgcolor: 'primary.main',
    color: 'accent.main',
    opacity: currentActive ? 1 : 0,
    transition: 'opacity 1s ease',
    padding: { md: '8px 10px', miniMobile: '1px 8px' },
  };
};

export const profile_0000 = {
  'flexGrow': 1,
  'bgcolor': 'background.paper',

  'display': 'flex',
  'flexWrap': { sm: 'inherit', miniMobile: 'wrap' },
  'pt': 10,
  '& .MuiTabs-flexContainer': {
    alignItems: 'flex-start',
  },
  'minHeight': '100vh',
};

export const tabSectionStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
};

export const tabsStyle = {
  '& .MuiTab-root': {
    margin: {
      sm: '0px 20px 8px 0px !important',
      miniMobile: '0px 0px 10px 0px !important',
    },
  },
  '& .MuiTabs-indicator': {
    bgcolor: 'primary.main',
    height: 7,
  },
  'maxWidth': '100%',
  'width': '100%',
  '& .MuiTabs-scroller': {
    overflow: 'auto !important',
  },
};

export const tabStyle = {
  color: 'black !important',
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: 18,
  letterSpacing: '0.02em',
  textTransform: 'capitalize',
  minHeight: '26px',
  padding: '0px',
  margin: '0px 20px 45px 0px',
};

export const profile_0001 = {
  mt: { sm: '20px', miniMobile: '23px' },
  flexWrap: 'wrap',
  position: 'relative',
};

export const profile_0002 = {
  borderBottom: '3px solid #D9D9D9',

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
