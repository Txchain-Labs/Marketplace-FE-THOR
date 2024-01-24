import React, { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDebounce } from 'usehooks-ts';
import { isMobile } from 'react-device-detect';
import {
  Box,
  InputAdornment,
  TextField,
  Divider,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { Loader, NoData } from '../../components/common';

import { formatNumber } from '../../utils/common';

import { useCollections } from '../../hooks/collections';

interface CollectionsListProps {
  collections?: any;
  collectionAddress?: string;
}

const CollectionsList: FC<CollectionsListProps> = ({ collectionAddress }) => {
  const router = useRouter();

  const [searchText, setSearchText] = useState<string>('');
  const debouncedSearchText = useDebounce<string>(searchText, 500);

  const handleSearchTextInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value);
  };

  const { data: collections, isLoading }: { data: any; isLoading: boolean } =
    useCollections(debouncedSearchText);

  useEffect(() => {
    if (isMobile || collectionAddress || !collections) {
      return;
    }

    if (collections?.metaData?.totalCount > 0) {
      router.push(`/collections/${collections.records[0].address}`);
    }
  }, [collectionAddress, collections, router]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        borderRight: '1px solid rgba(0, 0, 0, 0.2)',
      }}
    >
      <Typography
        variant="h3"
        sx={{
          padding: '30px',
          fontWeight: 400,
          lineHeight: '48px',
        }}
      >
        Collections
      </Typography>

      <TextField
        sx={{
          'padding': '0 30px 20px 30px',
          '& .MuiInputBase-root': {
            padding: '0 0 0 10px',
            borderRadius: '20px',
          },
        }}
        size="small"
        variant="outlined"
        placeholder="Search collection"
        value={searchText}
        onChange={handleSearchTextInputChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Divider />

      {isLoading ? (
        <Loader colSpan={2} height={500} size={undefined} />
      ) : collections?.metaData?.totalCount > 0 ? (
        <List sx={{ flexGrow: 1, overflow: 'auto' }} disablePadding>
          {collections?.records?.map((item: any) => (
            <Link key={item.address} href={`/collections/${item.address}`}>
              <a href={`/collections/${item.address}`}>
                <ListItemButton
                  selected={collectionAddress === item.address}
                  alignItems="center"
                  sx={{
                    'padding': '16px',
                    'height': '84px',
                    '&.Mui-selected, &.Mui-selected:hover': {
                      background: 'rgba(222, 223, 235, 0.4)',
                    },
                  }}
                  divider
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{ width: 52, height: 52, marginRight: '8px' }}
                      alt={item?.name}
                      src={item?.profile_image || '/images/random.png'}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          lineHeight: '24px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginRight: '8px',
                          maxWidth: '168px',
                        }}
                        variant={'p-md'}
                      >
                        {item?.name
                          .replace('OG Odin', 'Origin Odin')
                          .replace('OG Thor', 'Origin Thor')}
                      </Typography>
                    }
                    // secondary={
                    //   <Typography component="span" variant="lbl-sm">
                    //     196 total volume
                    //   </Typography>
                    // }
                  />
                  <ListItemText
                    sx={{ flexGrow: '0', textAlign: 'right' }}
                    primary={
                      <Typography variant="sub-h">
                        {formatNumber(
                          item.collection_size,
                          item.collection_size > 999 ? 1 : 0
                        )}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        component="span"
                        variant="lbl-sm"
                        sx={{
                          lineHeight: '18px',
                        }}
                      >
                        items
                      </Typography>
                    }
                  />
                </ListItemButton>
              </a>
            </Link>
          ))}
        </List>
      ) : (
        <NoData size={200} />
      )}
    </Box>
  );
};

export default CollectionsList;
