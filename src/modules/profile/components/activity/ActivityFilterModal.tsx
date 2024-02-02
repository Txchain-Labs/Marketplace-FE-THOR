import React, { FC } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, IconButton, Drawer, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

import Chip from '@/components/common/Chip';
import LastActivitySelect from '@/components/common/LastActivitySelect';
import { queryTypes, useQueryStates } from 'next-usequerystate';

const defaultFilterValues: {
  listed: boolean;
  unlisted: boolean;
  bidReceived: boolean;
  bidSent: boolean;
  bought: boolean;
  sold: boolean;
  transfer: boolean;
  lastActivity: number;
} = {
  listed: true,
  unlisted: true,
  bidReceived: true,
  bidSent: true,
  bought: true,
  sold: true,
  transfer: true,
  lastActivity: 2,
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setFilterOptions: (filter: any) => void;
}

const ActivityFilterModal: FC<Props> = ({
  isOpen,
  onClose,
  setFilterOptions,
}) => {
  // const dispatch = useDispatch();
  const [filter, setFilter] = useQueryStates({
    listed: queryTypes.boolean.withDefault(true),
    unlisted: queryTypes.boolean.withDefault(true),
    bidReceived: queryTypes.boolean.withDefault(true),
    bidSent: queryTypes.boolean.withDefault(true),
    bought: queryTypes.boolean.withDefault(true),
    sold: queryTypes.boolean.withDefault(true),
    transfer: queryTypes.boolean.withDefault(true),
    lastActivity: queryTypes.integer.withDefault(2),
  });

  const formik = useFormik({
    initialValues: filter,
    validationSchema: Yup.object({
      lastActivity: Yup.number().required(),
    }),
    onSubmit: (values) => {
      setFilter(values);
      setFilterOptions(values);
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

  const handleBidsChipClick = (whichField: 'bidSent' | 'bidReceived') => {
    formik.setFieldValue(whichField, !formik.values[whichField]);
  };
  const handleFavouritChipClick = (whichField: 'listed' | 'unlisted') => {
    formik.setFieldValue(whichField, !formik.values[whichField]);
  };
  const handleOperationChipClick = (
    whichField: 'bought' | 'sold' | 'transfer'
  ) => {
    formik.setFieldValue(whichField, !formik.values[whichField]);
  };
  const handleShowSelectAll = () => {
    if (formik.values.listed && formik.values.unlisted) {
      formik.setFieldValue('listed', false);
      formik.setFieldValue('unlisted', false);
    } else {
      formik.setFieldValue('listed', true);
      formik.setFieldValue('unlisted', true);
    }
  };
  const handleBidsSelectAll = () => {
    if (formik.values.bidReceived && formik.values.bidSent) {
      formik.setFieldValue('bidReceived', false);
      formik.setFieldValue('bidSent', false);
    } else {
      formik.setFieldValue('bidReceived', true);
      formik.setFieldValue('bidSent', true);
    }
  };
  const handleOperationSelectAll = () => {
    if (formik.values.bought && formik.values.sold && formik.values.transfer) {
      formik.setFieldValue('bought', false);
      formik.setFieldValue('sold', false);
      formik.setFieldValue('transfer', false);
    } else {
      formik.setFieldValue('bought', true);
      formik.setFieldValue('sold', true);
      formik.setFieldValue('transfer', true);
    }
  };

  return (
    <Drawer
      sx={{ zIndex: 100000 }}
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
            sx={{
              width: '85px',
              minHeight: '35px',
              padding: '7.5px 10px 5px 10px',
            }}
            onClick={handleReset}
          >
            Reset all
          </Button>
        </Box>
        <Typography variant={'lbl-lg'} color={'primary'} mt={'40px'} mb={'8px'}>
          Status
        </Typography>
        <Box
          mt={'20px'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography variant={'lbl-lg'}>Listed</Typography>
          <Button
            size={'small'}
            sx={{ textTransform: 'none' }}
            onClick={handleShowSelectAll}
          >
            {formik.values.listed && formik.values.unlisted
              ? 'Deselect all'
              : 'Select all'}
          </Button>
        </Box>
        <Box mt={'8px'}>
          <Chip
            label={'Listed'}
            selected={formik.values.listed}
            onClick={() => handleFavouritChipClick('listed')}
          />
          <Chip
            label={'Unlisted'}
            selected={formik.values.unlisted}
            onClick={() => handleFavouritChipClick('unlisted')}
          />
        </Box>
        <Box
          mt={'20px'}
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
            {formik.values.bidReceived && formik.values.bidSent
              ? 'Deselect all'
              : 'Select all'}
          </Button>
        </Box>
        <Box mt={'8px'}>
          <Chip
            label={'Received'}
            selected={formik.values.bidReceived}
            onClick={() => handleBidsChipClick('bidReceived')}
          />
          <Chip
            label={'Sent'}
            selected={formik.values.bidSent}
            onClick={() => handleBidsChipClick('bidSent')}
          />
        </Box>
        <Box
          mt={'20px'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography variant={'lbl-lg'}>Operation</Typography>
          <Button
            size={'small'}
            sx={{ textTransform: 'none' }}
            onClick={handleOperationSelectAll}
          >
            {formik.values.bought &&
            formik.values.sold &&
            formik.values.transfer
              ? 'Deselect all'
              : 'Select all'}
          </Button>
        </Box>
        <Box mt={'8px'}>
          <Chip
            label={'Bought'}
            selected={formik.values.bought}
            onClick={() => handleOperationChipClick('bought')}
          />
          <Chip
            label={'Sold'}
            selected={formik.values.sold}
            onClick={() => handleOperationChipClick('sold')}
          />
          <Chip
            label={'Transfer'}
            selected={formik.values.transfer}
            onClick={() => handleOperationChipClick('transfer')}
          />
        </Box>

        <Typography variant={'lbl-lg'} color={'primary'} mt={'40px'} mb={'8px'}>
          Last activity
        </Typography>
        <LastActivitySelect
          value={formik.values.lastActivity}
          onChange={(value) =>
            formik.handleChange({
              target: {
                name: 'lastActivity',
                value,
              },
            })
          }
        />

        <Box position={'absolute'} bottom={0} left={0} right={0}>
          <Button variant={'contained'} fullWidth type={'submit'}>
            Apply filters
          </Button>
        </Box>
      </form>
    </Drawer>
  );
};

export default ActivityFilterModal;
