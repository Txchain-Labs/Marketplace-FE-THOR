import React, { FC, useState, useMemo } from 'react';
import Link from 'next/link';
import { BigNumber } from 'ethers';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TocIcon from '@mui/icons-material/Toc';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@/components/icons/PlaylistRemoveIcon';

import { getNodeGifs } from '@/modules/manager/Helper';
import { formatNumber } from '@/utils/common';

import PerkTrack from '@/components/common/PerkTrack';
import { presetColors } from '@/themes/palette';

interface TransformCardProps {
  type: string;
  perks: BigNumber[];
  name: string;
  vrr: string;
  pendingReward: string;
  isSelected: boolean;
  onClick?: any;
  pageType: string;
  tier: string;
}

const TransformCard: FC<TransformCardProps> = ({
  type,
  perks,
  name,
  vrr,
  pendingReward,
  isSelected,
  onClick,
  pageType,
  tier,
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const slots = useMemo<number[]>(() => {
    const newPerks = [0, 0];

    perks.forEach((perk, index) => {
      newPerks[index] = perk.toNumber();
    });

    return newPerks;
  }, [perks]);

  const handleSecActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSecActionClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        'position': 'relative',
        'height': 'auto',
        'width': '100%',
        'border': isSelected ? '4px solid #F3523F' : undefined,
        'aspectRatio': '1/1',
        'padding': '16px',
        '& .actionButtons': {
          '& button': {
            'p': '4px',
            'backgroundColor': 'rgba(248, 248, 248, .6)',
            '&:hover': {
              backgroundColor: presetColors.ash,
            },
          },
          'visibility': isSelected
            ? 'unset'
            : smDown
            ? 'unset'
            : open
            ? 'unset'
            : 'hidden',
        },
        '&::before': {
          content: '""',
          backgroundImage: `url("${getNodeGifs(pageType, type, tier)}")`,
          backgroundSize: 'cover',
          position: 'absolute',
          top: '0px',
          right: '0px',
          left: '0px',
          bottom: '0px',
          opacity: 1,
        },
        '&:hover .actionButtons': {
          visibility: 'unset',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          height: '100%',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            zIndex: '1',
            top: '0',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
            className="actionButtons"
          >
            <Box>
              <IconButton size={'small'} onClick={handleSecActionClick}>
                <MoreVertIcon color="primary" />
              </IconButton>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleSecActionClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <MenuList>
                  <Link href={`/nft/xx`} color="inherit">
                    <a href={`/nft/xx`}>
                      <MenuItem>
                        <ListItemIcon>
                          <TocIcon />
                        </ListItemIcon>
                        <ListItemText>View details</ListItemText>
                      </MenuItem>
                    </a>
                  </Link>
                </MenuList>
              </Popover>
            </Box>
            <Box>
              {isSelected ? (
                <IconButton size={'small'} onClick={onClick}>
                  <PlaylistRemoveIcon />
                </IconButton>
              ) : (
                <IconButton size={'small'} onClick={onClick}>
                  <PlaylistAddIcon color="primary" />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
        <Box>
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: smDown ? 'flex-start' : 'center',
                mb: smDown ? '25px' : '15px',
                flexDirection: smDown ? 'column' : 'row',
              }}
            >
              <Typography
                variant={smDown ? 'lbl-lg' : 'h5'}
                sx={{
                  textAlign: 'left',
                  fontSize: smDown ? '18px' : '26px',
                  lineHeight: smDown ? '27px' : '48px',
                  // color: 'black',
                  color:
                    pageType === 'node' && type === 'DRIFT'
                      ? 'primary.contrastText'
                      : undefined,
                }}
              >
                {formatNumber(vrr, 5)}
              </Typography>{' '}
              <Typography
                variant={'lbl-md'}
                sx={{
                  width: smDown ? undefined : '69px',
                  letterSpacing: '0.02em',
                  fontSize: smDown ? '12px' : '14px',
                  textAlign: 'left',
                  marginLeft: smDown ? '0' : '8px',
                  lineHeight: '15px',
                  // color: 'black',
                  color:
                    pageType === 'node' && type === 'DRIFT'
                      ? 'primary.contrastText'
                      : undefined,
                }}
              >
                THOR PER DAY
              </Typography>
            </Box>
            <Typography
              variant={'lbl-md'}
              sx={{
                lineHeight: '15px',
                letterSpacing: '0.02em',
                textAlign: 'left',
                // color: 'black',
                color:
                  pageType === 'node' && type === 'DRIFT'
                    ? 'primary.contrastText'
                    : undefined,
                display: smDown ? 'none' : undefined,
              }}
            >
              {pendingReward} THOR PENDING REWARDS
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '4px',
              marginBottom: '4px',
            }}
          >
            <Typography
              variant={'lbl-md'}
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                width: '90px',
                whiteSpace: 'nowrap',
                color:
                  pageType === 'node' && type === 'DRIFT'
                    ? 'primary.contrastText'
                    : undefined,
              }}
            >
              {name}
            </Typography>
            <Box
              sx={{
                display: 'flex',
              }}
            >
              {type !== 'DRIFT' &&
                slots !== undefined &&
                slots.map((solt, index) => <PerkTrack id={solt} key={index} />)}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '100%',
          height: '100%',
        }}
        onClick={onClick}
      />
    </Box>
  );
};

export default TransformCard;
