import { MenuItem, Select, Typography } from '@mui/material';
import { palette } from '../../theme/palette';
import DoneIcon from '@mui/icons-material/Done';
interface SelectInterface {
  onChange?: any;
  defaultValue?: any;
  inputProps?: any;
  options?: any;
  value?: any;
}
const SelectBox = ({
  onChange,
  defaultValue,
  inputProps,
  options,
  value,
}: SelectInterface) => {
  return (
    <Select
      onChange={onChange}
      value={value}
      defaultValue={defaultValue}
      renderValue={(value: string | number) =>
        options.find((item: any) => item.value === value)?.label
      }
      size="small"
      inputProps={inputProps}
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      sx={{
        '&& fieldset': {
          border: '0px',
        },
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            '& .MuiMenuItem-root.Mui-selected': {
              backgroundColor: palette.primary.fire,
              borderBottom: `1px solid ${palette.primary.mediumCarmine}`,
            },
            '& .MuiMenuItem-root:hover': {
              backgroundColor: palette.accent.sky,
              borderBottom: `1px solid ${palette.secondary.storm[15]}`,
            },
            // '& .MuiMenuItem-root.Mui-selected:hover': {
            //   backgroundColor: 'red',
            // },
            '& .MuiMenuItem-root': {
              display: 'flex',
              alignItems: 'center',
              padding: '10px 12px',
              gap: '16px',
              background: palette.primary.ash,
              borderBottom: `1px solid ${palette.secondary.storm[15]}`,
              height: '44px',
            },
          },
        },
      }}
    >
      {options?.map((option: any) => (
        <MenuItem value={option?.value} key={option?.value}>
          <Typography
            variant="lbl-md"
            sx={{ lineHeight: '15px', alignSelf: 'flex-end' }}
          >
            {option?.label}
          </Typography>
          {defaultValue === option?.value && (
            <DoneIcon sx={{ width: '17.59px' }} />
          )}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SelectBox;
