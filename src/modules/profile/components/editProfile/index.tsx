import { Avatar, Button, Grid, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import { AuthService } from '../../../../services/auth.service';
import { authAction } from '../../../../redux/slices/authSlice';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import { dottedAddress } from '../../../../shared/utils/utils';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { palette } from '../../../../theme/palette';

const btn = {
  'height': 50,
  'width': '100%',
  'maxWidth': 158,
  'border': '1px solid black',
  'borderRadius': '0px',
  'background': palette.primary.storm,
  'color': '#fff',
  '&:hover': {
    border: '1px solid black',
    borderRadius: '0px',
    background: palette.primary.storm,
    color: '#fff',
  },
  'fontSize': '19px',
  'fontWeight': 700,
};
const btnCancel = {
  height: 50,
  width: '100%',
  maxWidth: 158,
  border: '1px solid black',
  borderRadius: '0px',
  background: '#fff',
  color: palette.primary.storm,
  fontSize: '19px',
  fontWeight: 700,
};

interface MyFormValues {
  name: string;
  display: string;
  bio: string;
  twitter: string;
  discord: string;
  image: any;
}

const initialValues: MyFormValues = {
  name: '',
  display: '',
  bio: '',
  twitter: '',
  discord: '',
  image: '',
};

const EditProfile = () => {
  const createSchema = yup.object({
    name: yup
      .string()
      .matches(/^(\S+$)/, '* This field cannot contain blankspaces')
      .required('Name can not be empty'),

    display: yup.string(),
    // .required('Display is required')
    bio: yup.string(),
    twitter: yup.string(),
    discord: yup.string(),
    image: yup.mixed(),
  });

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state?.auth?.user);
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const [image, setImage] = useState<any>(user?.profile_picture || '');

  const [imageLoading, setIamgeLoading] = useState<any>(false);
  const [isUserNameDuplicated, setIsUserNameDuplicated] = useState(false);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createSchema,
    onSubmit: async (values) => {
      try {
        setIsUserNameDuplicated(false);
        setLoading(true);
        const data = {
          username: values.name,
          bio: values.bio || '',
          twitter: values.twitter || '',
          discord: values.discord || '',
          display_name: values.name || '',
          profile_picture: image || '/images/profile-yellow.svg',
        };
        AuthService.editUser(user?.id, data)
          .then(async (res) => {
            dispatch(authAction.setUser(res.data.data));
            void router.push('/profile');
          })
          .catch((err) => {
            console.log(err?.response?.data?.message);
            if (err?.response?.data?.message === 'username duplicated') {
              setIsUserNameDuplicated(true);
              console.log('true');
            }
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        setLoading(false);
      }
    },
  });

  const { values, handleChange, touched, errors, handleSubmit, handleBlur } =
    formik;

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview('');
    }
  }, [file]);

  useEffect(() => {
    console.log('useeffect', user);
    initialValues.name = user?.username;
    initialValues.bio = user?.bio;
    initialValues.twitter = user?.twitter;
    initialValues.discord = user?.discord;
    initialValues.display = user?.username;
  }, [user]);

  const handleUPloadFile = async (event: any) => {
    setIamgeLoading(true);
    const filee = event.target.files && event.target.files[0];
    if (filee && filee.type.substr(0, 5) === 'image') {
      setFile(filee);

      const data = new FormData();
      data.append('file', filee);
      const res = await AuthService.uploadFile(data);
      setImage(res.data.data);
      setIamgeLoading(false);
    } else {
      setFile(undefined);
    }
  };

  console.log('err', errors);
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
                sx={{
                  height: 80,
                  width: 80,
                  border: '1px dashed rgba(0, 0, 0, 0.5)',
                  borderRadius: '10px',
                  p: 0.5,
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Avatar
                  src={preview || image || '/images/profile-yellow.svg'}
                  sx={{ height: 70, width: 70 }}
                ></Avatar>

                <IconButton
                  // variant="contained"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2, position: 'absolute', right: -22, bottom: -7 }}
                  // sx={{ borderRadius: '0px' }}
                  component="label"
                >
                  <Box
                    sx={{
                      // height: 24,
                      // width: 24,
                      borderRadius: '50%',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px dashed rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {imageLoading ? (
                      <CircularProgress
                        size="small"
                        sx={{ width: 20, color: 'secondary.yellow' }}
                      />
                    ) : (
                      <EditIcon sx={{ fontSize: 'medium' }} />
                    )}
                  </Box>
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    // ref={fileInputRef}
                    accept="image/*"
                    onChange={handleUPloadFile}
                  />
                </IconButton>
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
                display: { sm: 'flex', miniMobile: 'none' },
              }}
            >
              <Link href="/profile">
                <Button sx={btnCancel}>Cancel</Button>
              </Link>
              <Box m="0px 10px" />

              <Button sx={btn} type="submit">
                {loading ? 'Loading' : 'Save'}
              </Button>
            </Grid>

            <Grid item md={12} sm={12} xs={11} miniMobile={11} mt={4}>
              <TextField
                fullWidth
                variant="standard"
                name="name"
                label="User Name *"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  (touched.name && Boolean(errors.name)) || isUserNameDuplicated
                }
                helperText={
                  (touched.name && errors.name) ||
                  (isUserNameDuplicated && ' User name already taken!')
                }
                sx={{
                  '& input': {
                    fontSize: { xs: '18px', md: '40px' },
                    marginLeft: '3px',
                  },
                  '& label': {
                    fontSize: { xs: '14px', md: '20px' },
                    lineHeight: { xs: '35px', md: '80px' },
                  },
                }}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={11} miniMobile={11} mt={2}>
              <TextField
                fullWidth
                variant="standard"
                name="bio"
                label="Short Bio *"
                value={values.bio}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.bio && Boolean(errors.bio)}
                helperText={touched.bio && errors.bio}
                sx={{
                  '& input': {
                    fontSize: { xs: '18px', md: '40px' },
                    marginLeft: '3px',
                  },
                  '& label': {
                    fontSize: { xs: '14px', md: '20px' },
                    lineHeight: { xs: '35px', md: '80px' },
                  },
                }}
              />
            </Grid>
            <Grid item md={12} xs={11} miniMobile={11} mt={2}>
              <TextField
                fullWidth
                variant="standard"
                name="discord"
                label="Discord Name *"
                value={values.discord}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.discord && Boolean(errors.discord)}
                helperText={touched.discord && errors.discord}
                sx={{
                  '& input': {
                    fontSize: { xs: '18px', md: '40px' },
                    marginLeft: '3px',
                  },
                  '& label': {
                    fontSize: { xs: '14px', md: '20px' },
                    lineHeight: { xs: '35px', md: '80px' },
                  },
                }}
              />
            </Grid>

            <Grid item md={12} sm={12} xs={11} miniMobile={11} mt={2}>
              <TextField
                fullWidth
                variant="standard"
                name="twitter"
                label="Twitter *"
                value={values.twitter}
                onBlur={handleBlur}
                error={touched.twitter && Boolean(errors.twitter)}
                helperText={touched.twitter && errors.twitter}
                onChange={handleChange}
                sx={{
                  '& input': {
                    fontSize: { xs: '18px', md: '40px' },
                    marginLeft: '3px',
                  },
                  '& label': {
                    fontSize: { xs: '14px', md: '20px' },
                    lineHeight: { xs: '35px', md: '80px' },
                  },
                }}
              />
            </Grid>

            <Grid
              item
              miniMobile={11}
              md={4}
              sm={6}
              xs={11}
              sx={{
                display: { sm: 'none', miniMobile: 'flex' },

                justifyContent: 'center',
                mt: { miniMobile: 4 },
              }}
            >
              <Button sx={btn} type="submit">
                {loading ? 'Loading' : 'Save'}
              </Button>
              <Box m="0px 10px" />

              <Link href="/profile">
                <Button sx={btnCancel}>Cancel</Button>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </form>
  );
};

export default EditProfile;
