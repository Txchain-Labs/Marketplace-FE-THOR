import React, { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useSelector } from 'react-redux';
import Loader from './Loader';
import NoData from './NoData';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowForwardIos, KeyboardArrowUp } from '@mui/icons-material';

import PlaceBid from '../modals/PlaceBid';
import LikeButton from '../../components/common/LikeButton';
import axios from 'axios';
import { BigNumber, ethers } from 'ethers';
import { useChain } from '../../utils/web3Utils';

import InfiniteScroll from 'react-infinite-scroller';
import CommonLoader from '../../components/common/CommonLoader';

import {
  useAddLike,
  useFavorites,
  useGetVolume,
  useGetBestOfferAvax,
  useGetBestOfferOTCAvax,
  useGetFloorPriceAvax,
} from '../../hooks/useNFTDetail';

import {
  useGetUsdFromAvax,
  useGetUsdFromThor,
} from '../../../src/hooks/useOracle';

import { HoverEffectTimerInSecs } from '../../utils/constants';

export const root = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  background: '#fff',
};
export const root2 = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  background: '#fff',
  paddingTop: '0px',
};
const textDetails = {
  m: {
    xs: '71px 0px 93px 33px',
    sm: '71px 0px 93px 130px',
    md: '71px 0px 93px 140px',
    lg: '71px 0px 93px 140px',
    xl: '71px 0px 93px 140px',
  },
  backgorund: 'white',
  width: '-webkit-fill-available',
};
const titleText = {
  display: 'flex',
  alignItems: 'center',
  ml: { xs: -0.5, sm: -10, md: -14, lg: -14, xl: -14 },
};
const picSize = {
  height: { xs: '60px', sm: '65px', md: '96px', lg: '96px', xl: '96px' },
  width: { xs: '60px', sm: '65px', md: '96px', lg: '96px', xl: '96px' },
};
const artistName = {
  display: 'flex',
  mt: '13px',
  cursor: `url("/images/cursor-pointer.svg"), auto`,
};
const description = { display: 'flex', mt: '18px' };
const button = { display: 'flex', mt: '8px' };
const collectionDataStyle = {
  display: 'flex',
  mt: '18px',
  ml: '20px',
};

const collectionGroupStyle = {
  display: {
    lg: 'flex',
    md: 'flex',
    sm: 'box',
    xs: 'box',
  },
};
const textStyle_Total = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  marginRight: '50px',
};
const totalItemsFont = {
  fontSize: {
    '@media (max-width: 900px) and (min-width: 390px)': {
      fontSize: '16px',
    },
    '@media (min-width: 900px) and (max-width: 1200px)': {
      fontSize: '20px',
    },
    '@media (min-width: 1200px)': {
      fontSize: '24px',
    },
  },
};
const textStyle_Floor = {
  flexDirection: 'column',
  alignItems: 'start',
  width: '100px',
};
const textStyle_BestOffer = {
  display: { md: 'flex', lg: 'flex' },
  flexDirection: 'column',
  alignItems: 'start',
};
const numberStyle = {
  fontSize: { xs: '16px', sm: '16px', md: '20px', lg: '24px' },
};
const priceStyle = {
  fontSize: {
    alignSelf: 'flex-end',
    xs: '10px',
    sm: '10px',
    md: '12x',
    lg: '14px',
  },
};
const ownerStyle = {
  'textOverflow': 'ellipsis',
  'overflow': 'hidden',
  'width': '405px',
  '&:hover': { color: '#F3523F' },
};

const main = {
  'position': 'relative',
  'cursor': `url("/images/cursor-pointer.svg"), auto`,
  'background': 'inherit',
  'borderRadius': '0px',
  'padding': 0,
  'transition': 'transform .2s',
  '&:hover': {
    'transform': 'scale(1.05)',
    'transition': 'transform .2s',
    'boxShadow': '0px 0px 44px 0px rgba(0, 0, 0, 0.55)',
    'zIndex': 10001,
    '&$btnWrapper': {
      opacity: 1,
    },
  },
};
const main1 = {
  ...main,

  animationName: 'blurnftanimation',
  animationDuration: '3s', //transition: 'filter 5s'
  filter: 'brightness(50%)',
};

const styleNFTItemInCollectionPage = {
  height: 'var(--nft-item-width--collection-page)',
  minHeight: '248px',
  width: 'var(--nft-item-width--collection-page)',
  minWidth: '248px',
};

type Props = {
  collectionAddr: any;
};
const DESCRIPTION_LENGTH = 110;

const NODES: { [key in number]: Array<string> } = {
  43114: [
    '0x7325e3564B89968D102B3261189EA44c0f5f1a8e',
    '0x825189515d0A7756436F0eFb6e4bE5A5aF87e21D',
  ],
  43113: [
    '0x1De3ebd258f7603888c83A339049501AeaFc6581',
    '0x0Be69fbD4955eB19E4F6D2f58338592be75476A8',
  ],
};

const NFTCard = (props: Props) => {
  const { collectionAddr } = props;
  const { collection, collectionLoading } = useSelector(
    (state: any) => state.collections
  );
  const chain = useChain();
  const chainId = chain?.id;
  const [bestOffer, setBestOffer] = useState('0');
  const [floorPrice, setFloorPrice] = useState('0');
  const [totalVolume, setTotalVolume] = useState('0');

  const { data: volumes } = useGetVolume(
    collection?.address.toLowerCase() || ''
  );
  const { data: bestOfferData } = useGetBestOfferAvax(
    collection?.address.toLowerCase() || ''
  );
  const { data: bestofferDataOTC } = useGetBestOfferOTCAvax(
    collection?.address.toLowerCase()
  );
  const { data: floorPriceData } = useGetFloorPriceAvax(
    collection?.address.toLowerCase() || ''
  );

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  useEffect(() => {
    const priceInWei = bestOfferData?.data.data.bids[0]?.priceInWei ?? '0';
    const paymentType = bestOfferData?.data.data.bids[0]?.paymentType; // 0 / 1

    const tokenpriceBN = paymentType === '0' ? avaxPrice : thorPrice;

    const priceBN = BigNumber.from(priceInWei);

    const usdPriceBN = priceBN.mul(tokenpriceBN);
    const usdPrice = Number(ethers.utils.formatUnits(usdPriceBN, 36));

    const priceOctInWei =
      bestofferDataOTC?.data.data.otcbids[0]?.priceInWei ?? '0';
    const paymentOctType =
      bestofferDataOTC?.data.data.otcbids[0]?.paymentType ?? '0';

    const tokenOctpriceBN = paymentOctType === '0' ? avaxPrice : thorPrice;

    const priceOctBN = BigNumber.from(priceOctInWei);

    const usdPriceOctBN = priceOctBN.mul(tokenOctpriceBN);
    const usdPriceOct = Number(ethers.utils.formatUnits(usdPriceOctBN, 36));

    const maxPrice = Math.max(usdPrice, usdPriceOct);
    const fixedMaxPrice = Math.round(maxPrice * 100) / 100;
    setBestOffer(fixedMaxPrice.toString());
  }, [avaxPrice, bestOfferData, bestofferDataOTC, thorPrice]);

  useEffect(() => {
    if (volumes)
      setTotalVolume(
        volumes.data.data.totalVolumes.length > 0
          ? ethers.utils.formatEther(
              volumes.data.data.totalVolumes[0].volumeAvax
            )
          : '0'
      );
  }, [volumes]);

  useEffect(() => {
    if (floorPriceData)
      setFloorPrice(
        floorPriceData.data.data.listings.length > 0
          ? ethers.utils.formatEther(
              floorPriceData.data.data.listings[0].priceInWei
            )
          : '0'
      );
  }, [floorPriceData]);

  const collectionData: any = collection;

  const user = useSelector((state: any) => state.auth.user);

  //NFT Related Items
  let hoverTimer: any = null;

  const [hoverTimeout, setHoverTimeout] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [openType] = useState('');
  const [openSnack, setOpenSnack] = useState(false);
  const [openSnackSuccess, setOpenSnackSuccess] = useState(false);
  const [seeMore, setSeeMore] = useState(false);

  const [show, setShow] = useState<any>({
    id: '',
    status: true,
  });

  const handleShow = (i: any) => {
    setShow({
      ...show,
      id: i.id,
      status: true,
    });
  };

  function funcSetHoverTimeout() {
    setHoverTimeout(true);
  }

  const { data: favorites } = useFavorites(user?.id);
  const [nfts, setNFTs] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [hasMoreNFTsToLoad, setHasMoreNFTsToLoad] = useState(true);
  const [curPage, setCurPage] = useState(0);
  const { mutate: addLike } = useAddLike();

  const [nCursor, setNCursor] = useState('');

  const fetchNFTs = useCallback(async () => {
    if (fetching) {
      return;
    }

    setFetching(true);

    try {
      if (hasMoreNFTsToLoad) {
        let res: any;

        if (
          collectionAddr === NODES[chainId][0] ||
          collectionAddr === NODES[chainId][1]
        ) {
          const collection_name = NODES[chainId].findIndex((item) => {
            return item.toLowerCase() === collectionAddr.toLowerCase();
          })
            ? 'OG_THOR'
            : 'OG_ODIN';

          res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/nfts/nodesSynced?chainId=${chainId}&${collection_name}=${collectionAddr}&page=${curPage}&cursor=${nCursor}&pageSize=40`
          );
        } else {
          res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/nfts/favoriteByCollection/${chainId}/${collectionAddr}?page=${curPage}&pageSize=40`
          );
        }

        let retVal: any;

        if (res.data.code === 200) {
          if (NODES[chainId].includes(collectionAddr))
            setNCursor(res.data.data.cursor);

          retVal = res.data.data.nfts;

          if (curPage) setNFTs([...nfts, ...retVal]);
          else setNFTs(retVal);

          if (res?.data.data.totalPages)
            setHasMoreNFTsToLoad(
              res.data.data.totalPages > res.data.data.curPage
            );
          else if (curPage < 50) setHasMoreNFTsToLoad(true);
          else setHasMoreNFTsToLoad(false);

          setCurPage(res.data.data.curPage + 1);
        }
      }
    } finally {
      setFetching(false);
    }
  }, [
    fetching,
    hasMoreNFTsToLoad,
    collectionAddr,
    chainId,
    curPage,
    nCursor,
    nfts,
  ]);

  const closeSnackbar = () => {
    setOpenSnack(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  const closeSnackbarSuccess = () => {
    setOpenSnackSuccess(false);
  };

  const [collectionItems, setCollectionItems] = useState(0);

  useEffect(() => {
    if (collection?.address) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/nfts/nftsByContract/${chainId}/${collection?.address}/1`
        )
        .then((res) => {
          if (res?.data.code === 200) {
            setCollectionItems(res.data.data.total ? res.data.data.total : 0);
          }
        });
    }
  }, [collection?.address, chainId]);

  useEffect(() => {
    setCurPage(0);
    setHasMoreNFTsToLoad(true);
  }, [collection?.address]);

  return (
    <Box sx={root}>
      {collectionLoading ? (
        <Loader colSpan={2} height={750} size={undefined} />
      ) : !collectionData ? (
        <NoData text="No data found" size={undefined} height={750} />
      ) : (
        <>
          {/* <Container> */}
          <Box sx={textDetails}>
            <Box sx={titleText}>
              <Box sx={{ mr: 2 }}>
                <Avatar
                  src={collection?.profile_image || '/images/random.png'}
                  sx={picSize}
                ></Avatar>
              </Box>
              <Box>
                <Typography variant="h1">{collection?.name}</Typography>
              </Box>
            </Box>
            <Link href={`/profile/${collection?.owner}`}>
              <Box sx={artistName}>
                <Typography variant="p-md" mr="4px" lineHeight={'90%'}>
                  By
                </Typography>
                <Typography variant="p-md" lineHeight={'120%'} sx={ownerStyle}>
                  {collection?.owner}
                </Typography>
              </Box>
            </Link>
            <Box sx={description}>
              <Typography
                variant="p-lg-bk"
                sx={{
                  textAlign: 'left',

                  width: {
                    lg: '1000px',
                    md: '500px',
                    miniMobile: '300px',
                  },
                  whiteSpace: seeMore ? 'unset' : 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',

                  margin: '0',
                  background: 'white',
                }}
              >
                {collection?.description}
              </Typography>
            </Box>

            {collection?.description.length > DESCRIPTION_LENGTH ? (
              <Box
                onClick={() => {
                  setSeeMore(!seeMore);
                }}
                sx={button}
              >
                <Button sx={{ padding: '0px', textTransform: 'none' }}>
                  <Typography variant="p-md-bk"> See more</Typography>
                  {seeMore ? <KeyboardArrowUp /> : <KeyboardArrowDownIcon />}
                </Button>
              </Box>
            ) : (
              ''
            )}

            <Box sx={collectionDataStyle}>
              <Box sx={collectionGroupStyle}>
                <Box sx={textStyle_Total}>
                  <Typography variant="h5" sx={totalItemsFont}>
                    {collectionItems}
                  </Typography>
                  <Typography variant="p-lg-bk">Total items</Typography>
                </Box>
                <Box sx={textStyle_Total}></Box>
                <Box sx={textStyle_Total}>
                  <Typography variant="h5" sx={numberStyle}>
                    {totalVolume}
                  </Typography>
                  <Typography variant="p-lg-bk">Total volume traded</Typography>
                </Box>
              </Box>
              <Box sx={collectionGroupStyle}>
                <Box sx={textStyle_Floor}>
                  <Typography variant="h5" sx={numberStyle}>
                    {floorPrice}
                  </Typography>
                  <Typography variant="p-lg-bk">Floor price</Typography>
                </Box>
                <Box sx={textStyle_Total}></Box>
                <Box sx={textStyle_BestOffer}>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="h5" sx={numberStyle}>
                      {bestOffer}
                    </Typography>
                    <Typography sx={priceStyle}>&nbsp;USD</Typography>
                  </Box>
                  <Typography variant="p-lg-bk">Best offer</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          {/* </Container> */}
          <Box sx={root2}>
            <InfiniteScroll
              pageStart={0}
              loadMore={fetchNFTs}
              hasMore={hasMoreNFTsToLoad}
              loader={
                <CommonLoader
                  size={undefined}
                  text={'Loading NFTs...'}
                  height={'50vh'}
                  key={0}
                />
              }
            >
              <Grid container>
                {nfts?.length > 0
                  ? nfts?.map((item: any, index: number) => (
                      <div key={index}>
                        {item.collection_address.toLowerCase() ===
                        collectionAddr.toLowerCase() ? (
                          <div
                            style={{
                              ...styleNFTItemInCollectionPage,
                              display: 'flex',
                              position: 'relative',
                            }}
                          >
                            <p
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 10,
                                zIndex: 99999,
                              }}
                            >
                              {JSON.parse(item?.metadata ?? '{}')?.name
                                ?.length > 15
                                ? JSON.parse(
                                    item?.metadata ?? '{}'
                                  )?.name.slice(0, 15) + '...'
                                : JSON.parse(item?.metadata ?? '{}')?.name}
                            </p>
                            <Link
                              href={`/nft/${item.collection_address}/${item.token_id}`}
                            >
                              <Box>
                                <Paper
                                  elevation={0}
                                  style={{
                                    background: `url(${item.img})`,
                                    ...styleNFTItemInCollectionPage,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                  }}
                                  onMouseEnter={() => {
                                    handleShow(item);
                                    hoverTimer = setTimeout(
                                      funcSetHoverTimeout,
                                      HoverEffectTimerInSecs
                                    );
                                  }}
                                  onMouseLeave={() => {
                                    setShow({ ...show, status: false });
                                    if (hoverTimer !== null)
                                      clearTimeout(hoverTimer);
                                    setHoverTimeout(false);
                                  }}
                                  sx={
                                    show.id === item.id || !hoverTimeout
                                      ? main
                                      : main1
                                  }
                                >
                                  <Box
                                    position="absolute"
                                    top="18.7px"
                                    right="18.7px"
                                  >
                                    <LikeButton
                                      isChecked={favorites.includes(item.id)}
                                      id={item.id}
                                      key={item.id}
                                      likeNFTHandler={() =>
                                        addLike({
                                          user_id: user.id,
                                          nft_id: item.id,
                                          collection_address:
                                            item.collection_address,
                                          chainid: chainId,
                                          token_id: item.token_id,
                                        })
                                      }
                                    />
                                  </Box>
                                </Paper>
                              </Box>
                            </Link>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    ))
                  : []}
              </Grid>
            </InfiniteScroll>
          </Box>
          <PlaceBid open={isOpen} handleClose={handleClose} />
          <Snackbar
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
                  'padding': '0px 32px 0px 0px',
                  'background': 'black',
                  '& .MuiAlert-icon': { padding: '0px !important', mr: 4 },
                  '& .MuiButtonBase-root-MuiIconButton-root': {
                    display: 'none',
                  },
                }}
              >
                <Typography>
                  {openType === 'bid'
                    ? 'PLACING A BID...'
                    : 'PROCESSING PURCHASE...'}
                </Typography>
              </Alert>
            </Box>
          </Snackbar>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={openSnackSuccess}
            autoHideDuration={9000}
            onClose={closeSnackbarSuccess}
          >
            <Box
              sx={{
                'display': 'flex',
                'alignItems': 'center',
                '& .MuiAlert-root': {
                  display: 'flex',
                  alignItems: 'center',
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
                  'padding': '0px 16px 0px 0px',
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
                  <Typography>
                    {openType === 'bid' ? 'VIEW RECENT BID' : 'VIEW MY NEW NFT'}
                  </Typography>
                  <ArrowForwardIos
                    fontSize="small"
                    style={{ color: 'white' }}
                  />
                </Box>
              </Alert>
            </Box>
          </Snackbar>
        </>
      )}
    </Box>
  );
};

export default NFTCard;
