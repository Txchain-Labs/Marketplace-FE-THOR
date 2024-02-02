import { useDispatch, useSelector } from '@/redux/store';
import { useChain } from '@/utils/web3Utils';
import { Box, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CardDynamicJsx from './CardDynamicJsx';
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
  getTypeActiveStatus,
  useIconButtonStyles,
} from './Helper';
import {
  addItemToBag,
  removeItemFromBag,
  selectBagListedIds,
  selectBagState,
  selectBagUnListedIds,
  selectBagUnListedItems,
  setBagState,
} from '@/redux/slices/managerBagSlice';
import Dropdown from '@/components/common/Dropdown';
import Image from 'next/image';
interface ThumbnailCard {
  pageType: string;
  nodeType: string;
  tier: string;
  data: any;
  handleFavorites: (data: any) => void;
  handleEditPrice: (data: any) => void;
  handleEditName?: (data: any) => void;
  handleClaimVoucher?: (data: any) => void;
}
const ThumbnailCard = ({
  pageType,
  nodeType,
  tier,
  data,
  handleFavorites,
  handleEditPrice,
  handleEditName,
  handleClaimVoucher,
}: ThumbnailCard) => {
  const smBreakPoint = useMediaQuery('(max-width:600px)');
  const xsBreakPoint = useMediaQuery('(max-width:450px)');
  const xxsBreakPoint = useMediaQuery('(max-width:380px)');
  const mdBreakPoint = useMediaQuery('max-width:900px');
  const chain = useChain();
  const bagListedIds = useSelector(selectBagListedIds);
  const bagUnListedIds = useSelector(selectBagUnListedIds);
  const bagUnListedItems = useSelector(selectBagUnListedItems);
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
      (bagState === 1 && !data?.isListed) ||
      // (bagState === 2 && data?.isListed)
      // (bagState === 1 && !bagListedIds.includes(data.id)) ||
      (bagState === 2 && data?.isListed) ||
      getTypeActiveStatus(data, bagState, bagUnListedItems)
    ) {
      return false;
    } else {
      return true;
    }
  }, [bagState, data, bagUnListedItems]);
  const dropDownData = [
    ...(data?.pageType !== 'node' ||
    (data?.pageType === 'node' && data?.nodeType !== 'DRIFT') ||
    (data?.pageType === 'node' &&
      data?.nodeType === 'DRIFT' &&
      data?.condition !== 'active')
      ? [
          {
            title: 'View Details',
            icon: <Toc sx={menuItemIcon} />,
            action: () => router.push(`/nft/${address}/${data?.tokenId}`),
          },
        ]
      : []),
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
            action: () => window.open('https://app.thorfi.io/nodes', '_blank'),
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
  const handleRedirect = () => {
    if (
      data?.pageType !== 'node' ||
      (data?.pageType === 'node' && data?.nodeType !== 'DRIFT') ||
      (data?.pageType === 'node' &&
        data?.nodeType === 'DRIFT' &&
        data?.condition !== 'active')
    ) {
      router.push(`/nft/${address}/${data?.tokenId}`);
    }
  };
  const handleFavoriteClick = (event: any) => {
    event.stopPropagation();
    handleFavorites(data);
  };

  const classes = useIconButtonStyles();

  return (
    <Box
      sx={{
        'position': 'relative',
        'width': xxsBreakPoint
          ? '300px'
          : xsBreakPoint
          ? '170px'
          : smBreakPoint
          ? '200px'
          : mdBreakPoint
          ? '210px'
          : '210px',
        'outline': isCarted ? '5px solid #F3523F' : '0px',
        'aspectRatio': '1/1',
        'padding': '0.6em',
        '& .actionButtons': {
          // visibility: enable ? 'unset' : 'hidden',
          visibility: isCarted ? 'unset' : 'hidden',
        },
        '&::before': {
          content: '""',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          position: 'absolute',
          top: '0px',
          right: '0px',
          left: '0px',
          bottom: '0px',
          // opacity: enable && !isCarted ? 0.7 : enable && isCarted ? 0.7 : 0.3,
          opacity: !enable
            ? 0.3
            : pageType === 'node' && nodeType === 'DRIFT'
            ? 1
            : 0.7,
          // pageType === 'node'
          //   ? 1
          //   : enable && !isCarted
          //   ? 0.7
          //   : enable && isCarted
          //   ? 0.7
          //   : 0.3,
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
        onClick={handleRedirect}
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
          <IconButton
            classes={{ root: classes.root }}
            onClick={(event) => handleFavoriteClick(event)}
          >
            {data?.isFavorite ? (
              <FavoriteIcon color="primary" />
            ) : (
              <FavoriteBorderIcon color="primary" />
            )}
          </IconButton>
          {(data?.pageType !== 'node' ||
            (data?.pageType === 'node' && data?.nodeType !== 'DRIFT') ||
            (data?.pageType === 'node' &&
              data?.nodeType === 'DRIFT' &&
              data?.condition !== 'active')) &&
            isCarted && (
              <Tooltip
                disableFocusListener
                title="Remove from Bag"
                placement="bottom-start"
              >
                <IconButton
                  onClick={(event) => handleRemoveFromCart(event)}
                  classes={{ root: classes.root }}
                >
                  <Image
                    alt="remove-from-bag"
                    src="/images/remove-from-list.svg"
                    height={26}
                    width={26}
                  />
                </IconButton>
              </Tooltip>
            )}
          {(data?.pageType !== 'node' ||
            (data?.pageType === 'node' && data?.nodeType !== 'DRIFT') ||
            (data?.pageType === 'node' &&
              data?.nodeType === 'DRIFT' &&
              data?.condition !== 'active')) &&
            !isCarted && (
              <Tooltip
                disableFocusListener
                title="Add to Bag"
                placement="bottom-start"
              >
                <IconButton
                  onClick={(event) => handleAddToCart(event)}
                  classes={{ root: classes.root }}
                >
                  <Image
                    alt="add-to-bag"
                    src="/images/add-to-list.svg"
                    height={26}
                    width={26}
                  />
                </IconButton>
              </Tooltip>
            )}
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

export default ThumbnailCard;
