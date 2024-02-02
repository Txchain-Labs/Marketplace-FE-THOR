import { Grid, Paper, SxProps, Typography, Link } from '@mui/material';
import React from 'react';

export default function TransformTypeCard({
  bgmesh,
  label,
  description,
  link,
  sx = {},
  children,
}: {
  bgmesh: any;
  label: string;
  description: string;
  link: string;
  sx?: SxProps;
  children: JSX.Element;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link href={link} sx={{ textDecoration: 'none' }}>
      <Paper
        square
        sx={{
          ...sx,

          'margin': '20px',
          'border': '1px solid rgba(0, 0, 0, 0.9)',
          'display': 'flex',
          'flexWrap': 'wrap',
          'justifyContent': 'center',
          'alignItems': 'center',
          'fontSize': '14px',
          'fontWeight': 600,
          'color': 'white',
          'background': 'rgba(0, 0, 0, 0.85)',
          'textAlign': 'center',
          'cursor': `url("/images/cursor-pointer.svg"), auto`,

          'position': 'relative',

          '&:hover': {
            background: '#F3523F',
            border: '1px solid rgba(255, 0, 0, 0.9)',
            clipPath:
              'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)',
          },
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Paper
          square
          sx={{
            width: '100%',
            height: '100%',
            backgroundSize: 'cover',
            backgroundImage: {
              md: `url("/images/gameloop/${bgmesh.md}")`,
              xs: `url("/images/gameloop/${bgmesh.xs}")`,
            },
            backgroundBlendMode: 'difference',
            opacity: '20%',

            position: 'absolute',
          }}
        ></Paper>

        <Grid container mt={2}>
          <Grid item xs={12}>
            {children}
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ fontSize: '20px', lineHeight: '60px', color: 'white' }}
          >
            {label}
          </Grid>
        </Grid>

        <Grid container mt={-15} sx={{ display: hovered ? 'initial' : 'none' }}>
          <Grid
            item
            xs={12}
            sx={{ fontSize: '13px', lineHeight: '20px', color: 'white' }}
          >
            <Typography
              variant="lbl-md"
              sx={{
                color: 'white',
                fontFamily: 'Nexa-Bold',
                fontWeight: '400',
                fontSize: '13px',
                lineHeight: '20px',
                textAlign: 'center',
                width: '80%',
                marginLeft: '10%',
              }}
            >
              {description}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Link>
  );
}
