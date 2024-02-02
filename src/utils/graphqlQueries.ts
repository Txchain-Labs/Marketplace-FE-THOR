export const fetchBidsQuery = (orderId: string | undefined) => {
  return `
    query {
      bids(where: {orderId: "${orderId}"}) {
        priceInWei
        bidder
        expiresAt
        expiredAt
        blockTimestamp
        paymentType
      }
    }`;
};
export const fetchOtcBidsQuery = (nftAddress: any, tokenId: any) => {
  return `
    query
      {
        otcbidTokens(
          where: {tokenId: "${tokenId}", address: "${nftAddress.toLowerCase()}"}
        ) {
          bids {
            priceInWei
            bidder
            blockTimestamp
            expiresAt
            expiredAt
          }
          id
          address
          tokenId
        }
      }`;
};
export const fetchNFTsQuery = (userAddress: any) => {
  if (userAddress) {
    return `
    query {
      listings(where: {sellerAddress: "${userAddress.toLowerCase()}", isInvalidOwner: false}) {
        tokenId
        nftAddress
        priceInWei
      }
    }
    `;
  } else {
    return '';
  }
};

export const fetchAllBidsQuery = (nftAddress: string) => {
  return `
    query
      {
        bids (where: {nftAddress: "${nftAddress.toLowerCase()}"}, orderBy: priceInWei, orderDirection: desc, first: 1) {
          nftAddress
          tokenId
          bidder
          priceInWei
          expiresAt
        }
      }`;
};

export const fetchBidsForNftQuery = (nftAddress: string, tokenId: any) => {
  return `
    query
      {
        bids (where: {nftAddress: "${nftAddress.toLowerCase()}", tokenId: "${tokenId}"}, orderBy: priceInWei, orderDirection: desc) {
          nftAddress
          tokenId
          bidder
          priceInWei
          paymentType
          expiresAt
          blockTimestamp
        }
      }`;
};

export const fetchVolumeQuery = (address: string) => {
  return `
    query
      {
        collectionSums(where: {id: "${address.toLowerCase()}"}, first: 1) {
          id
          totalTrades
          totalVolumeAvax
          totalVolumeThor
        }
      }`;
};

export const fetchListingQuery = (address: string) => {
  return `
    query
      {
        listings(where: {nftAddress: "${address.toLowerCase()}", isInvalidOwner: false}, orderBy: priceInWei, orderDirection: asc, first: 1) {
          paymentType
          priceInWei
          nftAddress
        }
      }`;
};

export const fetchFloorPriceQuery = (address: string, paymentType: any) => {
  return `
    query
      {
        listings(where: {nftAddress: "${address.toLowerCase()}", paymentType: ${paymentType}, isInvalidOwner: false}, orderBy: priceInWei, orderDirection: asc, first: 1) {
          paymentType
          priceInWei
          nftAddress
        }
      }`;
};

export const fetchBestOfferQuery = (nftAddress: string, paymentType: any) => {
  return `
    query
      {
        bids (where: {nftAddress: "${nftAddress.toLowerCase()}", paymentType: ${paymentType} }, orderBy: priceInWei, orderDirection: desc, first: 1) {
          nftAddress
          tokenId
          bidder
          priceInWei
          paymentType
          expiresAt
        }
      }`;
};

export const fetchBestOfferOTCQuery = (
  nftAddress: string,
  paymentType: any
) => {
  return `
    query
      {
        otcbids (where: {nftAddress: "${nftAddress}", paymentType: ${paymentType} }, orderBy: priceInWei, orderDirection: desc, first: 1) {
          nftAddress
          tokenId
          bidder
          priceInWei
          paymentType
          expiresAt
        }
      }`;
};

export const fetchListingsQuery = (
  nftAddress: any,
  start: number,
  limit: number
) => {
  return `
    query
      {
        listings (where: {nftAddress:"${nftAddress.toLowerCase()}", isInvalidOwner: false} skip: ${start} first: ${limit}){
          id
          sellerAddress
          nftAddress
          tokenId
          paymentType
          priceInWei
         }
      }`;
};

export const fetchListingsByUserQuery = (userAddress: any) => {
  if (userAddress) {
    return `
    query {
      listings(where: {sellerAddress: "${userAddress.toLowerCase()}", isInvalidOwner: false}) {
        tokenId
        nftAddress
        priceInWei
      }
    }
    `;
  } else {
    return '';
  }
};

export const fetchListingByTokenId = (nftAddress: string, tokenId: number) => {
  return `
    query
      {
        listings (where: {nftAddress:"${nftAddress.toLowerCase()}", tokenId:"${tokenId}", isInvalidOwner: false}){
          id
          sellerAddress
          nftAddress
          tokenId
          paymentType
          priceInWei
          saleType
          expiresAt
          expiredAt
          nftOwnerAddress
          isInvalidOwner
         }
      }`;
};

export const listedNodesCountQuery = (nftAddress: string) => {
  return `
    query
      {
        nodesOnSales (where : {id: "${nftAddress.toLowerCase()}"}) {
          id
          totalNodes
        }
      }`;
};

export const fetchActivitiesSeller = (address: string) => {
  return `
    query
      {
        activities (where: {user: "${address.toLowerCase()}"}) {
          id
          nftAddress
          status
          tokenId
          to
          updatedAt
          user
        }
      }`;
};

export const fetchActivitiesBidder = (address: string) => {
  return `
    query
      {
        activities (where: {to: "${address.toLowerCase()}"}) {
          id
          nftAddress
          status
          tokenId
          to
          updatedAt
          user
        }
      }`;
};

export const fetchActivitiesBidderSeller = (address: string, cnt: number) => {
  return `
    query
      {
        activities (where: { or: [ { user: "${address.toLowerCase()}" }, { to: "${address.toLowerCase()}" } ] } skip: 0, orderBy: updatedAt, orderDirection: desc, first: ${cnt} ) {
          id
          nftAddress
          status
          tokenId
          to
          updatedAt
          user
          priceInWei
          paymentType
          transactionHash
        }
      }`;
};

export const bidderActiveBids = (bidderAddress: string) => {
  const now = Number(Math.ceil((new Date() as any as number) / 1000));
  return `
  query
    {
      activeBids(orderBy: priceInWei, orderDirection: desc, where: {bidder: "${bidderAddress}", expiresAt_gt:"${now}"}) {
        bidType
        nftAddress
        paymentType
        priceInWei
        tokenId
        id
      }
    }`;
};

export const fetchReceivedBids = (ownerAddress: string) => {
  const now = Number(Math.ceil((new Date() as any as number) / 1000));
  return `
  query
    {
      activeBids(orderBy: priceInWei, orderDirection: desc, where: {owner: "${ownerAddress.toLowerCase()}", expiresAt_gt:"${now}"}) {
        bidType
        nftAddress
        paymentType
        priceInWei
        tokenId
        id
        listingPrice
        listingPricePaymentType
        expiresAt
      }
    }`;
};

export const fetchStakedDriftNodes = (ownerAddress: string) => {
  return `
  query
    {
      stakedNFTs(where: {ownerAddress: "${ownerAddress?.toLowerCase()}"}, first: 500) {
        id
        ownerAddress
        tokenId
        odin
        stakedTimestamp
      }
    }`;
};
