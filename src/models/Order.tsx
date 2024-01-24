export interface Order {
  // Order ID
  id: number;
  // Sale Type(fixed:0, auction:1)
  saleType: number;
  // Payment Type(AVAX:0, THOR:1)
  paymentType: number;
  // Seller of the NFT
  seller: string;
  // Owner of the NFT
  owner: string;
  // NFT address
  nftAddress: string;
  // order amount in case of erc1155
  amountOfErc1155: string;
  // Price (in wei) for the published item
  price: string;
  // Time when this sale ends
  expiresAt: number;
  // sold
  sold: boolean;
  // cancelled;
  cancelled: boolean;
}
