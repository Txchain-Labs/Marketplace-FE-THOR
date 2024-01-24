import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Stack } from '@mui/system';
import { Avatar, Typography, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { dottedAddress } from '../../../../shared/utils/utils';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { authAction } from '../../../../redux/slices/authSlice';
import {
  menu,
  menuItem,
  profile_0001,
  profile_0002,
  tabSectionStyle,
  tabsStyle,
  tabStyle,
} from '../../../../styles/profile';
import { collectionsService } from '../../../../services/collection.service';
import dayjs from 'dayjs';
import Image from 'next/image';
import axios from 'axios';
import { useAccount, useDisconnect } from 'wagmi';
import OwnedNfts from '../../../../components/common/ownedNFT';
import NftEmptyState from './nftEmptyState';
import SaleNft from '../../../../components/common/saleNFT';
import {
  useGetActiveBids,
  useGetNFTList,
  useGetNFTMetadata,
  useGetNFTsByWallet,
  useGetNFTsFavrt,
  useGetReceivedBids,
} from '../../../../hooks/useNFTDetail';
import { useGetLikedListings } from '../../../../hooks/useListings';

import Loader from '../../../../components/common/Loader';
import { getNodesContractByChain } from '../../../../utils/constants';
import { useChain } from '../../../../utils/web3Utils';
import FavouritedNfts from '../../../../components/common/FavouritedNfts';
import { useGetNodesByWallet } from '../../../../hooks/useNodes';
import ActiveBids from '../../../../components/common/ActiveBids';
import ReceivedBids from '../../../../components/common/ReceivedBids';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
export const flexIcon = () => {
  return (
    <svg
      width="22"
      height="16"
      viewBox="0 0 22 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19.7795 0H1.71992C0.769416 0 0 0.769416 0 1.71992C0 2.67043 0.769416 3.43984 1.71992 3.43984H19.8022C20.7527 3.43984 21.5221 2.67043 21.5221 1.71992C21.5221 0.769416 20.7301 0 19.7796 0H19.7795ZM17.0423 6.26827H4.45953C3.50902 6.26827 2.7396 7.03769 2.7396 7.98819C2.7396 8.9387 3.50902 9.70812 4.45953 9.70812H17.065C18.0155 9.70812 18.785 8.9387 18.785 7.98819C18.785 7.03769 17.9928 6.26827 17.0423 6.26827ZM7.19392 12.56H14.3001H14.3003C15.2508 12.56 16.0428 13.3294 16.0426 14.2799C16.0426 15.2304 15.2732 15.9998 14.3227 15.9998H7.19392C6.24341 15.9998 5.474 15.2304 5.474 14.2799C5.474 13.3294 6.24341 12.56 7.19392 12.56Z"
        fill="black"
      />
    </svg>
  );
};

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
function a11yProps(index: number) {
  return {
    'id': `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// const NODES_CONTRACTS = [
//   '0x037debb6c84b357a059f6f789b683f83cc96d31c',
//   '0x28796ebfeffee932f2f57cae1fe380b55cffc01c',
// ];

interface ChildProps {
  change: any;
  activeFilter: any;
}
const ProfileTab = ({ change, activeFilter }: ChildProps) => {
  const chain = useChain();
  const router = useRouter();
  const user = useSelector((state: any) => state?.auth?.user);
  const dispatch = useDispatch();
  const { address } = useAccount();

  const NODES_CONTRACTS = React.useMemo(
    () => getNodesContractByChain(chain),
    [chain]
  );
  //Get Data from hooks
  const { data: nftsByWallet, isLoading: ownedLoading } =
    useGetNFTsByWallet(address);
  const { data: nftsBySubgraph, isLoading: nftsSubgraphLoading } =
    useGetNFTList(address);
  const {
    data: nftsMetadata,
    isLoading: nftsMetadataLoading,
    refetch: refetchNFTsMetadata,
  } = useGetNFTMetadata(nftsBySubgraph?.data?.data?.listings, 0);
  const { data: nodeOwnedNFTs, refetch: refetchNodeOwnedNFTs } =
    useGetNodesByWallet(user?.address); // get nodeownedNFTs

  const [nodeOwnedFilterNFTs, setNodeOwnedFilterNFTs] = React.useState([]);

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

  const artSaleNFTs = nftsMetadata?.filter(
    (nft: any) => !NODES_CONTRACTS.includes(nft.token_address)
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
  const { data: nodeFavrtNFTs } = useGetLikedListings(
    'nodes',
    user,
    null,
    'onlyFavs=1'
  );
  const {
    data: activeBids,
    isLoading: activeBidsLoading,
    refetch: refetchActiveBids,
  } = useGetActiveBids(user?.address);
  const artActiveBids = activeBids?.data?.data?.activeBids?.filter(
    (nft: any) => !NODES_CONTRACTS.includes(nft?.nftAddress)
  );
  const nodeActiveBids = activeBids?.data?.data?.activeBids?.filter(
    (nft: any) => NODES_CONTRACTS.includes(nft?.nftAddress)
  );
  const {
    data: receivedBids,
    isLoading: receivedBidsLoading,
    refetch: refetchReceivedBids,
  } = useGetReceivedBids(user?.address);
  const artReceivedBids = receivedBids?.data?.data?.activeBids?.filter(
    (nft: any) => !NODES_CONTRACTS.includes(nft?.nftAddress)
  );
  const nodeReceivedBids = receivedBids?.data?.data?.activeBids?.filter(
    (nft: any) => NODES_CONTRACTS.includes(nft?.nftAddress)
  );
  // const nodeFavrtNFTs = React.useMemo(
  //   () => nodeFavrtNFTsData?.data ?? [],
  //   [nodeFavrtNFTsData]
  // );

  // favNftsMetadata?.filter((nft: any) =>
  //   NODES_CONTRACTS.includes(nft?.token_address)
  // );
  // fvrt hook work ends here

  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [, setCollections] = React.useState<any>([]);
  const [, setLoading] = React.useState<boolean>(false);
  const [, setCntFavoritedNFTs] = React.useState<number>(0);
  const { disconnect } = useDisconnect();

  // const collections = useSelector((state: any) => state?.collections?.collections);
  React.useEffect(() => {
    const retNodeOwnedNFTs = nodeOwnedNFTs?.filter(
      (node_item) =>
        !nodeSaleNFTs?.find(
          (sale_item) => sale_item.token_id === node_item.token_id
        )
    );
    if (
      JSON.stringify(nodeOwnedFilterNFTs) !== JSON.stringify(retNodeOwnedNFTs)
    ) {
      setNodeOwnedFilterNFTs(retNodeOwnedNFTs);
    }
  }, [nodeOwnedNFTs, nodeSaleNFTs, nodeOwnedFilterNFTs]);

  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const fetch = React.useCallback(async () => {
    try {
      setLoading(true);

      let res = await collectionsService.getCollectionsByOwner(user?.address);
      setCollections(res.data.data);

      res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/liked-by/${user?.id}`
      );
      if (res?.data?.code === 200) {
        setCntFavoritedNFTs(res.data.data.length);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [user?.address, user?.id]);
  React.useEffect(() => {
    void fetch();
  }, [fetch]);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  // const changeGrid = (value: string) => {
  //   setGrid(value);
  // };
  React.useEffect(() => {
    const fetchUserCollections = async () => {
      try {
        setLoading(true);
        const res = await collectionsService.getCollectionsByOwner(
          user?.address
        );
        setCollections(res.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    void fetchUserCollections();
  }, [user?.address]);

  const logoutHandler = () => {
    dispatch(authAction.clearStates());
    void router.push('/');
    handleClose();
    disconnect();
  };

  return (
    <Box sx={{ width: '100%' }}>
      {user ? (
        <>
          <Stack direction="row" justifyContent="space-between">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              // width="60%"
            >
              <Box display="flex">
                <Avatar
                  src={user?.profile_picture || '/images/profile-yellow.svg'}
                  sx={{ height: 80, width: 80 }}
                />
                <Box ml={2}>
                  <Typography
                    sx={{
                      fontWeight: { sm: 700 },
                      typography: {
                        md: 'h4',
                        sm: 'sub-h',
                        miniMobile: 'p-lg',
                      },
                    }}
                  >
                    {user?.username}
                  </Typography>

                  <Typography
                    sx={{
                      typography: { sm: 'p-lg-bk', miniMobile: 'body1' },
                    }}
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
                    Joined {dayjs(user.joined_date).format('MMMM YYYY')}
                  </Typography>
                  <Box display="flex" mt={1}>
                    {!!user.twitter && (
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
                            @{user.twitter}
                          </Typography>
                        </Box>
                      </a>
                    )}

                    {!!user.discord && (
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
                          @{user.discord}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            <MoreVertIcon sx={{ cursor: 'pointer' }} onClick={handleClick} />
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
                        sx={{
                          p: 1,
                          typography: { sm: 'h3', miniMobile: 'sub-h' },
                        }}
                      >
                        {activeFilter === 'node'
                          ? nodeOwnedFilterNFTs?.length || 0
                          : artOwnedNFTs?.length || 0}
                      </Typography>
                      <Typography
                        sx={{
                          typography: {
                            sm: 'sub-h-bk',
                            miniMobile: 'lbl-md',
                          },
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
                        sx={{
                          p: 1,
                          typography: { sm: 'h3', miniMobile: 'sub-h' },
                        }}
                      >
                        {activeFilter === 'node'
                          ? nodeSaleNFTs?.length || 0
                          : artSaleNFTs?.length || 0}
                      </Typography>
                      <Typography
                        sx={{
                          typography: {
                            sm: 'sub-h-bk',
                            miniMobile: 'lbl-md',
                          },
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
                        {activeFilter === 'node'
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
                        {activeFilter === 'node'
                          ? nodeActiveBids?.length || 0
                          : artActiveBids?.length || 0}
                      </Typography>
                      <Typography
                        sx={{
                          typography: {
                            sm: 'sub-h-bk',
                            miniMobile: 'lbl-md',
                          },
                        }}
                      >
                        Active Bids
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(3)}
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
                        {activeFilter === 'node'
                          ? nodeReceivedBids?.length || 0
                          : artReceivedBids?.length || 0}
                      </Typography>
                      <Typography
                        sx={{
                          typography: {
                            sm: 'sub-h-bk',
                            miniMobile: 'lbl-md',
                          },
                        }}
                      >
                        Received Bids
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(4)}
                />
              </Tabs>
            </Box>
            {/* 
         {value === 0 && (
              <Box sx={profile_003}>
                <Box mt="2.6px">
                                  <Image height={20} width={24} src="/images/flex-icon.svg" />
                              </Box>
                <WindowIcon
                  onClick={() => changeGrid('grid')}
                  sx={{ m: '0px 5px' }}
                />
                <Box mt="2.6px" onClick={() => changeGrid('list')}>
                  <Image
                    height={18}
                    width={20}
                    src="/images/menue-icon.png"
                    alt=""
                  />
                </Box>
              </Box>
            )} */}
          </Box>
          <TabPanel value={value} index={0}>
            {/* {grid === 'list' ? (
              <CollectionList collections={collections} loading={loading} />
            ) : (
              <Collections collections={collections} loading={loading} />
            )} */}
            {ownedLoading ? (
              <Loader size={undefined} />
            ) : activeFilter === 'node' && nodeOwnedFilterNFTs?.length > 0 ? (
              <OwnedNfts
                data={nodeOwnedFilterNFTs}
                enableActions={true}
                nftType="node"
                refetches={[refetchNFTsMetadata, refetchNodeOwnedNFTs]}
              />
            ) : activeFilter === 'art' && artOwnedNFTs?.length > 0 ? (
              <OwnedNfts
                data={artOwnedNFTs}
                enableActions={true}
                nftType="art"
                refetches={[refetchNFTsMetadata, refetchNodeOwnedNFTs]}
              />
            ) : (
              <NftEmptyState />
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {nftsSubgraphLoading ||
            (nftsBySubgraph?.data?.data?.listings.length &&
              nftsMetadataLoading) ? (
              <Loader size={undefined} />
            ) : activeFilter === 'node' && nodeSaleNFTs?.length > 0 ? (
              <SaleNft
                data={nodeSaleNFTs}
                enableActions={true}
                nftType="node"
                refetches={[refetchNFTsMetadata, refetchNodeOwnedNFTs]}
              />
            ) : activeFilter === 'art' && artSaleNFTs?.length > 0 ? (
              <SaleNft
                data={artSaleNFTs}
                enableActions={true}
                nftType="art"
                refetches={[refetchNFTsMetadata, refetchNodeOwnedNFTs]}
              />
            ) : (
              <NftEmptyState />
            )}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {favrtLoading || (newFavs.length && favNftsMetadataLoading) ? (
              <Loader size={undefined} />
            ) : activeFilter === 'node' && nodeFavrtNFTs?.length > 0 ? (
              <FavouritedNfts data={nodeFavrtNFTs} nftType="node" />
            ) : activeFilter === 'art' && artFavrtNFTs?.length > 0 ? (
              <FavouritedNfts data={artFavrtNFTs} nftType="art" />
            ) : (
              <NftEmptyState />
            )}
          </TabPanel>
          <TabPanel value={value} index={3}>
            {activeBidsLoading ? (
              <Loader size={undefined} />
            ) : activeFilter === 'node' && nodeActiveBids?.length > 0 ? (
              <ActiveBids
                data={nodeActiveBids}
                enableActions={true}
                nftType="node"
                refetches={refetchActiveBids}
              />
            ) : activeFilter === 'art' && artActiveBids?.length > 0 ? (
              <ActiveBids
                data={artActiveBids}
                enableActions={true}
                nftType="art"
                refetches={refetchActiveBids}
              />
            ) : (
              <NftEmptyState />
            )}
          </TabPanel>
          <TabPanel value={value} index={4}>
            {receivedBidsLoading ? (
              <Loader size={undefined} />
            ) : activeFilter === 'node' && nodeReceivedBids?.length > 0 ? (
              <ReceivedBids
                data={nodeReceivedBids}
                enableActions={true}
                nftType="node"
                refetches={refetchReceivedBids}
              />
            ) : activeFilter === 'art' && artReceivedBids?.length > 0 ? (
              <ReceivedBids
                data={artReceivedBids}
                enableActions={true}
                nftType="art"
                refetches={refetchReceivedBids}
              />
            ) : (
              <NftEmptyState />
            )}
          </TabPanel>
          <Menu
            sx={{ ...menu, marginLeft: '-25px' }}
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem sx={menuItem} onClick={logoutHandler}>
              Logout
            </MenuItem>
            <MenuItem sx={menuItem} onClick={() => router.push('profile/edit')}>
              Edit Profile
            </MenuItem>
            <MenuItem
              sx={{ ...menuItem, display: { md: 'none', miniMobile: 'block' } }}
              onClick={(e) => {
                change(e, 1);
              }}
            >
              Activity
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Box
          sx={{
            height: '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderLeft: '1px solid black',
          }}
        >
          <Typography variant="h1">Please connect wallet</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProfileTab;
