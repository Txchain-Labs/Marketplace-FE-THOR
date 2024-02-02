import { useDispatch, useSelector } from '@/redux/store';
import { useChain } from '@/utils/web3Utils';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useMemo } from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CardDynamicJsx from './CardDynamicJsx';

import { isMobile } from 'react-device-detect';

import {
  AllInclusive,
  DoneAll,
  Edit,
  Launch,
  Rule,
  Toc,
} from '@mui/icons-material';
import { menuItemIcon } from '@/styles/profile';
import { useRouter } from 'next/router';
import {
  getCapsuleTokenAddress,
  getKeycardTokenAddress,
  getNodeGifs,
  getNodeTokenAddress,
  getPerkTokenAddress,
} from './Helper';
import {
  addItemToBag,
  removeItemFromBag,
  selectBagListedIds,
  selectBagState,
  selectBagUnListedIds,
  setBagState,
} from '@/redux/slices/managerBagSlice';
import Dropdown from '@/components/common/Dropdown';
import Image from 'next/image';
interface TransformNodeTile {
  pageType: string;
  nodeType: string;
  tier: string;
  data: any;
  handleFavorites: (data: any) => void;
  handleEditPrice: (data: any) => void;
  handleEditName?: (data: any) => void;
  handleClaimVoucher?: (data: any) => void;
  onClick?: () => void;
  isSelected: boolean;
}
const TransformNodeTile = ({
  pageType,
  nodeType,
  tier,
  data,
  handleFavorites,
  handleEditPrice,
  handleEditName,
  handleClaimVoucher,
  onClick,
  isSelected,
}: TransformNodeTile) => {
  const chain = useChain();
  const bagListedIds = useSelector(selectBagListedIds);
  const bagUnListedIds = useSelector(selectBagUnListedIds);
  const bagState = useSelector(selectBagState);
  const dispatch = useDispatch();

  const router = useRouter();
  const address = useMemo(() => {
    if (pageType === 'node') {
      return getNodeTokenAddress(nodeType, tier, chain?.id);
    } else if (pageType === 'keycard') {
      return getKeycardTokenAddress(chain?.id);
    } else if (pageType === 'capsule') {
      return getCapsuleTokenAddress(chain?.id);
    } else if (pageType === 'perk') {
      return getPerkTokenAddress(chain?.id);
    } else {
      return '';
    }
  }, [pageType, nodeType, tier, chain?.id]);

  const handleRemoveFromCart = (event: any) => {
    event.stopPropagation();
    dispatch(removeItemFromBag(data));
    dispatch(setBagState({ item: data }));
  };
  const handleAddToCart = (event: any) => {
    event.stopPropagation();
    dispatch(addItemToBag(data));
    dispatch(setBagState({ item: data }));
  };
  const bgImage = getNodeGifs(pageType, nodeType, tier);
  const isCarted = useMemo(() => {
    if (bagListedIds.includes(data.id) || bagUnListedIds.includes(data.id)) {
      return true;
    } else {
      return false;
    }
  }, [bagListedIds, bagUnListedIds, data?.id]);
  const enable = useMemo(() => {
    if (
      // (bagState === 1 && !data?.isListed) ||
      // (bagState === 2 && data?.isListed)
      (bagState === 1 && !bagListedIds.includes(data.id)) ||
      (bagState === 2 && data?.isListed)
    ) {
      return false;
    } else {
      return true;
    }
  }, [bagState, data?.isListed, bagListedIds, data?.id]);
  const dropDownData = [
    {
      title: 'View Details',
      icon: <Toc sx={menuItemIcon} />,
      action: () => router.push(`/nft/${address}/${data?.tokenId}`),
    },
    ...(data?.isListed
      ? [
          {
            title: 'Edit Price',
            icon: <Edit sx={menuItemIcon} />,
            action: () => handleEditPrice(data),
          },
        ]
      : []),
    ...(pageType !== 'node'
      ? [
          {
            title: 'Edit Name',
            icon: <Edit sx={menuItemIcon} />,
            action: () => handleEditName(data),
          },
        ]
      : []),
    ...(pageType === 'node' && !data?.isListed && data?.nodeType === 'ORIGIN'
      ? [
          {
            title: 'Transform on Gameloop',
            icon: <AllInclusive sx={menuItemIcon} />,
            action: () => router.push('/gameloop'),
          },
        ]
      : []),
    // drift node actions
    ...(pageType === 'node' &&
    data?.nodeType === 'DRIFT' &&
    !data?.isListed &&
    data?.condition === 'active'
      ? [
          {
            title: 'Claim on Thorfi Dapp',
            icon: <Launch sx={menuItemIcon} />,
            action: () => router.push('https://app.thorfi.io/nodes'),
          },
          {
            title: 'Deactivate on Gameloop',
            icon: <Rule sx={menuItemIcon} />,
            action: () => router.push('/gameloop'),
          },
        ]
      : []),
    ...(pageType === 'node' &&
    data?.nodeType === 'DRIFT' &&
    !data?.isSecondHand &&
    data?.condition === 'inactive'
      ? [
          {
            title: 'Activate on Gameloop',
            icon: <DoneAll sx={menuItemIcon} />,
            action: () => router.push('/gameloop'),
          },
        ]
      : []),
    ...(pageType === 'node' &&
    data?.nodeType === 'DRIFT' &&
    data?.isSecondHand &&
    data?.condition === 'inactive'
      ? [
          {
            title: 'Activate for 1 USDC.e',
            icon: <DoneAll sx={menuItemIcon} />,
            action: () => router.push('/gameloop/activate-drift-nodes'),
          },
        ]
      : []),
    // keycard actions
    ...(pageType === 'keycard' && !data?.isListed
      ? [
          {
            title: 'Merge on Gameloop',
            icon: <AllInclusive sx={menuItemIcon} />,
            action: () => router.push('/gameloop/gamification/keycards'),
          },
        ]
      : []),
    // capsule actions
    ...(pageType === 'capsule' && !data?.isListed
      ? [
          {
            title: 'Open on Gameloop',
            icon: <AllInclusive sx={menuItemIcon} />,
            action: () => router.push('/gameloop/gamification/capsules'),
          },
        ]
      : []),
    // perk actions
    ...(pageType === 'perk' && !data?.isListed && data?.tier !== 'BONUS'
      ? [
          {
            title: 'Apply on Gameloop',
            icon: <AllInclusive sx={menuItemIcon} />,
            action: () => router.push('/gameloop/gamification/perks'),
          },
        ]
      : []),
    ...(pageType === 'perk' && !data?.isListed && data?.tier === 'BONUS'
      ? [
          {
            title: 'Claim Voucher',
            icon: <AllInclusive sx={menuItemIcon} />,
            action: () => handleClaimVoucher(data),
          },
        ]
      : []),
  ];
  // const handleRedirect = () => {
  //   router.push(`/nft/${address}/${data?.tokenId}`);
  // };
  const handleFavoriteClick = (event: any) => {
    event.stopPropagation();
    handleFavorites(data);
  };
  return (
    <Box
      sx={{
        'position': 'relative',
        'width': !isMobile ? '100%' : '70%',
        'border': isSelected ? '3px solid #F3523F' : '0',
        ///// 'outline': isCarted ? '5px solid #F3523F' : '1px solid #000000',
        'aspectRatio': '1/1',
        'padding': '0.5em',
        '& .actionButtons': {
          // visibility: enable ? 'unset' : 'hidden',
          visibility: isCarted ? 'unset' : 'hidden',
        },
        '&::before': {
          content: '""',
          backgroundImage: isSelected ? 'none' : `url(${bgImage})`,
          backgroundColor: isSelected ? 'white' : 'none',
          backgroundSize: 'cover',
          position: 'absolute',
          top: '0px',
          right: '0px',
          left: '0px',
          bottom: '0px',
          opacity: enable && !isCarted ? 0.7 : enable && isCarted ? 0.7 : 0.3,
        },
        '&:hover::before': {
          // opacity: enable || isCarted ? 0 : 0.3,
        },
        '&:hover .actionButtons': {
          visibility: enable || isCarted ? 'unset' : 'hidden',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          cursor: `url("/images/cursor-pointer.svg"), auto`,
        }}
        onClick={onClick ? onClick : null}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
          className="actionButtons"
        >
          <Box onClick={(event) => event.stopPropagation()}>
            <Dropdown data={dropDownData} />
          </Box>
          <Box>
            <IconButton onClick={(event) => handleFavoriteClick(event)}>
              {data?.isFavorite ? (
                <FavoriteIcon color="primary" />
              ) : (
                <FavoriteBorderIcon color="primary" />
              )}
            </IconButton>
            <>
              {isCarted ? (
                <Tooltip
                  disableFocusListener
                  title="Remove from Bag"
                  placement="bottom-start"
                >
                  <IconButton onClick={(event) => handleRemoveFromCart(event)}>
                    <Image
                      alt="remove-from-bag"
                      src="/images/remove-from-list.svg"
                      height={26}
                      width={26}
                    />
                  </IconButton>
                </Tooltip>
              ) : (
                <>
                  <Tooltip
                    disableFocusListener
                    title="Add to Bag"
                    placement="bottom-start"
                  >
                    <IconButton onClick={(event) => handleAddToCart(event)}>
                      <Image
                        alt="add-to-bag"
                        src="/images/add-to-list.svg"
                        height={26}
                        width={26}
                      />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </>
          </Box>
        </Box>
        <CardDynamicJsx
          data={data}
          pageType={pageType}
          nodeType={nodeType}
          tier={tier}
        />
      </Box>
    </Box>
  );
};

export default TransformNodeTile;
