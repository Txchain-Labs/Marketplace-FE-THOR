import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import TableDynamicRow from './TableDynamicRow';
import TableHeadColumns from './TableHeadColumns';
import React, { useEffect, useState } from 'react';
import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from '@firebase/firestore';
import { initializeApp } from '@firebase/app';
import { FirebaseConfig } from '@/utils/constants';
import { useChain } from '@/utils/web3Utils';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

let unsub: any;
const capsuletActivityTypes = ['LIST', 'BID', 'BID_OTC', 'SOLD'];
const firebaseApp = initializeApp(FirebaseConfig);
const dbFirestore = getFirestore(firebaseApp);
interface table {
  // rows: Array<any>;
  activityActiveState: boolean;
}

const CapsuleTable = ({ activityActiveState }: table) => {
  const [showMore, setShowMore] = useState(false);
  const handleContentShow = () => {
    setShowMore(!showMore);
  };
  const showCollapseRecordLimit = 4;
  const chain = useChain();
  const [data, setData] = useState([]);
  useEffect(() => {
    if (chain && activityActiveState) {
      if (unsub) unsub();

      unsub = onSnapshot(
        query(
          collection(dbFirestore, 'activity'),
          where('chainId', '==', chain?.id?.toString()),
          orderBy('timestamp', 'desc'),
          limit(10)
        ),
        (doc) => {
          doc.docChanges().forEach((change) => {
            if (capsuletActivityTypes?.includes(change.doc.data()?.type)) {
              // Check if an object with the same ID already exists in the array
              const existingObject = data.find(
                (obj) => obj.tokenId === change.doc.data()?.tokenId
              );
              // If an existing object is found, do not add the new element
              if (existingObject) {
                return;
              }

              // Add the new element to the beginning of the array
              const newArray = [change.doc.data(), ...data];

              // If the array length exceeds 10, remove the last element
              if (newArray.length > 10) {
                newArray.pop();
              }

              // Update the state array with the new array
              setData(newArray);
            }
          });
        }
      );
    }
  }, [chain, activityActiveState, data]);

  return (
    <Box sx={{ position: 'relative' }}>
      {data?.length ? (
        <TableContainer
          component={Paper}
          sx={{
            '&.MuiPaper-root': {
              backgroundImage: 'none',
              width: '100%',
              marginTop: '30px',
              marginBottom: '10px',
            },
            '& .MuiTableCell-root': {
              borderBottom: 'none',
            },
          }}
        >
          <Table stickyHeader>
            <TableHead
              sx={{
                '& .MuiTableCell-root': {
                  bgcolor: 'unset',
                  color: 'text.secondary',
                },
              }}
            >
              <TableHeadColumns />
            </TableHead>
            <TableBody>
              {showMore
                ? data?.map((row: any, index: number) => (
                    <TableDynamicRow data={row} key={index} index={index} />
                  ))
                : data
                    .slice(0, showCollapseRecordLimit)
                    ?.map((row: any, index: number) => (
                      <TableDynamicRow data={row} key={index} index={index} />
                    ))}
              {data?.length > showCollapseRecordLimit && (
                <TableRow>
                  <TableCell colSpan={99} sx={{ p: '4px 4px 8px' }}>
                    <Box width={'100%'} textAlign={'center'}>
                      <Button
                        sx={{
                          borderRadius: 0,
                          textTransform: 'none',
                          fontWeight: 700,
                        }}
                        startIcon={
                          showMore ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )
                        }
                        onClick={handleContentShow}
                      >
                        {showMore ? 'Show less' : 'Show more'}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box>
          <Typography variant="lbl-md" sx={{ textAlign: 'center' }}>
            No Activity to show.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CapsuleTable;
