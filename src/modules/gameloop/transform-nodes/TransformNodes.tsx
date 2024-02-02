import { Typography, Grid } from '@mui/material';
import TransformTypeCard from '../transform-nodes/components/transformTypeCard';

const TransformNodes = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={12} xs={12}>
          <Typography
            variant="lbl-md"
            sx={{
              color: 'rgba(0, 0, 0, 0.9)',
              position: 'absolute',
              fontFamily: 'Nexa-Bold',
              fontWeight: '300',
              fontSize: '32px',
              lineHeight: '61px',

              textAlign: {
                md: 'left',
                xs: 'center',
              },
              width: '100%',
              marginTop: {
                md: '20px',
                xs: '40px',
              },
              marginLeft: {
                md: '30px',
              },
            }}
          >
            Transform nodes
          </Typography>
        </Grid>
        <Grid item md={12} xs={12}>
          <Typography
            variant="lbl-md"
            sx={{
              color: 'rgba(0, 0, 0, 0.9)',
              position: 'absolute',
              fontFamily: 'Nexa',
              fontWeight: '300',
              fontSize: {
                md: '22px',
                xs: '20px',
              },
              lineHeight: '61px',

              textAlign: 'center',
              width: '100%',
              marginTop: {
                md: '70px',
                xs: '70px',
              },
            }}
          >
            What do you want to do?
          </Typography>
        </Grid>
      </Grid>

      <Grid container mt={12} padding={2}>
        <Grid item md={4} xs={12} mt={{ md: 3, xs: 0 }} spacing={2}>
          <TransformTypeCard
            label={'Transform to Keycard'}
            description={
              'Convert an Origin Node or a drift node into a rare keycard'
            }
            link={'/gameloop/transform2keycard'}
            bgmesh={{
              md: 'bg_transform2keycard_desktop.png',
              xs: 'bg_transform2keycard_mobile.png',
            }}
            sx={{
              height: { md: '400px', xs: '225px' },
              margin: { md: '50px', xs: '20px' },
            }}
          >
            <svg
              width="75"
              height="82.5"
              viewBox="0 0 110 130"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask id="path-1-inside-1_337_10490" fill="white">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M96.2578 0.78418H16.2578L0.257812 16.7842V128.784H96.2578V0.78418Z"
                />
              </mask>
              <path
                d="M16.2578 0.78418V-1.21582H15.4294L14.8436 -0.630034L16.2578 0.78418ZM96.2578 0.78418H98.2578V-1.21582H96.2578V0.78418ZM0.257812 16.7842L-1.1564 15.37L-1.74219 15.9558V16.7842H0.257812ZM0.257812 128.784H-1.74219V130.784H0.257812V128.784ZM96.2578 128.784V130.784H98.2578V128.784H96.2578ZM16.2578 2.78418H96.2578V-1.21582H16.2578V2.78418ZM1.67203 18.1984L17.672 2.19839L14.8436 -0.630034L-1.1564 15.37L1.67203 18.1984ZM2.25781 128.784V16.7842H-1.74219V128.784H2.25781ZM96.2578 126.784H0.257812V130.784H96.2578V126.784ZM94.2578 0.78418V128.784H98.2578V0.78418H94.2578Z"
                fill="white"
                mask="url(#path-1-inside-1_337_10490)"
              />
              <mask id="path-3-inside-2_337_10490" fill="white">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M28.2578 16.7842L16.2578 28.5094V64.7842H80.2578V16.7842H28.2578Z"
                />
              </mask>
              <path
                d="M16.2578 28.5094L14.8601 27.0789L14.2578 27.6673V28.5094H16.2578ZM28.2578 16.7842V14.7842H27.4429L26.8601 15.3537L28.2578 16.7842ZM16.2578 64.7842H14.2578V66.7842H16.2578V64.7842ZM80.2578 64.7842V66.7842H82.2578V64.7842H80.2578ZM80.2578 16.7842H82.2578V14.7842H80.2578V16.7842ZM17.6556 29.9399L29.6555 18.2147L26.8601 15.3537L14.8601 27.0789L17.6556 29.9399ZM18.2578 64.7842V28.5094H14.2578V64.7842H18.2578ZM80.2578 62.7842H16.2578V66.7842H80.2578V62.7842ZM78.2578 16.7842V64.7842H82.2578V16.7842H78.2578ZM28.2578 18.7842H80.2578V14.7842H28.2578V18.7842Z"
                fill="white"
                mask="url(#path-3-inside-2_337_10490)"
              />
              <line
                x1="16.2578"
                y1="79.7842"
                x2="48.2578"
                y2="79.7842"
                stroke="white"
                stroke-width="2"
              />
              <line
                x1="16.2578"
                y1="95.7842"
                x2="72.2578"
                y2="95.7842"
                stroke="white"
                stroke-width="2"
              />
              <line
                x1="16.2578"
                y1="111.784"
                x2="72.2578"
                y2="111.784"
                stroke="white"
                stroke-width="2"
              />
            </svg>
          </TransformTypeCard>
        </Grid>
        <Grid item md={4} xs={12} mt={{ md: 3, xs: 0 }} spacing={2}>
          <TransformTypeCard
            label={'Transform to Drift'}
            description={'Convert an Origin Node into a Drift Node'}
            link={'/gameloop/transform2drift'}
            bgmesh={{
              md: 'bg_transform2drift_desktop.png',
              xs: 'bg_transform2drift_mobile.png',
            }}
            sx={{
              height: { md: '400px', xs: '225px' },
              margin: { md: '50px', xs: '20px' },
            }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 73 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M73.0286 56.5037L36.985 74.3659L0.941406 56.5037"
                stroke="white"
                stroke-width="1.82466"
                strokeMiterlimit="10"
                strokeLinejoin="round"
              />
              <path
                d="M73.0286 38.2537L36.985 56.1159L0.941406 38.2537"
                stroke="white"
                stroke-width="1.82466"
                strokeMiterlimit="10"
                strokeLinejoin="round"
              />
              <path
                d="M73.0286 20.0038L36.985 37.8661L0.941406 20.0038L36.985 1.36597L73.0286 20.0038Z"
                stroke="white"
                stroke-width="1.82466"
                strokeMiterlimit="10"
                strokeLinejoin="round"
              />
            </svg>
          </TransformTypeCard>
        </Grid>
        <Grid item md={4} xs={12} mt={{ md: 3, xs: 0 }} spacing={2}>
          <TransformTypeCard
            label={'Buyback Burn'}
            description={
              'Burn your node and receive a lump sum of one years VRR'
            }
            link={'/gameloop/buyback-program'}
            bgmesh={{
              md: 'bg_buybackburn_desktop.png',
              xs: 'bg_buybackburn_mobile.png',
            }}
            sx={{
              height: { md: '400px', xs: '225px' },
              margin: { md: '50px', xs: '20px' },
            }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 73 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask id="path-1-inside-1_337_9349" fill="white">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0.484557 18.198L14.172 0.365967L73.4846 0.365974L73.4846 55.534L59.7971 73.366L0.484375 73.366L0.48438 0.365967H0.484557V18.198Z"
                />
              </mask>
              <path
                d="M14.172 0.365967V-1.63403L13.186 -1.63403L12.5855 -0.851808L14.172 0.365967ZM0.484557 18.198H-1.51544V24.0883L2.07107 19.4158L0.484557 18.198ZM73.4846 0.365974L75.4846 0.365974V-1.63403L73.4846 -1.63403V0.365974ZM73.4846 55.534L75.0711 56.7517L75.4846 56.213V55.534H73.4846ZM59.7971 73.366V75.366H60.7832L61.3836 74.5837L59.7971 73.366ZM0.484375 73.366H-1.51562L-1.51563 75.366H0.484375L0.484375 73.366ZM0.48438 0.365967V-1.63403H-1.51562L-1.51562 0.365967L0.48438 0.365967ZM0.484557 0.365967H2.48456V-1.63403H0.484557V0.365967ZM12.5855 -0.851808L-1.10196 16.9802L2.07107 19.4158L15.7586 1.58374L12.5855 -0.851808ZM73.4846 -1.63403L14.172 -1.63403L14.172 2.36597L73.4846 2.36597V-1.63403ZM75.4846 55.534L75.4846 0.365974L71.4846 0.365974L71.4846 55.534H75.4846ZM71.898 54.3162L58.2105 72.1482L61.3836 74.5837L75.0711 56.7517L71.898 54.3162ZM0.484375 75.366L59.7971 75.366V71.366L0.484375 71.366L0.484375 75.366ZM-1.51562 0.365967L-1.51562 73.366H2.48438L2.48438 0.365967L-1.51562 0.365967ZM0.484557 -1.63403H0.48438V2.36597H0.484557V-1.63403ZM2.48456 18.198V0.365967H-1.51544V18.198H2.48456Z"
                fill="white"
                mask="url(#path-1-inside-1_337_9349)"
              />
              <line
                x1="10.2539"
                y1="36.2917"
                x2="34.5872"
                y2="36.2917"
                stroke="white"
                stroke-width="2"
              />
              <line
                x1="10.2539"
                y1="48.4585"
                x2="52.8372"
                y2="48.4585"
                stroke="white"
                stroke-width="2"
              />
              <line
                x1="10.2539"
                y1="60.625"
                x2="52.8372"
                y2="60.625"
                stroke="white"
                stroke-width="2"
              />
            </svg>
          </TransformTypeCard>
        </Grid>
      </Grid>
    </>
  );
};

export default TransformNodes;
