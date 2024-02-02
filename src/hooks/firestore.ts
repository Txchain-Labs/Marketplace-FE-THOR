import { FirebaseConfig } from '@/utils/constants';
import { useChain } from '@/utils/web3Utils';
import { initializeApp } from '@firebase/app';
import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from '@firebase/firestore';
import { useEffect, useState } from 'react';

const firebaseApp = initializeApp(FirebaseConfig);
const dbFirestore = getFirestore(firebaseApp);
const capsuletActivityTypes = ['LIST', 'BID', 'BID_OTC', 'SOLD'];
const gameloopActivityTypes = [
  'TRANSFORM_TO_KEYCARD',
  'TRANSFORM_TO_DRIFT',
  'FUSE',
  'OPEN',
  'CLAIM',
  'APPLY',
];
export const useGetCapsuleEvents = (activityActiveState: boolean) => {
  const [capsuleData, setCapsuleData] = useState([]);

  const chain = useChain();
  useEffect(() => {
    let unsub: any;

    if (chain && activityActiveState) {
      //   if (unsub) unsub();

      unsub = onSnapshot(
        query(
          collection(dbFirestore, 'activity'),
          where('chainId', '==', chain?.id?.toString()),
          orderBy('timestamp', 'desc'),
          limit(10)
        ),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            // console.log('Current data:', change.doc.data());
            // if (capsuleData?.length < 10 || gameloopData?.length < 10) {
            if (capsuletActivityTypes?.includes(change.doc.data()?.type)) {
              // Check if an object with the same ID already exists in the array
              const existingObject = capsuleData.find(
                (obj) => obj.tokenId === change.doc.data()?.tokenId
              );
              // If an existing object is found, do not add the new element
              if (existingObject) {
                return;
              }

              // Add the new element to the beginning of the array
              const newArray = [change.doc.data(), ...capsuleData];

              // If the array length exceeds 10, remove the last element
              if (newArray.length > 10) {
                newArray.pop();
              }

              // Update the state array with the new array
              setCapsuleData(newArray);
            }
            // }
          });
        }
      );
    }

    return () => {
      if (unsub) unsub();
    };
  }, [chain, activityActiveState, capsuleData]);

  return capsuleData;
};

export const useGetGameloopEvents = (activityActiveState: boolean) => {
  const [gameloopData, setGameloopData] = useState([]);

  const chain = useChain();
  useEffect(() => {
    let unsub: any;

    if (chain && activityActiveState) {
      //   if (unsub) unsub();
      unsub = onSnapshot(
        query(
          collection(dbFirestore, 'gameloopActivity'),
          where('chainId', '==', chain?.id?.toString()),
          orderBy('timestamp', 'desc'),
          limit(10)
        ),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            // console.log('Current data:', change.doc.data());
            // if (capsuleData?.length < 10 || gameloopData?.length < 10) {
            if (gameloopActivityTypes?.includes(change.doc.data()?.type)) {
              // Check if an object with the same ID already exists in the array
              const existingObject = gameloopData.find(
                (obj) => obj.tokenId === change.doc.data()?.tokenId
              );
              // If an existing object is found, do not add the new element
              if (existingObject) {
                return;
              }

              // Add the new element to the beginning of the array
              const newArray = [change.doc.data(), ...gameloopData];

              // If the array length exceeds 10, remove the last element
              if (newArray.length > 10) {
                newArray.pop();
              }

              // Update the state array with the new array
              setGameloopData(newArray);
            }
            // }
          });
        }
      );
    }

    return () => {
      if (unsub) unsub();
    };
  }, [chain, activityActiveState, gameloopData]);

  return gameloopData;
};
