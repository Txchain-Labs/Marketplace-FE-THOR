import React, { FC, useMemo, useState } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TocIcon from '@mui/icons-material/Toc';
import { presetColors } from '@/themes/palette';

import {
  gamificationItemIllustrationMatchings,
  gameloopIllustrationType,
  getGamificationIllustrationPoster,
} from '../util';

import { GamificationItem, KeyCardItem, PerkItem } from '../types';

interface PerkDescription {
  value: string | number;
  unit: string;
  label: JSX.Element;
  status: 'UNCLAIMED' | 'INACTIVE';
}

interface GamificationItemProps {
  item: GamificationItem;
  isSelected: boolean;
  disabled: boolean;
  onClick: (item: GamificationItem) => void;
}

const GamificationItemCard: FC<GamificationItemProps> = ({
  item,
  isSelected,
  disabled,
  onClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const moreActionsMenuOpen = Boolean(anchorEl);

  const illustrationKey = useMemo<gameloopIllustrationType>(() => {
    if (item.type === 'keycards') {
      const keycard = item as unknown as GamificationItem<KeyCardItem>;
      return `${keycard.type}-${keycard.isOrigin ? 'ORIGIN' : 'DRIFT'}-${
        keycard.tier
      }` as gameloopIllustrationType;
    } else if (item.type === 'perks') {
      const perk = item as unknown as GamificationItem<PerkItem>;
      return `${perk.type}-${perk.isDriftPerk ? 'drift' : 'origin'}-${
        perk.perkTypeLabel
      }` as gameloopIllustrationType;
    } else {
      return `${item.type}-${
        item.isOrigin ? 'ORIGIN' : 'DRIFT'
      }` as gameloopIllustrationType;
    }
  }, [item]);

  const illustrationPath = useMemo(() => {
    return gamificationItemIllustrationMatchings[illustrationKey];
  }, [illustrationKey]);

  const illustrationPoster = useMemo(() => {
    return getGamificationIllustrationPoster(illustrationKey);
  }, [illustrationKey]);

  const perkDescription = useMemo<PerkDescription | null>(() => {
    if (item.type !== 'perks') {
      return null;
    }

    const perkDetails = (item as GamificationItem<PerkItem>).perk,
      perkTypeLabel = (item as GamificationItem<PerkItem>).perkTypeLabel;
    return {
      value:
        perkTypeLabel !== 'bonus'
          ? perkDetails.value.toNumber() / 100
          : Number(ethers.utils.formatEther(perkDetails.value)),
      unit: perkTypeLabel === 'bonus' ? 'THOR' : '%',
      label:
        perkTypeLabel === 'bonus' ? (
          <Typography
            variant={'lbl-md'}
            lineHeight={'15px'}
            letterSpacing={'0.02em'}
            mb={'33px'}
          >
            VOUCHER
          </Typography>
        ) : (
          <Typography
            variant={'lbl-md'}
            lineHeight={'15px'}
            letterSpacing={'0.02em'}
            mb={'18px'}
          >
            {perkTypeLabel === 'sigma' ? 'PERMANENT' : 'TEMPORARY'}
            <br />
            REWARD BOOST
          </Typography>
        ),
      status: perkTypeLabel === 'bonus' ? 'UNCLAIMED' : 'INACTIVE',
    };
  }, [item]);

  const handleClickMoreActionsButton = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionsMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = () => {
    if (disabled) {
      return;
    }

    onClick(item);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        pt: '100%',
      }}
    >
      <Box
        sx={(theme) => ({
          'position': 'absolute',
          'top': 0,
          'left': 0,
          'bottom': 0,
          'right': 0,
          'border': isSelected ? '3px solid' : undefined,
          'borderColor': theme.palette.primary.main,
          'opacity': disabled ? 0.4 : 1,
          '& .actions': {
            visibility:
              moreActionsMenuOpen || isSelected ? 'visible' : 'hidden',
          },
          '&:hover .actions': {
            visibility: 'visible',
          },
        })}
        onClick={handleCardClick}
      >
        <Box
          sx={{
            position: 'absolute',
            left: '16px',
            right: '16px',
            top: '16px',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            sx={{
              '& .action-button': {
                'p': '4px',
                'backgroundColor': 'rgba(248, 248, 248, .6)',
                '&:hover': {
                  backgroundColor: presetColors.ash,
                },
              },
            }}
            className={'actions'}
          >
            <Box>
              <IconButton
                onClick={handleClickMoreActionsButton}
                size={'small'}
                className={'action-button'}
              >
                <MoreVertIcon color="primary" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={moreActionsMenuOpen}
                onClose={handleActionsMenuClose}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              >
                <Link
                  href={`/nft/${item.contractAddress}/${item.id}`}
                  color="inherit"
                >
                  <a href={`/nft/${item.contractAddress}/${item.id}`}>
                    <MenuItem>
                      <ListItemIcon>
                        <TocIcon style={{ color: 'black' }} />
                      </ListItemIcon>
                      <ListItemText>View details</ListItemText>
                    </MenuItem>
                  </a>
                </Link>
              </Menu>
            </Box>
            <Box
              sx={{
                '& .action-button:not(:first-child)': {
                  marginLeft: '16px',
                },
              }}
            ></Box>
          </Box>
        </Box>
        <Box
          sx={(theme) => ({
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            background:
              theme.palette.mode === 'light'
                ? 'rgba(248, 248, 248, 0.4)'
                : undefined,
          })}
          className={'labels'}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              zIndex: 1,
            }}
          >
            {perkDescription && (
              <>
                <Typography
                  fontWeight={300}
                  fontSize={'32px'}
                  lineHeight={'48px'}
                >
                  {perkDescription.value} {perkDescription.unit}
                </Typography>
                {perkDescription.label}
              </>
            )}
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
              <Typography
                variant={'lbl-md'}
                lineHeight={'15px'}
                letterSpacing={'0.02em'}
                height={'15px'}
                flex={'1 0'}
              >
                {item.name}
              </Typography>
              {perkDescription && (
                <Box p={'4px 11px'} border={'1px solid'}>
                  <Typography
                    fontWeight={700}
                    fontSize={'10px'}
                    lineHeight={'15px'}
                  >
                    {perkDescription.status}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <video
          loop
          autoPlay={true}
          muted
          poster={illustrationPoster}
          style={{
            width: '100%',
            height: '100%',
          }}
          className={'illustration-video'}
        >
          <source src={illustrationPath} type="video/mp4" />
        </video>
      </Box>
    </Box>
  );
};

export default GamificationItemCard;
