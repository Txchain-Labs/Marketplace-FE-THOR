import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { root } from './style';
import Loader from '../../../../components/common/Loader';
import { palette } from '../../../../theme/palette';

type Props = {
  collections: [];
  loading: boolean;
};

const Collections = (props: Props) => {
  const { collections, loading } = props;

  return (
    <Box sx={root}>
      <Grid container spacing={2}>
        {loading ? (
          <Loader colSpan={2} height={500} size={undefined} />
        ) : !collections?.length ? (
          'no Data'
        ) : (
          collections?.map((item: any, index: number) => (
            <Grid item xs={12} md={4} sm={2} lg={4} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="280"
                  image={item?.profile_image || '/images/profile-nft.png'}
                  object-fit="fill"
                />
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                  }}
                >
                  <Typography gutterBottom variant="h1">
                    {item.name}
                  </Typography>
                  <Typography variant="h1" color={palette.primary.fire}>
                    {item.symbol}
                  </Typography>
                  <Typography variant="h1" color="rgba(0, 0, 0, 0.5)">
                    /zombiemonkeys
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default Collections;
