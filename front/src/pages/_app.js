import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserProvider } from '@/context/UserContext';
import styles from '../styles/styles.scss';
import MainLayout from '@/layouts/MainLayout';
import AccountLayout from '@/layouts/AccountLayout';
import 'primeflex/primeflex.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true after the component mounts
  }, []);

  // Here you return the layout based on the route or just null when isClient is false
  if (!isClient) {
    return null; 
  }

  const Layout = router && router.asPath.startsWith('/account') ? AccountLayout : MainLayout;

  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}

export default MyApp;
