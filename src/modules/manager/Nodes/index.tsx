import { Box, useMediaQuery } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { nodesTypesWrapper } from '../../../styles/Manager';
import DriftNodes from './drift';
import OriginNodes from './origin';
import DataTable from '../DataTable';
import {
  Toc,
  Edit,
  FavoriteBorder,
  FavoriteRounded,
  Launch,
  Rule,
  DoneAll,
  AllInclusive,
} from '@mui/icons-material';
import { FormatRows } from '../formatTableData';
import {
  searchRecords,
  filterNodes,
  getNodeTokenAddress,
  sortRecords,
  getNodeGifs,
  filterRecords,
} from '../Helper';
import { useDispatch, useSelector } from '@/redux/store';
import {
  resetFilter,
  showFilter,
  filterAppliedStatus,
  selectSearchText,
  dataActiveView,
  // getFilteredData,
  // applyFilter,
  selectSort,
  setSort,
  selectFilter,
} from '@/redux/slices/managerFilterSlice';
import FilterDrawer from '../Filters';
import BagDrawer from '../Bag/BagDrawer';
import { NodeType } from '@/utils/types';
import { useChain } from '@/utils/web3Utils';
import {
  useGetAvaxFromThor,
  useGetAvaxFromUsd,
  useGetUsdFromAvax,
  useGetUsdFromThor,
} from '@/hooks/useOracle';
import {
  addItemToBag,
  removeItemFromBag,
  selectBagListedIds,
  selectBagState,
  selectBagUnListedIds,
  selectBagUnListedItems,
  setBagState,
} from '@/redux/slices/managerBagSlice';
import EmptyState from '../EmptyState';
import { CommonLoader } from '@/components/common';
import Footer from '@/layouts/Footer';
import { useRouter } from 'next/router';
import UpdateListNft from '@/components/modals/UpdateListNft';
import axios from 'axios';
import { showToast } from '@/redux/slices/toastSlice';
import ThumbnailView from '../ThumbnailView';
import Sticky from 'react-stickynode';
import ScrollToTop from '@/components/common/ScrollToTop';
import ManagerHeader from '../ManagerHeader';
import { menuItemIcon } from '@/styles/profile';
import EmptyStateMisMatch from '../EmptyStateMisMatch';
import { getColumns } from './helper';
interface Nodes {
  nodes: NodeType[];
  refetchFavrt: () => void;
  isOGorDrift?: string;
}
const NodesTab = ({ nodes, refetchFavrt, isOGorDrift = 'origin' }: Nodes) => {
  // console.log(nodes, 'nodes');
  const router = useRouter();
  const { tier } = router.query;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const isFilterApplied = useSelector(filterAppliedStatus);
  const filters = useSelector(selectFilter);
  const bagListedIds = useSelector(selectBagListedIds);
  const bagUnListedIds = useSelector(selectBagUnListedIds);
  const bagState = useSelector(selectBagState);
  const user = useSelector((state: any) => state?.auth?.user);
  const searchText = useSelector(selectSearchText);
  const activeView = useSelector(dataActiveView);
  const sort = useSelector(selectSort);
  const bagUnListedItems = useSelector(selectBagUnListedItems);
  const handleRowSelect = (row: any) => {
    if (bagListedIds.includes(row.id) || bagUnListedIds.includes(row.id)) {
      dispatch(removeItemFromBag(row));
    } else {
      dispatch(addItemToBag(row));
    }
    dispatch(setBagState({ item: row }));
  };

  const [activeNode, setActiveNode] = useState((tier as string) || 'ODIN');
  const [activeType, setActiveType] = useState(isOGorDrift.toUpperCase());
  const [filteredData, setFilteredData] = useState([]);
  const chain = useChain();
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  const { data: usd2avax } = useGetAvaxFromUsd('1', chain);
  const { data: thor2avax } = useGetAvaxFromThor('1', chain);
  const OGOdinData = useMemo(() => {
    const result = filterNodes(nodes, 'ORIGIN', 'ODIN');
    return result ? result : [];
  }, [nodes]);
  const OGThorData = useMemo(() => {
    const result = filterNodes(nodes, 'ORIGIN', 'THOR');
    return result ? result : [];
  }, [nodes]);
  const DROdinData = useMemo(() => {
    const result = filterNodes(nodes, 'DRIFT', 'ODIN');
    return result ? result : [];
  }, [nodes]);
  const DRThorData = useMemo(() => {
    const result = filterNodes(nodes, 'DRIFT', 'THOR');
    return result ? result : [];
  }, [nodes]);
  useEffect(() => {
    const dataToFilter =
      activeType === 'ORIGIN' && activeNode === 'ODIN'
        ? OGOdinData
        : activeType === 'ORIGIN' && activeNode === 'THOR'
        ? OGThorData
        : activeType === 'DRIFT' && activeNode === 'ODIN'
        ? DROdinData
        : DRThorData;
    const result = filterRecords(dataToFilter, filters, usd2avax, thor2avax);
    if (JSON.stringify(filteredData) !== JSON.stringify(result)) {
      setFilteredData(result);
    }
    setLoading(false);
  }, [
    filters,
    usd2avax,
    thor2avax,
    activeNode,
    activeType,
    OGOdinData,
    OGThorData,
    DROdinData,
    DRThorData,
    filteredData,
  ]);
  useEffect(() => {
    dispatch(resetFilter());
    dispatch(setSort({ orderBy: 'price', orderDirection: 'desc' }));
    dispatch(
      showFilter({
        favs: true,
        status: true,
        bids: true,
        price: true,
        pendingRewards: true,
        dueDate: true,
        perks: activeType === 'ORIGIN' ? true : false,
      })
    );
  }, [activeNode, activeType, dispatch]);
  const setActive = (node: string, type: string) => {
    setActiveType(type);
    setActiveNode(node);
    // resetFilters(type);
    router.push({
      pathname: `/manager/${type.toLowerCase()}`,
      query: { type: type, tier: node },
    });
  };

  const mdBreakPoint = useMediaQuery('(max-width:900px)');
  const [editList, setEditList] = useState(null);
  const [editListModalOpen, SetEditListModalOpen] = useState(false);
  const handleEditModalClose = () => {
    SetEditListModalOpen(false);
  };
  const handleViewDetail = (tokenId: string) => {
    const address = getNodeTokenAddress(activeType, activeNode, chain?.id);
    router.push(`/nft/${address}/${tokenId}`);
  };
  const handleEditPrice = (data: any) => {
    setEditList({
      nftName: data?.name,
      by: 'Thorfi',
      // nftImage: getIpfsPublicUrl(data?.image),
      nftImage: getNodeGifs('node', activeType, activeNode),
      nftAddress: getNodeTokenAddress(activeType, activeNode, chain?.id),
      tokenId: data?.tokenId,
      status: 'edit',
    });
    SetEditListModalOpen(true);
  };

  const handleFavorites = async (row: any) => {
    const address = getNodeTokenAddress(activeType, activeNode, chain?.id);
    await axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/like-unsynced`, {
        user_id: user?.id,
        chainid: chain?.id,
        collection_address: address,
        token_id: row?.tokenId,
      })
      .then((res) => {
        if (res.data.code === 200) {
          refetchFavrt();
          const likeMessage = 'Successfully Liked NFT';
          const unlikeMessage = 'Like Successfully Removed';
          dispatch(
            showToast({
              message: row?.isFavorite ? unlikeMessage : likeMessage,
              severity: 'success',
              image:
                // getIpfsPublicUrl(row?.image) ||
                getNodeGifs('node', activeType, activeNode),
            })
          );
        }
      });
  };
  const transform = () => {
    router.push('/gameloop');
  };
  const formatData = (filteredData: any) => {
    const result = filteredData?.map((row: any) => {
      const rowActions = [];
      if (
        row?.nodeType === 'ORIGIN' ||
        (row?.nodeType === 'DRIFT' && row?.condition === 'inactive')
      ) {
        rowActions.push({
          title: 'View Details',
          icon: <Toc sx={menuItemIcon} />,
          action: () => handleViewDetail(row.tokenId),
        });
      }
      if (row?.isListed) {
        rowActions.push({
          title: ' Edit Price',
          icon: <Edit sx={menuItemIcon} />,
          action: () => handleEditPrice(row),
        });
      }
      rowActions.push({
        title: row?.isFavorite ? 'Remove From Favorites' : 'Add to Favorites',
        icon: row?.isFavorite ? (
          <FavoriteRounded sx={menuItemIcon} />
        ) : (
          <FavoriteBorder sx={menuItemIcon} />
        ),
        action: () => handleFavorites(row),
      });
      if (!row?.isListed && row?.nodeType === 'ORIGIN') {
        rowActions.push({
          title: 'Transform on Gameloop',
          icon: <AllInclusive sx={menuItemIcon} />,
          action: transform,
        });
      }
      // actions for drift nodes
      if (
        row?.nodeType === 'DRIFT' &&
        !row?.isListed &&
        row?.condition === 'active'
      ) {
        rowActions.push({
          title: 'Claim on Thorfi Dapp',
          icon: <Launch sx={menuItemIcon} />,
          action: () => window.open('https://app.thorfi.io/nodes', '_blank'),
        });
        rowActions.push({
          title: 'Deactivate on Gameloop',
          icon: <Rule sx={menuItemIcon} />,
          action: () => router.push('/gameloop'),
        });
      }
      if (
        row?.nodeType === 'DRIFT' &&
        row?.isSecondHand &&
        row?.condition === 'inactive'
      ) {
        rowActions.push({
          title: 'Active for 1 USDC.e',
          icon: <DoneAll sx={menuItemIcon} />,
          action: () => router.push('/gameloop'),
        });
      }
      if (
        row?.nodeType === 'DRIFT' &&
        !row?.isSecondHand &&
        row?.condition === 'inactive'
      ) {
        // rowActions.push({
        //   title: 'Activate',
        //   icon: <DoneAll sx={menuItemIcon} />,
        //   action: () => router.push('/gameloop/activate-drift-nodes'),
        // });
        rowActions.push({
          title: 'Activate on Gameloop',
          icon: <DoneAll sx={menuItemIcon} />,
          action: () => router.push('/gameloop'),
        });
      }

      return FormatRows(
        row,
        handleRowSelect,
        bagState === 1 ? bagListedIds : bagState === 2 ? bagUnListedIds : [],
        rowActions,
        mdBreakPoint,
        avaxPrice,
        thorPrice,
        bagState,
        bagUnListedItems,
        user
      );
    });
    return result ? result : [];
  };
  const searchData = searchRecords(filteredData, searchText);
  const sortData = sortRecords(searchData, sort);
  const formattedData = formatData(sortData);

  return (
    <Box>
      <Box sx={{ ...nodesTypesWrapper, marginLeft: 2 }}>
        {activeType === 'ORIGIN' ? (
          <OriginNodes
            setActive={setActive}
            activeType={activeType}
            activeNode={activeNode}
          />
        ) : (
          <DriftNodes
            setActive={setActive}
            activeType={activeType}
            activeNode={activeNode}
          />
        )}
      </Box>
      {editList && (
        <UpdateListNft
          open={editListModalOpen}
          listNFT={editList}
          handleClose={handleEditModalClose}
        />
      )}
      <BagDrawer />
      <FilterDrawer pageType="node" nodeType={activeType} tier={activeNode} />
      <Box
        sx={(theme) => ({
          'p': '16px',
          '& .sticky-header-active .sticky-header': {
            boxShadow: theme.shadows[1],
            mx: '-16px',
            px: '16px',
          },
        })}
      >
        <Sticky top={48} innerZ={3} innerActiveClass={'sticky-header-active'}>
          <Box
            sx={(theme) => ({
              bgcolor: 'background.default',
              py: '24px',
              [theme.breakpoints.down('sm')]: {
                pt: '16px',
                pb: 0,
              },
            })}
            className={'sticky-header'}
          >
            <ManagerHeader type="Nodes" />
          </Box>
        </Sticky>
        {loading ? (
          <CommonLoader size="50px" text="Loading" height="auto" />
        ) : searchData.length ? (
          activeView === 'list' ? (
            <DataTable
              columns={getColumns(mdBreakPoint, activeType)}
              rows={formattedData}
            />
          ) : (
            <ThumbnailView
              pageType="node"
              nodeType={activeType}
              tier={activeNode}
              data={sortData}
              handleFavorites={handleFavorites}
              handleEditPrice={handleEditPrice}
            />
          )
        ) : isFilterApplied || (!searchData.length && searchText.length) ? (
          <EmptyStateMisMatch type={isFilterApplied ? 'Filter' : 'Search'} />
        ) : (
          <EmptyState
            type={activeType === 'ORIGIN' ? 'OG' : 'Drift'}
            nodeType={activeNode}
          />
        )}
        <ScrollToTop offset={580} />
      </Box>
      <Footer />
    </Box>
  );
};

export default NodesTab;
