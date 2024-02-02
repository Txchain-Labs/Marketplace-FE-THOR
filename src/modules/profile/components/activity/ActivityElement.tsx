import * as React from 'react';

import { isMobile } from 'react-device-detect';

import { Box, Avatar, Button, Typography } from '@mui/material';
import {
  button,
  infoContainer,
  infoContainer_mobile,
  listWrapper,
  titleContainer,
} from './style';

import {
  WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL,
  WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL_TWO_ROWS,
} from '../../../../../src/utils/constants';

import { useSelector } from 'react-redux';

import { useChain } from '../../../../utils/web3Utils';

const listItem = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  // borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  p: '10px 0px',

  height: '100px',
};
const listWrapper2 = {
  ...listWrapper,
  width: '40.5vw',
  minWidth: '200px',
};

const styleEventType = {
  padding: '2px',
  paddingTop: '6px',
};

const styleEventTypeButton = {
  ...button,
  marginTop: '-5px',
};
const styleEventTypeButton_Error = {
  ...styleEventTypeButton,
  color: 'var(--capsule-color-error)',
  border: '1px solid var(--capsule-color-error)',
};
const styleEventTypeButton_Info = {
  ...styleEventTypeButton,
  color: 'var(--capsule-color-info)',
  border: '1px solid var(--capsule-color-info)',
};
const styleEventTypeButton_Warning = {
  ...styleEventTypeButton,
  color: 'var(--capsule-color-warning)',
  border: '1px solid var(--capsule-color-warning)',
};
const styleEventTypeButton_Success = {
  ...styleEventTypeButton,
  color: 'var(--capsule-color-success)',
  border: '1px solid var(--capsule-color-success)',
};

// const sxFilterOptionsSwitch = {
//   textAlign: 'right',
//   cursor: `url("/images/cursor-pointer.svg"), auto`,
// };

const btn = {
  width: '150px',
  display: 'block',
  fontSize: '12px',
};

const imageURL = (url: string) => {
  if (url.startsWith('ipfs://')) url = url.replace('ipfs://', 'ipfs.io/ipfs/');
  if (!url.startsWith('https://') && !url.startsWith('http://'))
    url = 'https://' + url;

  return url;
};

interface ActivityElementProps {
  item: any;
  key: number;
}
const ActivityElement: any = ({ item, key }: ActivityElementProps) => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const updateDimensions = () => {
    setWidth(window.innerWidth);
  };

  React.useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const user = useSelector((state: any) => state?.auth?.user);

  const [hovered, setHovered] = React.useState(false);

  const chain = useChain();

  return !isMobile ? (
    <Box
      sx={{
        ...listItem,
        display:
          width > WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL_TWO_ROWS
            ? 'flex'
            : 'table-row-group',
      }}
      key={key}
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <Box
        sx={{
          ...listWrapper2,
          width:
            width > WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL_TWO_ROWS
              ? '70vw'
              : '90vw',
        }}
      >
        <Avatar
          src={imageURL(item.img)}
          sx={{ mr: 2, height: '63px', width: '63px' }}
        />
        <Box>
          <Box sx={titleContainer}>
            <Typography variant="p-lg">{item.title}</Typography>
            <Box
              sx={
                item.btnText === 'Listed' ||
                item.btnText === 'Edited List' ||
                item.btnText === 'Received Bid' ||
                item.btnText === 'Sent Bid' ||
                item.btnText === 'Received Private Bid' ||
                item.btnText === 'Sent Private Bid' ||
                item.btnText === 'Bought' ||
                item.btnText === 'Sold' ||
                item.btnText === 'Transfer'
                  ? styleEventTypeButton_Success
                  : item.btnText === 'UnListed' ||
                    item.btnText === 'Removed Bid' ||
                    item.btnText === 'Removed Private Bid' ||
                    item.btnText === 'Expired Bid' ||
                    item.btnText === 'Expired Private Bid'
                  ? styleEventTypeButton_Error
                  : item.btnText === 'Edited List'
                  ? styleEventTypeButton_Info
                  : item.btnText === 'Bid Expired'
                  ? styleEventTypeButton_Warning
                  : styleEventTypeButton
              }
            >
              <Typography fontWeight={700} sx={styleEventType} variant="lbl-sm">
                {item.btnText}
              </Typography>
            </Box>
          </Box>
          <Box sx={infoContainer}>
            <Typography
              variant="p-lg-bk"
              sx={{
                marginRight: '10px',
                color: 'text.secondary',
              }}
            >
              {item.from}
            </Typography>
            <a href={item.fromAddr} rel="noreferrer">
              <Typography
                variant="p-lg"
                sx={{ display: 'inline', marginRight: '10px' }}
              >
                {' '}
                {item.fromSpan}
              </Typography>
            </a>
            <Typography
              variant="p-lg-bk"
              sx={{ marginRight: '10px', color: 'text.secondary' }}
            >
              {item.to}
            </Typography>
            <a href={item.toAddr} rel="noreferrer">
              <Typography
                variant="p-lg"
                sx={{ display: 'inline', marginRight: '6px' }}
              >
                {' '}
                {item.toSpan}
              </Typography>
            </a>
            <Typography
              variant="p-lg-bk"
              sx={{
                marginRight: '16px',
                marginLeft: '16px',
                color: 'text.secondary',
              }}
            >
              {item.date}
            </Typography>
            <Typography
              variant="p-lg-bk"
              sx={{
                color: 'text.secondary',
                display:
                  width > WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL
                    ? 'initial'
                    : 'none',
              }}
            >
              {item.expiry}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        display={hovered ? 'none' : 'flex'}
        flexDirection={'column'}
        alignItems={
          width > WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL_TWO_ROWS
            ? 'flex-end'
            : 'flex-start'
        }
        sx={{
          marginTop:
            width > WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL_TWO_ROWS
              ? '5px'
              : '25px',
          minWidth: '100px',
          marginLeft:
            width > WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL_TWO_ROWS
              ? '0'
              : '10vw',
          marginRight:
            width > WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL_TWO_ROWS
              ? '12px'
              : width > WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL_TWO_ROWS / 2
              ? 'calc(25vw + 12px)'
              : 'calc(5vw + 12px)',
        }}
        className="tooltip"
      >
        <Box display={'flex'} alignItems="center">
          {/* <img src="/images/rectangle-icon.png" /> */}
          {item.value !== ' -- ' ? (
            <Typography variant="p-lg">
              {!user?.default_currency || user?.default_currency === 'USDC'
                ? '$'
                : ''}{' '}
              {item.value}{' '}
              {user?.default_currency
                ? user?.default_currency.replace('USDC', 'USD')
                : 'USD'}
            </Typography>
          ) : (
            <Typography variant="p-lg">{item.value}</Typography>
          )}
        </Box>
        {item.description !== '' ? (
          <Typography
            variant="p-lg-bk"
            mt={1}
            sx={{ color: 'text.secondary' }}
            className="tooltiptext"
          >
            {item.description}
          </Typography>
        ) : (
          <></>
        )}
      </Box>
      <Box
        display={!hovered ? 'none' : 'flex'}
        sx={{
          minWidth: '100px',
          marginRight:
            width > WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL_TWO_ROWS
              ? '0'
              : width > WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL_TWO_ROWS / 2
              ? '25vw'
              : '5vw',
          marginTop:
            width > WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL_TWO_ROWS
              ? '0'
              : '-30px',
          marginBottom:
            width > WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL_TWO_ROWS
              ? '0'
              : '30px',
        }}
        flexDirection={'column'}
        alignItems="flex-end"
      >
        <Box display={'block'} alignItems="center">
          <Button
            variant={'outlined'}
            color={'secondary'}
            sx={btn}
            onClick={() => {
              ///// console.log('----- LINK: ' + item.link);
              ///// router.push(item.link);
              window.location.href =
                item.btnText === 'Received Bid' &&
                item.expiry.startsWith('Expiring')
                  ? `/nft/${item.nftAddress}/${item.tokenId}?cta=accept_bid`
                  : item.btnText === 'Received Private Bid' &&
                    item.expiry.startsWith('Expiring')
                  ? `/nft/${item.nftAddress}/${item.tokenId}?cta=accept_otc_bid`
                  : item.link;
            }}
          >
            {(item.btnText === 'Received Bid' ||
              item.btnText === 'Received Private Bid') &&
            item.expiry.startsWith('Expiring')
              ? 'Accept bid'
              : 'View'}
          </Button>

          <Button
            variant={'text'}
            sx={{ ...btn, marginTop: '5px' }}
            onClick={() => {
              (item.btnText === 'Sold' ||
                item.btnText === 'Bought' ||
                item.btnText === 'Transfer' ||
                item.btnText === 'Sent Bid' ||
                item.btnText === 'Sent Private Bid') &&
                window.open(
                  `https://${
                    chain.id === 43114 ? '' : 'testnet.'
                  }snowtrace.io/tx/${
                    item.txHash.startsWith('0x')
                      ? item.txHash
                      : '0x' + item.txHash
                  }`,
                  '_blank'
                );

              (item.btnText === 'Listed' &&
                (window.location.href = `/nft/${item.nftAddress}/${item.tokenId}?cta=edit`)) ||
                (item.btnText === 'UnListed' &&
                  (window.location.href = `/nft/${item.nftAddress}/${item.tokenId}?cta=list`));
            }}
          >
            {item.btnText === 'Sold' ||
            item.btnText === 'Bought' ||
            item.btnText === 'Transfer' ||
            item.btnText === 'Sent Bid' ||
            item.btnText === 'Sent Private Bid'
              ? 'Open on Snowtrace'
              : item.btnText === 'Listed'
              ? 'Edit List'
              : item.btnText === 'UnListed'
              ? 'List'
              : ''}
          </Button>
        </Box>
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        ...listItem,
        display: 'table-row-group',

        height: '140px',
      }}
      key={key}
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <Box
        sx={{
          ...listWrapper2,
          width: '90vw',
        }}
      >
        <Avatar
          src={imageURL(item.img)}
          sx={{ mr: 2, height: '63px', width: '63px' }}
        />
        <Box>
          <Box sx={infoContainer_mobile}>
            <Typography
              variant="p-lg-bk"
              sx={{
                fontSize: isMobile ? '13px' : 'initial',
                marginTop: '-20px',
                marginRight: '16px',
                color: 'text.secondary',
              }}
            >
              {item.date}
            </Typography>
            <Typography
              variant="p-lg-bk"
              sx={{
                fontSize: isMobile ? '13px' : 'initial',
                marginTop: '-20px',
                color: 'text.secondary',
              }}
            >
              {item.expiry}
            </Typography>
          </Box>
          <Box sx={titleContainer}>
            <Typography variant="p-lg">
              {item.title.length > 22
                ? item.title.slice(0, 15) +
                  '...' +
                  item.title.slice(item.title.length - 5, item.title.length)
                : item.title}
            </Typography>
            <Box
              sx={
                item.btnText === 'Listed' ||
                item.btnText === 'Edited List' ||
                item.btnText === 'Received Bid' ||
                item.btnText === 'Sent Bid' ||
                item.btnText === 'Received Private Bid' ||
                item.btnText === 'Sent Private Bid' ||
                item.btnText === 'Bought' ||
                item.btnText === 'Sold' ||
                item.btnText === 'Transfer'
                  ? styleEventTypeButton_Success
                  : item.btnText === 'UnListed' ||
                    item.btnText === 'Removed Bid' ||
                    item.btnText === 'Removed Private Bid' ||
                    item.btnText === 'Expired Bid' ||
                    item.btnText === 'Expired Private Bid'
                  ? styleEventTypeButton_Error
                  : item.btnText === 'Edited List'
                  ? styleEventTypeButton_Info
                  : item.btnText === 'Bid Expired'
                  ? styleEventTypeButton_Warning
                  : styleEventTypeButton
              }
            >
              <Typography fontWeight={700} sx={styleEventType} variant="lbl-sm">
                {item.btnText}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ ...infoContainer_mobile, alignItems: 'center', mt: 1.5 }}>
            <Typography
              variant="p-lg-bk"
              sx={{
                fontSize: isMobile ? '13px' : 'initial',
                marginRight: '5px',
                color: 'text.secondary',
              }}
            >
              {item.from}
            </Typography>
            <a href={item.fromAddr} rel="noreferrer">
              <Typography
                variant="p-lg"
                sx={{
                  fontSize: isMobile ? '13px' : 'initial',
                  display: 'inline',
                  marginRight: '5px',
                }}
              >
                {' '}
                {item.fromSpan}
              </Typography>
            </a>
            <Typography
              variant="p-lg-bk"
              sx={{
                fontSize: isMobile ? '13px' : 'initial',
                marginRight: '5px',
                color: 'text.secondary',
              }}
            >
              {item.to}
            </Typography>
            <a href={item.toAddr} rel="noreferrer">
              <Typography
                variant="p-lg"
                sx={{
                  fontSize: isMobile ? '13px' : 'initial',
                  display: 'inline',
                  marginRight: '6px',
                }}
              >
                {' '}
                {item.toSpan}
              </Typography>
            </a>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection={'column'}
        alignItems={'flex-start'}
        sx={{
          marginTop: '5px',
          minWidth: '100px',
          marginLeft: '17.5vw',
          marginRight: '30px',
        }}
        className="tooltip"
      >
        <Box display={'flex'} alignItems="center">
          {/* <img src="/images/rectangle-icon.png" /> */}
          {item.value !== ' -- ' ? (
            <Typography variant="p-lg">
              {!user?.default_currency || user?.default_currency === 'USDC'
                ? '$'
                : ''}{' '}
              {item.value}{' '}
              {user?.default_currency
                ? user?.default_currency.replace('USDC', 'USD')
                : 'USD'}
            </Typography>
          ) : (
            <Typography variant="p-lg">{item.value}</Typography>
          )}
        </Box>
        {item.description !== '' ? (
          <Typography
            variant="p-lg-bk"
            mt={1}
            sx={{ color: 'text.secondary' }}
            className="tooltiptext"
          >
            {item.description}
          </Typography>
        ) : (
          <></>
        )}
      </Box>

      <Box
        display={!hovered ? 'none' : 'flex'}
        sx={{
          position: 'fixed',
          bottom: '0px',
          left: '0px',
          width: '100%',
          background: 'white',
          textAlign: 'center',
          zIndex: '10000',
        }}
        flexDirection="row"
      >
        <Box display="block" alignItems="center" sx={{ background: 'white' }}>
          <Button
            variant={'outlined'}
            color={'secondary'}
            sx={{ ...btn, width: '90vw', marginLeft: '5vw' }}
            onClick={() => {
              ///// console.log('----- LINK: ' + item.link);
              ///// router.push(item.link);
              window.location.href =
                item.btnText === 'Received Bid' &&
                item.expiry.startsWith('Expiring')
                  ? `/nft/${item.nftAddress}/${item.tokenId}?cta=accept_bid`
                  : item.btnText === 'Received Private Bid' &&
                    item.expiry.startsWith('Expiring')
                  ? `/nft/${item.nftAddress}/${item.tokenId}?cta=accept_otc_bid`
                  : item.link;
            }}
          >
            {(item.btnText === 'Received Bid' ||
              item.btnText === 'Received Private Bid') &&
            item.expiry.startsWith('Expiring')
              ? 'Accept bid'
              : 'View'}
          </Button>

          <Button
            variant={'text'}
            sx={{ ...btn, width: '90vw', marginLeft: '5vw', marginTop: '5px' }}
            onClick={() => {
              (item.btnText === 'Sold' ||
                item.btnText === 'Bought' ||
                item.btnText === 'Transfer' ||
                item.btnText === 'Sent Bid' ||
                item.btnText === 'Sent Private Bid') &&
                window.open(
                  `https://${
                    chain.id === 43114 ? '' : 'testnet.'
                  }snowtrace.io/tx/${
                    item.txHash.startsWith('0x')
                      ? item.txHash
                      : '0x' + item.txHash
                  }`,
                  '_blank'
                );

              (item.btnText === 'Listed' &&
                (window.location.href = `/nft/${item.nftAddress}/${item.tokenId}?cta=edit`)) ||
                (item.btnText === 'UnListed' &&
                  (window.location.href = `/nft/${item.nftAddress}/${item.tokenId}?cta=list`));
            }}
          >
            {item.btnText === 'Sold' ||
            item.btnText === 'Bought' ||
            item.btnText === 'Transfer' ||
            item.btnText === 'Sent Bid' ||
            item.btnText === 'Sent Private Bid'
              ? 'Open on Snowtrace'
              : item.btnText === 'Listed'
              ? 'Edit List'
              : item.btnText === 'UnListed'
              ? 'List'
              : ''}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ActivityElement;
