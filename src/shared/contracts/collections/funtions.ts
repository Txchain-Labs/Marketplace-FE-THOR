import { ethers } from 'ethers';
import { collectionABI, collectionAddress } from './confis';
// import nftMarket from "./nft_m";
// import NFTAbi from "./nft.json";

// var nftMarketAddress: any =
//   process.env.NEXT_PUBLIC_REACT_APP_NFT_MARKET_ADDRESS;
// var nftMarketAddress: any = "0xeB437963Db848De33b260B5920AF0A3d180F48eE";
// let nftAddress: any = process.env.NEXT_PUBLIC_REACT_APP_NFT_ADDRESS;
// let nftAddress: any = "0x164724186C7394243a6f40D36C06aECeF633F9AF";

/* Create Collection */
export const createCollection = async (
  nftType: number,
  name: string,
  symbol: string,
  uri: string
) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      collectionAddress,
      collectionABI,
      signer
    );

    /**
     * Create Collection
     *
     * @param nftType_ - 0: ERC721, 1: ERC1155
     * @param name_ - ex: "First My Collection"
     * @param symbol_ - ex: "FMC"
     * @param uri_ - ex: "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/"
     *
     * returns null
     */

    const transaction = await contract.createCollection(
      nftType,
      name,
      symbol,
      uri
    );
    const tx = await transaction.wait();

    return {
      transaction,
      tx,
    };
  } catch (err: any) {
    console.log(err);

    throw new Error('error');
  }
};
