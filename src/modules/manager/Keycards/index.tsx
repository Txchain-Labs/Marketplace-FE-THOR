import { nodesTypesWrapper } from '@/styles/Manager';
import { Box, useMediaQuery } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import DataTable from '../DataTable';
import { FormatRows } from '../formatTableData';
import {
  Toc,
  Edit,
  AllInclusive,
  FavoriteRounded,
  FavoriteBorder,
} from '@mui/icons-material';
import { menuItemIcon } from '@/styles/profile';
import {
  filterKeycards,
  filterRecords,
  getKeycardTokenAddress,
  getNodeGifs,
  searchRecords,
  sortRecords,
} from '../Helper';
import FilterDrawer from '../Filters';
import {
  resetFilter,
  showFilter,
  selectSearchText,
  dataActiveView,
  filterAppliedStatus,
  selectSort,
  setSort,
  selectFilter,
} from '@/redux/slices/managerFilterSlice';
import { useDispatch, useSelector } from '@/redux/store';
import BagDrawer from '../Bag/BagDrawer';

import { KeycardType } from '@/utils/types';
import { useChain } from '@/utils/web3Utils';
import {
  useGetAvaxFromThor,
  useGetAvaxFromUsd,
  useGetUsdFromAvax,
  useGetUsdFromThor,
} from '@/hooks/useOracle';
import DriftNodes from './drift';
import OriginNodes from './origin';
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
import AssetRenameModal from '@/components/modals/AssetRenamModal';
import { useRouter } from 'next/router';
import UpdateListNft from '@/components/modals/UpdateListNft';
import axios from 'axios';
import { showToast } from '@/redux/slices/toastSlice';
import Sticky from 'react-stickynode';
import ManagerHeader from '../ManagerHeader';
import ThumbnailView from '../ThumbnailView';
import ScrollToTop from '@/components/common/ScrollToTop';
import EmptyStateMisMatch from '../EmptyStateMisMatch';
import { getColumns } from './helper';
interface Keycards {
  keycards: KeycardType[];
  refetchFavrt: () => void;
}
const KeycardsTab = ({ keycards, refetchFavrt }: Keycards) => {
  const router = useRouter();
  const { type, tier } = router.query;
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
  const [activeType, setActiveType] = useState((type as string) || 'ORIGIN');
  const [filteredData, setFilteredData] = useState([]);
  const OGOdinData = useMemo(() => {
    const result = filterKeycards(keycards, 'ORIGIN', 'ODIN');
    return result ? result : [];
  }, [keycards]);
  const OGThorData = useMemo(() => {
    const result = filterKeycards(keycards, 'ORIGIN', 'THOR');
    return result ? result : [];
  }, [keycards]);
  const DROdinData = useMemo(() => {
    const result = filterKeycards(keycards, 'DRIFT', 'ODIN');
    return result ? result : [];
  }, [keycards]);
  const DRThorData = useMemo(() => {
    const result = filterKeycards(keycards, 'DRIFT', 'THOR');
    return result ? result : [];
  }, [keycards]);
  const chain = useChain();
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  const { data: usd2avax } = useGetAvaxFromUsd('1', chain);
  const { data: thor2avax } = useGetAvaxFromThor('1', chain);

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
        // tier: true,
      })
    );
  }, [activeNode, activeType, dispatch]);

  const setActive = (node: string, type: string) => {
    if (type !== activeType || node !== activeNode) {
      setActiveType(type);
      setActiveNode(node);
      router.push({
        pathname: '/manager/keycards',
        query: { type: type, tier: node },
      });
    }
  };
  const [editNameObject, setEditNameObject] = useState(null);
  const [renameModalOpen, SetRenameModalOpen] = useState(false);
  const handleRenameModalClose = () => {
    SetRenameModalOpen(false);
  };
  const handleViewDetail = (tokenId: string) => {
    const address = getKeycardTokenAddress(chain?.id);
    router.push(`/nft/${address}/${tokenId}`);
  };
  const [editList, setEditList] = useState(null);
  const [editListModalOpen, SetEditListModalOpen] = useState(false);
  const handleEditModalClose = () => {
    SetEditListModalOpen(false);
  };
  const handleEditName = (data: any) => {
    setEditNameObject({
      name: data?.name,
      tokenId: Number(data?.tokenId),
      type: 'keycard',
      image: getNodeGifs('keycard', activeType, activeNode),
    });
    SetRenameModalOpen(true);
  };
  const handleEditPrice = (data: any) => {
    setEditList({
      nftName: data?.name,
      by: 'Thorfi',
      // nftImage: getIpfsPublicUrl(data?.image),
      nftImage: getNodeGifs('keycard', activeType, activeNode),
      nftAddress: getKeycardTokenAddress(chain?.id),
      tokenId: data?.tokenId,
      status: 'edit',
    });
    SetEditListModalOpen(true);
  };
  const handleFavorites = async (row: any) => {
    const address = getKeycardTokenAddress(chain?.id);
    await axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/like-unsynced`, {
        user_id: user?.id,
        chainid: chain?.id,
        collection_address: address,
        token_id: row?.tokenId,
      })
      .then((res) => {
        if (res.data.code === 200) {
          const likeMessage = 'Successfully Liked NFT';
          const unlikeMessage = 'Like Successfully Removed';
          refetchFavrt();
          dispatch(
            showToast({
              message: row?.isFavorite ? unlikeMessage : likeMessage,
              severity: 'success',
              image:
                // getIpfsPublicUrl(row?.image) ||
                getNodeGifs('keycard', activeType, activeNode),
            })
          );
        }
      });
  };
  const handleMerge = () => {
    router.push('/gameloop/gamification/keycards');
  };
  const mdBreakPoint = useMediaQuery('(max-width:900px)');

  const formatData = (filteredData: any) => {
    const result = filteredData?.map((row: any) => {
      const rowActions = [];
      rowActions.push({
        title: 'View Details',
        icon: <Toc sx={menuItemIcon} />,
        action: () => handleViewDetail(row.tokenId),
      });
      if (row?.isListed) {
        rowActions.push({
          title: 'Edit Price',
          icon: <Edit sx={menuItemIcon} />,
          action: () => handleEditPrice(row),
        });
      }
      rowActions.push({
        title: 'Edit Name',
        icon: <Edit sx={menuItemIcon} />,
        action: () => handleEditName(row),
      });
      if (!row?.isListed) {
        rowActions.push({
          title: 'Merge on Gameloop',
          icon: <AllInclusive sx={menuItemIcon} />,
          action: handleMerge,
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
  //search
  const searchData = searchRecords(filteredData, searchText);
  const sortData = sortRecords(searchData, sort);
  const formattedData = formatData(sortData);

  return (
    <Box>
      <Box sx={{ ...nodesTypesWrapper, marginLeft: 2 }}>
        <OriginNodes
          setActive={setActive}
          activeType={activeType}
          activeNode={activeNode}
        />
        <DriftNodes
          setActive={setActive}
          activeType={activeType}
          activeNode={activeNode}
        />
      </Box>
      {editNameObject && (
        <AssetRenameModal
          data={editNameObject}
          open={renameModalOpen}
          handleClose={handleRenameModalClose}
        />
      )}
      {editList && (
        <UpdateListNft
          open={editListModalOpen}
          listNFT={editList}
          handleClose={handleEditModalClose}
        />
      )}
      <BagDrawer />
      <FilterDrawer
        pageType="keycard"
        nodeType={activeType}
        tier={activeNode}
      />
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
            <ManagerHeader type="Keycards" />
          </Box>
        </Sticky>
        {loading ? (
          <CommonLoader size="50px" text="Loading" height="auto" />
        ) : searchData.length ? (
          activeView === 'list' ? (
            <DataTable
              columns={getColumns(mdBreakPoint)}
              rows={formattedData}
            />
          ) : (
            <ThumbnailView
              pageType="keycard"
              nodeType={activeType}
              tier={activeNode}
              data={sortData}
              handleFavorites={handleFavorites}
              handleEditPrice={handleEditPrice}
              handleEditName={handleEditName}
            />
          )
        ) : isFilterApplied || (!searchData.length && searchText.length) ? (
          <EmptyStateMisMatch type={isFilterApplied ? 'Filter' : 'Search'} />
        ) : (
          <EmptyState type="Keycards" />
        )}
        <ScrollToTop offset={580} />
      </Box>
      <Footer />
    </Box>
  );
};

export default KeycardsTab;
