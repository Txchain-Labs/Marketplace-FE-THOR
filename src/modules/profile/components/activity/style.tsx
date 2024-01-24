import { palette } from '../../../../theme/palette';

const listContainer = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  p: '10px 0px',
};
const button = {
  p: '0px 10px',
  borderRadius: '30px',
  border: `1px solid ${palette.primary.fire}`,
  color: palette.primary.fire,
  ml: 1,
};
const titleContainer = {
  display: 'flex',
};
const listWrapper = {
  display: 'flex',
  alignItems: 'center',
};
const infoContainer = {
  mt: 2,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
};
const typoStyle = {
  mr: 2.5,
  fontSize: 14,
  fontWeight: 400,
};
const spanStyle = {
  fontSize: 14,
  fontWeight: 700,
};

export {
  button,
  infoContainer,
  listContainer,
  listWrapper,
  spanStyle,
  titleContainer,
  typoStyle,
};
