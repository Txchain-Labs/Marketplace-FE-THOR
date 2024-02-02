import { useRouter } from 'next/router';

import PublicProfile from '@/modules/publicProfile';
import PageContainer from '@/layouts/PageContainer';

const PublicProfilePage = () => {
  const router = useRouter();
  const address = router.query.address;
  const activeTab = router.query.activeTab;

  return (
    <PageContainer sx={{ p: '24px 16px' }}>
      <PublicProfile
        profileAddress={address as string}
        activeTab={activeTab as string}
      />
    </PageContainer>
  );
};

export default PublicProfilePage;
