import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import {apiAuth} from '@/config/axios';
import Button from '@/components/Account/Button';
import styles from './index.module.scss';
import {useRouter} from 'next/router';
import {IoSettingsOutline, IoHome} from 'react-icons/io5';
import {MdOutlineSecurity} from 'react-icons/md';
import {CiCreditCard1} from 'react-icons/ci';
import options from '@/services/Cookies';

const Index = () => {
  const router = useRouter();

  const logout = () => {
    console.log('logout');
    apiAuth
      .get('/auth/logout')
      .then(user => {
        console.log(user);
        Cookies.remove('jwt', options);
        localStorage.removeItem('token');
      })
      .finally(() => {
        router.push('/login');
      });
  };

  const navItems = [
    {text: 'Présentation', path: '/account', icon: <IoHome />},
    {
      text: 'Abonnement',
      path: '/account/membership',
      icon: <CiCreditCard1 />,
    },
    {
      text: 'Informations',
      path: '/account/informations',
      icon: <MdOutlineSecurity />,
    },
    {
      text: 'Paramètres',
      path: '/account/parameters',
      icon: <IoSettingsOutline />,
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
