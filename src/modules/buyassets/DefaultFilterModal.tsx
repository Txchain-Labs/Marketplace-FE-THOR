import React, { FC } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
import { queryTypes, useQueryStates } from 'next-usequerystate';
import _ from 'lodash';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultFilterValues: {
    favourited: boolean;
    notFavourited: boolean;
    privateBids: boolean;
    bids: boolean;
    noBids: boolean;
    currency: number;
    priceMin: string;
    priceMax: string;
  };
}

const DriftFilterModal: FC<Props> = ({
  isOpen,
  onClose,
  defaultFilterValues,
}) => {
  // const dispatch = useDispatch();
  const [filter, setFilter] = useQueryStates({
    favourited: queryTypes.boolean.withDefault(true),
    notFavourited: queryTypes.boolean.withDefault(true),
    privateBids: queryTypes.boolean.withDefault(true),
    bids: queryTypes.boolean.withDefault(true),
    noBids: queryTypes.boolean.withDefault(true),
    currency: queryTypes.integer.withDefault(0),
    priceMin: queryTypes.string.withDefault(''),
    priceMax: queryTypes.string.withDefault(''),
  });

  const formik = useFormik({
    initialValues: filter,
    validationSchema: Yup.object({
      currency: Yup.number().required(),
    }),
    onSubmit: (values) => {
      if (_.isEqual(values, defaultFilterValues)) {
        setFilter({
          favourited: null,
          notFavourited: null,
          privateBids: null,
          bids: null,
          noBids: null,
          currency: null,
          priceMin: null,
          priceMax: null,
        });
      } else {
        setFilter(values);
      }
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
    // dispatch(resetFilter());
  };

  const handleBidsChipClick = (bidType: 'privateBids' | 'bids' | 'noBids') => {
    if (
      (bidType === 'privateBids' &&
        (formik.values['bids'] || formik.values['noBids'])) ||
      (bidType === 'bids' &&
        (formik.values['privateBids'] || formik.values['noBids'])) ||
      (bidType === 'noBids' &&
        (formik.values['bids'] || formik.values['privateBids']))
    ) {
      formik.setFieldValue(bidType, !formik.values[bidType]);
    }
  };

  const handleFavouritChipClick = (
    favouriteStatus: 'favourited' | 'notFavourited'
  ) => {
    if (
      (favouriteStatus === 'favourited' && formik.values['notFavourited']) ||
      (favouriteStatus === 'notFavourited' && formik.values['favourited'])
    ) {
      formik.setFieldValue(favouriteStatus, !formik.values[favouriteStatus]);
    }
  };

  const handleShowSelectAll = () => {
    if (formik.values.favourited || formik.values.notFavourited) {
      formik.setFieldValue('favourited', true);
      formik.setFieldValue('notFavourited', true);
    }
  };

  const handleBidsSelectAll = () => {
    if (
      formik.values.privateBids ||
      formik.values.bids ||
      formik.values.noBids
    ) {
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
          backgroundImage: 'none',
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
            sx={{ width: '85px' }}
            onClick={handleReset}
          >
            Reset all
          </Button>
        </Box>
        <Typography variant={'lbl-lg'} color={'primary'} mt={'20px'} mb={'8px'}>
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
            onClick={handleShowSelectAll}
            disabled={formik.values.favourited && formik.values.notFavourited}
          >
            {'Select all'}
          </Button>
        </Box>
        <Box mt={'8px'}>
          <Chip
            label={'Favorited'}
            selected={formik.values.favourited}
            onClick={() => handleFavouritChipClick('favourited')}
          />
          <Chip
            label={'Not Favorited'}
            selected={formik.values.notFavourited}
            onClick={() => handleFavouritChipClick('notFavourited')}
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
            disabled={formik.values.favourited && formik.values.notFavourited}
          >
            {'Select all'}
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
        <Typography variant={'lbl-lg'} color={'primary'} mt={'20px'} mb={'8px'}>
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

export default DriftFilterModal;
