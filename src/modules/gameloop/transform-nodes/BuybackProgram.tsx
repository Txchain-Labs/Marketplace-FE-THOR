import { Typography, Grid, Box, Button } from '@mui/material';
import TransformNodeTile from '../transform-nodes/components/transformNodeTile';

const btn = {
  'width': '250px',
  'height': '40px',
  'alignItems': 'center',
  'fontSize': '12px',
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
    boxShadow: 'inset rgba(0, 0, 0, 0.25) 0px 3px 0px',
  },
};

const data = [
  {
    type: 'All',
    nodes: [
      {
        id: '1',
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        id: '2',
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        id: '3',
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        id: '4',
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        id: '5',
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        id: '6',
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        id: '7',
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
    ],
    selected: true,
  },
  {
    type: 'Odin',
    nodes: [
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
    ],
    selected: false,
  },
  {
    type: 'Thor',
    nodes: [
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
      {
        price: '520.259',
        pendingReward: '0.204 THOR',
        name: 'Name',
        selected: false,
      },
    ],
    selected: false,
  },
];

const BuybackProgram = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid
          item
          md={6}
          sx={{
            borderRight: '1px solid #DDDDDD',
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 20px;',
            paddingLeft: '3px',
            paddingRight: '6px',
          }}
        >
          <Box sx={{ display: 'flex', margin: '20px' }}>
            {data.map((eachNodeType, index) => {
              return (
                <Typography
                  key={'nodeType_' + index}
                  sx={{
                    margin: '10px',
                    color: eachNodeType.selected ? 'white' : 'initial',
                    background: eachNodeType.selected ? 'black' : 'initial',
                    padding: '3px 10px',
                    borderTopLeftRadius: '30px',
                    borderTopRightRadius: '30px',
                    borderBottomLeftRadius: '30px',
                    borderBottomRightRadius: '30px',
                    lineHeight: '20px',
                    cursor: `url("/images/cursor-pointer.svg"), auto`,
                  }}
                >
                  {eachNodeType.type} {eachNodeType.nodes.length}
                </Typography>
              );
            })}
          </Box>

          <Grid container>
            {data
              .find((each) => each.selected === true)
              .nodes.map((_, index) => {
                return (
                  <Grid item key={'node_' + index} md={4} xs={12} spacing={2}>
                    <TransformNodeTile
                      key={index}
                      type={'Origin Thor'}
                      price={'520.259'}
                      name={'Name'}
                      isSelected={false}
                      pendingReward={'0.204 THOR'}
                      pageType={'node'}
                      tier={'THOR'}
                    ></TransformNodeTile>
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
        <Grid
          item
          md={6}
          sx={{
            paddingLeft: '10px',
          }}
        >
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
              marginTop: {
                md: '20px',
                xs: '40px',
              },
              marginLeft: {
                md: '10px',
              },
            }}
          >
            Buyback Burn Program
          </Typography>

          <Typography
            variant="lbl-md"
            sx={{
              color: 'rgba(0, 0, 0, 0.6)',
              position: 'absolute',
              fontFamily: 'Nexa',
              fontWeight: '300',
              fontSize: '15px',
              lineHeight: '56px',

              textAlign: {
                md: 'left',
                xs: 'center',
              },
              marginTop: {
                md: '60px',
                xs: '80px',
              },
              marginLeft: {
                md: '10px',
              },
            }}
          >
            SELECT YOUR NODES
          </Typography>

          <Box
            sx={{
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '35px',
              border: '2px dashed rgba(0, 0, 0, 0.4)',
              marginLeft: '15px',
              marginRight: '30px',
              marginTop: {
                md: '200px',
                xs: '220px',
              },
            }}
          >
            <Typography
              variant="lbl-md"
              sx={{
                color: 'rgba(0, 0, 0, 0.6)',
                fontFamily: 'Nexa',
                fontWeight: '300',
                fontSize: '15px',
                lineHeight: '56px',
              }}
            >
              Select NFTs to Transform
            </Typography>
          </Box>

          <Box
            sx={{
              textAlign: 'right',
              alignItems: 'right',
              position: 'absolute',
              right: '30px',
              bottom: '20px',
              display: 'flex',
            }}
          >
            <Typography
              variant="lbl-md"
              sx={{
                color: 'rgba(0, 0, 0, 0.6)',
                fontFamily: 'Nexa',
                fontWeight: '300',
                fontSize: '15px',
                lineHeight: '45px',
                marginRight: '20px',
              }}
            >
              0 Selected
            </Typography>

            <Button
              variant={'contained'}
              sx={{ ...btn, clipPath: 'none !important' }}
            >
              <Typography
                variant="overline"
                fontWeight={'700'}
                lineHeight={'30px'}
                fontSize={'13px'}
                textTransform={'initial'}
              >
                Transform
              </Typography>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default BuybackProgram;
