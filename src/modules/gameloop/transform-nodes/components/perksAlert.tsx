import { Paper, Typography } from '@mui/material';

const popupStyle = {
  marginLeft: '10%',
  background: 'transparent',
  padding: '30px',
  clipPath: 'polygon(5% 0, 100% 0, 100% 80%, 95% 100%, 0 100%, 0 20%)',
  position: 'relative',
};

interface Props {
  handleClose: any;
  message: any;
}

export default function PerksAlert(props: Props) {
  const { handleClose, message } = props;
  return (
    <Paper square sx={popupStyle} onClick={handleClose}>
      <svg
        style={{ position: 'absolute', top: '0px', left: '5px', zIndex: 0 }}
        width="501"
        height="160"
        viewBox="0 0 601 173"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.14844 24.9303L24.5627 1.51611H599.148V148.102L575.734 171.516H1.14844V24.9303Z"
          fill="transparent"
          stroke="black"
          stroke-width="2"
        />
      </svg>

      <Typography
        variant="lbl-md"
        sx={{
          color: '#D90368',
          fontFamily: 'Nexa-Bold',
          fontWeight: '400',
          fontSize: '22px',
          lineHeight: '30px',
        }}
      >
        Alert!
      </Typography>

      <Typography
        variant="lbl-md"
        sx={{
          color: 'rgba(0, 0, 0, 0.5)',
          fontSize: '13px',
          lineHeight: '30px',
        }}
      >
        TRANSFORMING NODE(S) TO KEYCARD(S)
      </Typography>

      <Typography
        variant="lbl-md"
        sx={{
          color: 'rgba(0, 0, 0)',
          fontSize: '13px',
          lineHeight: '20px',
        }}
      >
        {message}
      </Typography>
    </Paper>
  );
}
