import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 200,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  clipPath:
    'polygon( 30% 0%, 95% 0, 100% 12%, 100% 100%, 70% 100%, 5% 100%, 0 90%, 0 0)',
};

type Props = { open: boolean; close: any; login: any };

const ChangeAccount = (props: Props) => {
  const { open, close, login } = props;
  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between" mt="30px">
            <Button
              onClick={close}
              variant="contained"
              fullWidth
              sx={{ textTransform: 'capitalize' }}
            >
              Cancel
            </Button>
            <Button
              onClick={login}
              variant="contained"
              fullWidth
              sx={{ textTransform: 'capitalize' }}
            >
              Accept and Signin
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ChangeAccount;
