export interface Listing {
  id: string; // uint256
  sellerAddress: string; // String
  nftAddress: string; // String
  tokenId: string; // BigInt
  paymentType: string; // BigInt
  priceInWei: string; // BigInt
  expiresAt?: string; // BigInt
  expiredAt?: string; // BigInt
  nftOwnerAddress?: string; // String
  isInvalidOwner?: boolean; // Boolean
  saleType?: number;
  isLiked?: boolean;
  image?: string;
}
