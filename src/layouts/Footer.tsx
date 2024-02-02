import React, { FC } from 'react';
import { deepmerge } from '@mui/utils';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Divider,
  Link,
  createTheme,
  useTheme,
  ThemeProvider,
} from '@mui/material';
import DiscordIcon from '@/components/icons/Discord';
import TwitterIcon from '@/components/icons/Twitter';
import MediumIcon from '@/components/icons/Medium';
import { Logo } from '@/components/icons/Logo';

const Footer: FC = () => {
  const theme = useTheme();

  const footerTheme = createTheme(
    deepmerge(theme, {
      palette: {
        background: {
          paper:
            theme.palette.mode === 'light'
              ? theme.palette.accent.main
              : theme.palette.background.paper,
        },
      },
    })
  );

  return (
    <ThemeProvider theme={footerTheme}>
      <Paper
        square
        elevation={0}
        sx={{
          px: {
            miniMobile: '16px',
            sm: '56px',
          },
          pb: '16px',
        }}
      >
        <Grid
          container
          columnSpacing={{ xs: '14px', md: '98px' }}
          rowSpacing={'36px'}
          sx={{ marginTop: '0px' }}
        >
          <Grid item md={4} xs={12}>
            <Box height={24} mb={'16px'}>
              <Logo
                viewBox={'0 0 32 24'}
                sx={{ width: '32px', height: '24px' }}
              />
            </Box>
            <Typography
              variant={'lbl-lg'}
              component={'h3'}
              lineHeight={'28px'}
              mb={'8px'}
              color={'text.primary'}
            >
              CAPSULE
            </Typography>
            <Typography
              color={'text.secondary'}
              variant={'p-md'}
              lineHeight={'24px'}
            >
              Setting the new standard for digital creativity as the first
              public marketplace for nodes as NFTs and premium artwork.
            </Typography>
          </Grid>
          <Grid item md={4} xs={6}>
            <Typography
              variant={'lbl-lg'}
              component={'h3'}
              lineHeight={'28px'}
              mb={'16px'}
              color={'text.primary'}
            >
              Resources
            </Typography>
            <Link
              href={'https://docs.thorfi.io/project-information/overview'}
              target={'_blank'}
              variant={'lbl-md'}
              lineHeight={'21px'}
              mb={'8px'}
              color={'text.secondary'}
              sx={{
                '&:hover': { color: 'primary.main' },
                'textDecoration': 'none',
              }}
            >
              Litepaper
            </Link>
            <Link
              href={'http://thorfi.io'}
              target={'_blank'}
              variant={'lbl-md'}
              lineHeight={'21px'}
              mb={'8px'}
              color={'text.secondary'}
              sx={{
                '&:hover': { color: 'primary.main' },
                'textDecoration': 'none',
              }}
            >
              Thorfi Dapp
            </Link>
            <Link
              href={'https://traderjoexyz.com/avalanche/trade'}
              target={'_blank'}
              variant={'lbl-md'}
              lineHeight={'21px'}
              mb={'8px'}
              color={'text.secondary'}
              sx={{
                '&:hover': { color: 'primary.main' },
                'textDecoration': 'none',
              }}
            >
              Buy Thor
            </Link>
            <Link
              href={'https://coinmarketcap.com/currencies/thor'}
              target={'_blank'}
              variant={'lbl-md'}
              lineHeight={'21px'}
              mb={'8px'}
              color={'text.secondary'}
              sx={{
                '&:hover': { color: 'primary.main' },
                'textDecoration': 'none',
              }}
            >
              Thor - Coinmarket Cap
            </Link>
          </Grid>
          <Grid item md={4} xs={6}>
            <Typography
              variant={'lbl-lg'}
              component={'h3'}
              lineHeight={'28px'}
              mb={'16px'}
              color={'text.primary'}
            >
              Join the community
            </Typography>
            <Box display={'flex'}>
              <Link href={'https://discord.gg/capsule'} target={'_blank'}>
                <Box height={24} mr={'16px'}>
                  <DiscordIcon />
                </Box>
              </Link>
              <Link
                href={'https://twitter.com/CapsulePresents'}
                target={'_blank'}
              >
                <Box height={24} mr={'16px'}>
                  <TwitterIcon />
                </Box>
              </Link>
              <Link
                href={'https://medium.com/@CapsulePresents'}
                target={'_blank'}
              >
                <Box height={24} mr={'16px'}>
                  <MediumIcon />
                </Box>
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: '16px' }} />
        <Grid
          container
          columnSpacing={{ xs: '14px', md: '98px' }}
          rowSpacing={'8px'}
        >
          <Grid item md={8} xs={12}>
            <Typography
              variant={'lbl-sm'}
              lineHeight={'18px'}
              fontWeight={300}
              color={'text.secondary'}
              sx={(theme) => ({
                [theme.breakpoints.down('sm')]: {
                  textAlign: 'center',
                },
              })}
            >
              Copyright 2023 Capsule
            </Typography>
          </Grid>
          <Grid item md={4} xs={12}>
            <Box
              sx={(theme) => ({
                display: 'flex',
                [theme.breakpoints.down('sm')]: {
                  justifyContent: 'center',
                },
              })}
            >
              <Link
                href={'https://docs.capsule.gg/resources/terms-of-service'}
                target={'_blank'}
                variant={'lbl-md'}
                lineHeight={'21px'}
                mr={'16px'}
                color={'text.secondary'}
                sx={{ textDecoration: 'none' }}
              >
                Terms & Conditions
              </Link>
              <Link
                href={'/about'}
                target={'_blank'}
                variant={'lbl-md'}
                lineHeight={'21px'}
                color={'text.secondary'}
                sx={{ textDecoration: 'none' }}
              >
                About
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
};

export default Footer;
