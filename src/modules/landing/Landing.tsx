import { Box, Button, Grid, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import ConnectingLoader from '../../components/common/ConnectingLoader';
import { useSetAttribute } from '../../hooks/uiHooks';

const root = {
  backgroundImage: "url('/images/landing-bg.png---')",
  // height: { lg: '100vh', md: '100vh', sm: '100%', xs: '100%' },
  // height: { lg: '100%', md: '100%', sm: '100%', xs: '100%' },
  p: { miniMobile: '0px', xs: '0px', sm: '0px', md: '0px', lg: '0px' },
  overflow: 'hidden',
  // padding: {
  //   '@media (max-width: 601px)': {
  //     padding: '24px',
  //   },
  // },
  fontSize: '50px',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  // overflow: 'hidden',
};

const optionIconBuf = ['gamefi', 'collecting', 'creating'];

const optionDescriptionBuf = [
  'Initiate GameLoop by transforming your nodes into Keycard NFTs and fuse them into Capsule NFTs to unlock exclusive perks.',
  'Collect and trade the finest digital art and connect with others on a seamlessly innovative marketplace.',
  'Apply to become a creator for Capsule and share your original work with the world.',
];

const optionButBuf = ['Go to GameLoop', 'Explore Now', 'Become a Creator'];

const btn = {
  'width': '220px',
  'height': '54px',
  'boxShadow': 'inset rgba(0, 0, 0, 0.25) 0px -3px 0px',
  '&:hover': {
    'clipPath':
      'polygon(0 0, 92.5% 0, 100% 30%, 100% 100%, 7.5% 100%, 0% 70%, 0 0)',
    'transition': ' clip-path 1s',
    'zIndex': 10001,
    '&$btnWrapper': {
      opacity: 1,
    },
  },
  '&:active': {
    boxShadow: 'inset rgba(0, 0, 0, 0.25) 0px 5px 0px',
  },
  'fontSize': '18px',
  'fontWeight': '700',
  'lineHeight': '1.5',
};
const View_Litepaper_btn = {
  'width': '220px',
  'height': '54px',
  'boxShadow': 'inset rgba(0, 0, 0, 0.25) 0px -3px 0px',
  '&:hover': {
    'clipPath':
      'polygon(0 0, 92.5% 0, 100% 30%, 100% 100%, 7.5% 100%, 0% 70%, 0 0)',
    'transition': ' clip-path 1s',
    'zIndex': 10001,
    '&$btnWrapper': {
      opacity: 1,
    },
  },
  '&:active': {
    boxShadow: 'inset rgba(0, 0, 0, 0.25) 0px 5px 0px',
  },
  'zIndex': '100',
  'fontSize': '18px',
  'fontWeight': '700',
  'lineHeight': '1.5',
  'mt': { miniMobile: '50px', sx: '50px' },
  '@media (max-width: 601px) and (min-width: 390px)': {
    marginTop: '128px',
    marginLeft: '-84px',
  },
};
const collection_btn = {
  'width': '220px',
  'height': '54px',
  'boxShadow': 'inset rgba(0, 0, 0, 0.25) 0px -3px 0px',
  '&:hover': {
    'clipPath':
      'polygon(0 0, 92.5% 0, 100% 30%, 100% 100%, 7.5% 100%, 0% 70%, 0 0)',
    'transition': ' clip-path 1s',
    'zIndex': 10001,
    '&$btnWrapper': {
      opacity: 1,
    },
  },
  '&:active': {
    boxShadow: 'inset rgba(0, 0, 0, 0.25) 0px 5px 0px',
  },
  'fontSize': '18px',
  'fontWeight': '700',
  'lineHeight': '1.5',
  'mt': { miniMobile: '50px', sx: '50px' },
  '@media (max-width: 601px) and (min-width: 401px)': {
    marginTop: '128px',
  },
};

const outside = {
  position: 'relative',
  width: '90%',
  height: {
    xs: '450px',
    sm: '507px',
    md: '507px',
    lg: '507px',
    miniMobile: '450px',
  },
  background: 'black',
  clipPath: 'polygon(50% 0%, 88% 0, 100% 12%, 100% 100%, 12% 100%, 0 88%, 0 0)',
  margin: { miniMobile: '0 5%', xs: '0 5%', sm: '0 5%', md: '0', lg: '0' },
};

const inside = {
  position: 'absolute',
  top: '1px',
  left: '1px',
  right: '1px',
  bottom: '1px',
  background: '#F4F6F8',
  clipPath: 'polygon(50% 0%, 88% 0, 100% 12%, 100% 100%, 12% 100%, 0 88%, 0 0)',
};

const bottom_collection_btn = {
  'margin': '24px 0 0 0',
  'width': '220px',
  'height': '54px',
  'boxShadow': 'inset rgba(0, 0, 0, 0.25) 0px -3px 0px',
  '&:hover': {
    'clipPath':
      'polygon(0 0, 92.5% 0, 100% 30%, 100% 100%, 7.5% 100%, 0% 70%, 0 0)',
    'transition': ' clip-path 1s',
    'zIndex': 10001,
    '&$btnWrapper': {
      opacity: 1,
    },
  },
  '&:active': {
    boxShadow: 'inset rgba(0, 0, 0, 0.25) 0px 5px 0px',
  },
  'fontSize': '18px',
  'fontWeight': '700',
  'lineHeight': '1.5',
};

const bottom_example_text = {
  margin: '10px 0 0 0',
};

const leftOptions = {
  width: { md: '805px' },
  display: 'block',
  float: 'right',
  padding: '0 0 24px 0',
  left: { md: '273px' },
  position: 'relative',
};

const top_grid = {
  height: { xs: '840px', sm: '840px', md: '640px', lg: '840px' },
};

const left_welcome_text = {
  //position: 'absolute',
  fontSize: { xs: '75px !important', sm: '120px', md: '120px', lg: '120px' },
  fontFamily: 'Nexa',
  lineHeight: '108%',
  // margin-left: 93px;
  // margin-top: -8px;
  ml: {
    miniMobile: '30px',
    xs: '40px',
    sm: '80px',
    md: '80px',
    lg: '100px',
  },
  mt: { miniMobile: '65px' },
};

const normal_grid = {
  'height': { xs: '540px', sm: '900px', md: '740px', lg: '740px' },
  '@media (max-width: 390px)': {
    marginTop: '150px',
  },
  'justifyContent': 'center',
};
const view_litepaper = {
  marginTop: {
    miniMobile: '80px',
    xs: '60px',
    sm: '0px',
    md: '0px',
    lg: '0px',
  },
};
const normal_grid_last = {
  height: { xs: '600px', sm: '830px', md: '740px', lg: '740px' },
  marginTop: { xs: '0px', sm: '0px', md: '0px', lg: '150px' },
  p: { miniMobile: '25px' },
};

const top_welcome = {
  'position': 'absolute',
  'pl': { xs: 12, sm: 22, md: 22, lg: 23 },
  'pr': { xs: 0, sm: 0, md: 0, lg: '50px' },
  '@media (max-width: 640px) and (min-width:390px)': {
    marginTop: '-270px',
  },
};

const left_welcome = {
  margin: { xs: '0', sm: '0 0 0 116px', md: '0 0 0 116px', lg: '0 0 0 116px' },
  padding: '74px 0',
  m: { miniMobile: '0px 24px', xs: '0px', sm: '0px', md: '0px', lg: '0px' },
};

const left_logo = {
  position: 'absolute',
  margin: {
    xs: '0 0 -30px 7%',
    sm: '0 0 0px 30px',
    md: '0 0 0px 60px',
    lg: '0 0 -60px 50px',
  },
};

const top_right_background = {
  width: { miniMobile: '95%' },
  fload: { miniMobile: 'right' },
  ml: { miniMobile: 'auto', xs: '28px' },
  mr: { miniMobile: '0px' },
  mt: {
    miniMobile: '-100px',
    xs: '-370px',
    sm: '-134px',
    md: '61px',
    lg: '61px',
  },
};

const three_circles = {
  position: ' absolute',

  ml: { miniMobile: '232px', lg: 35, md: 31, xs: 29 },
  mt: { miniMobile: '0px', xs: '0px', md: -8 },
  display: { miniMobile: 'none' },
  // '@media (min-width: 601px)': {
  //   margin: '105px',
  // },
  // '@media (max-width: 601px)': {
  //   marginTop: '-100px',
  //   marginLeft: '225px',
  // },
};

const game_fi = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: { xs: 'center' },
  padding: { xs: '0', sm: '0 20px', md: '0px 100px', lg: '0px 100px' },
  margin: {
    xs: '-150px 0 0 0',
    sm: '100px 0 0 0',
    md: '100px 0 0 0',
    lg: '100px 0 0 0',
  },
  // '@media (max-width: 640px) and (min-width:390px)': {
  //   marginTop: '-230px',
  // },
};

// const ty_hover = {
//   'textDecoration': 'none',
//   '&:hover': {
//     textDecoration: 'underline',
//     color: '#777',
//   },
// };

const collections_card = {
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: { xs: '30px', sm: '0px', md: '0px', lg: '0px' },
};

const rectangle_border = {
  width: '100%',
  height: '100%',
  // ml: { xs: '40px', sm: '0px', md: '0px', lg: '0px' },
};

const card_padding = {
  padding: {
    miniMobile: '25px',
    xs: '25px',
    sm: '96px 108px 108px 108px',
    md: '96px 108px 108px 108px',
    lg: '96px 108px 108px 108px',
  },
};

const bottom_example_svgs = {
  width: { xs: '90%', sm: '100%', md: '400px', lg: '500px' },
  height: {
    miniMobile: '329px',
    xs: '350px',
    sm: '500px',
    md: '500px',
    lg: '500px',
  },
  marginLeft: { xs: '5%', sm: '0', md: 'auto', lg: 'auto' },
  marginRight: { xs: '5%', sm: '0', md: 'auto', lg: 'auto' },
  padding: { md: '20px' },
  position: 'relative',
};

const first_collection = {
  width: '288px',
  borderTop: '1px solid black',
  marginLeft: { xs: 8, sm: '0', md: '0', lg: '0' },
};

const collection = {
  margin: '88px 0 0 0',
  width: '288px',
  borderTop: '1px solid black',
  marginLeft: { xs: 8, sm: '0', md: '0', lg: '0' },
};

const text_collection = {
  'padding-top': '32px',
};

const small_text_collection = {
  'padding-top': '8px',
};

const left_wide_circle = {
  margin: {
    miniMobile: '0 0px 0 0px',
    xs: '0 0 0 0',
    sm: '0 0 0 0',
    md: '0 0px 0 0',
    lg: '0 100px 0 0',
  },
  width: {
    miniMobile: '90%',
  },
  position: 'relative',
};

const bottom_examples = {
  width: '100%',
  textAlign: 'center',
  position: 'relative',
};

const view_lightpaper = {
  // cursor: `url("/images/cursor-pointer.svg"), auto`,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { miniMobile: '80%' },
  // 'left': { miniMobile: '20px', xs: '20px', sm: '0px', md: '0px', lg: '3%' },
  // 'position': 'absolute',
  // 'textAlign': 'center',
  // 'width': { sm: '100%', md: '100%', lg: '85%' },
  // // top: '55px', left: '20px'
  // '@media (max-width: 320px)': {
  //   top: '39px',
  // },
};

const Landing = () => {
  const { loading } = useSelector((state: any) => state.auth);
  console.log(loading);
  const [optionIndex, setOptionIndex] = React.useState(1);
  const capsuleLandingTitleRef = useSetAttribute([
    { key: 'id', value: 'landing-capsule-title' },
    { key: 'dusk', value: 'landing-capsule-title' },
  ]);

  return (
    <>
      {loading ? (
        <ConnectingLoader size={undefined} />
      ) : (
        <Box sx={root}>
          <Grid container sx={top_grid}>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              sx={{
                zIndex: 10,
                /* to put this grid over the next sibling grid */
              }}
            >
              <Box sx={left_welcome}>
                <Box sx={left_logo}>
                  <img src="/images/top_left_logo.svg" height="100%" />
                </Box>
                <Box ref={capsuleLandingTitleRef} sx={left_welcome_text}>
                  <Typography
                    variant="h1"
                    color="#000"
                    fontFamily="Nexa"
                    lineHeight="108%"
                    sx={{
                      fontSize: {
                        xs: '50px !important',
                        sm: '90px !important',
                        md: '100px !important',
                        lg: '120px !important',
                      },
                    }}
                  >
                    Welcome
                    <br /> to Capsule
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Box sx={top_welcome}>
                <Typography
                  variant="h1"
                  fontSize={18}
                  color="rgba(0, 0, 0, 1)"
                  fontWeight={300}
                  // margin-top: 89px;
                  // margin-left: 45px
                  sx={{
                    'm': {
                      miniMobile: '7px 0px 0px 80px',
                      xs: '0px 0px 0px 0px !important',
                      sm: '36px 0px 0px 0px !important',
                      md: '165px 0px 0px 0px !important',
                      lg: '270px 0px 0px 0px !important',
                    },
                    '@media (max-width: 320px)': {
                      mt: '-13px',
                    },
                  }}
                  fontFamily="Nexa"
                  lineHeight="164%"
                >
                  A gamified NFT marketplace <br />
                  setting the new standard for digital creativity
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    mt: { miniMobile: 7, xs: 7, sm: 0, md: 0, lg: 0 },
                    justifyContent: { miniMobile: 'center' },
                  }}
                >
                  <Link href="https://docs.capsule.gg">
                    <a
                      target="_blank"
                      rel="noreferrer noopener"
                      href="https://docs.capsule.gg"
                    >
                      <Button
                        variant={'contained'}
                        fullWidth
                        sx={{
                          ...View_Litepaper_btn,
                          clipPath: 'none !important',
                        }}
                      >
                        View Litepaper
                      </Button>
                    </a>
                  </Link>
                </Stack>
                <Box sx={three_circles}>
                  <img src="/images/three_circles.svg" height="100%" />
                </Box>
              </Box>
              <Box sx={top_right_background}>
                <img src="/images/circle_wide.png" width="100%" />
              </Box>
            </Grid>
          </Grid>

          <Grid container sx={normal_grid}>
            <Grid xs={12} sm={12} md={5} lg={4} sx={game_fi}>
              <Box sx={leftOptions} onClick={() => setOptionIndex(0)}>
                <Typography
                  variant="h1"
                  fontSize={56}
                  fontFamily="Nexa-Bold"
                  sx={{
                    color:
                      optionIndex === 0
                        ? '#F3523F !important'
                        : '#000 !important',
                  }}
                >
                  GameFi
                </Typography>
              </Box>
              <Box sx={leftOptions} onClick={() => setOptionIndex(1)}>
                <Typography
                  variant="h1"
                  color="#000"
                  fontSize={56}
                  fontFamily="Nexa-Bold"
                  sx={{
                    color:
                      optionIndex === 1
                        ? '#F3523F !important'
                        : '#000 !important',
                  }}
                >
                  Collecting
                </Typography>
              </Box>
              <Box sx={leftOptions} onClick={() => setOptionIndex(2)}>
                <Typography
                  variant="h1"
                  color="#000"
                  fontSize={56}
                  fontFamily="Nexa-Bold"
                  sx={{
                    color:
                      optionIndex === 2
                        ? '#F3523F !important'
                        : '#000 !important',
                  }}
                >
                  Creating
                </Typography>
              </Box>
            </Grid>

            <Grid xs={12} sm={12} md={6} lg={6} sx={rectangle_border}>
              <Box sx={outside}>
                <Box sx={inside}>
                  <Box sx={card_padding}>
                    <Box>
                      <img
                        src={'/images/' + optionIconBuf[optionIndex] + '.svg'}
                        height="56px"
                        width="56px"
                      />
                    </Box>
                    <Box
                      sx={{ p: { miniMobile: 2, xs: 2, sm: 2, md: 1, lg: 1 } }}
                    >
                      <Typography
                        variant="h1"
                        fontSize={18}
                        color="rgba(0, 0, 0, 1)"
                        fontWeight="300"
                        lineHeight="156%"
                        fontFamily="Nexa"
                      >
                        {optionDescriptionBuf[optionIndex]}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                      <Link
                        href={
                          optionIndex === 0
                            ? '/gameloop'
                            : optionIndex === 1
                            ? '/explore'
                            : '/about'
                        }
                      >
                        <Button
                          variant={'contained'}
                          sx={{ ...btn, clipPath: 'none !important' }}
                          disabled={optionIndex === 2}
                        >
                          {optionIndex !== 2
                            ? optionButBuf[optionIndex]
                            : 'Coming Soon'}
                        </Button>
                      </Link>
                    </Stack>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Grid container sx={view_litepaper}>
            <Grid xs={12} sm={12} md={6} lg={7}>
              <Link
                //href="https://docs.thorfi.io/project-information/overview"
                href="/manager/capsules"
                style={{ cursor: `url("/images/cursor-pointer.svg"), auto` }}
              >
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  //href="https://docs.thorfi.io/project-information/overview"
                  href="/manager/capsules"
                >
                  <Box
                    sx={left_wide_circle}
                    style={{
                      cursor: `url("/images/cursor-pointer.svg"), auto`,
                    }}
                  >
                    <img
                      src="/images/circle_background.png"
                      width="100%"
                      style={{
                        cursor: `url("/images/cursor-pointer.svg"), auto`,
                      }}
                    />
                    <Box
                      sx={view_lightpaper}
                      style={{
                        cursor: `url("/images/cursor-pointer.svg"), auto`,
                      }}
                    >
                      <svg
                        width="580"
                        height="350"
                        viewBox="0 0 290 175"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_1_884)">
                          <path
                            d="M8.73545 60.2654H0.223374V22.9675L22.9706 0.220215H60.3486V6.72944"
                            stroke="#F3523F"
                            stroke-miterlimit="10"
                          />
                          <path
                            d="M68.8604 6.73462V19.9383H36.9501L21.9388 34.9496V66.7748H8.73009V29.4819L31.4824 6.73462H68.8604Z"
                            stroke="#F3523F"
                            stroke-miterlimit="10"
                          />
                          <path
                            d="M68.8604 6.73457L60.3483 0.225342"
                            stroke="#F3523F"
                            stroke-miterlimit="10"
                          />
                          <path
                            d="M8.73145 66.7746L0.219375 60.2654"
                            stroke="#F3523F"
                            stroke-miterlimit="10"
                          />
                        </g>
                        <g clip-path="url(#clip1_1_884)">
                          <path
                            d="M278.431 101.735L286.943 101.735L286.943 139.033L264.195 161.78L226.817 161.78L226.817 155.271"
                            stroke="#F3523F"
                            stroke-miterlimit="10"
                          />
                          <path
                            d="M218.306 155.265L218.306 142.062L250.216 142.062L265.227 127.05L265.227 95.2253L278.436 95.2253L278.436 132.518L255.684 155.265L218.306 155.265Z"
                            stroke="#F3523F"
                            stroke-miterlimit="10"
                          />
                          <path
                            d="M218.306 155.265L226.818 161.775"
                            stroke="#F3523F"
                            stroke-miterlimit="10"
                          />
                          <path
                            d="M278.435 95.2254L286.947 101.735"
                            stroke="#F3523F"
                            stroke-miterlimit="10"
                          />
                        </g>

                        <text
                          fill={'#111111'}
                          x="80"
                          y="80"
                          fontSize="18px"
                          fontFamily="Nexa-Bold"
                          cursor={`url("/images/cursor-pointer.svg"), auto`}
                        >
                          Go to Collections
                        </text>

                        <defs>
                          <clipPath id="clip0_1_884">
                            <rect
                              width="69.083"
                              height="67"
                              fill="white"
                              transform="matrix(-1 0 0 1 69.083 0)"
                            />
                          </clipPath>
                          <clipPath id="clip1_1_884">
                            <rect
                              width="69.083"
                              height="67"
                              fill="white"
                              transform="matrix(1 1.74846e-07 1.74846e-07 -1 218.083 162)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </Box>
                  </Box>
                </a>
              </Link>
            </Grid>
            <Grid xs={12} sm={6} md={4} lg={5} sx={collections_card}>
              <Box sx={first_collection}>
                <Box sx={text_collection}>
                  <Typography
                    variant="h1"
                    fontSize={24}
                    color="rgba(0, 0, 0, 1)"
                    fontWeight="700"
                    lineHeight="164%"
                    fontFamily="Nexa-Bold"
                  >
                    ThorFi NFT <br />
                    Collection
                  </Typography>
                </Box>
                <Box sx={small_text_collection}>
                  <Typography
                    variant="h1"
                    fontSize={16}
                    color="rgba(0, 0, 0, 1)"
                    fontWeight="300"
                    lineHeight="164%"
                    fontFamily="Nexa"
                  >
                    A debut collection that features imaginative and abstract
                    styles.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
                  <Link href="/explore/collections">
                    <Button
                      variant={'contained'}
                      sx={{ ...collection_btn, clipPath: 'none !important' }}
                    >
                      View Collections
                    </Button>
                  </Link>
                </Stack>
              </Box>

              <Box sx={collection}>
                <Box sx={text_collection}>
                  <Typography
                    variant="h1"
                    fontSize={24}
                    color="rgba(0, 0, 0, 1)"
                    fontWeight="700"
                    lineHeight="164%"
                    fontFamily="Nexa-Bold"
                  >
                    ThorFi GameLoop <br />
                    Collection
                  </Typography>
                </Box>
                <Box sx={small_text_collection}>
                  <Typography
                    variant="h1"
                    fontSize={16}
                    color="rgba(0, 0, 0, 1)"
                    fontWeight="300"
                    lineHeight="164%"
                    fontFamily="Nexa"
                  >
                    Strategize to capitalize on the <br />
                    exclusive perks of Keycard and <br />
                    Capsule NFTs.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
                  <Link href="/gameloop/gamification/keycards">
                    <Button
                      variant={'contained'}
                      sx={{ ...collection_btn, clipPath: 'none !important' }}
                    >
                      Go to GameLoop
                    </Button>
                  </Link>
                </Stack>
              </Box>
            </Grid>
          </Grid>

          <Grid container xs={12} sm={12} md={12} lg={12} sx={normal_grid_last}>
            <Box sx={bottom_examples}>
              <Box sx={bottom_example_svgs}>
                <img
                  src="https://ipfs.io/ipfs/QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"
                  width="40%"
                  className="bottom_video_1"
                />
                <img
                  src="/images/party-animals-image.png"
                  width="40%"
                  className="bottom_image_3"
                />
                <img
                  src="https://ipfs.io/ipfs/QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH"
                  width="40%"
                  className="bottom_video_2"
                />
              </Box>
              <Box sx={bottom_example_text}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: {
                      miniMobile: '28px !important',
                      xs: '30px !important',
                      sm: '40px !important',
                      md: '40px !important',
                      lg: '40px !important',
                    },
                  }}
                  color="rgba(0, 0, 0, 1)"
                  fontWeight="400"
                  lineHeight="132%"
                  fontFamily="Nexa-Bold"
                >
                  Where high quality <br></br>
                  meets fresh variety.
                </Typography>
              </Box>
              <Link href="/explore">
                <Button
                  variant={'contained'}
                  sx={{ ...bottom_collection_btn, clipPath: 'none !important' }}
                >
                  Explore Capsule
                </Button>
              </Link>
            </Box>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Landing;
