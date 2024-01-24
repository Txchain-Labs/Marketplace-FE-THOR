import React from 'react';
import { Avatar, Typography, Box } from '@mui/material';
import { Stack } from '@mui/system';
import Image from 'next/image';
import dayjs from 'dayjs';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
  profile_0001,
  profile_0002,
  tabSectionStyle,
  tabsStyle,
  tabStyle,
} from '../../src/styles/profile';
import NftEmptyState from '../../src/modules/profile/components/profileTab/nftEmptyState';
import { dottedAddress } from '../../src/shared/utils/utils';
import OwnedNfts from '../../src/components/common/ownedNFT';
import {
  useGetNFTList,
  useGetNFTMetadata,
  useGetNFTsByWallet,
  useGetUserByAddress,
  useGetNFTsFavrt,
} from '../../src/hooks/useNFTDetail';
import Loader from '../../src/components/common/Loader';
import SaleNft from '../../src/components/common/saleNFT';
import { useRouter } from 'next/router';
import { useChain } from '../../src/utils/web3Utils';
import { getNodesContractByChain } from '../../src/utils/constants';
import { useSelector } from '../../src/redux/store';
import { useGetNodesByWallet } from '../../src/hooks/useNodes';
import { useGetLikedListings } from '../../src/hooks/useListings';
import FavouritedNfts from '../../src/components/common/FavouritedNfts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const PublicProfile = () => {
  const router = useRouter();
  const chain = useChain();
  const address = router.query.address;
  const { activeCat } = useSelector((state: any) => state.uiGolobal);
  const [value, setValue] = React.useState(0);

  const NODES_CONTRACTS = React.useMemo(
    () => getNodesContractByChain(chain),
    [chain]
  );
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { data: user, isLoading: userDataLoading } = useGetUserByAddress(
    address?.toString()
  );
  const { data: nftsByWallet, isLoading: ownedLoading } = useGetNFTsByWallet(
    user?.address
  );

  const { data: nftsBySubgraph, isLoading: nftsSubgraphLoading } =
    useGetNFTList(address?.toString());
  const { data: nftsMetadata, isLoading: nftsMetadataLoading } =
    useGetNFTMetadata(nftsBySubgraph?.data?.data?.listings, 0);

  const { data: nodeOwnedNFTs } = useGetNodesByWallet(user?.address);
  const artOwnedNFTs = nftsByWallet?.filter(
    (nft: any) => !NODES_CONTRACTS.includes(nft.token_address)
  );
  const nodeSaleData = nftsMetadata?.filter((nft: any) =>
    NODES_CONTRACTS.includes(nft.token_address)
  );
  const nodeSaleNFTs = nodeSaleData?.map((item) => {
    const listedNFT = nftsBySubgraph?.data?.data?.listings.find(
      (list: any) => item?.token_id === list?.tokenId
    );
    return {
      ...item,
      price: listedNFT?.priceInWei,
    };
  });
  const { data: nodeFavrtNFTs } = useGetLikedListings(
    'nodes',
    user,
    null,
    'onlyFavs=1'
  );

  const { data: allFavs, isLoading: favrtLoading } = useGetNFTsFavrt(user?.id);
  const filterFavs = allFavs?.filter(
    (fav: any) => fav?.collection_address !== '' || fav?.token_id !== 0
  );
  const newFavs = filterFavs?.map((fav: any) => ({
    tokenId: fav?.token_id.toString(),
    nftAddress: fav?.collection_address,
  }));
  const { data: favNftsMetadata, isLoading: favNftsMetadataLoading } =
    useGetNFTMetadata(newFavs, 0);

  const artFavrtNFTs = favNftsMetadata?.filter(
    (nft: any) => !NODES_CONTRACTS.includes(nft?.token_address)
  );

  const artSaleNFTs = nftsMetadata?.filter(
    (nft: any) => !NODES_CONTRACTS.includes(nft.token_address)
  );

  function a11yProps(index: number) {
    return {
      'id': `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Box>{children}</Box>
          </Box>
        )}
      </div>
    );
  }

  if (userDataLoading) {
    return (
      <Box sx={{ height: '100vh' }}>
        <Loader size={undefined} />
      </Box>
    );
  }
  if (!user?.address) {
    return (
      <Box
        sx={{
          fontSize: { sm: 50, miniMobile: 20 },
          display: 'flex',
          justifyContent: 'center',
          marginTop: { sm: 50, miniMobile: 30 },
        }}
      >
        <Box>User Not Found</Box>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        paddingLeft: { sm: '50px', miniMobile: '10px' },
        paddingTop: '60px',
        background: 'white',
        height: '95vh',
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box display="flex">
            <Avatar
              src={user?.profile_picture || '/images/profile-yellow.svg'}
              sx={{ height: 80, width: 80 }}
            />
            <Box ml={2}>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  fontFamily: 'Nexa-Bold',
                  fontSize: { xs: '22px', md: '32px' },
                  lineHeight: { xs: '33px', md: '55px' },
                }}
              >
                {user?.username}
                <span>
                  <Box sx={{ display: { sm: 'none', miniMobile: 'none' } }}>
                    <button
                      style={{
                        background: 'black',
                        marginLeft: '82px',
                        color: 'white',
                        fontSize: '12px',
                        padding: '10px',
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        borderRadius: '6px',
                        border: 'none',
                      }}
                    >
                      Follow
                    </button>
                  </Box>
                </span>
              </Typography>
              <Typography
                sx={{ typography: { sm: 'p-lg-bk', miniMobile: 'body1' } }}
              >
                {dottedAddress(user?.address)}
              </Typography>
              <Typography
                fontWeight={400}
                sx={{
                  typography: { sm: 'p-lg-bk', miniMobile: 'body1' },
                  fontStyle: 'italic',
                }}
                mt={1}
              >
                Joined {dayjs(user?.joined_date).format('MMMM YYYY')}
                <span>
                  <Box sx={{ display: { sm: 'none', miniMobile: 'none' } }}>
                    <button
                      style={{
                        background: 'black',
                        marginLeft: '12px',
                        color: 'white',
                        fontSize: '12px',
                        padding: '10px',
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        borderRadius: '6px',
                        border: 'none',
                      }}
                    >
                      Follow
                    </button>
                  </Box>
                </span>
              </Typography>
              <Box display="flex" mt={1}>
                {!!user?.twitter && (
                  <a
                    href={`https://twitter.com/${user?.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Box sx={{ display: 'flex', alignItems: 'end', mr: 2 }}>
                      <Image
                        src="/images/twitter-icon.svg"
                        height={20}
                        width={20}
                        alt="Twitter"
                      />
                      <Typography
                        variant="lbl-md"
                        sx={{
                          ml: 0.5,
                          display: { sm: 'block', miniMobile: 'none' },
                        }}
                      >
                        {' '}
                        @{user?.twitter}
                      </Typography>
                    </Box>
                  </a>
                )}

                {!!user?.discord && (
                  <Box sx={{ display: 'flex', alignItems: 'end' }}>
                    <Image
                      src="/images/discord-icon.svg"
                      height={20}
                      width={20}
                      alt="Discord"
                    />
                    <Typography
                      variant="lbl-md"
                      sx={{
                        ml: 0.5,
                        display: { sm: 'block', miniMobile: 'none' },
                      }}
                    >
                      @{user?.discord}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Stack>

      <Box sx={profile_0001}>
        <Box sx={profile_0002}>
          <Tabs
            value={value}
            onChange={handleChange}
            sx={tabsStyle}
            aria-label="basic tabs example"
          >
            <Tab
              sx={tabStyle}
              label={
                <Box sx={tabSectionStyle}>
                  <Typography
                    variant="h3"
                    sx={{
                      p: 1,
                      typography: { sm: 'h3', miniMobile: 'sub-h' },
                    }}
                  >
                    {activeCat === 'node'
                      ? nodeOwnedNFTs?.length || 0
                      : artOwnedNFTs?.length || 0}
                  </Typography>
                  <Typography
                    sx={{
                      typography: { sm: 'sub-h-bk', miniMobile: 'lbl-md' },
                    }}
                  >
                    Owned
                  </Typography>
                </Box>
              }
              {...a11yProps(0)}
            />
            <Tab
              sx={tabStyle}
              label={
                <Box sx={tabSectionStyle}>
                  <Typography
                    variant="h3"
                    sx={{
                      p: 1,
                      typography: { sm: 'h3', miniMobile: 'sub-h' },
                    }}
                  >
                    {activeCat === 'node'
                      ? nodeSaleNFTs?.length || 0
                      : artSaleNFTs?.length || 0}
                  </Typography>
                  <Typography
                    sx={{
                      typography: { sm: 'sub-h-bk', miniMobile: 'lbl-md' },
                    }}
                  >
                    On Sale
                  </Typography>
                </Box>
              }
              {...a11yProps(1)}
            />
            <Tab
              sx={tabStyle}
              label={
                <Box sx={tabSectionStyle}>
                  <Typography
                    sx={{
                      p: 1,
                      typography: { sm: 'h3', miniMobile: 'sub-h' },
                    }}
                  >
                    {activeCat === 'node'
                      ? nodeFavrtNFTs?.length || 0
                      : artFavrtNFTs?.length || 0}
                  </Typography>
                  <Typography
                    sx={{
                      typography: {
                        sm: 'sub-h-bk',
                        miniMobile: 'lbl-md',
                      },
                    }}
                  >
                    Favourited
                  </Typography>
                </Box>
              }
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>
      </Box>

      <TabPanel value={value} index={0}>
        {ownedLoading ? (
          <Loader size={undefined} />
        ) : activeCat === 'node' && nodeOwnedNFTs?.length > 0 ? (
          <OwnedNfts data={nodeOwnedNFTs} nftType="node" />
        ) : activeCat === 'art' && artOwnedNFTs.length > 0 ? (
          <OwnedNfts data={artOwnedNFTs} nftType="art" />
        ) : (
          <NftEmptyState />
        )}
      </TabPanel>

      <TabPanel value={value} index={1}>
        {nftsSubgraphLoading ||
        (nftsBySubgraph?.data?.data?.listings.length && nftsMetadataLoading) ? (
          <Loader size={undefined} />
        ) : activeCat === 'node' && nodeSaleNFTs?.length > 0 ? (
          <SaleNft data={nodeSaleNFTs} nftType="node" />
        ) : activeCat === 'art' && artSaleNFTs?.length > 0 ? (
          <SaleNft data={artSaleNFTs} nftType="art" />
        ) : (
          <NftEmptyState />
        )}
      </TabPanel>

      <TabPanel value={value} index={2}>
        {favrtLoading || (newFavs.length && favNftsMetadataLoading) ? (
          <Loader size={undefined} />
        ) : activeCat === 'node' && nodeFavrtNFTs?.length > 0 ? (
          <FavouritedNfts data={nodeFavrtNFTs} nftType="node" />
        ) : activeCat === 'art' && artFavrtNFTs?.length > 0 ? (
          <FavouritedNfts data={artFavrtNFTs} nftType="art" />
        ) : (
          <NftEmptyState />
        )}
      </TabPanel>
    </Box>
  );
};

export default PublicProfile;
