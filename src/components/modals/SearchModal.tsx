import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import {
  Typography,
  InputBase,
  Button,
  Container,
  Avatar,
} from '@mui/material';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

import debounce from 'lodash.debounce';
import { AuthService } from '../../services/auth.service';
import { collectionsService } from '../../services/collection.service';
import InfiniteScroll from 'react-infinite-scroller';
import { useChain } from '../../utils/web3Utils';

import { User } from '../../models/User';
import { nftsService } from '../../services/nft.service';

import CommonLoader from '../../components/common/CommonLoader';

import Lotties from 'react-lottie';
import loaderAnimation from '../../lotties/LoaderAnimation.json';

import { useCollections } from '../../hooks/collections';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const counterMap = new Map();

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  searchVal: string;
}

export default function FullScreenDialog({
  open,
  onClose,
  searchVal,
}: SimpleDialogProps) {
  useEffect(() => {
    setSearch(searchVal);
  }, [searchVal]);

  const router = useRouter();
  // const data = useSelector((state: any) => state.dummy.data);

  const chain = useChain();
  const chainId = useMemo(() => chain?.id ?? 43114, [chain]);

  const OG_ODIN =
    chainId === 43114
      ? '0x7325e3564B89968D102B3261189EA44c0f5f1a8e'
      : '0x1De3ebd258f7603888c83A339049501AeaFc6581';
  const OG_THOR =
    chainId === 43114
      ? '0x825189515d0A7756436F0eFb6e4bE5A5aF87e21D'
      : '0x0Be69fbD4955eB19E4F6D2f58338592be75476A8';

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const [collectionData, setCollectionData] = useState([]);
  const [nfts, setNFTs] = useState([]);

  const [hasMoreSearchToLoad, setHasMoreSearchToLoad] = useState(false);

  const [odins, setOdins] = useState([]);
  const [thors, setThors] = useState([]);

  const [collectionItems, setCollectionItems] = useState(counterMap);

  const { data: collections }: { data: any; isLoading: boolean } =
    useCollections('');

  useEffect(() => {
    collections?.records.map((item: any) => {
      counterMap.set(item.address, item.collection_size);
      setCollectionItems(counterMap);
    });
  }, [collections?.records]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    const filters = {
      keyword: search,
    };
    setHasMoreSearchToLoad(true);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises

    (async () => {
      const promiseCollections = collectionsService.getCollections(filters);
      const promiseNfts = nftsService.getNFTs({ ...filters, page });

      const promiseNodes1 = nftsService.getNodes({
        ...filters,
        page,
        OG_ODIN: OG_ODIN,
        chainId: chainId,
      });

      const promiseNodes2 = nftsService.getNodes({
        ...filters,
        page,
        OG_THOR: OG_THOR,
        chainId: chainId,
      });
      const promises = [
        promiseCollections,
        promiseNfts,
        promiseNodes1,
        promiseNodes2,
      ];
      if (search?.length > 2) {
        const promiseSearchNodes1 = nftsService.getSearchNodes({
          ...filters,
          page,
          OG_ODIN: OG_ODIN,
        });

        const promiseSearchNodes2 = nftsService.getSearchNodes({
          ...filters,
          page,
          OG_THOR: OG_THOR,
        });
        promises.push(promiseSearchNodes1);
        promises.push(promiseSearchNodes2);
      }
      Promise.allSettled(promises).then((results: any) => {
        if (results[0]?.value?.data?.code === 200) {
          setCollectionData(results[0]?.value?.data?.data?.records);
        }
        if (results[1]?.value?.data?.code === 200) {
          setNFTs(results[1]?.value?.data?.data?.records);
        }

        if (search?.length > 2) {
          if (results[4]?.value?.data?.code === 200) {
            setOdins(results[4]?.value?.data?.data?.result);
          }
          if (results[5]?.value?.data?.code === 200) {
            setThors(results[5]?.value?.data?.data?.result);
          }
        } else {
          if (results[2]?.value?.data?.code === 200) {
            setOdins(results[2]?.value.data.data);
          }
          if (results[3]?.value?.data?.code === 200) {
            setThors(results[3]?.value?.data?.data);
          }
        }

        setHasMoreSearchToLoad(false);
      });
    })();
  }, [search, page, OG_THOR, OG_ODIN, chainId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const debouncedEventHandler = useMemo(() => debounce(handleChange, 1000), []);

  useEffect(() => {
    return () => {
      debouncedEventHandler.cancel();
    };
  }, [debouncedEventHandler]);

  useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.style.overflow = open ? 'hidden' : 'auto';
    }
  }, [open]);

  const [topUsers, setTopUsers] = useState<User[] | undefined>([]);
  const [filteredTopUsers, setFilteredTopUsers] = useState<User[] | undefined>(
    []
  );

  useEffect(() => {
    void AuthService.getUsers().then((res) => {
      if (res?.data?.code === 200) {
        const TopUsers: User[] = [];
        const FilteredTopUsers: User[] = [];

        for (let i = 0; i < res?.data?.data?.count; i++) {
          const obj: User = {
            address: res?.data?.data?.rows?.[i]?.address,
            username: res?.data?.data?.rows?.[i]?.username,
          };
          TopUsers.push(obj);
        }
        setTopUsers(TopUsers);

        for (let i = 0; i < Math.min(5, res?.data?.data?.rows?.length); i++) {
          const obj: User = {
            address: res?.data?.data?.rows?.[i]?.address,
            username: res?.data?.data?.rows?.[i]?.username,
          };
          FilteredTopUsers.push(obj);
        }
        setFilteredTopUsers(FilteredTopUsers);
      }
    });
  }, []);

  useEffect(() => {
    const FilteredTopUsers: any = topUsers?.filter(({ username }) =>
      username?.toLowerCase().includes(search?.toLowerCase())
    );
    setFilteredTopUsers(FilteredTopUsers.slice(0, 5));
  }, [search, topUsers]);

  const handleDragStart = (e: any) => {
    e?.preventDefault();
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleClose = () => {
    onClose();
    setSearch('');
  };

  return (
    <div style={{ overflowY: 'auto' }}>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        BackdropProps={{
          style: {
            opacity: 0,
          },
        }}
        PaperProps={{
          style: {
            background: 'rgba(255, 255, 255, 0.87)',
            overflowY: 'auto',
            overflowX: 'hidden',
          },
        }}
        sx={{
          zIndex: 10006,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{ marginTop: '20px', paddingRight: '54px !important' }}
        >
          <Box
            display="flex"
            sx={{ flexDirection: 'wrap', justifyContent: 'space-between' }}
          >
            <Box
              sx={{
                display: 'flex',
                height: '60px',
                backgroundColor: '#fff',
                border: '2px solid #EF5544',
                borderRadius: '60px',
                padding: '14px',
                marginTop: '50px',
                marginLeft: '25px',
                maxWidth: {
                  'md': '500px',
                  'sm': '60%',
                  'xs': '90%',
                  '@media (max-width: 390px)': {
                    maxWidth: '90%',
                  },
                },
              }}
            >
              <img src="/images/SearchIcon.png" />
              <InputBase
                sx={{ width: '350px' }}
                placeholder="Search for something..."
                onChange={debouncedEventHandler}
                defaultValue={search}
              />
              {/* <select
                style={{
                  border: 'none',
                  background: 'inherit',
                  borderRadius: 20,
                  outline: '0px',
                  fontFamily: 'Nexa',
                  fontWeight: '700',
                  fontSize: '12px',
                  color: '#000',
                }}
                value={value}
                onChange={(event) => {
                  setValue(event.target.value as string);
                  setPage(0);
                }}
              >
                <option value={options[0]}>
                  <Typography variant="lbl-md">Artwork</Typography>
                </option>
                <option value={options[1]}>
                  <Typography variant="lbl-md">Nodes</Typography>
                </option>
              </select> */}
            </Box>
            <Button onClick={handleClose}>
              <img src="/images/Union.svg" width="60%" />
            </Button>
          </Box>

          <Box
            display="flex"
            marginTop="40px"
            marginLeft="30px"
            flexDirection="column"
          >
            {hasMoreSearchToLoad ? (
              <>
                <Lotties options={defaultOptions} height={52} width={52} />
              </>
            ) : (
              ''
            )}
            {/* ====  Top Searches === */}
            <Box>
              <Box display="flex" sx={{ alignItems: 'center' }}>
                <Typography
                  sx={{
                    backgroundColor: '#F3523F',
                    width: '10px',
                    height: '20px',
                    display: !filteredTopUsers.length ? 'none' : 'show',
                  }}
                />

                <Typography
                  sx={{
                    marginLeft: '30px',
                    fontFamily: 'Nexa',
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '36px',
                    letterSpacing: '0.02em',
                    color: '#000',
                    display: !filteredTopUsers.length ? 'none' : 'show',
                  }}
                >
                  Top Searches
                </Typography>
              </Box>
              <Box sx={{ overflow: 'auto' }}>
                <Box
                  display="flex"
                  marginLeft="40px"
                  marginTop="10px"
                  marginBottom="26px"
                  sx={{
                    '&>Button': {
                      'backgroundColor': '#000',
                      'color': '#fff',
                      'borderRadius': '80px',
                      'padding': '10px 16px',
                      'fontFamily': 'Nexa',
                      'fontWeight': 700,
                      'fontSize': '18px',
                      'lineHeight': '27px',
                      'textTransform': 'none',
                      '&:hover': { backgroundColor: '#F3523F' },
                      'marginRight': '12px',
                      'minWidth': 'auto',
                    },
                  }}
                >
                  {filteredTopUsers?.map((item, index) => (
                    <Button
                      onClick={() => {
                        if (item?.address) {
                          handleNavigate(`/profile/${item?.address}`);
                        }
                      }}
                      key={index}
                    >
                      {item?.username}\{' '}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'block' }}>
              {/* ==== Top nfts === */}
              <Box>
                <Box display="flex" sx={{ alignItems: 'center' }}>
                  <Typography
                    sx={{
                      backgroundColor: '#F3523F',
                      width: '10px',
                      height: '20px',
                      display: nfts?.length ? 'show' : 'none',
                    }}
                  />
                  <Typography
                    sx={{
                      marginLeft: '30px',
                      fontFamily: 'Nexa',
                      fontWeight: 700,
                      fontSize: '24px',
                      lineHeight: '36px',
                      letterSpacing: '0.02em',
                      color: '#000',
                      display: nfts?.length ? 'show' : 'none',
                    }}
                  >
                    Top NFTs
                  </Typography>
                </Box>
                <InfiniteScroll
                  // loadMore={fetchNFTs}
                  loadMore={null}
                  hasMore={null}
                  loader={<CommonLoader size={200} text={''} />}
                  // position={'absolute'}
                >
                  <Box
                    sx={{
                      // display: !filteredTopUsers.length ? 'none' : 'show',
                      marginLeft: '40px',
                      display: nfts?.length > 8 ? 'show' : 'none',
                    }}
                  >
                    <AliceCarousel
                      mouseTracking
                      disableDotsControls
                      autoWidth
                      items={nfts?.map((item, _index) => (
                        <span
                          key={item}
                          onClick={() =>
                            handleNavigate(
                              `/nft/${item.collection_address}/${item.token_id}`
                            )
                          }
                        >
                          <img
                            key={_index}
                            onDragStart={handleDragStart}
                            style={{
                              paddingLeft: 4,
                              paddingRight: 4,
                              cursor: 'pointer',
                            }}
                            width="150"
                            src={item.img}
                          ></img>
                        </span>
                      ))}
                      renderPrevButton={() => (
                        <Button
                          onClick={(): void =>
                            setPage((pre) => Math.max(pre - 1, 0))
                          }
                          sx={{
                            left: '500px',
                            bottom: '200px',
                            display: 'none',
                          }}
                        >
                          {'<'}
                        </Button>
                      )}
                      renderNextButton={() => (
                        <Button
                          onClick={(): void => setPage((pre) => pre + 1)}
                          sx={{
                            left: '480px',
                            bottom: '200px',
                            display: 'none',
                          }}
                        >
                          {'>'}
                        </Button>
                      )}
                    />
                  </Box>
                </InfiniteScroll>
              </Box>
              {/* ==== Top OG_ODINs === */}
              <Box>
                <Box display="flex" sx={{ alignItems: 'center' }}>
                  <Typography
                    sx={{
                      backgroundColor: '#F3523F',
                      width: '10px',
                      height: '20px',
                      display: odins?.length > 0 ? 'show' : 'none',
                    }}
                  />
                  <Typography
                    sx={{
                      marginLeft: '30px',
                      fontFamily: 'Nexa',
                      fontWeight: 700,
                      fontSize: '24px',
                      lineHeight: '36px',
                      letterSpacing: '0.02em',
                      color: '#000',
                      display: odins?.length > 0 ? 'show' : 'none',
                    }}
                  >
                    Top OG_ODINs
                  </Typography>
                </Box>
                <InfiniteScroll
                  loadMore={null}
                  hasMore={null}
                  loader={<CommonLoader size={100} text={''} />}
                >
                  {
                    <Box
                      display="flex"
                      marginLeft="40px"
                      sx={{ display: odins?.length > 0 ? 'show' : 'none' }}
                    >
                      <AliceCarousel
                        mouseTracking
                        disableDotsControls
                        autoWidth
                        items={
                          odins.length > 0
                            ? odins?.map((item, _index) => (
                                <span
                                  key={item}
                                  onClick={() =>
                                    handleNavigate(
                                      `/nft/${item.token_address}/${item.token_id}`
                                    )
                                  }
                                >
                                  {item && (
                                    <img
                                      key={_index}
                                      onDragStart={handleDragStart}
                                      style={{
                                        paddingLeft: 4,
                                        paddingRight: 4,
                                      }}
                                      width="150"
                                      src="https://ipfs.io/ipfs/QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH"
                                    ></img>
                                  )}
                                  <p
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 10,
                                    }}
                                  >
                                    {JSON.parse(item?.metadata ?? '{}')?.name
                                      ?.length > 15
                                      ? JSON.parse(
                                          item?.metadata ?? '{}'
                                        )?.name.slice(0, 15) + '...'
                                      : JSON.parse(item?.metadata ?? '{}')
                                          ?.name}
                                  </p>
                                </span>
                              ))
                            : []
                        }
                        renderPrevButton={() => (
                          <Button
                            style={{
                              left: '500px',
                              bottom: '200px',
                              display: 'none',
                            }}
                          >
                            {'<'}
                          </Button>
                        )}
                        renderNextButton={() => (
                          <Button
                            style={{
                              left: '480px',
                              bottom: '200px',
                              display: 'none',
                            }}
                          >
                            {'>'}
                          </Button>
                        )}
                      />
                    </Box>
                  }
                </InfiniteScroll>
              </Box>
              {/* ==== Top OG_THORs === */}
              <Box>
                <Box display="flex" sx={{ alignItems: 'center' }}>
                  <Typography
                    sx={{
                      backgroundColor: '#F3523F',
                      width: '10px',
                      height: '20px',
                      display: thors?.length > 0 ? 'show' : 'none',
                    }}
                  />
                  <Typography
                    sx={{
                      marginLeft: '30px',
                      fontFamily: 'Nexa',
                      fontWeight: 700,
                      fontSize: '24px',
                      lineHeight: '36px',
                      letterSpacing: '0.02em',
                      color: '#000',
                      display: thors?.length > 0 ? 'show' : 'none',
                    }}
                  >
                    Top OG_THORs
                  </Typography>
                </Box>
                <InfiniteScroll pageStart={0} loadMore={null} hasMore={null}>
                  {
                    <Box
                      sx={{ display: thors?.length > 0 ? 'show' : 'none' }}
                      marginLeft="40px"
                    >
                      <AliceCarousel
                        mouseTracking
                        disableDotsControls
                        autoWidth
                        items={
                          thors?.length > 0
                            ? thors?.map((item, _index) => (
                                <span
                                  key={item}
                                  onClick={() =>
                                    handleNavigate(
                                      `/nft/${item.token_address}/${item.token_id}`
                                    )
                                  }
                                >
                                  {item && (
                                    <img
                                      key={_index}
                                      onDragStart={handleDragStart}
                                      style={{
                                        paddingLeft: 4,
                                        paddingRight: 4,
                                      }}
                                      width="150"
                                      src="https://ipfs.io/ipfs/QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"
                                    ></img>
                                  )}
                                  <p
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 10,
                                    }}
                                  >
                                    {JSON.parse(item?.metadata ?? '{}')?.name
                                      ?.length > 15
                                      ? JSON.parse(
                                          item?.metadata ?? '{}'
                                        )?.name.slice(0, 15) + '...'
                                      : JSON.parse(item?.metadata ?? '{}')
                                          ?.name}
                                  </p>
                                </span>
                              ))
                            : []
                        }
                        renderPrevButton={() => (
                          <Button
                            style={{
                              left: '500px',
                              bottom: '200px',
                              display: 'none',
                            }}
                          >
                            {'<'}
                          </Button>
                        )}
                        renderNextButton={() => (
                          <Button
                            style={{
                              left: '480px',
                              bottom: '200px',
                              display: 'none',
                            }}
                          >
                            {'>'}
                          </Button>
                        )}
                      />
                    </Box>
                  }
                </InfiniteScroll>
              </Box>
              {/* ==== Top collections === */}
              <Box>
                <Box display="flex" sx={{ alignItems: 'center' }}>
                  <Typography
                    sx={{
                      backgroundColor: '#F3523F',
                      width: '10px',
                      height: '20px',
                      display: !collectionData?.length ? 'none' : 'show',
                    }}
                  />
                  <Typography
                    sx={{
                      marginLeft: '30px',
                      fontFamily: 'Nexa',
                      fontWeight: 700,
                      fontSize: '24px',
                      lineHeight: '36px',
                      letterSpacing: '0.02em',
                      color: '#000',
                      display: !collectionData?.length ? 'none' : 'show',
                    }}
                  >
                    Top Collections
                  </Typography>
                </Box>
                <Box marginBottom="50px">
                  <Grid
                    container
                    sx={{
                      textAlign: 'start',
                      marginLeft: '50px',
                      marginTop: '24px',
                    }}
                  >
                    {collectionData?.map((item, index) => (
                      <Grid
                        key={index}
                        item
                        md={3}
                        sm={6}
                        xs={12}
                        display="flex"
                        marginBottom="28px"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (item?.address) {
                            handleNavigate(`/collections/${item?.address}`);
                          }
                        }}
                      >
                        <Avatar
                          src={item?.profile_image || '/images/random.png'}
                        ></Avatar>
                        <Box
                          sx={{
                            alignSelf: 'center',
                            textAlignLast: 'justify',
                            marginLeft: '20px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Nexa',
                              fontWeight: 700,
                              fontSize: '17px',
                              lineHeight: '27px',
                              color: 'rgba(0, 0, 0, 0.9)',
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: 'Nexa',
                              fontWeight: 400,
                              fontSize: '12px',
                              lineHeight: '19px',
                              color: '#000',
                              display: 'flex',
                            }}
                          >
                            Total:
                            {collectionItems.get(item?.address)}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </Box>
            {/* <Box sx={{ display: value === 'Artwork' ? 'none' : 'block' }}> */}
          </Box>
          {/* </Box> */}
        </Container>
      </Dialog>
    </div>
  );
}
