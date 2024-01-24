import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import Image from 'next/image';
import InfiniteScroll from 'react-infinite-scroller';
import { useSelector } from '../../redux/store';
import { Typography, Box, Grid, Snackbar, Alert } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';

import { selectId2cartedIndex } from '../../redux/slices/cartSlice';

import CommonLoader from '../../components/common/CommonLoader';
import ConnectingLoader from '../../components/common/ConnectingLoader';
import BuyNft from '../../components/modals/BuyNft';
import ArtworkCard from '../../components/common/thumbnails/ArtworkCard';

import { useChain } from '../../utils/web3Utils';
import { useGetUsdFromAvax, useGetUsdFromThor } from '../../hooks/useOracle';
import { useGetNFTsFavrt } from '../../hooks/useNFTDetail';

import { collectionsService } from '../../services/collection.service';

export const root = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  background: '#fff',
  paddingTop: '0px',
};

const commonStyleNFTitem = {
  height: 'var(--nft-item-width)', //height: '18.5vw',
  minHeight: '248px',
  width: 'var(--nft-item-width)', //width: '18.5vw',
  minWidth: '248px',
};

const Explore = () => {
  const chain = useChain();

  const { user, loading } = useSelector((state: any) => state.auth);
  const id2cartedIndex = useSelector(selectId2cartedIndex);

  const { data: favorites, refetch: refetchFavorates } = useGetNFTsFavrt(
    user?.id
  );

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const [open, setOpen] = useState(false);
  const [openType] = useState('');
  const [openSnack, setOpenSnack] = useState(false);
  const [openSnackSuccess, setOpenSnackSuccess] = useState(false);
  const [collectionsData, setCollectionsData] = useState([]);
  const [nfts, setNFTs] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [hasMoreNFTsToLoad, setHasMoreNFTsToLoad] = useState(true);
  const [curPage, setCurPage] = useState(0);

  const favoritesByAddressId = useMemo(() => {
    if (!favorites) {
      return undefined;
    }

    const map = new Map();

    favorites.forEach((item) => {
      map.set(item.collection_address + item.token_id, true);
    });

    return map;
  }, [favorites]);

  const openToast = () => {
    setOpenSnack(true);
    setTimeout(() => {
      setOpenSnackSuccess(true);
    }, 2000);
  };
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };
  const closeSnackbar = () => {
    setOpenSnack(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const closeSnackbarSuccess = () => {
    setOpenSnackSuccess(false);
  };

  const fetchNFTs = useCallback(async () => {
    if (fetching) {
      return;
    }

    setFetching(true);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/nfts/synced/${chain?.id}?page=${curPage}`
      );

      if (res.data.code === 200) {
        // console.log('123123', res.data.data.nfts);
        setNFTs([...nfts, ...res.data.data.nfts]);
        setHasMoreNFTsToLoad(res.data.data.totalPages > res.data.data.curPage);
        setCurPage(res.data.data.curPage + 1);
      }
    } finally {
      setFetching(false);
    }
  }, [nfts, fetching, chain?.id, curPage]);

  const handleLike = (collection_address: string, token_id: string): void => {
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/like-unsynced`, {
        user_id: user?.id,
        chainid: chain?.id,
        collection_address: collection_address,
        token_id: token_id,
      })
      .then(() => {
        refetchFavorates();
      });
  };

  useEffect(() => {
    collectionsService
      .getCollections({})
      .then((response) => {
        const data = response.data.data;

        if (data.metaData?.totalCount > 0 && data.records) {
          setCollectionsData(data.records);
        }
      })
      .catch((error) => {
        console.log('getting collection error: ' + error);
      });
  }, []);

  return (
    <>
      {loading ? (
        <ConnectingLoader size={undefined} />
      ) : (
        <Box sx={root}>
          <InfiniteScroll
            pageStart={0}
            loadMore={fetchNFTs}
            hasMore={hasMoreNFTsToLoad}
            loader={<CommonLoader size={undefined} text={'Loading NFTs...'} />}
          >
            {nfts.length > 0 ? (
              <Grid container>
                {nfts.map((item, index) => {
                  const collectionForItem = collectionsData.find(
                    (each) =>
                      each.address.toLowerCase() ===
                      item.collection_address.toLowerCase()
                  );

                  return (
                    <div key={index} style={commonStyleNFTitem}>
                      <ArtworkCard
                        collection={collectionForItem}
                        nft={item}
                        isLiked={
                          favoritesByAddressId?.has(
                            item?.collection_address + item?.token_id
                          ) ?? false
                        }
                        onLike={() =>
                          handleLike(item?.collection_address, item?.token_id)
                        }
                        avaxPrice={avaxPrice}
                        thorPrice={thorPrice}
                        isCarted={id2cartedIndex.includes(
                          item.collection_address + item.token_id
                        )}
                      />
                    </div>
                  );
                })}
              </Grid>
            ) : (
              <></>
            )}
          </InfiniteScroll>
          <BuyNft open={open} handleClose={handleClose} openToast={openToast} />
          <Snackbar
            sx={{ zIndex: 10002 }}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={openSnack}
            autoHideDuration={1800}
            onClose={closeSnackbar}
          >
            <Box
              sx={{
                'display': 'flex',
                'alignItems': 'center',
                '& .MuiAlert-root': {
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '20px',
                },
              }}
            >
              {/* <img src="/images/nftImage.png" width="50px" /> */}

              <Alert
                icon={
                  <Image width={40} height={40} src="/images/nftImage.png" />
                }
                severity="success"
                sx={{
                  'width': '100%',
                  'padding': '0px 32px 0px 0px',
                  'background': 'black',
                  '& .MuiAlert-icon': { padding: '0px !important', mr: 4 },
                  '& .MuiButtonBase-root-MuiIconButton-root': {
                    display: 'none',
                  },
                }}
              >
                <Typography variant="p-md" sx={{ color: 'white' }}>
                  {openType === 'bid'
                    ? 'PLACING A BID...'
                    : 'PROCESSING PURCHASE...'}
                </Typography>
              </Alert>
            </Box>
          </Snackbar>
          <Snackbar
            sx={{ zIndex: 10002 }}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={openSnackSuccess}
            autoHideDuration={5000}
            onClose={closeSnackbarSuccess}
          >
            <Box
              sx={{
                'display': 'flex',
                'alignItems': 'center',
                '& .MuiAlert-root': {
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '20px',
                },
              }}
            >
              <Alert
                icon={
                  <Image width={40} height={40} src="/images/nftImage.png" />
                }
                severity="success"
                sx={{
                  'width': '100%',
                  'padding': '0px 10px 0px 0px',
                  'background': '#30B82D',

                  '& .MuiAlert-icon': { padding: '0px !important', mr: 4 },
                  '& .css-1e0d89p-MuiButtonBase-root-MuiIconButton-root': {
                    display: 'none',
                  },
                }}
              >
                <Box
                  style={{
                    display: 'flex',
                    justifyItems: 'center',
                    paddingRight: '10px',
                  }}
                >
                  <Typography
                    variant="p-md"
                    sx={{ color: 'white', marginTop: '4px' }}
                  >
                    {openType === 'bid' ? 'VIEW RECENT BID' : 'VIEW MY NEW NFT'}
                  </Typography>
                  <ArrowForwardIos
                    fontSize="small"
                    style={{ color: 'white', marginLeft: '16px' }}
                  />
                </Box>
              </Alert>
            </Box>
          </Snackbar>
        </Box>
      )}
    </>
  );
};

export default Explore;
