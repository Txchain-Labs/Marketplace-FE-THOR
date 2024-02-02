import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';

const HomePage: FC = () => {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await router.push('/explore/collections');
    })();
  }, [router]);

  return null;
};

export default HomePage;
