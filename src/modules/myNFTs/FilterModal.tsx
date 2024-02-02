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
  privateBids: boolean;
  bids: boolean;
  noBids: boolean;
  currency: number;
  priceMin: string;
  priceMax: string;
} = {
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
        <Typography variant={'lbl-lg'} color={'primary'} mt={'48px'} mb={'8px'}>
          Status
        </Typography>

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
