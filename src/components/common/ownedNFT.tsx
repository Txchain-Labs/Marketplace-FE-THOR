import { useState, useMemo } from 'react';
import { Typography, Box, Grid, Paper } from '@mui/material';
import { WindowOutlined } from '@mui/icons-material';
import { NftType } from '../../utils/types';
import ListNft from '../modals/ListNft';
import { useRouter } from 'next/router';
import { useGetNodeRewards } from '../../hooks/useNodes';
import { formatWei } from '../../utils/web3Utils';
import Dropdown from './Dropdown';
import { menuItemIcon } from '../../styles/profile';

export const root = {
  width: '101%',
  display: 'flex',
  flexDirection: 'colum',
  alignItems: 'flex-start',
};
const main = {
  'position': 'relative',
  'cursor': 'pointer',
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

const styleNFTItemInProfilePage = {
  height: 'var(--nft-item-width--profile-page)',
  minHeight: '248px',
  width: 'var(--nft-item-width--profile-page)',
  minWidth: '248px',
};

interface OwndDataType {
  data: NftType[];
  enableActions?: boolean;
  nftType: string;
  refetches?: any[];
}

const NFTCard = ({
  item,
  showModal,
  setShowModal,
  setListNFT,
  enableActions,
  nftType,
}: any) => {
  const [showOption, setShowOption] = useState(false);
  const router = useRouter();
  const { data: rewards } = useGetNodeRewards(
    nftType === 'node' ? item?.token_address : null,
    item?.token_id,
    'OG'
  );
  const formatedRewards = useMemo(
    () => (rewards ? formatWei(rewards as string) : '0'),
    [rewards]
  );
  const [show, setShow] = useState<any>({
    id: '',
    status: true,
  });

  const [hoverTimeout] = useState(false);

  const handeShow = (i: any) => {
    setShow({
      ...show,
      id: i.id,
      status: true,
    });
  };
  function getMetaData(item: any) {
    const metadata =
      item?.metadata instanceof Object
        ? item.metadata
        : item?.metadata
        ? JSON.parse(item?.metadata)
        : null;

    if (metadata) {
      const img = metadata?.image;
      if (/(http(s?)):\/\//i.test(img)) {
        return img;
      }
      const array = img.split('/');
      return 'https://ipfs.io/ipfs/' + array[array.length - 1];
    }
    return '/images/nft-placeholder.png';
  }
  const image = getMetaData(item);

  const main = {
    'position': 'relative',
    'cursor': 'pointer',
    // 'background': 'inherit',
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
    '&::before': {
      content: '""',
      backgroundImage: `url(${image})`,
      backgroundSize: 'cover',
      position: 'absolute',
      top: '0px',
      right: '0px',
      left: '0px',
      bottom: '0px',

      opacity: nftType === 'node' ? '0.3' : '1',
    },
  };
  // const main1 = {
  //   ...main,

  //   animationName: 'blurnftanimation',
  //   animationDuration: '3s', //transition: 'filter 5s'
  //   filter: 'brightness(50%)',
  // };

  function getMetaDataName(item: any) {
    const metadata =
      item?.metadata instanceof Object
        ? item.metadata
        : item?.metadata
        ? JSON.parse(item?.metadata)
        : null;
    if (metadata) {
      return metadata?.name;
    }
    return metadata;
  }
  const name = getMetaDataName(item);
  const listButtonClick = (event: any) => {
    event.stopPropagation();
    setShowModal(!showModal);
    setListNFT({
      nftName: getMetaDataName(item),
      by: item?.name,
      nftImage: image,
      nftAddress: item?.token_address,
      tokenId: item?.token_id,
    });
  };
  const handleClick = (event: any) => {
    event.stopPropagation();
    setShowOption(!showOption);
  };
  const dropDownData = [
    {
      title: 'List',
      icon: <WindowOutlined sx={menuItemIcon} />,
      action: listButtonClick,
    },
  ];
  return (
    <div
      key={item.id}
      style={{
        ...styleNFTItemInProfilePage,
        display: 'flex',
        position: 'relative',
      }}
    >
      <Paper
        onClick={() => {
          router.push(`/nft/${item?.token_address}/${item?.token_id}`);
        }}
        elevation={0}
        style={{
          // backgroundImage: `url(${image})`,

          ...styleNFTItemInProfilePage,
          // backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: nftType === 'node' ? '2px solid black' : 'none',
        }}
        onMouseEnter={() => {
          handeShow(item);
        }}
        onMouseLeave={() => {
          setShow({ ...show, status: false, id: '' });

          setShowOption(false);
        }}
        sx={show.id === item.id || !hoverTimeout ? main : main1}
      >
        {enableActions && show.id === item.id && (
          <Dropdown
            handleShow={handleClick}
            show={showOption}
            data={dropDownData}
          />
        )}

        {nftType === 'art' && (
          <Box
            width="100%"
            position="absolute"
            bottom="0px"
            p="10px 5px"
            sx={{
              backgroundColor: '#fff',
              backgroundSize: 'cover',
              opacity: show.id === item.id ? '1' : '0.6',
            }}
          >
            <Box
              display="flex"
              padding="0 20px"
              justifyContent="space-between"
              sx={{
                marginBottom: '5px',
              }}
            >
              <Box display="flex" alignItems={'center'}>
                <img
                  width={'18.77px'}
                  height={'18.77px'}
                  src="/images/logo.svg"
                />
                <Typography
                  variant="lbl-sm"
                  sx={{
                    color: '#000000',
                    marginLeft: '2px',
                  }}
                >
                  {name || 'ThorFi'}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
        {nftType === 'node' && (
          <Box
            display="flex"
            flexDirection="column"
            // justifyContent="center"
            height="inherit"
            padding="0.5rem"
          >
            <Typography
              sx={{
                fontFamily: 'Nexa',
                fontSize: '1.1em',
                fontWeight: '700',
                lineHeight: '1.137em',
                letterSpacing: '0em',
                textAlign: 'left',
                color: 'black',

                paddingTop: 1,
              }}
            >
              PRICE
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                sx={{
                  fontFamily: 'Nexa',
                  fontSize: '3.0em',
                  fontWeight: '700',
                  //   lineHeight: '5.306em',
                  letterSpacing: '-0.04em',
                  textAlign: 'left',
                  color: 'black',
                  //   paddingTop: 1
                }}
              >
                ----
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Inter',
                  fontSize: '0.900em',
                  fontWeight: '700',
                  lineHeight: '0.75em',
                  letterSpacing: '0em',
                  textAlign: 'left',
                  color: 'black',
                  pl: 1,
                }}
              >
                AVAX
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: 'Nexa',
                fontSize: '0.900em',
                fontWeight: '700',
                lineHeight: '12.3px',
                letterSpacing: '0em',
                textAlign: 'left',
                color: 'black',
              }}
            >
              {formatedRewards} THOR Pending Rewards
            </Typography>
            <Box
              sx={{
                marginTop: 'auto',
              }}
            >
              {item.metadata.name}
            </Box>
          </Box>
        )}
      </Paper>
    </div>
  );
};

const OwnedNfts = ({
  data,
  enableActions = false,
  nftType,
  refetches,
}: OwndDataType) => {
  const [showModal, setShowModal] = useState(false);
  const [listNFT, setListNFT] = useState(null);
  const handleModalClick = () => {
    setShowModal(!showModal);
  };

  return (
    <Box sx={root}>
      <Grid container>
        {data.map((item: NftType, index) => (
          <NFTCard
            key={index}
            setListNFT={setListNFT}
            showModal={showModal}
            setShowModal={setShowModal}
            item={item}
            enableActions={enableActions}
            nftType={nftType}
          />
        ))}
      </Grid>
      <ListNft
        open={showModal}
        listNFT={listNFT}
        handleClose={handleModalClick}
        refetches={refetches}
      />
    </Box>
  );
};

export default OwnedNfts;
