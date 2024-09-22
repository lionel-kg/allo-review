import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import {apiAuth} from '@/config/axios';
import Button from '@/components/Account/Button';
import styles from './index.module.scss';
import {useRouter} from 'next/router';
import {IoHome} from 'react-icons/io5';
import {
  MdOutlineSecurity,
  MdFavoriteBorder,
  MdOutlinePlaylistPlay,
} from 'react-icons/md';
import {CiCreditCard1} from 'react-icons/ci';
import options from '@/services/Cookies';
import {useUser} from '@/context/UserContext';

const Index = () => {
  const {user, token, setUser, setToken} = useUser();
  const router = useRouter();

  const logout = () => {
    console.log('logout');
    apiAuth
      .get('/auth/logout')
      .then(user => {
        console.log(user);
        Cookies.remove('jwt', options);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      })
      .finally(() => {
        router.push('/login');
      });
  };

  const navItems = [
    {text: 'Présentation', path: '/account', icon: <IoHome />},
    {
      text: 'Subscription',
      path: '/account/membership',
      icon: <CiCreditCard1 />,
    },
    {
      text: 'Informations',
      path: '/account/informations',
      icon: <MdOutlineSecurity />,
    },
    {
      text: 'My likes',
      path: '/favorites',
      icon: <MdFavoriteBorder />,
    },
    {
      text: 'My recommendations',
      path: '/recommendations',
      icon: <MdOutlinePlaylistPlay />,
    },
  ];

  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Button
            text={"Retour à l'accueil"}
            onClick={() => router.push('/')}
          />
        </li>
        {navItems.map(item => (
          <li
            key={item.text}
            className={router.pathname === item.path ? styles.active : ''}>
            <Button
              text={item.text}
              onClick={() => router.push(item.path)}
              icon={item.icon}
            />
          </li>
        ))}
        <li>
          <Button
            text={'Se déconnecter'}
            onClick={() => {
              logout();
            }}
          />
        </li>
      </ul>
    </nav>
  );
};
export default Index;
