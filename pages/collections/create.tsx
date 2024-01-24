import { useRef, useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { CircularProgress, Container } from '@mui/material';
import { useFormik } from 'formik';
import { object, string, mixed } from 'yup';
import { createCollection } from '../../src/shared/contracts/collections/funtions';
import { StorageService } from '../../src/services/storage.service';
import { useRouter } from 'next/router';

const FILE_SIZE = 5000 * 1024;
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

const createSchema = object({
  name: string().required('Name is required'),
  symbol: string().required('Symbol is required'),
  url: string().required('URL is required'),
  description: string().required('Discription is required'),
  image: mixed()
    .required('A file is required')
    .test('fileSize', 'File too large', (value) => {
      return value && (value as any).size <= FILE_SIZE;
    })
    .test(
      'fileFormat',
      'Unsupported Format',
      (value) => value && SUPPORTED_FORMATS.includes((value as any).type)
    ),
});
interface MyFormValues {
  name: string;
  symbol: string;
  url: string;
  description: string;
  image: any;
}

const Create = () => {
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

  const { values, handleChange, touched, errors, handleBlur, setFieldValue } =
    formik;

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
      <Container maxWidth="xl">
        <Typography
          align="left"
          variant="h1"
          gutterBottom
          sx={{ mt: 5, ml: 2 }}
        >
          Create Collection
        </Typography>

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
                  sx={{ borderRadius: '0px' }}
                  component="label"
                >
                  Add Image
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
            >
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  sx={{ mb: 5, fontSize: '44px' }}
                  fullWidth
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  id="standard-basic"
                  label="Display Name*"
                  variant="standard"
                />
                <TextField
                  sx={{ mb: 5 }}
                  fullWidth
                  name="symbol"
                  value={values.symbol}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.symbol && Boolean(errors.symbol)}
                  helperText={touched.symbol && errors.symbol}
                  id="standard-basic"
                  label="Symbol*"
                  variant="standard"
                />
                <TextField
                  sx={{ mb: 5 }}
                  fullWidth
                  name="url"
                  value={values.url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.url && Boolean(errors.url)}
                  helperText={touched.url && errors.url}
                  id="standard-basic"
                  label="Short URL*"
                  variant="standard"
                />
                <TextField
                  sx={{ mb: 5 }}
                  fullWidth
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                  id="Description*"
                  label="Description*"
                  variant="standard"
                />
                <Button variant="contained" type="submit">
                  {loading ? (
                    <CircularProgress size={30} sx={{ color: 'white' }} />
                  ) : (
                    'Submit'
                  )}
                </Button>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
export default Create;
