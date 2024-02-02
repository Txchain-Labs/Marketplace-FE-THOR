import { Avatar, Button, Grid, Stack, Switch, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useContext } from 'react';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { AuthService } from '../../../../services/auth.service';
import { authAction } from '../../../../redux/slices/authSlice';
import { dottedAddress } from '../../../../shared/utils/utils';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import CurrencySelect from '@/components/common/CurrencySelect';
import AvaxIcon from '@/components/icons/currencies/Avax';
import ThorIcon from '@/components/icons/currencies/Thor';
import UsdceIcon from '@/components/icons/currencies/Usdce';

import ColorModeContext from '@/themes/ColorModeContext';

const currencies = [
  {
    text: 'AVAX',
    icon: <AvaxIcon viewBox={'0 0 18 15'} />,
    value: 0,
  },
  {
    text: 'THOR',
    icon: <ThorIcon viewBox={'0 0 25 20'} />,
    value: 1,
  },
  {
    text: 'USDC',
    icon: <UsdceIcon viewBox={'0 0 15 14'} />,
    value: 2,
  },
];

const EditProfilePreferences = () => {
  const colorMode = useContext(ColorModeContext);

  const createSchema = yup.object({
    default_currency: yup.string().nullable(),
  });

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state?.auth?.user);
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const image = user?.profile_picture || '';

  const formik = useFormik({
    initialValues: {
      default_currency:
        user?.default_currency === null ? 'USDC' : user?.default_currency,
    },
    validationSchema: createSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const data = {
          default_currency: values.default_currency,
        };

        AuthService.editUser(user?.id, data)
          .then(async (res) => {
            dispatch(authAction.setUser(res.data.data));
            router.back();
          })
          .catch((err) => {
            console.log(err?.response?.data?.message);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        setLoading(false);
      }
    },
  });

  const { handleSubmit } = formik;

  return (
    <form onSubmit={handleSubmit}>
      <Box mt="60px">
        <Container>
          <Grid container justifyContent="center">
            <Grid
              item
              md={8}
              sm={8}
              xs={11}
              miniMobile={11}
              sx={{ display: 'flex' }}
            >
              <Box
                position={'relative'}
                sx={(theme) => ({
                  height: 80,
                  width: 80,
                  border: `1px dashed ${theme.palette.divider}`,
                  borderRadius: '10px',
                  p: 0.5,
                  display: 'flex',
                  flexDirection: 'row',
                })}
              >
                <Avatar
                  src={image || '/images/profile-yellow.svg'}
                  sx={{ height: 70, width: 70 }}
                ></Avatar>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', ml: 4 }}>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    fontSize: { xs: '22px', md: '32px' },
                    lineHeight: { xs: '33px', md: '55px' },
                  }}
                >
                  {user?.username}
                </Typography>
                <Typography
                  sx={{ typography: { sm: 'p-lg-bk', miniMobile: 'body1' } }}
                >
                  {dottedAddress(user?.address)}
                </Typography>
                <Typography
                  fontWeight={400}
                  sx={{
                    typography: { sm: 'p-lg-bk', miniMobile: 'body1' },
                    fontStyle: 'italic',
                  }}
                  mt={1}
                >
                  Joined {dayjs(user.joined_date).format('MMMM YYYY')}
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                display: {
                  sm: 'block',
                  miniMobile: 'none',
                },
              }}
            >
              <Stack gap={'8px'}>
                <Button
                  variant={'contained'}
                  color={'secondary'}
                  sx={{ width: '168px' }}
                  type="submit"
                >
                  {loading ? 'Loading' : 'Save'}
                </Button>
                <Button
                  variant={'outlined'}
                  color={'secondary'}
                  sx={{ width: '168px' }}
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </Stack>
            </Grid>

            <Grid item md={12} sm={12} xs={11} miniMobile={11} mt={8}>
              <Typography sx={{ fontSize: '26px', fontWeight: '600' }}>
                Preferences
              </Typography>

              <Stack
                direction={'row'}
                justifyContent={'space-between'}
                mt={'20px'}
                sx={{
                  width: {
                    miniMobile: '100%',
                    sm: '404px',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '20px',
                    fontWeight: '400',
                    fontFamily: 'Nexa-Bold',
                  }}
                >
                  Dark Mode
                </Typography>
                <Switch
                  name={'is_using_dark_mode'}
                  checked={colorMode.colorMode === 'dark'}
                  onChange={() => colorMode.toggleColorMode()}
                />
              </Stack>

              <Typography
                sx={{
                  marginTop: '20px',
                  fontSize: '20px',
                  fontWeight: '400',
                  fontFamily: 'Nexa-Bold',
                }}
              >
                Default Currency
              </Typography>
            </Grid>

            <Grid item md={12} sm={12} xs={11} miniMobile={11} mt={0}>
              <CurrencySelect
                sx={{
                  width: {
                    miniMobile: '100%',
                    sm: '404px',
                  },
                  mt: '8px',
                }}
                currencies={currencies}
                value={currencies.findIndex(
                  (currency) => currency.text === formik.values.default_currency
                )}
                onChange={(value: number) => {
                  formik.values.default_currency = currencies[value].text;
                }}
              />
            </Grid>

            <Grid
              item
              miniMobile={11}
              md={4}
              sm={6}
              xs={11}
              mt={{ miniMobile: 8, xs: 8, sm: 8, md: 4 }}
              sx={{
                display: { sm: 'none', miniMobile: 'flex' },

                justifyContent: 'center',
              }}
            >
              <Button
                variant={'contained'}
                color={'secondary'}
                fullWidth
                type="submit"
              >
                {loading ? 'Loading' : 'Save'}
              </Button>
              <Box m="0px 10px" />

              <Button
                variant={'outlined'}
                color={'secondary'}
                fullWidth
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </form>
  );
};

export default EditProfilePreferences;
