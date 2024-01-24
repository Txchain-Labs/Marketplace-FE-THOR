import React, { useEffect, useState, useMemo, useCallback } from 'react';
import styles from './styles.module.css';
import { useRouter } from 'next/router';
import { Box, Paper, CircularProgress } from '@mui/material';
import Carousel from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useDispatch, useSelector } from 'react-redux';
import { nftActions } from '../../redux/slices/dummyData';
import { useNetwork } from 'wagmi';
import axios from 'axios';
import LikeButton from '../../components/common/LikeButton';
import NftEmptyState from '../../../src/modules/profile/components/profileTab/nftEmptyState';

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      sx={{
        position: 'absolute',
        top: 'unset',
        left: '50%',
        height: 'auto',
        transform: 'translateX(-50%)',
        width: '100px',
        background: 'transparent !important',
      }}
      style={{ ...style, display: 'block', background: 'red' }}
      onClick={onClick}
    >
      <KeyboardArrowDownIcon
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
        top: -60,
        left: '50%',
        transform: 'translate(-50%, -40%)',
        width: '100px',
        height: 'auto',
        background: 'transparent !important',
      }}
      style={{ ...style, display: 'block', background: 'green' }}
      onClick={onClick}
    >
      <KeyboardArrowUpIcon
        sx={{ width: '100px', height: '100px', color: 'black' }}
      />
    </Box>
  );
}
export const VerticalSliderScroll = (props: any) => {
  const {
    setDataid,
    nftId,
    setLoading,
    loading,
    collectionAddress,
    moveToNextCollection,
  } = props;
  const [fetchNo, setFetchNo] = useState(1);
  const [firstFetch, setFirstFetch] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { chain } = useNetwork();

  const router = useRouter();
  const dispatch = useDispatch();
  const chainId = useMemo(() => chain?.id ?? 43114, [chain]);
  const data = useSelector((state: any) => state.dummy.data);
  const ref = React.useRef<Carousel>();
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    if (nftId) {
      setFetchNo(nftId);
    }
  }, [nftId]);

  const fetchNFTs = useCallback(
    (nextId = fetchNo) => {
      // setLoading(true);
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/nfts/nftsByContractMultiple/${chainId}/${collectionAddress}?start=${nextId}`
        )
        .then((res) => {
          if (res?.data?.code === 200) {
            const listfound = res?.data?.data
              ?.filter((item: any) => !!item)
              .map((token: { token_id: any; metadata: string }) => {
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
              });
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
        .then((res) => {
          if (res.data.code === 200) {
            setIsLiked(res.data.data.liked ? true : false);
          }
        });

    if (ref.current) {
      const idx = data.findIndex((item: any) => item.id === nftId);
      if (idx >= 0) {
        ref.current.slickGoTo(idx);
      } else {
        fetchNFTs(nftId);
      }
    }
  }, [nftId, data, chainId, user?.id, collectionAddress, fetchNFTs]);

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
    vertical: true,
    verticalSwiping: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    beforeChange: function (currentSlide: any, nextSlide: any) {
      console.log(
        'VerticalSliderScroll: beforeChange => currentSlide',
        currentSlide
      );
      console.log('VerticalSliderScroll: beforeChange => nextSlide', nextSlide);
      if (data?.[nextSlide]?.id) {
        router
          .push({
            pathname: `/nft/${collectionAddress}/${data[nextSlide].id}`,
          })
          .then(() => setDataid(nextSlide))
          .catch(() => console.log('VerticalSliderScroll: error changing nft'));
      } else {
        moveToNextCollection();
      }
    },
    afterChange: function (currentSlide: any) {
      console.log(
        'VerticalSliderScroll: afterChange => currentSlide',
        currentSlide
      );
      if (data?.[currentSlide]?.id) {
        if (currentSlide + 1 === data.length - 2) {
          fetchNFTs(Number(data[currentSlide].id) + 1);
        }
        router
          .push({
            pathname: `/nft/${collectionAddress}/${data[currentSlide].id}`,
          })
          .then(() => setDataid(currentSlide))
          .catch(() => console.log('VerticalSliderScroll: error changing nft'));
      } else {
        moveToNextCollection();
      }
    },
  };

  return (
    <Box
      sx={{
        'position': 'relative',
        '& .slick-next:before': {
          content: 'none',
        },
        '& .slick-prev:before': {
          content: 'none',
        },
      }}
    >
      <Carousel {...settings} ref={ref}>
        {data?.map((item: any, index: any) => (
          <Box key={index}>
            <Box
              sx={{
                height: {
                  lg: '580px',
                  sm: '500px',
                  miniMobile: '300px',
                },
              }}
              className={styles.scrollPage}
            >
              {!loading ? (
                item && item?.image ? (
                  <Paper
                    elevation={0}
                    style={{
                      aspectRatio: '1',
                      height: '100%',
                      backgroundImage: `url(${item?.image ?? ''})`, // THis is the what you want, I guess
                      position: 'relative',
                      transitionDuration: '0.1s',
                      zIndex: 2,
                      maxWidth: 'auto',
                      // paddingTop: '20px',
                      // paddingBottom: '20px',
                      backgroundSize: 'cover',
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

                    <Box position="absolute" top="18.7px" right="18.7px">
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
                  <NftEmptyState />
                )
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
