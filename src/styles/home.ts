export const home_root = {
  backgroundImage: "url('/images/landing-bg.png')",
  height: { lg: '100vh', md: '100vh', sm: '100%', xs: '100%' },
  fontSize: '50px',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  overflowX: 'hidden',
};

export const home_imageContainer = {
  mr: 0,
  height: { xs: '470px', sm: '570px', md: '570px', lg: '690px' },
};

export const home_btnStyle = {
  width: '180px',
  height: '40px',
};

export const home_btnStyle2 = {
  'width': '180px',
  'background': 'transparent',
  'border': '1px solid #fff',
  'height': '40px',
  '&:hover': {
    background: 'transparent',
    border: '1px solid #fff',
  },
};

export const sidebar_menueStyle = {
  height: 'auto',
  background: ' rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.24)',
  transform: 'matrix(1, 0, 0, 1, 0, 0)',
  clipPath: 'polygon(0 0, 82% 0, 100% 18%, 100% 100%, 18% 100%, 0 82%)',
  marginTop: '42px',
  marginLeft: '88px',
  border: '3px solid rgba(245, 245, 245)',
};

export const sidebar_menueHover = {
  'display': 'flex',
  'marginBottom': '15px',
  '&:hover': {
    background: 'rgba(0, 0, 0, 0.04)',
  },
};

export const sidebar_menu_0001 = ({ view }: { view: number }) => ({
  'width': '100%',
  'ml': 1.5,
  'padding': '0 38px',
  'color': view === 1 ? '#F3523F' : 'black',
  'fontFamily': 'Nexa',
  'fontSize': '32px',
  'fontWeight': 700,
  'lineHeight': '49px',
  'letterSpacing': '0.02em',
  '&:hover': {
    background: 'transparent',
  },
});

export const sidebar_menu_0002 = ({ view }: { view: number }) => ({
  width: '6px',
  height: '49px',
  background: view === 2 ? '#F3523F' : 'transparent',
});

export const sidebar_menu_0003 = ({ view }: { view: number }) => ({
  'width': '100%',
  'ml': 1.5,
  'padding': '0 38px',
  'fontWeight': 'bold',
  'fontFamily': 'Nexa',
  'fontSize': '32px',
  'fontWeights': 700,
  'lineHeight': '49px',
  'letterSpacing': '0.02em',
  'color': view === 2 ? '#F3523F' : 'black',
  '&:hover': {
    background: 'transparent',
  },
  // '&.MuiButtonBase-root': {
  //     color: pathname === '/' ? '#fff' : 'black'
  // }
});

export const sidebar_menu_0004 = ({ view }: { view: number }) => ({
  width: '6px',
  height: '49px',
  background: view === 1 ? '#F3523F' : 'transparent',
});

export const sidebar_menu_0005 = ({ view }: { view: number }) => ({
  width: '6px',
  height: '49px',
  background: view === 3 ? '#F3523F' : 'transparent',
});

export const sidebar_menu_0006 = ({ view }: { view: number }) => ({
  'width': '100%',
  'ml': 1.5,
  'padding': '0 38px',
  'fontWeight': 'bold',
  'fontFamily': 'Nexa',
  'fontSize': '32px',
  'fontWeights': 700,
  'lineHeight': '49px',
  'letterSpacing': '0.02em',
  'color': view === 4 ? '#F3523F' : 'black',
  '&:hover': {
    background: 'transparent',
  },
});

export const sidebar_menu_0007 = ({ view }: { view: number }) => ({
  width: '6px',
  height: '49px',
  background: view === 4 ? '#F3523F' : 'transparent',
});

export const sidebar_menu_0008 = ({ view }: { view: number }) => ({
  'width': '100%',
  'ml': 1.5,
  'padding': '0 38px',
  'fontWeight': 'bold',
  'fontFamily': 'Nexa',
  'fontSize': '32px',
  'fontWeights': 700,
  'lineHeight': '49px',
  'letterSpacing': '0.02em',
  'color': view === 4 ? '#F3523F' : 'black',
  '&:hover': {
    background: 'transparent',
  },
});

export const sidebar_menu_0009 = ({ pathname }: any) => ({
  // border: `0.5px dashed ${pathname === '/' ? '#fff' : 'rgba(0, 0, 0, 0.72)'}`,
  border: `0.5px dashed ${
    pathname === '/' ? 'rgba(0, 0, 0, 0.72)' : 'rgba(0, 0, 0, 0.72)'
  }`,
  width: '208px',
  height: '1px',
  m: 'auto',
  marginTop: '20px',
  marginBottom: '30px',
});

export const sidebar_menu_0010 = () => ({
  'width': '100%',
  'ml': 1.5,
  'padding': '0 38px',
  '&:hover': {
    background: 'transparent',
  },
});

export const sidebar_menu_0011 = () => ({
  'width': '100%',
  'ml': 1.5,
  'padding': '0 44px',
  'fontFamily': 'Nexa',
  'fontSize': '19px',
  'fontWeight': 400,
  'lineHight': '29px',
  'color': 'rgba(0, 0, 0, 0.9)',
  '&:hover': {
    background: 'transparent',
  },
});

export const sidebar_menu_0012 = () => ({
  'width': '100%',
  'ml': 1.5,
  'padding': '0 44px',
  'fontFamily': 'Nexa',
  'fontSize': '19px',
  'fontWeight': 400,
  'lineHight': '29px',
  'color': 'rgba(0, 0, 0, 0.9)',
  '&:hover': {
    background: 'transparent',
  },
});

export const sidebar_menu_00013 = ({ view }: { view: number }) => ({
  width: '6px',
  height: '49px',
  background: view === 5 ? '#F3523F' : 'transparent',
});

export const sidebar_menu_00014 = ({ view }: { view: number }) => ({
  'width': '100%',
  'ml': 1.5,
  'padding': '0 38px',
  'color': view === 5 ? '#F3523F' : 'black',
  'fontFamily': 'Nexa',
  'fontSize': '32px',
  'fontWeight': 700,
  'lineHeight': '49px',
  'letterSpacing': '0.02em',
  '&:hover': {
    background: 'transparent',
  },
});
