import React, {useState} from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';

import {apiAuth} from '@/config/axios';

import {IoIosSearch} from 'react-icons/io';
import {BsStars} from 'react-icons/bs';

import CustomButton from '@/components/CustomButton';
import Button from '@/components/Button';
import SearchBar from '@/components/SearchBar';
import Recommendations from '@/components/Recommendations';
import styles from './index.module.scss';
import options from '@/services/Cookies';
import {useUser} from '@/context/UserContext';

const index = () => {
  const {user, token, setUser, setToken} = useUser();
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const logout = () => {
    apiAuth
      .get('/auth/logout')
      .then(user => {})
      .finally(() => {
        Cookies.remove('jwt', options);
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        router.push('/login');
      });
  };

  const login = () => {
    router.push('/login');
  };

  return (
    router.asPath !== '/register' &&
    router.asPath !== '/reset-password' && (
      <nav className={styles.container_header}>
        <div className={styles.section_one}>
          <Link href="/">
            <p>
              <Image
                className={styles.logo_img}
                src="/logo-alloreview.png"
                alt="logo"
                width={120}
                height={80}
              />
            </p>
          </Link>
          {router.asPath !== '/login' && (
            <ul>
              <li>
                <Button
                  classes={styles.search}
                  onClick={() => setShowSearch(true)}
                  icon={<IoIosSearch />}
                />
              </li>
              <li>
                <Link href="/pricing">
                  <p>Pricing</p>
                </Link>
              </li>
              {user && (
                <>
                  <li className={styles.favorites}>
                    <Link href="/favorites">
                      <p>Favorites</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/account">
                      <p>Account</p>
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Button
                  onClick={() => setShowRecommendations(true)}
                  icon={<BsStars />}
                  classes={`${styles.recommendation} ${styles.desktop}`}
                  text="Find a movie"
                />
                <Button
                  onClick={() => setShowRecommendations(true)}
                  icon={<BsStars />}
                  classes={`${styles.recommendation} ${styles.mobile}`}
                />
              </li>
            </ul>
          )}
        </div>

        {user ? (
          <div className={user ? styles.logo : '' + 'pr-1'}>
            <CustomButton
              label={'logout'}
              classes="full-size"
              icon="pi-sign-out"
              onclick={() => {
                logout();
              }}
            />
          </div>
        ) : (
          <div className={user ? styles.logo : '' + 'pr-1'}>
            <CustomButton
              label={'login'}
              classes="full-size"
              icon="pi-sign-in"
              onclick={() => {
                login();
              }}
            />
          </div>
        )}

        {showSearch && <SearchBar onClose={() => setShowSearch(false)} />}
        {showRecommendations && (
          <Recommendations onClose={() => setShowRecommendations(false)} />
        )}
      </nav>
    )
  );
};

export default index;
