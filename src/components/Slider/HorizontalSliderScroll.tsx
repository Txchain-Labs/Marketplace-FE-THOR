import React, { useEffect, useState, useMemo, useCallback } from 'react';
import styles from './styles.module.css';
import { useRouter } from 'next/router';
import {
  Box,
  Paper,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Carousel from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useDispatch, useSelector } from 'react-redux';
import { nftActions } from '../../redux/slices/dummyData';
import { useNetwork } from 'wagmi';
import axios from 'axios';
import LikeButton from '../../components/common/LikeButton';

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      sx={{
        position: 'absolute',
        top: '50%',
        right: '12.5%',
        width: '20px',
        height: '100px',
        zIndex: '1000',
        background: 'transparent !important',
      }}
      style={{ ...style, display: 'block', background: 'red' }}
      onClick={onClick}
    >
      <KeyboardArrowRightIcon
        sx={{ width: '100px', height: '100px', color: 'black' }}
      />
    </Box>
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      sx={{
        position: 'absolute',
        top: '50%',
        right: '95%',
        width: '20px',
        height: '100px',
        zIndex: '1000',
        background: 'transparent !important',
      }}
      style={{ ...style, display: 'block', background: 'green' }}
      onClick={onClick}
    >
      <KeyboardArrowLeftIcon
        sx={{ width: '100px', height: '100px', color: 'black' }}
      />
    </Box>
  );
}
export const HorizontalSliderScroll = (props: any) => {
  const {
    setDataid,
    nftId,
    setLoading,
    loading,
    collectionAddress,
    moveToNextCollection,
  } = props;

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between(600, 900));

  const [fetchNo, setFetchNo] = useState(1);
  const [firstFetch, setFirstFetch] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { chain } = useNetwork();

  const router = useRouter();
  const dispatch = useDispatch();
  const chainId = useMemo(() => chain?.id ?? 1, [chain]);
  const data = useSelector((state: any) => state.dummy.data);

  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    if (nftId) {
      setFetchNo(nftId);
    }
  }, [nftId]);

  const fetchNFTs = useCallback(
    (nextId = fetchNo) => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/nfts/nftsByContractMultiple/${chainId}/${collectionAddress}?start=${nextId}`
        )
        .then((res) => {
          if (res?.data?.code === 200) {
            const listfound = res?.data?.data?.map(
              (token: { token_id: any; metadata: string }) => {
                const obj = {
                  id: token?.token_id,
                  image: '',
                  description: '',
                  title: '',
                  isError: false,
                  attributes: [{}],
                };
                try {
                  const metadata = JSON.parse(token?.metadata);
                  obj['image'] = metadata['image']
                    ? metadata['image']
                    : metadata['image_url']
                    ? metadata['image_url']
                    : '';
                  if (obj['image'].includes('ipfs://')) {
                    const img = obj['image'];
                    obj['image'] = img.replace(
                      'ipfs://',
                      'https://ipfs.io/ipfs/'
                    );
                  }
                  obj['id'] = token?.token_id;
                  obj['description'] = metadata['description']
                    ? metadata['description']
                    : '';
                  obj['title'] = metadata['title']
                    ? metadata['title']
                    : metadata['name']
                    ? metadata['name']
                    : '';
                  obj['attributes'] = metadata?.['attributes']
                    ? metadata['attributes']
                    : [];
                } catch (e) {
                  obj['isError'] = true;
                }
                return obj;
              }
            );
            if (!firstFetch) {
              dispatch(nftActions.setData([]));
              setFirstFetch(true);
            }
            dispatch(nftActions.setData(listfound));
          }
        })
        .catch(() => setFirstFetch(false))
        .finally(() => setLoading(false));
    },
    [chainId, collectionAddress, dispatch, fetchNo, firstFetch, setLoading]
  );

  useEffect(() => {
    if (chainId && user?.id && collectionAddress && nftId)
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/is-liked-unsynced/${chainId}/${user?.id}/${collectionAddress}/${nftId}`
        )
        .then((resLiked) => {
          setIsLiked(resLiked.data.data.liked);
        });

    console.log(
      'HorizontalSliderScroll: col id, nft id',
      collectionAddress,
      nftId
    );
    if (!firstFetch && nftId && collectionAddress) {
      console.log('HorizontalSliderScroll: first fetch');
      // setFirstFetch(true);
      setDataid(0);
      fetchNFTs(nftId);
    }
  }, [
    nftId,
    collectionAddress,
    chainId,
    user,
    firstFetch,
    setDataid,
    fetchNFTs,
  ]);

  // useEffect(() => {
  //     setDataid(fetchNo - 1);
  // }, [fetchNo]);

  const likeNFT = (collectionAddr: string, nftId: string) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/like-unsynced`, {
        user_id: user?.id,
        chainid: chainId,
        collection_address: collectionAddr,
        token_id: nftId,
      })
      .then((res) => {
        if (res.data.code === 200) {
          setIsLiked(!isLiked);
          console.log(res.data);
        }
      });
  };

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: false,
    verticalSwiping: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    beforeChange: function (currentSlide: any, nextSlide: any) {
      console.log(
        'HorizontalSliderScroll: beforeChange => currentSlide',
        currentSlide
      );
      console.log(
        'HorizontalSliderScroll: beforeChange => nextSlide',
        nextSlide
      );
      if (data?.[currentSlide]?.id) {
        router
          .push({
            pathname: `/nft/${collectionAddress}/${data[currentSlide].id}`,
          })
          .then(() => setDataid(currentSlide))
          .catch(() =>
            console.log('HorizontalSliderScroll: error changing nft')
          );
      } else {
        moveToNextCollection();
      }
    },
    afterChange: function (currentSlide: any) {
      console.log(
        'HorizontalSliderScroll: afterChange => currentSlide',
        currentSlide
      );
      if (data?.[currentSlide]?.id) {
        if (currentSlide + 1 === data.length) {
          fetchNFTs(Number(data[currentSlide].id) + 1);
        }
        router
          .push({
            pathname: `/nft/${collectionAddress}/${data[currentSlide].id}`,
          })
          .then(() => setDataid(currentSlide))
          .catch(() =>
            console.log('HorizontalSliderScroll: error changing nft')
          );
      } else {
        moveToNextCollection();
      }
    },
  };

  return (
    <Box
      sx={{
        'width': isTablet ? '87.5vw' : '100vw',
        'height': '50vh',
        'margin': '0',
        'marginTop': '2.25%',
        'position': 'relative',
        '& .slick-next:before': {
          content: 'none',
        },
        '& .slick-prev:before': {
          content: 'none',
        },
      }}
    >
      <Carousel {...settings}>
        {data?.map((item: any, index: any) => (
          <Box key={index}>
            <Box
              sx={{
                width: '100%',
                height: '50vh',
                margin: '0%',
              }}
              className={styles.scrollPage}
            >
              {!loading ? (
                <Paper
                  elevation={0}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${item?.image ?? ''})`,
                    position: 'relative',
                    transitionDuration: '0.1s',
                    zIndex: 2,
                    // paddingTop: '20px',
                    // paddingBottom: '20px',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* <img
                  width="auto"
                  height="90%"
                  src={item?.image ?? ''}
                  style={{
                    position: 'relative',
                    transitionDuration: '0.1s',

                    zIndex: 2,
                    maxWidth: 'auto',
                    // paddingTop: '20px',
                    // paddingBottom: '20px'
                  }}
                  // onClick={()=>{window.location.href=`#id-${slide.key}`}}
                > */}
                  <Box position="absolute" top="5px" right="5px">
                    <LikeButton
                      isChecked={isLiked}
                      id={nftId}
                      nftId={nftId}
                      collectionAddr={collectionAddress}
                      likeNFTHandler2={likeNFT}
                    />
                  </Box>
                </Paper>
              ) : (
                <CircularProgress />
              )}
            </Box>
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};
