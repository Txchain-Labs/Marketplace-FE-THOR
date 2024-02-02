import { useGetTransaction, useMarketplaceAddress } from '@/hooks/Marketplace';
import { useGetNFTApproval, useSetNFTApproval } from '@/hooks/useNFTDetail';
import { ToastSeverity, showToast } from '@/redux/slices/toastSlice';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
interface DialogProps {
  open: boolean;
  onClose: () => void;
  nftData: {
    address: string;
    tokenId: number;
    image?: string;
  };
}
const ApprovalModal = ({ open, onClose, nftData }: DialogProps) => {
  const marketplaceAddress = useMarketplaceAddress();
  const dispatch = useDispatch();
  const {
    data: nftApproval,
    refetch: refetchGetApproval,
    isLoading: getApprovalLoading,
  } = useGetNFTApproval(nftData?.address, nftData?.tokenId);
  const {
    data: approvalData,
    write: approveNFT,
    isLoading: approveNFTLoading,
    isSuccess: setApprovalSuccess,
    isError: setApprovalError,
  } = useSetNFTApproval(nftData?.address);
  const { isLoading: transactionLoading } = useGetTransaction(
    approvalData?.hash
  );
  useEffect(() => {
    if (setApprovalSuccess) {
      dispatch(
        showToast({
          message: 'NFT is Approved',
          severity: ToastSeverity.SUCCESS,
          image: nftData?.image || '/images/nft-placeholder.png',
        })
      );
      refetchGetApproval();
    } else if (setApprovalError) {
      dispatch(
        showToast({
          message: 'Error occurred in setting Approval',
          severity: ToastSeverity.ERROR,
          image: nftData?.image || '/images/nft-placeholder.png',
        })
      );
    }
  }, [
    setApprovalSuccess,
    refetchGetApproval,
    setApprovalError,
    dispatch,
    nftData,
  ]);

  const setApproval = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    if (nftApproval === ethers.constants.AddressZero) {
      approveNFT({
        recklesslySetUnpreparedArgs: [
          marketplaceAddress,
          Number(nftData?.tokenId),
        ],
      });
      return;
    }
  };

  useEffect(() => {
    if (nftApproval !== ethers.constants.AddressZero) {
      onClose();
    }
  }, [nftApproval, onClose]);

  return (
    <Dialog
      open={open}
      sx={{ zIndex: 10000002 }}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This action requires NFT Approval
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={
            approveNFTLoading || getApprovalLoading || transactionLoading
          }
          onClick={(e) => setApproval(e)}
          autoFocus
        >
          Request Approval
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApprovalModal;
