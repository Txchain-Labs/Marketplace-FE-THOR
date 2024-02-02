import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';

const PublicProfileHomePage: FC = () => {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await router.push(`/profile/${router.query.address}/owned`);
    })();
  }, [router]);

  return null;
};

export default PublicProfileHomePage;
