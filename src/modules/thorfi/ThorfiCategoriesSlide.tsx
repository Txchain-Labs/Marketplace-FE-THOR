import React, { FC, useMemo } from 'react';
// import { useQueryParam, StringParam } from 'use-query-params';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { selectTier, setTier } from '../../redux/slices/nodesSlice';

import ThorfiSlider, { Slide } from '../../components/common/ThorfiSlider';

import { useChain } from '../../utils/web3Utils';
import { thorfiNfts, ThorfiNFTType } from '../../utils/constants';

interface ThorfiCategoriesSlideProps {
  thorfiNFTType?: ThorfiNFTType;
}

const ThorfiCategoriesSlide: FC<ThorfiCategoriesSlideProps> = ({
  thorfiNFTType,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const matchLgUp = useMediaQuery(theme.breakpoints.up('md'));
  const matchSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  // const [, setTier] = useQueryParam('tier', StringParam);

  const tier = useSelector(selectTier);

  const chain = useChain();
  const thorfiNFTs = thorfiNfts(thorfiNFTType, chain);

  const slides = useMemo(() => {
    return thorfiNFTs.map(
      (nft) =>
        ({
          key: nft.tier,
          image: nft.image,
          title: `${nft.name} ${nft.tier}`,
          subtitle: nft.contract,
        } as Slide)
    );
  }, [thorfiNFTs]);

  const handleActiveSlideChange = (key: string) => {
    // setTier(key);
    dispatch(setTier(key));
  };

  return (
    <ThorfiSlider
      slides={slides}
      activeSlide={tier}
      onActiveSlideChange={handleActiveSlideChange}
      direction={matchLgUp ? 'vertical' : 'horizontal'}
      size={matchSmDown ? 'small' : 'medium'}
      hideTitle={matchSmDown}
      fullHeightOffset={matchSmDown ? 72 : 48}
    />
  );
};

export default ThorfiCategoriesSlide;
