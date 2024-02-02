import { ArrowForward } from '@mui/icons-material';
import {
  Typography,
  Box,
  Drawer,
  Button,
  List,
  IconButton,
  Badge,
  BadgeProps,
  useMediaQuery,
} from '@mui/material';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeBagModal,
  isDataRefetching,
  isModalOpen,
  resetBag,
  selectBagListedIds,
  selectBagListedItems,
  selectBagState,
  selectBagUnListedIds,
  selectBagUnListedItems,
  // setDataRefetchingFalse,
} from '@/redux/slices/managerBagSlice';
// import { useListNFT } from '@/hooks/useNFTDetail';
import { useChain } from '@/utils/web3Utils';
import BagItem from './BagItem';
import SelectBatchBuy from '@/components/modals/SelectBatchBuy';
import { useEffect, useState } from 'react';
import { getIpfsPublicUrl } from '@/utils/common';
import { ToastSeverity } from '@/redux/slices/toastSlice';
import { useUnListNFT } from '@/hooks/useNFTDetail';
import { useGetTransaction } from '@/hooks/Marketplace';
import {
  getCapsuleTokenAddress,
  getKeycardTokenAddress,
  getNodeGifs,
  getNodeTokenAddress,
  getPerkTokenAddress,
} from '../Helper';
import { NAVBAR_HEIGHT } from '@/utils/constants';
const StyledBadge = styled(Badge)<BadgeProps>(() => ({
  '& .MuiBadge-badge': {
    right: -15,
    top: '30%',
    padding: '0px 6px',
  },
}));

const BagDrawer = () => {
  const dataRefetching = useSelector(isDataRefetching);
  const bagActive = useSelector(isModalOpen);
  const bagListedIds = useSelector(selectBagListedIds);
  const bagUnListedIds = useSelector(selectBagUnListedIds);
  const bagState = useSelector(selectBagState);
  const bagListedItems = useSelector(selectBagListedItems);
  const bagUnListedItems = useSelector(selectBagUnListedItems);
  const miniMobileBreakPoint = useMediaQuery('(max-width:430px)');
  const [nodesToList, setNodesToList] = useState([]);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [nftApprovalAddress, setNFTApprovalAddress] = useState('');

  const handleBuyModalClose = () => {
    setOpenBuyModal(false);
  };

  const chain = useChain();
  const dispatch = useDispatch();
  const unListNFTToast = {
    message: 'NFTs Unlisting...',
    severity: ToastSeverity.INFO,
    image: getNodeGifs(
      bagListedItems[0]?.pageType,
      bagListedItems[0]?.nodeType,
      bagListedItems[0]?.tier
    ),
    itemCount: bagListedItems ? bagListedItems?.length : 0,
    autoHideDuration: 5000,
  };
  const txnToast = {
    message: 'NFTs Unlisted',
    severity: ToastSeverity.SUCCESS,
    image: getNodeGifs(
      bagListedItems[0]?.pageType,
      bagListedItems[0]?.nodeType,
      bagListedItems[0]?.tier
    ),
    itemCount: bagListedItems ? bagListedItems?.length : 0,
    autoHideDuration: 5000,
  };

  const { data: unlistTransactionData, write: unListNFTWrite } =
    useUnListNFT(unListNFTToast);

  useGetTransaction(unlistTransactionData?.hash, txnToast);

  useEffect(() => {
    const result = bagUnListedItems?.map((item: any) => ({
      token_id: item?.tokenId,
      image:
        item?.pageType !== 'perk'
          ? getNodeGifs(item?.pageType, item?.nodeType, item?.tier)
          : getIpfsPublicUrl(item?.image),
      name: item?.name,
      token_address:
        item?.pageType === 'node'
          ? getNodeTokenAddress(
              item?.nodeType,
              item?.tier,
              chain?.id
            ).toLowerCase()
          : item?.pageType === 'keycard'
          ? getKeycardTokenAddress(chain?.id).toLowerCase()
          : item?.pageType === 'capsule'
          ? getCapsuleTokenAddress(chain?.id).toLowerCase()
          : item?.pageType === 'perk'
          ? getPerkTokenAddress(chain?.id).toLowerCase()
          : '',
    }));
    setNFTApprovalAddress(result?.length > 0 ? result[0]?.token_address : '');
    setNodesToList(result ? result : []);
  }, [bagUnListedItems, chain?.id]);

  const handleListNodes = () => {
    dispatch(closeBagModal());
    setOpenBuyModal(true);
  };

  useEffect(() => {
    dispatch(resetBag());
  }, [dataRefetching, dispatch]);
  const handleUnListNodes = () => {
    const token_address: any[] = [];
    const token_id: any[] = [];
    bagListedItems?.map((item: any) => {
      token_id.push(item.tokenId);
      token_address.push(
        item?.pageType === 'node'
          ? getNodeTokenAddress(
              item?.nodeType,
              item?.tier,
              chain?.id
            ).toLowerCase()
          : item?.pageType === 'keycard'
          ? getKeycardTokenAddress(chain?.id).toLowerCase()
          : item?.pageType === 'capsule'
          ? getCapsuleTokenAddress(chain?.id).toLowerCase()
          : item?.pageType === 'perk'
          ? getPerkTokenAddress(chain?.id).toLowerCase()
          : ''
      );
    });
    if (token_address.length && token_id.length) {
      dispatch(closeBagModal());
      unListNFTWrite({
        recklesslySetUnpreparedArgs: [token_address, token_id],
      });
    }
  };

  return (
    <>
      <Drawer
        slotProps={{
          backdrop: {
            invisible: true,
          },
        }}
        PaperProps={{
          sx: {
            mt: NAVBAR_HEIGHT,
            width: {
              miniMobile: '100vw',
              sm: '385px',
            },
            height: {
              miniMobile: `calc(100vh - ${NAVBAR_HEIGHT.miniMobile})`,
              sm: `calc(100vh - ${NAVBAR_HEIGHT.sm})`,
            },
            p: '16px 0px ',
            backgroundImage: 'none',
          },
        }}
        anchor={'right'}
        elevation={1}
        open={bagActive}
        onClose={() => dispatch(closeBagModal())}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mt={2}
          mb={4}
          px={2}
        >
          {miniMobileBreakPoint ? (
            <Typography variant="h4">Manager Bag</Typography>
          ) : (
            <Typography variant="h3">Manager Bag</Typography>
          )}
          <StyledBadge
            badgeContent={
              (bagState === 1
                ? bagListedIds
                : bagState === 2
                ? bagUnListedIds
                : []
              ).length
            }
            color="primary"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{ top: '-15px', right: '18px' }}
          ></StyledBadge>

          {bagListedIds?.length || bagUnListedIds?.length ? (
            <Box>
              <Button
                onClick={() => dispatch(resetBag())}
                sx={{ width: 'fit-content', textTransform: 'none' }}
              >
                Reset all
              </Button>
            </Box>
          ) : (
            ''
          )}
          <IconButton
            sx={{ display: { sm: 'none', miniMobile: 'block' } }}
            onClick={() => dispatch(closeBagModal())}
          >
            <ArrowForward sx={{ color: 'text.primary' }} />
          </IconButton>
        </Box>

        <List
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
          disablePadding
        >
          {bagState === 1 &&
            bagListedItems?.map((item: any, index: number) => (
              <BagItem
                pageType={item?.pageType}
                activeType={item?.nodeType}
                activeNode={item?.tier}
                index={index}
                data={item}
                key={index}
              />
            ))}
          {bagState === 2 &&
            bagUnListedItems?.map((item: any, index: number) => (
              <BagItem
                pageType={item?.pageType}
                activeType={item?.nodeType}
                activeNode={item?.tier}
                index={index}
                data={item}
                key={index}
              />
            ))}
          {bagListedIds.length <= 0 && bagUnListedIds.length <= 0 && (
            <Typography
              variant="lbl-md"
              sx={{ textAlign: 'center', color: 'text.secondary' }}
            >
              Add items to get started.
            </Typography>
          )}
        </List>

        <Box sx={{ width: '100%', paddingX: 2 }}>
          {bagState === 2 && (
            <Button
              onClick={handleListNodes}
              sx={{
                display: 'flex',
                borderRadius: '0%',
              }}
              variant="contained"
              fullWidth
            >
              <Typography variant="lbl-md">List</Typography>
            </Button>
          )}
          {bagState === 1 && (
            <Button
              onClick={handleUnListNodes}
              sx={{
                display: 'flex',
                borderRadius: '0%',
                width: '100%',
                maxWidth: '100%',
              }}
              variant="outlined"
              color={'secondary'}
            >
              <Typography variant="lbl-md">UnList</Typography>
            </Button>
          )}
        </Box>
        <SelectBatchBuy
          buy_open={openBuyModal}
          buy_handleClose={handleBuyModalClose}
          buy_nfts={nodesToList}
          buy_approvalAddress={nftApprovalAddress}
        />
      </Drawer>
    </>
  );
};

export default BagDrawer;
