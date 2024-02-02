export interface BagListing {
  id: string; // uint256
  sellerAddress: string; // String
  token_address: string; // String
  token_id: string; // BigInt
  name: string; // String
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
