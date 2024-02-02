import { useDispatch, useSelector } from '@/redux/store';
import { useFormik } from 'formik';
import {
  Typography,
  Box,
  Drawer,
  Button,
  List,
  IconButton,
  TextField,
  Slider,
} from '@mui/material';
import { Close } from '@mui/icons-material';

import CurrencySelect from '@/components/common/CurrencySelect';
import Chip from '@/components/common/Chip';

import {
  closeFilterModal,
  selectFilter,
  selectShowFilter,
  setFilter,
  filterInitialState,
  // applyFilter,
  setFilterStatus,
} from '@/redux/slices/managerFilterSlice';
// import { useGetAvaxFromThor, useGetAvaxFromUsd } from '@/hooks/useOracle';
// import { useChain } from '@/utils/web3Utils';
import { useEffect, useState } from 'react';
import { getFilterStatus } from './Helper';
import { NAVBAR_HEIGHT } from '@/utils/constants';
type Props = {
  data?: Array<any>;
  pageType: string;
  nodeType: string;
  tier: string;
};

const FilterDrawer = ({ pageType, nodeType, tier }: Props) => {
  const [currentType, setCurrentType] = useState(nodeType);
  const [currentTier, setCurrentTier] = useState(tier);
  const filters = useSelector(selectFilter);
  const showFilters = useSelector(selectShowFilter);
  const dispatch = useDispatch();
  // const chain = useChain();
  // const { data: avaxFromUsd } = useGetAvaxFromUsd('1', chain);
  // const { data: avaxFromThor } = useGetAvaxFromThor('1', chain);
  const formik = useFormik({
    initialValues: filterInitialState,
    onSubmit: async (values) => {
      await dispatch(setFilter(values));
      const status = await getFilterStatus(values, pageType, nodeType, tier);
      console.log('status of filter', status);
      dispatch(setFilterStatus(status));

      // dispatch(
      //   applyFilter({
      //     data: data,
      //     pageType: pageType,
      //     nodeType: nodeType,
      //     tier: tier,
      //     usd2Avax: JSON.stringify(avaxFromUsd),
      //     thor2avax: JSON.stringify(avaxFromThor),
      //   })
      // );
      dispatch(closeFilterModal());
      //  setFilteredData(result);
    },
  });
  const handleReset = () => {
    formik.resetForm({
      values: filterInitialState,
    });
    // resetFilters(activeType);
  };

  useEffect(() => {
    if (nodeType !== currentType || tier !== currentTier) {
      formik.resetForm({
        values: filterInitialState,
      });
      setCurrentType(nodeType);
      setCurrentTier(tier);
    }
  }, [nodeType, tier, formik, currentTier, currentType]);
  const handleChange = (field: string, data: any) => {
    formik.setFieldValue(field, data);
  };

  return (
    <>
      <Drawer
        slotProps={{
          backdrop: {
            invisible: true,
          },
        }}
        PaperProps={{
          sx: {
            p: '10px 16px 16px',
            mt: NAVBAR_HEIGHT,
            width: {
              miniMobile: '100vw',
              sm: '385px',
            },
            height: {
              miniMobile: `calc(100vh - ${NAVBAR_HEIGHT.miniMobile})`,
              sm: `calc(100vh - ${NAVBAR_HEIGHT.sm})`,
            },
            backgroundImage: 'none',
          },
        }}
        anchor={'right'}
        elevation={1}
        open={filters?.isModalOpen}
        onClose={() => dispatch(closeFilterModal())}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mb={'8px'}
        >
          <Typography variant={'h5'}>Filter options</Typography>
          <IconButton onClick={() => dispatch(closeFilterModal())}>
            <Close />
          </IconButton>
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <List
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
            disablePadding
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
            <Typography variant={'lbl-lg'} color={'primary'}>
              Status
            </Typography>
            {/* //favs box */}
            {showFilters?.favs && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  mt={'8px'}
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Typography variant={'lbl-lg'}>Show</Typography>
                  {formik?.values?.favs?.favourited &&
                  formik?.values?.favs?.notFavourited ? (
                    <Button
                      size={'small'}
                      sx={{ textTransform: 'none' }}
                      onClick={() =>
                        handleChange('favs', {
                          favourited: false,
                          notFavourited: false,
                        })
                      }
                    >
                      <Typography variant="lbl-md">DeSelect All</Typography>
                    </Button>
                  ) : (
                    <Button
                      size={'small'}
                      sx={{ textTransform: 'none' }}
                      onClick={() =>
                        handleChange('favs', {
                          favourited: true,
                          notFavourited: true,
                        })
                      }
                    >
                      <Typography variant="lbl-md">Select All</Typography>
                    </Button>
                  )}
                </Box>

                <Box mt={'8px'}>
                  <Chip
                    label={'Favorited'}
                    selected={formik?.values?.favs?.favourited}
                    onClick={() =>
                      handleChange('favs', {
                        ...formik?.values?.favs,
                        favourited: !formik?.values?.favs?.favourited,
                      })
                    }
                  />
                  <Chip
                    label={'Not Favorited'}
                    selected={formik?.values?.favs?.notFavourited}
                    onClick={() =>
                      handleChange('favs', {
                        ...formik?.values?.favs,
                        notFavourited: !formik?.values?.favs?.notFavourited,
                      })
                    }
                  />
                </Box>
              </Box>
            )}
            {/* //status box */}
            {showFilters?.status && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  mt={'8px'}
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Typography variant={'lbl-lg'}>Listed</Typography>
                  {formik?.values?.status?.listed &&
                  formik?.values?.status?.notListed ? (
                    <Button
                      size={'small'}
                      sx={{ textTransform: 'none' }}
                      onClick={() =>
                        handleChange('status', {
                          listed: false,
                          notListed: false,
                        })
                      }
                    >
                      <Typography variant="lbl-md">DeSelect All</Typography>
                    </Button>
                  ) : (
                    <Button
                      size={'small'}
                      sx={{ textTransform: 'none' }}
                      onClick={() =>
                        handleChange('status', {
                          listed: true,
                          notListed: true,
                        })
                      }
                    >
                      <Typography variant="lbl-md">Select All</Typography>
                    </Button>
                  )}
                </Box>

                <Box mt={'8px'}>
                  <Chip
                    label={'Listed'}
                    selected={formik?.values?.status?.listed}
                    onClick={() =>
                      handleChange('status', {
                        ...formik?.values?.status,
                        listed: !formik?.values?.status?.listed,
                      })
                    }
                  />
                  <Chip
                    label={'Not Listed'}
                    selected={formik?.values?.status?.notListed}
                    onClick={() =>
                      handleChange('status', {
                        ...formik?.values?.status,
                        notListed: !formik?.values?.status?.notListed,
                      })
                    }
                  />
                </Box>
              </Box>
            )}
            {/* //bids box */}

            {showFilters?.bids && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  mt={'8px'}
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Typography variant={'lbl-lg'}>Bids</Typography>
                  {formik?.values?.bids?.bids &&
                  formik?.values?.bids?.privateBids &&
                  formik?.values?.bids?.noBids ? (
                    <Button
                      size={'small'}
                      sx={{ textTransform: 'none' }}
                      onClick={() =>
                        handleChange('bids', {
                          bids: false,
                          privateBids: false,
                          noBids: false,
                        })
                      }
                    >
                      <Typography variant="lbl-md">DeSelect All</Typography>
                    </Button>
                  ) : (
                    <Button
                      size={'small'}
                      sx={{ textTransform: 'none' }}
                      onClick={() =>
                        handleChange('bids', {
                          bids: true,
                          privateBids: true,
                          noBids: true,
                        })
                      }
                    >
                      <Typography variant="lbl-md">Select All</Typography>
                    </Button>
                  )}
                </Box>

                <Box mt={'8px'}>
                  <Chip
                    label={'Open Bids'}
                    selected={formik?.values?.bids?.bids}
                    onClick={() =>
                      handleChange('bids', {
                        ...formik?.values?.bids,
                        bids: !formik?.values?.bids?.bids,
                      })
                    }
                  />
                  <Chip
                    label={'Private Open Bids'}
                    selected={formik?.values?.bids?.privateBids}
                    onClick={() =>
                      handleChange('bids', {
                        ...formik?.values?.bids,
                        privateBids: !formik?.values?.bids?.privateBids,
                      })
                    }
                  />
                  <Chip
                    label={'No Bids'}
                    selected={formik?.values?.bids?.noBids}
                    onClick={() =>
                      handleChange('bids', {
                        ...formik?.values?.bids,
                        noBids: !formik?.values?.bids?.noBids,
                      })
                    }
                  />
                </Box>
              </Box>
            )}

            {/* //perks box */}
            {showFilters?.perks && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  mt={'8px'}
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Typography variant={'lbl-lg'}>Applied Perks</Typography>
                  {formik?.values?.perks?.withPerks &&
                  formik?.values?.perks?.withoutPerks ? (
                    <Button
                      size={'small'}
                      sx={{ textTransform: 'none' }}
                      onClick={() =>
                        handleChange('perks', {
                          withPerks: false,
                          withoutPerks: false,
                        })
                      }
                    >
                      <Typography variant="lbl-md">DeSelect All</Typography>
                    </Button>
                  ) : (
                    <Button
                      size={'small'}
                      sx={{ textTransform: 'none' }}
                      onClick={() =>
                        handleChange('perks', {
                          withPerks: true,
                          withoutPerks: true,
                        })
                      }
                    >
                      <Typography variant="lbl-md">Select All</Typography>
                    </Button>
                  )}
                </Box>

                <Box mt={'8px'}>
                  <Chip
                    label={'With Perks'}
                    selected={formik?.values?.perks?.withPerks}
                    onClick={() =>
                      handleChange('perks', {
                        ...formik?.values?.perks,
                        withPerks: !formik?.values?.perks?.withPerks,
                      })
                    }
                  />
                  <Chip
                    label={'Without Perks'}
                    selected={formik?.values?.perks?.withoutPerks}
                    onClick={() =>
                      handleChange('perks', {
                        ...formik?.values?.perks,
                        withoutPerks: !formik?.values?.perks?.withoutPerks,
                      })
                    }
                  />
                </Box>
              </Box>
            )}

            {/* //tier box */}
            {showFilters?.tier && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  mt={'8px'}
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Typography variant={'lbl-lg'}>Tier</Typography>
                  {formik?.values?.tier?.thor && formik?.values?.tier?.odin ? (
                    <Button
                      size={'small'}
                      sx={{ textTransform: 'none' }}
                      onClick={() =>
                        handleChange('tier', { thor: false, odin: false })
                      }
                    >
                      <Typography variant="lbl-md">DeSelect All</Typography>
                    </Button>
                  ) : (
                    <Button
                      size={'small'}
                      sx={{ textTransform: 'none' }}
                      onClick={() =>
                        handleChange('tier', { thor: true, odin: true })
                      }
                    >
                      <Typography variant="lbl-md">Select All</Typography>
                    </Button>
                  )}
                </Box>

                <Box mt={'8px'}>
                  <Chip
                    label={'Thor'}
                    selected={formik?.values?.tier?.thor}
                    onClick={() =>
                      handleChange('tier', {
                        ...formik?.values?.tier,
                        thor: !formik?.values?.tier?.thor,
                      })
                    }
                  />
                  <Chip
                    label={'Odin'}
                    selected={formik?.values?.tier?.odin}
                    onClick={() =>
                      handleChange('tier', {
                        ...formik?.values?.tier,
                        odin: !formik?.values?.tier?.odin,
                      })
                    }
                  />
                </Box>
              </Box>
            )}

            {/*  //condition box */}
            {/* {showFilters?.condition && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  mt={'8px'}
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Typography variant={'lbl-lg'} color={palette.primary.storm}>
                    Condition
                  </Typography>
                  {filters?.condition?.inactive &&
                  filters?.condition?.inuse &&
                  filters?.condition?.unclaimed &&
                  filters?.condition?.claimed ? (
                    <Button
                      size={'small'}
                      sx={{ textTransform: 'none' }}
                      onClick={() =>
                        dispatch(
                          setFilter({
                            condition: {
                              inactive: false,
                              inuse: false,
                              unclaimed: false,
                              claimed: false,
                            },
                          })
                        )
                      }
                    >
                      <Typography variant="lbl-md">DeSelect All</Typography>
                    </Button>
                  ) : (
                    <Button
                      size={'small'}
                      sx={{ textTransform: 'none' }}
                      onClick={() =>
                        dispatch(
                          setFilter({
                            condition: {
                              inactive: true,
                              inuse: true,
                              unclaimed: true,
                              claimed: true,
                            },
                          })
                        )
                      }
                    >
                      <Typography variant="lbl-md">Select All</Typography>
                    </Button>
                  )}
                </Box>

                <Box mt={'8px'}>
                  <Chip
                    label={
                      <Box display={'flex'} alignItems={'center'}>
                        <Typography lineHeight={'180%'} variant={'p-md'}>
                          Inactive
                        </Typography>
                        <Box
                          display={
                            filters?.condition?.inactive ? 'flex' : 'none'
                          }
                          ml={'8px'}
                        >
                          <Close />
                        </Box>
                      </Box>
                    }
                    color={filters?.condition?.inactive ? 'primary' : undefined}
                    variant={
                      !filters?.condition?.inactive ? 'outlined' : undefined
                    }
                    sx={{ height: '32px', mr: '8px', mb: '8px' }}
                    onClick={() =>
                      dispatch(
                        setFilter({
                          condition: {
                            inactive: !filters.condition.inactive,
                          },
                        })
                      )
                    }
                  />
                  <Chip
                    label={
                      <Box display={'flex'} alignItems={'center'}>
                        <Typography lineHeight={'180%'} variant={'p-md'}>
                          In use
                        </Typography>
                        <Box
                          display={filters?.condition?.inuse ? 'flex' : 'none'}
                          ml={'8px'}
                        >
                          <Close />
                        </Box>
                      </Box>
                    }
                    color={filters?.condition?.inuse ? 'primary' : undefined}
                    variant={
                      !filters?.condition?.inuse ? 'outlined' : undefined
                    }
                    sx={{ height: '32px', mr: '8px', mb: '8px' }}
                    onClick={() =>
                      dispatch(
                        setFilter({
                          condition: {
                            inuse: !filters.condition.inuse,
                          },
                        })
                      )
                    }
                  />
                  <Chip
                    label={
                      <Box display={'flex'} alignItems={'center'}>
                        <Typography lineHeight={'180%'} variant={'p-md'}>
                          Unclaimed
                        </Typography>
                        <Box
                          display={
                            filters?.condition?.unclaimed ? 'flex' : 'none'
                          }
                          ml={'8px'}
                        >
                          <Close />
                        </Box>
                      </Box>
                    }
                    color={
                      filters?.condition?.unclaimed ? 'primary' : undefined
                    }
                    variant={
                      !filters?.condition?.unclaimed ? 'outlined' : undefined
                    }
                    sx={{ height: '32px', mr: '8px', mb: '8px' }}
                    onClick={() =>
                      dispatch(
                        setFilter({
                          condition: {
                            unclaimed: !filters.condition.unclaimed,
                          },
                        })
                      )
                    }
                  />
                  <Chip
                    label={
                      <Box display={'flex'} alignItems={'center'}>
                        <Typography lineHeight={'180%'} variant={'p-md'}>
                          Claimed
                        </Typography>
                        <Box
                          display={
                            filters?.condition?.claimed ? 'flex' : 'none'
                          }
                          ml={'8px'}
                        >
                          <Close />
                        </Box>
                      </Box>
                    }
                    color={filters?.condition?.claimed ? 'primary' : undefined}
                    variant={
                      !filters?.condition?.claimed ? 'outlined' : undefined
                    }
                    sx={{ height: '32px', mr: '8px', mb: '8px' }}
                    onClick={() =>
                      dispatch(
                        setFilter({
                          condition: {
                            claimed: !filters.condition.claimed,
                          },
                        })
                      )
                    }
                  />
                </Box>
              </Box>
            )} */}

            {/* //price box */}
            {showFilters?.price &&
              formik?.values?.status?.listed &&
              !formik?.values?.status?.notListed && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box
                    mt={'8px'}
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Typography variant={'lbl-lg'} color={'primary'}>
                      Price
                    </Typography>
                  </Box>

                  <Box display={'flex'}>
                    <CurrencySelect
                      value={formik?.values?.price?.currency}
                      onChange={(value) =>
                        handleChange('price', {
                          ...formik?.values?.price,
                          currency: value,
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
                        InputProps={{
                          inputProps: {
                            min: 0,
                          },
                        }}
                        value={formik?.values?.price?.min}
                        onChange={(event) =>
                          handleChange('price', {
                            ...formik?.values?.price,
                            min: event.target.value,
                          })
                        }
                      />

                      <Typography
                        sx={{ display: 'flex', alignItems: 'center' }}
                        variant="lbl-md"
                        m={'auto 10px'}
                      >
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
                        InputProps={{
                          inputProps: {
                            min: 0,
                          },
                        }}
                        value={formik?.values?.price?.max}
                        onChange={(event) =>
                          handleChange('price', {
                            ...formik?.values?.price,
                            max: event.target.value,
                          })
                        }
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            {/* //rewards box */}
            {showFilters?.pendingRewards && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  marginTop: '8px',
                }}
              >
                <Typography
                  variant="lbl-lg"
                  sx={{
                    color: '#F3523F',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  Pending Rewards
                </Typography>

                <Box display={'flex'}>
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
                    name={'pendingRewardsMin'}
                    value={formik?.values?.pendingRewards?.min}
                    onChange={(event) =>
                      handleChange('pendingRewards', {
                        ...formik?.values?.pendingRewards,
                        min: event.target.value,
                      })
                    }
                  />
                  <Typography variant="lbl-md" m={'auto 16px'}>
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
                    name={'pendingRewardsMax'}
                    value={formik?.values?.pendingRewards?.max}
                    onChange={(event) =>
                      handleChange('pendingRewards', {
                        ...formik?.values?.pendingRewards,
                        max: event.target.value,
                      })
                    }
                  />
                </Box>
              </Box>
            )}
            {/* //due date box */}
            {showFilters?.dueDate && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  marginTop: '8px',
                }}
              >
                <Typography
                  variant="lbl-lg"
                  sx={{
                    color: '#F3523F',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  Due Date
                </Typography>

                <Box
                  sx={{ width: '100%', padding: '0px 6px', overflowX: 'clip' }}
                >
                  <Slider
                    name={'dueDate'}
                    getAriaLabel={() => 'Minimum distance'}
                    value={formik?.values?.dueDate}
                    // onChange={handleChange}
                    onChange={formik.handleChange}
                    valueLabelDisplay="auto"
                    // getAriaValueText={valuetext}
                    valueLabelFormat={(value) => `${value} days`}
                    disableSwap
                    min={0}
                    max={366}
                    marks={[
                      {
                        value: 0,
                        label: '',
                      },
                      {
                        value: 7,
                        label: '7',
                      },
                      {
                        value: 30,
                        label: '30',
                      },
                      {
                        value: 90,
                        label: '90',
                      },
                      {
                        value: 366,
                        label: '+365',
                      },
                    ]}
                  />
                </Box>
              </Box>
            )}
          </List>

          {/* <Box sx={{ width: '100%',  }}> */}
          <Button
            type="submit"
            sx={{
              borderRadius: '0%',
              width: pageType === 'node' ? '100%' : 'auto',
              maxWidth: '100%',
              position: pageType !== 'node' ? 'absolute' : 'relative',
              bottom: pageType !== 'node' ? '10px' : 'auto',
              right: pageType !== 'node' ? '10px' : 'auto',
              left: pageType !== 'node' ? '10px' : 'auto',
            }}
            variant="contained"
            fullWidth
          >
            <Typography variant="lbl-md">Apply Filter</Typography>
          </Button>
          {/* </Box> */}
        </form>
      </Drawer>
    </>
  );
};

export default FilterDrawer;
