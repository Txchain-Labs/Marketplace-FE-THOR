import BuyNFTModal from '@/components/modals/BuyNFTModal';
import { useGetAcceptPaymentsByNFT } from '@/hooks/useNodes';
import { getIpfsPublicUrl } from '@/utils/common';
import { Button } from '@mui/material';
import { useMemo, useState } from 'react';
interface Props {
  data: any;
  index: number;
}
const BuyAction = ({ data, index }: Props) => {
  const [buyOpen, setBuyOpen] = useState(false);

  const {
    data: baseAcceptPayments,
    isError: fetchingError,
  }: { data: any[]; isError: boolean } = useGetAcceptPaymentsByNFT(
    data?.nftAddress,
    data?.tokenId
  );

  const acceptPayments = useMemo(() => {
    let value = ['0', '0', '0'];
    if (baseAcceptPayments && data && !fetchingError) {
      const filteredArr = baseAcceptPayments.filter(
        (element) => element === null
      );
      if (filteredArr.length === 3) {
        value[Number((data as any)?.paymentType)] = (data as any)?.priceInWei;
      } else {
        value = baseAcceptPayments.map((element) => {
          return element ? element.toString() : '0';
        });
      }
    }
    return value;
  }, [baseAcceptPayments, data, fetchingError]);

  const handleBuy = () => {
    setBuyOpen(true);
  };

  const handleBuyClose = () => {
    setBuyOpen(false);
  };
  const nftData = {
    image: getIpfsPublicUrl(data?.metadata?.image) || '/images/nftImage.png',
    title: data?.metadata?.name,
  };

  return (
    <>
      <Button
        onClick={handleBuy}
        variant={'outlined'}
        color={'secondary'}
        sx={{ width: '75px' }}
      >
        Buy
      </Button>
      {buyOpen && (
        <BuyNFTModal
          open={buyOpen}
          handleClose={handleBuyClose}
          collectionAddress={data?.nftAddress}
          tokenId={data?.tokenId}
          key={`buy-${index}`}
          nft={nftData}
          listing={data}
          acceptPayments={acceptPayments}
        />
      )}
    </>
  );
};

export default BuyAction;
