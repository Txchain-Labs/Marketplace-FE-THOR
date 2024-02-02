export const activeBidsRoot = {
  width: '101%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  background: '#fff',
};

export const showOptions = {
  paddingX: 0.7,
  paddingTop: 0.5,
  background: 'black',
  right: 0,
  opacity: 1,
  transition: '0s ease-in-out',
  position: 'absolute',
};
export const hideOptions = {
  opacity: 0,
  position: 'absolute',
};

export const cardWrapper = {
  height: 'var(--nft-item-width--profile-page)',
  minHeight: '248px',
  width: 'var(--nft-item-width--profile-page)',
  minWidth: '248px',
};

export const cardstyle = (bg_image: string) => {
  return {
    'position': 'relative',
    'cursor': `url("/images/cursor-pointer.svg"), auto`,
    'background': 'inherit',
    'borderRadius': '0px',
    'padding': 0,
    'transition': 'transform .2s',
    '&:hover': {
      'transform': 'scale(1.05)',
      'transition': 'transform .2s',
      'boxShadow': '0px 0px 44px 0px rgba(0, 0, 0, 0.55)',
      'zIndex': 10001,
      '&$btnWrapper': {
        opacity: 1,
      },
    },
    '&::before': {
      content: '""',
      backgroundImage: `url(${bg_image})`,
      backgroundSize: 'cover',
      position: 'absolute',
      top: '0px',
      right: '0px',
      left: '0px',
      bottom: '0px',
      opacity: '0.4',
    },
  };
};

export const cardHover = {
  animationName: 'blurnftanimation',
  animationDuration: '3s', //transition: 'filter 5s'
  filter: 'brightness(50%)',
};
