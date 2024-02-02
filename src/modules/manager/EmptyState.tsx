import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { MODAL_TYPES, useGlobalModalContext } from '@/components/modals';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
interface State {
  type: string;
  nodeType?: string;
}
const EmptyState = ({ type, nodeType = '' }: State) => {
  const { showModal } = useGlobalModalContext();
  const { address } = useAccount();
  const router = useRouter();

  const handleClickItem = (url_data: any) => {
    if (!address) {
      showModal(MODAL_TYPES.CONNECT_WALLET, {
        title: 'Create instance form',
        confirmBtn: 'Save',
      });
    } else {
      // ('<Link href={`/gameloop/transform2drift`}></Link>');
      router.push(url_data);
    }
  };
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        p: '5%',
        marginTop: 2,
      }}
    >
      <img src="/images/manager/perk/perkEmpty.png" alt="Empty" />
      <Typography variant="p-lg" color={'text.secondary'} mt={2}>
        You have no {type}{' '}
        {nodeType.slice(0, 1) + nodeType.slice(1).toLowerCase()}
      </Typography>
      <Typography variant="caption" color={'text.secondary'} mt={1}>
        Get them at GameLoop or Buy them
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Link href="/gameloop">
          <Button
            variant="contained"
            color={'secondary'}
            sx={{ minWidth: '165px', marginTop: 2 }}
          >
            <Typography variant="lbl-md">Go to Gameloop</Typography>
          </Button>
        </Link>
        {type === 'OG' && (
          <Button
            variant="contained"
            fullWidth
            sx={{ minWidth: '165px', marginTop: 2 }}
            onClick={() => handleClickItem('/buyassets/origin')}
          >
            <Typography variant="lbl-md">Buy OG</Typography>
          </Button>
        )}
        {type === 'Drift' && (
          <Button
            variant="contained"
            fullWidth
            sx={{ minWidth: '165px', marginTop: 2 }}
            onClick={() => handleClickItem('/buyassets/drift')}
          >
            <Typography variant="lbl-md">Buy Drift</Typography>
          </Button>
        )}
        {type === 'Keycards' && (
          <Button
            variant="contained"
            fullWidth
            sx={{ minWidth: '165px', marginTop: 2 }}
            onClick={() => handleClickItem('/buyassets/keycards')}
          >
            <Typography variant="lbl-md">Buy Keycards</Typography>
          </Button>
        )}
        {type === 'Capsules' && (
          <Button
            variant="contained"
            fullWidth
            sx={{ minWidth: '165px', marginTop: 2 }}
            onClick={() => handleClickItem('/buyassets/capsules')}
          >
            <Typography variant="lbl-md">Buy Capsules</Typography>
          </Button>
        )}
        {type === 'Perks' && (
          <Button
            variant="contained"
            fullWidth
            sx={{ minWidth: '165px', marginTop: 2 }}
            onClick={() => handleClickItem('/buyassets/perks')}
          >
            <Typography variant="lbl-md">Buy Perks</Typography>
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default EmptyState;
