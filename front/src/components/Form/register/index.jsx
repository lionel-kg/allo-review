import React, {useState} from 'react';
import styles from './index.module.scss';
import Input from '@/components/Input';
import {apiAuth} from '@/config/axios';
import {useRouter} from 'next/router';
import CustomButton from '@/components/CustomButton';
import {redirect} from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import options from '@/services/Cookies';

const index = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const ssoLogin = service => {
    if (service === 'google') {
      router.replace(`${process.env.AUTH_API_BASE_URL}/auth/google`);
    } else if (service === 'github') {
      router.replace(`${process.env.AUTH_API_BASE_URL}/auth/github`);
    } else if (service === 'discord') {
      router.replace(`${process.env.AUTH_API_BASE_URL}/auth/discord`);
    }
  };

  const submit = () => {
    apiAuth
      .post('/auth/register', {
        username: username,
        email: email,
        password: password,
      })
      .then(user => {
        Cookies.set('jwt', user.data.token, options);
        router.push('/movies');
      });
  };

  return (
    <div className={'container_page_form'}>
      <div className={styles.container_form}>
        <div className="flex justify_center ">
          <Image src="/logo.png" alt="logo" width={250} height={160} />
        </div>
        <div className={styles.container_input}>
          <Input
            label="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <Input
            label="Email"
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div className="p-2">
          <CustomButton
            label="Valider"
            classes="full-size"
            onclick={() => {
              submit();
            }}
          />
        </div>
        <div className={styles.container_ssolog + ' justify_between p-2'}>
          <div>
            <i
              className="pi pi-google pointer"
              onClick={() => ssoLogin('google')}></i>
            <i
              className="pi pi-github pointer"
              onClick={() => ssoLogin('github')}></i>
            <i
              className="pi pi-discord pointer"
              onClick={() => ssoLogin('discord')}></i>
          </div>
          <div className="center_vertical">
            <Link href="/login">Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
