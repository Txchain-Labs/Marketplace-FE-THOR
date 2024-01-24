import { Chain } from 'wagmi';
import { Currencies, getNodesContractByChain } from './constants';
import numeral from 'numeral';
import { CurrencyType } from './types';

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
  if (imgUrl.includes('ipfs://')) {
    img = img.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  return img;
};

export const isNode = (contractAddress: string, chain: Chain): boolean => {
  return getNodesContractByChain(chain).includes(contractAddress.toLowerCase());
};

export const containsOnlyNumbers = (str: string) => {
  return /^\d+$/.test(str);
};

export const numberExponentToLarge = (numIn: string) => {
  numIn += ''; // To cater to numric entries
  let sign = ''; // To remember the number sign
  numIn.charAt(0) === '-' && ((numIn = numIn.substring(1)), (sign = '-')); // remove - sign & remember it
  let str = numIn.split(/[eE]/g); // Split numberic string at e or E
  if (str.length < 2) return sign + numIn; // Not an Exponent Number? Exit with orginal Num back
  const power = Number(str[1]); // Get Exponent (Power) (could be + or -)

  const deciSp = (1.1).toLocaleString().substring(1, 2); // Get Deciaml Separator
  str = str[0].split(deciSp); // Split the Base Number into LH and RH at the decimal point
  let baseRH = str[1] || '', // RH Base part. Make sure we have a RH fraction else ""
    baseLH = str[0]; // LH base part.

  if (power >= 0) {
    // ------- Positive Exponents (Process the RH Base Part)
    if (power > baseRH.length) baseRH += '0'.repeat(power - baseRH.length); // Pad with "0" at RH
    baseRH = baseRH.slice(0, power) + deciSp + baseRH.slice(power); // Insert decSep at the correct place into RH base
    if (baseRH.charAt(baseRH.length - 1) === deciSp)
      baseRH = baseRH.slice(0, -1); // If decSep at RH end? => remove it
  } else {
    // ------- Negative exponents (Process the LH Base Part)
    const num = Math.abs(power) - baseLH.length; // Delta necessary 0's
    if (num > 0) baseLH = '0'.repeat(num) + baseLH; // Pad with "0" at LH
    baseLH = baseLH.slice(0, power) + deciSp + baseLH.slice(power); // Insert "." at the correct place into LH base
    if (baseLH.charAt(0) === deciSp) baseLH = '0' + baseLH; // If decSep at LH most? => add "0"
  }
  // Rremove leading and trailing 0's and Return the long number (with sign)
  return sign + (baseLH + baseRH).replace(/^0*(\d+|\d+\.\d+?)\.?0*$/, '$1');
};

export const formatNumber = (
  number: string | number,
  precision = 3
): string => {
  return numeral(number)
    .format(`0.${String().padStart(precision, '0')}a`)
    .toUpperCase();
};

export const getMetaData = (item: any) => {
  let metadata = item?.metadata ? JSON.parse(item?.metadata) : null;
  if (item instanceof Object && item?.image) {
    metadata = item;
  }

  if (metadata) {
    const img = metadata?.image;
    if (/(http(s?)):\/\//i.test(img)) {
      return img;
    }
    const array = img.split('ipfs://');
    return 'https://ipfs.io/ipfs/' + array[1];
  }
  return '/images/nft-placeholder.png';
};

export function getMetaDataName(item: any) {
  if (item instanceof Object && item?.name) {
    return item.name;
  }
  const metadata = item?.metadata ? JSON.parse(item?.metadata) : null;
  if (metadata) {
    return metadata?.name;
  }
  return metadata;
}

export function getMetaDataDescription(item: any) {
  if (item instanceof Object && item?.description) {
    return item.description;
  }
  const metadata = item?.metadata ? JSON.parse(item?.metadata) : null;
  if (metadata) {
    return metadata?.description;
  }
  return metadata;
}

export function getMetaDataAttributes(item: any) {
  if (item instanceof Object && item?.attributes) {
    return item.attributes;
  }
  const metadata = item?.metadata ? JSON.parse(item?.metadata) : null;
  if (metadata) {
    return metadata?.attributes;
  }
  return metadata;
}

export function getValidCurrency(isNode: boolean): Array<CurrencyType> {
  const defaultCurremcy = ['AVAX'];
  if (isNode) {
    defaultCurremcy.push('THOR');
  }
  return Currencies.filter((item: any) => defaultCurremcy.includes(item.label));
}
