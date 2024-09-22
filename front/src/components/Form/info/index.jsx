import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import Input from '@/components/Input';
import {apiAuth, apiBdd} from '@/config/axios';
import {useRouter} from 'next/router';
import CustomButton from '@/components/CustomButton';
import Logo from '@/../public/logo-alloreview.png';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import options from '@/services/Cookies';
import {useUser} from '@/context/UserContext';

const index = props => {
  const {action} = props;
  const {user, token, setUser} = useUser();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();

  const submit = () => {
    apiBdd
      .put('/user/' + user.id, {
        email: email,
        username: username,
      })
      .then(res => {
        setUser(res.data);
        action();
      });
  };

  useEffect(() => {
    setEmail(user.email);
    setUsername(user.username);
    return () => {};
  }, [user]);

  return (
    <div className={styles.container_form}>
      <div className="flex justify_center ">
        <Image src="/logo-alloreview.png" alt="logo" width={250} height={160} />
      </div>
      <div className={styles.container_input}>
        <Input
          label="Email"
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Input
          label="Username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
      </div>
      <div className="p-2">
        <CustomButton
          label="Continue"
          classes="full-size"
          onclick={() => {
            submit();
          }}
        />
      </div>
    </div>
  );
};

export default index;
