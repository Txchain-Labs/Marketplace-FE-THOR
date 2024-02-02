import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';

const ExploreHomePage: FC = () => {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await router.push('/explore/collections');
    })();
  }, [router]);

  return null;
};

export default ExploreHomePage;
