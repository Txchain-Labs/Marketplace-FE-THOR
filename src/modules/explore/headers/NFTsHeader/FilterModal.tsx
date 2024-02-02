import React, { FC } from 'react';
import { useQueryStates, queryTypes } from 'next-usequerystate';
import { useFormik } from 'formik';
// import * as Yup from 'yup';
import {
  Box,
  Button,
  IconButton,
  Drawer,
  Typography,
  TextField,
} from '@mui/material';
import { Close } from '@mui/icons-material';

import CurrencySelect from '@/components/common/CurrencySelect';
import Chip from '@/components/common/Chip';

const defaultFilterValues: {
  favourited: boolean;
  notFavourited: boolean;
  listed: boolean;
  notListed: boolean;
  privateBids: boolean;
  bids: boolean;
  noBids: boolean;
  currency: number;
  priceMin: string;
  priceMax: string;
} = {
  favourited: true,
  notFavourited: true,
  listed: true,
  notListed: true,
  privateBids: true,
  bids: true,
  noBids: true,
  currency: 0,
  priceMin: '',
  priceMax: '',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const FilterModal: FC<Props> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useQueryStates({
    favourited: queryTypes.boolean.withDefault(defaultFilterValues.favourited),
    notFavourited: queryTypes.boolean.withDefault(
      defaultFilterValues.notFavourited
    ),
    listed: queryTypes.boolean.withDefault(defaultFilterValues.listed),
    notListed: queryTypes.boolean.withDefault(defaultFilterValues.notListed),
    privateBids: queryTypes.boolean.withDefault(
      defaultFilterValues.privateBids
    ),
    bids: queryTypes.boolean.withDefault(defaultFilterValues.bids),
    noBids: queryTypes.boolean.withDefault(defaultFilterValues.noBids),
    currency: queryTypes.integer.withDefault(defaultFilterValues.currency),
    priceMin: queryTypes.string.withDefault(defaultFilterValues.priceMin),
    priceMax: queryTypes.string.withDefault(defaultFilterValues.priceMax),
  });

  const formik = useFormik({
    initialValues: filter,
    // validationSchema: Yup.object({
    //   currency: Yup.number().required(),
    // }),
    onSubmit: (values) => {
      values.priceMin &&
        (values.priceMin = Number(values.priceMin).toLocaleString('fullwide', {
          useGrouping: false,
          maximumFractionDigits: 18,
        }));
      values.priceMax &&
        (values.priceMax = Number(values.priceMax).toLocaleString('fullwide', {
          useGrouping: false,
          maximumFractionDigits: 18,
        }));

      setFilter(values);
      onClose();
    },
  });

  const handleClose = () => {
    formik.resetForm({
      values: filter,
    });
    onClose();
  };

  const handleReset = () => {
    formik.resetForm({
      values: defaultFilterValues,
    });
  };

  const handleFavouritedChipClick = (
    favourited: 'favourited' | 'notFavourited'
  ) => {
    const oldValue = formik.values[favourited];

    formik.setFieldValue(favourited, !oldValue);
  };

  const handleFavouritedSelectAll = () => {
    if (formik.values.favourited && formik.values.notFavourited) {
      formik.setFieldValue('favourited', false);
      formik.setFieldValue('notFavourited', false);
    } else {
      formik.setFieldValue('favourited', true);
      formik.setFieldValue('notFavourited', true);
    }
  };

  const handleListedChipClick = (listed: 'listed' | 'notListed') => {
    const oldValue = formik.values[listed];

    formik.setFieldValue(listed, !oldValue);
  };

  const handleListedSelectAll = () => {
    if (formik.values.listed && formik.values.notListed) {
      formik.setFieldValue('listed', false);
      formik.setFieldValue('notListed', false);
    } else {
      formik.setFieldValue('listed', true);
      formik.setFieldValue('notListed', true);
    }
  };

  const handleBidsChipClick = (bidType: 'privateBids' | 'bids' | 'noBids') => {
    const oldValue = formik.values[bidType];

    formik.setFieldValue(bidType, !oldValue);
  };

  const handleBidsSelectAll = () => {
    if (
      formik.values.privateBids &&
      formik.values.bids &&
      formik.values.noBids
    ) {
      formik.setFieldValue('privateBids', false);
      formik.setFieldValue('bids', false);
      formik.setFieldValue('noBids', false);
    } else {
      formik.setFieldValue('privateBids', true);
      formik.setFieldValue('bids', true);
      formik.setFieldValue('noBids', true);
    }
  };

  return (
    <Drawer
      slotProps={{
        backdrop: {
          invisible: true,
        },
      }}
      PaperProps={{
        sx: (theme) => ({
          width: '375px',
          height: '100vh',
          p: '10px 16px 16px',
          [theme.breakpoints.down('sm')]: {
            width: '100vw',
          },
        }),
      }}
      anchor={'right'}
      elevation={8}
      open={isOpen}
      onClose={handleClose}
    >
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        mb={'8px'}
      >
        <Typography variant={'h5'}>Filter options</Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </Box>
      <form
        onSubmit={formik.handleSubmit}
        style={{ position: 'relative', height: '100%' }}
        noValidate
      >
        <Box>
          <Button
            variant={'outlined'}
            color={'secondary'}
            sx={{ width: 'fit-content' }}
            onClick={handleReset}
          >
            Reset all
          </Button>
        </Box>

        <Typography variant={'lbl-lg'} color={'primary'} mt={'48px'} mb={'8px'}>
          Status
        </Typography>

        <Box
          mt={'8px'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography variant={'lbl-lg'}>Show</Typography>
          <Button
            size={'small'}
            sx={{ textTransform: 'none' }}
            onClick={handleFavouritedSelectAll}
          >
            {formik.values.favourited && formik.values.notFavourited
              ? 'Deselect all'
              : 'Select all'}
          </Button>
        </Box>
        <Box mt={'8px'}>
          <Chip
            label={'Favourited'}
            selected={formik.values.favourited}
            onClick={() => handleFavouritedChipClick('favourited')}
          />
          <Chip
            label={'Not Favourited'}
            selected={formik.values.notFavourited}
            onClick={() => handleFavouritedChipClick('notFavourited')}
          />
        </Box>
        <Box
          mt={'8px'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography variant={'lbl-lg'}>Listed</Typography>
          <Button
            size={'small'}
            sx={{ textTransform: 'none' }}
            onClick={handleListedSelectAll}
          >
            {formik.values.listed && formik.values.notListed
              ? 'Deselect all'
              : 'Select all'}
          </Button>
        </Box>
        <Box mt={'8px'}>
          <Chip
            label={'Listed'}
            selected={formik.values.listed}
            onClick={() => handleListedChipClick('listed')}
          />
          <Chip
            label={'Not listed'}
            selected={formik.values.notListed}
            onClick={() => handleListedChipClick('notListed')}
          />
        </Box>

        <Box
          mt={'8px'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography variant={'lbl-lg'}>Bids</Typography>
          <Button
            size={'small'}
            sx={{ textTransform: 'none' }}
            onClick={handleBidsSelectAll}
          >
            {formik.values.privateBids &&
            formik.values.bids &&
            formik.values.noBids
              ? 'Deselect all'
              : 'Select all'}
          </Button>
        </Box>
        <Box mt={'8px'}>
          <Chip
            label={'Private bids open'}
            selected={formik.values.privateBids}
            onClick={() => handleBidsChipClick('privateBids')}
          />
          <Chip
            label={'Bids open'}
            selected={formik.values.bids}
            onClick={() => handleBidsChipClick('bids')}
          />
          <Chip
            label={'No bids'}
            selected={formik.values.noBids}
            onClick={() => handleBidsChipClick('noBids')}
          />
        </Box>

        <Typography variant={'lbl-lg'} color={'primary'} mt={'48px'} mb={'8px'}>
          Price
        </Typography>
        <Box display={'flex'}>
          <CurrencySelect
            value={formik.values.currency}
            onChange={(value) =>
              formik.handleChange({
                target: {
                  name: 'currency',
                  value,
                },
              })
            }
          />
          <Box ml={'8px'} flexGrow={1} display={'flex'}>
            <TextField
              variant={'standard'}
              placeholder={'Min'}
              type={'number'}
              sx={{
                '& .MuiInputBase-root': {
                  fontWeight: 400,
                  fontSize: '18px',
                  paddingTop: '0',
                  height: '48px',
                },
              }}
              name={'priceMin'}
              value={formik.values.priceMin}
              onChange={formik.handleChange}
            />
            <Typography variant={'body1'} m={'auto 16px'}>
              to
            </Typography>
            <TextField
              variant={'standard'}
              placeholder={'Max'}
              type={'number'}
              sx={{
                '& .MuiInputBase-root': {
                  fontWeight: 400,
                  fontSize: '18px',
                  paddingTop: '0',
                  height: '48px',
                },
              }}
              name={'priceMax'}
              value={formik.values.priceMax}
              onChange={formik.handleChange}
            />
          </Box>
        </Box>

        <Box position={'absolute'} bottom={0} left={0} right={0}>
          <Button variant={'contained'} fullWidth type={'submit'}>
            Apply filters
          </Button>
        </Box>
      </form>
    </Drawer>
  );
};

export default FilterModal;
