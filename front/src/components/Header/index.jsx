import React, {useState} from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';

import {apiAuth} from '@/config/axios';

import {IoIosSearch} from 'react-icons/io';

import CustomButton from '@/components/CustomButton';
import Button from '@/components/Button';
import SearchBar from '@/components/SearchBar';

import styles from './index.module.scss';
import options from '@/services/Cookies';

const index = () => {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);

  const logout = () => {
    apiAuth
      .get('/auth/logout')
      .then(user => {})
      .finally(() => {
        Cookies.remove('jwt', options);
        localStorage.removeItem('token');
        router.push('/login');
      });
  };

  return (
    router.asPath !== '/login' &&
    router.asPath !== '/register' &&
    router.asPath !== '/reset-password' && (
      <nav className={styles.container_header}>
        <div className={styles.section_one}>
          <Link href="/">
            <p>
              <Image src="/logo.png" alt="logo" width={150} height={70} />
            </p>
          </Link>
          <ul>
            <li>
              <Link href="/pricing">
                <p>Pricing</p>
              </Link>
            </li>
            <li>
              <Link href="/movies">
                <p>movies</p>
              </Link>
            </li>
            <li>
              <Link href="/favorites">
                <p>Favorites</p>
              </Link>
            </li>
            <li>
              <Link href="/account">
                <p>Account</p>
              </Link>
            </li>
            <li>
              <Button
                classes={styles.search}
                onClick={() => setShowSearch(true)}
                icon={<IoIosSearch />}
              />
            </li>
          </ul>
        </div>

        <div className={styles.section_two}>
          <CustomButton
            label={'logout'}
            classes="full-size"
            icon="pi-sign-out"
            onclick={() => {
              logout();
            }}
          />
        </div>

        {showSearch && <SearchBar onClose={() => setShowSearch(false)} />}
      </nav>
    )
  );
};

export default index;
