import { Box } from '@mui/material';
import ThumbnailCard from './ThumbnailCard';
interface Thumbnail {
  pageType: string;
  nodeType: string;
  tier: string;
  data: any;
  handleFavorites: (data: any) => void;
  handleEditPrice: (data: any) => void;
  handleEditName?: (data: any) => void;
  handleClaimVoucher?: (data: any) => void;
}
const ThumbnailView = ({
  pageType,
  nodeType,
  tier,
  data,
  handleFavorites,
  handleEditPrice,
  handleEditName,
  handleClaimVoucher,
}: Thumbnail) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        marginTop: '15px',
        justifyContent: 'flex-start',
        gap: '10px',
      }}
    >
      {data?.map((item: any) => (
        <ThumbnailCard
          key={item?.id}
          pageType={pageType}
          nodeType={nodeType}
          tier={tier}
          data={item}
          handleFavorites={handleFavorites}
          handleEditPrice={handleEditPrice}
          handleEditName={handleEditName}
          handleClaimVoucher={handleClaimVoucher}
        />
      ))}
    </Box>
  );
};

export default ThumbnailView;
