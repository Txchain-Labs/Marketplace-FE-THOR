import * as React from 'react';
import {
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Badge,
  ThemeProvider,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';
///// import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
///// import FilteringOptions from './FilteringOptions';
import ActivityFilterModal from './ActivityFilterModal';
import ActivityElement from './ActivityElement';

import { BigNumberish } from 'ethers';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { useGetActivities } from '../../../../hooks/useActivities';

import {
  useGetUsdFromAvax,
  useGetUsdFromThor,
} from '../../../../hooks/useOracle';

import {
  funcGetFloorPriceAvax,
  fetchUserByAddress,
} from '../../../../hooks/useNFTDetail';
import {
  ///// funcGetListingPriceByTokenId,
  funcGetBidPriceByTokenId,
  funcGetBidsByTokenId,
} from '../../../../hooks/useListings';
import { dottedAddress } from '../../../../shared/utils/utils';
import { useChain } from '../../../../utils/web3Utils';
import { formatNumber } from '../../../../utils/common';

import { useDispatch } from '../../../../redux/store';

import { SortMenu, CommonLoader, SearchField } from '@/components/common';
import { SortOption, SortDirection } from '@/components/common/SortMenu';
import { LastActivityPeriod } from '@/components/common/LastActivitySelect';
import { selectSort, setSort } from '@/redux/slices/nftsSlice';
import { ConnectWalletPage } from '@/components/common/ConnectWalletPage';

import { initializeApp } from '@firebase/app';
import {
  collection,
  query,
  where,
  getFirestore,
  getDocs,
  updateDoc,
} from '@firebase/firestore';

import { FirebaseConfig } from '../../../../../src/utils/constants';

import { isMobile } from 'react-device-detect';
import EmptyState from '@/components/common/EmptyState';

import { menu, menuItem } from '../../../../styles/profile';
import { formatPriceByDefaultCurrency } from '@/utils/helper';
import { useSearchFieldTheme } from '@/themes';
// import { useRouter } from 'next/router';

const firebaseApp = initializeApp(FirebaseConfig);
const dbFirestore = getFirestore(firebaseApp);

const listContainer = {
  width: '100%',
  overflowX: 'auto',
  alignItems: 'center',
  padding: !isMobile ? '20px' : '20px',
};
const initialLocalStorageData = [
  {
    key: 'initialized',
    value: 'yes',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_2',
    value:
      '{"name":"Test123344","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x03ed65272eb935f3937e1275deaa63bc3ecd1c27_17',
    value:
      '{"name":"GIGA Bone #17","image":"https://giga-bones.herokuapp.com/images/17.jpg"}',
  },
  {
    key: '0x8328e0eddb12207fab3467f1ead820ea9e92eb7c',
    value: '0x8328e...eb7c',
  },
  {
    key: '0x4e7affea4741a1421f83754ef355baf2cde4099b',
    value: 'unnamed',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_18282',
    value:
      '{"name":"Shashank 7","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '0x4f27662a79c357b1126e52b1a6d0d6afb3af40b8',
    value: 'Baldur',
  },
  {
    key: '43114_0x03ed65272eb935f3937e1275deaa63bc3ecd1c27_19',
    value:
      '{"name":"GIGA Bone #19","image":"https://giga-bones.herokuapp.com/images/19.jpg"}',
  },
  {
    key: '0x48b3c676bbb3b211e08a01ddbd0b1b1afec6b663',
    value: '0x48b3c...b663',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_43584',
    value:
      '{"name":"TeslaThor","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x03ed65272eb935f3937e1275deaa63bc3ecd1c27_28',
    value:
      '{"name":"GIGA Bone #28","image":"https://giga-bones.herokuapp.com/images/28.jpg"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_27494',
    value:
      '{"name":"Thor 100","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '0x82b7a9ea06e757ec7c8cddecbad6071e6894e4cd',
    value: '0x82b7a...e4cd',
  },
  {
    key: '43114_0x7325e3564b89968d102b3261189ea44c0f5f1a8e_5391',
    value:
      '{"name":"odinmn0","image":"ipfs://QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH"}',
  },
  {
    key: '0x7cf4f422732e1c9f2aff674ad31589d3016a74f5',
    value: '0x7cf4f...74f5',
  },
  {
    key: '0xf4421b2d854fd9fe9527ac7c664f5429bc23ecb9',
    value: 'unnamed',
  },
  {
    key: '0x86a6820f8435a7a7223d72c8dc65553a949e6a20',
    value: '0x86a68...6a20',
  },
  {
    key: '0x0f20a0eee0bcc5104645e6040d4eae7fe3c50497',
    value: 'unnamed',
  },
  {
    key: '43114_0x0e7d5d6061d76aaa7b04e9bf4624f417896a7fa7_218',
    value:
      '{"name":"Meleon Potion #7","image":"ipfs://QmdTY32RNXReGvY5m65H5HJLv7yWXh1ytaK4WHzH4zKzYs/7.gif"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_17210',
    value:
      '{"name":"Shashank ","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x03ed65272eb935f3937e1275deaa63bc3ecd1c27_15',
    value:
      '{"name":"GIGA Bone #15","image":"https://giga-bones.herokuapp.com/images/15.jpg"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_152734',
    value:
      '{"name":"t18","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_147453',
    value:
      '{"name":"Nodey McNodeface","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_92935',
    value:
      '{"name":"T-4","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x7325e3564b89968d102b3261189ea44c0f5f1a8e_5389',
    value:
      '{"name":"odin","image":"ipfs://QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_18293',
    value:
      '{"name":"Shashank 180","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_1492',
    value:
      '{"name":"Thor 1","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x8fc82cbdd4babfa5b7d63044f1c253696451faef_97',
    value:
      '{"name":"Werkers Union","image":"ipfs://bafybeign2cq4fp33kkc6bnkqchfbwxxkeypg5httbi2i6bfv3tp7bftcsy/werkers_union.png"}',
  },
  {
    key: '0x6c00270acc349bc5d15a945d2ec75bfadc54f23f',
    value: '0x6c002...f23f',
  },
  {
    key: '0x157a8c9e65ee0d4d5fedd7e01d9132853c0351da',
    value: 'unnamed',
  },
  {
    key: '43114_0x03ed65272eb935f3937e1275deaa63bc3ecd1c27_187',
    value:
      '{"name":"GIGA Bone #187","image":"https://giga-bones.herokuapp.com/images/187.jpg"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_92909',
    value:
      '{"name":"Whatisyourfear7077","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x03ed65272eb935f3937e1275deaa63bc3ecd1c27_32',
    value:
      '{"name":"GIGA Bone #32","image":"https://giga-bones.herokuapp.com/images/32.jpg"}',
  },
  {
    key: '43114_0x03ed65272eb935f3937e1275deaa63bc3ecd1c27_92',
    value:
      '{"name":"GIGA Bone #92","image":"https://giga-bones.herokuapp.com/images/92.jpg"}',
  },
  {
    key: '43114_0x2cd4dbcbfc005f8096c22579585fb91097d8d259_61',
    value:
      '{"image":"ipfs://bafybeig6uq2sbiim65ve3bnmfeov7szagyzdrbqf34zf3ooowm4stqwqb4/623.png"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_52',
    value:
      '{"name":"Solveig","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x03ed65272eb935f3937e1275deaa63bc3ecd1c27_24',
    value:
      '{"name":"Squid Bone #24","image":"https://giga-bones.herokuapp.com/images/24.jpg"}',
  },
  {
    key: '43114_0x7325e3564b89968d102b3261189ea44c0f5f1a8e_120108',
    value:
      '{"name":"ODIN15","image":"ipfs://QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH"}',
  },
  {
    key: '0x210cb9bb9b68bf1b95a2e597f6e9b998dd262a2f',
    value: 'unnamed',
  },
  {
    key: '0x3a456d112649db6b8315cd8002ac5f6f3a65f974',
    value: '0x3a456...f974',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_22073',
    value:
      '{"name":"O20","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_27492',
    value:
      '{"name":"Thor 8","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_92934',
    value:
      '{"name":"T-3","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_92908',
    value:
      '{"name":"Thortbestnodeever","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '0x6df71c925e83e3d7c919cc911c110b6ad2f5c020',
    value: "'Dev'",
  },
  {
    key: '0x4f4a8dc39faf0866149bbd40fb7c605a33a433fa',
    value: '0x4f4a8...33fa',
  },
  {
    key: '0x140e822d67efe4430789ba6e21e948d6de5054bf',
    value: 'TestWallet2334',
  },
  {
    key: '0x989923d33be0612680064dc7223a9f292c89a538',
    value: '0x98992...a538',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_34366',
    value:
      '{"name":"thor1","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x7325e3564b89968d102b3261189ea44c0f5f1a8e_13606',
    value:
      '{"name":"law-clan-15","image":"ipfs://QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH"}',
  },
  {
    key: '0x4e06fdd6c1577d9d6ded39edaeca830856b0015c',
    value: '0x4e06f...015c',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_66',
    value:
      '{"name":"ThorConverted16724582551","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '0xbcf515e74bc787ba52637fc1337ab28887180a03',
    value: '0xbcf51...0a03',
  },
  {
    key: '43114_0x7325e3564b89968d102b3261189ea44c0f5f1a8e_1993',
    value:
      '{"name":"Pluto0","image":"ipfs://QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_92933',
    value:
      '{"name":"T-2","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x7325e3564b89968d102b3261189ea44c0f5f1a8e_98',
    value:
      '{"name":"Odin15932","image":"ipfs://QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH"}',
  },
  {
    key: '0x1c466b8b5190db1ddc0807ba3adec3b48476a348',
    value: 'illousion',
  },
  {
    key: '43114_0x7325e3564b89968d102b3261189ea44c0f5f1a8e_86851',
    value:
      '{"name":"ODIN - 30","image":"ipfs://QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH"}',
  },
  {
    key: '43114_0x03ed65272eb935f3937e1275deaa63bc3ecd1c27_4',
    value:
      '{"name":"GIGA Bone #4","image":"https://giga-bones.herokuapp.com/images/4.jpg"}',
  },
  {
    key: '0x7a8e2cbb1832bd88bb1519b19f6ac14dc7e79ea6',
    value: '0x7a8e2...9ea6',
  },
  {
    key: '0x71c57997c06ef8ce2692ef66724701b518536e00',
    value: 'ThorFi Buybacks',
  },
  {
    key: '0xe10063d7b2407880ef81a02a238a9674cd8017cd',
    value: '0xe1006...17cd',
  },
  {
    key: '0x5bb6ed64834abfba4ad10aae6e2abfc6089e92d8',
    value: 'unnamed',
  },
  {
    key: '43114_0x7325e3564b89968d102b3261189ea44c0f5f1a8e_220',
    value:
      '{"name":"Crux","image":"ipfs://QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH"}',
  },
  {
    key: '43114_0x544995dc5a744cafc646517f5ae813c61f023873_1',
    value:
      '{"name":"ChunkMunkz #1","image":"ipfs://bafybeidwm2jm6bdpjjgxftjieba74wswfgmhww7a4yhg4rfeeoojp33kja/1.png"}',
  },
  {
    key: '0x90a50ff52ebeadcda73b4bd953bbcbc267712b24',
    value: '0x90a50...2b24',
  },
  {
    key: '0xf5ffb26afbdb4a16f0812908c7863677174de5fe',
    value: '0xf5ffb...e5fe',
  },
  {
    key: '43114_0x03ed65272eb935f3937e1275deaa63bc3ecd1c27_38',
    value:
      '{"name":"GIGA Bone #38","image":"https://giga-bones.herokuapp.com/images/38.jpg"}',
  },
  {
    key: '0xd58891152e0f481db854722a564d0aa9a7f22ba4',
    value: '0xd5889...2ba4',
  },
  {
    key: '0x90572c6d772be8327feaaef3f26733c84f8b9fcb',
    value: 'unnamed',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_22078',
    value:
      '{"name":"Ornella 80","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '0x4b3533ce366c4ae63c75db207f28a391d8b3e39a',
    value: '0x4b353...e39a',
  },
  {
    key: '0xd00ca4dea8adac3925e7695efd7015aafea898c8',
    value: 'unnamed',
  },
  {
    key: '43114_0x7325e3564b89968d102b3261189ea44c0f5f1a8e_54123',
    value:
      '{"name":"odin 21","image":"ipfs://QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH"}',
  },
  {
    key: '43114_0x7325e3564b89968d102b3261189ea44c0f5f1a8e_346154',
    value:
      '{"name":"ODIN 5","image":"ipfs://QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH"}',
  },
  {
    key: '0x38d707a2c901857839c399a237d9488befe78ba2',
    value: 'User_Tester119',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_22067',
    value:
      '{"name":"T14","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x7325e3564b89968d102b3261189ea44c0f5f1a8e_265447',
    value:
      '{"name":"ODINTHEGOD","image":"ipfs://QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_67',
    value:
      '{"name":"ThorConverted16724582552","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_19167',
    value:
      '{"name":"Thor2","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '0xf3d8fcebbf08587fa904692ecb9a5c9e5b430c00',
    value: 'unnamed',
  },
  {
    key: '0xecfaffaf3ea215ef1f1b33a6a1bd1692a414e986',
    value: '0xecfaf...e986',
  },
  {
    key: '43114_0x03ed65272eb935f3937e1275deaa63bc3ecd1c27_73',
    value:
      '{"name":"GIGA Bone #73","image":"https://giga-bones.herokuapp.com/images/73.jpg"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_22068',
    value:
      '{"name":"T15","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x03ed65272eb935f3937e1275deaa63bc3ecd1c27_7',
    value:
      '{"name":"GIGA Bone #7","image":"https://giga-bones.herokuapp.com/images/7.jpg"}',
  },
  {
    key: '0xce86d63a859d5c2f9ff5bd5145330bd30ddd8f10',
    value: 'escarlata',
  },
  {
    key: '0x3d0c541da4c52354b1d53c0231ef6656fb068adb',
    value: 'Burnnnn',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_22069',
    value:
      '{"name":"T16","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_92911',
    value:
      '{"name":"rs1_80","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '0xe47a8c28a14d4fc4c2b3a8543958d58f3ac57081',
    value: '0xe47a8...7081',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_22072',
    value:
      '{"name":"T19","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x7325e3564b89968d102b3261189ea44c0f5f1a8e_5566',
    value:
      '{"name":"tjjr4e","image":"ipfs://QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH"}',
  },
  {
    key: '43114_0x7325e3564b89968d102b3261189ea44c0f5f1a8e_265448',
    value:
      '{"name":"first 50","image":"ipfs://QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH"}',
  },
  {
    key: '43114_0x7325e3564b89968d102b3261189ea44c0f5f1a8e_26836',
    value:
      '{"name":"Odin 285","image":"ipfs://QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_92910',
    value:
      '{"name":"Thorbestofall","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_4',
    value:
      '{"name":"Bethor","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_34418',
    value:
      '{"name":"FF15","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x0a27e02fdaf3456bd8843848b728ecbd882510d1_34',
    value:
      '{"name":"Pumpskin #34","image":"ipfs://Qmf8RsBVibpu56UgfNR9F9mKCNdq4wCnLsjbiYq2bGzWos/34.jpeg"}',
  },
  {
    key: '0xff39f84d61733325ad748d8e5a5187a1bf248c22',
    value: 'kinda poor.thor',
  },
  {
    key: '0x6cfbcfd2257b34810a8d4129c4744156b221370c',
    value: 'Mani',
  },
  {
    key: '0x89af3bf4ed8e39d6c5ae82ad74edf9ded34830a6',
    value: 'TD',
  },
  {
    key: '0x974ab44b53a46875e4cf0471faebf35b2f9d8561',
    value: '0x974ab...8561',
  },
  {
    key: '0x0b179526d76a6f2fb9d0f0b34e82c56c65cb3cf4',
    value: '0x0b179...3cf4',
  },
  {
    key: '43114_0x03ed65272eb935f3937e1275deaa63bc3ecd1c27_3',
    value:
      '{"name":"GIGA Bone #3","image":"https://giga-bones.herokuapp.com/images/3.jpg"}',
  },
  {
    key: '0x65dade001b104e648c134e089745534259fadcbd',
    value: '0x65dad...dcbd',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_17214',
    value:
      '{"name":"Shashank 5","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '0xbf4e0c164ae5d5822904091fd4533f501fa71fdc',
    value: 'unnamed',
  },
  {
    key: '0x101a43303e5a9b88f1f29019e07a90a9097917eb',
    value: 'Not KingKoofy',
  },
  {
    key: '0x45ec024fc98addfdb22ee2a1cfcfeca6f17c9a1c',
    value: '0x45ec0...9a1c',
  },
  {
    key: '0x3516c191f331211316050b81807532cf69100920',
    value: "''",
  },
  {
    key: '43114_0x03ed65272eb935f3937e1275deaa63bc3ecd1c27_16',
    value:
      '{"name":"GIGA Bone #16","image":"https://giga-bones.herokuapp.com/images/16.jpg"}',
  },
  {
    key: '0x10fe78cb6ee7f2e0d8cfa8f4eab2de4046d4cf89',
    value: 'unnamed',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_93261',
    value:
      '{"name":"T-25","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '0x4c2cd78b6c5ef4e1d287ed8abe6a7db82ae196ae',
    value: '0x4c2cd...96ae',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_22070',
    value:
      '{"name":"T17","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '43114_0x7325e3564b89968d102b3261189ea44c0f5f1a8e_265449',
    value:
      '{"name":"costs 100","image":"ipfs://QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH"}',
  },
  {
    key: '0xed37b63d90ada8034d32aa88c23d1100bf531220',
    value: 'unnamed',
  },
  {
    key: '43114_0x03ed65272eb935f3937e1275deaa63bc3ecd1c27_34',
    value:
      '{"name":"GIGA Bone #34","image":"https://giga-bones.herokuapp.com/images/34.jpg"}',
  },
  {
    key: '0x865108b2173fd56f81cef88928586099d71fb9ca',
    value: 'TestWallettwo',
  },
  {
    key: '0x0000000000000000000000000000000000000000',
    value: '0x00000...0000',
  },
  {
    key: '0x309cbdc2d608a5e322fadf2b00dace42554391ec',
    value: 'unnamed',
  },
  {
    key: '0xa23a7810386ba13132ac4eb2097395e2c1fbaf8b',
    value: 'unnamed',
  },
  {
    key: '0x8e55ee5f98c6064165db4e9a4f8c7c20c589eb85',
    value: 'unnamed',
  },
  {
    key: '0x7c69e76dad6e7c706de9d9e9d1ef76a524fd1a84',
    value: '0x7c69e...1a84',
  },
  {
    key: '0xbe705da7a3219a64790dff10a9b90347c7dfeef8',
    value: 'unnamed',
  },
  {
    key: '0xaf0207345f491c81e4bda7b10debd671a405aaeb',
    value: 'unnamed',
  },
  {
    key: '0x84f4ce58411152052c5d39ba5de970d2f69afca1',
    value: 'unnamed',
  },
  {
    key: '0x8147806066fb0989a102259912c71cbc4b9a1880',
    value: '0x81478...1880',
  },
  {
    key: '43114_0x07d4d391df0a13702a11eb8ba75185b85543c013_1158',
    value: '{}',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_92937',
    value:
      '{"name":"T-6","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '0x40d55140398ae664b37fe67bf48807e75060996b',
    value: 'Testing',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_18281',
    value:
      '{"name":"Shashank 6","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '0xb59dada58a839037ad54417ebba251bb545b2451',
    value: 'Mercules #2',
  },
  {
    key: '43114_0x825189515d0a7756436f0efb6e4be5a5af87e21d_45489',
    value:
      '{"name":"Teddy_Pain60","image":"ipfs://QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H"}',
  },
  {
    key: '0xf32cd9dadfee0d843ebd0a106a63fa9fec5210d4',
    value: 'unnamed',
  },
  {
    key: '0x90625ffe7a8759e218c3945fea8ac28fabbfa970',
    value: '0x90625...a970',
  },
];

const sortOptions: SortOption[] = [
  {
    label: 'Price',
    directionLabels: { desc: 'High to low', asc: 'Low to high' },
    directions: ['desc', 'asc'],
    field: 'price',
  },
  {
    label: 'Updated',
    directionLabels: {
      desc: 'Latest to Oldest',
      asc: 'Oldest to Latest',
    },
    directions: ['desc', 'asc'],
    field: 'updatedAt',
  },
  {
    label: 'NFT name',
    directionLabels: { desc: 'Descending', asc: 'Ascending' },
    directions: ['desc', 'asc'],
    field: 'title',
  },
];

///// interface ChildProps {
/////   change: any;
///// }

const funcSecsElapsed = (unixSecondFrom: number) => {
  return Date.now() / 1000 - unixSecondFrom;
};

const timeElapsed = (unixSecondFrom: number) => {
  const secsElapsed = funcSecsElapsed(unixSecondFrom);

  const minutes = Math.floor(secsElapsed / 60) % 60;
  const hours = Math.floor(secsElapsed / 3600) % 24;
  const days = Math.floor(secsElapsed / 86400);

  if (days > 0) return '' + days + ' day(s) ago';
  if (hours > 0) return '' + hours + ' hour(s) ago';
  if (minutes > 0) return '' + minutes + ' min(s) ago';

  if (days < 0) {
    if (days < -30) {
      const months = Math.floor(-days / 30);

      return ' in ' + months + ' month(s)';
    }

    return ' in ' + -days + ' day(s)';
  }
  if (hours < 0) return ' in ' + -hours + ' hour(s)';
  if (minutes < 0) return ' in ' + -minutes + ' min(s)';

  if (secsElapsed > 0) return '' + Math.round(secsElapsed) + ' second(s) ago';

  return ' in ' + Math.round(secsElapsed) + ' second(s)';
};

const expireWhen = (unixSecondFrom: number) => {
  const secsElapsed = Date.now() / 1000 - unixSecondFrom;

  if (secsElapsed > 0) return 'Expired ' + timeElapsed(unixSecondFrom);
  return 'Expiring ' + timeElapsed(unixSecondFrom);
};

const applyFilters = (
  setActivitiesData: any,
  filterOptions: any,
  unFilteredActivitiesData: any,
  searchKeyWords: string,
  sortBy: string,
  sortDirection: string
) => {
  const filteredButUnsortedArr = unFilteredActivitiesData.filter(
    (value: any) =>
      ((filterOptions.listed && value.btnText === 'Listed') ||
        (filterOptions.unlisted && value.btnText === 'UnListed') ||
        (filterOptions.listed && value.btnText === 'Edited List') ||
        (filterOptions.bidReceived && value.btnText === 'Received Bid') ||
        (filterOptions.bidReceived &&
          value.btnText === 'Received Private Bid') ||
        (filterOptions.bidSent && value.btnText === 'Sent Bid') ||
        (filterOptions.bidSent && value.btnText === 'Sent Private Bid') ||
        (filterOptions.bidReceived &&
          value.btnText === 'Removed Private Bid') ||
        (filterOptions.bidReceived && value.btnText === 'Removed Bid') ||
        (filterOptions.bidReceived &&
          value.btnText === 'Expired Private Bid') ||
        (filterOptions.bidReceived && value.btnText === 'Expired Bid') ||
        (filterOptions.transfer && value.btnText === 'Transfer') ||
        (filterOptions.bought && value.btnText === 'Bought') ||
        (filterOptions.sold && value.btnText === 'Sold')) &&
      ((filterOptions.lastActivity === LastActivityPeriod.lastActivity24hours &&
        funcSecsElapsed(value.updatedAt) <= 24 * 3600) ||
        (filterOptions.lastActivity === LastActivityPeriod.lastActivityWeek &&
          funcSecsElapsed(value.updatedAt) <= 7 * 24 * 3600) ||
        (filterOptions.lastActivity === LastActivityPeriod.lastActivity30days &&
          funcSecsElapsed(value.updatedAt) <= 30 * 24 * 3600) ||
        (filterOptions.lastActivity === LastActivityPeriod.lastActivityYear &&
          funcSecsElapsed(value.updatedAt) <= 366 * 3600)) &&
      (searchKeyWords.trim() === '' ||
        value.title.toLowerCase().includes(searchKeyWords) ||
        value.btnText.toLowerCase().includes(searchKeyWords) ||
        value.fromSpan.toLowerCase().includes(searchKeyWords) ||
        value.toSpan.toLowerCase().includes(searchKeyWords) ||
        value.value.toLowerCase().includes(searchKeyWords))
  );

  let filteredAndSortedArr = filteredButUnsortedArr;

  if (sortBy === 'price') {
    filteredAndSortedArr = filteredButUnsortedArr.sort(
      (first: any, second: any) =>
        (sortDirection === 'asc' && second.value === ' -- ') ||
        (sortDirection === 'desc' && first.value === ' -- ') ||
        (sortDirection === 'asc' && first.value > second.value) ||
        (sortDirection === 'desc' && first.value < second.value)
          ? 1
          : -1
    );
  } else if (sortBy === 'updatedAt') {
    filteredAndSortedArr = filteredButUnsortedArr.sort(
      (first: any, second: any) =>
        (sortDirection === 'asc' && first.updatedAt > second.updatedAt) ||
        (sortDirection === 'desc' && first.updatedAt < second.updatedAt)
          ? 1
          : -1
    );
  } else if (sortBy === 'title') {
    filteredAndSortedArr = filteredButUnsortedArr.sort(
      (first: any, second: any) =>
        (sortDirection === 'asc' && first.title > second.title) ||
        (sortDirection === 'desc' && first.title < second.title)
          ? 1
          : -1
    );
  }

  setActivitiesData(filteredAndSortedArr);

  // const lstrg = [];
  // for (let i = 0; i < localStorage.length; i++) {
  //   lstrg.push({
  //     key: localStorage.key(i),
  //     value: localStorage.getItem(localStorage.key(i)),
  //   });
  // }
  // console.log('--- local storage: ' + JSON.stringify(lstrg));
};

const emptyActivities: any[] = [];

///// const Activity = ({ change }: ChildProps) => {
const Activity = () => {
  const theme = useTheme();

  const searchFieldTheme = useSearchFieldTheme(theme);

  React.useEffect(() => {
    if (!localStorage.getItem('initialized')) {
      for (let i = 0; i < initialLocalStorageData.length; i++) {
        localStorage.setItem(
          initialLocalStorageData[i].key,
          initialLocalStorageData[i].value
        );
      }
    }
    console.log('localStorage initialized');
  }, []);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  // const handleClick = (event: any) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const user = useSelector((state: any) => state?.auth?.user);
  const [unFilteredActivitiesData, setUnFilteredActivitiesData] =
    React.useState([]);
  // const [filteredActivitiesData, setFilteredActivitiesData] = React.useState(
  //   []
  // );
  const [activitiesData, setActivitiesData] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [filterOptions, setFilterOptions] = React.useState({
    listed: true,
    unlisted: true,
    bidReceived: true,
    bidSent: true,
    bought: true,
    sold: true,
    transfer: true,
    lastActivity: LastActivityPeriod.lastActivity30days,

    // statusListing: true,
    // statusTransfer: true,
    // statusBid: true,
    // statusSold: true,
    // lastActivity24hours: true,
    // lastActivityWeek: true,
    // lastActivity30days: true,
    // lastActivityYear: true,
    // dateRangeFrom: new Date(2022, 0, 1),
    // dateRangeTo: new Date(),
  });
  const [filterOptionsSwitch, setFilterOptionsSwitch] = React.useState(false);

  const chain = useChain();
  // const router = useRouter();

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const formatedPrice = React.useCallback(
    (priceInWei: BigNumberish, paymentType: string) => {
      if (priceInWei) {
        return formatPriceByDefaultCurrency(
          priceInWei,
          paymentType,
          user?.default_currency,
          avaxPrice,
          thorPrice
        );
      } else {
        return 0;
      }
    },
    [avaxPrice, thorPrice, user?.default_currency]
  );

  const fetchNFTDetail = async (
    chainId: number,
    collection: string,
    tokenId: number,
    onlyLocal = false
  ) => {
    try {
      const key = `${chainId}_${collection}_${tokenId}`;
      const savedData = localStorage.getItem(key);
      if (savedData) {
        ///// console.log('-----  localstorage : ' + savedData);

        return JSON.parse(savedData);
      }

      if (onlyLocal) return {};

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/nfts/nftDetail/${chainId}/${collection}/${tokenId}`
      );

      if (res.data.code === 200)
        localStorage.setItem(key, JSON.stringify(res.data.data.metadata));

      return res.data.code === 200 ? res.data.data : {};
    } catch (error) {
      console.log(error);
    }

    return {};
  };

  const fetchMetadataByNfts = React.useCallback(
    async (nfts: [any]) => {
      try {
        ///// remove duplicates of (nftAddress, tokenId) pairs
        const nftsWithoutDuplicates = [];
        const mapNfts: any = {};
        for (let i = 0; i < nfts.length; i++) {
          const key = nfts[i].nftAddress + '-' + nfts[i].tokenId;
          if (key in mapNfts) continue;

          mapNfts[nfts[i].nftAddress + '-' + nfts[i].tokenId] = true;
          nftsWithoutDuplicates.push(nfts[i]);
        }

        ///// get metadata bulk
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/nfts/metadataByNfts`,
          {
            chainId: chain?.id,
            nfts: nftsWithoutDuplicates,
          }
        );

        if (res.data.code === 200) {
          res.data.data.map((eachMetadata: any) => {
            const key = `${chain?.id}_${eachMetadata.nftAddress}_${eachMetadata.tokenId}`;
            localStorage.setItem(
              key,
              JSON.stringify({
                name: eachMetadata.name,
                image: eachMetadata.image,
              })
            );
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    [chain?.id]
  );

  const getDisplayUserName = async (address: string) => {
    const savedData = localStorage.getItem(address);
    if (savedData) {
      ///// console.log('-----  localstorage : ' + savedData);

      return savedData;
    }

    const userInfo = await fetchUserByAddress(address);

    if (userInfo && userInfo.display_name) {
      localStorage.setItem(address, userInfo.display_name);
      return userInfo.display_name;
    }

    localStorage.setItem(address, dottedAddress(address));
    return dottedAddress(address);
  };

  const fetchActivitiesData = React.useCallback(
    async (rawActivitiesData: any) => {
      const listActivitiesData: any = [];

      ///// console.log(rawActivitiesData);

      if (rawActivitiesData) {
        const allActivitiesData = rawActivitiesData.data.data.activities;
        ///// console.log(allActivitiesData);

        const promises = [];
        // let iii = 1;

        const funcConvertActivity = async function (eachActivity: any) {
          if (
            eachActivity.status === 'LIST' ||
            eachActivity.status === 'UNLIST' ||
            eachActivity.status === 'EDIT_LISTING'
          ) {
            const floorPriceAvax = await funcGetFloorPriceAvax(
              eachActivity.nftAddress.toLowerCase(),
              chain
            );
            // const listingPrice = await funcGetListingPriceByTokenId(
            //   eachActivity.nftAddress.toLowerCase(),
            //   eachActivity.tokenId,
            //   chain
            // );

            // console.log(listingPrice.data.data.listings[0].priceInWei);

            listActivitiesData.push({
              nftAddress: eachActivity.nftAddress.toLowerCase(),
              tokenId: eachActivity.tokenId,

              title: 'untitled',
              btnText:
                eachActivity.status === 'LIST'
                  ? 'Listed'
                  : eachActivity.status === 'UNLIST'
                  ? 'UnListed'
                  : 'Edited List',
              from: 'From',
              // fromSpan:
              //   eachActivity.user.toLowerCase() == user?.address.toLowerCase()
              //     ? 'you'
              //     : dottedAddress(eachActivity.user),
              // fromSpan: dottedAddress(eachActivity.user),
              fromSpan: await getDisplayUserName(eachActivity.user),
              to: 'to',
              toSpan: await getDisplayUserName(eachActivity.to),
              fromAddr: `/profile/${eachActivity.user}`,
              toAddr: `/profile/${eachActivity.to}`,
              updatedAt: Number(eachActivity.updatedAt),
              date: timeElapsed(Number(eachActivity.updatedAt)),
              expiry: '',
              value: eachActivity.priceInWei
                ? formatNumber(
                    formatedPrice(
                      eachActivity.priceInWei,
                      eachActivity.paymentType
                    )
                  )
                : ' -- ',
              description:
                eachActivity.priceInWei &&
                floorPriceAvax.data.data.listings &&
                floorPriceAvax.data.data.listings.length > 0
                  ? '' +
                    Math.round(
                      (eachActivity.priceInWei * 100) /
                        floorPriceAvax.data.data.listings[0].priceInWei
                    ) /
                      100 +
                    'x  floor-price'
                  : '',
              link: `/nft/${eachActivity.nftAddress.toLowerCase()}/${
                eachActivity.tokenId
              }`,
              txHash: eachActivity.transactionHash,
              img: '',
            });
          } else if (eachActivity.status === 'BID') {
            const bidPrice = await funcGetBidPriceByTokenId(
              eachActivity.nftAddress.toLowerCase(),
              eachActivity.tokenId,
              chain
            );

            const isOtc = eachActivity.id.startsWith('otc_');
            ///// console.log('bidPrice: ' + JSON.stringify(bidPrice.data.data)); //bidPrice.data.data.otcbidTokens[0].bids[0].priceInWei);

            if (isOtc) {
              bidPrice.data.data.otcbidTokens &&
              bidPrice.data.data.otcbidTokens.length > 0 &&
              bidPrice.data.data.otcbidTokens[0].bids
                ? bidPrice.data.data.otcbidTokens[0].bids
                    .sort((first: any, second: any) => {
                      return (
                        Number(second.blockTimestamp) -
                        Number(first.blockTimestamp)
                      );
                    })
                    .slice(0, 1)
                    .map(async (eachBid: any) => {
                      listActivitiesData.push({
                        nftAddress: eachActivity.nftAddress.toLowerCase(),
                        tokenId: eachActivity.tokenId,

                        title: 'untitled',
                        btnText:
                          eachActivity.user.toLowerCase() ===
                          user?.address.toLowerCase()
                            ? 'Received Private Bid'
                            : 'Sent Private Bid',
                        from: 'From',
                        fromSpan: await getDisplayUserName(eachBid.bidder),
                        to: 'to',
                        toSpan: await getDisplayUserName(eachActivity.user),
                        fromAddr: `/profile/${eachBid.bidder}`,
                        toAddr: `/profile/${eachActivity.user}`,
                        updatedAt: Number(eachActivity.updatedAt),
                        date: timeElapsed(Number(eachActivity.updatedAt)),
                        expiry: expireWhen(Number(eachBid.expiresAt)),
                        value: formatNumber(
                          formatedPrice(
                            eachActivity.priceInWei,
                            eachActivity.paymentType
                          )
                        ),
                        description: '',
                        link: `/nft/${eachActivity.nftAddress.toLowerCase()}/${
                          eachActivity.tokenId
                        }`,
                        txHash: eachActivity.transactionHash,
                        img: '',
                      });

                      ///// console.log(eachBid);
                      return 0;
                    })
                : 'nothing';
            } else {
              const bids = await funcGetBidsByTokenId(
                eachActivity.nftAddress.toLowerCase(),
                eachActivity.tokenId,
                chain
              );

              bids.data.data.bids &&
                bids.data.data.bids.length > 0 &&
                listActivitiesData.push({
                  nftAddress: eachActivity.nftAddress.toLowerCase(),
                  tokenId: eachActivity.tokenId,

                  title: 'untitled',
                  btnText:
                    eachActivity.user.toLowerCase() ===
                    user?.address.toLowerCase()
                      ? 'Received Bid'
                      : 'Sent Bid',
                  from: 'From',
                  fromSpan: await getDisplayUserName(eachActivity.to),
                  to: 'to',
                  toSpan: await getDisplayUserName(eachActivity.user),
                  fromAddr: `/profile/${eachActivity.to}`,
                  toAddr: `/profile/${eachActivity.user}`,
                  updatedAt: Number(eachActivity.updatedAt),
                  date: timeElapsed(Number(eachActivity.updatedAt)),
                  expiry: expireWhen(Number(bids.data.data.bids[0].expiresAt)),
                  value: formatNumber(
                    formatedPrice(
                      bids.data.data.bids[0].priceInWei,
                      bids.data.data.bids[0].paymentType
                    )
                  ),
                  description: '',
                  link: `/nft/${eachActivity.nftAddress.toLowerCase()}/${
                    eachActivity.tokenId
                  }`,
                  txHash: eachActivity.transactionHash,
                  img: '',
                });
            }
          } else if (eachActivity.status === 'SOLD') {
            listActivitiesData.push({
              nftAddress: eachActivity.nftAddress.toLowerCase(),
              tokenId: eachActivity.tokenId,

              title: 'untitled',
              btnText:
                eachActivity.user.toLowerCase() === user?.address.toLowerCase()
                  ? 'Sold'
                  : 'Bought',
              from: 'From',
              // fromSpan:
              //   eachActivity.user.toLowerCase() == user?.address.toLowerCase()
              //     ? 'you'
              //     : dottedAddress(eachActivity.user),
              // fromSpan: dottedAddress(eachActivity.user),
              fromSpan: await getDisplayUserName(eachActivity.user),
              to: 'to',
              toSpan: await getDisplayUserName(eachActivity.to),
              fromAddr: `/profile/${eachActivity.user}`,
              toAddr: `/profile/${eachActivity.to}`,
              updatedAt: Number(eachActivity.updatedAt),
              date: timeElapsed(Number(eachActivity.updatedAt)),
              expiry: '',
              value: eachActivity.priceInWei
                ? formatNumber(
                    formatedPrice(
                      eachActivity.priceInWei,
                      eachActivity.paymentType
                    )
                  )
                : ' -- ',
              description: '',
              link: `/nft/${eachActivity.nftAddress.toLowerCase()}/${
                eachActivity.tokenId
              }`,
              txHash: eachActivity.transactionHash,
              img: '',
            });
          } else if (
            eachActivity.status === 'BID_REMOVED' ||
            eachActivity.status === 'OTCBID_REMOVED'
          ) {
            listActivitiesData.push({
              nftAddress: eachActivity.nftAddress.toLowerCase(),
              tokenId: eachActivity.tokenId,

              title: 'untitled',
              btnText:
                eachActivity.status === 'BID_REMOVED'
                  ? eachActivity.user.toLowerCase() ===
                    user?.address.toLowerCase()
                    ? 'Expired Bid'
                    : 'Removed Bid'
                  : eachActivity.user.toLowerCase() ===
                    user?.address.toLowerCase()
                  ? 'Expired Private Bid'
                  : 'Removed Private Bid',
              from: 'From',
              fromSpan: await getDisplayUserName(eachActivity.user),
              to: 'to',
              toSpan: await getDisplayUserName(eachActivity.to),
              fromAddr: `/profile/${eachActivity.user}`,
              toAddr: `/profile/${eachActivity.to}`,
              updatedAt: Number(eachActivity.updatedAt),
              date: timeElapsed(Number(eachActivity.updatedAt)),
              expiry: '',
              value: eachActivity.priceInWei
                ? formatNumber(
                    formatedPrice(
                      eachActivity.priceInWei,
                      eachActivity.paymentType
                    )
                  )
                : ' -- ',
              description: '',
              link: `/nft/${eachActivity.nftAddress.toLowerCase()}/${
                eachActivity.tokenId
              }`,
              txHash: eachActivity.transactionHash,
              img: '',
            });
          }

          // console.log('pushed ' + iii);
          // iii++;
        };

        for (let i = 0; i < allActivitiesData.length; i++) {
          const eachActivity = allActivitiesData[i];
          console.log('-------------' + JSON.stringify(eachActivity));

          promises.push(funcConvertActivity(eachActivity));
        }

        Promise.all(promises).then(() => {
          fetchMetadataByNfts(
            listActivitiesData.map((each: any) => {
              return {
                nftAddress: each.nftAddress.toLowerCase(),
                tokenId: each.tokenId,
              };
            })
          ).then(() => {
            Promise.all(
              listActivitiesData.map(async (each: any) => {
                const nftDetail = await fetchNFTDetail(
                  chain?.id,
                  each.nftAddress.toLowerCase(),
                  each.tokenId,
                  true
                );

                return {
                  ...each,
                  title:
                    nftDetail && nftDetail.name ? nftDetail.name : 'untitled',
                  img: nftDetail && nftDetail.image ? nftDetail.image : '',
                };
              })
            ).then((listActivitiesDataWithMetadata) => {
              const sortedListActivitiesData =
                listActivitiesDataWithMetadata.sort(
                  (first: any, second: any) => {
                    const timeDiff =
                      Number(second.updatedAt) - Number(first.updatedAt);
                    if (timeDiff !== 0) return timeDiff;
                    if (first.value === ' -- ') return 1;
                    if (second.value !== ' -- ') return -1;
                    return Number(second.value) - Number(first.value);
                  }
                );
              ///// console.log('---------   SORTED: ' + JSON.stringify(sortedListActivitiesData));
              setUnFilteredActivitiesData([...sortedListActivitiesData]);

              setFetching(false);
            });
          });
        });
      } // else {
      //   setFetching(false);
      // }
    },
    [chain, user?.address, formatedPrice, fetchMetadataByNfts]
  );

  const { data: _rawActivitiesData } = useGetActivities(
    user?.address ? user?.address : '',
    250
  );

  const rawActivitiesData = React.useMemo(() => {
    return user?.address
      ? _rawActivitiesData
      : {
          data: {
            data: { data: { activities: emptyActivities } },
          },
        };
  }, [user?.address, _rawActivitiesData]);

  React.useEffect(() => {
    console.log('fetch');
    fetchActivitiesData(rawActivitiesData);
  }, [rawActivitiesData, fetchActivitiesData]);

  const [searchKeyWords, setSearchKeyWords] = React.useState('');
  const [sortBy, setSortBy] = React.useState('');
  const [sortDirection, setSortDirection] = React.useState('');
  const [isFilterApplied, setIsFilterApplied] = React.useState(
    !(
      filterOptions.listed &&
      filterOptions.unlisted &&
      filterOptions.bidReceived &&
      filterOptions.bidSent &&
      filterOptions.bought &&
      filterOptions.sold &&
      filterOptions.transfer &&
      filterOptions.lastActivity === LastActivityPeriod.lastActivity30days
    )
  );
  React.useEffect(() => {
    applyFilters(
      setActivitiesData,
      filterOptions,
      unFilteredActivitiesData,
      searchKeyWords,
      sortBy,
      sortDirection
    );
    if (
      !(
        filterOptions.listed &&
        filterOptions.unlisted &&
        filterOptions.bidReceived &&
        filterOptions.bidSent &&
        filterOptions.bought &&
        filterOptions.sold &&
        filterOptions.transfer &&
        filterOptions.lastActivity === LastActivityPeriod.lastActivity30days
      )
    ) {
      setIsFilterApplied(true);
    } else {
      setIsFilterApplied(false);
    }
    console.log('filter');
  }, [
    filterOptions,
    unFilteredActivitiesData,
    searchKeyWords,
    sortBy,
    sortDirection,
  ]);

  // React.useEffect(() => {
  //   let tempActivitiesData = [];
  //   //setActivitiesData([]);

  //   const ACTIVITIES_PER_PAGE = 25;
  //   const cntChunks = Math.ceil(
  //     filteredActivitiesData.length / ACTIVITIES_PER_PAGE
  //   );

  //   const putNFTDetail =
  //   const fetchNFTDetailsForChunk = (index: number) => {
  //     if (index < cntChunks) {
  //       const chunk = filteredActivitiesData.slice(
  //         index * ACTIVITIES_PER_PAGE,
  //         filteredActivitiesData.length > index * (ACTIVITIES_PER_PAGE + 1)
  //           ? index * (ACTIVITIES_PER_PAGE + 1)
  //           : filteredActivitiesData.length
  //       );

  //       let promises = [];
  //       for (let i = 0; i < chunk.length; i++) {
  //         promises.push()
  //       }
  //     }
  //   };

  //   fetchNFTDetailsForChunk(0);
  // }, [filteredActivitiesData]);

  React.useEffect(() => {
    ///// read activities
    if (user?.address) {
      ///// console.log('user.address' + user.address);
      getDocs(
        query(
          collection(dbFirestore, 'notifications'),
          where('user', '==', user.address)
        )
      ).then((data) => {
        ///// console.log(data.docs);

        data.docs.forEach((data2) => {
          updateDoc(data2.ref, {
            read: true,
          });
        });
      });
    }
  }, [fetchActivitiesData, user?.address]);

  const sort = useSelector(selectSort);

  const onChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const searchkey = event.target.value;
    setSearchKeyWords(searchkey.toLowerCase());
  };

  const dispatch = useDispatch();

  const onSortChange = (orderBy: string, orderDirection: SortDirection) => {
    dispatch(setSort({ orderBy, orderDirection }));

    setSortBy(orderBy);
    setSortDirection(orderDirection);
  };

  return (
    <>
      <Box>
        <Typography
          sx={{
            padding: '20px',
            fontSize: isMobile ? '36px' : '48px',
            fontFamily: 'Nexa-Bold',
          }}
        >
          Activity
        </Typography>
      </Box>

      <Box
        sx={(theme) => ({
          px: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
          },
        })}
      >
        <Box
          sx={(theme) => ({
            [theme.breakpoints.down('sm')]: {
              mb: '8px',
            },
          })}
        >
          <ThemeProvider theme={searchFieldTheme}>
            <SearchField
              placeholder={'Search NFTs'}
              fullWidth
              value={searchKeyWords}
              onChange={onChange}
              onClear={() => {
                setSearchKeyWords('');
              }}
            />
          </ThemeProvider>
        </Box>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <SortMenu
            sortOptions={sortOptions}
            selectedField={sort.orderBy}
            direction={sort.orderDirection}
            onChange={onSortChange}
          />
          <IconButton
            sx={{ position: 'relative' }}
            onClick={() => {
              setFilterOptionsSwitch(true);
            }}
          >
            <Badge
              color={'primary'}
              variant={'dot'}
              invisible={
                filterOptions.listed &&
                filterOptions.unlisted &&
                filterOptions.bidReceived &&
                filterOptions.bidSent &&
                filterOptions.bought &&
                filterOptions.sold &&
                filterOptions.transfer &&
                filterOptions.lastActivity ===
                  LastActivityPeriod.lastActivity30days
              }
            >
              <FilterListIcon />
            </Badge>
          </IconButton>
        </Box>
      </Box>

      <Box sx={listContainer}>
        {user?.address ? (
          fetching ? (
            <CommonLoader
              size={undefined}
              width={'88vw'}
              height={'90vh'}
              mb={'30vh'}
              text={'Loading Activities...'}
            />
          ) : activitiesData.length > 0 ? (
            activitiesData.map((item, index) => (
              <ActivityElement item={item} key={index} />
            ))
          ) : (isFilterApplied || searchKeyWords.length) &&
            activitiesData?.length <= 0 ? (
            <Box sx={{ height: '72vh' }}>
              <EmptyState type={isFilterApplied ? 'filter' : 'search'} />
            </Box>
          ) : (
            <Box
              sx={{ width: '100%', textAlign: 'center', paddingTop: '15vh' }}
            >
              <svg
                width="49"
                height="37"
                viewBox="0 0 49 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.3683 22.5116C16.3078 22.5116 14.6322 20.8468 14.6322 18.8C14.6322 16.7532 16.3078 15.0885 18.3683 15.0885H40.755V10.7219H18.3683C13.9008 10.7219 10.2656 14.3462 10.2656 18.8C10.2656 23.2539 13.9008 26.8781 18.3683 26.8781H48.3691V22.5116H18.3683Z"
                  fill="#808080"
                />
                <path
                  d="M18.3394 0.825928C8.43008 0.825928 0.371094 8.85763 0.371094 18.7287C0.371094 28.5998 8.43008 36.6315 18.3394 36.6315H48.2993V32.265H18.3394C10.8399 32.265 4.73763 26.1928 4.73763 18.7287C4.73763 11.2647 10.8399 5.19247 18.3394 5.19247H48.2993V0.825928H18.3394Z"
                  fill="#808080"
                />
                <path
                  d="M45.7778 10.7219C44.4909 10.7219 43.4492 11.7636 43.4492 13.0505C43.4492 14.3375 44.4909 15.3791 45.7778 15.3791C47.0647 15.3791 48.1064 14.3375 48.1064 13.0505C48.1064 11.7636 47.0647 10.7219 45.7778 10.7219Z"
                  fill="#808080"
                />
              </svg>
              <Typography sx={{ marginTop: '10px' }}>
                No activity yet
              </Typography>
            </Box>
          )
        ) : (
          <ConnectWalletPage page="activity" />
        )}
      </Box>

      <ActivityFilterModal
        setFilterOptions={setFilterOptions}
        isOpen={filterOptionsSwitch}
        onClose={() => {
          setFilterOptionsSwitch(false);
        }}
      />

      <Menu
        sx={{ ...menu, marginLeft: '-25px' }}
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        elevation={0}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem
          sx={menuItem}
          // sx={{ display: { sm: 'none', miniMobile: 'block' } }}
          ///// onClick={(e) => {
          /////   change(e, 1);
          ///// }}
        >
          Profile
        </MenuItem>
      </Menu>
    </>
  );
};

export default Activity;
