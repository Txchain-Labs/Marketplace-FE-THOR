import React, { FC, useMemo } from 'react';
import { Avatar, AvatarGroup, AvatarGroupProps } from '@mui/material';
import { useGetAcceptPaymentsByNFT } from '@/hooks/useNodes';

interface AcceptPayments {
  nftAddress: any;
  tokenId: any;
  paymentType: any;
  priceWei: any;
}

const MultiCurrency: FC<AvatarGroupProps & AcceptPayments> = (props) => {
  const { nftAddress, tokenId, paymentType, priceWei } = props;
  const {
    data: baseAcceptPayments,
    isError: fetchingError,
  }: { data: any[]; isError: boolean } = useGetAcceptPaymentsByNFT(
    nftAddress,
    tokenId
  );

  const acceptPayments = useMemo(() => {
    let value = ['0', '0', '0'];
    if (baseAcceptPayments && !fetchingError) {
      const filteredArr = baseAcceptPayments.filter(
        (element) => element === null
      );
      if (filteredArr.length === 3) {
        value[Number(paymentType)] = priceWei;
      } else {
        value = baseAcceptPayments.map((element) => {
          return element ? element.toString() : '0';
        });
      }
    }
    return value;
  }, [baseAcceptPayments, fetchingError, paymentType, priceWei]);

  return (
    <AvatarGroup {...props}>
      <Avatar
        alt="avax"
        src="/images/avaxIcon1.svg"
        sx={{
          width: '18px',
          height: '18px',
          display: acceptPayments[0] === '0' ? 'none' : 'block',
          backgroundColor: 'black',
          borderWidth: '1px',
          color: 'white',
        }}
      />
      <Avatar
        alt="thor"
        src="/images/thorIcon1.svg"
        sx={{
          width: '18px',
          height: '18px',
          display: acceptPayments[1] === '0' ? 'none' : 'block',
          borderWidth: '1px',
          backgroundColor: 'black',
          color: 'white',
        }}
      />
      <Avatar
        alt="usdc"
        src="/images/usdcIcon1.svg"
        sx={{
          width: '18px',
          height: '18px',
          display: acceptPayments[2] === '0' ? 'none' : 'block',
          borderWidth: '1px',
          backgroundColor: 'black',
          color: 'white',
        }}
      />
    </AvatarGroup>
  );
};

export default MultiCurrency;
