import * as React from 'react';
import { Grid, Button, Typography, Checkbox } from '@mui/material';

import { Box } from '@mui/system';
import Image from 'next/image';

import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import MultiRangeSlider from '../../../../components/common/MultiRangeSlider';

const sxFilterOptionsSwitchLeft = {
  textAlign: 'left',
  cursor: 'pointer',
};
const sxFilterOptionsPanel = {
  position: 'fixed',
  zIndex: '10002',
  top: '0',
  right: '-10px', ///// hide scrollbar of parent
  backgroundColor: 'white',
  width: { md: '25vw', sm: '50vw', xs: '60vw' },
  maxWidth: { md: '385px', sm: '385px' },
  minWidth: '320px',
  height: '100vh',
  borderLeft: '1px solid rgba(0, 0, 0, 0.3)',
  padding: '20px',
  overflowY: 'auto',
};
const sxBtnReset = {
  width: '100px',
  display: 'none', ///// display: 'flex',
  flex: 'right',
  lineHeight: '1.5',
};
const sxResetLabel = {
  marginTop: '5px',
  marginLeft: '5px',
};

interface FilterOptionsProps {
  filterOptions: {
    statusListing: boolean;
    statusTransfer: boolean;
    statusBid: boolean;
    statusSold: boolean;
    lastActivity24hours: boolean;
    lastActivityWeek: boolean;
    lastActivity30days: boolean;
    lastActivityYear: boolean;
    dateRangeFrom: Date;
    dateRangeTo: Date;
  };
  setFilterOptions: any;
  filterOptionsSwitch: any;
  setFilterOptionsSwitch: any;
}

const FilteringOptions: any = (filterOptionsProps: FilterOptionsProps) => {
  const {
    filterOptions,
    setFilterOptions,
    filterOptionsSwitch,
    setFilterOptionsSwitch,
  } = filterOptionsProps;

  return (
    <>
      <Box
        sx={{
          ...sxFilterOptionsPanel,
          width: '100vw',
          display: filterOptionsSwitch ? 'initial' : 'none',
        }}
      >
        <Box mt="3px" sx={sxFilterOptionsSwitchLeft}>
          <Image
            height={20}
            width={24}
            src="/images/flex-icon.svg"
            onClick={() => {
              setFilterOptionsSwitch(false);
            }}
          />
        </Box>
        <Box mt="15px">
          <Grid container spacing={2}>
            <Grid item md={8} xs={8} mt={1}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Nexa-Bold',
                  fontSize: '23.5px',
                  fontWeight: 400,
                  lineHeight: '21.22px',
                  letterSpacing: '0.04em',
                  textAlign: 'left',
                  paddingTop: '20px',
                  display: 'flex',
                }}
              >
                Filter Options
              </Typography>
            </Grid>
            <Grid item md={4} xs={4} mt={2}>
              <Button
                variant="activity_view"
                sx={sxBtnReset}
                onClick={() => {
                  setFilterOptions({
                    ...filterOptions,
                    statusListing: false,
                    statusTransfer: false,
                    statusBid: false,
                    statusSold: false,
                    lastActivity24hours: false,
                    lastActivityWeek: false,
                    lastActivity30days: false,
                    lastActivityYear: false,
                    dateRangeFrom: new Date(2022, 0, 1),
                    dateRangeTo: new Date(),
                  });
                }}
              >
                <RefreshIcon /> <Typography sx={sxResetLabel}>RESET</Typography>
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={5} sx={{ width: '100%' }}>
            <Grid item md={10} xs={10}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Nexa-Bold',
                  fontSize: '20px',
                  fontWeight: 400,
                  lineHeight: '21.22px',
                  letterSpacing: '0.04em',
                  textAlign: 'left',
                  paddingTop: '20px',
                  display: 'flex',
                }}
              >
                Status
              </Typography>
            </Grid>
            <Grid item md={2} xs={2} mt={1.7}>
              <KeyboardArrowDownIcon sx={{ fontSize: '30px' }} />
            </Grid>
          </Grid>
          <Grid container spacing={-1}>
            <Grid item md={10} xs={10}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Nexa-Bold',
                  color: '#777777',
                  fontSize: '18px',
                  fontWeight: 400,
                  paddingLeft: '40px',
                  lineHeight: '2.75',
                  letterSpacing: '0.04em',
                  textAlign: 'left',
                  display: 'flex',
                }}
              >
                Listed / Unlisted
              </Typography>
            </Grid>
            <Grid item md={2} xs={2}>
              <Checkbox
                id={'status-check'}
                sx={{
                  'paddingRight': '30px',
                  '&.Mui-checked': { color: 'red' },
                }}
                checked={filterOptions.statusListing}
                onChange={(_, checked) => {
                  setFilterOptions({
                    ...filterOptions,
                    statusListing: checked,
                  });
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={-1}>
            <Grid item md={10} xs={10}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Nexa-Bold',
                  color: '#777777',
                  fontSize: '18px',
                  fontWeight: 400,
                  paddingLeft: '40px',
                  lineHeight: '2.75',
                  letterSpacing: '0.04em',
                  textAlign: 'left',
                  display: 'flex',
                }}
              >
                Transfer
              </Typography>
            </Grid>
            <Grid item md={2} xs={2}>
              <Checkbox
                id={'status-check'}
                sx={{
                  'paddingRight': '30px',
                  '&.Mui-checked': { color: 'red' },
                }}
                checked={filterOptions.statusTransfer}
                onChange={(_, checked) => {
                  setFilterOptions({
                    ...filterOptions,
                    statusTransfer: checked,
                  });
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={-1}>
            <Grid item md={10} xs={10}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Nexa-Bold',
                  color: '#777777',
                  fontSize: '18px',
                  fontWeight: 400,
                  paddingLeft: '40px',
                  lineHeight: '2.75',
                  letterSpacing: '0.04em',
                  textAlign: 'left',
                  display: 'flex',
                }}
              >
                Bid received / Bid sent
              </Typography>
            </Grid>
            <Grid item md={2} xs={2}>
              <Checkbox
                id={'status-check'}
                sx={{
                  'paddingRight': '30px',
                  '&.Mui-checked': { color: 'red' },
                }}
                checked={filterOptions.statusBid}
                onChange={(_, checked) => {
                  setFilterOptions({
                    ...filterOptions,
                    statusBid: checked,
                  });
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={-1}>
            <Grid item md={10} xs={10}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Nexa-Bold',
                  color: '#777777',
                  fontSize: '18px',
                  fontWeight: 400,
                  paddingLeft: '40px',
                  lineHeight: '2.75',
                  letterSpacing: '0.04em',
                  textAlign: 'left',
                  display: 'flex',
                }}
              >
                Bought / Sold
              </Typography>
            </Grid>
            <Grid item md={2} xs={2}>
              <Checkbox
                id={'status-check'}
                sx={{
                  'paddingRight': '30px',
                  '&.Mui-checked': { color: 'red' },
                }}
                checked={filterOptions.statusSold}
                onChange={(_, checked) => {
                  setFilterOptions({
                    ...filterOptions,
                    statusSold: checked,
                  });
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} mt={1} sx={{ width: '100%' }}>
            <Grid item md={10} xs={10}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Nexa-Bold',
                  fontSize: '20px',
                  fontWeight: 400,
                  lineHeight: '21.22px',
                  letterSpacing: '0.04em',
                  textAlign: 'left',
                  paddingTop: '20px',
                  display: 'flex',
                }}
              >
                Last Activity
              </Typography>
            </Grid>
            <Grid item md={2} xs={2} mt={1.7}>
              <KeyboardArrowDownIcon sx={{ fontSize: '30px' }} />
            </Grid>
          </Grid>
          <Grid container spacing={-1}>
            <Grid item md={10} xs={10}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Nexa-Bold',
                  color: '#777777',
                  fontSize: '18px',
                  fontWeight: 400,
                  paddingLeft: '40px',
                  lineHeight: '2.75',
                  letterSpacing: '0.04em',
                  textAlign: 'left',
                  display: 'flex',
                }}
              >
                Last 24 Hours
              </Typography>
            </Grid>
            <Grid item md={2} xs={2}>
              <Checkbox
                id={'status-check'}
                sx={{
                  'paddingRight': '30px',
                  '&.Mui-checked': { color: 'red' },
                }}
                checked={filterOptions.lastActivity24hours}
                onChange={(_, checked) => {
                  if (checked)
                    setFilterOptions({
                      ...filterOptions,
                      lastActivity24hours: checked,
                    });
                  else
                    setFilterOptions({
                      ...filterOptions,
                      lastActivity24hours: checked,
                      lastActivityWeek: checked,
                      lastActivity30days: checked,
                      lastActivityYear: checked,
                    });
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={-1}>
            <Grid item md={10} xs={10}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Nexa-Bold',
                  color: '#777777',
                  fontSize: '18px',
                  fontWeight: 400,
                  paddingLeft: '40px',
                  lineHeight: '2.75',
                  letterSpacing: '0.04em',
                  textAlign: 'left',
                  display: 'flex',
                }}
              >
                Last week
              </Typography>
            </Grid>
            <Grid item md={2} xs={2}>
              <Checkbox
                id={'status-check'}
                sx={{
                  'paddingRight': '30px',
                  '&.Mui-checked': { color: 'red' },
                }}
                checked={filterOptions.lastActivityWeek}
                onChange={(_, checked) => {
                  if (checked)
                    setFilterOptions({
                      ...filterOptions,
                      lastActivity24hours: checked,
                      lastActivityWeek: checked,
                    });
                  else {
                    setFilterOptions({
                      ...filterOptions,
                      lastActivityWeek: checked,
                      lastActivity30days: checked,
                      lastActivityYear: checked,
                    });
                  }
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={-1}>
            <Grid item md={10} xs={10}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Nexa-Bold',
                  color: '#777777',
                  fontSize: '18px',
                  fontWeight: 400,
                  paddingLeft: '40px',
                  lineHeight: '2.75',
                  letterSpacing: '0.04em',
                  textAlign: 'left',
                  display: 'flex',
                }}
              >
                Last 30 days
              </Typography>
            </Grid>
            <Grid item md={2} xs={2}>
              <Checkbox
                id={'status-check'}
                sx={{
                  'paddingRight': '30px',
                  '&.Mui-checked': { color: 'red' },
                }}
                checked={filterOptions.lastActivity30days}
                onChange={(_, checked) => {
                  if (checked)
                    setFilterOptions({
                      ...filterOptions,
                      lastActivity24hours: checked,
                      lastActivityWeek: checked,
                      lastActivity30days: checked,
                    });
                  else {
                    setFilterOptions({
                      ...filterOptions,
                      lastActivity30days: checked,
                      lastActivityYear: checked,
                    });
                  }
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={-1}>
            <Grid item md={10} xs={10}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Nexa-Bold',
                  color: '#777777',
                  fontSize: '18px',
                  fontWeight: 400,
                  paddingLeft: '40px',
                  lineHeight: '2.75',
                  letterSpacing: '0.04em',
                  textAlign: 'left',
                  display: 'flex',
                }}
              >
                Last year
              </Typography>
            </Grid>
            <Grid item md={2} xs={2}>
              <Checkbox
                id={'status-check'}
                sx={{
                  'paddingRight': '30px',
                  '&.Mui-checked': { color: 'red' },
                }}
                checked={filterOptions.lastActivityYear}
                onChange={(_, checked) => {
                  setFilterOptions({
                    ...filterOptions,
                    lastActivityYear: checked,
                  });
                  if (checked)
                    setFilterOptions({
                      ...filterOptions,
                      lastActivity24hours: checked,
                      lastActivityWeek: checked,
                      lastActivity30days: checked,
                      lastActivityYear: checked,
                    });
                  else
                    setFilterOptions({
                      ...filterOptions,
                      lastActivityYear: checked,
                    });
                }}
              />
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            mt={1}
            sx={{ width: '100%', display: 'none' }}
          >
            <Grid item md={10} xs={10}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Nexa-Bold',
                  fontSize: '20px',
                  fontWeight: 400,
                  lineHeight: '21.22px',
                  letterSpacing: '0.04em',
                  textAlign: 'left',
                  paddingTop: '20px',
                  display: 'flex',
                }}
              >
                Date Range
              </Typography>
            </Grid>
            <Grid item md={2} xs={2} mt={1.7}>
              <KeyboardArrowDownIcon sx={{ fontSize: '30px' }} />
            </Grid>
          </Grid>

          <Box sx={{ display: 'none' }}>
            <MultiRangeSlider
              min={new Date(2022, 0, 1).getTime()}
              max={new Date().getTime()}
              from={filterOptions.dateRangeFrom.getTime()}
              to={filterOptions.dateRangeTo.getTime()}
              onChange={() => {
                //onChange={(values: any) => {
                // setFilterOptions({
                //   ...filterOptions,
                //   dateRangeFrom: new Date(values.min),
                //   dateRangeTo: new Date(values.max),
                // });
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default FilteringOptions;
