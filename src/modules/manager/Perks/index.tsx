import { Box, useMediaQuery } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { nodesTypesWrapper } from '../../../styles/Manager';

import DataTable from '../DataTable';
import {
  Toc,
  AllInclusive,
  FavoriteBorder,
  Edit,
  FavoriteRounded,
} from '@mui/icons-material';
import { menuItemIcon } from '@/styles/profile';
import { FormatRows } from '../formatTableData';
import OriginPerks from './Origin';
import EmptyState from '../EmptyState';
import {
  filterPerks,
  filterRecords,
  getNodeTumbnail,
  getPerkTokenAddress,
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

import { PerkType } from '@/utils/types';
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
import { CommonLoader } from '@/components/common';
import Footer from '@/layouts/Footer';
import { useRouter } from 'next/router';
import AssetRenameModal from '@/components/modals/AssetRenamModal';
import UpdateListNft from '@/components/modals/UpdateListNft';
import { getIpfsPublicUrl } from '@/utils/common';
import { showToast } from '@/redux/slices/toastSlice';
import axios from 'axios';
import Sticky from 'react-stickynode';
import ManagerHeader from '../ManagerHeader';
import ThumbnailView from '../ThumbnailView';
import ScrollToTop from '@/components/common/ScrollToTop';
import EmptyStateMisMatch from '../EmptyStateMisMatch';
import ClaimVoucher from '@/components/modals/VoucherClaim';
import { getColumns } from './helper';
interface Perks {
  perks: PerkType[];
  refetchFavrt: () => void;
}
const PerksTab = ({ perks, refetchFavrt }: Perks) => {
  const router = useRouter();
  const { type, tier } = router.query;
  const [loading, setLoading] = useState(true);
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
  const [claimVoucher, setClaimVoucher] = useState(null);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const handleClaimModalClose = () => {
    setClaimModalOpen(false);
  };
  const handleRowSelect = (row: any) => {
    if (bagListedIds.includes(row.id) || bagUnListedIds.includes(row.id)) {
      dispatch(removeItemFromBag(row));
    } else {
      dispatch(addItemToBag(row));
    }
    dispatch(setBagState({ item: row }));
  };

  const [activeNode, setActiveNode] = useState((tier as string) || 'SIGMA');
  const [activeType, setActiveType] = useState((type as string) || 'ORIGIN');
  const [filteredData, setFilteredData] = useState([]);
  const chain = useChain();
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  const { data: usd2avax } = useGetAvaxFromUsd('1', chain);
  const { data: thor2avax } = useGetAvaxFromThor('1', chain);
  const sigmaData = useMemo(() => {
    const result = filterPerks(perks, 'SIGMA', 'ORIGIN');
    return result ? result : [];
  }, [perks]);
  const gammaData = useMemo(() => {
    const result = filterPerks(perks, 'GAMMA', 'ORIGIN');
    return result ? result : [];
  }, [perks]);
  const deltaData = useMemo(() => {
    const result = filterPerks(perks, 'DELTA', 'ORIGIN');
    return result ? result : [];
  }, [perks]);
  const bonusData = useMemo(() => {
    const result = filterPerks(perks, 'BONUS', 'ORIGIN');
    return result ? result : [];
  }, [perks]);
  useEffect(() => {
    const dataToFilter =
      activeType === 'ORIGIN' && activeNode === 'SIGMA'
        ? sigmaData
        : activeType === 'ORIGIN' && activeNode === 'GAMMA'
        ? gammaData
        : activeType === 'ORIGIN' && activeNode === 'DELTA'
        ? deltaData
        : bonusData;
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
    sigmaData,
    gammaData,
    deltaData,
    bonusData,
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
        // condition: true,
        price: true,
      })
    );
  }, [activeNode, activeType, dispatch]);
  const setActive = (node: string, type: string) => {
    setActiveType(type);
    setActiveNode(node);
    router.push({
      pathname: '/manager/perks',
      query: { type: type, tier: node },
    });
  };
  const mdBreakPoint = useMediaQuery('(max-width:900px)');
  const [editNameObject, setEditNameObject] = useState(null);
  const [renameModalOpen, SetRenameModalOpen] = useState(false);
  const handleRenameModalClose = () => {
    SetRenameModalOpen(false);
  };
  const handleViewDetail = (tokenId: string) => {
    const address = getPerkTokenAddress(chain?.id);
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
      type: 'perk',
      image: getIpfsPublicUrl(data?.image),
    });
    SetRenameModalOpen(true);
  };
  const handleEditPrice = (data: any) => {
    setEditList({
      nftName: data?.name,
      by: 'Thorfi',
      nftImage: getIpfsPublicUrl(data?.image),
      nftAddress: getPerkTokenAddress(chain?.id),
      tokenId: data?.tokenId,
      status: 'edit',
    });
    SetEditListModalOpen(true);
  };
  const handleClaim = (data: any) => {
    setClaimVoucher({
      name: data?.name,
      by: 'Thorfi',
      image: getIpfsPublicUrl(data?.image),
      tokenAddress: getPerkTokenAddress(chain?.id),
      tokenId: data?.tokenId,
    });
    setClaimModalOpen(true);
    // setClaimPerkToast({
    //   message: 'Claiming Voucher...',
    //   severity: ToastSeverity.INFO,
    //   image: row?.image?.length
    //     ? getIpfsPublicUrl(row?.image)
    //     : '/images/nft-placeholder.png',
    // });
    // setTxnToast({
    //   message: 'Voucher Claimed',
    //   severity: ToastSeverity.SUCCESS,
    //   image: row?.image?.length
    //     ? getIpfsPublicUrl(row?.image)
    //     : '/images/nft-placeholder.png',
    //   autoHideDuration: 5000,
    // });
    // claimPerkWrite({
    //   recklesslySetUnpreparedArgs: [Number(row?.tokenId), 0, 0],
    // });
  };

  const handleFavorites = async (row: any) => {
    const address = getPerkTokenAddress(chain?.id);
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
                getNodeTumbnail('perk', activeType, activeNode),
            })
          );
        }
      });
  };
  const handleApply = () => {
    router.push('/gameloop/gamification/perks');
  };
  const formatData = (filteredData: any) => {
    const result = filteredData?.map((row: any) => {
      const rowActions = [];
      rowActions.push({
        title: 'View Details',
        icon: <Toc sx={menuItemIcon} />,
        action: () => handleViewDetail(row.tokenId),
      });
      if (row?.tier === 'BONUS' && !row?.isListed) {
        rowActions.push({
          title: 'Claim Voucher',
          icon: <AllInclusive sx={menuItemIcon} />,
          action: () => handleClaim(row),
        });
      }
      if (row?.isListed) {
        rowActions.push({
          title: 'Edit Price',
          icon: <Edit sx={menuItemIcon} />,
          action: () => handleEditPrice(row),
        });
      }
      if (!row?.isListed && row?.tier !== 'BONUS') {
        rowActions.push({
          title: 'Apply on Gameloop',
          icon: <AllInclusive sx={menuItemIcon} />,
          action: handleApply,
        });
      }
      rowActions.push({
        title: 'Edit Name',
        icon: <Edit sx={menuItemIcon} />,
        action: () => handleEditName(row),
      });
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
        <OriginPerks
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
      {claimVoucher && (
        <ClaimVoucher
          open={claimModalOpen}
          voucher={claimVoucher}
          handleClose={handleClaimModalClose}
        />
      )}
      <BagDrawer />
      <FilterDrawer pageType="perk" nodeType={activeType} tier={activeNode} />
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
            <ManagerHeader type="Perks" />
          </Box>
        </Sticky>
        {loading ? (
          <CommonLoader size="50px" text="Loading" height="auto" />
        ) : searchData.length ? (
          activeView === 'list' ? (
            <DataTable
              columns={getColumns(mdBreakPoint, activeNode)}
              rows={formattedData}
            />
          ) : (
            <ThumbnailView
              pageType="perk"
              nodeType={activeType}
              tier={activeNode}
              data={sortData}
              handleFavorites={handleFavorites}
              handleEditPrice={handleEditPrice}
              handleEditName={handleEditName}
              handleClaimVoucher={handleClaim}
            />
          )
        ) : isFilterApplied || (!searchData.length && searchText.length) ? (
          <EmptyStateMisMatch type={isFilterApplied ? 'Filter' : 'Search'} />
        ) : (
          <EmptyState type="Perks" />
        )}
        <ScrollToTop offset={580} />
      </Box>
      <Footer />
    </Box>
  );
};

export default PerksTab;
