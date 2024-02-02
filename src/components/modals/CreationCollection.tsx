import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { CircularProgress, Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { StorageService } from '../../../src/services/storage.service';
import { createCollection } from '../../../src/shared/contracts/collections/funtions';
import { palette } from '../../theme/palette';

const FILE_SIZE = 5000 * 1024;
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

interface MyFormValues {
  name: string;
  symbol: string;
  url: string;
  description: string;
  image: any;
}

export default function FullScreenDialog({ open, onClose }: SimpleDialogProps) {
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialValues: MyFormValues = {
    name: '',
    symbol: '',
    url: '',
    description: '',
    image: image,
  };

  const createSchema = yup.object({
    name: yup.string().required('Name is required'),
    symbol: yup.string().required('Symbol is required'),
    url: yup.string().required('URL is required'),
    description: yup.string().required('Discription is required'),
    image: yup
      .mixed()
      .required('A file is required')
      .test(
        'fileSize',
        'File too large',
        (value) => value && (value as any).size <= FILE_SIZE
      )
      .test(
        'fileFormat',
        'Unsupported Format',
        (value) => value && SUPPORTED_FORMATS.includes((value as any).type)
      ),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const url: any = await StorageService.storeCollection(
          values.image,
          values.name,
          values.description
        );
        await createCollection(1, values.name, values.symbol, url);
        void router.push('/profile');
        setLoading(false);
      } catch (error) {
        console.log('Error Upload:', error);
      }
    },
  });

  const {
    values,
    handleChange,
    touched,
    errors,
    handleSubmit,
    handleBlur,
    setFieldValue,
  } = formik;

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview('');
    }
  }, [image]);

  const handleFileChange = (event: any) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      void setFieldValue('image', file);
      setImage(file);
    } else {
      setImage(undefined);
    }
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        BackdropProps={{
          style: {
            opacity: 0,
          },
        }}
        PaperProps={{
          style: {
            background: 'rgba(255, 255, 255, 0.87)',
            marginTop: '58px',
            marginLeft: '95px',
            height: 'calc(100% - 58px)',
          },
        }}
        sx={{
          zIndex: 10006,
        }}
      >
        <Container maxWidth="xl">
          <Box
            display="flex"
            sx={{ flexDirection: 'wrap', justifyContent: 'space-between' }}
          >
            <Typography
              align="left"
              variant="h4"
              gutterBottom
              sx={{ mt: 5, ml: 2, fontWeight: '700' }}
            >
              Create Collection
            </Typography>
            <Box sx={{ marginTop: '30px' }}>
              <Button
                variant="contained"
                sx={{
                  'borderRadius': '0px',
                  'textTransform': 'none',
                  'width': '150px',
                  'height': '45px',
                  'background': 'rgba(255, 255, 255, 0.87)',
                  '&:hover': { backgroundColor: 'white' },
                  'color': palette.primary.storm,
                  'border': `3px solid ${palette.primary.storm}`,
                  'boxShadow': 'inset 0px -1.86785px 0px rgba(0, 0, 0, 0.25)',
                  'marginRight': '18px',
                  'fontFamily': 'Nexa-Bold',
                  'lineHeight': '34px',
                }}
                component="label"
              >
                <Typography variant="p-lg"> Cancel</Typography>
                <input
                  type="button"
                  name="cancel"
                  style={{ display: 'none' }}
                  onClick={onClose}
                />
              </Button>
              <Button
                variant="contained"
                sx={{
                  borderRadius: '0px',
                  textTransform: 'none',
                  width: '150px',
                  height: '45px',
                  boxShadow: 'inset 0px -1.86785px 0px rgba(0, 0, 0, 0.25)',
                  marginRight: '18px',
                  fontFamily: 'Nexa-Bold',
                  lineHeight: '34px',
                }}
                component="label"
              >
                <Typography variant="p-lg"> Create </Typography>
                <input
                  type="button"
                  name="import"
                  style={{ display: 'none' }}
                  onClick={onClose}
                />
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item md={4} sm={6} xs={12}>
              {preview ? (
                <Box
                  sx={{
                    width: '80%',
                    height: { xs: 200, sm: 200, md: 200, lg: 250 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid black',
                    mt: 5,
                    ml: 2,
                  }}
                >
                  <img
                    src={preview}
                    height="100%"
                    width="100%"
                    onClick={() => {
                      setImage(undefined);
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    backgroundImage: 'url(/images/uploadImg.jpeg)',
                    width: '80%',
                    height: { xs: 200, sm: 200, md: 200, lg: 250 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 5,
                    ml: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ borderRadius: '0px' }}
                    component="label"
                  >
                    <Typography variant="p-lg-bk">Add Image</Typography>
                    <input
                      type="file"
                      name="image"
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                </Box>
              )}
            </Grid>
            <Grid item lg={6} md={7} sm={6} xs={12} sx={{}}>
              <Box
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  mt: 4,
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
              >
                <TextField
                  sx={{ mb: 5, paddingTop: '16px' }}
                  fullWidth
                  name="name"
                  variant="standard"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  id="standard-basic"
                  label={
                    <Typography variant="h3" style={{ fontWeight: '400' }}>
                      Display Name*{' '}
                    </Typography>
                  }
                />
                <TextField
                  sx={{ mb: 5 }}
                  fullWidth
                  name="symbol"
                  variant="standard"
                  value={values.symbol}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.symbol && Boolean(errors.symbol)}
                  helperText={touched.symbol && errors.symbol}
                  id="standard-basic"
                  label={
                    <Typography variant="h3" style={{ fontWeight: '400' }}>
                      Symbol*{' '}
                    </Typography>
                  }
                />
                <TextField
                  sx={{ mb: 5, paddingTop: '16px' }}
                  fullWidth
                  name="url"
                  value={values.url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant="standard"
                  error={touched.url && Boolean(errors.url)}
                  helperText={touched.url && errors.url}
                  id="standard-basic"
                  label={
                    <Typography variant="h3" style={{ fontWeight: '400' }}>
                      Short URL*{' '}
                    </Typography>
                  }
                />
                <TextField
                  sx={{ mb: 5, paddingTop: '16px' }}
                  fullWidth
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                  id="Description*"
                  label={
                    <Typography variant="h3" style={{ fontWeight: '400' }}>
                      Description*
                    </Typography>
                  }
                  variant="standard"
                />
                <Button variant="contained" fullWidth type="submit">
                  {loading ? (
                    <CircularProgress size={30} sx={{ color: 'white' }} />
                  ) : (
                    <Typography variant="p-lg-bk">Submit</Typography>
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Dialog>
    </div>
  );
}
