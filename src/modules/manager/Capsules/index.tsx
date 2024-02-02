import { nodesWrapper } from '@/styles/Manager';
import { Box, useMediaQuery } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import DataTable from '../DataTable';
import { FormatRows } from '../formatTableData';
import {
  Toc,
  Edit,
  FavoriteBorder,
  FavoriteRounded,
  AllInclusive,
} from '@mui/icons-material';
import { menuItemIcon } from '@/styles/profile';
import {
  filterCapsules,
  filterRecords,
  getCapsuleTokenAddress,
  getNodeGifs,
  searchRecords,
  sortRecords,
} from '../Helper';
import {
  resetFilter,
  showFilter,
  filterAppliedStatus,
  selectSearchText,
  dataActiveView,
  selectSort,
  setSort,
  selectFilter,
} from '@/redux/slices/managerFilterSlice';
import FilterDrawer from '../Filters';
import { useDispatch, useSelector } from '@/redux/store';
import BagDrawer from '../Bag/BagDrawer';

import { CapsuleType } from '@/utils/types';
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
import NodeSelectVideoTile from '../NodeSelectVideoTile';
import Footer from '@/layouts/Footer';
import { useRouter } from 'next/router';
import AssetRenameModal from '@/components/modals/AssetRenamModal';
import UpdateListNft from '@/components/modals/UpdateListNft';
import { getIpfsPublicUrl } from '@/utils/common';
import axios from 'axios';
import { showToast } from '@/redux/slices/toastSlice';
import Sticky from 'react-stickynode';
import ManagerHeader from '../ManagerHeader';
import ThumbnailView from '../ThumbnailView';
import ScrollToTop from '@/components/common/ScrollToTop';
import EmptyStateMisMatch from '../EmptyStateMisMatch';
import { getColumns } from './helper';
interface Capsules {
  capsules: CapsuleType[];
  refetchFavrt: () => void;
}
const CapsuleTab = ({ capsules, refetchFavrt }: Capsules) => {
  const router = useRouter();
  const { type } = router.query;
  const [loading, setLoading] = useState(true);
  const [activeNode, setActiveNode] = useState((type as string) || 'ORIGIN');
  const dispatch = useDispatch();
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

  const chain = useChain();
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  const { data: usd2avax } = useGetAvaxFromUsd('1', chain);
  const { data: thor2avax } = useGetAvaxFromThor('1', chain);
  const handleRowSelect = (row: any) => {
    if (bagListedIds.includes(row.id) || bagUnListedIds.includes(row.id)) {
      dispatch(removeItemFromBag(row));
    } else {
      dispatch(addItemToBag(row));
    }
    dispatch(setBagState({ item: row }));
  };
  const [filteredData, setFilteredData] = useState([]);

  const OGData = useMemo(() => {
    const result = filterCapsules(capsules, 'ORIGIN');
    return result ? result : [];
  }, [capsules]);
  const DRData = useMemo(() => {
    const result = filterCapsules(capsules, 'DRIFT');
    return result ? result : [];
  }, [capsules]);
  useEffect(() => {
    const dataToFilter = activeNode === 'ORIGIN' ? OGData : DRData;
    const result = filterRecords(dataToFilter, filters, usd2avax, thor2avax);
    if (JSON.stringify(filteredData) !== JSON.stringify(result)) {
      setFilteredData(result);
    }
    setLoading(false);
  }, [filters, usd2avax, thor2avax, activeNode, OGData, DRData, filteredData]);

  useEffect(() => {
    dispatch(resetFilter());
    dispatch(setSort({ orderBy: 'price', orderDirection: 'desc' }));
    dispatch(showFilter({ favs: true, status: true, bids: true, price: true }));
  }, [activeNode, dispatch]);
  const switchNode = (node: string) => {
    if (node !== activeNode) {
      setActiveNode(node);
      router.push({
        pathname: '/manager/capsules',
        query: { type: type },
      });
    }
  };
  const [editNameObject, setEditNameObject] = useState(null);
  const [renameModalOpen, SetRenameModalOpen] = useState(false);
  const handleRenameModalClose = () => {
    SetRenameModalOpen(false);
  };
  const handleViewDetail = (tokenId: string) => {
    const address = getCapsuleTokenAddress(chain?.id);
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
      type: 'capsule',

      image: getNodeGifs('capsule', activeNode, 'CAPSULE'),
    });
    SetRenameModalOpen(true);
  };
  const handleEditPrice = (data: any) => {
    setEditList({
      nftName: data?.name,
      by: 'Thorfi',
      // nftImage: getIpfsPublicUrl(data?.image),
      nftImage: getNodeGifs('capsule', activeNode, 'CAPSULE'),
      nftAddress: getCapsuleTokenAddress(chain?.id),
      tokenId: data?.tokenId,
      status: 'edit',
    });
    SetEditListModalOpen(true);
  };
  const handleFavorites = async (row: any) => {
    const address = getCapsuleTokenAddress(chain?.id);
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
                getIpfsPublicUrl(row?.image) ||
                // getNodeTumbnail('capsule', activeNode, 'CAPSULE'),
                getNodeGifs('capsule', activeNode, 'CAPSULE'),
            })
          );
        }
      });
  };
  const handleOpen = () => {
    router.push('/gameloop/gamification/capsules');
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
          title: 'Open on Gameloop',
          icon: <AllInclusive sx={menuItemIcon} />,
          action: handleOpen,
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
      <Box sx={{ ...nodesWrapper, marginLeft: 2 }}>
        <NodeSelectVideoTile
          nodeType="ORIGIN"
          currentActive={activeNode === 'ORIGIN'}
          enable={true}
          poster="/images/manager/stills/OriginCapsule.jpg"
          video="/images/manager/videos/Origin_capsule_closed.mp4"
          text="ORIGIN"
          handleTileClick={switchNode}
        />
        <NodeSelectVideoTile
          nodeType="DRIFT"
          currentActive={activeNode === 'DRIFT'}
          enable={true}
          poster="/images/manager/stills/DriftCapsule.jpg"
          video="/images/manager/videos/Drift_capsule_closed.mp4"
          text="DRIFT"
          handleTileClick={switchNode}
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
      <FilterDrawer pageType="capsule" nodeType={activeNode} tier="CAPSULE" />
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
            <ManagerHeader type="Capsules" />
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
              pageType="capsule"
              nodeType={activeNode}
              tier={'CAPSULE'}
              data={sortData}
              handleFavorites={handleFavorites}
              handleEditPrice={handleEditPrice}
              handleEditName={handleEditName}
            />
          )
        ) : isFilterApplied || (!searchData.length && searchText.length) ? (
          <EmptyStateMisMatch type={isFilterApplied ? 'Filter' : 'Search'} />
        ) : (
          <EmptyState type="Capsules" />
        )}
        <ScrollToTop offset={580} />
      </Box>
      <Footer />
    </Box>
  );
};

export default CapsuleTab;
