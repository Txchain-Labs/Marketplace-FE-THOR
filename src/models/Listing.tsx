export interface Listing {
  id: string; // uint256
  sellerAddress: string; // String
  nftAddress: string; // String
  nftName?: string; // String
  tokenId: string; // BigInt
  paymentType: string; // BigInt
  priceInWei: string; // BigInt
  assetsType?: string; //BigInt
  nodeType?: string; //BigInt
  tier?: string; //BigInt
  lastClaimTime?: string; //BigInt
  dueDate?: string; //BigInt
  expiresAt?: string; // BigInt
  expiredAt?: string; // BigInt
  nftOwnerAddress?: string; // String
  isInvalidOwner?: boolean; // Boolean
  acceptPayments?: string[]; // String array
  saleType?: number;
  isLiked?: boolean;
  image?: string;
  usdPrice?: number;
  metadata?: any;
}

export interface ActiveBid {
  bidType: string;
  id: string;
  nftAddress: string;
  tokenId: string;
  paymentType: number;
  priceInWei: string;
  listingPrice?: string;
  listingPricePaymentType?: number;
  expiresAt?: number;
}
