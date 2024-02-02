import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from '@/redux/store';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box } from '@mui/material';

import {
  addToBagList,
  removeFromBagList,
  selectId2bagListedIndex,
  selectTabState,
  setTabState,
} from '@/redux/slices/bagListSlice';
import { showToast, ToastSeverity } from '@/redux/slices/toastSlice';

import { useChain } from '@/utils/web3Utils';
import { useGetUsdFromAvax, useGetUsdFromThor } from '@/hooks/useOracle';
import { useAddLike } from '@/hooks/useNFTDetail';
import { getMetaDataName } from '@/utils/common';

import { Nft } from '@/models/Nft';

import { MODAL_TYPES, useGlobalModalContext } from '@/components/modals';
import { CommonLoader } from '@/components/common';
import PlaceBid from '@/components/modals/PlaceBid';
import ArtworkCard from '@/components/common/thumbnails/ArtworkCard';
import UpdateListNft from '@/components/modals/UpdateListNft';

interface NFTsListProps {
  isLoading: boolean;
  nfts: Nft[];
  favoritedAddressIds: string[];
  showingCartIcon: boolean;
}

const NFTsList: FC<NFTsListProps> = ({
  isLoading,
  nfts,
  favoritedAddressIds,
  showingCartIcon = false,
}) => {
  const chain = useChain();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const { showModal } = useGlobalModalContext();

  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);

  const { tabState, ownedBagListed, onsaleBagListed } =
    useSelector(selectTabState);
  const id2bagListedIndex = useSelector(selectId2bagListedIndex);

  const [isBidModalOpen, setIsBidModalOpen] = useState<boolean>(false);
  const [biddingNft, setBiddingNft] = useState<Nft | null>(null);
  const [activeBidType, setActiveBidType] = useState<string>('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [listNFT, setListNFT] = useState(null);

  const { mutate: likeNFT } = useAddLike();

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const handleLike = (collection_address: string, token_id: string) => {
    likeNFT({
      user_id: user?.id,
      chainid: chain?.id,
      collection_address,
      token_id: parseInt(token_id),
    });
  };

  const handlePlaceBid = (nft: Nft, activeBidType: string) => {
    if (user?.address) {
      setBiddingNft(nft);
      setActiveBidType(activeBidType);
      setIsBidModalOpen(true);
    } else {
      showModal(MODAL_TYPES.CONNECT_WALLET, {
        title: 'Create instance form',
        confirmBtn: 'Save',
      });
    }
  };

  const handleEditList = (nft: Nft) => {
    setShowEditModal(!showEditModal);

    setListNFT({
      nftName: getMetaDataName(nft),
      by: nft?.name,
      nftImage: nft.img,
      nftAddress: nft?.token_address,
      tokenId: nft?.token_id,
      status: 'edit',
    });
  };

  const handleCart = (nft: Nft) => {
    if (id2bagListedIndex.includes(nft.collection_address + nft.token_id)) {
      const bagPayload: any = {
        value: tabState,
        owned: ownedBagListed,
        onsale: onsaleBagListed,
      };
      if (tabState === 0) {
        bagPayload.owned = ownedBagListed.filter(
          (val) => !(nft.token_id === val.token_id)
        );
      } else {
        bagPayload.onsale = onsaleBagListed.filter(
          (val) => !(nft.token_id === val.token_id)
        );
      }

      dispatch(setTabState(bagPayload));
      dispatch(removeFromBagList(nft.collection_address + nft.token_id));
    } else {
      const nftPayload: any = {
        ...nft,
        image: nft.img,
      };
      const bagPayload: any = {
        value: tabState,
        owned: ownedBagListed,
        onsale: onsaleBagListed,
      };
      if (tabState === 0) {
        bagPayload.owned = [...ownedBagListed, nftPayload];
      } else {
        bagPayload.onsale = [...onsaleBagListed, nftPayload];
      }

      dispatch(setTabState(bagPayload));
      dispatch(addToBagList(nftPayload));
      dispatch(
        showToast({
          message: 'Added to baglist',
          severity: ToastSeverity.SUCCESS,
          image: nftPayload.image,
        })
      );
    }
  };

  const handleCloseBidModal = () => {
    setBiddingNft(null);
    setIsBidModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(!showEditModal);
  };

  return (
    <Box mt={'16px'}>
      {isLoading ? (
        <CommonLoader
          size={undefined}
          text={'Loading NFTs...'}
          width={'100%'}
          height={'500px'}
        />
      ) : (
        <Box
          sx={(theme) => ({
            ml: '-16px',
            [theme.breakpoints.down('sm')]: { ml: 0 },
          })}
        >
          {nfts?.map((nft) => (
            <Box
              key={nft.collection_address + nft.token_id}
              sx={(theme) => ({
                float: 'left',
                width: '209px',
                ml: '16px',
                mb: '16px',
                [theme.breakpoints.down('sm')]: {
                  width: 'calc(50vw - 16px)',
                  ml: 0,
                  mb: '8px',
                },
              })}
            >
              <ArtworkCard
                nft={nft}
                avaxPrice={avaxPrice}
                thorPrice={thorPrice}
                isLiked={favoritedAddressIds?.includes(
                  `${nft.collection_address}-${nft.token_id}`
                )}
                onLike={() =>
                  handleLike(nft?.collection_address, nft?.token_id)
                }
                isCarted={id2bagListedIndex.includes(
                  nft.collection_address + nft.token_id
                )}
                handleCart={handleCart}
                showingCartIcon={showingCartIcon}
                handlePlaceBid={handlePlaceBid}
                handleEditList={handleEditList}
                width={smDown ? 'calc(50vw - 16px)' : undefined}
              />
            </Box>
          ))}
        </Box>
      )}

      {isBidModalOpen && (
        <PlaceBid
          open={isBidModalOpen}
          handleClose={handleCloseBidModal}
          collectionAddress={biddingNft.collection_address}
          tokenId={Number(biddingNft.token_id)}
          nft={{
            image: biddingNft.img,
            title: biddingNft.metadata
              ? JSON.parse(biddingNft.metadata).name
              : biddingNft.name,
          }}
          activeBidType={activeBidType}
        />
      )}
      {setListNFT && (
        <UpdateListNft
          open={showEditModal}
          listNFT={listNFT}
          handleClose={handleCloseEditModal}
        />
      )}
    </Box>
  );
};

export default NFTsList;
