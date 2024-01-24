import { Alert, Box, Snackbar, Typography, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast, ToastSeverity } from '../../redux/slices/toastSlice';
import { ArrowForwardIos } from '@mui/icons-material';
import Slide, { SlideProps } from '@mui/material/Slide';
import theme from '../../theme';
import { useEffect, useState } from 'react';

type TransitionProps = Omit<SlideProps, 'direction'>;

export interface SnackbarMessage {
  message: string;
  link: string;
  itemCount: number;
  image: string;
  key: number;
}

export interface State {
  open: boolean;
  snackPack: readonly SnackbarMessage[];
  messageInfo?: SnackbarMessage;
}

function TransitionLeft(props: TransitionProps) {
  return <Slide {...props} direction="left" />;
}

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

const CommonToast = () => {
  const { state, options } = useSelector((state: any) => state.toast);

  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(
    undefined
  );

  useEffect(() => {
    if (!state) return;

    setSnackPack((prev) => [
      ...prev,
      {
        message: options.message,
        link: options.link,
        itemCount: options.itemCount,
        image: options.image,
        key: new Date().getTime(),
      },
    ]);
    setMessageInfo(undefined);
  }, [state, options]);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
    console.log(open);
  }, [snackPack, messageInfo, open]);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(hideToast());
    setOpen(false);
  };
  const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const handleClick = () => {
    if (options?.link) {
      window.open(options?.link, '_ blank');
    }
  };

  return (
    <Snackbar
      sx={{
        zIndex: 10003,
        cursor: options?.link ? 'pointer' : 'default',
        marginTop: bigScreen ? '2rem' : '5rem',
        marginRight: '1rem',
      }}
      key={messageInfo ? messageInfo?.key : undefined}
      anchorOrigin={
        bigScreen
          ? {
              vertical: 'top',
              horizontal: 'right',
            }
          : {
              vertical: 'bottom',
              horizontal: 'center',
            }
      }
      open={open}
      TransitionComponent={bigScreen ? TransitionLeft : TransitionUp}
      autoHideDuration={options?.autoHideDuration}
      onClose={handleClose}
      onClick={handleClick}
    >
      <Box
        sx={{
          'display': 'flex',
          'alignItems': 'center',
          '& .MuiAlert-root': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        <Alert
          icon={
            <Box
              sx={{
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'flex-end',
                backgroundImage: `url(${messageInfo?.image})`,
                backgroundSize: 'cover',
              }}
            >
              {messageInfo?.itemCount > 0 && (
                <Typography
                  variant="p-sm"
                  sx={{ display: 'inline-block', m: '0 auto 5px' }}
                >
                  {messageInfo?.itemCount} Items
                </Typography>
              )}
            </Box>
          }
          severity={options?.severity}
          variant={options?.variant}
          sx={{
            'padding': '0px',
            'minWidth': '350px',
            'borderRadius': 0,
            'background':
              options?.severity === ToastSeverity.INFO ? 'black' : 'auto',
            '& .MuiAlert-icon': { padding: '0px !important', mr: 2 },
            '& .MuiAlert-message': {
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
              p: '10px',
            },
            '& .MuiButtonBase-root-MuiIconButton-root': {
              display: 'none',
            },
          }}
        >
          <Box sx={{ display: 'grid' }}>
            <Typography
              variant="p-md-bk"
              sx={{ display: 'inline-block', mr: 2 }}
            >
              {messageInfo?.message}
            </Typography>
            {messageInfo?.link ? (
              <Typography
                sx={{
                  display: 'inline-block',
                  mr: 2,
                  textDecoration: 'underline',
                }}
              >
                <a
                  href={`${messageInfo?.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open on Snowtrace
                </a>
              </Typography>
            ) : (
              ''
            )}
          </Box>

          {messageInfo?.link ? (
            <>
              <ArrowForwardIos fontSize="small" sx={{ color: 'white' }} />
            </>
          ) : (
            ''
          )}
        </Alert>
      </Box>
    </Snackbar>
  );
};

export default CommonToast;
