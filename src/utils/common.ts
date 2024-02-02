import { Chain } from 'wagmi';
import {
  Currencies,
  getCapsuleContractByChain,
  getDriftNodeContractByChain,
  getKeycardContractByChain,
  getOGNodeContractByChain,
  getPerkContractByChain,
} from './constants';
import numeral from 'numeral';
import { Currency } from '@/components/common/CurrencySelect/CurrencySelect';
import { useEffect, useState } from 'react';
import { BigNumberish, ethers } from 'ethers';
import _ from 'lodash';

export const formattedTime = (timestamp: string | number): string => {
  const diffInSec =
    Math.ceil(Number((new Date() as any) / 1000)) - Number(timestamp);

  if (Number.isNaN(diffInSec)) {
    return '';
  }

  if (diffInSec <= 0) {
    return '0 seconds ago';
  }
  if (diffInSec < 60) {
    return `${diffInSec} seconds ago`;
  }
  if (diffInSec < 3600) {
    return `${Math.ceil(diffInSec / 60)} minutes ago`;
  }
  if (diffInSec < 3600 * 24) {
    // 24 hours
    return `${Math.ceil(diffInSec / 3600)} hours ago`;
  }
  if (diffInSec < 3600 * 24 * 30) {
    // days hours
    return `${Math.ceil(diffInSec / (3600 * 24))} days ago`;
  }
  if (diffInSec > 3600 * 24 * 30) {
    return `${Math.ceil(diffInSec / (3600 * 24 * 30))} months ago`;
  }

  return `${Math.ceil(diffInSec)} seconds ago`;
};

// const encodeBase64 = (data: string) => {
//   return Buffer.from(data).toString('base64');
// };

const decodeBase64 = (data: string) => {
  return Buffer.from(data, 'base64').toString('ascii');
};

export const getJsonFromURI = (val: string) => {
  try {
    const encodedSplit = val.split(',');
    return JSON.parse(decodeBase64(encodedSplit[1] ?? ''));
  } catch (e) {
    return {};
  }
};

export const getIpfsPublicUrl = (imgUrl: string): string => {
  let img = imgUrl;
  if (imgUrl?.includes('ipfs://')) {
    img = img.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  return img;
};

export const isNode = (contractAddress: string, chain: Chain): boolean => {
  const OGNodesContracts = getOGNodeContractByChain(chain);
  const DriftNodesContracts = getDriftNodeContractByChain(chain);
  const KeycardContracts = getKeycardContractByChain(chain);
  const CapsuleContracts = getCapsuleContractByChain(chain);
  const PerkContracts = getPerkContractByChain(chain);

  const isOG = Object.values(OGNodesContracts).includes(
    contractAddress.toLowerCase()
  );
  const isDrift = Object.values(DriftNodesContracts).includes(
    contractAddress.toLowerCase()
  );
  const isKeycard = Object.values(KeycardContracts).includes(
    contractAddress.toLowerCase()
  );
  const isCapsule = Object.values(CapsuleContracts).includes(
    contractAddress.toLowerCase()
  );
  const isPerk = Object.values(PerkContracts).includes(
    contractAddress.toLowerCase()
  );
  return isOG || isDrift || isKeycard || isCapsule || isPerk;
};

export const useIsPerk = (contractAddress: string, chain: Chain): boolean => {
  const PerkContracts = getPerkContractByChain(chain);
  return Object.values(PerkContracts).includes(contractAddress.toLowerCase());
};

export const containsOnlyNumbers = (str: string) => {
  return /^\d+$/.test(str);
};

export const numberExponentToLarge = (numIn: string) => {
  return Number(numIn).toLocaleString('fullwide', {
    useGrouping: false,
    maximumFractionDigits: 18,
  });
};

export const formatNumber = (
  number: string | number,
  precision = 3
): string => {
  return numeral(number)
    .format(`0.${String().padStart(precision, '0')}a`)
    .toUpperCase();
};

export const formatMultiplier = (
  number: string | number,
  precision = 3
): string => {
  return numeral(number)
    .divide(10)
    .format(`0.${String().padStart(precision, '0')}a`)
    .toUpperCase();
};

export const getMetaData = (item: any) => {
  const metadata = item?.metadata
    ? typeof item?.metadata === 'string' || item?.metadata instanceof String
      ? JSON.parse(item?.metadata)
      : item?.metadata
    : null;
  if (metadata) {
    const img = metadata?.image;
    if (/(http(s?)):\/\//i.test(img)) {
      return img;
    }

    if (!img) {
      return '/images/nft-placeholder.png';
    }

    const array = img.split('ipfs://');
    return 'https://ipfs.io/ipfs/' + array[1];
  }
  return '/images/nft-placeholder.png';
};

export function getMetaDataName(item: any) {
  const metadata = item?.metadata
    ? typeof item?.metadata === 'string' || item?.metadata instanceof String
      ? JSON.parse(item?.metadata)
      : item?.metadata
    : null;
  if (metadata) {
    return metadata?.name;
  }
  return metadata;
}

export function getMetaDataDescription(item: any) {
  const metadata = item?.metadata
    ? typeof item?.metadata === 'string' || item?.metadata instanceof String
      ? JSON.parse(item?.metadata)
      : item?.metadata
    : null;
  if (metadata) {
    return metadata?.description;
  }
  return metadata;
}

export function getMetaDataAttributes(item: any) {
  const metadata = item?.metadata
    ? typeof item?.metadata === 'string' || item?.metadata instanceof String
      ? JSON.parse(item?.metadata)
      : item?.metadata
    : null;
  if (metadata) {
    return metadata?.attributes;
  }
  return metadata;
}

export function getValidCurrency(
  isNode: boolean,
  acceptPayments?: any[]
): Array<Currency> {
  const defaultCurrency: string[] = [];
  if (_.isEqual(acceptPayments, ['0', '0', '0'])) {
    defaultCurrency.push('AVAX');
    defaultCurrency.push('THOR');
  } else if (acceptPayments) {
    acceptPayments.map((payment, index) => {
      if (payment !== '0' && index === 0) defaultCurrency.push('AVAX');
      if (payment !== '0' && index === 1) defaultCurrency.push('THOR');
      if (payment !== '0' && index === 2) defaultCurrency.push('USDC.e');
    });
  } else if (isNode !== null) {
    defaultCurrency.push('AVAX');
    defaultCurrency.push('THOR');
    defaultCurrency.push('USDC.e');
  }
  return Currencies.filter((item) => defaultCurrency.includes(item.text));
}

// export function useFontLoading(fonts: any) {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const delay = 2000; // Delay in milliseconds
//     const promises = fonts.map((font: any) =>
//       document.fonts.load(`16px "${font}"`)
//     );

//     Promise.all(promises)
//       .then(() => {
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.log(err);
//         setLoading(false);
//       }, delay);

//     return () => clearTimeout(timeout); // Cleanup the timeout on component unmount
//   }, [fonts]);

//   return loading;
// }
export function useFontLoading(fonts: any) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delay = 2000; // Delay in milliseconds

    const timeout = setTimeout(() => {
      const promises = fonts.map((font: any) =>
        document.fonts.load(`16px "${font}"`)
      );

      Promise.all(promises)
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }, delay);

    return () => clearTimeout(timeout); // Cleanup the timeout on component unmount
  }, [fonts]);

  return loading;
}

export const convertPriceFromUSD = (
  valueInUSD: number,
  avaxPrice: BigNumberish,
  thorPrice: BigNumberish,
  defaultCurrency?: string
) => {
  if (!defaultCurrency || defaultCurrency.startsWith('USD')) {
    return valueInUSD;
  }

  if (defaultCurrency === 'AVAX') {
    return (
      valueInUSD / Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
    );
  }

  if (defaultCurrency === 'THOR') {
    return (
      valueInUSD / Number(ethers.utils.formatEther(thorPrice as BigNumberish))
    );
  }

  return valueInUSD;
};

export const diffInSeconds = (timestamp: string | number) => {
  const diffInSec =
    Math.ceil(Number((new Date() as any) / 1000)) - Number(timestamp);

  if (Number.isNaN(diffInSec)) {
    return 0;
  }
  return diffInSec;
};
