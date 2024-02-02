import * as React from 'react';
import { useRef, useState, useEffect, SetStateAction } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Container, Divider } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';

const createSchema = yup.object({
  name: yup.string().required('Name is required'),
  owner: yup.string().required('Owner is required'),
  url: yup.string().required('URL is required'),
  url1: yup.string().required('URL is required'),
  price: yup.string().required('Price is required'),
  description: yup.string().required('Discription is required'),
});
interface MyFormValues {
  name: string;
  owner: string;
  description: string;
  url: string;
  price: string;
  url1: string;
}
const currencies = [
  {
    value: 'ETH',
    label: 'ETH',
  },
  {
    value: 'BTC',
    label: 'BTC',
  },
  {
    value: 'JPY',
    label: 'JPY',
  },
];

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

export default function FullScreenDialog({ open, onClose }: SimpleDialogProps) {
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currency, setCurrency] = useState<string>('EUR');

  const handleChangee = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setCurrency(event.target.value);
  };
  const initialValues: MyFormValues = {
    name: '',
    owner: '',
    description: '',
    url: '',
    price: '',
    url1: '',
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const { values, handleChange, touched, errors, handleSubmit, handleBlur } =
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
              variant="h1"
              gutterBottom
              sx={{ mt: 5, ml: 2 }}
            >
              Add NFT
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
                  'color': 'black',
                  'border': '3px solid #000000',
                  'boxShadow': 'inset 0px -1.86785px 0px rgba(0, 0, 0, 0.25)',
                  'marginRight': '18px',
                  'fontFamily': 'Nexa-Bold',
                  'lineHeight': '34px',
                }}
                component="label"
              >
                Cancel
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
                Submit
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
                  <Button variant="contained" fullWidth component="label">
                    Add Image
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(event) => {
                        const file =
                          event.target.files && event.target.files[0];
                        if (file && file.type.substr(0, 5) === 'image') {
                          setImage(file);
                        } else {
                          setImage(undefined);
                        }
                      }}
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
                  sx={{ mb: 5, fontSize: '44px' }}
                  fullWidth
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  id="standard-basic"
                  label="NFT Name*"
                  variant="standard"
                />
                <TextField
                  sx={{ mb: 5 }}
                  fullWidth
                  name="owner"
                  value={values.owner}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.owner && Boolean(errors.owner)}
                  helperText={touched.owner && errors.owner}
                  id="standard-basic"
                  label="Owner*"
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
                  id="standard-basic"
                  label="Description*"
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
                  id="url"
                  label="Short URL*"
                  variant="standard"
                />
                <Box sx={{ width: '100%', position: 'relative' }}>
                  <TextField
                    sx={{ mb: 5 }}
                    fullWidth
                    name="price"
                    value={values.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.price && Boolean(errors.price)}
                    helperText={touched.price && errors.price}
                    id="price"
                    label="List Price*"
                    variant="standard"
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      position: 'absolute',
                      top: '15px',
                      left: '40%',
                    }}
                  >
                    <Divider
                      sx={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        width: '1px',
                        height: '20px',
                        mr: 3,
                        mt: 0.5,
                      }}
                    />
                    <img
                      src="/images/curncyicon.png"
                      height="30px"
                      width="30px"
                    />
                    <TextField
                      id="standard-select-currency-native"
                      select
                      value={currency}
                      onChange={handleChangee}
                      SelectProps={{
                        native: true,
                      }}
                      variant="standard"
                    >
                      {currencies.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </Box>
                </Box>

                <TextField
                  sx={{ mb: 5 }}
                  fullWidth
                  name="url1"
                  value={values.url1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.url1 && Boolean(errors.url1)}
                  helperText={touched.url1 && errors.url1}
                  id="url*"
                  label="Short URL*"
                  variant="standard"
                />
                <Button variant="contained" fullWidth type="submit">
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Dialog>
    </div>
  );
}
