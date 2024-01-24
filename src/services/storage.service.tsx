import { NFTStorage } from 'nft.storage';
import { create } from 'ipfs-http-client';
// import mime from 'mime';

// const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http' });

const auth =
  'Basic ' +
  Buffer.from(
    process.env.NEXT_PUBLIC_REACT_APP_IPFS_PROJECT_ID +
      ':' +
      process.env.NEXT_PUBLIC_REACT_APP_IPFS_PROJECT_SECRET
  ).toString('base64');

const client: any = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  apiPath: '/api/v0',
  headers: {
    authorization: auth,
  },
});

const NFT_STORAGE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhlNjU0Q0MyYTc0Nzg2MEFDYTc0NTA1Mjk0Yjc3RUY3MjVCN2EzNEEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MzcwMTQ5NTE0MCwibmFtZSI6InRob3IifQ.aRKBXxcdGLhxSssJlOg8hduFX6-zlDimDbjAz35tqOA';

export class StorageService {
  static async storeNFT(
    image: File,
    name: string,
    description: string,
    attributes: any[]
  ) {
    try {
      //   const image = await this.fileFromPath(imagePath);
      const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
      return nftstorage.store({
        image,
        name,
        description,
        attributes,
      });
    } catch (error) {
      console.log('Service Error:', error);
    }
    return null;
  }

  static async storeCollection(image: File, name: string, description: string) {
    try {
      const result = await client.add(image);
      const data = {
        image: `https://thor.infura-ipfs.io/ipfs/${result.path}`,
        name,
        description,
      };
      console.log(result);

      const res = await client.add(JSON.stringify(data));
      return `https://thor.infura-ipfs.io/ipfs/${res.path}`;
      // const storage = new NFTStorage({ token: NFT_STORAGE_KEY });
      // return storage.store({
      //     image,
      //     name,
      //     description,
      //     attributes
      // });
    } catch (error) {
      console.log('Service Error:', error);
    }

    return '';
  }

  static async uploadFile(image: File) {
    try {
      const res = await client.add(image);
      return res;
    } catch (error) {
      console.log('Service Error:', error);
    }
  }

  //   static async fileFromPath(filePath: string) {
  //     const content = await fs.promises.readFile(filePath);
  //     const type = mime.getType(filePath);
  //     return new File([content], path.basename(filePath), { type });
  //   }
}
